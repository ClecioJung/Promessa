// states
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function resolving(promessa, resolve, reject, x) {
    if (promessa === x) throw new TypeError("Chaining cycle detected for Promessas!");
    const callOnce = (function () {
        let called = false;
        return function (fn, ...args) {
            if (called) return;
            called = true;
            fn(...args);
        }
    })();
    try {
        if (x && (typeof x === "object" || typeof x === "function")) {
            const then = x.then;
            if (then && typeof then === "function") {
                then.call(x,
                    (y) => callOnce(resolving, promessa, resolve, reject, y),
                    (r) => callOnce(reject, r)
                );
                return;
            }
        }
        callOnce(resolve, x);
    } catch (error) {
        callOnce(reject, error);
    }
}

function Promessa(executor) {
    let state = PENDING;
    let _value;
    let queue = [];

    const fulfill = function () {
        if (state === PENDING) return;
        setImmediate(() => {
            while (queue.length) {
                const { promessa, resolve, reject, onFulfilled, onRejected } = queue.shift();
                const callback = (state === FULFILLED) ? onFulfilled : onRejected;
                try {
                    if (callback && typeof callback === "function") {
                        resolving(promessa, resolve, reject, callback(_value));
                    } else {
                        if (state === FULFILLED) resolve(_value);
                        else reject(_value);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    const reject = function (reason) {
        if (state !== PENDING) return;
        state = REJECTED;
        _value = reason;
        fulfill();
    }

    const resolve = function (value) {
        if (state !== PENDING) return;
        const resolveThenable = function (result) {
            state = FULFILLED;
            _value = result;
            fulfill();
        };
        resolving(this, resolveThenable, reject, value);
    }

    this.then = function (onFulfilled, onRejected) {
        let resolve, reject;
        const promessa = new Promessa((res, rej) => {
            resolve = res;
            reject = rej;
        });
        queue.push({ promessa, resolve, reject, onFulfilled, onRejected });
        fulfill();
        return promessa;
    };

    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    if (executor && typeof executor === "function") {
        try {
            executor(resolve.bind(this), reject);
        } catch (error) {
            reject(error);
        }
    } else throw new TypeError("The executor should be a function");
}

Promessa.resolve = function (value) {
    return new Promessa((res, rej) => res(value));
};

Promessa.reject = function (reason) {
    return new Promessa((res, rej) => rej(reason));
};

module.exports = Promessa;