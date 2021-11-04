import MomentProvider from '../../../../../shared/container/provider/DateProvider/MomentProvider'
// Array momentâneo no qual irá guardar os dados que estão na condição especificada
let off_range_files = [];

function addToRange(data) {
    off_range_files.push(data);
}

function removeFromRange(include) {
    let file = off_range_files[include];
    // if (include >= 0 && file.SEND_EMAIL === true) {
    //     const filteredItems = off_range_files.filter((item) => {
    //         return item.ID !== file.ID;
    //     });
    //     off_range_files = filteredItems;
    // }
    const filteredItems = off_range_files.filter((item) => {
        return item.ID !== file.ID;
    });
    off_range_files = filteredItems;
}
function updateOffRangeFiles(file, alert) {
    const file_off=off_range_files.find(off=>off.ID==alert.ID)
    if(file_off.TYPE==='sns'){
        file_off.VALUE_JSON=file.VALUE[alert.POSITION]
        return
    }
    if(file_off.TYPE==='dir'){
        if(file_off.MEDITION_TYPE==="STATUS"){
            file_off.VALUE_JSON=file.RF.stat
            return
        }
         //SE FOR ACK
        /*if(file_off.MEDITION_TYPE === 'ACK'){
            return 
        }*/
        file_off.VALUE_JSON=file[alert.MEDITION_TYPE]
        return
        
    }
    if(file_off.TYPE==='mtd'){
        if(file_off.MEDITION_TYPE==="STATUS"){
            file_off.VALUE_JSON=file.RF.stat
            return
        }
         //SE FOR ACK
        /*if(file_off.MEDITION_TYPE === 'ACK'){
            return 
        }*/
        file_off.VALUE_JSON=file[alert.MEDITION_TYPE]
        return
    }
    if(file_off.TYPE==='eqp'){
        file_off.VALUE_JSON=file[alert.MEDITION_TYPE]
        return

    }
    
}
async function verifyOffRangeFiles(repeatItem, alert, current_date, file) {
    let file_off_range = off_range_files[repeatItem];
    
    // Calcula a variação de tempo (minutos) em que o arquivo está acima ou abaixo da condição
    // estabelecida pelo o usuário
    let variation = MomentProvider.compareInMinutes(
        current_date,
        file_off_range.OFF_RANGE_DATE
    );
    // console.log('OFF RANGE FILES -> ',off_range_files);
    // console.log(`VARIATION do ${alert.ID} -> ${variation}`);

    // Se a variação do tempo do arquivo que está na condição  estabelecida para o alarme
    //for maior do que o tempo especificado no banco
    if (variation > file_off_range.TIME_ALERT) {
        if (file_off_range.SEND_EMAIL === false) {
            // await MailProvider.sendMail({
            //     to: file_off_range.EMAIL,
            //     subject: "Alertas da 3v3",
            //     template_path,
            //     context: {
            //         file_name: file.NAME,
            //         condition: file_off_range.CONDITION,
            //         value: file_off_range.VALUE,
            //         medition_type: file_off_range.MEDITION_TYPE,
            //         value_json: file_off_range.VALUE_JSON,
            //         unit: file_off_range.UNIT,
            //         start: MomentProvider.convertToTz(file_off_range.OFF_RANGE_DATE),
            //         end: MomentProvider.convertToTz(current_date),
            //     },
            // })

            console.log(`----- EMAIL ---------- `, {
                file_name: alert.TYPE!=="dir" && alert.TYPE!=="mtd" ? file.NAME:`DIR-${file['ID']}`,
                condition: file_off_range.CONDITION,
                value: file_off_range.VALUE,
                medition_type: file_off_range.MEDITION_TYPE,
                value_json: file_off_range.VALUE_JSON,
                start: MomentProvider.convertToTz(file_off_range.OFF_RANGE_DATE),
                end: MomentProvider.convertToTz(current_date),
            });

            // Marca que enviou o email
            file_off_range.SEND_EMAIL = true;

            console.log(
                `CONDIÇÃO: ${file_off_range.CONDITION}, EMAIL ENVIADO PARA -> ${file_off_range.EMAIL}`
            );
            console.log(file_off_range);
        }
    }
    // Se já existir e o valor do json for alterado (atualizado) irá atualizar o VALUE do array off_range_files
    updateOffRangeFiles(file, alert);
}

// file -> Arquivo lido do json
//alert-> alerta do banco de dados
class MonitSns {
    async startMonitoring(monit_files, alert, current_date) {
        this.alert = alert;
        this.current_date = current_date;
        this.file = monit_files["sns"].find((file) => {
            return file.ID === Number(this.alert.ID_REF);
        });

        if (!this.file) {
            console.log(`[ERROR] - Não foi possível encontrar o sensor com o ID=${this.alert.ID_REF} igual ao do alerta`);
            return;
        }

        switch (this.alert.CONDITION) {
            case "ACIMA":
                await this.up();
                break;
            case "ABAIXO":
                await this.down();
                break;
            default:
                break;
        }
    }
    async up() {
        let include = null;
        // Arquivo com valor específico acima do que está no banco
        if (this.file.VALUE[this.alert.POSITION] > this.alert.VALUE) {
            // índice do arquivo que está na condição para ser monitorado e alertado
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_RED,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    //Se foi enviado o e-mail ou não
                    SEND_EMAIL: false,
                    //Registra o tempo que chegou na condição
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    //   VALOR ATUAL DO SENSOR
                    VALUE_JSON: this.file.VALUE[this.alert.POSITION],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    TIME_ALERT: this.alert.TIME,
                    POSITION: this.alert.POSITION,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            }
            // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
            else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        }

        //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_files
        // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
        else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
    async down() {
        let include = null;
        if (this.file.VALUE[this.alert.POSITION] < this.alert.VALUE) {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    SEND_EMAIL: false,
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    VALUE_JSON: this.file.VALUE[this.alert.POSITION],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    TIME_ALERT: this.alert.TIME,
                    POSITION: this.alert.POSITION,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            } else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        } else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
}
class MonitDir {
    async startMonitoring(monit_files, alert, current_date) {
        this.alert = alert;
        this.current_date = current_date;
        // console.log(monit_files["dir"])
        this.file = monit_files["dir"].find((file) => {
            return file.ID === this.alert.ID_REF;
        });

        if (!this.file) {
            console.log(`[ERROR] - Não foi possível encontrar o dispositivo com o ID=${this.alert.ID_REF} igual ao do alerta`);
            return;
        }
        switch (this.alert.CONDITION) {
            case "ACIMA":
                await this.up();
                break;
            case "ABAIXO":
                await this.down();
                break;
            default:
                break;
        }
    }
    async up() {
        let include = null;

        if (this.alert.MEDITION_TYPE === "STATUS") {
            if (this.file.RF.stat > this.alert.VALUE) {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include < 0) {
                    addToRange({
                        ID: this.alert.ID,
                        ID_REF: this.alert.ID_REF,
                        TYPE: this.alert.TYPE,
                        CONDITION: this.alert.CONDITION,
                        //Se foi enviado o e-mail ou não
                        SEND_EMAIL: false,
                        //Registra o tempo que chegou na condição
                        OFF_RANGE_DATE: this.current_date,
                        VALUE: this.alert.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: this.file.RF.stat,
                        MEDITION_TYPE: this.alert.MEDITION_TYPE,
                        // UNIT: alert.UNIT,
                        TIME_ALERT: this.alert.TIME,
                        POSITION: null,
                        EMAIL: this.alert.EMAIL,
                        NAME: this.alert.NAME,
                        CREATED_ALERT: this.alert.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
                else if (include >= 0) {
                    verifyOffRangeFiles(
                        include,
                        this.alert,
                        this.current_date,
                        this.file
                    );
                }
            }
            else {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include >= 0) {
                    removeFromRange(include);
                }
            }

            return
        }
        if (this.alert.MEDITION_TYPE === "ACK") {
            //IMPLEMENTAR LÓGICA DE MONITORAR ACK   
            return
        }

        
        // Arquivo com valor específico acima do que está no banco
        if (this.file[this.alert.MEDITION_TYPE] > this.alert.VALUE) {
            // índice do arquivo que está na condição para ser monitorado e alertado
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    //Se foi enviado o e-mail ou não
                    SEND_EMAIL: false,
                    //Registra o tempo que chegou na condição
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    //   VALOR ATUAL DO SENSOR
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    TIME_ALERT: this.alert.TIME,
                    // POSITION: alert.POSITION,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            }
            // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
            else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        }

        //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_files
        // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
        else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
    async down() {
        
        let include = null;
        if (this.alert.MEDITION_TYPE === "STATUS") {
            if (this.file.RF.stat < this.alert.VALUE) {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                
                if (include < 0) {
                    addToRange({
                        ID: this.alert.ID,
                        ID_REF: this.alert.ID_REF,
                        TYPE: this.alert.TYPE,
                        CONDITION: this.alert.CONDITION,
                        //Se foi enviado o e-mail ou não
                        SEND_EMAIL: false,
                        //Registra o tempo que chegou na condição
                        OFF_RANGE_DATE: this.current_date,
                        VALUE: this.alert.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: this.file.RF.stat,
                        MEDITION_TYPE: this.alert.MEDITION_TYPE,
                        // UNIT: alert.UNIT,
                        TIME_ALERT: this.alert.TIME,
                        // POSITION: alert.POSITION,
                        EMAIL: this.alert.EMAIL,
                        NAME: this.alert.NAME,
                        CREATED_ALERT: this.alert.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
                else if (include >= 0) {
                    verifyOffRangeFiles(
                        include,
                        this.alert,
                        this.current_date,
                        this.file
                    );
                }
            }
            else {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include >= 0) {
                    removeFromRange(include);
                }
            }

            return
        }

        if (this.alert.MEDITION_TYPE === "ACK") {
            //IMPLEMENTAR LÓGICA DE MONITORAR ACK   
            return
        }
        if (this.file[this.alert.MEDITION_TYPE] < this.alert.VALUE) {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    SEND_EMAIL: false,
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    // UNIT: alert.UNIT,
                    TIME_ALERT: this.alert.TIME,
                    POSITION: null,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            } else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        } else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
}
class MonitMtd {
    async startMonitoring(monit_files, alert, current_date) {
        this.alert = alert;
        this.current_date = current_date;
        this.file = monit_files["mtd"].find((file) => {
            return file.ID === this.alert.ID_REF;
        });

        if (!this.file) {
            console.log(`[ERROR] - Não foi possível encontrar o dispositivo MTD com o ID=${this.alert.ID_REF} igual ao do alerta`);
            return;
        }

        switch (this.alert.CONDITION) {
            case "ACIMA":
                await this.up();
                break;
            case "ABAIXO":
                await this.down();
                break;
            default:
                break;
        }
    }
    async up() {
        let include = null;

        if (this.alert.MEDITION_TYPE === "STATUS") {
            if (this.file.RF.stat > this.alert.VALUE) {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include < 0) {
                    addToRange({
                        ID: this.alert.ID,
                        ID_REF: this.alert.ID_REF,
                        TYPE: this.alert.TYPE,
                        CONDITION: this.alert.CONDITION,
                        //Se foi enviado o e-mail ou não
                        SEND_EMAIL: false,
                        //Registra o tempo que chegou na condição
                        OFF_RANGE_DATE: this.current_date,
                        VALUE: this.alert.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: this.file.RF.stat,
                        MEDITION_TYPE: this.alert.MEDITION_TYPE,
                        // UNIT: alert.UNIT,
                        TIME_ALERT: this.alert.TIME,
                        // POSITION: alert.POSITION,
                        EMAIL: this.alert.EMAIL,
                        NAME: this.alert.NAME,
                        CREATED_ALERT: this.alert.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
                else if (include >= 0) {
                    verifyOffRangeFiles(
                        include,
                        this.alert,
                        this.current_date,
                        this.file
                    );
                }
            }
            else {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include >= 0) {
                    removeFromRange(include);
                }
            }

            return
        }
        if (this.alert.MEDITION_TYPE === "ACK") {
            //IMPLEMENTAR LÓGICA DE MONITORAR ACK   
            return
        }


        // Arquivo com valor específico acima do que está no banco
        if (this.file[this.alert.MEDITION_TYPE] > this.alert.VALUE) {
            // índice do arquivo que está na condição para ser monitorado e alertado
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    //Se foi enviado o e-mail ou não
                    SEND_EMAIL: false,
                    //Registra o tempo que chegou na condição
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    //   VALOR ATUAL DO SENSOR
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    TIME_ALERT: this.alert.TIME,
                    // POSITION: alert.POSITION,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            }
            // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
            else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        }

        //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_files
        // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
        else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
    async down() {
        let include = null;

        if (this.alert.MEDITION_TYPE === "STATUS") {
            if (this.file.RF.stat < this.alert.VALUE) {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include < 0) {
                    addToRange({
                        ID: this.alert.ID,
                        ID_REF: this.alert.ID_REF,
                        TYPE: this.alert.TYPE,
                        CONDITION: this.alert.CONDITION,
                        //Se foi enviado o e-mail ou não
                        SEND_EMAIL: false,
                        //Registra o tempo que chegou na condição
                        OFF_RANGE_DATE: this.current_date,
                        VALUE: this.alert.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: this.file.RF.stat,
                        MEDITION_TYPE: this.alert.MEDITION_TYPE,
                        // UNIT: alert.UNIT,
                        TIME_ALERT: this.alert.TIME,
                        // POSITION: alert.POSITION,
                        EMAIL: this.alert.EMAIL,
                        NAME: this.alert.NAME,
                        CREATED_ALERT: this.alert.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
                else if (include >= 0) {
                    verifyOffRangeFiles(
                        include,
                        this.alert,
                        this.current_date,
                        this.file
                    );
                }
            }
            else {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === this.alert.ID;
                });
                if (include >= 0) {
                    removeFromRange(include);
                }
            }

            return
        }

        if (this.alert.MEDITION_TYPE === "ACK") {
            //IMPLEMENTAR LÓGICA DE MONITORAR ACK   
            return
        }

        if (this.file[this.alert.MEDITION_TYPE] < this.alert.VALUE) {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    SEND_EMAIL: false,
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    // UNIT: alert.UNIT,
                    TIME_ALERT: this.alert.TIME,
                    // POSITION: alert.POSITION,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            } else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        } else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }
    }
}

class MonitEqp {
    async startMonitoring(monit_files, alert, current_date) {
        this.alert = alert;
        this.current_date = current_date;
        this.file = monit_files[this.alert.TYPE].find((file) => {
            return file.ID === this.alert.ID_REF;
        });

        if (!this.file) {
            console.log(`[ERROR] - Não foi possível encontrar o equipamento com o ID=${this.alert.ID_REF} igual ao do alerta`);
            return;
        }

        //Se o alerta for para FLOW, então tem que existir o campo HYDRO no json
        if (this.alert.MEDITION_TYPE == "FLOW" && !this.file["HYDRO"]) {
            console.log('[ERROR] - Não é possível monitorar FLOW em equipamentos sem HYDRO!')
            return
        }

        switch (this.alert.CONDITION) {
            case "ACIMA":
                await this.up();
                break;
            case "ABAIXO":
                await this.down();
                break;
            default:
                break;
        }
    }
    async up() {
        let include = null;

        // Arquivo com valor específico acima do que está no banco
        if (this.file[this.alert.MEDITION_TYPE] > this.alert.VALUE) {
            // índice do arquivo que está na condição para ser monitorado e alertado
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    //Se foi enviado o e-mail ou não
                    SEND_EMAIL: false,
                    //Registra o tempo que chegou na condição
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    //   VALOR ATUAL DO SENSOR
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    TIME_ALERT: this.alert.TIME,
                    POSITION: null,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            }
            // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
            else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        }

        //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_files
        // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
        else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }

    }
    async down() {
        let include = null;
        if (this.file[this.alert.MEDITION_TYPE] < this.alert.VALUE) {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include < 0) {
                addToRange({
                    ID: this.alert.ID,
                    ID_REF: this.alert.ID_REF,
                    TYPE: this.alert.TYPE,
                    CONDITION: this.alert.CONDITION,
                    SEND_EMAIL: false,
                    OFF_RANGE_DATE: this.current_date,
                    VALUE: this.alert.VALUE,
                    VALUE_JSON: this.file[this.alert.MEDITION_TYPE],
                    MEDITION_TYPE: this.alert.MEDITION_TYPE,
                    // UNIT: alert.UNIT,
                    TIME_ALERT: this.alert.TIME,
                    POSITION: null,
                    EMAIL: this.alert.EMAIL,
                    NAME: this.alert.NAME,
                    CREATED_ALERT: this.alert.CREATED_AT,
                });
            } else if (include >= 0) {
                verifyOffRangeFiles(include, this.alert, this.current_date, this.file);
            }
        } else {
            include = off_range_files.findIndex((off_range) => {
                return off_range.ID === this.alert.ID;
            });
            if (include >= 0) {
                removeFromRange(include);
            }
        }

    }
}


const monitoring={
    Sensor:new MonitSns(),
    Dir:new MonitDir(),
    Eqp:new MonitEqp(),
    Mtd:new MonitMtd()
}
export{monitoring}