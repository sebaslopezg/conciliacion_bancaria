function setTransactions(arrMain, arrSecond){
    let response = {}
    const mismatches = []
    const matchedTransactions = []

    const arrMainKeys = new Set(arrMain.map(getTransactionKey))

    for (const transaction of arrSecond) {
        const key = getTransactionKey(transaction);
        if(!arrMainKeys.has(key)) {
            mismatches.push(transaction)
        }else {
            matchedTransactions.push(transaction)
        }
    }

    const arrSecondKeys = new Set(arrSecond.map(getTransactionKey))
    for (const transaction of arrMain) {
        const key = getTransactionKey(transaction)
        if (!arrSecondKeys.has(key)) {
            mismatches.push(transaction)
        }else{
            matchedTransactions.push(transaction)
        }
    }

    return response = {
        noCoincide: mismatches,
        coincide:matchedTransactions
    }
}

const getTransactionKey = (transaction) => {
    const dateParts = transaction.date.split('/')
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
    return `${formattedDate}-${transaction.value}`
}

const object1 = [
    {
        "date": "01/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.09
    },
    {
        "date": "02/01/2025",
        "descripcion": "PAGO INTEGRAL GROUP SOLUTION",
        "value": 1783297
    },
    {
        "date": "02/01/2025",
        "descripcion": "PAGO SEGUROS DE VIDA SURAMER",
        "value": -21115
    },
    {
        "date": "06/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.15
    },
    {
        "date": "07/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 50000
    },
    {
        "date": "07/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.03
    },
    {
        "date": "07/01/2025",
        "descripcion": "PAGO INTEGRAL GROUP SOLUTION",
        "value": 24724
    },
    {
        "date": "07/01/2025",
        "descripcion": "PAGO SEGUROS DE VIDA SURAMER",
        "value": -21115
    },
    {
        "date": "08/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 120000
    },
    {
        "date": "08/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 300000
    },
    {
        "date": "08/01/2025",
        "descripcion": "COMPRA EN EDS ESSO E",
        "value": -35000
    },
    {
        "date": "08/01/2025",
        "descripcion": "PAGO PSE NU Colombia Compañía",
        "value": 50000
    },
    {
        "date": "08/01/2025",
        "descripcion": "TRANSFERENCIA CTA SUC VIRTUAL",
        "value": -250000
    }
]

const object2 = [
    {
        "date": "1/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.09
    },
    {
        "date": "2/01/2025",
        "descripcion": "PAGO INTEGRAL GROUP SOLUTION",
        "value": -24724
    },
    {
        "date": "2/01/2025",
        "descripcion": "PAGO SEGUROS DE VIDA SURAMER",
        "value": -21115
    },
    {
        "date": "6/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.15
    },
    {
        "date": "7/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 50000
    },
    {
        "date": "7/01/2025",
        "descripcion": "ABONO INTERESES AHORROS",
        "value": 0.03
    },
    {
        "date": "7/01/2025",
        "descripcion": "PAGO INTEGRAL GROUP SOLUTION",
        "value": -24724
    },
    {
        "date": "7/01/2025",
        "descripcion": "PAGO SEGUROS DE VIDA SURAMER",
        "value": -21115
    },
    {
        "date": "8/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 120000
    },
    {
        "date": "8/01/2025",
        "descripcion": "TRANSFERENCIA DESDE NEQUI",
        "value": 300000
    },
    {
        "date": "8/01/2025",
        "descripcion": "COMPRA EN EDS ESSO E",
        "value": -35000
    },
    {
        "date": "8/01/2025",
        "descripcion": "PAGO PSE NU Colombia Compañía",
        "value": -50000
    },
    {
        "date": "8/01/2025",
        "descripcion": "TRANSFERENCIA CTA SUC VIRTUAL",
        "value": -250000
    }
]

const result = setTransactions(object1, object2)
console.log(result)
