function getRuntime(basepath, progress, finished) {
    pypyjs = undefined;

    function check_ready() {
        if (pypyjs === undefined) {
            setTimeout(check_ready, 100);
            return;
        }

        progress(0.3, "Loading Python 2 Runtime...");
        pypyjs.ready().then(function() {
            finished({
                load: function (script, done, err) {
                    pypyjs.exec(script).then(done, err);
                },
                verify: function (done, err) {
                    done();
                },
                new_data: function (data, done, err) {
                    pypyjs.eval("control(" + JSON.stringify(data) + ")").then(function (ret) {
                        if (typeof(ret) === "string") {
                            done(ret);
                        }
                        else {
                            err("Bad type");
                        }
                    }, err);
                }
            })
        })
    }

    progress(0, "Loading Python 2 Runtime...");
    safeLoadScript(basepath + "python2/pypyjs-release/lib/Promise.min.js");
    safeLoadScript(basepath + "python2/pypyjs-release/lib/FunctionPromise.js");
    safeLoadScript(basepath + "python2/pypyjs-release/lib/pypyjs.js");
    check_ready();
}
