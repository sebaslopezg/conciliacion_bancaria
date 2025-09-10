//Function for export an html table into excel file
function exportTableToExcel(tableID, filename = '') {
    var table = document.getElementById(tableID);
    var ws = XLSX.utils.table_to_sheet(table);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "hoja 1");
    XLSX.writeFile(wb, filename);
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

function getConfig(){

}

function loadConfig() {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById('jsonConfigInput');

    if (fileInput.files.length === 0) {
      reject({
        status: false,
        title: 'No se ha seleccionado ningún archivo',
        msg: 'Por favor seleccione un archivo primero.'
      });
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      try {
        const jsonString = event.target.result;
        const data = JSON.parse(jsonString);
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
    };

    reader.onerror = function(event) {
      reject({
        status: false,
        title: 'Error al leer el archivo',
        msg: `Error reading file: ${event.target.error.name}`
      });
    };

    reader.readAsText(file);
  });
}