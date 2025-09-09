const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i));
}

const setNegative = (text) =>{
    return parseFloat(text)*-1
}

const getData = (data, args) => {
    let response = []
    let responseData = []
    let errors = []
    let initialRow
    let dateColumn
    let descriptionColumn
    let valueColumn
    let t_acountColumn

    if('date' in args && 'description' in args && 'value' in args){
        'rowStart' in args ?  initialRow = (args.rowStart) - 1 : errors.push({status:true, msg:errCode.rowStart})
        'rowLimit' in args ?  '' : errors.push({status:true, msg:errCode.rowLimit})

        'column' in args.date ?  dateColumn = cols.indexOf(args.date.column) : errors.push({status:true, msg:errCode.date.column})
        'column' in args.description ?  descriptionColumn = cols.indexOf(args.description.column) : errors.push({status:true, msg:errCode.description.column})
        'column' in args.value ?  valueColumn = cols.indexOf(args.value.column) : errors.push({status:true, msg:errCode.value.column})
        't_acount' in args.value ? t_acountColumn = cols.indexOf(args.value.t_acount) : ''
    }

    if (errors.length > 0) {
        response = {status:false, data:errors}
        console.log("Han ocurrido uno o mas errores")
    }else{
        let counter = 0
        let yearSetter = ''
        let valueData
        let dateData
        let dataState

        data.forEach(dataRows => {
            if(counter >= initialRow){
                dataState = true
                if ('t_acount' in args.value) {
                    const valueFromValueColumn = parseFloat(dataRows[valueColumn]);
                    const valueFromT_acountColumn = parseFloat(dataRows[t_acountColumn]);

                    if (isNaN(valueFromValueColumn) || valueFromValueColumn === 0) {
                        valueData = valueFromT_acountColumn;
                    } else {
                        valueData = valueFromValueColumn;
                    }
                } else {
                    valueData = parseFloat(dataRows[valueColumn]);
                }

                if (dataRows[valueColumn] == 0 || dataRows[valueColumn] == null && dataRows[t_acountColumn] !== 0) {
                    valueData = setNegative(dataRows[t_acountColumn]);
                } else {
                    valueData = parseFloat(dataRows[valueColumn]);
                }

                if ('readByRegex' in args.date) {

                    'setYear' in args.date ? yearSetter = '/' + args.date.setYear : yearSetter = ''

                    if (args.date.readByRegex.test(dataRows[dateColumn])) {
                        dateData = dataRows[dateColumn] + yearSetter
                    }else{
                        dataState = false
                    }
                }else{
                    dateData = dataRows[dateColumn]
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
        });
        response = {status:true,data:responseData}
    }
    return response
}