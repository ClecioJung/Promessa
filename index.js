const Promessa = require("./Promessa.js");
const async = require("./async.js");

function sum(...args) {
    let total = 0;
    return new Promessa(function (resolve, reject) {
        setTimeout(function () {
            for (const arg of args) {
                if (typeof arg !== "number") {
                    reject(`Invalid argument: ${arg}`);
                }
                total += arg;
            }
            resolve(total);
        }, 500);
    });
}

async(function* () {
    try {
        const a = yield sum(1, 3, 5);
        console.log(a);
        const b = yield sum(2, 4);
        console.log(b);
        const c = yield 6 + 5;
        console.log(c);
        const result = yield sum(a, b, c);
        console.log(result);
        const err = yield sum('a', b);
    } catch (error) {
        console.error(error);
    }
})();