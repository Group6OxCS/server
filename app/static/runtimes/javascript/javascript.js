var extractedControl;
var postMessage = this.postMessage;

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading JavaScript API..."});
        importScripts("api.js");
        postMessage({type: "ready"});
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.5, text: "Executing Script..."});
        try {
            extractedControl = (function(code) { return eval(code + ";control"); })(data.code);
        }
        catch (e) {
            postMessage({type: "loaded", err: "Error while loading script:\n" + e.stack});
            return;
        }
        postMessage({type: "loaded"});
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        if (typeof extractedControl !== "function") {
            postMessage({type: "verified", err: "Error while loading script:\nControl function missing / incorrectly defined"});
            return;
        }
        postMessage({type: "verified"});
    },
    new_data: function (data) {
        var car = new api.Car(data.data);
        try {
            extractedControl(car);
        }
        catch (e) {
            postMessage({type: "cmds", err: "Error while executing script:\n" + e.stack});
            return;
        }
        postMessage({type: "cmds", cmds: car.serialize()});
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);
