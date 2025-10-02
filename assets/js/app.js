const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
const btnShowSystemTable = document.querySelector('#btnShowSystemTable')
const btnShowBankTable = document.querySelector('#btnShowBankTable')
const exSistema = document.querySelector('#exSistema')
const exBanco = document.querySelector('#exBanco')
const btnSaveChanges = document.querySelector('#btnSaveChanges')

let systemData = null
let bankData = null
let bankDataRows
let bankDataCustomValues
let systemDataRows
let systemDataCustomValues
let resultDataRows
let currentDataRows = {
    data:'',
    token:''
}
let mainDataResponse

let date = new Date()
courrentYearInput.value = date.getFullYear()

function enableButtons(){
    btnShowSystemTable.disabled = false
    btnShowBankTable.disabled = false
}

btnSaveChanges.addEventListener('click', () =>{
    try {
        saveTables()
        Swal.fire({
            icon: "success",
            title: "Guardar Cambios",
            text: `Cambios guardados`
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se pudo guardar cambios`
        })
    }
    
})

btnExecute.addEventListener('click', () =>{
    if (systemData === null || bankData === null) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `Debe cargar los dos archivos de excel`
        })
    }else{
        readData()
        enableButtons()
    }
})

btnShowSystemTable.addEventListener('click', () =>{
    if (systemDataRows.length > 0) {
        const fname = exSistema.files[0].name
        currentDataRows.data = resultDataRows.system
        currentDataRows.token = 'system'
        printTable(resultDataRows.system, true, 'info', fname, systemDataCustomValues)
        setAllCells()
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se encontraron datos validos en el archivo`
        })
    }
})

btnShowBankTable.addEventListener('click', () =>{
    if (bankDataRows.length > 0) {
        const fname = exBanco.files[0].name
        currentDataRows.data = resultDataRows.bank
        currentDataRows.token = 'bank'
        printTable(resultDataRows.bank, true, 'warning',fname, bankDataCustomValues)
        setAllCells()
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se encontraron datos validos en el archivo`
        })
    }
})

Array.from(inputs).forEach(input => {
    input.addEventListener('change', () => {
        if(input.files.length > 0){
            let fileName = input.files[0].name
            let fileExtention = fileName.split('.')
            fileExtention = fileExtention[fileExtention.length-1]
        
            if (fileExtention === 'xlsx' || fileExtention === 'xls') {

                readExcel(input.files[0])
                .then(rows => {
                    input.id === 'exSistema' ? systemData = rows : '' 
                    input.id === 'exBanco' ? bankData = rows : ''
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al intentar leer el archivo",
                        text: `El lector ha presentado uno o varios errores: ${error}`
                    })
                })


                if (!savedConf) {
                    Swal.fire({
                        icon: "warning",
                        title: "Atención",
                        text: `No se encontró ninguna configuración guardada, esto podría causar errores`
                    })
                }

            }else{
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `El archivo es de extención .${fileExtention}, solo se permiten archivos de excel .xlsx o .xls`
                })
                input.value = ''
            }
        }
    }) 
})

const readData = () =>{

let bankDataResponse
let systemDataResponse

    let bankParams
    let systemParams

    if (savedConf) {    
        const userConf = JSON.parse(savedConf)
        bankParams = userConf.bankConf
        systemParams = userConf.systemConf 
    }else{
        bankParams = defaultConf.bankConf
        systemParams = defaultConf.systemConf
    }

    bankDataResponse = getData(bankData, bankParams)
    systemDataResponse = getData(systemData, systemParams)

    if (bankDataResponse.status && systemDataResponse.status) {

        mainDataResponse = {
            system:systemDataResponse,
            bank:bankDataResponse
        }

        bankDataRows = bankDataResponse.data.rows
        bankDataCustomValues = bankDataResponse.data.customValues
        systemDataRows = systemDataResponse.data.rows
        systemDataCustomValues = systemDataResponse.data.customValues

        //resultDataRows = setTransactions(systemDataRows,bankDataRows)
        resultDataRows = setTransactions({
            arrMain:{
                array:systemDataRows,
                name:'system'
            },
            arrSecond:{
                array:bankDataRows,
                name:'bank'
            }
        })

        Swal.fire({
            icon: "success",
            title: "Datos Procesados",
            text: `Los datos han sido leídos correctamente.`
        })

    }else{
        !bankDataResponse.status ? printError(bankDataResponse.data) : ''
        !systemDataResponse.status ? printError(systemDataResponse.data) : ''
    }
}

const printTable = (obj, reset, headerColor, fileName = 'Nombre no definido', customValue) => {

    let tableHeaderColor = ''

    if (reset) {
        display.innerHTML = ''
    }

    headerColor ? tableHeaderColor = `class="table-${headerColor}"` : tableHeaderColor = ''
    const uuid = crypto.randomUUID()
    let keys = Object.keys(obj)
    let customValuesTable
    customValue ? customValuesTable = printCustomValues(customValue) : ''

    let html = `
        <div class="card">
            <div class="card-header">
                ${fileName}
            </div>
            <div class="card-body">
            
            <div class="row">

                <div class="col-4">
                    <div class="input-group mb-3">
                        <button class="btn btn-success" type="button"  onclick="exportTableToExcel('table_${uuid}', 'excelExportFileName')">
                        <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
                        </button>
                        <input type="text" class="form-control" placeholder="Nombre del archivo" id="excelExportFileName">
                    </div>
                </div>

                <div class="col-2">
                    <h6>Número de Registros:</h6> <h5><span class="badge text-bg-secondary">${keys.length}</span></h5>
                </div>

                <div class="col-3">

                </div>

                <div class="col-3">

                </div>

            </div>

            <div class="row">
                ${customValuesTable}
            </div>

            </div>
        </div>
        <br>
        <table id="table_${uuid}" class="table table-striped table-hover table_data">
        <thead>
            <tr ${tableHeaderColor}>
                <th scope="col">#</th>
                <th scope="col">Fecha</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Valor</th>
                <th scope="col">Estado</th>
                <th scope="col">Comentario</th>
            </tr>
        </thead>
        <tbody>
    `

    keys.forEach(key => {
        let objActual = obj[key]
        index = parseInt(key) + 1
        html += `

            <tr class="${objActual.status}">
                <td>${index}</td>
                <td>${objActual.date}</td>
                <td>${objActual.descripcion}</td>
                <td>$ ${formatMoney(objActual.value)}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" class="btn btn-outline-danger" onclick="setRow(this.parentNode.parentNode.parentNode,'notMatchRow')">
                            <i class="bi bi-x-circle-fill"></i> 
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="setRow(this.parentNode.parentNode.parentNode, 'matchRow')">
                            <i class="bi bi-check-circle-fill"></i> 
                        </button>
                    </div>
                </td>
                <td>
                    <input class="form-control" type="text" value="${objActual.comment}">
                </td>
            </tr>
        `
    })

    html += `</tbody></table>`
    print(html)
}


const printResult = () => {
    //resultDataRows

    //printTable = (obj, reset, headerColor, fileName)

}

function printCustomValues(obj){

    html = ""
    obj.forEach((customValue, index) => {
        const total = customValue.values.reduce((acumulador, valorActual) => acumulador + valorActual, 0)
        
        html += `
        
            <div class="accordion mb-3" id="customValuesAcordeon_${index}">
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#customValuesAcordeonCollapse_${index}" aria-expanded="false" aria-controls="customValuesAcordeonCollapse_${index}">
                    ${customValue.name} : <b> $${formatMoney(total)}</b>
                </button>
                </h2>
                <div id="customValuesAcordeonCollapse_${index}" class="accordion-collapse collapse" data-bs-parent="#customValuesAcordeon_${index}">
                <div class="accordion-body">
        `

        html += `
            <table class="table table-hover">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Descripción</th>
                <th scope="col">Valor</th>
                </tr>
            </thead>
            <tbody>
        `
        customValue.values.forEach((value, i) => {
            html += `
                <tr>
                    <td>${i+1}</td>
                    <td>${customValue.description[i]}</td>
                    <td>$ ${formatMoney(value)}</td>
                </tr>
            
            `
        })

        //Foorer table
        html += "</tbody></table>"

        //add the footer
        html += `</div></div></div></div>`
    })

    return html
}

function setRow(row, state){
    
    if (state === 'matchRow') {
        row.classList.remove('not_found')
        row.classList.add('found')
    }

    if (state === 'notMatchRow') {
        row.classList.remove('found')
        row.classList.add('not_found')
    }

    setAllCells()
    saveTables()
}

function setAllCells(){
    setTableCells('matchCells', false)
    setTableCells('notMatchCells', false)
}

function setTableCells(type, switchMode = true){
    const matchCells = document.querySelectorAll('.found')
    const notMatchCells = document.querySelectorAll('.not_found')
    let rows
    let rowType
    if (type === 'matchCells') {
        rows = matchCells
    }

    if (type === 'notMatchCells') {
        rows = notMatchCells
    }

    rows.forEach(row =>{
        if (type === 'matchCells') {
            if(row.classList.contains("table-success")) {
                switchMode ? row.classList.remove('table-success') : ''
            }else{ 
                if (row.classList.contains("table-danger")) {
                    row.classList.remove('table-danger')
                }
                row.classList.add('table-success')
            }
        }

        if (type === 'notMatchCells') {
            if(row.classList.contains("table-danger")) {
                switchMode ? row.classList.remove('table-danger') : ''
            }else{ 
                if (row.classList.contains("table-success")) {
                    row.classList.remove('table-success')
                }
                row.classList.add('table-danger')
            }
        }
    })
}



function saveTables(){
    // currentDataRows
    const currentData = {
        bank:resultDataRows.bank,
        system:resultDataRows.system
    }
    const table = document.querySelector('.table_data')
    
    const dataObjects = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowObject = {};

        if (table.rows[i].classList.contains('found')) {
            rowObject.status = 'found'
        }
        if (table.rows[i].classList.contains('not_found')) {
            rowObject.status = 'not_found'
        }

        for (let j = 0; j < row.cells.length; j++) {

            const valueRow = resultDataRows[currentDataRows.token][i-1]

            j == 1 ? rowObject.date = row.cells[j].textContent.trim() : ''
            j == 2 ? rowObject.descripcion = row.cells[j].textContent.trim() : ''
            j == 3 ? rowObject.value = valueRow.value : ''
            j == 5 ? rowObject.comment = row.cells[j].childNodes[1].value : ''
            
        }
        dataObjects.push(rowObject);
    }

    resultDataRows[currentDataRows.token] = dataObjects

    const currentDataSave = {
        mainDataResponse
    }

    localStorage.setItem("currentData", JSON.stringify(currentData))
    localStorage.setItem("currentDataTokens", JSON.stringify(currentDataRows))
}

loadTablesFromLocal()

function loadTablesFromLocal(){
    const storedData = localStorage.getItem('currentData')
    const currentDataTokens = localStorage.getItem('currentDataTokens')

    if (storedData && currentDataTokens) {

        const data = JSON.parse(storedData)
        const dataTokens = JSON.parse(currentDataTokens)

        enableButtons()

        printTable(data[dataTokens.token], true, 'info', '', data[dataTokens.token].data.customValues)
    }else{
        console.log('no encontrado')
    }
}