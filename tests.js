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
Purport['./sample'].reset()

//stub() async/promises
Purport['./sample'].stub("testAsync", async (shouldResolve) => { return new Promise((res, err)=> { return shouldResolve ? res(true) : err(false) })})
Sample.testAsync(true).then(x => { if (x !== true) throw Error("test promise stub did not resolve to true as expected")})
    .catch(x=>{throw Error("test promise stub did not resolve to true as expected")})
Sample.testAsync(false).then(x => {throw Error("test promise stub did not resolve to true as expected")})
    .catch(x=>{ if(x !== false) throw Error("test promise stub did not resolve to true as expected")})

//basic nested require() override tests
Purport["./sample2"].reset()
Purport["./sample"].stub("testFunc", () => "test")
if (Sample2.testFunc3() !== "test" ){ throw Error("stubbing not affecting nested requires() as expected") }

//basic reset() tests
Purport["./sample"].reset()
if (Sample.testFunc() !== false ){ throw Error("sample test function not resetting as expected") }
Purport["./sample2"].reset()
if (Sample2.testFunc2() !== 0 ){ throw Error("sample test function2 not resetting as expected") }
if (Sample2.testFunc3() !== false ){ throw Error("sample test function3 not resetting as expected") }

//basic record() tests
Purport["./sample"].reset()
Purport["./sample"].record("testFunc")
if (Purport["./sample"].callCount.testFunc !== 0){ throw Error("call count not starting at 0 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== false){ throw Error("wasCalled not false as expected") }
if (Sample.testFunc("hi") !== false){ throw Error("sample test function not being mocked") }
if (Purport["./sample"].callCount.testFunc !== 1){ throw Error("call count not incrementing to 1 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
if (Purport["./sample"].args.testFunc[0][0] !== "hi"){ throw Error("sample test function mock not recording input arguments properly") }
if (Purport["./sample"].values.testFunc[0] !== false){ throw Error("sample test function mock not recording returned values properly") }
Sample.testFunc("testing")
if (Purport["./sample"].callCount.testFunc !== 2){ throw Error("call count not incrementing to 2 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
if (Purport["./sample"].args.testFunc[1][0] !== "testing"){ throw Error("sample test function mock not recording properly") }
if (Purport["./sample"].values.testFunc[1] !== false){ throw Error("sample test function mock not recording returned values properly") }
Sample.testFunc(1,2,3,4)
if (Purport["./sample"].callCount.testFunc !== 3){ throw Error("call count not incrementing to 3 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
let args = Purport["./sample"].args.testFunc[2]
if (args[0] !== 1 && args[1] !== 2 && args[2] !== 3 && args[3] !== 4){ throw Error("sample test function mock not recording properly") }
if (Purport["./sample"].values.testFunc[2] !== false){ throw Error("sample test function mock not recording returned values properly") }
if (Purport["./sample"].values.testFunc.length !== 3){ throw Error("sample test function mock not recording returned values properly") }

//basic mock() tests
Purport["./sample"].mock("testFunc", (arg) => arg)
if (Purport["./sample"].callCount.testFunc !== 0){ throw Error("call count not starting at 0 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== false){ throw Error("wasCalled not false as expected") }
if (Sample.testFunc("hi") !== "hi"){ throw Error("sample test function not being mocked") }
if (Purport["./sample"].callCount.testFunc !== 1){ throw Error("call count not incrementing to 1 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
if (Purport["./sample"].args.testFunc[0][0] !== "hi"){ throw Error("sample test function mock not recording input arguments properly") }
if (Purport["./sample"].values.testFunc[0] !== "hi"){ throw Error("sample test function mock not recording returned values properly") }
Sample.testFunc("testing")
if (Purport["./sample"].callCount.testFunc !== 2){ throw Error("call count not incrementing to 2 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
if (Purport["./sample"].args.testFunc[1][0] !== "testing"){ throw Error("sample test function mock not recording properly") }
if (Purport["./sample"].values.testFunc[1] !== "testing"){ throw Error("sample test function mock not recording returned values properly") }
Sample.testFunc(1,2,3,4)
if (Purport["./sample"].callCount.testFunc !== 3){ throw Error("call count not incrementing to 3 as expected") }
if (Purport["./sample"].wasCalled.testFunc() !== true){ throw Error("wasCalled not true as expected") }
args = Purport["./sample"].args.testFunc[2]
if (args[0] !== 1 && args[1] !== 2 && args[2] !== 3 && args[3] !== 4){ throw Error("sample test function mock not recording properly") }
if (Purport["./sample"].values.testFunc[2] !== 1){ throw Error("sample test function mock not recording returned values properly") }
if (Purport["./sample"].values.testFunc.length !== 3){ throw Error("sample test function mock not recording returned values properly") }

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
if (testPreHook > testPostHook){ throw Error("hooks not fired in the expected order") }

console.log("Tests passed successfully")

// var test = () => "lol"
// console.log = Purport.mocked(console.log)
// console.log("llamas")
process.exit(0)