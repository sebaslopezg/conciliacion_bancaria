import errMsg from './errors.js'

const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i));
}

export const getData = (data, args) => {

    let response = []
    let errors = []
    let initialRow
    let dateColumn
    let descriptionColumn
    let valueColumn

    if('date' in args && 'description' in args && 'value' in args){

        'rowStart' in args ?  initialRow = args.rowStart : errors.push({status:true, msg:errMsg.value.rowStart})
        'rowLimit' in args ?  '' : errors.push({status:true, msg:errMsg.value.rowLimit})

        'column' in args.date ?  dateColumn = cols.indexOf(args.date.column) : errors.push({status:true, msg:errMsg.date.column})
        'column' in args.description ?  descriptionColumn = cols.indexOf(args.description.column) : errors.push({status:true, msg:errMsg.description.column})
        'column' in args.value ?  valueColumn = cols.indexOf(args.value.column) : errors.push({status:true, msg:errMsg.value.column})
    }

    if (errors.length > 0) {
        response = {error:errors}
        console.log(response)
    }else{
        let counter = 0
        data.forEach(dataRows => {

            if(counter >= initialRow){
                
                response.push({
                    date:dataRows[dateColumn],
                    descripcion:dataRows[descriptionColumn],
                    value:dataRows[valueColumn]
                })
            }

            counter++
        });
    }

    return response
}

/*
ejemplo de identificacion de fechas por medio de regex

const regex = /^\d{1,2}\/\d{1,2}$/;

// Example usage
const dateString1 = "7/8";
const dateString2 = "12/25";
const textString = "N/A";

console.log(regex.test(dateString1)); // Output: true
console.log(regex.test(dateString2)); // Output: true
console.log(regex.test(textString));  // Output: false

*/