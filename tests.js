const Purport = require("./index")()
const Sample = require("./sample")
if (Sample.testFunc() !== false ){ throw Error("sample test function not returning false as expected") }

Purport["./sample"].stub("testFunc", () => { return true })
if (Sample.testFunc() !== true ){ throw Error("sample test function not being stubbed") }

Purport["./sample"].reset()
if (Sample.testFunc() !== false ){ throw Error("sample test function not resetting as expected") }

Purport["./sample"].mock("testFunc", () => { return true })
if (Sample.testFunc("hi") !== true){ throw Error("sample test function not being mocked") }
if (Purport["./sample"].testFunc[0][0] !== "hi"){ throw Error("sample test function mock not recording properly") }

Purport["./sample"].reset()
if (Sample.testFunc() !== false ){ throw Error("sample test function not resetting as expected") }

console.log("Tests passed successfully")
process.exit(0)