function createIdGenerator() {
    let countId = 0;
    return function () {
        countId++
        return countId
    }
}
export const IdGenerator = createIdGenerator()

function accountTypeValid(acc) {
    
}