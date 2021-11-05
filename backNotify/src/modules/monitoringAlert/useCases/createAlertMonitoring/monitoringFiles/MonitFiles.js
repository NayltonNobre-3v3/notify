import MomentProvider from '../../../../../shared/container/provider/DateProvider/MomentProvider'
import {off_range_files,addToRange,removeFromRange,verifyOffRangeFiles} from '../../../../../shared/utils/monitoring_api/functions'


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