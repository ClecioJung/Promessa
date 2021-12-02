const Promessa = require("../Promessa.js");

describe("Test the all static method", () => {
    const timeout = 30;

    test("The all method should return a Promessa", () => {
        expect(Promessa.all([])).toBeInstanceOf(Promessa);
    });

    test("The all method should accept only iterables as arguments", () => {
        expect(() => Promessa.all(undefined))
            .toThrow(TypeError);
    });

    test("Should resolve many Promessas", (done) => {
        expect.assertions(3);
        const value1 = "value1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, 3 * timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value2);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, timeout);
        });
        Promessa.all([first, second, third])
            .then((data) => {
                expect(data[0]).toBe(value1);
                expect(data[1]).toBe(value2);
                expect(data[2]).toBe(value3);
                done();
            });
    });

    test("Should reject a Promessa in all method call", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const value1 = "value1";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, 3 * timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, timeout);
        });
        Promise.all([first, second, third])
            .catch((error) => {
                expect(error).toBe(reason);
                done();
            });
    });

    test("The all method should work with any iterable, for instance strings", (done) => {
        expect.assertions(1);
        Promessa.all("Promessa")
            .then((data) => {
                expect(data).toEqual(["P", "r", "o", "m", "e", "s", "s", "a"]);
                done();
            });
    });

    test("The all method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(3);
        const value1 = "value1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value1);
            }, 3 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, timeout);
        });
        Promessa.all([first, value2, third])
            .then((data) => {
                expect(data[0]).toBe(value1);
                expect(data[1]).toBe(value2);
                expect(data[2]).toBe(value3);
                done();
            });
    });
});