const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i));
}

const setNegative = (text) =>{
    return parseFloat(text)*-1
}

const getData = (data, args) => {

    let response = []
    let errors = []
    let initialRow
    let dateColumn
    let descriptionColumn
    let valueColumn
    let t_acountColumn

    if('date' in args && 'description' in args && 'value' in args){

        'rowStart' in args ?  initialRow = (args.rowStart) - 1 : errors.push({status:true, msg:errMsg.value.rowStart})
        'rowLimit' in args ?  '' : errors.push({status:true, msg:errMsg.value.rowLimit})

        'column' in args.date ?  dateColumn = cols.indexOf(args.date.column) : errors.push({status:true, msg:errMsg.date.column})
        'column' in args.description ?  descriptionColumn = cols.indexOf(args.description.column) : errors.push({status:true, msg:errMsg.description.column})
        'column' in args.value ?  valueColumn = cols.indexOf(args.value.column) : errors.push({status:true, msg:errMsg.value.column})
        't_acount' in args.value ? t_acountColumn = cols.indexOf(args.value.t_acount) : ''
    }

    if (errors.length > 0) {
        response = {error:errors}
        console.log(response)
    }else{
        let counter = 0
        let yearSetter = ''
        let valueData
        data.forEach(dataRows => {
            if(counter >= initialRow){

                't_acount' in args.value ? (
                    dataRows[valueColumn] == 0 || dataRows[valueColumn] == null ? valueData = setNegative(dataRows[t_acountColumn]) : ''
                ) : valueData = dataRows[valueColumn],

                'readByRegex' in args.date ? (
                    'setYear' in args.date ? yearSetter = '/' + args.date.setYear : '',
                    args.date.readByRegex.test(dataRows[dateColumn]) ? (
                        response.push({
                            date:  dataRows[dateColumn] + yearSetter,
                            descripcion:dataRows[descriptionColumn],
                            value:valueData
                        })

                    ) : ''
                ) : (
                    response.push({
                        date:dataRows[dateColumn],
                        descripcion:dataRows[descriptionColumn],
                        value:valueData
                    })     
                )
            }
            counter++
        });
    }
    return response
}