# Purport
NodeJS Import Mocking for Tests With Zero Dependencies
Overrides standard requires() - just require & fire Purport before your other dependencies
```
const Purport = require("purport")()
const module = require("yourModule")
```

##Methods
###Stub(methodName, func () => { ... } )
Call to override your required libraries method with a stub function
```
Purport.yourModule.stub('testFunction', () => true)
console.log(yourModule.testFunction()) //true
```

##Methods
###Mock()
TODO: document ;(
    
##Methods
###Reset()
Call to reset your module to the default
```
yourModule.falseFunction() //returns false
Purport.yourModule.stub('testFunction', () => true)
yourModule.falseFunction() //returns true

Purport.yourModule.reset()
yourModule.falseFunction() //returns false
```