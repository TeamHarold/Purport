module.exports = Purport = () => {
    let _libs = {}
    let libs = {}
    let Purport = {}
    
    let Module = require('module')
    let originalRequire = Module.prototype.require

    Module.prototype.require = function (lib){
        libs[lib] = { ...originalRequire(lib)}
        _libs[lib] = { ...libs[lib] }
        Purport[lib] = buildFuncs(lib)
        return _libs[lib]
    }

    const buildFuncs = (lib) => {
        let self = {
            mock: (func, repl) => {
                self[func] = []
                _libs[lib][func] = (...args) => {
                    self[func].push([...args])
                    return repl()
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