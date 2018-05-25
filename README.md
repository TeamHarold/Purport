# Purport
> **__verb__**: *appear or claim to be or do something, especially falsely; profess.*
### Zero Dependency NodeJS *require()* Mocking

***

Overrides standard requires() - just require & fire Purport before your other dependencies
```javascript
const Purport = require("purport")()
const module = require("yourModule")
```
***

## Methods

- [stub(methodName, cb)](#stubmethodname-cb)
- [record(methodName)](#recordmethodname)
- [mock(methodName, cb, events)](#mockmethodname-cb-hooks)
- [reset()](#reset)

***

### stub(methodName, cb)
#### For when you just want to replace an existing function
###### methodName: String value with the exact name of your function *(ex: function test()=>{} would be 'test')*
###### cb: The actual method to execute; can use async/await or promises *(ex: () => { return true })*

Call to override your required libraries method with a stub function
```javascript
Purport.yourModule.stub('testFunction', () => true) //replaces yourModule.testFunction
console.log(yourModule.testFunction()) //true

//also works with async/promises
Purport.yourModule.stub('testAsync', async () => { ... })
Purport.yourModule.stub('testPromise', new Promise( ... ))
```
***

### record(methodName)
#### Observe the argument(s)/returned value(s) of existing functions
###### methodName: String value with the exact name of your function *(ex: function test()=>{} would be 'test')*
#### Exposes properties:
###### -Purport.yourModule.args.yourFunc - *An array of argument arrays in the same order as the function was called*
###### -Purport.yourModule.values.yourFunc - *An array of the values returned by the function*
###### -Purport.yourModule.callCount.yourFunc - *number of times the method was called*
###### -Purport.yourModule.wasCalled.yourFunc() - *true if the method has been called at least once*
```javascript
Purport.yourModule.record('someFunc')
Purport.yourModule.callCount.someFunc // 0
Purport.yourModule.wasCalled.someFunc() // false

yourModule.someFunc()

Purport.yourModule.callCount.someFunc // 1
Purport.yourModule.wasCalled.someFunc() // true
```

> TODO: async/promises? not tested/described ;(
***

### mock(methodName, cb, hooks)
#### For when simpler method stubs just won't do. Extends stub & record with additional event hooks
###### methodName: String value with the exact name of your function *(ex: function test()=>{} would be 'test')*
###### cb: The actual method to execute; can use async/await, promises, or the original method *(ex: () => { return true })*
###### hooks: Optional events to fire directly before and after the function executes formatted like this: `{ preHook: ()=>{}, postHook: ()=>{} }`
#####
##### Exposes properties:
###### -Purport.yourModule.args.yourFunc - *An array of argument arrays in the same order as the function was called*
###### -Purport.yourModule.values.yourFunc - *An array of the values returned by the function*
###### -Purport.yourModule.callCount.yourFunc - number of times the method was called
###### -Purport.yourModule.wasCalled.yourFunc() - true if the method has been called at least once
```javascript
const myTestFunc = () => { console.log("hello") }
const myOtherTestFunc = () => { console.log("goodbye") }

Purport.yourModule.mock('thatFunction', (arg1) => { console.log("how are you?") }, { preHook: myTestFunc, postHook: myOtherTestFunc })
Purport.yourModule.callCount.thatFunction // 0
Purport.yourModule.wasCalled.thatFunction() // false

yourModule.thatFunction() // hello, how are you?, goodbye

Purport.yourModule.callCount.thatFunction // 1
Purport.yourModule.wasCalled.thatFunction() // true
```

***

### reset()
#### Call to reset your module to default
```javascript
yourModule.falseFunction() //returns false
Purport.yourModule.stub('testFunction', () => true)
yourModule.falseFunction() //returns true

Purport.yourModule.reset()
yourModule.falseFunction() //returns false
```
