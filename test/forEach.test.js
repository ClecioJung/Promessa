const Promessa = require("../Promessa.js");

describe("Test the forEach static method", () => {
    const timeout = 30;

    test("The forEach method should accept only iterables as the first argument", () => {
        expect(() => Promessa.forEach(undefined))
            .toThrow(TypeError);
    });

    test("Should call onFulfilled when each Promessa resolves", (done) => {
        expect.assertions(4);
        const spy = jest.fn();
        const value1 = "value1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value2);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.forEach([first, second, third],
            function onFulfilled(data) {
                expect([value1, value2, value3]).toContain(data);
                spy();
            }
        );
        setTimeout(function () {
            expect(spy).toHaveBeenCalledTimes(3);
            done();
        }, 4 * timeout);
    });

    test("Should call onRejected when each Promessa rejects", (done) => {
        expect.assertions(5);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const value1 = "value1";
        const value3 = "value3";
        const reason = "reason";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.forEach([first, second, third],
            function onFulfilled(data) {
                expect([value1, value3]).toContain(data);
                spy1();
            },
            function onRejected(error) {
                expect(error).toBe(reason);
                spy2();
            }
        );
        setTimeout(function () {
            expect(spy1).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(1);
            done();
        }, 4 * timeout);
    });

    test("The forEach method should work with any iterable, for instance strings", (done) => {
        const value = "Promessa";
        expect.assertions(value.length + 1);
        const spy = jest.fn();
        Promessa.forEach(value,
            (data) => {
                expect(value).toContain(data);
                spy();
            }
        );
        setTimeout(function () {
            expect(spy).toHaveBeenCalledTimes(value.length);
            done();
        }, timeout);
    });

    test("The forEach method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(5);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const value1 = "value1";
        const value3 = "value3";
        const reason = "reason";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.forEach([first, second, third],
            function onFulfilled(data) {
                expect([value1, value3]).toContain(data);
                spy1();
            },
            function onRejected(error) {
                expect(error).toBe(reason);
                spy2();
            }
        );
        setTimeout(function () {
            expect(spy1).toHaveBeenCalledTimes(2);
            expect(spy2).toHaveBeenCalledTimes(1);
            done();
        }, 4 * timeout);
    });

    test("The forEach method should work with generators", (done) => {
        expect.assertions(5);
        const generatePromessas = function* (value) {
            while (value--) {
                yield new Promessa(function (resolve, reject) {
                    resolve(value);
                });
            }
        };
        Promessa.forEach(generatePromessas(5),
            (data) => {
                expect([4, 3, 2, 1, 0]).toContain(data);
            }
        );
        setTimeout(function () {
            done();
        }, timeout);
    });
});