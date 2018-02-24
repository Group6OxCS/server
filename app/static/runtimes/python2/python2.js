pypyjs = undefined;
var postMessage = this.postMessage;

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading Python 2 Runtime..."});
        importScripts("pypyjs-release/lib/Promise.min.js");
        importScripts("pypyjs-release/lib/FunctionPromise.js");
        importScripts("pypyjs-release/lib/pypyjs.js");
        postMessage({type: "progress", progress: 0.3, text: "Loading Python 2 Runtime..."});
        pypyjs.ready().then(function () {
            postMessage({type: "ready"});
        })
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.8, text: "Executing Script..."});
        pypyjs.exec(data.code).then(function () {
            postMessage({type: "loaded"});
        }).catch(function (err) {
            postMessage({type: "loaded", err: err.toString()});
        });
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        postMessage({type: "verified"});
    },
    new_data: function (data) {
        pypyjs.eval("control(" + JSON.stringify(data.data) + ")").then(function (ret) {
            if (typeof(ret) === "string") {
                postMessage({type: "cmds", cmds: ret});
            }
            else {
                postMessage({type: "cmds", err: "Bad type"});
            }
        }).catch(function (err) {
            postMessage({type: "cmds", err: err.toString()});
        });
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);

console.log(this.postMessage);
