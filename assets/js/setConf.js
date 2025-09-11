let savedConf = localStorage.getItem('conf')
const btnLoadConfig = document.querySelector('#btnLoadConfig')
const tacountCkeckBox = document.querySelector('#systemValueTAcount')

//System consts
const systemRowStart = document.querySelector('#systemRowStart')
const systemRowLimit = document.querySelector('#systemRowLimit')
const systemDateColumn = document.querySelector('#systemDateColumn')
const systemValueTAcount = document.querySelector('#systemValueTAcount')
const systemDescriptionColumn = document.querySelector('#systemDescriptionColumn')
const systemValueColumn = document.querySelector('#systemValueColumn')
const systemValueCreditColumn = document.querySelector('#systemValueCreditColumn')
const systemValueDebitColumn = document.querySelector('#systemValueDebitColumn')

//Bank consts
const bankRowStart = document.querySelector('#bankRowStart')
const bankRowLimit = document.querySelector('#bankRowLimit')
const bankDateColumn = document.querySelector('#bankDateColumn')
const bankDescriptionColumn = document.querySelector('#bankDescriptionColumn')
const bankValueColumn = document.querySelector('#bankValueColumn')
const bankRegex = document.querySelector('#bankRegex')
const bankSetYear = document.querySelector('#bankSetYear')

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
        currentConf = JSON.parse(savedConf)
        console.log(currentConf)

        if ('systemConf' in currentConf) {
            'rowStart' in currentConf.systemConf ? setInput('text', systemRowStart, currentConf.systemConf.rowStart) : ''
            if ('rowLimit' in currentConf.systemConf) {
                currentConf.systemConf.rowLimit == 'false' ? setInput('text', systemRowLimit, currentConf.systemConf.rowLimit) : ''
            }

            if ('date' in currentConf.systemConf) {
                'column' in currentConf.systemConf.date ? setInput('text', systemDateColumn, currentConf.systemConf.date.column) : ''
            }

            if ('description' in currentConf.systemConf) {
                'column' in currentConf.systemConf.description ? setInput('text', systemDescriptionColumn, currentConf.systemConf.description.column) : ''
            }

            if ('value' in currentConf.systemConf) {
                const dataValue = currentConf.systemConf.value
                if ('t_acount' in dataValue) {
                    setInput('checkbox', systemValueTAcount, true)
                    setInput('state', systemValueCreditColumn, true)
                    setInput('state', systemValueDebitColumn, true)
                    setInput('state', systemValueColumn, false)
                    'credit' in dataValue.t_acount ? setInput('text', systemValueCreditColumn, dataValue.t_acount.credit) : ''
                    'debit' in dataValue.t_acount ? setInput('text', systemValueDebitColumn, dataValue.t_acount.debit) : ''
                }else{
                    setInput('checkbox', systemValueTAcount, false)
                    setInput('state', systemValueCreditColumn, false)
                    setInput('state', systemValueDebitColumn, false)
                    setInput('state', systemValueColumn, true)
                    'column' in dataValue ? setInput('text', systemValueColumn, dataValue.column) : ''
                }
            }
        }

        //bank conf getters
        if ('bankConf' in currentConf) {

            'rowStart' in currentConf.bankConf ? setInput('text', bankRowStart, currentConf.bankConf.rowStart) : ''

            if ('rowLimit' in currentConf.bankConf) {
                currentConf.bankConf.rowLimit == 'false' ? setInput('text', bankRowLimit, currentConf.bankConf.rowLimit) : ''
            }

            if ('date' in currentConf.bankConf) {
                'column' in currentConf.bankConf.date ? setInput('text', bankDateColumn, currentConf.bankConf.date.column) : ''
                if ('readByRegex' in currentConf.bankConf.date) {
                    if(currentConf.bankConf.date.readByRegex != false || currentConf.bankConf.date.readByRegex != 'false'){
                        setInput('select', bankRegex, currentConf.bankConf.date.readByRegex)
                    }
                }
                if ('setYear' in currentConf.bankConf.date) {
                    const setYearValue = currentConf.bankConf.date.setYear
                    setYearValue ? setInput('select', bankSetYear, "1") : setInput('select', bankSetYear, "0")
                    
                }
            }

            if ('description' in currentConf.bankConf) {
                'column' in currentConf.bankConf.description ? setInput('text', bankDescriptionColumn, currentConf.bankConf.description.column) : ''
            }

            if ('value' in currentConf.bankConf) {
                'column' in currentConf.bankConf.value ? setInput('text', bankValueColumn, currentConf.bankConf.value.column) : ''
            }
        }
    }
}

function setInput(inputType, input, value){
    if (inputType === 'text') {
        input.value = value
    }
    if (inputType === 'select') {
        input.value = value
    }
    if (inputType === 'checkbox') {
        input.checked = value
    }
    if (inputType === 'state') {
        value ? input.removeAttribute('disabled') : input.setAttribute('disabled','')
    }
}