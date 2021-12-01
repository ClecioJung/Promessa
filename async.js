const Promessa = require("./Promessa.js");

function async(fn) {
    if (!fn || typeof fn !== "function") {
        throw new TypeError("Async function should receive a funcrion as argument!");
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
}

module.exports = async;