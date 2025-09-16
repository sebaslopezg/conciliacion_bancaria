//const cols = [];
//for (let i = 65; i <= 90; i++) {
//  cols.push(String.fromCharCode(i))
//}

const cols = generateExcelColumns(200)

const setNegative = (text) =>{
    return parseFloat(text)*-1
}

//Acceptar en argumentos, ignorar celdas vacias en columnas seleccionadas
const getData = (data, args) => {
    let response = []
    let responseData = []
    let errors = []
    let initialRow
    let dateColumn
    let dateNulls
    let descriptionColumn
    let descriptionNulls
    let valueColumn
    let valueNulls
    let t_acountColumn
    let t_acountNulls

    //Condicionales

    if('date' in args && 'description' in args && 'value' in args){

        if ('rowStart' in args) {
            initialRow = (args.rowStart) - 1
        }else{
            errors.push({
                status:false, 
                msg:errCode.rowStart
            })
        }

        if ('rowLimit' in args) {

        }else{
            errors.push({
                status:false, 
                msg:errCode.rowLimit
            })
        }

        if ('column' in args.date) {
            dateColumn = cols.indexOf(args.date.column)
        }else{
            errors.push({
                status:false, 
                msg:errCode.date.column
            })
        }

        if ('nulls' in args.date) {
            dateNulls = args.date.nulls
        }else{
            errors.push({
                status:false, 
                msg:errCode.date.nulls
            })
        }

        if ('column' in args.description) {
           descriptionColumn = cols.indexOf(args.description.column) 
        }else{
            errors.push({
                status:false, 
                msg:errCode.description.column
            })
        }

        if ('nulls' in args.description) {
            descriptionNulls = args.description.nulls
        }else{
            errors.push({
                status:false, 
                msg:errCode.description.nulls
            })
        }

        if ('t_acount' in args.value) {
            if ('credit' in args.value.t_acount) {
                if ('column' in args.value.t_acount.credit) {
                    valueColumn = cols.indexOf(args.value.t_acount.credit.column)
                }else{
                    errors.push({
                        status:false, 
                        msg:errCode.value.t_acount.credit
                    })
                } 
                if ('nulls' in args.value.t_acount.credit) {
                    valueNulls = args.value.t_acount.credit.nulls
                }else{
                    errors.push({
                        status:false, 
                        msg:errCode.value.t_acount.credit.nulls
                    })
                } 
            }
            if ('debit' in args.value.t_acount) {
                if ('column' in args.value.t_acount.debit) {
                    t_acountColumn = cols.indexOf(args.value.t_acount.debit.column)
                }else{
                    errors.push({
                        status:false, 
                        msg:errCode.value.t_acount.debit
                    })
                }
                if ('nulls' in args.value.t_acount.debit) {
                    t_acountNulls = args.value.t_acount.debit.nulls
                }else{
                    errors.push({
                        status:false, 
                        msg:errCode.value.t_acount.debit.nulls
                    })
                }
            }
        }else{
            if ('column' in args.value) {
                valueColumn = cols.indexOf(args.value.column)
            }else{
                errors.push({
                    status:false, 
                    msg:errCode.value.column
                })
            }
            if ('nulls' in args.value) {
                valueNulls = args.value.nulls
            }else{
                errors.push({
                    status:false, 
                    msg:errCode.value.nulls
                })
            }
        }
    } //poner un elese aqui

    //Inicio de extraccion de datos

    if (errors.length > 0) {
        response = {status:false, data:errors}
    }else{
        let counter = 0
        let yearSetter = ''
        let valueData
        let dateData
        let dataState

        data.forEach(dataRows => {
            if(counter >= initialRow){
                dataState = true

                if (dataRows[dateColumn] == undefined ||dataRows[dateColumn] == null && dateNulls == true) {
                    dataState = false
                }
                
                if (dataRows[descriptionColumn] == undefined || dataRows[descriptionColumn] == null && descriptionNulls == true) {
                    dataState = false
                }

                if (dataRows[valueColumn] == undefined || dataRows[valueColumn] == null && valueNulls == true) {
                    dataState = false
                }

                if ('t_acount' in args.value){
                    if (dataRows[valueColumn] == undefined || dataRows[valueColumn] == null && t_acountNulls == true) {
                        dataState = false
                    }
                    const valueFromValueColumn = parseFloat(dataRows[valueColumn])
                    const valueFromT_acountColumn = parseFloat(dataRows[t_acountColumn])

                    if (isNaN(valueFromValueColumn) || valueFromValueColumn === 0) {
                        valueData = valueFromT_acountColumn
                    } else {
                        valueData = valueFromValueColumn
                    }
                } else {
                    valueData = parseFloat(dataRows[valueColumn])
                }

                if (dataRows[valueColumn] == 0 || dataRows[valueColumn] == null && dataRows[t_acountColumn] !== 0) {
                    valueData = setNegative(dataRows[t_acountColumn])
                } else {
                    valueData = parseFloat(dataRows[valueColumn])
                }

                if ('readByRegex' in args.date) {
                    let regex
                    try {
                        regex = defaultRegex[args.date.readByRegex].regex
                        'setYear' in args.date && args.date.setYear === true ? yearSetter = '/' + courrentYearInput.value : yearSetter = ''

                        if (regex.test(dataRows[dateColumn])) {
                            dateData = dataRows[dateColumn] + yearSetter
                        }else{
                            dataState = false
                        }
                    } catch (error) {
                        errors.push({status:false,msg:errCode.date.regex})
                    }
                }else{
                    dateData = dataRows[dateColumn]
                }

                if (dataState && isNaN(valueData)){
                    errors.push({
                        status:false,
                        msg:errCode.value.notANumber + ` | Intentando leer Celda: ${args.value.column+(counter+1)}`
                    })
                }

                if (dataState) {                    
                    responseData.push({
                        date:dateData,
                        descripcion:dataRows[descriptionColumn],
                        value:valueData
                    })
                }
            }
            counter++
        })
        if (errors.length > 0) {
            response = {status:false, data:errors}
        }else{
            response = {status:true,data:responseData}
        }
    }
    console.log(responseData)
    return response
}


function getExcelColumnName(colIndex) {
    let name = "";
    while (colIndex > 0) {
        let remainder = (colIndex - 1) % 26;
        name = String.fromCharCode(65 + remainder) + name;
        colIndex = Math.floor((colIndex - 1) / 26);
    }
    return name;
}

function generateExcelColumns(limit = 200) {
    const cols = [];
    for (let i = 1; i <= limit; i++) {
        cols.push(getExcelColumnName(i));
    }
    return cols;
}
