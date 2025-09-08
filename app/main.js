import { getCol } from "./getCol.js"
import {getData} from './getData.js'

//const input = document.getElementById('exSistema')
const inputs = document.getElementsByClassName('excelInput')
const btnExecute = document.querySelector('#execute')
const display = document.querySelector('#display')
let systemData = null
let bancData = null

//

btnExecute.addEventListener('click', () =>{
    if (systemData === null || bancData === null) {
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
        
            if (fileExtention != 'xlsx') {
                Swal.fire({
                icon: "error",
                title: "Error",
                text: `El archivo es de extención .${fileExtention}, solo se permiten archivos de excel .xlsx`
                })
                input.value = ''
            }else{
                readXlsxFile(input.files[0]).then((rows) => {
                    input.id === 'exSistema' ? systemData = rows : '' 
                    input.id === 'exBanco' ? bancData = rows : '' 
                })
            }
        }
    }) 
})

const readData = () =>{
/*     let sistemaFecha = getCol(systemData,'A', 3, false)
    let sistemaDescripcion = getCol(systemData,'B', 3, false)
    let sistemaValor = getCol(systemData,'C', 3, false)

    let Sumalength = (sistemaDescripcion.length / sistemaFecha.length) + (sistemaValor.length / sistemaFecha.length)

    if (Sumalength === 2) {
        display.innerHTML = ""
        printTable(sistemaFecha, sistemaDescripcion, sistemaValor)
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `Algúnas columnas presentan mas datos que otras, revise primero el excel y verifique que la cantidad de datos en columnas sean iguales`
        })  
    }   */
        let bancDataRows = getData(bancData, {
            rowStart: 3,
            rowLimit:false,
            date:{
                column:'A'
            },
            description:{
                column:'B'
            },
            value:{
                column:'C'
            }
        })

        console.log(bancDataRows)
    
}

const print = (data) =>{
    display.innerHTML += data
}

const printTable = (sistemaFecha, sistemaDescripcion, sistemaValor, bancoFecha, bancoDescripcion, BancoValor) => {
    let html = `
        <table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Fecha Sistema</th>
                <th scope="col">Descripcion Sistema</th>
                <th scope="col">Valor Sistema</th>
            </tr>
        </thead>
        <tbody>
    `
    sistemaFecha.forEach((fecha, index) => {
        let fechaFormateada = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`
        html += `

            <tr>
                <td>${index+1}</td>
                <td>${fechaFormateada}</td>
                <td>${sistemaDescripcion[index]}</td>
                <td>${sistemaValor[index]}</td>
            </tr>
        `
    });

    html += `</tbody></table>`
    print(html)
}