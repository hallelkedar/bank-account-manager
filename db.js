const BankAccounts = []

export function addAccount(account) {
    BankAccounts.push(account)
}

export function getAllAccounts() {
    return Object.entries(BankAccounts)
}

export function getAccount(id) {
    return BankAccounts.find(acc => acc.id === id)
}

export function getAccountByName(name) {
    const accName = name.trim().toLowerCase()
    return BankAccounts.filter(
        acc => acc.fullName.trim().toLowerCase() === accName
    )
}

export function getStatistics() {
    return {
        totalCustomers: BankAccounts.length,
        activeAccounts: BankAccounts.reduce(
            (total, account) => account.isActive ? total+1 : total, 0
        ),
        totalMoney: BankAccounts.reduce(
            (total, account) => total + account.balance, 0
        ),
        getAvargeBalance() {
            return this.totalMoney / this.activeAccounts
        },
        highestBalance: BankAccounts.reduce(
            (max, account) => account.balance > max ? max = account.balance : max, 0
        )

        }
    }
