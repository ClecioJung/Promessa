const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

export default function Promesa(executor) {

    let state = PENDING;
    let callOnFulfilled = [];
    let callOnRejected = undefined;

    if (executor && (executor instanceof Function)) {
        executor(resolve, reject);
    }

    function resolve(...args) {
        if (state === PENDING) {
            state = FULFILLED;
        } else if (state === REJECTED) {
            return;
        }
        let value = args;
        let callback;
        do {
            callback = callOnFulfilled.shift();
            if (callback && (callback instanceof Function)) {
                const result = callback(...value);
                if (result instanceof Promesa) {
                    result.then(resolve, reject);
                    return;
                }
                value = [result];
            }
        } while (callback);
    };
    function reject(error) {
        state = REJECTED;
        if (callOnRejected && (callOnRejected instanceof Function)) {
            callOnRejected(error);
            callOnRejected = undefined;
            callOnFulfilled = [];
        } else {
            throw `Unhandled Promise Rejection\n\tError: ${error}`;
        }
    };

    this.then = function (onFulfilled, onRejected) {
        if (onFulfilled) {
            callOnFulfilled.push(onFulfilled);
            if (state === FULFILLED) {
                resolve();
            }
        }
        if (onRejected && !callOnRejected) {
            callOnRejected = onRejected;
        }
        return this;
    };
    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };
}