import crypto from 'crypto';
import Promessa from './Promessa.js';

const generate = function () {
    return crypto.randomBytes(20).toString('hex');
};

test('Test the then() clause', function (done) {
    expect.assertions(1);
    const result = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        done();
    });
});

test('Don\'t run a second call to resolve()', function (done) {
    expect.assertions(1);
    const result = generate();
    const result2 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
            setTimeout(function () {
                resolve(result2);
                done();
            }, 100);
        }, 100);
    }).then((data) => {
        expect(data).not.toBe(result2);
    });
});

test('Test the then() method to register a onRejected callback', function (done) {
    expect.assertions(1);
    const result = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            reject(result);
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }, (error) => {
        expect(error).toBe(result);
        done();
    });
});

test('Test the catch() clause', function (done) {
    expect.assertions(1);
    const result = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            reject(result);
        }, 100);
    }).catch((error) => {
        expect(error).toBe(result);
        done();
    });
});

test('Test the catch() in cascade with a then() clause', function (done) {
    expect.assertions(1);
    const result = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            reject(result);
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }).catch((data) => {
        expect(data).toBe(result);
        done();
    });
});

test('Test two then() clauses in cascade', function (done) {
    expect.assertions(2);
    const result = generate();
    const result2 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return result2;
    }).then((data) => {
        expect(data).toBe(result2);
        done();
    });
});

test('Test three then() clauses in cascade', function (done) {
    expect.assertions(3);
    const result = generate();
    const result2 = generate();
    const result3 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return result2;
    }).then((data) => {
        expect(data).toBe(result2);
        return result3;
    }).then((data) => {
        expect(data).toBe(result3);
        done();
    });
});

test('Test a chain of two then() clauses', function (done) {
    expect.assertions(2);
    const result = generate();
    const result2 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(result2);
            }, 100);
        }).then((data) => {
            expect(data).toBe(result2);
            done();
        });
    });
});

test('Test a chain of three then() clauses', function (done) {
    expect.assertions(3);
    const result = generate();
    const result2 = generate();
    const result3 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(result2);
            }, 100);
        }).then((data) => {
            expect(data).toBe(result2);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(result3);
                }, 100);
            }).then((data) => {
                expect(data).toBe(result3);
                done();
            });
        });
    });
});

test('Test if catch() can resolve an error in chain of two then() clauses', function (done) {
    expect.assertions(2);
    const result = generate();
    const result2 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                reject(result2);
            }, 100);
        }).then((data) => {
            return 'Incorect Behavior';
        });
    }).catch((error) => {
        expect(error).toBe(result2);
        done();
    });
});

test('Test if catch() can resolve an error in chain of three then() clauses', function (done) {
    expect.assertions(3);
    const result = generate();
    const result2 = generate();
    const result3 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(result2);
            }, 100);
        }).then((data) => {
            expect(data).toBe(result2);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    reject(result3);
                }, 100);
            }).then((data) => {
                return 'Incorect Behavior';
            });
        });
    }).catch((error) => {
        expect(error).toBe(result3);
        done();
    });
});

test('Test if catch() can resolve an error inside a then() clause', function (done) {
    expect.assertions(3);
    const result = generate();
    const result2 = generate();
    const result3 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(result2);
            }, 100);
        }).then((data) => {
            expect(data).toBe(result2);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    reject(result3);
                }, 100);
            }).then((data) => {
                return 'Incorect Behavior';
            });
        }).catch((error) => {
            expect(error).toBe(result3);
            done();
        });
    });
});

test('Test order of execution in chain of then() clauses', function (done) {
    expect.assertions(4);
    const result = generate();
    const result2 = generate();
    const result3 = generate();
    const result4 = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
        return new Promessa(function (resolve, reject) {
            setTimeout(function () {
                resolve(result2);
            }, 100);
        }).then((data) => {
            expect(data).toBe(result2);
            return new Promessa(function (resolve, reject) {
                setTimeout(function () {
                    resolve(result3);
                }, 100);
            }).then((data) => {
                expect(data).toBe(result3);
                return result4;
            });
        }).then((data) => {
            expect(data).toBe(result4);
            done();
        });
    });
});

test('Test the finally() clause', function (done) {
    expect.assertions(1);
    const result = generate();
    new Promessa(function (resolve, reject) {
        setTimeout(function () {
            resolve(result);
        }, 100);
    }).then((data) => {
        expect(data).toBe(result);
    }).finally(() => {
        done();
    });
});