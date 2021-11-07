function async(genFn) {
    const gen = genFn();
    return function recursiveAsync(result) {
        const { value, done } = gen.next(result);
        if (done) gen.return(value);
        try {
            if (typeof value === "object" || typeof value === "function") {
                const then = value.then;
                if (then && typeof then === "function") {
                    then.call(value,
                        (result) => recursiveAsync(result),
                        (reason) => gen.throw(reason)
                    );
                    return;
                }
            }
            recursiveAsync(value);
        } catch (error) {
            gen.throw(error);
        }
    }
}

module.exports = async;