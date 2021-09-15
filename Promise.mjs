const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

export default function _Promise(executor) {

    let state = PENDING;
    let callOnFulfilled = [];
    let callOnRejected = undefined;;

    function resolve(...args) {
        if (!state) {
            state = FULFILLED;
        }

        resolveCallbacks(...args);
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
    function resolveCallbacks(...value) {
        if (state !== REJECTED) {
            let callback = undefined;
            do {
                callback = callOnFulfilled.shift();
                if (callback && (callback instanceof Function)) {
                    const result = callback(...value);
                    if (result instanceof _Promise) {
                        result.then(resolveCallbacks, reject);
                        return;
                    } else {
                        value = [result];
                    }
                }
            } while (callback);
        }
    };

    if (executor && (executor instanceof Function)) {
        executor(resolve, reject);
    }

    this.then = function (onFulfilled, onRejected) {
        if (onFulfilled) {
            callOnFulfilled.push(onFulfilled);
            if (state === FULFILLED) {
                resolveCallbacks();
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