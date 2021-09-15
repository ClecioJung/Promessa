import _Promise from './Promise.mjs';

test('Test the then() clause', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
    });
});

test('Test the catch() clause', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).catch((data) => {
        expect(data).toBe('_Promise test');
    });
});

test('Test the catch() in cascade with a then() clause', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }).catch((data) => {
        expect(data).toBe('_Promise test');
    });
});

test('Test the then() method to register a onRejected callback', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('_Promise test');
        }, 100);
    }).then((data) => {
        return 'Incorect Behavior';
    }, (data) => {
        expect(data).toBe('_Promise test');
    });
});

test('Test two then() clauses in cascade', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return '_Promise test 2';
    }).then((data) => {
        expect(data).toBe('_Promise test 2');
    });
});

test('Test a chain of two then() clauses', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
        });
    });
});

test('Test a chain of three then() clauses', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('_Promise test 3');
                }, 100);
            }).then((data) => {
                expect(data).toBe('_Promise test 3');
            });
        });
    });
});

test('Test if catch() can resolve an error in chain of three then() clauses', () => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('_Promise test');
        }, 100);
    }).then((data) => {
        expect(data).toBe('_Promise test');
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('_Promise test 2');
            }, 100);
        }).then((data) => {
            expect(data).toBe('_Promise test 2');
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject('_Promise test 3');
                }, 100);
            }).then((data) => {
                return 'Incorect Behavior';
            });
        });
    }).catch((data) => {
        expect(data).toBe('_Promise test 3');
    });
});