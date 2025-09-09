function findMismatchedTransactions(arr1, arr2) {
    const mismatches = []
    const matchedTransactions = new Set()

    // Helper function to create a unique key for each transaction
    const getTransactionKey = (transaction) => {
        // Use a consistent date format (e.g., YYYY-MM-DD) for comparison
        const dateParts = transaction.date.split('/')
        const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
        return `${formattedDate}-${transaction.value}`
    }

    // Build a set of unique keys from the first array for efficient lookup
    const arr1Keys = new Set(arr1.map(getTransactionKey))

    // Iterate through the second array and find mismatches
    for (const transaction of arr2) {
        const key = getTransactionKey(transaction);
        if(!arr1Keys.has(key)) {
            mismatches.push(transaction)
        } else {
            // Keep track of matched transactions in arr2 to handle duplicates
            matchedTransactions.add(key)
        }
    }

    // Now, iterate through the first array to find transactions not matched in the second
    const arr2Keys = new Set(arr2.map(getTransactionKey))
    for (const transaction of arr1) {
        const key = getTransactionKey(transaction)
        if (!arr2Keys.has(key)) {
            mismatches.push(transaction)
        }
    }

    return mismatches
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

const mismatches = findMismatchedTransactions(object1, object2)
console.log('No coinciden: ')
console.log(mismatches)