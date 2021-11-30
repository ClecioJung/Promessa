const Promessa = require("../Promessa.js");
const async = require("../async.js");

describe("Test the async function", () => {
    const timeout = 30;

    test("The async function should return a promessa", () => {
        const asyncFn = async(function* () { });
        expect(asyncFn()).toBeInstanceOf(Promessa);
    });

    test("The async function return value should be the promessa resolved value", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = async(function* () {
            return value;
        });
        asyncFn().then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("Should yield a value", (done) => {
        expect.assertions(1);
        const value = "value";
        async(function* () {
            const result = yield value;
            expect(result).toBe(value);
            done();
        })();
    });

    test("Should wait for the promessa return value", (done) => {
        expect.assertions(1);
        const value = "value";
        async(function* () {
            const result = yield new Promessa((resolve, reject) => {
                setTimeout(() => {
                    resolve(value);
                }, timeout);
            });
            expect(result).toBe(value);
            done();
        })();
    });

    test("If the async function return a promessa, it should be resolved", (done) => {
        expect.assertions(1);
        const value = "value";
        const asyncFn = async(function* () {
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

    test("Should reject a value", (done) => {
        expect.assertions(1);
        const reason = "reason";
        const asyncFn = async(function* () {
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

    test("Should reject a value when waiting for a promessa to resolve", (done) => {
        expect.assertions(2);
        const reason = "reason";
        const spy = jest.fn();
        const asyncFn = async(function* () {
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

    test("Should get a rejected promessa using a try catch block", (done) => {
        expect.assertions(3);
        const reason = "reason";
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const asyncFn = async(function* () {
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
        const asyncFn = async(function* () {
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