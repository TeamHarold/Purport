module.exports = Purport = () => {
    let _libs = {}
    let libs = {}
    let Purport = {}
    
    let Module = require('module')
    let originalRequire = Module.prototype.require

    Module.prototype.require = function (lib){
        if (_libs[lib] === undefined || _libs[lib] === null){
            libs[lib] = { ...originalRequire(lib)}
            _libs[lib] = { ...libs[lib] }
            Purport[lib] = buildFuncs(lib)
        }
        return _libs[lib]
    }

    const buildFuncs = (lib) => {
        let self = {
            args: {},
            values: {},
            callCount: {},
            eventHandlers: {},
            wasCalled: {},
            mock: (func, repl, eventHandlers) => {
                self.args[func] = []
                self.values[func] = []
                self.callCount[func] = 0
                self.wasCalled[func] = () => (self.callCount[func] > 0)
                self.eventHandlers[func] = { preHook: ()=>{}, postHook: ()=>{}, ...eventHandlers }
                _libs[lib][func] = (...args) => {
                    self.args[func].push([...args])
                    self.callCount[func] += 1
                    self.eventHandlers[func].preHook()
                    const returnVal = repl(...args)
                    self.values[func].push(returnVal)
                    self.eventHandlers[func].postHook()
                    return returnVal
                }
            },
            record: (func) => {
                self.args[func] = []
                self.values[func] = []
                self.callCount[func] = 0
                self.wasCalled[func] = () => (self.callCount[func] > 0)
                _libs[lib][func] = (...args) => {
                    self.args[func].push([...args])
                    self.callCount[func] += 1
                    const returnVal = libs[lib][func](...args)
                    self.values[func].push(returnVal)
                    return returnVal
                }
            },
            stub: (func, repl) => {
                _libs[lib][func] = repl
            },
            reset: () => {
                for (var kv in libs[lib]){
                    _libs[lib][kv] = libs[lib][kv]
                    args = {}
                    values = {}
                    callCount = {}
                    eventHandlers = {}
                    wasCalled = {}
                }
            }
        }
        return self
    }
    //todo: do something with this tho
    Purport.mocked = (obj) => {
        return mock(obj)
    }
    return Purport
}






const mock = (obj) => {
    let _orig = { ...obj }
    let mocked = (...args) => {
        obj(...args)
    }
    for (let prop in Object.entries(obj)){
        console.log(prop)
    }
    return () => {}
}

//TODO: use this??
module.exports.mockThis = () => {}