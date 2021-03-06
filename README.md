<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>

# Promessa

## Overview

A simple implementation of Promises in JavaScript. It posseses the following characteristics:
- It is conformant to the [Promises/A+](https://promisesaplus.com/) specification;
- Promessa means promise in portuguese;
- Promessa instances have `.then()`, `.catch()`, and `.finally()` methods that can be used to register callbacks to be called when the promise resolves, rejects or both;
- Promessa has static methods `.resolve()` and `.reject()` that allows to create already resolved and already rejected promises;
- The Promessa has some static methods that can be used to deal with promises arrays, such as `.race()`, `.all()`, `.any()`, `.allSettled()`, `.forEach()` and `.forAwait()`;
- The Promessa also supplies a static method `.async()` for asynchronous flow control using generators;
- If a Promessa is resolved with a thenable, it will be resolved first and its fulfilled value will be assigned to the original promise fulfilled value (this is not required by the Promises/A+ specification);
- This library also print warnings with the stack trace to the console in case of unhandled promise rejections;
- This library does not detect infinite promise chains;

## Usage

The library exports the constructor function `Promessa`, which accepts an `executor` function as argument. This function receives two function arguments: `resolve`, which should be called when you wish to resolve the promise, and `reject` that rejects the promise when called. Example:

```javascript
const Promessa = require("./Promessa.js");

// Creates a new promise
const promise = new Promessa(function (resolve, reject) {
    // Resolve the promise with value
    resolve(value);
    // Rejects the promise with reason
    reject(reason);
});
```

### Method .then()

The created `promise` has a method `then` which returns a new `Promessa` object, and allows to specify `onFulfilled` and `onRejected` functions, to be executed when `promise` is resolved or rejected, respectivelly. Both arguments are optional. See an example:

```javascript
promise.then(
    function onFulfilled(value) {
        console.log(value);
    },
    function onRejected(reason) {
        console.error(reason);
    }
);
```

### Method .catch()

The created `promise` also has a method `catch` which returns a new `Promessa` object, and allows to specify a `onRejected` function, to be executed when `promise` is rejected:

```javascript
promise.catch(function onRejected(reason) {
    console.error(reason);
});
```

As the `then` and `catch` methods return promises, they can be chained. More details on Promises can be found at [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and at the [Promises/A+](https://promisesaplus.com/) specification.

### Method .finally()

The created `promise` also has a method `finally` which returns a new `Promessa` object, and allows to specify a `onFinally` function, to be executed either way if the `promise` is resolved or rejected. The `onFinally` function receives an object argument containing the `status` of the `Promessa` and the value if it is resolved or the reason in case it is rejected (in the [ECMAScript Language Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally) the `onFinally` function receives no argument):

```javascript
// Creates a already resolved promise
const promise = new Promessa(function (resolve, reject) {
    resolve("value");
});

promise.finally(function onFinally(data) {
    // Should print the object: { status: "fulfilled", value: "value" }
    console.log(data);
});
```

### Static method .resolve()

The function `Promessa` has a static method which allow us to create already resolved promises, as shown in this example:

```javascript
// Creates a already resolved promise
const resolved = Promessa.resolve(value);
```

### Static method .reject()

The `Promessa` also has a static method which allows to create already rejected promises, as shown in this example:

```javascript
// Creates a already rejected promise
const rejected = Promessa.reject(reason);
```

### Static method .race()

The static method `race` receives an array of promises, and returns a Promessa, to be resolved or rejected when the first of the promises in the array resolves or rejects, with the value or reason from that promise:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(1), 500);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 300);
});
Promessa.race([first, second, third])
    .then((data) => {
        // Should print 3, because third will be resolved first
        console.log(data);
    });
```

### Static method .all()

The static method `all` receives an array of promises, and returns a Promessa, to be resolved when all promises in the array resolves, with the value an array of the individual values. Or it will be rejected, when the fisrt promise rejects, with its reason. example:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(1), 500);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 300);
});
Promessa.all([first, second, third])
    .then((data) => {
        // Should print the array [1, 2, 3]
        console.log(data);
    });
```

### Static method .any()

The static method `any` receives an array of promises, and returns a Promessa, to be resolved when the first of the promises in the array resolves, with the value from that promise. The returned Promessa rejects only when all the array of promises rejects and the reason will be an array of the reasons. See this example:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => reject(1), 300);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 500);
});
Promessa.any([first, second, third])
    .then((data) => {
        // Should print 3, because third will be the first resolved promise
        console.log(data);
    });
```

### Static method .allSettled()

The static method `allSettled` receives an array of promises, and returns a Promessa, to be resolved when all the promises in the array resolves or rejects, with the value being an array of objects containing an `status` (either `"fulfilled"` or `"rejected"`) and its resolved or rejected `value`. The returned Promessa rejects only when all the array of promises rejects and the reason will be an array of the reasons. See this example:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => reject(1), 300);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 500);
});
Promessa.allSettled([first, second, third])
    .then((data) => {
        // Should print the following object:
        /*[
            { status: 'rejected', value: 1 },
            { status: 'fulfilled', value: 2 },
            { status: 'fulfilled', value: 3 }
        ]*/
        console.log(data);
    });
```

### Static method .forEach()

The static method `forEach` receives an array of promises, a funciton `onFulfilled` and a funciton `onRejected`. These functions are registered for all of these promises, using the method `.then()`. See this example:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(1), 300);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 500);
});
Promessa.forEach([first, second, third],
    (data) => {
        // Should print the numbers in this order: 1, 3, 2
        console.log(data);
    },
    (error) => {
        console.error(error);
    }
);
```

### Static method .forAwait()

The static method `forAwait` receives an array of promises, a funciton `onFulfilled` and a funciton `onRejected` just like `forEach`, however, in this case these functions are called in the order of the array promises passed as a argument, waiting for each one to be resolved or rejected. See this example:

```javascript
const first = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(1), 300);
});
const second = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
});
const third = new Promessa(function (resolve, reject) {
    setTimeout(() => resolve(3), 500);
});
Promessa.forAwait([first, second, third],
    (data) => {
        // Should print the numbers in this order: 1, 2, 3
        console.log(data);
    },
    (error) => {
        console.error(error);
    }
);
```

### Static method .async()

This library also have support for an asynchronous flow control using generators. It is supposed to work with any Promises/A+ implementation. In order to use it, just pass the generator function as an argument to the `async` static method. The result is an asynchronous function that can be called afterwards (when this function is called, it returns a `Promessa` to be resolved when the generator ends its execution). Inside the generator function you can use the `yield` keyword to wait for a promise to resolve. You can also use `try/catch` blocks to get possible promise rejections. Here is an example:

```javascript
const Promessa = require("./Promessa.js");

const asyncFn = Promessa.async(function* () {
    try {
        // yield is used to wait for the promise to return
        const result = yield new Promessa((resolve, reject) => {
            setTimeout(() => resolve(value), 500);
        });
        console.log(result);
    } catch (error) { // You can use a try/catch block to get promise rejections
        console.error(error);
    }
});

// Calling the created asynchronous function
asyncFn();
```

Also, check out the `index.js` file for a more complete usage example.

## Download this project and run the test suite

In order to download this project and run the tests, just type on the console the following commands:

```console
git clone https://github.com/ClecioJung/Promessa.git
cd Promessa
npm install
npm test
```
