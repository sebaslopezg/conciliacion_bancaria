const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i))
}

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

    if('date' in args && 'description' in args && 'value' in args){
        'rowStart' in args ?  initialRow = (args.rowStart) - 1 : errors.push({status:false, msg:errCode.rowStart})
        'rowLimit' in args ?  '' : errors.push({status:false, msg:errCode.rowLimit})

        'column' in args.date ?  dateColumn = cols.indexOf(args.date.column) : errors.push({status:false, msg:errCode.date.column})
        'nulls' in args.date ?  dateNulls = args.date.column.nulls : errors.push({status:false, msg:errCode.date.nulls})
        'column' in args.description ?  descriptionColumn = cols.indexOf(args.description.column) : errors.push({status:false, msg:errCode.description.column})
        'nulls' in args.description ?  descriptionNulls = args.description.nulls : errors.push({status:false, msg:errCode.description.nulls})

        if ('t_acount' in args.value) {
            if ('credit' in args.value.t_acount) {
                'column' in args.value.t_acount.credit ? valueColumn = cols.indexOf(args.value.t_acount.credit.column) : errors.push({status:false, msg:errCode.value.t_acount.credit})
                'nulls' in args.value.t_acount.credit ? valueNulls = args.value.t_acount.credit.nulls : errors.push({status:false, msg:errCode.value.t_acount.credit.nulls})
            }
            if ('debit' in args.value.t_acount) {
                'column' in args.value.t_acount.debit ? t_acountColumn = cols.indexOf(args.value.t_acount.debit.column) : errors.push({status:false, msg:errCode.value.t_acount.debit})
                'nulls' in args.value.t_acount.debit ? t_acountNulls = args.value.t_acount.debit.nulls : errors.push({status:false, msg:errCode.value.t_acount.debit.nulls})
            }
        }else{
            'column' in args.value ?  valueColumn = cols.indexOf(args.value.column) : errors.push({status:false, msg:errCode.value.column})
            'nulls' in args.value ? valueNulls = args.value.nulls : errors.push({status:false, msg:errCode.value.nulls})
        }
    } //poner un elese aqui

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

                if ('t_acount' in args.value){
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

                if (isNaN(valueData)){
                    errors.push({status:false,msg:errCode.value.notANumber + ` | Intentando leer Celda: ${args.value.column+(counter+1)}`})
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