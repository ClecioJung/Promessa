const Promessa = require("./Promessa.js");

function async(genFn) {
    const gen = genFn();
    return function resolving() {
        return new Promessa(function (resolve, reject) {
            (function resolvingAsync(result) {
                try {
                    const { value, done } = gen.next(result);
                    Promessa.resolve(value)
                        .then(res => {
                            if (done) resolve(res);
                            else resolvingAsync(res);
                        },
                            reason => reject(reason)
                        );
                } catch (error) {
                    reject(error);
                }
            })();
        }).catch(reason => gen.throw(reason));
    }
}

module.exports = async;