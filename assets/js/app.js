//const input = document.getElementById('exSistema')
const courrentYearInput = document.querySelector('#courrentYear')
const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
let systemData = null
let bankData = null

//

let date = new Date()
courrentYearInput.value = date.getFullYear()

btnExecute.addEventListener('click', () =>{
    if (systemData === null || bankData === null) {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: `Debe cargar los dos archivos de excel`
        }) 
    }else{
        readData()
    }
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

    let bankDataRows = getData(bankData, {
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
            column:'C'
        }
    })

    let systemDataRows = getData(systemData, {
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

    //console.log('Estos son los datos del banco')
    //console.log(bankDataRows)
    //console.log('Estos son los datos del sistema')
    //console.log(systemDataRows)

    printTable(systemDataRows)
    
}

const print = (data) =>{
    display.innerHTML += data
}

const printTable = (obj) => {
    let html = `
        <table class="table">
        <thead>
            <tr>
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
        html += `

            <tr>
                <td>${key+1}</td>
                <td>${objActual.date}</td>
                <td>${objActual.descripcion}</td>
                <td>${objActual.value}</td>
            </tr>
        `
    });

    html += `</tbody></table>`
    print(html)
}
