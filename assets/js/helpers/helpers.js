const courrentYearInput = document.querySelector('#courrentYear')

//Function for export an html table into excel file
function exportTableToExcel(tableID, idFileName = '') {
    let fileName = 'excel_exportado.xlsx'
    if (idFileName) {
        let fileNameInput = document.querySelector(`#${idFileName}`)
        if (fileNameInput) {
            fileNameInput.value ? fileName = fileNameInput.value + '.xlsx' : fileName = 'excel_exportado.xlsx'
        }
    }

    var table = document.getElementById(tableID)
    var ws = XLSX.utils.table_to_sheet(table)
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "hoja 1")
    XLSX.writeFile(wb, fileName)
}

//function for printing into the display tag
const print = (data) =>{
    display.innerHTML += data
}

// Prin the error from the error array
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

function saveConfig(data){
    localStorage.setItem('conf', data);
}

function loadConfig(){
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById('jsonConfigInput')

    if (fileInput.files.length === 0) {
      reject({
        status: false,
        title: 'No se ha seleccionado ningún archivo',
        msg: 'Por favor seleccione un archivo primero.'
      });
      return
    }

    const file = fileInput.files[0]
    const reader = new FileReader()

    reader.onload = function(event) {
        try {
            const data = event.target.result;
            resolve({
                status: true,
                data: data
            });
        } catch (error) {
          reject({
              status: false,
              title: 'Error',
              msg: `Error al intentar convertir el formato: ${error.message}`
          });
        }
    }

    reader.onerror = function(event) {
        reject({
            status: false,
            title: 'Error al leer el archivo',
            msg: `Error reading file: ${event.target.error.name}`
        })
    }
    reader.readAsText(file);
  })
}

function setConfigInput(id, configType){

    if (configType == 'regex') {
        const input = document.getElementById(id)
        if (input) {
            input.innerHTML = `<option value="false" selected>No</option> `
            defaultRegex.forEach((el, index) =>{
                input.innerHTML += `<option value="${index}">${el.description}</option>`
            })
        }
    }
}

function downloadJsonFile(jsonData, fileName = 'config.json'){
    const jsonString = JSON.stringify(jsonData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

function deleteConfData(){

    Swal.fire({
        icon: "warning",
        title: "¿Seguro que desea eliminar todos los datos de configuración?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                localStorage.removeItem('conf')
                Swal.fire({
                    icon: "success",
                    title: "Configuración eliminada",
                    text: `Los datos de configuración se han eliminado correctamente, debe actualizar el navegador para aplicar los cambios correctamente.`
                })
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error al intentar eliminar datos: ${error}`
                })
            }
        }
    })
}

function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: "array" })

      // Get first sheet name
      const sheetName = workbook.SheetNames[0]

      // Get the sheet data
      const sheet = workbook.Sheets[sheetName]

      // Convert to JSON (array of objects)
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      resolve(jsonData)
    };

    reader.onerror = (err) => reject(err)

    reader.readAsArrayBuffer(file)
  });
}

function formatMoney(number){
    const formatter = new Intl.NumberFormat('es-CO');

    const formattedString = formatter.format(number);

    return formattedString
}