import Promesa from './Promesa.mjs';

function sum(...args) {
    let total = 0;
    return new Promesa(function (resolve, reject) {
        setTimeout(function () {
            for (const arg of args) {
                if (typeof arg !== 'number') {
                    reject(`Invalid argument: ${arg}`);
                }
                total += arg;
            }
            resolve(total);
        }, 500);
    });
}

console.time('codeExecution');
sum(1, 3, 5).then(function (a) {
    console.log(a);
    return sum(2, 4).then(function (b) {
        console.log(b);
        return sum(a, b).then(function (result) {
            console.log(result);
            return 25;
        });
    }).then(function (value) {
        console.log(value);
        console.timeEnd('codeExecution');
    });
}).catch(function (error) {
    console.log(error);
});