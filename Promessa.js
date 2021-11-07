// states
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function resolving(promise, resolve, reject, result) {
    if (promise === result) {
        throw new TypeError("Chaining cycle detected for Promises!");
    }
    if (result) {
        let called = false;
        const callOnce = function (fn, ...args) {
            if (!called) {
                called = true;
                fn(...args);
            }
        }
        try {
            if (typeof result === "object" || typeof result === "function") {
                const then = result.then;
                if (then && typeof then === "function") {
                    then.call(result,
                        (value) => callOnce(resolving, promise, resolve, reject, value),
                        (reason) => callOnce(reject, reason)
                    );
                    return;
                }
            }
        } catch (error) {
            callOnce(reject, error);
            return;
        }
    }
    resolve(result);
}

function Promessa(executor) {
    let state = PENDING;
    let _value;
    let queue = [];

    const fulfill = function () {
        while (queue.length) {
            let { promise, resolve, reject, onFulfilled, onRejected } = queue.shift();
            const callback = (state === FULFILLED) ? onFulfilled : onRejected;
            if (callback && typeof callback === "function") {
                try {
                    const result = callback(_value);
                    resolving(promise, resolve, reject, result);
                } catch (error) {
                    reject(error);
                }
            } else {
                if (state === REJECTED) reject(_value);
                else resolve(_value);
            }
        }
    }

    const transition = function (newState, value) {
        if (state === PENDING) {
            state = newState;
            _value = value;
            setImmediate(() => fulfill());
        }
    }

    this.then = function (onFulfilled, onRejected) {
        let resolve, reject;
        const promise = new Promessa((res, rej) => {
            resolve = res;
            reject = rej;
        });
        queue.push({ promise, resolve, reject, onFulfilled, onRejected });
        if (state !== PENDING) setImmediate(() => fulfill());
        return promise;
    };

    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    if (executor && typeof executor === "function") {
        executor(
            (value) => transition(FULFILLED, value),
            (reason) => transition(REJECTED, reason)
        );
    }
}

Promessa.resolve = function (value) {
    return new Promessa((res, rej) => res(value));
};

Promessa.reject = function (reason) {
    return new Promessa((res, rej) => rej(reason));
};

module.exports = Promessa;
