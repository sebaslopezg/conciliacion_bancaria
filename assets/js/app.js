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
let systemDataRows
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
        printTable(systemDataRows, true, 'info', fname)
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
            let fileName = input.files[0].name;
            let fileExtention = fileName.split('.')
            fileExtention = fileExtention[fileExtention.length-1]
        
            if (fileExtention === 'xlsx' || fileExtention === 'xls') {

                readXlsxFile(input.files[0]).then((rows) => {
                    input.id === 'exSistema' ? systemData = rows : '' 
                    input.id === 'exBanco' ? bankData = rows : '' 
                })




        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Process the workbook data
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                console.log(worksheet); 
            };
            reader.readAsArrayBuffer(file);
        }





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

const printTable = (obj, reset, headerColor, fileName = 'Nombre no definido') => {

    let tableHeaderColor = ''

    if (reset) {
        display.innerHTML = ''
    }

    headerColor ? tableHeaderColor = `class="table-${headerColor}"` : tableHeaderColor = ''
    const uuid = crypto.randomUUID()
    let keys = Object.keys(obj)

    let html = `

        <div class="card">
            <div class="card-header">
                ${fileName}
            </div>
            <div class="card-body">
            
            <div class="row">

                <div class="col-3">
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


const printResult = () => {
    //resultDataRows

    //printTable = (obj, reset, headerColor, fileName)

}

