const sample = require("./sample")
module.exports = Sample2 = {
    testFunc2: () => {
        return 0
    },
    testFunc3: () => {
        return sample.testFunc()
    }
}