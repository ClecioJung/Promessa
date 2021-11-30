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

const main = async(function* () {
    try {
        const a = yield sum(1);
        console.log("a", a);
        const b = yield sum(1, 1);
        console.log("b", b);
        const c = yield 3;
        console.log("c", c);
        const d = yield sum(1, 1)
            .then((value) => sum(value, 2));
        console.log("d", d);
        const e = yield async(function* () {
            const e1 = yield 2;
            console.log("e1", e1);
            const e2 = yield sum(1, 2);
            console.log("e2", e2);
            return sum(e1, e2);
        })();
        console.log("e", e);
        const f = yield async(function* () {
            return new Promessa((resolve, reject) => {
                resolve(new Promessa((resolve, reject) => {
                    resolve(sum(6));
                }));
            });
        })();
        console.log("f", f);
        const result = yield sum(a, b, c, d, e, f);
        console.log("result", result);
        const err = yield sum("incorrect");
    } catch (error) {
        console.error(error);
    }
});

main();