function setTransactions(arrMain, arrSecond){
    let response = {}
    const mismatches = []
    const matchedTransactions = []

    const arrMainKeys = new Set(arrMain.map(getTransactionKey))

    for (const transaction of arrSecond) {
        const key = getTransactionKey(transaction)
        if(!arrMainKeys.has(key)){
            mismatches.push(transaction)
        }else{
            matchedTransactions.push(transaction)
        }
    }

    const arrSecondKeys = new Set(arrSecond.map(getTransactionKey))
    for (const transaction of arrMain){
        const key = getTransactionKey(transaction)
        if(!arrSecondKeys.has(key)){
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
     let transactionDate

    if (isNaN(transaction.date)) {
        transactionDate = transaction.date
    }else{
        transactionDate = XLSX.SSF.format('d/mm/yyyy', transaction.date)
    }

    const dateParts = transactionDate.split('/')

    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
    return `${formattedDate}-${transaction.value}`
}