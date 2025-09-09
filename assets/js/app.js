//const input = document.getElementById('exSistema')
const courrentYearInput = document.querySelector('#courrentYear')
const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
const btnShowSystemTable = document.querySelector('#btnShowSystemTable')
const btnShowBankTable = document.querySelector('#btnShowBankTable')
const btnShowAll = document.querySelector('#btnShowAll')
let systemData = null
let bankData = null

let bankDataRows
let systemDataRows

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
        printTable(systemDataRows, true, 'info')
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
        printTable(bankDataRows, true, 'warning')
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

    bankDataRows = getData(bankData, {
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

    systemDataRows = getData(systemData, {
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
    
}

const print = (data) =>{
    display.innerHTML += data
}

const printTable = (obj, reset, headerColor) => {

    let tableHeaderColor = ''

    if (reset) {
        display.innerHTML = ''
    }

    headerColor ? tableHeaderColor = `class="table-${headerColor}"` : tableHeaderColor = ''

    let html = `
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
        //console.log(typeof objActual.value)
    });

    html += `</tbody></table>`
    print(html)
}

