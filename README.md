<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>

# Promessa

## Overview

A simple (less than 100 lines of code) implementation of [Promises/A+](https://promisesaplus.com/) specification.
Promessa means promise in portuguese.

## Usage

The library exports the constructor function `Promessa`, which accepts an `executor` function as argument. This function receives two function arguments `resolve`, which should be called when you wish to resolve the promise, and `reject` that rejects the promise when called. Example:

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

The created `promise` also has a method `catch` which returns a new `Promessa` object, and allows to specify a `onRejected` function, to be executed when `promise` is rejected:

```javascript
promise.catch(function onRejected(reason) {
    console.error(reason);
});
```

The function `Promessa` also has two static methods which allows us to create already resolved and rejected promises, as shown in this example:

```javascript
// Creates a already resolved promise
const resolved = Promessa.resolve(value);

// Creates a already rejected promise
const rejected = Promessa.reject(reason);
```

## Download this project and run the test suite

In order to download this project and run the test suite of the [Promises/A+](https://github.com/promises-aplus/promises-tests) specification, just type on the console the following commands:

```console
git clone https://github.com/ClecioJung/Promessa.git
cd Promessa
npm install
npm test
```