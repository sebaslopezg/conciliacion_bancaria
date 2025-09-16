let savedConf = localStorage.getItem('conf')
const btnLoadConfig = document.querySelector('#btnLoadConfig')
const tacountCkeckBox = document.querySelector('#systemValueTAcount')
const btnSaveConfig = document.querySelector('#btnSaveConfig')
const btnAddSystemCustomValue = document.querySelector('#btnAddSystemCustomValue')
const btnAddBankCustomValue = document.querySelector('#btnAddBankCustomValue')

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

btnAddSystemCustomValue.addEventListener('click', () =>{
    addCustomValue('displaySystemCustomValues')
})

btnAddBankCustomValue.addEventListener('click', () =>{
    addCustomValue('displayBankCustomValues')
})

//eventos para uppercase
const inputsToUpper = [
    systemDateColumn,
    systemDescriptionColumn,
    systemValueColumn,
    systemValueCreditColumn,
    systemValueDebitColumn,
    bankDateColumn,
    bankDescriptionColumn,
    bankValueColumn,
]

inputsToUpper.forEach(input => {
    input.addEventListener('keyup', () =>{
        input.value = input.value.toUpperCase()
    })
})

/// pendiente tramitar errores en cada parte | revisar todo
const getFormConfig = () =>{
    let bankRowLimitValue
    let bankDateConf
    let systemValueConf
    let systemRowLimitValue
    let bankDateColumnValue
    let systemValueCreditNullsValue
    let systemValueDebitNullsValue
    let bankDescriptionNullsValue
    let bankValueNullsValue
    let systemDateNullsValue
    let systemDescriptionNullsValue
    let systemValueNullsValue

    if (!bankRowStart.value) {
        return {status:false,msg:'La fila inicial en configuracion - Banco, es obligatoria'}
    }

    if (!bankDateNulls.value) {
        return {status:false,msg:'Definir el estado nulo de la fecha en configuracion - Banco, es obligatoria'}
    }

    bankRowLimit.value ? bankRowLimitValue = parseInt(bankRowLimit.value) : bankRowLimitValue = false

    bankDateNulls.value === '1' ? bankDateColumnValue = true : bankDateColumnValue = false

    if (bankRegex.value === 'false') {
        bankDateConf = {
            column:bankDateColumn.value,
            nulls:bankDateColumnValue
        }
    }else{

        let bankSetYearBolean
        bankSetYear.value === '1' ? bankSetYearBolean = true : bankSetYearBolean = false

        bankDateConf = {
            column:bankDateColumn.value,
            readByRegex: parseInt(bankRegex.value),
            setYear:bankSetYearBolean,
            nulls:bankDateColumnValue
        }
    }

    if (!bankDescriptionColumn.value) {
        return {status:false,msg:'La descripción en configuracion - Banco, es obligatoria'}
    }

    if (!bankDescriptionNulls.value) {
        return {status:false,msg:'Definir el estado nulo de la descripción en configuracion - Banco, es obligatoria'}
    }

    if (!bankValueColumn.value) {
        return {status:false,msg:'El la columna valor en configuracion - Banco, es obligatorio'}
    }

    if (!bankValueNulls.value) {
        return {status:false,msg:'Definir el estado nulo del valor en configuracion - Banco, es obligatorio'}
    }

    if (!systemRowStart.value) {
        return {status:false,msg:'La fila inicial en configuracion - Sistema, es obligatoria'}
    }

    systemRowLimit.value ? systemRowLimitValue = parseInt(systemRowLimit.value) : systemRowLimitValue = false

    if (!systemDateColumn.value) {
        return {status:false,msg:'La columna fecha en configuracion - Sistema, es obligatoria'}
    }

    if (!systemDateNulls.value) {
        return {status:false,msg:'Definir el estado nulo de la fecha en configuracion - Sistema, es obligatoria'}
    }

    if (!systemDescriptionColumn.value) {
        return {status:false,msg:'La columna descripcion en configuracion - Sistema, es obligatoria'}
    }

    if (!systemDescriptionNulls.value) {
        return {status:false,msg:'Definir el estado nulo de la descripción en configuracion - Sistema, es obligatoria'}
    }

    if (systemValueTAcount.checked) {

        if (!systemValueCreditColumn.value) {
            return {status:false,msg:'La columna credito en configuracion - Sistema, es obligatoria'}
        }
        if (!systemValueCreditNulls.value) {
            return {status:false,msg:'Definir el estado nulo del credito en configuracion - Sistema, es obligatoria'}
        }
        if (!systemValueDebitColumn.value) {
            return {status:false,msg:'La columna debito en configuracion - Sistema, es obligatoria'}
        }
        if (!systemValueDebitNulls.value) {
            return {status:false,msg:'Definir el estado nulo del debito en configuracion - Sistema, es obligatoria'}
        }

        systemValueCreditNulls.value == '1' ? systemValueCreditNullsValue = true : systemValueCreditNullsValue = false
        systemValueDebitNulls.value == '1' ? systemValueDebitNullsValue = true : systemValueDebitNullsValue = false

        console.log(systemValueCreditNulls.value)

        systemValueConf = {
            t_acount:{
                credit:{
                    column:systemValueCreditColumn.value,
                    nulls:systemValueCreditNullsValue
                },
                debit:{
                    column:systemValueDebitColumn.value,
                    nulls:systemValueDebitNullsValue
                }
            }
        }

    }else{
        if (!systemValueColumn.value) {
            return {status:false,msg:'La columna valor en configuracion - Sistema, es obligatoria'}
        }
        if (!systemValueNulls.value) {
            return {status:false,msg:'Definir el estado nulo del valor en configuracion - Sistema, es obligatoria'}
        }

        systemValueNulls.value === '1' ? systemValueNullsValue = true : systemValueNullsValue = false 

        systemValueConf = {
            column:systemValueColumn.value,
            nulls:systemValueNullsValue
        }
    }

    bankDescriptionNulls.value === '1' ? bankDescriptionNullsValue = true : bankDescriptionNullsValue = false
    bankValueNulls.value === '1' ? bankValueNullsValue = true : bankValueNullsValue = false

    systemDateNulls.value === '1' ? systemDateNullsValue = true : systemDateNullsValue = false
    systemDescriptionNulls.value === '1' ? systemDescriptionNullsValue = true : systemDescriptionNullsValue = false

    let configObject = {

        bankConf:{
            rowStart:parseInt(bankRowStart.value),
            rowLimit:bankRowLimitValue,
            date:bankDateConf,
            description:{
                column:bankDescriptionColumn.value,
                nulls:bankDescriptionNullsValue
            },
            value:{
                column:bankValueColumn.value,
                nulls:bankValueNullsValue
            }
        },
        systemConf:{
            rowStart: parseInt(systemRowStart.value),
            rowLimit:systemRowLimitValue,
            date:{
                column:systemDateColumn.value,
                nulls:systemDateNullsValue
            },
            description:{
                column:systemDescriptionColumn.value,
                nulls:systemDescriptionNullsValue
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
            const systemConf = currentConf.systemConf
            'rowStart' in systemConf ? setInput('text', systemRowStart, systemConf.rowStart) : ''
            if ('rowLimit' in systemConf) {
                systemConf.rowLimit == 'false' ? setInput('text', systemRowLimit, systemConf.rowLimit) : ''
            }

            if ('date' in systemConf) {
                const date = systemConf.date
                if ('column' in date) {
                    setInput('text', systemDateColumn, date.column)
                }
                if (date.nulls) {
                    setInput('select', systemDateNulls, "1")
                }else{
                    setInput('select', systemDateNulls, "0")
                }
            }

            if ('description' in systemConf) {
                const description = systemConf.description
                if ('column' in description) {
                    setInput('text', systemDescriptionColumn, description.column)
                    if (description.nulls) {
                        setInput('select', systemDescriptionNulls, "1")
                    }else{
                        setInput('select', systemDescriptionNulls, "0")
                    }
                }
            }

            if ('value' in systemConf) {
                const dataValue = systemConf.value
                if ('t_acount' in dataValue) {
                    setInput('checkbox', systemValueTAcount, true)
                    setInput('state', systemValueCreditColumn, true)
                    setInput('state', systemValueCreditNulls, true)
                    setInput('state', systemValueDebitColumn, true)
                    setInput('state', systemValueDebitNulls, true)
                    setInput('state', systemValueColumn, false)
                    setInput('state', systemValueNulls, false)
                    if ('credit' in dataValue.t_acount) {
                        setInput('text', systemValueCreditColumn, dataValue.t_acount.credit.column)

                        if (dataValue.t_acount.credit.nulls) {
                            setInput('select', systemValueCreditNulls, "1")
                        }else{
                            setInput('select', systemValueCreditNulls, "0") 
                        } 
                    }
                    if ('debit' in dataValue.t_acount) {
                        setInput('text', systemValueDebitColumn, dataValue.t_acount.debit.column)

                        if (dataValue.t_acount.debit.nulls) {
                            setInput('select', systemValueDebitNulls, "1")
                        }else{
                            setInput('select', systemValueDebitNulls, "0") 
                        } 
                    }
                }else{
                    setInput('checkbox', systemValueTAcount, false)
                    setInput('state', systemValueCreditColumn, false)
                    setInput('state', systemValueCreditNulls, false)
                    setInput('state', systemValueDebitColumn, false)
                    setInput('state', systemValueDebitNulls, false)
                    setInput('state', systemValueColumn, true)
                    setInput('state', systemValueNulls, true)
                    if ('column' in dataValue) {
                        setInput('text', systemValueColumn, dataValue.column)
                        if (dataValue.nulls) {
                            setInput('select', systemValueNulls, "1") 
                        }else{
                            setInput('select', systemValueNulls, "0") 
                        }
                    }
                }
            }
        }

        //bank conf getters
        if ('bankConf' in currentConf) {
            const bankConf = currentConf.bankConf
            'rowStart' in bankConf ? setInput('text', bankRowStart, bankConf.rowStart) : ''

            if ('rowLimit' in bankConf) {
                bankConf.rowLimit == 'false' ? setInput('text', bankRowLimit, bankConf.rowLimit) : ''
            }

            if ('date' in bankConf) {
                const date = bankConf.date

                if ('column' in date) {
                    setInput('text', bankDateColumn, date.column)
                }

                if ('nulls' in date) {                    
                    if (date.nulls) {
                        setInput('select', bankDateNulls, "1")
                    }else{
                        setInput('select', bankDateNulls, "0")
                    }
                }

                if ('readByRegex' in bankConf.date) {
                    if(date.readByRegex != false || date.readByRegex != 'false'){
                        setInput('select', bankRegex, date.readByRegex)
                    }
                }
                if ('setYear' in date) {
                    const setYearValue = date.setYear
                    setYearValue ? setInput('select', bankSetYear, "1") : setInput('select', bankSetYear, "0")   
                }
            }

            if ('description' in bankConf) {

                if ('column' in bankConf.description) {
                    setInput('text', bankDescriptionColumn, bankConf.description.column)
                }
                if ('nulls' in bankConf.description) {
                    if (bankConf.description.nulls) {
                       setInput('select', bankDescriptionNulls, "1") 
                    }else{
                        setInput('select', bankDescriptionNulls, "0")
                    }   
                }
            }

            if ('value' in bankConf) {
                if ('column' in bankConf.value) {
                    setInput('text', bankValueColumn, bankConf.value.column)
                }
                if ('nulls' in bankConf.value) {
                    if (bankConf.value.nulls) {
                        setInput('select', bankValueNulls, "1")
                    }else{
                        setInput('select', bankValueNulls, "0")
                    }
                }
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

function addCustomValue(displayId){
    const display = document.querySelector(`#${displayId}`)
    const uuid = crypto.randomUUID()

    let placeholderDiv = document.createElement('div')
    placeholderDiv.setAttribute("id", uuid)

    placeholderDiv.innerHTML = `
        <div class="row mb-3">

            <div class="col-2">
                <label for="column_${uuid}" class="form-label">Columna</label>
                <input type="text" class="form-control" id="column_${uuid}" aria-describedby="columnHelp_${uuid}">
                <div id="columnHelp_${uuid}" class="form-text">Columna a leer</div>
            </div>

            <div class="col-3">
                <label for="type_${uuid}" class="form-label">Tipo</label>
                    <select class="form-select" id="type_${uuid}" aria-describedby="typeHelp_${uuid}">
                        <option value="literal" selected>Literal</option>
                        <option value="relative">Relativo</option>
                    </select>
                    <div id="typeHelp_${uuid}" class="form-text">
                        Tipo de lectura
                    </div>
            </div>

            <div class="col-6">
                <label for="value_${uuid}" class="form-label">Valor</label>
                <input type="text" class="form-control" id="value_${uuid}" aria-describedby="valueHelp_${uuid}">
                <div id="valueHelp_${uuid}" class="form-text">Valor que se va a buscar en la lectura</div>
            </div>

            <div class="col-1">
                <button type="button" class="btn-close" aria-label="Close" onclick="deleteCustomForm('${uuid}')"></button>
            </div>

        </div>
    `
    display.appendChild(placeholderDiv)
}

function deleteCustomForm(id){
    const divForm = document.getElementById(id)
    if (divForm) {
        divForm.remove()
    }
}
