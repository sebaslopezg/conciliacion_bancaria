function setTransactions(params) {
    const arrMain = params.arrMain.array
    const arrSecond = params.arrSecond.array
    // Create sets of transaction keys for efficient lookup
    const arrMainKeys = new Set(arrMain.map(getTransactionKey))
    const arrSecondKeys = new Set(arrSecond.map(getTransactionKey))
    
    // Add status to arrMain transactions
    const arrMainWithStatus = arrMain.map(transaction => ({
        ...transaction,
        status: arrSecondKeys.has(getTransactionKey(transaction)) ? 'found' : 'not_found'
    }))
    
    // Add status to arrSecond transactions
    const arrSecondWithStatus = arrSecond.map(transaction => ({
        ...transaction,
        status: arrMainKeys.has(getTransactionKey(transaction)) ? 'found' : 'not_found'
    }))
    
    return {
        [params.arrMain.name]: arrMainWithStatus,
        [params.arrSecond.name]: arrSecondWithStatus
    }
}

const getTransactionKey = (transaction) => {
    let transactionDate

    if (isNaN(transaction.date)) {
        transactionDate = transaction.date
    } else {
        transactionDate = XLSX.SSF.format('d/mm/yyyy', transaction.date)
    }

    const dateParts = transactionDate.split('/')
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
    
    // Convert value to positive for comparison key
    const positiveValue = Math.abs(transaction.value)
    
    return `${formattedDate}-${positiveValue}`
}


/* function setTransactions(params) {
    const arrMain = params.arrMain.array
    const arrSecond = params.arrSecond.array
    // Create sets of transaction keys for efficient lookup
    const arrMainKeys = new Set(arrMain.map(getTransactionKey))
    const arrSecondKeys = new Set(arrSecond.map(getTransactionKey))
    
    // Add status to arrMain transactions
    const arrMainWithStatus = arrMain.map(transaction => ({
        ...transaction,
        status: arrSecondKeys.has(getTransactionKey(transaction)) ? 'found' : 'not_found'
    }))
    
    // Add status to arrSecond transactions
    const arrSecondWithStatus = arrSecond.map(transaction => ({
        ...transaction,
        status: arrMainKeys.has(getTransactionKey(transaction)) ? 'found' : 'not_found'
    }))
    
    return {
        [params.arrMain.name]: arrMainWithStatus,
        [params.arrSecond.name]: arrSecondWithStatus
    }
}

const getTransactionKey = (transaction) => {
    let transactionDate

    if (isNaN(transaction.date)) {
        transactionDate = transaction.date
    } else {
        transactionDate = XLSX.SSF.format('d/mm/yyyy', transaction.date)
    }

    const dateParts = transactionDate.split('/')
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
    
    return `${formattedDate}-${transaction.value}`
}
 */