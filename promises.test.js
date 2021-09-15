import _Promise from './Promise.mjs';

test('Test the then() clause', function (done) {
    expect.assertions(1);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        done();
    });
});

test('Don\'t run a second call to resolve()', function (done) {
    expect.assertions(1);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
            setTimeout(function () {
                resolve('Invalid resolve');
                done();
            }, 100);
        }, 100);
    }).then((data) => {
        expect(data).not.toBe('Invalid resolve');
    });
});

test('Test the then() method to register a onRejected callback', function (done) {
    expect.assertions(1);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }, (error) => {
        expect(error).toBe('_Promise test');
        done();
    });
});

test('Test the catch() clause', function (done) {
    expect.assertions(1);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).catch((error) => {
        expect(error).toBe('_Promise test');
        done();
    });
});

test('Test the catch() in cascade with a then() clause', function (done) {
    expect.assertions(1);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }).catch((data) => {
        expect(data).toBe('_Promise test');
        done();
    });
});

test('Test two then() clauses in cascade', function (done) {
    expect.assertions(2);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return '_Promise test 2';
    }).then((data) => {
        expect(data).toBe('_Promise test 2');
        done();
    });
});

test('Test three then() clauses in cascade', function (done) {
    expect.assertions(3);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return '_Promise test 2';
    }).then((data) => {
        expect(data).toBe('_Promise test 2');
        return '_Promise test 3';
    }).then((data) => {
        expect(data).toBe('_Promise test 3');
        done();
    });
});

test('Test a chain of two then() clauses', function (done) {
    expect.assertions(2);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            done();
        });
    });
});

test('Test a chain of three then() clauses', function (done) {
    expect.assertions(3);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new _Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('_Promise test 3');
                }, 100);
            }).then((data) => {
                expect(data).toBe('_Promise test 3');
                done();
            });
        });
    });
});

test('Test if catch() can resolve an error in chain of two then() clauses', function (done) {
    expect.assertions(2);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                reject('_Promise error');
            }, 100);
        }).then((data) => {
            return 'Incorect Behavior';
        });
    }).catch((error) => {
        expect(error).toBe('_Promise error');
        done();
    });
});

test('Test if catch() can resolve an error in chain of three then() clauses', function (done) {
    expect.assertions(3);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new _Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject('_Promise error');
                }, 100);
            }).then((data) => {
                return 'Incorect Behavior';
            });
        });
    }).catch((error) => {
        expect(error).toBe('_Promise error');
        done();
    });
});

test('Test if catch() can resolve an error inside a then() clause', function (done) {
    expect.assertions(3);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new _Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject('_Promise error');
                }, 100);
            }).then((data) => {
                return 'Incorect Behavior';
            });
        }).catch((error) => {
            expect(error).toBe('_Promise error');
            done();
        });
    });
});

test('Test order of execution in chain of then() clauses', function (done) {
    expect.assertions(4);
    new _Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new _Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new _Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('_Promise test 3');
                }, 100);
            }).then((data) => {
                expect(data).toBe('_Promise test 3');
                return '_Promise test 4';
            });
        }).then((data) => {
            expect(data).toBe('_Promise test 4');
            done();
        });
    });
});

/*test.only('Test unhandled promise rejection', function (done) {
    expect.assertions(1);
    try {
        new _Promise(function (resolve, reject) {
            setTimeout(function () {
                reject('_Promise test');
            }, 100);
        });
    } catch (error) {
        expect(error).toBe('Unhandled Promise Rejection\n\tError: _Promise test');
        done();
    }
});*/

// throw error in case of unhandled promise rejection
// finally