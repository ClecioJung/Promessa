const Promessa = require("../Promessa.js");

describe("Test the any static method", () => {
    const timeout = 30;

    test("The any method should return a Promessa", () => {
        expect(Promessa.any([])).toBeInstanceOf(Promessa);
    });

    test("The any method should accept only iterables as arguments", () => {
        expect(() => Promessa.any(undefined))
            .toThrow(TypeError);
    });

    test("Should resolve when any Promessa resolves", (done) => {
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
        Promessa.any([first, second, third])
            .then((data) => {
                expect(data).toBe(value2);
            });
        setTimeout(function () {
            done();
        }, 4 * timeout);
    });

    test("Should reject when all Promessas are rejected", (done) => {
        expect.assertions(3);
        const reason1 = "reason1";
        const reason2 = "reason2";
        const reason3 = "reason3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason1);
            }, timeout);
        });
        const second = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason2);
            }, 2 * timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason3);
            }, 3 * timeout);
        });
        Promessa.any([first, second, third])
            .catch((error) => {
                expect(error[0]).toBe(reason1);
                expect(error[1]).toBe(reason2);
                expect(error[2]).toBe(reason3);
                done();
            });
    });

    test("The any method should work with any iterable, for instance strings", (done) => {
        expect.assertions(1);
        Promessa.any("Promessa")
            .then((data) => {
                expect(data).toEqual("P");
                done();
            });
    });

    test("The any method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.any([first, value2, third])
            .then((data) => {
                expect(data).toBe(value2);
            });
        setTimeout(function () {
            done();
        }, 4 * timeout);
    });

    test("If the any method receives an empty array, it should never be resolved or rejected", (done) => {
        expect.assertions(2);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        Promessa.any([]).then(spy1, spy2);
        setTimeout(() => {
            expect(spy1).not.toHaveBeenCalled();
            expect(spy2).not.toHaveBeenCalled();
            done();
        }, timeout);
    });
});