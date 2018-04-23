var postMessage = this.postMessage;
var worker = this;

function exec_py(code) {
    try {
        window.error_msg = "";
        __BRYTHON__._load_scripts([{
            name: '__main__',
            src: code,
            url: ""
        }])
    }
    catch (e) {
        return window.error_msg;
    }
}

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading Python 3 Runtime..."});
        window = worker;
        __BRYTHON__ = {isa_web_worker: true};
        importScripts("brython.js");
        importScripts("brython_stdlib.js");
        brython(1)
        postMessage({type: "progress", progress: 0.3, text: "Loading Python 3 API..."});
        var err = exec_py("import sys\ndef w(v):\n import browser\n print(browser.window)\n browser.window.error_msg += v\nsys.stderr.write=w\nimport api");
        if (err !== undefined) {
            postMessage({type: "ready", err: "Error while loading API:\n" + err});
        }
        else {
            postMessage({type: "ready"});
        }
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.8, text: "Executing Script..."});
        var err = exec_py(data.code + "\nimport api\napi.captured_control=control");
        if (err !== undefined) {
            postMessage({type: "loaded", err: "Error while loading script:\n" + err});
        }
        else {
            postMessage({type: "loaded"});
        }
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        var err = exec_py("import api\napi.verify()");
        if (err !== undefined) {
            postMessage({type: "verified", err: "Error while verifying script:\n" + err});
        }
        else {
            postMessage({type: "verified"});
        }
    },
    new_data: function (data) {
        var err = exec_py("import api\nimport browser\nbrowser.window.result=api.call_control(" + JSON.stringify(data.data) + ")");
        if (err !== undefined) {
            postMessage({type: "cmds", err: "Error while calling script:\n" + err});
        }
        else {
            postMessage({type: "cmds", cmds: window.result});
        }
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);
