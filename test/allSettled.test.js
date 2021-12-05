const Promessa = require("../Promessa.js");

describe("Test the allSettled static method", () => {
    const timeout = 30;

    test("The allSettled method should return a Promessa", () => {
        expect(Promessa.allSettled([])).toBeInstanceOf(Promessa);
    });

    test("The allSettled method should accept only iterables as arguments", () => {
        expect(() => Promessa.allSettled(undefined))
            .toThrow(TypeError);
    });

    test("Should resolve when all Promessas have settled", (done) => {
        expect.assertions(3);
        const reason1 = "reason1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason1);
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
        Promessa.allSettled([first, second, third])
            .then((data) => {
                expect(data[0]).toEqual({ status: "rejected", value: reason1 });
                expect(data[1]).toEqual({ status: "fulfilled", value: value2 });
                expect(data[2]).toEqual({ status: "fulfilled", value: value3 });
                done();
            });
    });

    test("The allSettled method should work with any iterable, for instance strings", (done) => {
        expect.assertions(1);
        Promessa.allSettled("Promessa")
            .then((data) => {
                expect(data).toEqual([
                    { status: "fulfilled", value: "P" },
                    { status: "fulfilled", value: "r" },
                    { status: "fulfilled", value: "o" },
                    { status: "fulfilled", value: "m" },
                    { status: "fulfilled", value: "e" },
                    { status: "fulfilled", value: "s" },
                    { status: "fulfilled", value: "s" },
                    { status: "fulfilled", value: "a" }
                ]);
                done();
            });
    });

    test("The allSettled method should resolve automatically arguments that aren't Promessas", (done) => {
        expect.assertions(3);
        const reason1 = "reason1";
        const value2 = "value2";
        const value3 = "value3";
        const first = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason1);
            }, timeout);
        });
        const third = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value3);
            }, 3 * timeout);
        });
        Promessa.allSettled([first, value2, third])
            .then((data) => {
                expect(data[0]).toEqual({ status: "rejected", value: reason1 });
                expect(data[1]).toEqual({ status: "fulfilled", value: value2 });
                expect(data[2]).toEqual({ status: "fulfilled", value: value3 });
                done();
            });
    });

    test("If the allSettled method receives an empty array, it should resolve with an empty array", (done) => {
        expect.assertions(1);
        Promessa.allSettled([])
            .then((data) => {
                expect(data).toEqual([]);
                done();
            });
    });

    test("The allSettled method should work with generators", (done) => {
        expect.assertions(1);
        const generatePromessas = function* (value) {
            while (value--) {
                yield new Promessa(function (resolve, reject) {
                    resolve(value);
                });
            }
        };
        Promessa.allSettled(generatePromessas(5))
            .then((data) => {
                expect(data).toEqual([
                    { status: "fulfilled", value: 4 },
                    { status: "fulfilled", value: 3 },
                    { status: "fulfilled", value: 2 },
                    { status: "fulfilled", value: 1 },
                    { status: "fulfilled", value: 0 }
                ]);
                done();
            });
    });
});