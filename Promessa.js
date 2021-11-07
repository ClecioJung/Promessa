// states
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

const resolving = function (promise, x) {
    if (promise === x) {
        throw new TypeError("Chaining cycle detected for Promises!");
    }
    if (x) {
        let called = false;
        try {
            if (typeof x === "object" || typeof x === "function") {
                const then = x.then;
                if (then && typeof then === "function") {
                    then.call(x,
                        (value) => {
                            if (!called) {
                                called = true;
                                resolving(promise, value);
                            }
                        },
                        (reason) => {
                            if (!called) {
                                called = true;
                                promise.reject(reason);
                            }
                        }
                    );
                } else {
                    promise.resolve(x);
                }
            } else {
                promise.resolve(x);
            }
        } catch (error) {
            if (!called) {
                called = true;
                promise.reject(error);
            }
        }
    } else {
        promise.resolve(x);
    }
}

function Promessa(executor) {
    let state = PENDING;
    let _value;
    let queue = [];

    const fulfill = function () {
        while (queue.length) {
            let { promise, onFulfilled, onRejected } = queue.shift();
            const callback = (state === FULFILLED) ? onFulfilled : onRejected;
            if (callback && typeof callback === "function") {
                try {
                    const result = callback(_value);
                    resolving(promise, result);
                } catch (error) {
                    promise.reject(error);
                }
            } else {
                if (state === REJECTED) promise.reject(_value);
                else promise.resolve(_value);
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
        const promise = new Promessa();
        queue.push({ promise, onFulfilled, onRejected });
        if (state !== PENDING) {
            setImmediate(() => fulfill());
        }
        return promise;
    };

    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    this.resolve = function (value) {
        transition(FULFILLED, value);
    }

    this.reject = function (reason) {
        transition(REJECTED, reason);
    }

    if (executor && typeof executor === "function") {
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
}

module.exports = Promessa;