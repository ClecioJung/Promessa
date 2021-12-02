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
});