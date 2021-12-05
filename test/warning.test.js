const Promessa = require("../Promessa.js");

describe("Check if the library is correctly reporting warnings", () => {
    const timeout = 30;

    test("Should throw a warning in case of unhandled Promessa rejection", (done) => {
        expect.assertions(4);
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const reason = "unhandledRejection";
        new Promessa(function (resolve, reject) {
            reject(reason);
        });
        setTimeout(() => {
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            const warning = consoleSpy.mock.calls[0][0];
            expect(warning).toBeInstanceOf(Error);
            expect(warning.name).toBe("Warning");
            expect(warning.message).toContain(reason);
            consoleSpy.mockRestore();
            done();
        }, timeout);
    });

    test("Should throw a warning in case of unhandled Promessa rejection, even if a onFulfilled function is registered", (done) => {
        expect.assertions(5);
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const spy = jest.fn();
        const reason = "unhandledRejection";
        new Promessa(function (resolve, reject) {
            reject(reason);
        }).then(spy);
        setTimeout(() => {
            expect(spy).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            const warning = consoleSpy.mock.calls[0][0];
            expect(warning).toBeInstanceOf(Error);
            expect(warning.name).toBe("Warning");
            expect(warning.message).toContain(reason);
            consoleSpy.mockRestore();
            done();
        }, timeout);
    });

    test("Should throw a warning in case of unhandled Promessa rejection, even if a onFinally function is registered", (done) => {
        expect.assertions(5);
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const spy = jest.fn();
        const reason = "unhandledRejection";
        new Promessa(function (resolve, reject) {
            reject(reason);
        }).finally(spy);
        setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
            const warning = consoleSpy.mock.calls[0][0];
            expect(warning).toBeInstanceOf(Error);
            expect(warning.name).toBe("Warning");
            expect(warning.message).toContain(reason);
            consoleSpy.mockRestore();
            done();
        }, timeout);
    });

    test("Should not throw a warning if the Promessa rejection is handled", (done) => {
        expect.assertions(3);
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const spy = jest.fn();
        const reason = "unhandledRejection";
        new Promessa(function (resolve, reject) {
            reject(reason);
        }).catch(spy);
        setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(reason);
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
            done();
        }, timeout);
    });

    test("Should throw two warnings if the Promessa rejection is handled asynchronously", (done) => {
        expect.assertions(9);
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        const spy = jest.fn();
        const reason = "unhandledRejection";
        const promessa = new Promessa(function (resolve, reject) {
            reject(reason);
        });
        setImmediate(() => {
            promessa.catch(spy);
        })
        setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(reason);
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            const warning1 = consoleSpy.mock.calls[0][0];
            expect(warning1).toBeInstanceOf(Error);
            expect(warning1.name).toBe("Warning");
            expect(warning1.message).toContain(reason);
            const warning2 = consoleSpy.mock.calls[1][0];
            expect(warning2).toBeInstanceOf(Error);
            expect(warning2.name).toBe("Warning");
            expect(warning2.message).toContain("Promessa rejection was handled asynchronously");
            consoleSpy.mockRestore();
            done();
        }, timeout);
    });
});