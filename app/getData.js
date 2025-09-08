const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i));
}

export const getData = (args) => {

    let response = []

    if('date' in args && 'description' in args && 'value' in args){

        //todo: pendiente arreglar esto: crear funcion que tramite cada parte de los args y gestione errores
        let column
        'column' in args.date ?  column = cols.indexOf(args.date.column) : ''

        

        let finalRowState
        
        finalRow === false ? finalRowState = 'it is false!' : finalRowState = 'it isnt false'

    }else{

    }

    let counter = 0
    data.forEach(dataRows => {

        if(counter >= initialRow){
            if (dataRows[column] !== null) {
                response.push(dataRows[column])
            }
        }
        counter++
    });

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