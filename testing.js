const promisesAplusTests = require("promises-aplus-tests");
const Promessa = require("./Promessa.js");

const adapter = {
    resolved(value) {
        return Promessa.resolve(value);
    },
    rejected(reason) {
        return Promessa.reject(reason);
    },
    deferred() {
        let resolve, reject;
        const promise = new Promessa((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return {
            promise,
            resolve,
            reject
        };
    }
};

promisesAplusTests(adapter, { bail: true }, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});