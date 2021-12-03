const Promessa = require("../Promessa.js");

describe("Test the forAwait static method", () => {
    const timeout = 30;

    test("The forAwait method should accept only iterables as the first argument", () => {
        expect(() => Promessa.forAwait(undefined))
            .toThrow(TypeError);
    });

    test("Should call onFulfilled when each Promessa resolves", (done) => {
        expect.assertions(4);
        const values = ["value1", "value2", "value3"];
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[0]);
            }, 2 * timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[1]);
            }, timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[2]);
            }, 3 * timeout);
        });
        let index = 0;
        Promessa.forAwait([first, second, third],
            function onFulfilled(data) {
                expect(data).toEqual(values[index++]);
            }
        );
        setTimeout(function () {
            expect(index).toBe(3);
            done();
        }, 4 * timeout);
    });

    test("Should call onRejected when each Promessa rejects", (done) => {
        expect.assertions(5);
        const values = ["value1", "value2", "value3"];
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[0]);
            }, 2 * timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(values[1]);
            }, timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[2]);
            }, 3 * timeout);
        });
        let index = 0;
        Promessa.forAwait([first, second, third],
            function onFulfilled(data) {
                expect(data).toEqual(values[index++]);
            },
            function onRejected(data) {
                expect(index).toBe(1);
                expect(data).toEqual(values[index++]);
            }
        );
        setTimeout(function () {
            expect(index).toBe(3);
            done();
        }, 4 * timeout);
    });

    test("The forAwait method should work with any iterable, for instance strings", (done) => {
        const value = "Promessa";
        expect.assertions(value.length + 1);
        let index = 0;
        Promessa.forAwait(value,
            (data) => {
                expect(data).toBe(value[index++]);
            }
        );
        setTimeout(function () {
            expect(index).toBe(value.length);
            done();
        }, timeout);
    });

    test("The forAwait method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(4);
        const values = ["value1", "value2", "value3"];
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[0]);
            }, 2 * timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(values[1]);
            }, timeout);
        });
        let index = 0;
        Promessa.forAwait([first, second, values[2]],
            function onFulfilled(data) {
                expect(data).toEqual(values[index++]);
            }
        );
        setTimeout(function () {
            expect(index).toBe(3);
            done();
        }, 4 * timeout);
    });
});