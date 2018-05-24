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
            callCount: {},
            eventHandlers: {},
            wasCalled: {},
            mock: (func, repl, eventHandlers) => {
                self[func] = []
                self.callCount[func] = 0
                self.wasCalled[func] = () => (self.callCount[func] > 0)
                self.eventHandlers[func] = { preHook: ()=>{}, postHook: ()=>{}, ...eventHandlers }
                _libs[lib][func] = (...args) => {
                    self[func].push([...args])
                    self.callCount[func] += 1
                    self.eventHandlers[func].preHook()
                    const returnVal = repl()
                    self.eventHandlers[func].postHook()
                    return returnVal
                }
            },
            stub: (func, repl) => {
                _libs[lib][func] = repl
            },
            reset: () => {
                for (var kv in libs[lib]){
                    _libs[lib][kv] = libs[lib][kv]
                }
            }
        }
        return self
    }

    return Purport
}