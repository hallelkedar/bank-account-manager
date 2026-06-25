const BankAccounts = []

function addAccount(account) {
    BankAccounts.push(account)
}

function getAllAccounts() {
    return Object.entries(BankAccounts)
}

function getAccount(id) {
    return BankAccounts.find(acc => acc.id === id)
}

function deleteAccount(id) {
    const acc = getAccount(id)
    if (!acc) return false
    
    const index = BankAccounts.findIndex(
        (acc, id) => acc.id
    )

    BankAccounts.splice(index, 1)
    }
