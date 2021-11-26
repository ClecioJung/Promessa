const Promessa = require("./Promessa.js");

function async(genFn) {
    const gen = genFn();
    return function resolving() {
        return new Promessa(function (resolve, reject) {
            (function resolvingAsync(result) {
                const { value, done } = gen.next(result);
                if (typeof value === "object" || typeof value === "function") {
                    const then = value.then;
                    if (then && typeof then === "function") {
                        then.call(value,
                            (result) => {
                                if (done) resolve(result);
                                else resolvingAsync(result)
                            },
                            (reason) => reject(reason)
                        );
                        return;
                    }
                }
                if (done) resolve(value);
                else resolvingAsync(value);
            })();
        }).catch((reason) => gen.throw(reason));
    }
}

module.exports = async;