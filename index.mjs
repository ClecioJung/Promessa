import _Promise from './Promise.mjs';

function sum(...args) {
    let total = 0;
    return new Promise(function (resolve, reject) {
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
sum(1, 3, '5').then(function (a) {
    console.log('then 1', a);
    return sum(2, 4).then(function (b) {
        console.log(b);
        return sum(a, b).then(function (result) {
            console.log(result);
            console.timeEnd('codeExecution');
        });
    });
    return 5;
}).then(function (a) {
    console.log('then 2', a);
}).catch(function (error) {
    console.log(error);
});