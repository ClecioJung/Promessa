const Promessa = require("./Promessa.js");

function async(genFn) {
    const gen = genFn();
    return function resolving() {
        return new Promessa(function (resolve, reject) {
            (function resolvingAsync(result) {
                const { value, done } = gen.next(result);
                if (done) {
                    resolve(value);
                    return;
                }
                if (typeof value === "object" || typeof value === "function") {
                    const then = value.then;
                    if (then && typeof then === "function") {
                        then.call(value,
                            (result) => resolvingAsync(result),
                            (reason) => reject(reason)
                        );
                        return;
                    }
                }
                resolvingAsync(value);
            })();
        }).catch((reason) => gen.throw(reason));
    }
}

module.exports = async;