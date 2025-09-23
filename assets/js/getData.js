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

        if ('saveValues' in args) {
            const saveValues = args.saveValues
            if (saveValues.length > 0) {
                saveValues.forEach(el => {
                    if (!'descriptionCol' in el || !'valueCol' in el || !'value' in el || !'name' in el) {
                        errors.push({
                            status:false, 
                            msg:errCode.saveValues
                        })
                    }
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
        let descripcionData
        let dateData
        let dataState
        let customValuesData = []

        customValuesData = createCustomValueKeys(args.saveValues)

        data.forEach(dataRows => {
            if(counter >= initialRow){
                dataState = true

                descripcionData = dataRows[descriptionColumn]

                if (dataRows[dateColumn] == undefined ||dataRows[dateColumn] == null && dateNulls == true) {
                    dataState = false
                }
                
                if (descripcionData == undefined || descripcionData == null && descriptionNulls == true) {
                    dataState = false
                }

                if (dataRows[valueColumn] == undefined || dataRows[valueColumn] == null && valueNulls == true) {
                    dataState = false
                }

                //Revisar bien el flujo del proceso, puede hacer redundancias 
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
                    let valueDataRaw = dataRows[valueColumn]
                    const replaces = args.replaceValues
                    replaces.forEach(replace => {
                        if (replace.column === 'value') {
                            valueDataRaw = searchAndReplace(valueDataRaw, replace.search, replace.replace)
                        }
                    })
                    valueData = parseFloat(valueDataRaw)
                    dataRows[valueColumn] = valueData
                }

                if (dataRows[valueColumn] == 0 || dataRows[valueColumn] == null && dataRows[t_acountColumn] !== 0) {
                    valueData = setNegative(dataRows[t_acountColumn])
                } else {
                    let valueDataRaw = dataRows[valueColumn]
                    const replaces = args.replaceValues
                    replaces.forEach(replace => {
                        if (replace.column === 'value') {
                            valueDataRaw = searchAndReplace(valueDataRaw, replace.search, replace.replace)
                        }
                    })
                    valueData = parseFloat(valueDataRaw)
                    dataRows[valueColumn] = valueData
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

                //Aqui se convierte la fecha en caso de que venga como un numero
                if (!isNaN(dateData)) {
                    dateData = XLSX.SSF.format('d/mm/yyyy', dateData)
                }

                if (dataState && isNaN(valueData)){
                    errors.push({
                        status:false,
                        msg:errCode.value.notANumber + ` | Intentando leer Celda: ${args.value.column+(counter+1)}`
                    })
                }

                if (dataState) {
                    AddCustomValue(args.saveValues, dataRows, customValuesData)
                }

                if (dataState) {                    
                    responseData.push({
                        date:dateData,
                        descripcion:descripcionData,
                        value:valueData
                    })
                }
            }
            counter++
        })
        if (errors.length > 0) {
            response = {status:false, data:errors}
        }else{
            response = {status:true,data:{rows:responseData, customValues:customValuesData}}
        }
    }
    console.log(response)
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

function searchAndReplace(value, stringToReplace, replacement){

     const escapedString = stringToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(escapedString, 'g');

    if (typeof value === "string") {
        return value.replace(pattern, replacement);
    }else{
        return value
    }
}

function AddCustomValue(params, dataRow, customValues){
    if (Array.isArray(params)) {
        params.forEach(el => {
            const patternString = el.value
            const descriptionCol = cols.indexOf(el.descriptionCol)
            const valueCol = cols.indexOf(el.valueCol)
            if (patternString.includes('?')) {
                const regexPattern = new RegExp('^' + patternString.replace(/\?/g, '.*'), 'i')
                if(regexPattern.test(dataRow[descriptionCol])){
                    addValueToCostumData(customValues, el.name, dataRow[valueCol], dataRow[descriptionCol])
                }
            }else{
                if(dataRow[descriptionCol] === patternString){
                    addValueToCostumData(customValues, el.name, dataRow[valueCol], dataRow[descriptionCol])
                }
            }
        })
    }
}

function createCustomValueKeys(confArgs){
    const result = []

    confArgs.forEach(key => {
      result.push({
            name:key.name,
            values:[],
            description:[]
        })  
    })

    return result
}

function addValueToCostumData(valuesKey, categoryName, newValue, newDescription) {

  for (const item of valuesKey) {
    if (item.name === categoryName) {
        item.values.push(newValue)
        item.description.push(newDescription)
        return
    }
  }
}


//// fro claude.... //////// ---------------------------------

function extractAndFormatDate(cellValue) {
  if (!cellValue || typeof cellValue !== 'string') {
    return null;
  }

  // Month mappings for Spanish months
  const monthMap = {
    'enero': '01', 'ene': '01',
    'febrero': '02', 'feb': '02',
    'marzo': '03', 'mar': '03',
    'abril': '04', 'abr': '04',
    'mayo': '05', 'may': '05',
    'junio': '06', 'jun': '06',
    'julio': '07', 'jul': '07',
    'agosto': '08', 'ago': '08',
    'septiembre': '09', 'sep': '09',
    'octubre': '10', 'oct': '10',
    'noviembre': '11', 'nov': '11',
    'diciembre': '12', 'dic': '12'
  }

  // Regular expression to match date patterns
  // Looks for "al" followed by day, month, and year
  const datePattern = /al\s+(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i;
  
  const match = cellValue.match(datePattern);
  
  if (!match) {
    return null;
  }
  
  const day = match[1].padStart(2, '0');
  const monthName = match[2].toLowerCase();
  const year = match[3];
  
  // Get the month number from the mapping
  const month = monthMap[monthName];
  
  if (!month) {
    console.warn(`Unknown month: ${monthName}`);
    return null;
  }
  
  return `${day}/${month}/${year}`;
}

// Example usage:
console.log(extractAndFormatDate("CANCELA AL 31 AGO 2025")); // "31/08/2025"
console.log(extractAndFormatDate("Quincena al 31 Agosto 2025")); // "31/08/2025"
console.log(extractAndFormatDate("some comment ... al 24 julio 2025")); // "24/07/2025"
console.log(extractAndFormatDate("Payment al 15 dic 2024")); // "15/12/2024"