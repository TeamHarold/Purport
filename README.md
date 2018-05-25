# Purport
NodeJS Import Mocking for Tests With Zero Dependencies
Overrides standard requires() - just require & fire Purport before your other dependencies
```
const Purport = require("purport")()
const module = require("yourModule")
```

## Methods
### Stub(methodName, () => { ... } )
#### For when you just want to replace an existing function
Call to override your required libraries method with a stub function
```
Purport.yourModule.stub('testFunction', () => true) //replaces yourModule.testFunction
console.log(yourModule.testFunction()) //true

//also works with async/promises
Purport.yourModule.stub('testAsync', async () => { ... })
Purport.yourModule.stub('testPromise', new Promise( ... ))
```

### Mock()
TODO: document me plz ;(
    
### Reset()
Call to reset your module to default
```
yourModule.falseFunction() //returns false
Purport.yourModule.stub('testFunction', () => true)
yourModule.falseFunction() //returns true

Purport.yourModule.reset()
yourModule.falseFunction() //returns false
```
