var postMessage = this.postMessage;

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading Python 2 Runtime..."});
        importScripts("lib/Promise.min.js");
        importScripts("lib/FunctionPromise.js");
        importScripts("lib/pypyjs.js");
        postMessage({type: "progress", progress: 0.3, text: "Loading Python 2 Runtime..."});
        pypyjs.ready().then(function () {
            postMessage({type: "progress", progress: 0.3, text: "Loading Python 2 API..."});
            pypyjs.exec("import api").then(function () {
                postMessage({type: "ready"});
            }).catch(function (err) {
                postMessage({type: "loaded", err: "Error while loading API:\n" + err.trace});
            });
        }).catch(function (err) {
            postMessage({type: "loaded", err: "Error while loading runtime:\n" + err.toString()});
        });
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.8, text: "Executing Script..."});
        pypyjs.exec(data.code).then(function () {
            postMessage({type: "loaded"});
        }).catch(function (err) {
            postMessage({type: "loaded", err: err.trace});
        });
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        pypyjs.exec("api.verify()").then(function () {
            postMessage({type: "verified"});
        }).catch(function (err) {
            postMessage({type: "loaded", err: "Error while verifying:\n" + err.trace});
        });
    },
    new_data: function (data) {
        pypyjs.eval("api.call_control(" + JSON.stringify(data.data) + ")").then(function (ret) {
            postMessage({type: "cmds", cmds: ret});
        }).catch(function (err) {
            postMessage({type: "cmds", err: "Error while calling script:\n" + err.trace});
        });
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);
