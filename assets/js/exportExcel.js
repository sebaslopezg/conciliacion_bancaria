    function exportTableToExcel(tableID, filename = '') {
        var table = document.getElementById(tableID);
        var ws = XLSX.utils.table_to_sheet(table);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "hoja 1");
        XLSX.writeFile(wb, filename);
    }