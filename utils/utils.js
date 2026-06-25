import { getAccount } from "../db.js";

function createIdGenerator() {
    let countId = 0;
    return function () {
        countId++
        return countId
    }
}
export const IdGenerator = createIdGenerator()

export function createAccountIsValid(name, type, balance) {
    if (
        !name || !['Regular', 'Premium', 'Student'].includes(type) || balance < 0) {
            return false
        }
    return true
}

export function accValidation(id) {
    acc = getAccount(id)
    if (!acc || !acc.isActive) {
        return false
    }
    return true
}

export function atmValidation(amount, atmAction) {

    if (atmAction === 'deposit' && amount <= 0) {
        return false
    } else if (atmAction === 'withraw' && acc.balance < amount) {
        return false
    }
    return true
}