const Purport = require("./index")()
const Sample = require("./sample")
const Sample2 = require("./sample2")

//baseline - sample(s).testFunc(s) fire as expected
if (Sample.testFunc() !== false ){ throw Error("sample test function not returning false as expected") }
if (Sample2.testFunc2() !== 0 ){ throw Error("sample test function2 not returning zero as expected") }
if (Sample2.testFunc3() !== false ){ throw Error("sample test function3 not returning false as expected") }

//basic stub() tests
Purport["./sample"].stub("testFunc", () => true )
if (Sample.testFunc() !== true ){ throw Error("sample test function not being stubbed") }
Purport["./sample2"].stub("testFunc2", () => 1)
if (Sample2.testFunc2() !== 1 ){ throw Error("sample test function2 not returning one from stub as expected") }
Purport["./sample2"].stub("testFunc3", () => true)
if (Sample2.testFunc3() !== true ){ throw Error("sample test function3 not returning true from stub as expected") }

//basic reset() tests
Purport["./sample"].reset()
if (Sample.testFunc() !== false ){ throw Error("sample test function not resetting as expected") }
Purport["./sample2"].reset()
if (Sample2.testFunc2() !== 0 ){ throw Error("sample test function2 not resetting as expected") }
if (Sample2.testFunc3() !== false ){ throw Error("sample test function3 not resetting as expected") }

//basic mock() tests
Purport["./sample"].mock("testFunc", () => true )
if (Sample.testFunc("hi") !== true){ throw Error("sample test function not being mocked") }
if (Purport["./sample"].testFunc[0][0] !== "hi"){ throw Error("sample test function mock not recording properly") }
Sample.testFunc("testing")
if (Purport["./sample"].testFunc[1][0] !== "testing"){ throw Error("sample test function mock not recording properly") }
Sample.testFunc(1,2,3,4)
if (Purport["./sample"].testFunc[2][3] !== 4){ throw Error("sample test function mock not recording properly") }

Purport["./sample"].reset()
if (Sample.testFunc() !== false ){ throw Error("sample test function not resetting as expected") }

//basic nested require() override tests
Purport["./sample"].stub("testFunc", () => "test")
if (Sample2.testFunc3() !== "test" ){ throw Error("stubbing not affecting nested requires() as expected") }

//callCount/wasCalled Tests
Purport["./sample"].mock("testFunc", () => null)
if (Purport["./sample"].callCount.testFunc !== 0){ throw Error("call count not starting at 0 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== false){ throw Error("wasCalled not false as expected") }

Sample.testFunc()
if (Purport["./sample"].callCount.testFunc !== 1){ throw Error("call count not incrementing to 1 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }

Sample.testFunc()
if (Purport["./sample"].callCount.testFunc !== 2){ throw Error("call count not incrementing to 2 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }

Purport["./sample"].reset()
//pre & post hook event callback tests
let testPreHook = false
let testPostHook = false
let syncWait = () => {
    var start = Date.now(),
        now = start;
    while (now - start < 15) {
      now = Date.now();
    }
}

Purport["./sample"].mock('testFunc', syncWait, { preHook: ()=> { testPreHook = Date.now() }, postHook: ()=> { testPostHook = Date.now() }})
Sample.testFunc()

if (testPreHook === false || testPostHook === false){ throw Error("event handlers not fired as expected") }
if (testPreHook >= testPostHook){ throw Error("hooks not fired in the expected order") }

console.log("Tests passed successfully")
process.exit(0)