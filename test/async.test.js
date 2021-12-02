const Promessa = require("../Promessa.js");

describe("Test the async static method", () => {
    const timeout = 30;

    test("The async method should accept only functions as argument", () => {
        expect(() => Promessa.async(undefined)).toThrow(TypeError);
    });

    test("The async method should return a Promessa", () => {
        const asyncFn = Promessa.async(function* () { });
        expect(asyncFn()).toBeInstanceOf(Promessa);
    });

    test("If the async method receives a non-generator as argument, it should also return a Promessa", () => {
        const asyncFn = Promessa.async(function () { });
        expect(asyncFn()).toBeInstanceOf(Promessa);
    });

    test("The return value of an async function (non-generator) should be the resolved value of the returned Promessa", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function () {
            return value;
        });
        asyncFn().then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The async method (non-generator) should be able to receive an argument", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function (result) {
            return result;
        });
        asyncFn(value).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The async method (non-generator) should be able to receive many arguments", (done) => {
        expect.assertions(1);
        const first = "first";
        const second = "second";
        const third = "third";
        const asyncFn = Promessa.async(function (...args) {
            return args;
        });
        asyncFn(first, second, third).then((data) => {
            expect(data).toEqual([first, second, third]);
            done();
        });
    });

    test("If the async method (non-generator) return a Promessa, it should be resolved", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function () {
            return new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
        });
        asyncFn().then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The async method (non-generator) should be able to reject a value", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const asyncFn = Promessa.async(function () {
            return new Promessa((resolve, reject) => {
                setTimeout(() => {
                    reject(reason);
                }, timeout);
            });
        });
        asyncFn().then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });

    test("Throwing inside an async method (non-generator) should reject the returning Promessa", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const asyncFn = Promessa.async(function () {
            throw reason;
        });
        asyncFn().then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });

    test("The return value of an async function should be the resolved value of the returned Promessa", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function* () {
            return value;
        });
        asyncFn().then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("Should wait for a value", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.async(function* () {
            const result = yield value;
            expect(result).toBe(value);
            done();
        })();
    });

    test("Should wait for a Promessa to resolve", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.async(function* () {
            const result = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
            expect(result).toBe(value);
            done();
        })();
    });

    test("Should wait for two sequential Promessas to resolve", (done) => {
        expect.assertions(2);
        const value = "value";
        const value2 = "value2";
        Promessa.async(function* () {
            const result = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
            expect(result).toBe(value);
            const result2 = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value2);
                }, timeout);
            });
            expect(result2).toBe(value2);
            done();
        })();
    });

    test("Should wait for three sequential Promessas to resolve", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        Promessa.async(function* () {
            const result = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
            expect(result).toBe(value);
            const result2 = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value2);
                }, timeout);
            });
            expect(result2).toBe(value2);
            const result3 = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value3);
                }, timeout);
            });
            expect(result3).toBe(value3);
            done();
        })();
    });

    test("Should wait for an async method inside an async method", (done) => {
        expect.assertions(1);
        const value = "value";
        Promessa.async(function* () {
            const result = yield Promessa.async(function* () {
                return new Promessa((resolve, reject) => {
                    setTimeout(() => {
                        resolve(value);
                    }, timeout);
                });
            })();
            expect(result).toBe(value);
            done();
        })();
    });

    test("The async function should be able to receive a argument", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function* (result) {
            return result;
        });
        asyncFn(value).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The async function should be able to receive many arguments", (done) => {
        expect.assertions(1);
        const first = "first";
        const second = "second";
        const third = "third";
        const asyncFn = Promessa.async(function* (...args) {
            return args;
        });
        asyncFn(first, second, third).then((data) => {
            expect(data).toEqual([first, second, third]);
            done();
        });
    });

    test("If you return a Promessa inside a async function, it should be resolved", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = Promessa.async(function* () {
            return new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
        });
        asyncFn().then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The async method should be able to reject a value", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const asyncFn = Promessa.async(function* () {
            return new Promessa((resolve, reject) => {
                setTimeout(() => {
                    reject(reason);
                }, timeout);
            });
        });
        asyncFn().then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });

    test("Should reject a value when waiting for a Promessa to resolve", (done) => {
        expect.assertions(2);
        const reason = "reason";
        const spy = jest.fn();
        const asyncFn = Promessa.async(function* () {
            const result = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    reject(reason);
                }, timeout);
            });
            spy();
        });
        asyncFn().then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                expect(spy).not.toHaveBeenCalled();
                done();
            }
        );
    });

    test("Should get a rejected Promessa using a try catch block", (done) => {
        expect.assertions(3);
        const reason = "reason";
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const asyncFn = Promessa.async(function* () {
            try {
                const result = yield new Promessa((resolve, reject) => {
                    setTimeout(() => {
                        reject(reason);
                    }, timeout);
                });
                spy1();
            } catch (error) {
                expect(error).toBe(reason);
            }
            spy2();
        });
        asyncFn().then((data) => {
            expect(spy1).not.toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            done();
        });
    });

    test("Throwing inside an async function should reject it", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const asyncFn = Promessa.async(function* () {
            throw reason;
        });
        asyncFn().then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });
});