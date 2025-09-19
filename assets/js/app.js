const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
const btnShowSystemTable = document.querySelector('#btnShowSystemTable')
const btnShowBankTable = document.querySelector('#btnShowBankTable')
const btnShowFind = document.querySelector('#btnShowFind')
const btnShowNotFind = document.querySelector('#btnShowNotFind')
const exSistema = document.querySelector('#exSistema')
const exBanco = document.querySelector('#exBanco')

let systemData = null
let bankData = null

let bankDataRows
let bankDataCustomValues
let systemDataRows
let systemDataCustomValues
let resultDataRows

let date = new Date()
courrentYearInput.value = date.getFullYear()

const enableButtons = () =>{
    btnShowSystemTable.disabled = false
    btnShowBankTable.disabled = false
    btnShowFind.disabled = false
    btnShowNotFind.disabled = false
}

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
        printTable(systemDataRows, true, 'info', fname, systemDataCustomValues)
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
        printTable(bankDataRows, true, 'warning',fname, bankDataCustomValues)
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se encontraron datos validos en el archivo`
        })
    }
})

btnShowFind.addEventListener('click', () =>{
    printTable(resultDataRows.coincide, true, 'primary','Resultados que coinciden')
})

btnShowNotFind.addEventListener('click', () =>{
    printTable(resultDataRows.noCoincide, true, 'primary','Resultados que no coinciden')
})

Array.from(inputs).forEach(input => {
    input.addEventListener('change', () => {
        if(input.files.length > 0){
            let fileName = input.files[0].name
            let fileExtention = fileName.split('.')
            fileExtention = fileExtention[fileExtention.length-1]
        
            if (fileExtention === 'xlsx' || fileExtention === 'xls') {

/*                 readXlsxFile(input.files[0]).then((rows) => {
                    input.id === 'exSistema' ? systemData = rows : '' 
                    input.id === 'exBanco' ? bankData = rows : '' 
                }) */

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
        bankDataRows = bankDataResponse.data.rows
        bankDataCustomValues = bankDataResponse.data.customValues
        systemDataRows = systemDataResponse.data.rows
        systemDataCustomValues = systemDataResponse.data.customValues

        resultDataRows = setTransactions(systemDataRows,bankDataRows)

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
    const customValuesTable = printCustomValues(customValue)

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

                <div class="col-3">
                    <h6>Número de Registros: <span class="badge text-bg-secondary">${keys.length}</span></h6>
                </div>

            </div>

            <div class="row">
                ${customValuesTable}
            </div>

            </div>
        </div>
        <br>
        <table id="table_${uuid}" class="table table-striped table-hover">
        <thead>
            <tr ${tableHeaderColor}>
                <th scope="col">#</th>
                <th scope="col">Fecha</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Valor</th>
            </tr>
        </thead>
        <tbody>
    `

    keys.forEach(key => {
        let objActual = obj[key]
        index = parseInt(key) + 1
        html += `

            <tr>
                <td>${index}</td>
                <td>${objActual.date}</td>
                <td>${objActual.descripcion}</td>
                <td>${objActual.value}</td>
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
                    ${customValue.name} : <b> $${total}</b>
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
                    <td>${value}</td>
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

