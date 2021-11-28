const Promessa = require("./Promessa.js");

describe("Test the Promessa class", () => {
    test("Should execute the onFulfilled method registered by the then() method", (done) => {
        expect.assertions(1);
        const value = "value";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            done();
        });
    });

    test("Should't execute the onFulfilled method twice", (done) => {
        expect.assertions(1);
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
                setTimeout(function () {
                    resolve(value2);
                    done();
                }, 100);
            }, 100);
        }).then((data) => {
            expect(data).not.toBe(value2);
        });
    });

    test("Should execute the onRejected method registered by the then() method", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 100);
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

    test("Should execute the onRejected method registered by the catch() method", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 100);
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Test the catch() method in cascade with a then() clause", (done) => {
        expect.assertions(1);
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(reason);
            }, 100);
        })
            .then((data) => {
                throw "Incorrect Behavior";
            })
            .catch((error) => {
                expect(error).toBe(reason);
                done();
            });
    });

    test("Should register two onFulfilled methods in cascade", (done) => {
        expect.assertions(2);
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return value2;
        }).then((data) => {
            expect(data).toBe(value2);
            done();
        });
    });

    test("Should register three onFulfilled methods in cascade", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
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

    test("Should return a promessa inside a onFulfilled method", (done) => {
        expect.assertions(2);
        const value = "value";
        const value2 = "value2";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, 100);
            }).then((data) => {
                expect(data).toBe(value2);
                done();
            });
        });
    });

    test("Should return a promessa inside a onFulfilled method of another onFulfilled method", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, 100);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(value3);
                    }, 100);
                }).then((data) => {
                    expect(data).toBe(value3);
                    done();
                });
            });
        });
    });

    test("Should execute the onRejected method, even if the failling promessa is returned from the onFulfilled method", (done) => {
        expect.assertions(2);
        const value = "value";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    reject(reason);
                }, 100);
            }).then((data) => {
                throw "Incorrect Behavior";
            });
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Should execute the onRejected method, even if the failling promessa is returned from deeply nested onFulfilled methods", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, 100);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        reject(reason);
                    }, 100);
                }).then((data) => {
                    throw "Incorrect Behavior";
                });
            });
        }).catch((error) => {
            expect(error).toBe(reason);
            done();
        });
    });

    test("Should execute the onRejected method, without rejecting the external promessa", (done) => {
        expect.assertions(3);
        const value = "value";
        const value2 = "value2";
        const reason = "reason";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, 100);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        reject(reason);
                    }, 100);
                }).then((data) => {
                    throw "Incorrect Behavior";
                });
            }).catch((error) => {
                expect(error).toBe(reason);
                done();
            });
        });
    });

    test("Should execute the onFulfilled method in the correct order", (done) => {
        expect.assertions(4);
        const value = "value";
        const value2 = "value2";
        const value3 = "value3";
        const value4 = "value4";
        new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(value);
            }, 100);
        }).then((data) => {
            expect(data).toBe(value);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value2);
                }, 100);
            }).then((data) => {
                expect(data).toBe(value2);
                return new Promessa(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(value3);
                    }, 100);
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

    test("Should create an already resolved promessa", (done) => {
        const value = "value";
        Promessa.resolve(value)
            .then((data) => {
                expect(data).toBe(value);
                done();
            });
    });

    test("Should create an already rejected promessa", (done) => {
        const reason = "reason";
        Promessa.reject(reason)
            .then(
                (data) => {
                    throw "Incorrect Behavior";
                },
                (error) => {
                    expect(error).toBe(reason);
                    done();
                }
            );
    });

    test("If the reject method receives a promessa, it should'n be resolved before calling the onRejected method", (done) => {
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
});