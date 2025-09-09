//const input = document.getElementById('exSistema')
const courrentYearInput = document.querySelector('#courrentYear')
const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
const btnShowSystemTable = document.querySelector('#btnShowSystemTable')
const btnShowBankTable = document.querySelector('#btnShowBankTable')
const btnShowAll = document.querySelector('#btnShowAll')
const exSistema = document.querySelector('#exSistema')
const exBanco = document.querySelector('#exBanco')
let systemData = null
let bankData = null

let bankDataRows
let systemDataRows
let filesProp = {}

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

    bankDataResponse = getData(bankData, {
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A',
            readByRegex:/^\d{1,2}\/\d{1,2}$/,
            setYear:courrentYearInput.value
        },
        description:{
            column:'B'
        },
        value:{
            column:'D'
        }
    })

    systemDataResponse = getData(systemData, {
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A'
        },
        description:{
            column:'B'
        },
        value:{
            column:'C',
            t_acount:'D'
        }
    })

    if (bankDataResponse.status && systemDataResponse.status) {
        bankDataRows = bankDataResponse.data
        systemDataRows = systemDataResponse.data
    }else{
        !bankDataResponse.status ? printError(bankDataResponse.data) : ''
        !systemDataResponse.status ? printError(systemDataResponse.data) : ''
    }
}

const print = (data) =>{
    display.innerHTML += data
}

const printTable = (obj, reset, headerColor, fileName) => {

    let tableHeaderColor = ''

    if (reset) {
        display.innerHTML = ''
    }

    headerColor ? tableHeaderColor = `class="table-${headerColor}"` : tableHeaderColor = ''

    let html = `

        <div class="card">
        <div class="card-body">
            <h5 class="card-title">${fileName}</h5>
        </div>
        </div>
        <br>
        <table class="table table-striped table-hover">
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

const printError = (data) =>{

    Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo uno o mas errores al ejecutar`
    })

    let html = `
        <table class="table table-striped table-hover">
        <thead>
            <tr class="table-danger">
                <th scope="col">#</th>
                <th scope="col">Error</th>
            </tr>
        </thead>
        <tbody>
    `
    let keys = Object.keys(data)

    keys.forEach(key => {
        let objActual = data[key]
        index = parseInt(key) + 1
        html += `
            <tr>
                <td>${index}</td>
                <td>${objActual.msg}</td>
            </tr>
        `
    })

    html += `</tbody></table>`
    print(html)
} 
