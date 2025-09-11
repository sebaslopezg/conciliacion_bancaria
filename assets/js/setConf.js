let savedConf = localStorage.getItem('conf')
const btnLoadConfig = document.querySelector('#btnLoadConfig')
const tacountCkeckBox = document.querySelector('#systemValueTAcount')

const systemValueColumn = document.querySelector('#systemValueColumn')
const systemValueCreditColumn = document.querySelector('#systemValueCreditColumn')
const systemValueDebitColumn = document.querySelector('#systemValueDebitColumn')

setConfigInput('bankRegex', 'regex')
loadCurrentConf()

tacountCkeckBox.addEventListener('change', () =>{
    if (tacountCkeckBox.checked) {
        systemValueColumn.setAttribute('disabled','')
        systemValueCreditColumn.removeAttribute('disabled')
        systemValueDebitColumn.removeAttribute('disabled')
    }else{
        systemValueColumn.removeAttribute('disabled')
        systemValueCreditColumn.setAttribute('disabled','')
        systemValueDebitColumn.setAttribute('disabled','')
    }
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

const generateConfig = () =>{

}

function loadCurrentConf(){
    if (savedConf) {

        //system conf getters


        
    }
}