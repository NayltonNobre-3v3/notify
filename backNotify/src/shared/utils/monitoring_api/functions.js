import MomentProvider from '../../container/provider/DateProvider/MomentProvider'
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

export{
    off_range_files,
    addToRange,
    removeFromRange,
    verifyOffRangeFiles

}