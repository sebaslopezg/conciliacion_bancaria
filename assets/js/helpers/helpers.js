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