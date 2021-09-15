const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

export default class _Promise {
    constructor(executor) {
        this.state = PENDING;
        this.args = undefined;
        this.onFulfilled = [];

        if (executor && (executor instanceof Function)) {
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
    }
    resolve(...args) {
        if (this.state === PENDING) {
            this.state = FULFILLED;
        }
        this.value = args;
        this.resolveCallbacks();
    }
    reject(error) {
        this.state = REJECTED;
        if (this.onRejected && (this.onRejected instanceof Function)) {
            return this.onRejected(error);
        } else {
            throw `Unhandled Promise Rejection\n\tError: ${error}`;
        }
    }
    resolveCallbacks() {
        let callback = undefined;
        do {
            callback = this.onFulfilled.shift();
            if (callback && (callback instanceof Function)) {
                this.value = [callback(...this.value)];
            }
        } while (callback);
    }
    then(onFulfilled, onRejected) {
        if (onFulfilled) {
            this.onFulfilled.push(onFulfilled);
            if (this.state === FULFILLED) {
                this.resolveCallbacks();
            }
        }
        if (onRejected) {
            this.onRejected = onRejected;
        }
        return this;
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
}