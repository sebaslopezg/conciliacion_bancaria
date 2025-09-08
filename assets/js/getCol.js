/*
TODO:
-Relacionamiento de columnas, el sistema avansis presenta columna en positivos y en negativos,
de esta manera se debe ajustar la funcion para permitir juntar todo en un solo array
*/

const cols = [];
for (let i = 65; i <= 90; i++) {
  cols.push(String.fromCharCode(i));
}

export const getCol = (data, col, initialRow, finalRow) => {

    let response = []
    
    const column = cols.indexOf(col)

    let finalRowState
    
    finalRow === false ? finalRowState = 'it is false!' : finalRowState = 'it isnt false'

    //

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
