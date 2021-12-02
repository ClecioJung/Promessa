const Promessa = require("../Promessa.js");

describe("Test the Promessa class", () => {
    const timeout = 30;

    test("Should call the executor function synchronously", () => {
        const spy = jest.fn();
        new Promessa(spy);
        expect(spy).toHaveBeenCalled();
    });

    test("Should throw an TypeError if the executor is not a function", () => {
        expect(() => new Promessa(undefined))
            .toThrow(TypeError);
    });

    test("Should asynchronously call the onFulfilled function registered by the then() method", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            resolve(value);
        }).then((data) => {
            expect(spy).toHaveBeenCalled();
            expect(data).toBe(value);
            done();
        });
        spy();
    });

    test("Should asynchronously call the onFulfilled function after a timeout", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(spy).toHaveBeenCalled();
            expect(data).toBe(value);
            done();
        });
        spy();
    });

    test("Should resolve only once", (done) => {
        expect.assertions(1);
        const value = "value";
        const value2 = "value2";
        const promessa = new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
                resolve(value2);
                promessa.then((data) => {
                    expect(data).toBe(value);
                    done();
                });
            }, timeout);
        });
    });

    test("Should't call the onFulfilled function twice", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
                resolve(value2);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                }, timeout);
            }, timeout);
        }).then((data) => {
            spy();
            expect(data).not.toBe(value2);
        });
    });

    test("Should asynchronously call the onRejected function registered by the then() method", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            reject(reason);
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(spy).toHaveBeenCalled();
                expect(error).toBe(reason);
                done();
            }
        );
        spy();
    });

    test("Should asynchronously the onRejected function after a timeout", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, timeout);
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(spy).toHaveBeenCalled();
                expect(error).toBe(reason);
                done();
            }
        );
        spy();
    });

    test("Should't call the onRejected function twice", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const reason = "reason";
        const reason2 = "reason2";
        new Promessa(function (resolve, reject) {
            reject(reason);
            reject(reason2);
            setTimeout(function () {
                expect(spy).toHaveBeenCalledTimes(1);
                done();
            }, timeout);
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                spy();
                expect(error).not.toBe(reason2);
            }
        );
    });

    test("Should call the onRejected function registered by the catch() method", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, timeout);
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Test the catch() method in cascade with a then() method", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, timeout);
        })
            .then((data) => {
                throw "Incorrect Behavior";
            })
            .catch((error) => {
                expect(error).toBe(reason);
                done();
            });
    });

    test("Should register two onFulfilled functions in cascade", (done) => {
        expect.assertions(2);
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return value2;
        }).then((data) => {
            expect(data).toBe(value2);
            done();
        });
    });

    test("Should register three onFulfilled functions in cascade", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return value2;
        }).then((data) => {
            expect(data).toBe(value2);
            return value3;
        }).then((data) => {
            expect(data).toBe(value3);
            done();
        });
    });

    test("Should return a Promessa inside a onFulfilled function", (done) => {
        expect.assertions(2);
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, timeout);
            }).then((data) => {
                expect(data).toBe(value2);
                done();
            });
        });
    });

    test("Should return a Promessa inside a onFulfilled function of another onFulfilled function", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, timeout);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(value3);
                    }, timeout);
                }).then((data) => {
                    expect(data).toBe(value3);
                    done();
                });
            });
        });
    });

    test("Should call the onRejected function, even if the rejected Promessa is returned from the onFulfilled function", (done) => {
        expect.assertions(2);
        const value = "value";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    reject(reason);
                }, timeout);
            }).then((data) => {
                throw "Incorrect Behavior";
            });
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Should call the onRejected function, even if the rejected Promessa is returned from deeply nested onFulfilled functions", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, timeout);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        reject(reason);
                    }, timeout);
                }).then((data) => {
                    throw "Incorrect Behavior";
                });
            });
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Should call the onRejected function, without rejecting the external Promessa", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, timeout);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        reject(reason);
                    }, timeout);
                }).then((data) => {
                    throw "Incorrect Behavior";
                });
            }).catch((error) => {
                expect(error).toBe(reason);
                done();
            });
        });
    });

    test("Should call the onFulfilled function in the correct order", (done) => {
        expect.assertions(4);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        const value4 = "value4";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, timeout);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(value3);
                    }, timeout);
                }).then((data) => {
                    expect(data).toBe(value3);
                    return value4;
                });
            }).then((data) => {
                expect(data).toBe(value4);
                done();
            });
        });
    });

    test("If an error is thrown inside the executor funciton, the Promessa must be rejected", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            throw reason;
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });

    test("Should register two onFulfilled functions in the same Promessa", (done) => {
        expect.assertions(5);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const value = "value";
        const value2 = "value2";
        const promessa = new Promessa(function (resolve, reject) {
            resolve(value);
        });
        promessa.then((data) => {
            spy2();
            expect(spy1).toHaveBeenCalled();
            expect(data).toBe(value);
            return value2;
        });
        promessa.then((data) => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(data).toBe(value);
            done();
        });
        spy1();
    });

    test("Should register an onFulfilled function to an already resolved Promessa", (done) => {
        expect.assertions(4);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const spy3 = jest.fn();
        const value = "value";
        const promessa = new Promessa(function (resolve, reject) {
            resolve(value);
        });
        promessa.then((data) => {
            spy2();
            expect(spy1).toHaveBeenCalled();
            expect(data).toBe(value);
            promessa.then((data) => {
                expect(spy3).toHaveBeenCalled();
                expect(data).toBe(value);
                done();
            });
            spy3();
        });
        spy1();
    });

    test("Should register a onFulfilled and a onRejected function to a resolved Promessa", (done) => {
        expect.assertions(4);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const spy3 = jest.fn();
        const value = "value";
        const promessa = new Promessa(function (resolve, reject) {
            resolve(value);
        });
        promessa.then((data) => {
            spy2();
            expect(spy1).toHaveBeenCalled();
            expect(data).toBe(value);
        });
        promessa.catch((error) => {
            spy3();
        });
        spy1();
        setTimeout(() => {
            expect(spy2).toHaveBeenCalled();
            expect(spy3).not.toHaveBeenCalled();
            done();
        }, timeout);
    });

    test("Should register a onFulfilled and a onRejected function to a rejected Promessa", (done) => {
        expect.assertions(4);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const spy3 = jest.fn();
        const reason = "reason";
        const promessa = new Promessa(function (resolve, reject) {
            reject(reason);
        });
        promessa.then((data) => {
            spy2();
        });
        promessa.catch((error) => {
            expect(spy1).toHaveBeenCalled();
            expect(error).toBe(reason);
            spy3();
        });
        spy1();
        setTimeout(() => {
            expect(spy2).not.toHaveBeenCalled();
            expect(spy3).toHaveBeenCalled();
            done();
        }, timeout);
    });

    test("If the reject method receives a Promessa, it should not be resolved before calling the onRejected function", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa((resolve, reject) => {
            const retPromessa = new Promessa((resolve, reject) => {
                resolve(reason);
            });
            reject(retPromessa);
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBeInstanceOf(Promessa);
                done();
            }
        );
    });

    test("If the resolve method receives a Promessa, it should be resolved before calling the onFulfilled function", (done) => {
        expect.assertions(1);
        const value = "value";
        new Promessa((resolve, reject) => {
            const retPromessa = new Promessa((resolve, reject) => {
                resolve(value);
            });
            resolve(retPromessa);
        }).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("If the resolve method receives a rejected Promessa, it should be resolved with the same reason", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa((resolve, reject) => {
            const retPromessa = new Promessa((resolve, reject) => {
                reject(reason);
            });
            resolve(retPromessa);
        }).then(
            (data) => {
                throw "Incorrect Behavior";
            },
            (error) => {
                expect(error).toBe(reason);
                done();
            }
        );
    });

    test("If the resolve method receives a thenable, it should be resolved before calling the onFulfilled function", (done) => {
        expect.assertions(1);
        const value = "value";
        new Promessa((resolve, reject) => {
            resolve({
                then: (resolved) => resolved(value)
            });
        }).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("The finally method should register a onFinally function to be called when the promise resolves", (done) => {
        expect.assertions(2);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                spy2();
                resolve(value);
            }, timeout);
        }).finally(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            done();
        });
        spy1();
    });

    test("The finally method should register a onFinally function to be called when the promises rejects", (done) => {
        expect.assertions(2);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                spy2();
                reject(reason);
            }, timeout);
        }).finally(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            done();
        });
        spy1();
    });

    test("The finally method should register two onFinally functions", (done) => {
        expect.assertions(2);
        const spy1 = jest.fn();
        const spy2 = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, timeout);
        })
            .finally(spy1)
            .finally(() => {
                expect(spy1).toHaveBeenCalled();
                spy2();
            })
            .then(() => {
                expect(spy2).toHaveBeenCalled();
                done();
            });
    });

    test("The finally method should ignore non-function arguments", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                spy();
                resolve(value);
            }, timeout);
        }).finally(undefined).then((data) => {
            expect(spy).toHaveBeenCalled();
            expect(data).toBe(value);
            done();
        });
    });

    test("Throwing inside the onFinally method should reject its returning Promessa", (done) => {
        expect.assertions(1);
        const spy = jest.fn();
        const value = "value";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            resolve(value);
        }).finally(() => {
            throw reason;
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("The finally method should not change the fulfilment value", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const value = "value";
        new Promessa(function (resolve, reject) {
            resolve(value);
        }).finally(spy)
            .then((data) => {
                expect(spy).toHaveBeenCalled();
                expect(data).toBe(value);
                done();
            });
    });

    test("The finally method should not change the rejection reason", (done) => {
        expect.assertions(2);
        const spy = jest.fn();
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            reject(reason);
        }).finally(spy)
            .catch((error) => {
                expect(spy).toHaveBeenCalled();
                expect(error).toBe(reason);
                done();
            });
    });
});