let savedConf = localStorage.getItem('conf')
const btnLoadConfig = document.querySelector('#btnLoadConfig')
const tacountCkeckBox = document.querySelector('#systemValueTAcount')
const btnSaveConfig = document.querySelector('#btnSaveConfig')

//System consts
const systemRowStart = document.querySelector('#systemRowStart')
const systemRowLimit = document.querySelector('#systemRowLimit')
const systemDateColumn = document.querySelector('#systemDateColumn')
const systemDateNulls = document.querySelector('#systemDateNulls')
const systemValueTAcount = document.querySelector('#systemValueTAcount')
const systemDescriptionColumn = document.querySelector('#systemDescriptionColumn')
const systemDescriptionNulls = document.querySelector('#systemDescriptionNulls')
const systemValueColumn = document.querySelector('#systemValueColumn')
const systemValueNulls = document.querySelector('#systemValueNulls')
const systemValueCreditColumn = document.querySelector('#systemValueCreditColumn')
const systemValueCreditNulls = document.querySelector('#systemValueCreditNulls')
const systemValueDebitColumn = document.querySelector('#systemValueDebitColumn')
const systemValueDebitNulls = document.querySelector('#systemValueDebitNulls')

//Bank consts
const bankRowStart = document.querySelector('#bankRowStart')
const bankRowLimit = document.querySelector('#bankRowLimit')
const bankDateColumn = document.querySelector('#bankDateColumn')
const bankDateNulls = document.querySelector('#bankDateNulls')
const bankDescriptionColumn = document.querySelector('#bankDescriptionColumn')
const bankDescriptionNulls = document.querySelector('#bankDescriptionNulls')
const bankValueColumn = document.querySelector('#bankValueColumn')
const bankValueNulls = document.querySelector('#bankValueNulls')
const bankRegex = document.querySelector('#bankRegex')
const bankSetYear = document.querySelector('#bankSetYear')

setConfigInput('bankRegex', 'regex')
loadCurrentConf()

tacountCkeckBox.addEventListener('change', () =>{
    if (tacountCkeckBox.checked) {
        systemValueColumn.setAttribute('disabled','')
        systemValueNulls.setAttribute('disabled','')
        systemValueCreditColumn.removeAttribute('disabled')
        systemValueCreditNulls.removeAttribute('disabled')
        systemValueDebitColumn.removeAttribute('disabled')
        systemValueDebitNulls.removeAttribute('disabled')
    }else{
        systemValueColumn.removeAttribute('disabled')
        systemValueNulls.removeAttribute('disabled')
        systemValueCreditColumn.setAttribute('disabled','')
        systemValueCreditNulls.setAttribute('disabled','')
        systemValueDebitColumn.setAttribute('disabled','')
        systemValueDebitNulls.setAttribute('disabled','')
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

btnDownLoadJsonFile.addEventListener('click', () =>{
    const txtJsonFileName = document.querySelector('#txtJsonFileName')
    const jsonData = JSON.parse(savedConf)
    downloadJsonFile(jsonData, txtJsonFileName.value)
})

btnSaveConfig.addEventListener('click', () =>{
    const getConfigResponse = getFormConfig()
    if(getConfigResponse.status){
        try {
            const confString = JSON.stringify(getConfigResponse.data)
            saveConfig(confString)  
            Swal.fire({
                icon: "success",
                title: "Guardado",
                text: "Configuración guardada correctamente. Actualice el navegador para aplicar los cambios correctamente."
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al intentar almacenar configuración",
                text: error
            })
        }
    }else{
        Swal.fire({
            icon: "error",
            title: "Error",
            text: getConfigResponse.msg
        })
    }
})

/// pendiente tramitar errores en cada parte | revisar todo
const getFormConfig = () =>{
    let bankRowLimitValue
    let bankDateConf
    let systemValueConf
    let systemRowLimitValue

    if (!bankRowStart.value) {
        return {status:false,msg:'La fila inicial en configuracion - Banco, es obligatoria'}
    }

    bankRowLimit.value ? bankRowLimitValue = parseInt(bankRowLimit.value) : bankRowLimitValue = false

    if (bankRegex.value === 'false') {
        bankDateConf = {
            column:bankDateColumn.value
        }
    }else{
        let bankSetYearBolean
        bankSetYear.value === '1' ? bankSetYearBolean = true : bankSetYearBolean = false
        bankDateConf = {
            column:bankDateColumn.value,
            readByRegex: parseInt(bankRegex.value),
            setYear:bankSetYearBolean
        }
    }

    if (!bankDescriptionColumn.value) {
        return {status:false,msg:'La descripción en configuracion - Banco, es obligatoria'}
    }

    if (!bankValueColumn.value) {
        return {status:false,msg:'El la columna valor en configuracion - Banco, es obligatorio'}
    }

    if (!systemRowStart.value) {
        return {status:false,msg:'La fila inicial en configuracion - Sistema, es obligatoria'}
    }

    systemRowLimit.value ? systemRowLimitValue = parseInt(systemRowLimit.value) : systemRowLimitValue = false

    if (!systemDateColumn.value) {
        return {status:false,msg:'La columna fecha en configuracion - Sistema, es obligatoria'}
    }

    if (!systemDescriptionColumn.value) {
        return {status:false,msg:'La columna descripcion en configuracion - Sistema, es obligatoria'}
    }

    if (systemValueTAcount.checked) {

        if (!systemValueCreditColumn.value) {
            return {status:false,msg:'La columna credito en configuracion - Sistema, es obligatoria'}
        }
        if (!systemValueDebitColumn.value) {
            return {status:false,msg:'La columna debito en configuracion - Sistema, es obligatoria'}
        }

        systemValueConf = {
            t_acount:{
                credit:systemValueCreditColumn.value,
                debit:systemValueDebitColumn.value
            }
        }

    }else{
        if (!systemValueColumn.value) {
            return {status:false,msg:'La columna valor en configuracion - Sistema, es obligatoria'}
        }
        systemValueConf = {
            column:systemValueColumn.value
        }
    }

    let configObject = {

        bankConf:{
            rowStart:parseInt(bankRowStart.value),
            rowLimit:bankRowLimitValue,
            date:bankDateConf,
            description:{
                column:bankDescriptionColumn.value
            },
            value:{
                column:bankValueColumn.value
            }
        },
        systemConf:{
            rowStart: parseInt(systemRowStart.value),
            rowLimit:systemRowLimitValue,
            date:{
                column:systemDateColumn.value
            },
            description:{
                column:systemDescriptionColumn.value
            },
            value:systemValueConf
        }
    }

    return {status:true, data: configObject}
}

function loadCurrentConf(){
    if (savedConf) {
        //system conf getters
        currentConf = JSON.parse(savedConf)

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