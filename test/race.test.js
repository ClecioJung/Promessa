const Promessa = require("../Promessa.js");

describe("Test the race static method", () => {
    const timeout = 30;

    test("The race method should return a Promessa", () => {
        expect(Promessa.race([])).toBeInstanceOf(Promessa);
    });

    test("The race method should accept only iterables as arguments", () => {
        expect(() => Promessa.race(undefined))
            .toThrow(TypeError);
    });

    test("Should resolve when the faster Promessa resolves", (done) => {
        expect.assertions(1);
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
        Promessa.race([first, second, third])
            .then((data) => {
                expect(data).toBe(value1);
            });
        setTimeout(function () {
            done();
        }, 4 * timeout);
    });

    test("Should reject when the faster Promessa rejects", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
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
        Promessa.race([first, second, third])
            .catch((error) => {
                expect(error).toBe(reason);
            });
        setTimeout(function () {
            done();
        }, 4 * timeout);
    });

    test("The race method should work with any iterable, for instance strings", (done) => {
        expect.assertions(1);
        Promessa.race("Promessa")
            .then((data) => {
                expect(data).toEqual("P");
                done();
            });
    });

    test("The race method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(1);
        const value1 = "value1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.race([first, value2, third])
            .then((data) => {
                expect(data).toBe(value2);
            });
        setTimeout(function () {
            done();
        }, 4 * timeout);
    });

    test("If the race method receives an empty array, it should never be resolved or rejected", (done) => {
        expect.assertions(2);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        Promessa.race([]).then(spy1, spy2);
        setTimeout(() => {
            expect(spy1).not.toHaveBeenCalled();
            expect(spy2).not.toHaveBeenCalled();
            done();
        }, timeout);
    });

    test("The race method should work with generators", (done) => {
        expect.assertions(1);
        const generatePromessas = function* (value) {
            while (value--) {
                yield new Promessa(function (resolve, reject) {
                    resolve(value);
                });
            }
        };
        Promessa.race(generatePromessas(5))
            .then((data) => {
                expect(data).toEqual(4);
                done();
            });
    });
});