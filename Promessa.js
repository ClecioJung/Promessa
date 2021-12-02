// states
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function isIterable(value) {
    if (!value) return false;
    return typeof value[Symbol.iterator] === 'function';
}

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
                const { promessa, resolve, reject, onFulfilled, onRejected, onFinally } = queue.shift();
                if (onFinally) {
                    try {
                        onFinally();
                        if (state === FULFILLED) resolve(_value);
                        else reject(_value);
                    } catch (error) {
                        reject(error);
                    }
                    continue;
                }
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

    this.finally = function (onFinally) {
        if (onFinally && typeof onFinally === "function") {
            let resolve, reject;
            const promessa = new Promessa((res, rej) => {
                resolve = res;
                reject = rej;
            });
            queue.push({ promessa, resolve, reject, undefined, undefined, onFinally });
            fulfill();
            return promessa;
        }
        return this;
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

Promessa.race = function (promessas) {
    if (!isIterable(promessas)) {
        throw new TypeError("The argument for the race method should be a iterable");
    }
    return new Promessa((resolve, reject) => {
        for (const index in promessas) {
            Promessa.resolve(promessas[index])
                .then(resolve, reject);
        }
    });
};

Promessa.all = function (promessas) {
    if (!isIterable(promessas)) {
        throw new TypeError("The argument for the race method should be a iterable");
    }
    return new Promessa((resolve, reject) => {
        const values = [];
        let resolvedPromessas = 0;
        for (const index in promessas) {
            const resolveSinglePromessa = function (data) {
                values[index] = data;
                resolvedPromessas++;
                if (resolvedPromessas >= promessas.length) {
                    resolve(values);
                }
            };
            Promessa.resolve(promessas[index])
                .then(resolveSinglePromessa, reject);
        }
    });
};

Promessa.any = function (promessas) {
    if (!isIterable(promessas)) {
        throw new TypeError("The argument for the race method should be a iterable");
    }
    return new Promessa((resolve, reject) => {
        const reasons = [];
        let rejectedPromessas = 0;
        for (const index in promessas) {
            const rejectSinglePromessa = function (error) {
                reasons[index] = error;
                rejectedPromessas++;
                if (rejectedPromessas >= promessas.length) {
                    reject(reasons);
                }
            };
            Promessa.resolve(promessas[index])
                .then(resolve, rejectSinglePromessa);
        }
    });
};

Promessa.allSettled = function (promessas) {
    if (!isIterable(promessas)) {
        throw new TypeError("The argument for the race method should be a iterable");
    }
    return new Promessa((resolve, reject) => {
        const values = [];
        let resolvedPromessas = 0;
        for (const index in promessas) {
            const resolveSinglePromessa = function (data) {
                values[index] = {
                    status: "fulfilled",
                    value: data
                };
                resolvedPromessas++;
                if (resolvedPromessas >= promessas.length) {
                    resolve(values);
                }
            };
            const rejectSinglePromessa = function (error) {
                values[index] = {
                    status: "rejected",
                    reason: error
                };
                resolvedPromessas++;
                if (resolvedPromessas >= promessas.length) {
                    resolve(values);
                }
            };
            Promessa.resolve(promessas[index])
                .then(resolveSinglePromessa, rejectSinglePromessa);
        }
    });
};

Promessa.async = function (fn) {
    if (!fn || typeof fn !== "function") {
        throw new TypeError("The argument for the async method should be a function");
    }
    if (fn.constructor.name !== 'GeneratorFunction') {
        return function resolveFunc(...params) {
            return new Promessa(function (resolve, reject) {
                try {
                    const value = fn(...params);
                    Promessa.resolve(value).then(resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        };
    }
    return function resolveGenFunc(...params) {
        const gen = fn(...params);
        return new Promessa(function (resolve, reject) {
            const resolvingAsync = function (result) {
                try {
                    const { value, done } = gen.next(result);
                    const resolveGen = function (res) {
                        if (done) resolve(res);
                        else resolvingAsync(res);
                    };
                    Promessa.resolve(value).then(resolveGen, reject);
                } catch (error) {
                    reject(error);
                }
            };
            resolvingAsync();
        }).catch(reason => gen.throw(reason));
    };
};

module.exports = Promessa;