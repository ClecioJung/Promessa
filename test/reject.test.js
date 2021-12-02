const Promessa = require("../Promessa.js");

describe("Test the reject static method", () => {
    const timeout = 30;

    test("The reject method should return a Promessa", () => {
        expect(Promessa.reject()).toBeInstanceOf(Promessa);
    });

    test("Should create an already rejected Promessa", (done) => {
        expect.assertions(1);
        const reason = "reason";
        Promessa.reject(reason)
            .catch((error) => {
                expect(error).toBe(reason);
                done();
            });
    });

    test("If the reject method receives a Promessa, it should not be resolved before calling the onRejected function", (done) => {
        expect.assertions(1);
        const reason = "reason";
        Promessa.reject(new Promessa((resolve, reject) => {
            resolve(reason);
        })).catch((error) => {
            expect(error).toBeInstanceOf(Promessa);
            done();
        });
    });
});