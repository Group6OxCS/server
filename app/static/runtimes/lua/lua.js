var luaState;
var postMessage = this.postMessage;

function stackDump(L) {
    var top = fengari.lua.lua_gettop(L);
    for (var i = 1; i <= top; i++) {
        var t = fengari.lua.lua_type(L, i);
        switch (t) {
        case fengari.lua.LUA_TSTRING:  /* strings */
            console.log(fengari.to_jsstring(fengari.lua.lua_tostring(L, i)));
            break;

        case fengari.lua.LUA_TBOOLEAN:  /* booleans */
            console.log(fengari.lua.lua_toboolean(L, i) ? "true" : "false");
            break;

        case fengari.lua.LUA_TNUMBER:  /* numbers */
            console.log(fengari.lua.lua_tonumber(L, i));
            break;

        default:  /* other values */
            console.log(fengari.to_jsstring(fengari.lua.lua_typename(L, t)));
            break;
        }
    }
}

var callbacks = {
    begin: function (data) {
        postMessage({type: "progress", progress: 0, text: "Loading Lua Runtime..."});
        importScripts("fengari-web.js");
        postMessage({type: "progress", progress: 0.25, text: "Loading Lua Runtime..."});
        luaState = fengari.lauxlib.luaL_newstate();
        fengari.lualib.luaL_openlibs(luaState);
        postMessage({type: "progress", progress: 0.3, text: "Loading Lua API..."});
        fengari.lua.lua_getglobal(luaState, fengari.to_luastring("require"));
        fengari.lua.lua_pushstring(luaState, fengari.to_luastring("api"));
        if (fengari.lua.lua_pcall(luaState, 1, 1, 0) != 0) {
            postMessage({type: "ready", err: "Lua error while loading api: " + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return fengari.lua.lua_remove(luaState, -1);
        }
        fengari.lua.lua_setglobal(luaState, fengari.to_luastring("api"));
        postMessage({type: "ready"});
    },
    load: function (data) {
        postMessage({type: "progress", progress: 0.5, text: "Executing Script..."});
        if (fengari.lauxlib.luaL_dostring(luaState, fengari.to_luastring(data.code)) != 0) {
            postMessage({type: "loaded", err: "Lua error while loading scrpit: " + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return fengari.lua.lua_remove(luaState, -1);
        }
        postMessage({type: "loaded"});
    },
    verify: function (data) {
        postMessage({type: "progress", progress: 0.8, text: "Verifying Script..."});
        fengari.lua.lua_getglobal(luaState, fengari.to_luastring("api"));
        fengari.lua.lua_getfield(luaState, -1, fengari.to_luastring("verify"));
        fengari.lua.lua_remove(luaState, -2);
        if (fengari.lua.lua_pcall(luaState, 0, 0, 0) != 0) {
            postMessage({type: "verified", err: "Lua error while verifying script: " + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return fengari.lua.lua_remove(luaState, -1);
        }
        postMessage({type: "verified"});
    },
    new_data: function (data) {
        fengari.lua.lua_getglobal(luaState, fengari.to_luastring("api"));
        fengari.lua.lua_getfield(luaState, -1, fengari.to_luastring("call_control"));
        fengari.lua.lua_remove(luaState, -2);
        fengari.lua.lua_pushstring(luaState, fengari.to_luastring(data.data));

        if (fengari.lua.lua_pcall(luaState, 1, 1, 0) != 0) {
            postMessage({type: "cmds", err: "Lua error while calling script: " + fengari.to_jsstring(fengari.lua.lua_tostring(luaState, -1))});
            return fengari.lua.lua_remove(luaState, -1);
        }

        if (!fengari.lua.lua_isstring(luaState, -1)) {
            postMessage({type: "cmds", err: "Lua error while calling script: Bad result type, should be a string"});
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
