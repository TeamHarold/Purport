# Purport
> **__verb__**: *appear or claim to be or do something, especially falsely; profess.*
### Zero Dependency NodeJS *require()* Mocking

***

Overrides standard requires() - just require & fire Purport before your other dependencies
```
const Purport = require("purport")()
const module = require("yourModule")
```

## Methods
### stub(methodName, () => { ... } )
#### For when you just want to replace an existing function
Call to override your required libraries method with a stub function
```
Purport.yourModule.stub('testFunction', () => true) //replaces yourModule.testFunction
console.log(yourModule.testFunction()) //true

//also works with async/promises
Purport.yourModule.stub('testAsync', async () => { ... })
Purport.yourModule.stub('testPromise', new Promise( ... ))
```

### record(methodName)
#### Observe the inputs/outputs of existing functions
##### Exposes properties:
###### Purport.yourModule.callCount.yourFunc - number of times the method was called
###### Purport.yourModule.wasCalled.yourFunc() - true if the method has been called at least once
```
Purport.yourModule.record('someFunc')
Purport.yourModule.callCount.someFunc // 0
Purport.yourModule.wasCalled.someFunc() // false

yourModule.someFunc()

Purport.yourModule.callCount.someFunc // 1
Purport.yourModule.wasCalled.someFunc() // true
```

> TODO: async/promises? not tested

### mock()
TODO: document me plz ;(

> Mocked functions also expose additional data:
    
### reset()
Call to reset your module to default
```
yourModule.falseFunction() //returns false
Purport.yourModule.stub('testFunction', () => true)
yourModule.falseFunction() //returns true

Purport.yourModule.reset()
yourModule.falseFunction() //returns false
```
