var extractedControl;
var postMessage = this.postMessage;

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading JavaScript Runtime..."});
        postMessage({type: "ready"});
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.5, text: "Executing Script..."});
        extractedControl = (function(code) { return eval(code + ";control"); })(data.code);
        postMessage({type: "loaded"});
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        postMessage({type: "verified"});
    },
    new_data: function (data) {
        var ret = extractedControl(data.data);
        if (typeof(ret) === "string") {
            postMessage({type: "cmds", cmds: ret});
        }
        else {
            postMessage({type: "cmds", err: "Bad type"});
        }
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);
