var luaState;
var postMessage = this.postMessage;

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading Lua Runtime..."});
        importScripts("fengari-web.js");
        postMessage({type: "progress", progress: 0.3, text: "Loading Lua Runtime..."});
        luaState = fengari.lauxlib.luaL_newstate();
        fengari.lualib.luaL_openlibs(luaState);
        postMessage({type: "ready"});
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.8, text: "Executing Script..."});
        if (fengari.lauxlib.luaL_dostring(luaState, fengari.to_luastring(data.code)) != 0) {
            postMessage({type: "loaded", err: "error running function `f':" + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return;
        }
        postMessage({type: "loaded"});
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.9, text: "Verifying Script..."});
        postMessage({type: "verified"});
    },
    new_data: function (data) {
        fengari.lua.lua_getglobal(luaState, fengari.to_luastring("control"));
        fengari.lua.lua_pushstring(luaState, fengari.to_luastring(data.data));

        if (fengari.lua.lua_pcall(luaState, 1, 1, 0) != 0) {
            postMessage({type: "cmds", err: "error running function `f':" + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return;
        }

        if (!fengari.lua.lua_isstring(luaState, -1)) {
            postMessage({type: "cmds", err: "Bad type"});
            return;
        }
        ret = fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1));
        fengari.lua.lua_pop(luaState, 1);
        postMessage({type: "cmds", cmds: ret});
    }
};

self.addEventListener("message", function(e) {
    callbacks[e.data.type](e.data);
}, false);
