const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

export default function Promesa(executor) {

    let state = PENDING;
    let callOnFulfilled = [];
    let callOnRejected = undefined;
    let callOnFinally = undefined;

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
        let callback = callOnFulfilled.shift();
        while (callback) {
            const result = callback(...value);
            if (result instanceof Promesa) {
                result.then(resolve, reject);
                return;
            }
            value = [result];
            callback = callOnFulfilled.shift();
        }
        if (callOnFinally) {
            callOnFinally();
        }
    };
    function reject(error) {
        state = REJECTED;
        if (callOnRejected) {
            callOnRejected(error);
            if (callOnFinally) {
                callOnFinally();
            }
        } else {
            throw `Unhandled Promise Rejection\n\tError: ${error}`;
        }
    };

    this.then = function (onFulfilled, onRejected) {
        if (onFulfilled && (onFulfilled instanceof Function)) {
            callOnFulfilled.push(onFulfilled);
            if (state === FULFILLED) {
                resolve();
            }
        }
        if (!callOnRejected) {
            if (onRejected && (onRejected instanceof Function)) {
                callOnRejected = onRejected;
            }
        }
        return this;
    };
    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };
    this.finally = function (onFinally) {
        if (!callOnFinally) {
            if (onFinally && (onFinally instanceof Function)) {
                callOnFinally = onFinally;
            }
        }
        return this;
    }
}