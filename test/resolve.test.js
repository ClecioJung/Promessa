const Promessa = require("../Promessa.js");

describe("Test the resolve static method", () => {
    const timeout = 30;

    test("The resolve method should return a Promessa", () => {
        expect(Promessa.resolve()).toBeInstanceOf(Promessa);
    });

    test("Should create an already resolved Promessa", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.resolve(value)
            .then((data) => {
                expect(data).toBe(value);
                done();
            });
    });

    test("If the resolve method receives a Promessa, it should be resolved before calling the onFulfilled function", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.resolve(new Promessa((resolve, reject) => {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        })).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("If the resolve method receives a rejected Promessa, it should be rejected with the same reason", (done) => {
        expect.assertions(1);
        const reason = "reason";
        Promessa.resolve(new Promessa((resolve, reject) => {
            setTimeout(function () {
                reject(reason);
            }, timeout);
        })).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("If the resolve method receives a thenable, it should be resolved before calling the onFulfilled function", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.resolve({
            then: (resolved) => resolved(value)
        }).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });
});