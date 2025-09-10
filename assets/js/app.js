const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
const btnShowSystemTable = document.querySelector('#btnShowSystemTable')
const btnShowBankTable = document.querySelector('#btnShowBankTable')
const btnShowAll = document.querySelector('#btnShowAll')
const exSistema = document.querySelector('#exSistema')
const exBanco = document.querySelector('#exBanco')
const btnLoadConfig = document.querySelector('#btnLoadConfig')

let systemData = null
let bankData = null

let bankDataRows
let systemDataRows
let filesProp = {}
let savedConf = localStorage.getItem('conf')

let date = new Date()
courrentYearInput.value = date.getFullYear()

const enableButtons = () =>{
    btnShowSystemTable.disabled = false
    btnShowBankTable.disabled = false
    btnShowAll.disabled = false
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
        printTable(systemDataRows, true, 'info', fname)
        console.log(systemDataRows)
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
        printTable(bankDataRows, true, 'warning',fname)
        console.log(bankDataRows)
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `No se encontraron datos validos en el archivo`
        })
    }

})
btnShowAll.addEventListener('click', () =>{

})

btnLoadConfig.addEventListener('click', () =>{
    const jsonfileModal = document.getElementById('loadJsonModal')
    const modalInstance = bootstrap.Modal.getInstance(jsonfileModal)
    loadConfig()
    .then(response => {
        modalInstance.hide()
        Swal.fire({
            icon: "success",
            title: "Archivo Cargado",
            text: `Se ha leido correctamente el archivo`
        })
        saveConfig(response.data)
    })
    .catch(error =>{
        Swal.fire({
            icon: "error",
            title: error.title,
            text: error.msg
        })
    })
})

Array.from(inputs).forEach(input => {
    input.addEventListener('change', () => {
        if(input.files.length > 0){
            let fileName = input.files[0].name;
            let fileExtention = fileName.split('.')
            fileExtention = fileExtention[fileExtention.length-1]
        
            if (fileExtention === 'xlsx' || fileExtention === 'xls') {

                readXlsxFile(input.files[0]).then((rows) => {
                    input.id === 'exSistema' ? systemData = rows : '' 
                    input.id === 'exBanco' ? bankData = rows : '' 
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
        bankDataRows = bankDataResponse.data
        systemDataRows = systemDataResponse.data
    }else{
        !bankDataResponse.status ? printError(bankDataResponse.data) : ''
        !systemDataResponse.status ? printError(systemDataResponse.data) : ''
    }
}

const printTable = (obj, reset, headerColor, fileName) => {

    let tableHeaderColor = ''

    if (reset) {
        display.innerHTML = ''
    }

    headerColor ? tableHeaderColor = `class="table-${headerColor}"` : tableHeaderColor = ''
    const uuid = crypto.randomUUID()

    let html = `

        <div class="card">
            <div class="card-header">
                ${fileName}
            </div>
            <div class="card-body">
                <button class="btn btn-success" onclick="exportTableToExcel('table_${uuid}', 'excel_exportado.xlsx')">Exportar Excel</button>
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

    let keys = Object.keys(obj)

    keys.forEach(key => {
        let objActual = obj[key]
        let fecha
        //let fechaFormateada = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`
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

