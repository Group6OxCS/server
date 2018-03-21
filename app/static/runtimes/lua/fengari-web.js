(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fengari"] = factory();
	else
		root["fengari"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(4),
    LUAI_MAXSTACK = _require.LUAI_MAXSTACK;

/*
 * Fengari specific string conversion functions
 */

var luastring_from = void 0;
if (typeof Uint8Array.from === "function") {
    luastring_from = Uint8Array.from.bind(Uint8Array);
} else {
    luastring_from = function luastring_from(a) {
        var i = 0;
        var len = a.length;
        var r = new Uint8Array(len);
        while (len > i) {
            r[i] = a[i++];
        }return r;
    };
}

var luastring_indexOf = void 0;
if (typeof new Uint8Array().indexOf === "function") {
    luastring_indexOf = function luastring_indexOf(s, v, i) {
        return s.indexOf(v, i);
    };
} else {
    /* Browsers that don't support Uint8Array.indexOf seem to allow using Array.indexOf on Uint8Array objects e.g. IE11 */
    var array_indexOf = [].indexOf;
    if (array_indexOf.call(new Uint8Array(1), 0) !== 0) throw Error("missing .indexOf");
    luastring_indexOf = function luastring_indexOf(s, v, i) {
        return array_indexOf.call(s, v, i);
    };
}

var luastring_of = void 0;
if (typeof Uint8Array.of === "function") {
    luastring_of = Uint8Array.of.bind(Uint8Array);
} else {
    luastring_of = function luastring_of() {
        return luastring_from(arguments);
    };
}

var is_luastring = function is_luastring(s) {
    return s instanceof Uint8Array;
};

/* test two lua strings for equality */
var luastring_eq = function luastring_eq(a, b) {
    if (a !== b) {
        var len = a.length;
        if (len !== b.length) return false;
        /* XXX: Should this be a constant time algorithm? */
        for (var i = 0; i < len; i++) {
            if (a[i] !== b[i]) return false;
        }
    }
    return true;
};

var to_jsstring = function to_jsstring(value, from, to, replacement_char) {
    if (!is_luastring(value)) throw new TypeError("to_jsstring expects a Uint8Array");

    if (to === void 0) {
        to = value.length;
    } else {
        to = Math.min(value.length, to);
    }

    var str = "";
    for (var i = from !== void 0 ? from : 0; i < to;) {
        var u0 = value[i++];
        if (u0 < 0x80) {
            /* single byte sequence */
            str += String.fromCharCode(u0);
        } else if (u0 < 0xC2 || u0 > 0xF4) {
            if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
            str += "�";
        } else if (u0 <= 0xDF) {
            /* two byte sequence */
            if (i >= to) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var u1 = value[i++];
            if ((u1 & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            str += String.fromCharCode(((u0 & 0x1F) << 6) + (u1 & 0x3F));
        } else if (u0 <= 0xEF) {
            /* three byte sequence */
            if (i + 1 >= to) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var _u = value[i++];
            if ((_u & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var u2 = value[i++];
            if ((u2 & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var u = ((u0 & 0x0F) << 12) + ((_u & 0x3F) << 6) + (u2 & 0x3F);
            if (u <= 0xFFFF) {
                /* BMP codepoint */
                str += String.fromCharCode(u);
            } else {
                /* Astral codepoint */
                u -= 0x10000;
                var s1 = (u >> 10) + 0xD800;
                var s2 = u % 0x400 + 0xDC00;
                str += String.fromCharCode(s1, s2);
            }
        } else {
            /* four byte sequence */
            if (i + 2 >= to) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var _u2 = value[i++];
            if ((_u2 & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var _u3 = value[i++];
            if ((_u3 & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            var u3 = value[i++];
            if ((u3 & 0xC0) !== 0x80) {
                if (!replacement_char) throw RangeError("cannot convert invalid utf8 to javascript string");
                str += "�";
                continue;
            }
            /* Has to be astral codepoint */
            var _u4 = ((u0 & 0x07) << 18) + ((_u2 & 0x3F) << 12) + ((_u3 & 0x3F) << 6) + (u3 & 0x3F);
            _u4 -= 0x10000;
            var _s = (_u4 >> 10) + 0xD800;
            var _s2 = _u4 % 0x400 + 0xDC00;
            str += String.fromCharCode(_s, _s2);
        }
    }
    return str;
};

/* bytes allowed unescaped in a uri */
var uri_allowed = ";,/?:@&=+$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,-_.!~*'()#".split('').reduce(function (uri_allowed, c) {
    uri_allowed[c.charCodeAt(0)] = true;
    return uri_allowed;
}, {});

/* utility function to convert a lua string to a js string with uri escaping */
var to_uristring = function to_uristring(a) {
    if (!is_luastring(a)) throw new TypeError("to_uristring expects a Uint8Array");
    var s = "";
    for (var i = 0; i < a.length; i++) {
        var v = a[i];
        if (uri_allowed[v]) {
            s += String.fromCharCode(v);
        } else {
            s += "%" + (v < 0x10 ? "0" : "") + v.toString(16);
        }
    }
    return s;
};

var to_luastring_cache = {};

var to_luastring = function to_luastring(str, cache) {
    if (typeof str !== "string") throw new TypeError("to_luastring expects a javascript string");

    if (cache) {
        var cached = to_luastring_cache[str];
        if (is_luastring(cached)) return cached;
    }

    var len = str.length;
    var outU8Array = Array(len); /* array is at *least* going to be length of string */
    var outIdx = 0;
    for (var i = 0; i < len; ++i) {
        var u = str.charCodeAt(i);
        if (u <= 0x7F) {
            outU8Array[outIdx++] = u;
        } else if (u <= 0x7FF) {
            outU8Array[outIdx++] = 0xC0 | u >> 6;
            outU8Array[outIdx++] = 0x80 | u & 63;
        } else {
            /* This part is to work around possible lack of String.codePointAt */
            if (u >= 0xD800 && u <= 0xDBFF && i + 1 < len) {
                /* is first half of surrogate pair */
                var v = str.charCodeAt(i + 1);
                if (v >= 0xDC00 && v <= 0xDFFF) {
                    /* is valid low surrogate */
                    i++;
                    u = (u - 0xD800) * 0x400 + v + 0x2400;
                }
            }
            if (u <= 0xFFFF) {
                outU8Array[outIdx++] = 0xE0 | u >> 12;
                outU8Array[outIdx++] = 0x80 | u >> 6 & 63;
                outU8Array[outIdx++] = 0x80 | u & 63;
            } else {
                outU8Array[outIdx++] = 0xF0 | u >> 18;
                outU8Array[outIdx++] = 0x80 | u >> 12 & 63;
                outU8Array[outIdx++] = 0x80 | u >> 6 & 63;
                outU8Array[outIdx++] = 0x80 | u & 63;
            }
        }
    }
    outU8Array = luastring_from(outU8Array);

    if (cache) to_luastring_cache[str] = outU8Array;

    return outU8Array;
};

var from_userstring = function from_userstring(str) {
    if (!is_luastring(str)) throw new TypeError("expects an array of bytes");
    return str;
};

/* mark for precompiled code ('<esc>Lua') */
var LUA_SIGNATURE = to_luastring("\x1bLua");

var LUA_VERSION_MAJOR = "5";
var LUA_VERSION_MINOR = "3";
var LUA_VERSION_NUM = 503;
var LUA_VERSION_RELEASE = "4";

var LUA_VERSION = "Lua " + LUA_VERSION_MAJOR + "." + LUA_VERSION_MINOR;
var LUA_RELEASE = LUA_VERSION + "." + LUA_VERSION_RELEASE;
var LUA_COPYRIGHT = LUA_RELEASE + "  Copyright (C) 1994-2017 Lua.org, PUC-Rio";
var LUA_AUTHORS = "R. Ierusalimschy, L. H. de Figueiredo, W. Celes";

var LUA_VERSUFFIX = "_" + LUA_VERSION_MAJOR + "_" + LUA_VERSION_MINOR;

var LUA_INIT_VAR = "LUA_INIT";
var LUA_INITVARVERSION = LUA_INIT_VAR + LUA_VERSUFFIX;

var thread_status = {
    LUA_OK: 0,
    LUA_YIELD: 1,
    LUA_ERRRUN: 2,
    LUA_ERRSYNTAX: 3,
    LUA_ERRMEM: 4,
    LUA_ERRGCMM: 5,
    LUA_ERRERR: 6
};

var constant_types = {
    LUA_TNONE: -1,
    LUA_TNIL: 0,
    LUA_TBOOLEAN: 1,
    LUA_TLIGHTUSERDATA: 2,
    LUA_TNUMBER: 3,
    LUA_TSTRING: 4,
    LUA_TTABLE: 5,
    LUA_TFUNCTION: 6,
    LUA_TUSERDATA: 7,
    LUA_TTHREAD: 8,
    LUA_NUMTAGS: 9
};

constant_types.LUA_TSHRSTR = constant_types.LUA_TSTRING | 0 << 4; /* short strings */
constant_types.LUA_TLNGSTR = constant_types.LUA_TSTRING | 1 << 4; /* long strings */

constant_types.LUA_TNUMFLT = constant_types.LUA_TNUMBER | 0 << 4; /* float numbers */
constant_types.LUA_TNUMINT = constant_types.LUA_TNUMBER | 1 << 4; /* integer numbers */

constant_types.LUA_TLCL = constant_types.LUA_TFUNCTION | 0 << 4; /* Lua closure */
constant_types.LUA_TLCF = constant_types.LUA_TFUNCTION | 1 << 4; /* light C function */
constant_types.LUA_TCCL = constant_types.LUA_TFUNCTION | 2 << 4; /* C closure */

/*
** Comparison and arithmetic functions
*/

var LUA_OPADD = 0; /* ORDER TM, ORDER OP */
var LUA_OPSUB = 1;
var LUA_OPMUL = 2;
var LUA_OPMOD = 3;
var LUA_OPPOW = 4;
var LUA_OPDIV = 5;
var LUA_OPIDIV = 6;
var LUA_OPBAND = 7;
var LUA_OPBOR = 8;
var LUA_OPBXOR = 9;
var LUA_OPSHL = 10;
var LUA_OPSHR = 11;
var LUA_OPUNM = 12;
var LUA_OPBNOT = 13;

var LUA_OPEQ = 0;
var LUA_OPLT = 1;
var LUA_OPLE = 2;

var LUA_MINSTACK = 20;

var LUA_REGISTRYINDEX = -LUAI_MAXSTACK - 1000;

var lua_upvalueindex = function lua_upvalueindex(i) {
    return LUA_REGISTRYINDEX - i;
};

/* predefined values in the registry */
var LUA_RIDX_MAINTHREAD = 1;
var LUA_RIDX_GLOBALS = 2;
var LUA_RIDX_LAST = LUA_RIDX_GLOBALS;

var lua_Debug = function lua_Debug() {
    _classCallCheck(this, lua_Debug);

    this.event = NaN;
    this.name = null; /* (n) */
    this.namewhat = null; /* (n) 'global', 'local', 'field', 'method' */
    this.what = null; /* (S) 'Lua', 'C', 'main', 'tail' */
    this.source = null; /* (S) */
    this.currentline = NaN; /* (l) */
    this.linedefined = NaN; /* (S) */
    this.lastlinedefined = NaN; /* (S) */
    this.nups = NaN; /* (u) number of upvalues */
    this.nparams = NaN; /* (u) number of parameters */
    this.isvararg = NaN; /* (u) */
    this.istailcall = NaN; /* (t) */
    this.short_src = null; /* (S) */
    /* private part */
    this.i_ci = null; /* active function */
};

/*
** Event codes
*/


var LUA_HOOKCALL = 0;
var LUA_HOOKRET = 1;
var LUA_HOOKLINE = 2;
var LUA_HOOKCOUNT = 3;
var LUA_HOOKTAILCALL = 4;

/*
** Event masks
*/
var LUA_MASKCALL = 1 << LUA_HOOKCALL;
var LUA_MASKRET = 1 << LUA_HOOKRET;
var LUA_MASKLINE = 1 << LUA_HOOKLINE;
var LUA_MASKCOUNT = 1 << LUA_HOOKCOUNT;

/*
** LUA_PATH_SEP is the character that separates templates in a path.
** LUA_PATH_MARK is the string that marks the substitution points in a
** template.
** LUA_EXEC_DIR in a Windows path is replaced by the executable's
** directory.
*/
var LUA_PATH_SEP = ";";
module.exports.LUA_PATH_SEP = LUA_PATH_SEP;

var LUA_PATH_MARK = "?";
module.exports.LUA_PATH_MARK = LUA_PATH_MARK;

var LUA_EXEC_DIR = "!";
module.exports.LUA_EXEC_DIR = LUA_EXEC_DIR;

/*
@@ LUA_PATH_DEFAULT is the default path that Lua uses to look for
** Lua libraries.
@@ LUA_JSPATH_DEFAULT is the default path that Lua uses to look for
** C libraries.
** CHANGE them if your machine has a non-conventional directory
** hierarchy or if you want to install your libraries in
** non-conventional directories.
*/
var LUA_VDIR = LUA_VERSION_MAJOR + "." + LUA_VERSION_MINOR;
module.exports.LUA_VDIR = LUA_VDIR;

if (true) {
    var LUA_DIRSEP = "/";
    module.exports.LUA_DIRSEP = LUA_DIRSEP;

    var LUA_LDIR = "./lua/" + LUA_VDIR + "/";
    module.exports.LUA_LDIR = LUA_LDIR;

    var LUA_JSDIR = "./lua/" + LUA_VDIR + "/";
    module.exports.LUA_JSDIR = LUA_JSDIR;

    var LUA_PATH_DEFAULT = to_luastring(LUA_LDIR + "?.lua;" + LUA_LDIR + "?/init.lua;" + LUA_JSDIR + "?.lua;" + LUA_JSDIR + "?/init.lua;" + "./?.lua;./?/init.lua");
    module.exports.LUA_PATH_DEFAULT = LUA_PATH_DEFAULT;

    var LUA_JSPATH_DEFAULT = to_luastring(LUA_JSDIR + "?.js;" + LUA_JSDIR + "loadall.js;./?.js");
    module.exports.LUA_JSPATH_DEFAULT = LUA_JSPATH_DEFAULT;
} else if (require('os').platform() === 'win32') {
    var _LUA_DIRSEP = "\\";
    module.exports.LUA_DIRSEP = _LUA_DIRSEP;

    /*
    ** In Windows, any exclamation mark ('!') in the path is replaced by the
    ** path of the directory of the executable file of the current process.
    */
    var _LUA_LDIR = "!\\lua\\";
    module.exports.LUA_LDIR = _LUA_LDIR;

    var _LUA_JSDIR = "!\\";
    module.exports.LUA_JSDIR = _LUA_JSDIR;

    var LUA_SHRDIR = "!\\..\\share\\lua\\" + LUA_VDIR + "\\";
    module.exports.LUA_SHRDIR = LUA_SHRDIR;

    var _LUA_PATH_DEFAULT = to_luastring(_LUA_LDIR + "?.lua;" + _LUA_LDIR + "?\\init.lua;" + _LUA_JSDIR + "?.lua;" + _LUA_JSDIR + "?\\init.lua;" + LUA_SHRDIR + "?.lua;" + LUA_SHRDIR + "?\\init.lua;" + ".\\?.lua;.\\?\\init.lua");
    module.exports.LUA_PATH_DEFAULT = _LUA_PATH_DEFAULT;

    var _LUA_JSPATH_DEFAULT = to_luastring(_LUA_JSDIR + "?.js;" + _LUA_JSDIR + "..\\share\\lua\\" + LUA_VDIR + "\\?.js;" + _LUA_JSDIR + "loadall.js;.\\?.js");
    module.exports.LUA_JSPATH_DEFAULT = _LUA_JSPATH_DEFAULT;
} else {
    var _LUA_DIRSEP2 = "/";
    module.exports.LUA_DIRSEP = _LUA_DIRSEP2;

    var LUA_ROOT = "/usr/local/";
    module.exports.LUA_ROOT = LUA_ROOT;
    var LUA_ROOT2 = "/usr/";

    var _LUA_LDIR2 = LUA_ROOT + "share/lua/" + LUA_VDIR + "/";
    var LUA_LDIR2 = LUA_ROOT2 + "share/lua/" + LUA_VDIR + "/";
    module.exports.LUA_LDIR = _LUA_LDIR2;

    var _LUA_JSDIR2 = LUA_ROOT + "share/lua/" + LUA_VDIR + "/";
    module.exports.LUA_JSDIR = _LUA_JSDIR2;
    var LUA_JSDIR2 = LUA_ROOT2 + "share/lua/" + LUA_VDIR + "/";

    var _LUA_PATH_DEFAULT2 = to_luastring(_LUA_LDIR2 + "?.lua;" + _LUA_LDIR2 + "?/init.lua;" + LUA_LDIR2 + "?.lua;" + LUA_LDIR2 + "?/init.lua;" + _LUA_JSDIR2 + "?.lua;" + _LUA_JSDIR2 + "?/init.lua;" + LUA_JSDIR2 + "?.lua;" + LUA_JSDIR2 + "?/init.lua;" + "./?.lua;./?/init.lua");
    module.exports.LUA_PATH_DEFAULT = _LUA_PATH_DEFAULT2;

    var _LUA_JSPATH_DEFAULT2 = to_luastring(_LUA_JSDIR2 + "?.js;" + _LUA_JSDIR2 + "loadall.js;" + LUA_JSDIR2 + "?.js;" + LUA_JSDIR2 + "loadall.js;" + "./?.js");
    module.exports.LUA_JSPATH_DEFAULT = _LUA_JSPATH_DEFAULT2;
}

module.exports.LUA_AUTHORS = LUA_AUTHORS;
module.exports.LUA_COPYRIGHT = LUA_COPYRIGHT;
module.exports.LUA_HOOKCALL = LUA_HOOKCALL;
module.exports.LUA_HOOKCOUNT = LUA_HOOKCOUNT;
module.exports.LUA_HOOKLINE = LUA_HOOKLINE;
module.exports.LUA_HOOKRET = LUA_HOOKRET;
module.exports.LUA_HOOKTAILCALL = LUA_HOOKTAILCALL;
module.exports.LUA_INITVARVERSION = LUA_INITVARVERSION;
module.exports.LUA_INIT_VAR = LUA_INIT_VAR;
module.exports.LUA_MASKCALL = LUA_MASKCALL;
module.exports.LUA_MASKCOUNT = LUA_MASKCOUNT;
module.exports.LUA_MASKLINE = LUA_MASKLINE;
module.exports.LUA_MASKRET = LUA_MASKRET;
module.exports.LUA_MINSTACK = LUA_MINSTACK;
module.exports.LUA_MULTRET = -1;
module.exports.LUA_OPADD = LUA_OPADD;
module.exports.LUA_OPBAND = LUA_OPBAND;
module.exports.LUA_OPBNOT = LUA_OPBNOT;
module.exports.LUA_OPBOR = LUA_OPBOR;
module.exports.LUA_OPBXOR = LUA_OPBXOR;
module.exports.LUA_OPDIV = LUA_OPDIV;
module.exports.LUA_OPEQ = LUA_OPEQ;
module.exports.LUA_OPIDIV = LUA_OPIDIV;
module.exports.LUA_OPLE = LUA_OPLE;
module.exports.LUA_OPLT = LUA_OPLT;
module.exports.LUA_OPMOD = LUA_OPMOD;
module.exports.LUA_OPMUL = LUA_OPMUL;
module.exports.LUA_OPPOW = LUA_OPPOW;
module.exports.LUA_OPSHL = LUA_OPSHL;
module.exports.LUA_OPSHR = LUA_OPSHR;
module.exports.LUA_OPSUB = LUA_OPSUB;
module.exports.LUA_OPUNM = LUA_OPUNM;
module.exports.LUA_REGISTRYINDEX = LUA_REGISTRYINDEX;
module.exports.LUA_RELEASE = LUA_RELEASE;
module.exports.LUA_RIDX_GLOBALS = LUA_RIDX_GLOBALS;
module.exports.LUA_RIDX_LAST = LUA_RIDX_LAST;
module.exports.LUA_RIDX_MAINTHREAD = LUA_RIDX_MAINTHREAD;
module.exports.LUA_SIGNATURE = LUA_SIGNATURE;
module.exports.LUA_VERSION = LUA_VERSION;
module.exports.LUA_VERSION_MAJOR = LUA_VERSION_MAJOR;
module.exports.LUA_VERSION_MINOR = LUA_VERSION_MINOR;
module.exports.LUA_VERSION_NUM = LUA_VERSION_NUM;
module.exports.LUA_VERSION_RELEASE = LUA_VERSION_RELEASE;
module.exports.LUA_VERSUFFIX = LUA_VERSUFFIX;
module.exports.constant_types = constant_types;
module.exports.lua_Debug = lua_Debug;
module.exports.lua_upvalueindex = lua_upvalueindex;
module.exports.thread_status = thread_status;
module.exports.is_luastring = is_luastring;
module.exports.luastring_eq = luastring_eq;
module.exports.luastring_from = luastring_from;
module.exports.luastring_indexOf = luastring_indexOf;
module.exports.luastring_of = luastring_of;
module.exports.to_jsstring = to_jsstring;
module.exports.to_luastring = to_luastring;
module.exports.to_uristring = to_uristring;
module.exports.from_userstring = from_userstring;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defs = __webpack_require__(0);
var lapi = __webpack_require__(17);
var ldebug = __webpack_require__(10);
var ldo = __webpack_require__(7);
var lstate = __webpack_require__(11);

module.exports.LUA_AUTHORS = defs.LUA_AUTHORS;
module.exports.LUA_COPYRIGHT = defs.LUA_COPYRIGHT;
module.exports.LUA_ERRERR = defs.thread_status.LUA_ERRERR;
module.exports.LUA_ERRGCMM = defs.thread_status.LUA_ERRGCMM;
module.exports.LUA_ERRMEM = defs.thread_status.LUA_ERRMEM;
module.exports.LUA_ERRRUN = defs.thread_status.LUA_ERRRUN;
module.exports.LUA_ERRSYNTAX = defs.thread_status.LUA_ERRSYNTAX;
module.exports.LUA_HOOKCALL = defs.LUA_HOOKCALL;
module.exports.LUA_HOOKCOUNT = defs.LUA_HOOKCOUNT;
module.exports.LUA_HOOKLINE = defs.LUA_HOOKLINE;
module.exports.LUA_HOOKRET = defs.LUA_HOOKRET;
module.exports.LUA_HOOKTAILCALL = defs.LUA_HOOKTAILCALL;
module.exports.LUA_INITVARVERSION = defs.LUA_INITVARVERSION;
module.exports.LUA_INIT_VAR = defs.LUA_INIT_VAR;
module.exports.LUA_MASKCALL = defs.LUA_MASKCALL;
module.exports.LUA_MASKCOUNT = defs.LUA_MASKCOUNT;
module.exports.LUA_MASKLINE = defs.LUA_MASKLINE;
module.exports.LUA_MASKRET = defs.LUA_MASKRET;
module.exports.LUA_MINSTACK = defs.LUA_MINSTACK;
module.exports.LUA_MULTRET = defs.LUA_MULTRET;
module.exports.LUA_NUMTAGS = defs.constant_types.LUA_NUMTAGS;
module.exports.LUA_OK = defs.thread_status.LUA_OK;
module.exports.LUA_OPADD = defs.LUA_OPADD;
module.exports.LUA_OPBAND = defs.LUA_OPBAND;
module.exports.LUA_OPBNOT = defs.LUA_OPBNOT;
module.exports.LUA_OPBOR = defs.LUA_OPBOR;
module.exports.LUA_OPBXOR = defs.LUA_OPBXOR;
module.exports.LUA_OPDIV = defs.LUA_OPDIV;
module.exports.LUA_OPEQ = defs.LUA_OPEQ;
module.exports.LUA_OPIDIV = defs.LUA_OPIDIV;
module.exports.LUA_OPLE = defs.LUA_OPLE;
module.exports.LUA_OPLT = defs.LUA_OPLT;
module.exports.LUA_OPMOD = defs.LUA_OPMOD;
module.exports.LUA_OPMUL = defs.LUA_OPMUL;
module.exports.LUA_OPPOW = defs.LUA_OPPOW;
module.exports.LUA_OPSHL = defs.LUA_OPSHL;
module.exports.LUA_OPSHR = defs.LUA_OPSHR;
module.exports.LUA_OPSUB = defs.LUA_OPSUB;
module.exports.LUA_OPUNM = defs.LUA_OPUNM;
module.exports.LUA_REGISTRYINDEX = defs.LUA_REGISTRYINDEX;
module.exports.LUA_RELEASE = defs.LUA_RELEASE;
module.exports.LUA_RIDX_GLOBALS = defs.LUA_RIDX_GLOBALS;
module.exports.LUA_RIDX_LAST = defs.LUA_RIDX_LAST;
module.exports.LUA_RIDX_MAINTHREAD = defs.LUA_RIDX_MAINTHREAD;
module.exports.LUA_SIGNATURE = defs.LUA_SIGNATURE;
module.exports.LUA_TNONE = defs.constant_types.LUA_TNONE;
module.exports.LUA_TNIL = defs.constant_types.LUA_TNIL;
module.exports.LUA_TBOOLEAN = defs.constant_types.LUA_TBOOLEAN;
module.exports.LUA_TLIGHTUSERDATA = defs.constant_types.LUA_TLIGHTUSERDATA;
module.exports.LUA_TNUMBER = defs.constant_types.LUA_TNUMBER;
module.exports.LUA_TSTRING = defs.constant_types.LUA_TSTRING;
module.exports.LUA_TTABLE = defs.constant_types.LUA_TTABLE;
module.exports.LUA_TFUNCTION = defs.constant_types.LUA_TFUNCTION;
module.exports.LUA_TUSERDATA = defs.constant_types.LUA_TUSERDATA;
module.exports.LUA_TTHREAD = defs.constant_types.LUA_TTHREAD;
module.exports.LUA_VERSION = defs.LUA_VERSION;
module.exports.LUA_VERSION_MAJOR = defs.LUA_VERSION_MAJOR;
module.exports.LUA_VERSION_MINOR = defs.LUA_VERSION_MINOR;
module.exports.LUA_VERSION_NUM = defs.LUA_VERSION_NUM;
module.exports.LUA_VERSION_RELEASE = defs.LUA_VERSION_RELEASE;
module.exports.LUA_VERSUFFIX = defs.LUA_VERSUFFIX;
module.exports.LUA_YIELD = defs.thread_status.LUA_YIELD;
module.exports.lua_Debug = defs.lua_Debug;
module.exports.lua_upvalueindex = defs.lua_upvalueindex;
module.exports.LUA_CDIR = defs.LUA_CDIR;
module.exports.LUA_EXEC_DIR = defs.LUA_EXEC_DIR;
module.exports.LUA_JSPATH_DEFAULT = defs.LUA_JSPATH_DEFAULT;
module.exports.LUA_LDIR = defs.LUA_LDIR;
module.exports.LUA_PATH_DEFAULT = defs.LUA_PATH_DEFAULT;
module.exports.LUA_PATH_MARK = defs.LUA_PATH_MARK;
module.exports.LUA_PATH_SEP = defs.LUA_PATH_SEP;
module.exports.LUA_ROOT = defs.LUA_ROOT;
module.exports.LUA_SHRDIR = defs.LUA_SHRDIR;
module.exports.LUA_VDIR = defs.LUA_VDIR;
module.exports.LUA_DIRSEP = defs.LUA_DIRSEP;
module.exports.lua_absindex = lapi.lua_absindex;
module.exports.lua_arith = lapi.lua_arith;
module.exports.lua_atpanic = lapi.lua_atpanic;
module.exports.lua_atnativeerror = lapi.lua_atnativeerror;
module.exports.lua_call = lapi.lua_call;
module.exports.lua_callk = lapi.lua_callk;
module.exports.lua_checkstack = lapi.lua_checkstack;
module.exports.lua_close = lstate.lua_close;
module.exports.lua_compare = lapi.lua_compare;
module.exports.lua_concat = lapi.lua_concat;
module.exports.lua_copy = lapi.lua_copy;
module.exports.lua_createtable = lapi.lua_createtable;
module.exports.lua_dump = lapi.lua_dump;
module.exports.lua_error = lapi.lua_error;
module.exports.lua_gc = lapi.lua_gc;
module.exports.lua_getallocf = lapi.lua_getallocf;
module.exports.lua_getextraspace = lapi.lua_getextraspace;
module.exports.lua_getfield = lapi.lua_getfield;
module.exports.lua_getglobal = lapi.lua_getglobal;
module.exports.lua_gethook = ldebug.lua_gethook;
module.exports.lua_gethookcount = ldebug.lua_gethookcount;
module.exports.lua_gethookmask = ldebug.lua_gethookmask;
module.exports.lua_geti = lapi.lua_geti;
module.exports.lua_getinfo = ldebug.lua_getinfo;
module.exports.lua_getlocal = ldebug.lua_getlocal;
module.exports.lua_getmetatable = lapi.lua_getmetatable;
module.exports.lua_getstack = ldebug.lua_getstack;
module.exports.lua_gettable = lapi.lua_gettable;
module.exports.lua_gettop = lapi.lua_gettop;
module.exports.lua_getupvalue = lapi.lua_getupvalue;
module.exports.lua_getuservalue = lapi.lua_getuservalue;
module.exports.lua_insert = lapi.lua_insert;
module.exports.lua_isboolean = lapi.lua_isboolean;
module.exports.lua_iscfunction = lapi.lua_iscfunction;
module.exports.lua_isfunction = lapi.lua_isfunction;
module.exports.lua_isinteger = lapi.lua_isinteger;
module.exports.lua_islightuserdata = lapi.lua_islightuserdata;
module.exports.lua_isnil = lapi.lua_isnil;
module.exports.lua_isnone = lapi.lua_isnone;
module.exports.lua_isnoneornil = lapi.lua_isnoneornil;
module.exports.lua_isnumber = lapi.lua_isnumber;
module.exports.lua_isproxy = lapi.lua_isproxy;
module.exports.lua_isstring = lapi.lua_isstring;
module.exports.lua_istable = lapi.lua_istable;
module.exports.lua_isthread = lapi.lua_isthread;
module.exports.lua_isuserdata = lapi.lua_isuserdata;
module.exports.lua_isyieldable = ldo.lua_isyieldable;
module.exports.lua_len = lapi.lua_len;
module.exports.lua_load = lapi.lua_load;
module.exports.lua_newstate = lstate.lua_newstate;
module.exports.lua_newtable = lapi.lua_newtable;
module.exports.lua_newthread = lstate.lua_newthread;
module.exports.lua_newuserdata = lapi.lua_newuserdata;
module.exports.lua_next = lapi.lua_next;
module.exports.lua_pcall = lapi.lua_pcall;
module.exports.lua_pcallk = lapi.lua_pcallk;
module.exports.lua_pop = lapi.lua_pop;
module.exports.lua_pushboolean = lapi.lua_pushboolean;
module.exports.lua_pushcclosure = lapi.lua_pushcclosure;
module.exports.lua_pushcfunction = lapi.lua_pushcfunction;
module.exports.lua_pushfstring = lapi.lua_pushfstring;
module.exports.lua_pushglobaltable = lapi.lua_pushglobaltable;
module.exports.lua_pushinteger = lapi.lua_pushinteger;
module.exports.lua_pushjsclosure = lapi.lua_pushjsclosure;
module.exports.lua_pushjsfunction = lapi.lua_pushjsfunction;
module.exports.lua_pushlightuserdata = lapi.lua_pushlightuserdata;
module.exports.lua_pushliteral = lapi.lua_pushliteral;
module.exports.lua_pushlstring = lapi.lua_pushlstring;
module.exports.lua_pushnil = lapi.lua_pushnil;
module.exports.lua_pushnumber = lapi.lua_pushnumber;
module.exports.lua_pushstring = lapi.lua_pushstring;
module.exports.lua_pushthread = lapi.lua_pushthread;
module.exports.lua_pushvalue = lapi.lua_pushvalue;
module.exports.lua_pushvfstring = lapi.lua_pushvfstring;
module.exports.lua_rawequal = lapi.lua_rawequal;
module.exports.lua_rawget = lapi.lua_rawget;
module.exports.lua_rawgeti = lapi.lua_rawgeti;
module.exports.lua_rawgetp = lapi.lua_rawgetp;
module.exports.lua_rawlen = lapi.lua_rawlen;
module.exports.lua_rawset = lapi.lua_rawset;
module.exports.lua_rawseti = lapi.lua_rawseti;
module.exports.lua_rawsetp = lapi.lua_rawsetp;
module.exports.lua_register = lapi.lua_register;
module.exports.lua_remove = lapi.lua_remove;
module.exports.lua_replace = lapi.lua_replace;
module.exports.lua_resume = ldo.lua_resume;
module.exports.lua_rotate = lapi.lua_rotate;
module.exports.lua_setallof = ldo.lua_setallof;
module.exports.lua_setfield = lapi.lua_setfield;
module.exports.lua_setglobal = lapi.lua_setglobal;
module.exports.lua_sethook = ldebug.lua_sethook;
module.exports.lua_seti = lapi.lua_seti;
module.exports.lua_setlocal = ldebug.lua_setlocal;
module.exports.lua_setmetatable = lapi.lua_setmetatable;
module.exports.lua_settable = lapi.lua_settable;
module.exports.lua_settop = lapi.lua_settop;
module.exports.lua_setupvalue = lapi.lua_setupvalue;
module.exports.lua_setuservalue = lapi.lua_setuservalue;
module.exports.lua_status = lapi.lua_status;
module.exports.lua_stringtonumber = lapi.lua_stringtonumber;
module.exports.lua_toboolean = lapi.lua_toboolean;
module.exports.lua_todataview = lapi.lua_todataview;
module.exports.lua_tointeger = lapi.lua_tointeger;
module.exports.lua_tointegerx = lapi.lua_tointegerx;
module.exports.lua_tojsstring = lapi.lua_tojsstring;
module.exports.lua_tolstring = lapi.lua_tolstring;
module.exports.lua_tonumber = lapi.lua_tonumber;
module.exports.lua_tonumberx = lapi.lua_tonumberx;
module.exports.lua_topointer = lapi.lua_topointer;
module.exports.lua_toproxy = lapi.lua_toproxy;
module.exports.lua_tostring = lapi.lua_tostring;
module.exports.lua_tothread = lapi.lua_tothread;
module.exports.lua_touserdata = lapi.lua_touserdata;
module.exports.lua_type = lapi.lua_type;
module.exports.lua_typename = lapi.lua_typename;
module.exports.lua_upvalueid = lapi.lua_upvalueid;
module.exports.lua_upvaluejoin = lapi.lua_upvaluejoin;
module.exports.lua_version = lapi.lua_version;
module.exports.lua_xmove = lapi.lua_xmove;
module.exports.lua_yield = ldo.lua_yield;
module.exports.lua_yieldk = ldo.lua_yieldk;
module.exports.lua_tocfunction = lapi.lua_tocfunction;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(4),
    luai_apicheck = _require.luai_apicheck;

var lua_assert = function lua_assert(c) {
    if (!c) throw Error("assertion failed");
};
module.exports.lua_assert = lua_assert;

module.exports.luai_apicheck = luai_apicheck || function (l, e) {
    return lua_assert(e);
};

var api_check = function api_check(l, e, msg) {
    return luai_apicheck(l, e && msg);
};
module.exports.api_check = api_check;

var LUAI_MAXCCALLS = 200;
module.exports.LUAI_MAXCCALLS = LUAI_MAXCCALLS;

/* minimum size for string buffer */
var LUA_MINBUFFER = 32;
module.exports.LUA_MINBUFFER = LUA_MINBUFFER;

var luai_nummod = function luai_nummod(L, a, b) {
    var m = a % b;
    if (m * b < 0) m += b;
    return m;
};
module.exports.luai_nummod = luai_nummod;

// If later integers are more than 32bit, LUA_MAXINTEGER will then be != MAX_INT
var MAX_INT = 2147483647;
module.exports.MAX_INT = MAX_INT;
var MIN_INT = -2147483648;
module.exports.MIN_INT = MIN_INT;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Fengari specific functions
 *
 * This file includes fengari-specific data or and functionality for users to
 * manipulate fengari's string type.
 * The fields are exposed to the user on the 'fengari' entry point; however to
 * avoid a dependency on defs.js from lauxlib.js they are defined in this file.
 */

var defs = __webpack_require__(0);

var FENGARI_VERSION_MAJOR = "0";
var FENGARI_VERSION_MINOR = "0";
var FENGARI_VERSION_NUM = 1;
var FENGARI_VERSION_RELEASE = "1";
var FENGARI_VERSION = "Fengari " + FENGARI_VERSION_MAJOR + "." + FENGARI_VERSION_MINOR;
var FENGARI_RELEASE = FENGARI_VERSION + "." + FENGARI_VERSION_RELEASE;
var FENGARI_AUTHORS = "B. Giannangeli, Daurnimator";
var FENGARI_COPYRIGHT = FENGARI_RELEASE + "  Copyright (C) 2017-2018 " + FENGARI_AUTHORS + "\nBased on: " + defs.LUA_COPYRIGHT;

module.exports.FENGARI_AUTHORS = FENGARI_AUTHORS;
module.exports.FENGARI_COPYRIGHT = FENGARI_COPYRIGHT;
module.exports.FENGARI_RELEASE = FENGARI_RELEASE;
module.exports.FENGARI_VERSION = FENGARI_VERSION;
module.exports.FENGARI_VERSION_MAJOR = FENGARI_VERSION_MAJOR;
module.exports.FENGARI_VERSION_MINOR = FENGARI_VERSION_MINOR;
module.exports.FENGARI_VERSION_NUM = FENGARI_VERSION_NUM;
module.exports.FENGARI_VERSION_RELEASE = FENGARI_VERSION_RELEASE;
module.exports.is_luastring = defs.is_luastring;
module.exports.luastring_eq = defs.luastring_eq;
module.exports.luastring_from = defs.luastring_from;
module.exports.luastring_indexOf = defs.luastring_indexOf;
module.exports.luastring_of = defs.luastring_of;
module.exports.to_jsstring = defs.to_jsstring;
module.exports.to_luastring = defs.to_luastring;
module.exports.to_uristring = defs.to_uristring;
module.exports.from_userstring = defs.from_userstring;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
@@ LUA_COMPAT_FLOATSTRING makes Lua format integral floats without a
@@ a float mark ('.0').
** This macro is not on by default even in compatibility mode,
** because this is not really an incompatibility.
*/

var LUA_COMPAT_FLOATSTRING = false;

var LUA_MAXINTEGER = 2147483647;
var LUA_MININTEGER = -2147483648;

/*
@@ LUAI_MAXSTACK limits the size of the Lua stack.
** CHANGE it if you need a different limit. This limit is arbitrary;
** its only purpose is to stop Lua from consuming unlimited stack
** space (and to reserve some numbers for pseudo-indices).
*/
/* TODO: put back to 1000000. Node would go out of memory in some cases (e.g. travis) */
var LUAI_MAXSTACK = 100000;

/*
@@ LUA_IDSIZE gives the maximum size for the description of the source
@@ of a function in debug information.
** CHANGE it if you want a different size.
*/
var LUA_IDSIZE = 60 - 1; /* fengari uses 1 less than lua as we don't embed the null byte */

var lua_integer2str = function lua_integer2str(n) {
    return String(n); /* should match behaviour of LUA_INTEGER_FMT */
};

var lua_number2str = function lua_number2str(n) {
    return String(Number(n.toPrecision(14))); /* should match behaviour of LUA_NUMBER_FMT */
};

var lua_numbertointeger = function lua_numbertointeger(n) {
    return n >= LUA_MININTEGER && n < -LUA_MININTEGER ? n : false;
};

var LUA_INTEGER_FRMLEN = "";
var LUA_NUMBER_FRMLEN = "";

var LUA_INTEGER_FMT = "%" + LUA_INTEGER_FRMLEN + "d";
var LUA_NUMBER_FMT = "%.14g";

var lua_getlocaledecpoint = function lua_getlocaledecpoint() {
    return 1.1.toLocaleString().charCodeAt(1);
};

var luai_apicheck = function luai_apicheck(l, e) {
    if (!e) throw Error(e);
};

/*
@@ LUAL_BUFFERSIZE is the buffer size used by the lauxlib buffer system.
*/
var LUAL_BUFFERSIZE = 8192;

// See: http://croquetweak.blogspot.fr/2014/08/deconstructing-floats-frexp-and-ldexp.html
var frexp = function frexp(value) {
    if (value === 0) return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = data.getUint32(0) >>> 20 & 0x7FF;
    if (bits === 0) {
        // denormal
        data.setFloat64(0, value * Math.pow(2, 64)); // exp + 64
        bits = (data.getUint32(0) >>> 20 & 0x7FF) - 64;
    }
    var exponent = bits - 1022;
    var mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
};

var ldexp = function ldexp(mantissa, exponent) {
    var steps = Math.min(3, Math.ceil(Math.abs(exponent) / 1023));
    var result = mantissa;
    for (var i = 0; i < steps; i++) {
        result *= Math.pow(2, Math.floor((exponent + i) / steps));
    }return result;
};

module.exports.LUAI_MAXSTACK = LUAI_MAXSTACK;
module.exports.LUA_COMPAT_FLOATSTRING = LUA_COMPAT_FLOATSTRING;
module.exports.LUA_IDSIZE = LUA_IDSIZE;
module.exports.LUA_INTEGER_FMT = LUA_INTEGER_FMT;
module.exports.LUA_INTEGER_FRMLEN = LUA_INTEGER_FRMLEN;
module.exports.LUA_MAXINTEGER = LUA_MAXINTEGER;
module.exports.LUA_MININTEGER = LUA_MININTEGER;
module.exports.LUA_NUMBER_FMT = LUA_NUMBER_FMT;
module.exports.LUA_NUMBER_FRMLEN = LUA_NUMBER_FRMLEN;
module.exports.LUAL_BUFFERSIZE = LUAL_BUFFERSIZE;
module.exports.frexp = frexp;
module.exports.ldexp = ldexp;
module.exports.lua_getlocaledecpoint = lua_getlocaledecpoint;
module.exports.lua_integer2str = lua_integer2str;
module.exports.lua_number2str = lua_number2str;
module.exports.lua_numbertointeger = lua_numbertointeger;
module.exports.luai_apicheck = luai_apicheck;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _modes;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_OPADD = _require.LUA_OPADD,
    LUA_OPBAND = _require.LUA_OPBAND,
    LUA_OPBNOT = _require.LUA_OPBNOT,
    LUA_OPBOR = _require.LUA_OPBOR,
    LUA_OPBXOR = _require.LUA_OPBXOR,
    LUA_OPDIV = _require.LUA_OPDIV,
    LUA_OPIDIV = _require.LUA_OPIDIV,
    LUA_OPMOD = _require.LUA_OPMOD,
    LUA_OPMUL = _require.LUA_OPMUL,
    LUA_OPPOW = _require.LUA_OPPOW,
    LUA_OPSHL = _require.LUA_OPSHL,
    LUA_OPSHR = _require.LUA_OPSHR,
    LUA_OPSUB = _require.LUA_OPSUB,
    LUA_OPUNM = _require.LUA_OPUNM,
    _require$constant_typ = _require.constant_types,
    LUA_NUMTAGS = _require$constant_typ.LUA_NUMTAGS,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TCCL = _require$constant_typ.LUA_TCCL,
    LUA_TFUNCTION = _require$constant_typ.LUA_TFUNCTION,
    LUA_TLCF = _require$constant_typ.LUA_TLCF,
    LUA_TLCL = _require$constant_typ.LUA_TLCL,
    LUA_TLIGHTUSERDATA = _require$constant_typ.LUA_TLIGHTUSERDATA,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMBER = _require$constant_typ.LUA_TNUMBER,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    LUA_TSTRING = _require$constant_typ.LUA_TSTRING,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TTHREAD = _require$constant_typ.LUA_TTHREAD,
    LUA_TUSERDATA = _require$constant_typ.LUA_TUSERDATA,
    from_userstring = _require.from_userstring,
    luastring_indexOf = _require.luastring_indexOf,
    luastring_of = _require.luastring_of,
    to_jsstring = _require.to_jsstring,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(21),
    lisdigit = _require2.lisdigit,
    lisprint = _require2.lisprint,
    lisspace = _require2.lisspace,
    lisxdigit = _require2.lisxdigit;

var ldebug = __webpack_require__(10);
var ldo = __webpack_require__(7);
var lstate = __webpack_require__(11);

var _require3 = __webpack_require__(9),
    luaS_bless = _require3.luaS_bless,
    luaS_new = _require3.luaS_new;

var ltable = __webpack_require__(8);

var _require4 = __webpack_require__(4),
    LUA_COMPAT_FLOATSTRING = _require4.LUA_COMPAT_FLOATSTRING,
    ldexp = _require4.ldexp,
    lua_getlocaledecpoint = _require4.lua_getlocaledecpoint,
    lua_integer2str = _require4.lua_integer2str,
    lua_number2str = _require4.lua_number2str;

var lvm = __webpack_require__(14);

var _require5 = __webpack_require__(2),
    MAX_INT = _require5.MAX_INT,
    luai_nummod = _require5.luai_nummod,
    lua_assert = _require5.lua_assert;

var ltm = __webpack_require__(13);

var LUA_TPROTO = LUA_NUMTAGS;
var LUA_TDEADKEY = LUA_NUMTAGS + 1;

var TValue = function () {
    function TValue(type, value) {
        _classCallCheck(this, TValue);

        this.type = type;
        this.value = value;
    }

    /* type tag of a TValue (bits 0-3 for tags + variant bits 4-5) */


    _createClass(TValue, [{
        key: 'ttype',
        value: function ttype() {
            return this.type & 0x3F;
        }

        /* type tag of a TValue with no variants (bits 0-3) */

    }, {
        key: 'ttnov',
        value: function ttnov() {
            return this.type & 0x0F;
        }
    }, {
        key: 'checktag',
        value: function checktag(t) {
            return this.type === t;
        }
    }, {
        key: 'checktype',
        value: function checktype(t) {
            return this.ttnov() === t;
        }
    }, {
        key: 'ttisnumber',
        value: function ttisnumber() {
            return this.checktype(LUA_TNUMBER);
        }
    }, {
        key: 'ttisfloat',
        value: function ttisfloat() {
            return this.checktag(LUA_TNUMFLT);
        }
    }, {
        key: 'ttisinteger',
        value: function ttisinteger() {
            return this.checktag(LUA_TNUMINT);
        }
    }, {
        key: 'ttisnil',
        value: function ttisnil() {
            return this.checktag(LUA_TNIL);
        }
    }, {
        key: 'ttisboolean',
        value: function ttisboolean() {
            return this.checktag(LUA_TBOOLEAN);
        }
    }, {
        key: 'ttislightuserdata',
        value: function ttislightuserdata() {
            return this.checktag(LUA_TLIGHTUSERDATA);
        }
    }, {
        key: 'ttisstring',
        value: function ttisstring() {
            return this.checktype(LUA_TSTRING);
        }
    }, {
        key: 'ttisshrstring',
        value: function ttisshrstring() {
            return this.checktag(LUA_TSHRSTR);
        }
    }, {
        key: 'ttislngstring',
        value: function ttislngstring() {
            return this.checktag(LUA_TLNGSTR);
        }
    }, {
        key: 'ttistable',
        value: function ttistable() {
            return this.checktag(LUA_TTABLE);
        }
    }, {
        key: 'ttisfunction',
        value: function ttisfunction() {
            return this.checktype(LUA_TFUNCTION);
        }
    }, {
        key: 'ttisclosure',
        value: function ttisclosure() {
            return (this.type & 0x1F) === LUA_TFUNCTION;
        }
    }, {
        key: 'ttisCclosure',
        value: function ttisCclosure() {
            return this.checktag(LUA_TCCL);
        }
    }, {
        key: 'ttisLclosure',
        value: function ttisLclosure() {
            return this.checktag(LUA_TLCL);
        }
    }, {
        key: 'ttislcf',
        value: function ttislcf() {
            return this.checktag(LUA_TLCF);
        }
    }, {
        key: 'ttisfulluserdata',
        value: function ttisfulluserdata() {
            return this.checktag(LUA_TUSERDATA);
        }
    }, {
        key: 'ttisthread',
        value: function ttisthread() {
            return this.checktag(LUA_TTHREAD);
        }
    }, {
        key: 'ttisdeadkey',
        value: function ttisdeadkey() {
            return this.checktag(LUA_TDEADKEY);
        }
    }, {
        key: 'l_isfalse',
        value: function l_isfalse() {
            return this.ttisnil() || this.ttisboolean() && this.value === false;
        }
    }, {
        key: 'setfltvalue',
        value: function setfltvalue(x) {
            this.type = LUA_TNUMFLT;
            this.value = x;
        }
    }, {
        key: 'chgfltvalue',
        value: function chgfltvalue(x) {
            lua_assert(this.type == LUA_TNUMFLT);
            this.value = x;
        }
    }, {
        key: 'setivalue',
        value: function setivalue(x) {
            this.type = LUA_TNUMINT;
            this.value = x;
        }
    }, {
        key: 'chgivalue',
        value: function chgivalue(x) {
            lua_assert(this.type == LUA_TNUMINT);
            this.value = x;
        }
    }, {
        key: 'setnilvalue',
        value: function setnilvalue() {
            this.type = LUA_TNIL;
            this.value = null;
        }
    }, {
        key: 'setfvalue',
        value: function setfvalue(x) {
            this.type = LUA_TLCF;
            this.value = x;
        }
    }, {
        key: 'setpvalue',
        value: function setpvalue(x) {
            this.type = LUA_TLIGHTUSERDATA;
            this.value = x;
        }
    }, {
        key: 'setbvalue',
        value: function setbvalue(x) {
            this.type = LUA_TBOOLEAN;
            this.value = x;
        }
    }, {
        key: 'setsvalue',
        value: function setsvalue(x) {
            this.type = LUA_TLNGSTR; /* LUA_TSHRSTR? */
            this.value = x;
        }
    }, {
        key: 'setuvalue',
        value: function setuvalue(x) {
            this.type = LUA_TUSERDATA;
            this.value = x;
        }
    }, {
        key: 'setthvalue',
        value: function setthvalue(x) {
            this.type = LUA_TTHREAD;
            this.value = x;
        }
    }, {
        key: 'setclLvalue',
        value: function setclLvalue(x) {
            this.type = LUA_TLCL;
            this.value = x;
        }
    }, {
        key: 'setclCvalue',
        value: function setclCvalue(x) {
            this.type = LUA_TCCL;
            this.value = x;
        }
    }, {
        key: 'sethvalue',
        value: function sethvalue(x) {
            this.type = LUA_TTABLE;
            this.value = x;
        }
    }, {
        key: 'setdeadvalue',
        value: function setdeadvalue() {
            this.type = LUA_TDEADKEY;
            this.value = null;
        }
    }, {
        key: 'setfrom',
        value: function setfrom(tv) {
            /* in lua C source setobj2t is often used for this */
            this.type = tv.type;
            this.value = tv.value;
        }
    }, {
        key: 'tsvalue',
        value: function tsvalue() {
            lua_assert(this.ttisstring());
            return this.value;
        }
    }, {
        key: 'svalue',
        value: function svalue() {
            return this.tsvalue().getstr();
        }
    }, {
        key: 'vslen',
        value: function vslen() {
            return this.tsvalue().tsslen();
        }
    }, {
        key: 'jsstring',
        value: function jsstring(from, to) {
            return to_jsstring(this.svalue(), from, to, true);
        }
    }]);

    return TValue;
}();

var pushobj2s = function pushobj2s(L, tv) {
    L.stack[L.top++] = new TValue(tv.type, tv.value);
};
var pushsvalue2s = function pushsvalue2s(L, ts) {
    L.stack[L.top++] = new TValue(LUA_TLNGSTR, ts);
};
/* from stack to (same) stack */
var setobjs2s = function setobjs2s(L, newidx, oldidx) {
    L.stack[newidx].setfrom(L.stack[oldidx]);
};
/* to stack (not from same stack) */
var setobj2s = function setobj2s(L, newidx, oldtv) {
    L.stack[newidx].setfrom(oldtv);
};
var setsvalue2s = function setsvalue2s(L, newidx, ts) {
    L.stack[newidx].setsvalue(ts);
};

var luaO_nilobject = new TValue(LUA_TNIL, null);
Object.freeze(luaO_nilobject);
module.exports.luaO_nilobject = luaO_nilobject;

var LClosure = function LClosure(L, n) {
    _classCallCheck(this, LClosure);

    this.id = L.l_G.id_counter++;

    this.p = null;
    this.nupvalues = n;
    this.upvals = new Array(n); /* list of upvalues. initialised in luaF_initupvals */
};

var CClosure = function CClosure(L, f, n) {
    _classCallCheck(this, CClosure);

    this.id = L.l_G.id_counter++;

    this.f = f;
    this.nupvalues = n;
    this.upvalue = new Array(n); /* list of upvalues as TValues */
    while (n--) {
        this.upvalue[n] = new TValue(LUA_TNIL, null);
    }
};

var Udata = function Udata(L, size) {
    _classCallCheck(this, Udata);

    this.id = L.l_G.id_counter++;

    this.metatable = null;
    this.uservalue = new TValue(LUA_TNIL, null);
    this.len = size;
    this.data = Object.create(null); // ignores size argument
};

/*
** Description of a local variable for function prototypes
** (used for debug information)
*/


var LocVar = function LocVar() {
    _classCallCheck(this, LocVar);

    this.varname = null;
    this.startpc = NaN; /* first point where variable is active */
    this.endpc = NaN; /* first point where variable is dead */
};

var RETS = to_luastring("...");
var PRE = to_luastring("[string \"");
var POS = to_luastring("\"]");

var luaO_chunkid = function luaO_chunkid(source, bufflen) {
    var l = source.length;
    var out = void 0;
    if (source[0] === 61 /* ('=').charCodeAt(0) */) {
            /* 'literal' source */
            if (l < bufflen) {
                /* small enough? */
                out = new Uint8Array(l - 1);
                out.set(source.subarray(1));
            } else {
                /* truncate it */
                out = new Uint8Array(bufflen);
                out.set(source.subarray(1, bufflen + 1));
            }
        } else if (source[0] === 64 /* ('@').charCodeAt(0) */) {
            /* file name */
            if (l <= bufflen) {
                /* small enough? */
                out = new Uint8Array(l - 1);
                out.set(source.subarray(1));
            } else {
                /* add '...' before rest of name */
                out = new Uint8Array(bufflen);
                out.set(RETS);
                bufflen -= RETS.length;
                out.set(source.subarray(l - bufflen), RETS.length);
            }
        } else {
        /* string; format as [string "source"] */
        out = new Uint8Array(bufflen);
        var nli = luastring_indexOf(source, 10 /* ('\n').charCodeAt(0) */); /* find first new line (if any) */
        out.set(PRE); /* add prefix */
        var out_i = PRE.length;
        bufflen -= PRE.length + RETS.length + POS.length; /* save space for prefix+suffix */
        if (l < bufflen && nli === -1) {
            /* small one-line source? */
            out.set(source, out_i); /* keep it */
            out_i += source.length;
        } else {
            if (nli !== -1) l = nli; /* stop at first newline */
            if (l > bufflen) l = bufflen;
            out.set(source.subarray(0, l), out_i);
            out_i += l;
            out.set(RETS, out_i);
            out_i += RETS.length;
        }
        out.set(POS, out_i);
        out_i += POS.length;
        out = out.subarray(0, out_i);
    }
    return out;
};

var luaO_hexavalue = function luaO_hexavalue(c) {
    if (lisdigit(c)) return c - 48;else return (c & 0xdf) - 55;
};

var UTF8BUFFSZ = 8;

var luaO_utf8esc = function luaO_utf8esc(buff, x) {
    var n = 1; /* number of bytes put in buffer (backwards) */
    lua_assert(x <= 0x10FFFF);
    if (x < 0x80) /* ascii? */
        buff[UTF8BUFFSZ - 1] = x;else {
        /* need continuation bytes */
        var mfb = 0x3f; /* maximum that fits in first byte */
        do {
            buff[UTF8BUFFSZ - n++] = 0x80 | x & 0x3f;
            x >>= 6; /* remove added bits */
            mfb >>= 1; /* now there is one less bit available in first byte */
        } while (x > mfb); /* still needs continuation byte? */
        buff[UTF8BUFFSZ - n] = ~mfb << 1 | x; /* add first byte */
    }
    return n;
};

/* maximum number of significant digits to read (to avoid overflows
   even with single floats) */
var MAXSIGDIG = 30;

/*
** convert an hexadecimal numeric string to a number, following
** C99 specification for 'strtod'
*/
var lua_strx2number = function lua_strx2number(s) {
    var i = 0;
    var dot = lua_getlocaledecpoint();
    var r = 0.0; /* result (accumulator) */
    var sigdig = 0; /* number of significant digits */
    var nosigdig = 0; /* number of non-significant digits */
    var e = 0; /* exponent correction */
    var neg = void 0; /* 1 if number is negative */
    var hasdot = false; /* true after seen a dot */
    while (lisspace(s[i])) {
        i++;
    } /* skip initial spaces */
    if (neg = s[i] === 45 /* ('-').charCodeAt(0) */) i++; /* check signal */
    else if (s[i] === 43 /* ('+').charCodeAt(0) */) i++;
    if (!(s[i] === 48 /* ('0').charCodeAt(0) */ && (s[i + 1] === 120 /* ('x').charCodeAt(0) */ || s[i + 1] === 88 /* ('X').charCodeAt(0) */))) /* check '0x' */
        return null; /* invalid format (no '0x') */
    for (i += 2;; i++) {
        /* skip '0x' and read numeral */
        if (s[i] === dot) {
            if (hasdot) break; /* second dot? stop loop */
            else hasdot = true;
        } else if (lisxdigit(s[i])) {
            if (sigdig === 0 && s[i] === 48 /* ('0').charCodeAt(0) */) /* non-significant digit (zero)? */
                nosigdig++;else if (++sigdig <= MAXSIGDIG) /* can read it without overflow? */
                r = r * 16 + luaO_hexavalue(s[i]);else e++; /* too many digits; ignore, but still count for exponent */
            if (hasdot) e--; /* decimal digit? correct exponent */
        } else break; /* neither a dot nor a digit */
    }

    if (nosigdig + sigdig === 0) /* no digits? */
        return null; /* invalid format */
    e *= 4; /* each digit multiplies/divides value by 2^4 */
    if (s[i] === 112 /* ('p').charCodeAt(0) */ || s[i] === 80 /* ('P').charCodeAt(0) */) {
            /* exponent part? */
            var exp1 = 0; /* exponent value */
            var neg1 = void 0; /* exponent signal */
            i++; /* skip 'p' */
            if (neg1 = s[i] === 45 /* ('-').charCodeAt(0) */) i++; /* signal */
            else if (s[i] === 43 /* ('+').charCodeAt(0) */) i++;
            if (!lisdigit(s[i])) return null; /* invalid; must have at least one digit */
            while (lisdigit(s[i])) {
                /* read exponent */
                exp1 = exp1 * 10 + s[i++] - 48 /* ('0').charCodeAt(0) */;
            }if (neg1) exp1 = -exp1;
            e += exp1;
        }
    if (neg) r = -r;
    return {
        n: ldexp(r, e),
        i: i
    };
};

var lua_str2number = function lua_str2number(s) {
    try {
        s = to_jsstring(s);
    } catch (e) {
        return null;
    }
    /* use a regex to validate number and also to get length
       parseFloat ignores trailing junk */
    var r = /^[\t\v\f \n\r]*[+-]?(?:[0-9]+\.?[0-9]*|\.[0-9]*)(?:[eE][+-]?[0-9]+)?/.exec(s);
    if (!r) return null;
    var flt = parseFloat(r[0]);
    return !isNaN(flt) ? { n: flt, i: r[0].length } : null;
};

var l_str2dloc = function l_str2dloc(s, mode) {
    var result = mode === 'x' ? lua_strx2number(s) : lua_str2number(s); /* try to convert */
    if (result === null) return null;
    while (lisspace(s[result.i])) {
        result.i++;
    } /* skip trailing spaces */
    return result.i === s.length || s[result.i] === 0 ? result : null; /* OK if no trailing characters */
};

var SIGILS = [46 /* (".").charCodeAt(0) */
, 120 /* ("x").charCodeAt(0) */
, 88 /* ("X").charCodeAt(0) */
, 110 /* ("n").charCodeAt(0) */
, 78 /* ("N").charCodeAt(0) */
];
var modes = (_modes = {}, _defineProperty(_modes, 46, "."), _defineProperty(_modes, 120, "x"), _defineProperty(_modes, 88, "x"), _defineProperty(_modes, 110, "n"), _defineProperty(_modes, 78, "n"), _modes);
var l_str2d = function l_str2d(s) {
    var l = s.length;
    var pmode = 0;
    for (var i = 0; i < l; i++) {
        var v = s[i];
        if (SIGILS.indexOf(v) !== -1) {
            pmode = v;
            break;
        }
    }
    var mode = modes[pmode];
    if (mode === 'n') /* reject 'inf' and 'nan' */
        return null;
    var end = l_str2dloc(s, mode); /* try to convert */
    // if (end === null) {   /* failed? may be a different locale */
    //     throw new Error("Locale not available to handle number"); // TODO
    // }
    return end;
};

var MAXBY10 = Math.floor(MAX_INT / 10);
var MAXLASTD = MAX_INT % 10;

var l_str2int = function l_str2int(s) {
    var i = 0;
    var a = 0;
    var empty = true;
    var neg = void 0;

    while (lisspace(s[i])) {
        i++;
    } /* skip initial spaces */
    if (neg = s[i] === 45 /* ('-').charCodeAt(0) */) i++;else if (s[i] === 43 /* ('+').charCodeAt(0) */) i++;
    if (s[i] === 48 /* ('0').charCodeAt(0) */ && (s[i + 1] === 120 /* ('x').charCodeAt(0) */ || s[i + 1] === 88 /* ('X').charCodeAt(0) */)) {
        /* hex? */
        i += 2; /* skip '0x' */
        for (; i < s.length && lisxdigit(s[i]); i++) {
            a = a * 16 + luaO_hexavalue(s[i]) | 0;
            empty = false;
        }
    } else {
        /* decimal */
        for (; i < s.length && lisdigit(s[i]); i++) {
            var d = s[i] - 48 /* ('0').charCodeAt(0) */;
            if (a >= MAXBY10 && (a > MAXBY10 || d > MAXLASTD + neg)) /* overflow? */
                return null; /* do not accept it (as integer) */
            a = a * 10 + d | 0;
            empty = false;
        }
    }
    while (i < s.length && lisspace(s[i])) {
        i++;
    } /* skip trailing spaces */
    if (empty || i !== s.length && s[i] !== 0) return null; /* something wrong in the numeral */
    else {
            return {
                n: (neg ? -a : a) | 0,
                i: i
            };
        }
};

var luaO_str2num = function luaO_str2num(s, o) {
    var s2i = l_str2int(s);
    if (s2i !== null) {
        /* try as an integer */
        o.setivalue(s2i.n);
        return s2i.i + 1;
    } else {
        /* else try as a float */
        s2i = l_str2d(s);
        if (s2i !== null) {
            o.setfltvalue(s2i.n);
            return s2i.i + 1;
        } else return 0; /* conversion failed */
    }
};

var luaO_tostring = function luaO_tostring(L, obj) {
    var buff = void 0;
    if (obj.ttisinteger()) buff = to_luastring(lua_integer2str(obj.value));else {
        var str = lua_number2str(obj.value);
        if (!LUA_COMPAT_FLOATSTRING && /^[-0123456789]+$/.test(str)) {
            /* looks like an int? */
            str += String.fromCharCode(lua_getlocaledecpoint()) + '0'; /* adds '.0' to result */
        }
        buff = to_luastring(str);
    }
    obj.setsvalue(luaS_bless(L, buff));
};

var pushstr = function pushstr(L, str) {
    ldo.luaD_inctop(L);
    setsvalue2s(L, L.top - 1, luaS_new(L, str));
};

var luaO_pushvfstring = function luaO_pushvfstring(L, fmt, argp) {
    var n = 0;
    var i = 0;
    var a = 0;
    var e = void 0;
    for (;;) {
        e = luastring_indexOf(fmt, 37 /* ('%').charCodeAt(0) */, i);
        if (e == -1) break;
        pushstr(L, fmt.subarray(i, e));
        switch (fmt[e + 1]) {
            case 115 /* ('s').charCodeAt(0) */:
                {
                    var s = argp[a++];
                    if (s === null) s = to_luastring("(null)", true);else {
                        s = from_userstring(s);
                        /* respect null terminator */
                        var _i = luastring_indexOf(s, 0);
                        if (_i !== -1) s = s.subarray(0, _i);
                    }
                    pushstr(L, s);
                    break;
                }
            case 99 /* ('c').charCodeAt(0) */:
                {
                    var buff = argp[a++];
                    if (lisprint(buff)) pushstr(L, luastring_of(buff));else luaO_pushfstring(L, to_luastring("<\\%d>", true), buff);
                    break;
                }
            case 100 /* ('d').charCodeAt(0) */:
            case 73 /* ('I').charCodeAt(0) */:
                ldo.luaD_inctop(L);
                L.stack[L.top - 1].setivalue(argp[a++]);
                luaO_tostring(L, L.stack[L.top - 1]);
                break;
            case 102 /* ('f').charCodeAt(0) */:
                ldo.luaD_inctop(L);
                L.stack[L.top - 1].setfltvalue(argp[a++]);
                luaO_tostring(L, L.stack[L.top - 1]);
                break;
            case 112 /* ('p').charCodeAt(0) */:
                {
                    var v = argp[a++];
                    if (v instanceof lstate.lua_State || v instanceof ltable.Table || v instanceof Udata || v instanceof LClosure || v instanceof CClosure) {
                        pushstr(L, to_luastring("0x" + v.id.toString(16)));
                    } else {
                        switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
                            case "undefined":
                                pushstr(L, to_luastring("undefined"));
                                break;
                            case "number":
                                /* before check object as null is an object */
                                pushstr(L, to_luastring("Number(" + v + ")"));
                                break;
                            case "string":
                                /* before check object as null is an object */
                                pushstr(L, to_luastring("String(" + JSON.stringify(v) + ")"));
                                break;
                            case "boolean":
                                /* before check object as null is an object */
                                pushstr(L, to_luastring(v ? "Boolean(true)" : "Boolean(false)"));
                                break;
                            case "object":
                                if (v === null) {
                                    /* null is special */
                                    pushstr(L, to_luastring("null"));
                                    break;
                                }
                            /* fall through */
                            case "function":
                                {
                                    var id = L.l_G.ids.get(v);
                                    if (!id) {
                                        id = L.l_G.id_counter++;
                                        L.l_G.ids.set(v, id);
                                    }
                                    pushstr(L, to_luastring("0x" + id.toString(16)));
                                    break;
                                }
                            default:
                                /* user provided object. no id available */
                                pushstr(L, to_luastring("<id NYI>"));
                        }
                    }
                    break;
                }
            case 85 /* ('U').charCodeAt(0) */:
                {
                    var _buff = new Uint8Array(UTF8BUFFSZ);
                    var l = luaO_utf8esc(_buff, argp[a++]);
                    pushstr(L, _buff.subarray(UTF8BUFFSZ - l));
                    break;
                }
            case 37 /* ('%').charCodeAt(0) */:
                pushstr(L, to_luastring("%", true));
                break;
            default:
                ldebug.luaG_runerror(L, to_luastring("invalid option '%%%c' to 'lua_pushfstring'"), fmt[e + 1]);
        }
        n += 2;
        i = e + 2;
    }
    ldo.luaD_checkstack(L, 1);
    pushstr(L, fmt.subarray(i));
    if (n > 0) lvm.luaV_concat(L, n + 1);
    return L.stack[L.top - 1].svalue();
};

var luaO_pushfstring = function luaO_pushfstring(L, fmt) {
    for (var _len = arguments.length, argp = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        argp[_key - 2] = arguments[_key];
    }

    return luaO_pushvfstring(L, fmt, argp);
};

/*
** converts an integer to a "floating point byte", represented as
** (eeeeexxx), where the real value is (1xxx) * 2^(eeeee - 1) if
** eeeee !== 0 and (xxx) otherwise.
*/
var luaO_int2fb = function luaO_int2fb(x) {
    var e = 0; /* exponent */
    if (x < 8) return x;
    while (x >= 8 << 4) {
        /* coarse steps */
        x = x + 0xf >> 4; /* x = ceil(x / 16) */
        e += 4;
    }
    while (x >= 8 << 1) {
        /* fine steps */
        x = x + 1 >> 1; /* x = ceil(x / 2) */
        e++;
    }
    return e + 1 << 3 | x - 8;
};

var intarith = function intarith(L, op, v1, v2) {
    switch (op) {
        case LUA_OPADD:
            return v1 + v2 | 0;
        case LUA_OPSUB:
            return v1 - v2 | 0;
        case LUA_OPMUL:
            return lvm.luaV_imul(v1, v2);
        case LUA_OPMOD:
            return lvm.luaV_mod(L, v1, v2);
        case LUA_OPIDIV:
            return lvm.luaV_div(L, v1, v2);
        case LUA_OPBAND:
            return v1 & v2;
        case LUA_OPBOR:
            return v1 | v2;
        case LUA_OPBXOR:
            return v1 ^ v2;
        case LUA_OPSHL:
            return lvm.luaV_shiftl(v1, v2);
        case LUA_OPSHR:
            return lvm.luaV_shiftl(v1, -v2);
        case LUA_OPUNM:
            return 0 - v1 | 0;
        case LUA_OPBNOT:
            return ~0 ^ v1;
        default:
            lua_assert(0);
    }
};

var numarith = function numarith(L, op, v1, v2) {
    switch (op) {
        case LUA_OPADD:
            return v1 + v2;
        case LUA_OPSUB:
            return v1 - v2;
        case LUA_OPMUL:
            return v1 * v2;
        case LUA_OPDIV:
            return v1 / v2;
        case LUA_OPPOW:
            return Math.pow(v1, v2);
        case LUA_OPIDIV:
            return Math.floor(v1 / v2);
        case LUA_OPUNM:
            return -v1;
        case LUA_OPMOD:
            return luai_nummod(L, v1, v2);
        default:
            lua_assert(0);
    }
};

var luaO_arith = function luaO_arith(L, op, p1, p2, p3) {
    var res = typeof p3 === "number" ? L.stack[p3] : p3; /* FIXME */

    switch (op) {
        case LUA_OPBAND:case LUA_OPBOR:case LUA_OPBXOR:
        case LUA_OPSHL:case LUA_OPSHR:
        case LUA_OPBNOT:
            {
                /* operate only on integers */
                var i1 = void 0,
                    i2 = void 0;
                if ((i1 = lvm.tointeger(p1)) !== false && (i2 = lvm.tointeger(p2)) !== false) {
                    res.setivalue(intarith(L, op, i1, i2));
                    return;
                } else break; /* go to the end */
            }
        case LUA_OPDIV:case LUA_OPPOW:
            {
                /* operate only on floats */
                var n1 = void 0,
                    n2 = void 0;
                if ((n1 = lvm.tonumber(p1)) !== false && (n2 = lvm.tonumber(p2)) !== false) {
                    res.setfltvalue(numarith(L, op, n1, n2));
                    return;
                } else break; /* go to the end */
            }
        default:
            {
                /* other operations */
                var _n = void 0,
                    _n2 = void 0;
                if (p1.ttisinteger() && p2.ttisinteger()) {
                    res.setivalue(intarith(L, op, p1.value, p2.value));
                    return;
                } else if ((_n = lvm.tonumber(p1)) !== false && (_n2 = lvm.tonumber(p2)) !== false) {
                    res.setfltvalue(numarith(L, op, _n, _n2));
                    return;
                } else break; /* go to the end */
            }
    }
    /* could not perform raw operation; try metamethod */
    lua_assert(L !== null); /* should not fail when folding (compile time) */
    ltm.luaT_trybinTM(L, p1, p2, p3, op - LUA_OPADD + ltm.TMS.TM_ADD);
};

module.exports.CClosure = CClosure;
module.exports.LClosure = LClosure;
module.exports.LUA_TDEADKEY = LUA_TDEADKEY;
module.exports.LUA_TPROTO = LUA_TPROTO;
module.exports.LocVar = LocVar;
module.exports.TValue = TValue;
module.exports.Udata = Udata;
module.exports.UTF8BUFFSZ = UTF8BUFFSZ;
module.exports.luaO_arith = luaO_arith;
module.exports.luaO_chunkid = luaO_chunkid;
module.exports.luaO_hexavalue = luaO_hexavalue;
module.exports.luaO_int2fb = luaO_int2fb;
module.exports.luaO_pushfstring = luaO_pushfstring;
module.exports.luaO_pushvfstring = luaO_pushvfstring;
module.exports.luaO_str2num = luaO_str2num;
module.exports.luaO_tostring = luaO_tostring;
module.exports.luaO_utf8esc = luaO_utf8esc;
module.exports.numarith = numarith;
module.exports.pushobj2s = pushobj2s;
module.exports.pushsvalue2s = pushsvalue2s;
module.exports.setobjs2s = setobjs2s;
module.exports.setobj2s = setobj2s;
module.exports.setsvalue2s = setsvalue2s;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(4),
    LUAL_BUFFERSIZE = _require.LUAL_BUFFERSIZE;

var _require2 = __webpack_require__(1),
    LUA_ERRERR = _require2.LUA_ERRERR,
    LUA_MULTRET = _require2.LUA_MULTRET,
    LUA_REGISTRYINDEX = _require2.LUA_REGISTRYINDEX,
    LUA_SIGNATURE = _require2.LUA_SIGNATURE,
    LUA_TBOOLEAN = _require2.LUA_TBOOLEAN,
    LUA_TLIGHTUSERDATA = _require2.LUA_TLIGHTUSERDATA,
    LUA_TNIL = _require2.LUA_TNIL,
    LUA_TNONE = _require2.LUA_TNONE,
    LUA_TNUMBER = _require2.LUA_TNUMBER,
    LUA_TSTRING = _require2.LUA_TSTRING,
    LUA_TTABLE = _require2.LUA_TTABLE,
    LUA_VERSION_NUM = _require2.LUA_VERSION_NUM,
    lua_Debug = _require2.lua_Debug,
    lua_absindex = _require2.lua_absindex,
    lua_atpanic = _require2.lua_atpanic,
    lua_call = _require2.lua_call,
    lua_checkstack = _require2.lua_checkstack,
    lua_concat = _require2.lua_concat,
    lua_copy = _require2.lua_copy,
    lua_createtable = _require2.lua_createtable,
    lua_error = _require2.lua_error,
    lua_getfield = _require2.lua_getfield,
    lua_getinfo = _require2.lua_getinfo,
    lua_getmetatable = _require2.lua_getmetatable,
    lua_getstack = _require2.lua_getstack,
    lua_gettop = _require2.lua_gettop,
    lua_insert = _require2.lua_insert,
    lua_isinteger = _require2.lua_isinteger,
    lua_isnil = _require2.lua_isnil,
    lua_isnumber = _require2.lua_isnumber,
    lua_isstring = _require2.lua_isstring,
    lua_istable = _require2.lua_istable,
    lua_len = _require2.lua_len,
    lua_load = _require2.lua_load,
    lua_newstate = _require2.lua_newstate,
    lua_newtable = _require2.lua_newtable,
    lua_next = _require2.lua_next,
    lua_pcall = _require2.lua_pcall,
    lua_pop = _require2.lua_pop,
    lua_pushboolean = _require2.lua_pushboolean,
    lua_pushcclosure = _require2.lua_pushcclosure,
    lua_pushcfunction = _require2.lua_pushcfunction,
    lua_pushfstring = _require2.lua_pushfstring,
    lua_pushinteger = _require2.lua_pushinteger,
    lua_pushliteral = _require2.lua_pushliteral,
    lua_pushlstring = _require2.lua_pushlstring,
    lua_pushnil = _require2.lua_pushnil,
    lua_pushstring = _require2.lua_pushstring,
    lua_pushvalue = _require2.lua_pushvalue,
    lua_pushvfstring = _require2.lua_pushvfstring,
    lua_rawequal = _require2.lua_rawequal,
    lua_rawget = _require2.lua_rawget,
    lua_rawgeti = _require2.lua_rawgeti,
    lua_rawlen = _require2.lua_rawlen,
    lua_rawseti = _require2.lua_rawseti,
    lua_remove = _require2.lua_remove,
    lua_setfield = _require2.lua_setfield,
    lua_setglobal = _require2.lua_setglobal,
    lua_setmetatable = _require2.lua_setmetatable,
    lua_settop = _require2.lua_settop,
    lua_toboolean = _require2.lua_toboolean,
    lua_tointeger = _require2.lua_tointeger,
    lua_tointegerx = _require2.lua_tointegerx,
    lua_tojsstring = _require2.lua_tojsstring,
    lua_tolstring = _require2.lua_tolstring,
    lua_tonumber = _require2.lua_tonumber,
    lua_tonumberx = _require2.lua_tonumberx,
    lua_topointer = _require2.lua_topointer,
    lua_tostring = _require2.lua_tostring,
    lua_touserdata = _require2.lua_touserdata,
    lua_type = _require2.lua_type,
    lua_typename = _require2.lua_typename,
    lua_version = _require2.lua_version;

var _require3 = __webpack_require__(3),
    from_userstring = _require3.from_userstring,
    luastring_eq = _require3.luastring_eq,
    to_luastring = _require3.to_luastring,
    to_uristring = _require3.to_uristring;

/* extra error code for 'luaL_loadfilex' */


var LUA_ERRFILE = LUA_ERRERR + 1;

/* key, in the registry, for table of loaded modules */
var LUA_LOADED_TABLE = to_luastring("_LOADED");

/* key, in the registry, for table of preloaded loaders */
var LUA_PRELOAD_TABLE = to_luastring("_PRELOAD");

var LUA_FILEHANDLE = to_luastring("FILE*");

var LUAL_NUMSIZES = 4 * 16 + 8;

var __name = to_luastring("__name");
var __tostring = to_luastring("__tostring");

var empty = new Uint8Array(0);

var luaL_Buffer = function luaL_Buffer() {
    _classCallCheck(this, luaL_Buffer);

    this.L = null;
    this.b = empty;
    this.n = 0;
};

var LEVELS1 = 10; /* size of the first part of the stack */
var LEVELS2 = 11; /* size of the second part of the stack */

/*
** search for 'objidx' in table at index -1.
** return 1 + string at top if find a good name.
*/
var findfield = function findfield(L, objidx, level) {
    if (level === 0 || !lua_istable(L, -1)) return 0; /* not found */

    lua_pushnil(L); /* start 'next' loop */

    while (lua_next(L, -2)) {
        /* for each pair in table */
        if (lua_type(L, -2) === LUA_TSTRING) {
            /* ignore non-string keys */
            if (lua_rawequal(L, objidx, -1)) {
                /* found object? */
                lua_pop(L, 1); /* remove value (but keep name) */
                return 1;
            } else if (findfield(L, objidx, level - 1)) {
                /* try recursively */
                lua_remove(L, -2); /* remove table (but keep name) */
                lua_pushliteral(L, ".");
                lua_insert(L, -2); /* place '.' between the two names */
                lua_concat(L, 3);
                return 1;
            }
        }
        lua_pop(L, 1); /* remove value */
    }

    return 0; /* not found */
};

/*
** Search for a name for a function in all loaded modules
*/
var pushglobalfuncname = function pushglobalfuncname(L, ar) {
    var top = lua_gettop(L);
    lua_getinfo(L, to_luastring("f"), ar); /* push function */
    lua_getfield(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    if (findfield(L, top + 1, 2)) {
        var name = lua_tostring(L, -1);
        if (name[0] === 95 /* '_'.charCodeAt(0) */ && name[1] === 71 /* 'G'.charCodeAt(0) */ && name[2] === 46 /* '.'.charCodeAt(0) */
        ) {
                /* name start with '_G.'? */
                lua_pushstring(L, name.subarray(3)); /* push name without prefix */
                lua_remove(L, -2); /* remove original name */
            }
        lua_copy(L, -1, top + 1); /* move name to proper place */
        lua_pop(L, 2); /* remove pushed values */
        return 1;
    } else {
        lua_settop(L, top); /* remove function and global table */
        return 0;
    }
};

var pushfuncname = function pushfuncname(L, ar) {
    if (pushglobalfuncname(L, ar)) {
        /* try first a global name */
        lua_pushfstring(L, to_luastring("function '%s'"), lua_tostring(L, -1));
        lua_remove(L, -2); /* remove name */
    } else if (ar.namewhat.length !== 0) /* is there a name from code? */
        lua_pushfstring(L, to_luastring("%s '%s'"), ar.namewhat, ar.name); /* use it */
    else if (ar.what && ar.what[0] === 109 /* 'm'.charCodeAt(0) */) /* main? */
            lua_pushliteral(L, "main chunk");else if (ar.what && ar.what[0] === 76 /* 'L'.charCodeAt(0) */) /* for Lua functions, use <file:line> */
            lua_pushfstring(L, to_luastring("function <%s:%d>"), ar.short_src, ar.linedefined);else /* nothing left... */
            lua_pushliteral(L, "?");
};

var lastlevel = function lastlevel(L) {
    var ar = new lua_Debug();
    var li = 1;
    var le = 1;
    /* find an upper bound */
    while (lua_getstack(L, le, ar)) {
        li = le;le *= 2;
    }
    /* do a binary search */
    while (li < le) {
        var m = Math.floor((li + le) / 2);
        if (lua_getstack(L, m, ar)) li = m + 1;else le = m;
    }
    return le - 1;
};

var luaL_traceback = function luaL_traceback(L, L1, msg, level) {
    var ar = new lua_Debug();
    var top = lua_gettop(L);
    var last = lastlevel(L1);
    var n1 = last - level > LEVELS1 + LEVELS2 ? LEVELS1 : -1;
    if (msg) lua_pushfstring(L, to_luastring("%s\n"), msg);
    luaL_checkstack(L, 10, null);
    lua_pushliteral(L, "stack traceback:");
    while (lua_getstack(L1, level++, ar)) {
        if (n1-- === 0) {
            /* too many levels? */
            lua_pushliteral(L, "\n\t..."); /* add a '...' */
            level = last - LEVELS2 + 1; /* and skip to last ones */
        } else {
            lua_getinfo(L1, to_luastring("Slnt", true), ar);
            lua_pushfstring(L, to_luastring("\n\t%s:"), ar.short_src);
            if (ar.currentline > 0) lua_pushliteral(L, ar.currentline + ':');
            lua_pushliteral(L, " in ");
            pushfuncname(L, ar);
            if (ar.istailcall) lua_pushliteral(L, "\n\t(...tail calls..)");
            lua_concat(L, lua_gettop(L) - top);
        }
    }
    lua_concat(L, lua_gettop(L) - top);
};

var panic = function panic(L) {
    var msg = "PANIC: unprotected error in call to Lua API (" + lua_tojsstring(L, -1) + ")";
    throw new Error(msg);
};

var luaL_argerror = function luaL_argerror(L, arg, extramsg) {
    var ar = new lua_Debug();

    if (!lua_getstack(L, 0, ar)) /* no stack frame? */
        return luaL_error(L, to_luastring("bad argument #%d (%s)"), arg, extramsg);

    lua_getinfo(L, to_luastring("n"), ar);

    if (luastring_eq(ar.namewhat, to_luastring("method"))) {
        arg--; /* do not count 'self' */
        if (arg === 0) /* error is in the self argument itself? */
            return luaL_error(L, to_luastring("calling '%s' on bad self (%s)"), ar.name, extramsg);
    }

    if (ar.name === null) ar.name = pushglobalfuncname(L, ar) ? lua_tostring(L, -1) : to_luastring("?");

    return luaL_error(L, to_luastring("bad argument #%d to '%s' (%s)"), arg, ar.name, extramsg);
};

var typeerror = function typeerror(L, arg, tname) {
    var typearg = void 0;
    if (luaL_getmetafield(L, arg, __name) === LUA_TSTRING) typearg = lua_tostring(L, -1);else if (lua_type(L, arg) === LUA_TLIGHTUSERDATA) typearg = to_luastring("light userdata", true);else typearg = luaL_typename(L, arg);

    var msg = lua_pushfstring(L, to_luastring("%s expected, got %s"), tname, typearg);
    return luaL_argerror(L, arg, msg);
};

var luaL_where = function luaL_where(L, level) {
    var ar = new lua_Debug();
    if (lua_getstack(L, level, ar)) {
        lua_getinfo(L, to_luastring("Sl", true), ar);
        if (ar.currentline > 0) {
            lua_pushfstring(L, to_luastring("%s:%d: "), ar.short_src, ar.currentline);
            return;
        }
    }
    lua_pushstring(L, to_luastring(""));
};

var luaL_error = function luaL_error(L, fmt) {
    luaL_where(L, 1);

    for (var _len = arguments.length, argp = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        argp[_key - 2] = arguments[_key];
    }

    lua_pushvfstring(L, fmt, argp);
    lua_concat(L, 2);
    return lua_error(L);
};

/* Unlike normal lua, we pass in an error object */
var luaL_fileresult = function luaL_fileresult(L, stat, fname, e) {
    if (stat) {
        lua_pushboolean(L, 1);
        return 1;
    } else {
        lua_pushnil(L);
        if (fname) lua_pushfstring(L, to_luastring("%s: %s"), fname, to_luastring(e.message));else lua_pushstring(L, to_luastring(e.message));
        lua_pushinteger(L, -e.errno);
        return 3;
    }
};

/* Unlike normal lua, we pass in an error object */
var luaL_execresult = function luaL_execresult(L, e) {
    var what = void 0,
        stat = void 0;
    if (e === null) {
        lua_pushboolean(L, 1);
        lua_pushliteral(L, "exit");
        lua_pushinteger(L, 0);
        return 3;
    } else if (e.status) {
        what = "exit";
        stat = e.status;
    } else if (e.signal) {
        what = "signal";
        stat = e.signal;
    } else {
        /* XXX: node seems to have e.errno as a string instead of a number */
        return luaL_fileresult(L, 0, null, e);
    }
    lua_pushnil(L);
    lua_pushliteral(L, what);
    lua_pushinteger(L, stat);
    return 3;
};

var luaL_getmetatable = function luaL_getmetatable(L, n) {
    return lua_getfield(L, LUA_REGISTRYINDEX, n);
};

var luaL_newmetatable = function luaL_newmetatable(L, tname) {
    if (luaL_getmetatable(L, tname) !== LUA_TNIL) /* name already in use? */
        return 0; /* leave previous value on top, but return 0 */
    lua_pop(L, 1);
    lua_createtable(L, 0, 2); /* create metatable */
    lua_pushstring(L, tname);
    lua_setfield(L, -2, __name); /* metatable.__name = tname */
    lua_pushvalue(L, -1);
    lua_setfield(L, LUA_REGISTRYINDEX, tname); /* registry.name = metatable */
    return 1;
};

var luaL_setmetatable = function luaL_setmetatable(L, tname) {
    luaL_getmetatable(L, tname);
    lua_setmetatable(L, -2);
};

var luaL_testudata = function luaL_testudata(L, ud, tname) {
    var p = lua_touserdata(L, ud);
    if (p !== null) {
        /* value is a userdata? */
        if (lua_getmetatable(L, ud)) {
            /* does it have a metatable? */
            luaL_getmetatable(L, tname); /* get correct metatable */
            if (!lua_rawequal(L, -1, -2)) /* not the same? */
                p = null; /* value is a userdata with wrong metatable */
            lua_pop(L, 2); /* remove both metatables */
            return p;
        }
    }
    return null; /* value is not a userdata with a metatable */
};

var luaL_checkudata = function luaL_checkudata(L, ud, tname) {
    var p = luaL_testudata(L, ud, tname);
    if (p === null) typeerror(L, ud, tname);
    return p;
};

var luaL_checkoption = function luaL_checkoption(L, arg, def, lst) {
    var name = def !== null ? luaL_optstring(L, arg, def) : luaL_checkstring(L, arg);
    for (var i = 0; lst[i]; i++) {
        if (luastring_eq(lst[i], name)) return i;
    }return luaL_argerror(L, arg, lua_pushfstring(L, to_luastring("invalid option '%s'"), name));
};

var tag_error = function tag_error(L, arg, tag) {
    typeerror(L, arg, lua_typename(L, tag));
};

var luaL_newstate = function luaL_newstate() {
    var L = lua_newstate();
    if (L) lua_atpanic(L, panic);
    return L;
};

var luaL_typename = function luaL_typename(L, i) {
    return lua_typename(L, lua_type(L, i));
};

var luaL_argcheck = function luaL_argcheck(L, cond, arg, extramsg) {
    if (!cond) luaL_argerror(L, arg, extramsg);
};

var luaL_checkany = function luaL_checkany(L, arg) {
    if (lua_type(L, arg) === LUA_TNONE) luaL_argerror(L, arg, to_luastring("value expected", true));
};

var luaL_checktype = function luaL_checktype(L, arg, t) {
    if (lua_type(L, arg) !== t) tag_error(L, arg, t);
};

var luaL_checkstring = function luaL_checkstring(L, n) {
    return luaL_checklstring(L, n, null);
};

var luaL_checklstring = function luaL_checklstring(L, arg) {
    var s = lua_tolstring(L, arg);
    if (s === null || s === undefined) tag_error(L, arg, LUA_TSTRING);
    return s;
};

var luaL_optlstring = function luaL_optlstring(L, arg, def) {
    if (lua_type(L, arg) <= 0) {
        return def === null ? null : from_userstring(def);
    } else return luaL_checklstring(L, arg);
};

var luaL_optstring = luaL_optlstring;

var interror = function interror(L, arg) {
    if (lua_isnumber(L, arg)) luaL_argerror(L, arg, to_luastring("number has no integer representation", true));else tag_error(L, arg, LUA_TNUMBER);
};

var luaL_checknumber = function luaL_checknumber(L, arg) {
    var d = lua_tonumberx(L, arg);
    if (d === false) tag_error(L, arg, LUA_TNUMBER);
    return d;
};

var luaL_optnumber = function luaL_optnumber(L, arg, def) {
    return luaL_opt(L, luaL_checknumber, arg, def);
};

var luaL_checkinteger = function luaL_checkinteger(L, arg) {
    var d = lua_tointegerx(L, arg);
    if (d === false) interror(L, arg);
    return d;
};

var luaL_optinteger = function luaL_optinteger(L, arg, def) {
    return luaL_opt(L, luaL_checkinteger, arg, def);
};

var luaL_prepbuffsize = function luaL_prepbuffsize(B, sz) {
    var newend = B.n + sz;
    if (B.b.length < newend) {
        var newsize = Math.max(B.b.length * 2, newend); /* double buffer size */
        var newbuff = new Uint8Array(newsize); /* create larger buffer */
        newbuff.set(B.b); /* copy original content */
        B.b = newbuff;
    }
    return B.b.subarray(B.n, newend);
};

var luaL_buffinit = function luaL_buffinit(L, B) {
    B.L = L;
    B.b = empty;
};

var luaL_buffinitsize = function luaL_buffinitsize(L, B, sz) {
    luaL_buffinit(L, B);
    return luaL_prepbuffsize(B, sz);
};

var luaL_prepbuffer = function luaL_prepbuffer(B) {
    return luaL_prepbuffsize(B, LUAL_BUFFERSIZE);
};

var luaL_addlstring = function luaL_addlstring(B, s, l) {
    if (l > 0) {
        var b = luaL_prepbuffsize(B, l);
        b.set(s.subarray(0, l));
        luaL_addsize(B, l);
    }
};

var luaL_addstring = function luaL_addstring(B, s) {
    luaL_addlstring(B, s, s.length);
};

var luaL_pushresult = function luaL_pushresult(B) {
    lua_pushlstring(B.L, B.b, B.n);
    /* delete old buffer */
    B.n = 0;
    B.b = empty;
};

var luaL_addchar = function luaL_addchar(B, c) {
    luaL_prepbuffsize(B, 1);
    B.b[B.n++] = c;
};

var luaL_addsize = function luaL_addsize(B, s) {
    B.n += s;
};

var luaL_pushresultsize = function luaL_pushresultsize(B, sz) {
    luaL_addsize(B, sz);
    luaL_pushresult(B);
};

var luaL_addvalue = function luaL_addvalue(B) {
    var L = B.L;
    var s = lua_tostring(L, -1);
    luaL_addlstring(B, s, s.length);
    lua_pop(L, 1); /* remove value */
};

var luaL_opt = function luaL_opt(L, f, n, d) {
    return lua_type(L, n) <= 0 ? d : f(L, n);
};

var getS = function getS(L, ud) {
    var s = ud.string;
    ud.string = null;
    return s;
};

var luaL_loadbufferx = function luaL_loadbufferx(L, buff, size, name, mode) {
    return lua_load(L, getS, { string: buff }, name, mode);
};

var luaL_loadbuffer = function luaL_loadbuffer(L, s, sz, n) {
    return luaL_loadbufferx(L, s, sz, n, null);
};

var luaL_loadstring = function luaL_loadstring(L, s) {
    return luaL_loadbuffer(L, s, s.length, s);
};

var luaL_dostring = function luaL_dostring(L, s) {
    return luaL_loadstring(L, s) || lua_pcall(L, 0, LUA_MULTRET, 0);
};

var luaL_getmetafield = function luaL_getmetafield(L, obj, event) {
    if (!lua_getmetatable(L, obj)) /* no metatable? */
        return LUA_TNIL;else {
        lua_pushstring(L, event);
        var tt = lua_rawget(L, -2);
        if (tt === LUA_TNIL) /* is metafield nil? */
            lua_pop(L, 2); /* remove metatable and metafield */
        else lua_remove(L, -2); /* remove only metatable */
        return tt; /* return metafield type */
    }
};

var luaL_callmeta = function luaL_callmeta(L, obj, event) {
    obj = lua_absindex(L, obj);
    if (luaL_getmetafield(L, obj, event) === LUA_TNIL) return false;

    lua_pushvalue(L, obj);
    lua_call(L, 1, 1);

    return true;
};

var luaL_len = function luaL_len(L, idx) {
    lua_len(L, idx);
    var l = lua_tointegerx(L, -1);
    if (l === false) luaL_error(L, to_luastring("object length is not an integer", true));
    lua_pop(L, 1); /* remove object */
    return l;
};

var p_I = to_luastring("%I");
var p_f = to_luastring("%f");
var luaL_tolstring = function luaL_tolstring(L, idx) {
    if (luaL_callmeta(L, idx, __tostring)) {
        if (!lua_isstring(L, -1)) luaL_error(L, to_luastring("'__tostring' must return a string"));
    } else {
        var t = lua_type(L, idx);
        switch (t) {
            case LUA_TNUMBER:
                {
                    if (lua_isinteger(L, idx)) lua_pushfstring(L, p_I, lua_tointeger(L, idx));else lua_pushfstring(L, p_f, lua_tonumber(L, idx));
                    break;
                }
            case LUA_TSTRING:
                lua_pushvalue(L, idx);
                break;
            case LUA_TBOOLEAN:
                lua_pushliteral(L, lua_toboolean(L, idx) ? "true" : "false");
                break;
            case LUA_TNIL:
                lua_pushliteral(L, "nil");
                break;
            default:
                {
                    var tt = luaL_getmetafield(L, idx, __name);
                    var kind = tt === LUA_TSTRING ? lua_tostring(L, -1) : luaL_typename(L, idx);
                    lua_pushfstring(L, to_luastring("%s: %p"), kind, lua_topointer(L, idx));
                    if (tt !== LUA_TNIL) lua_remove(L, -2);
                    break;
                }
        }
    }

    return lua_tolstring(L, -1);
};

/*
** Stripped-down 'require': After checking "loaded" table, calls 'openf'
** to open a module, registers the result in 'package.loaded' table and,
** if 'glb' is true, also registers the result in the global table.
** Leaves resulting module on the top.
*/
var luaL_requiref = function luaL_requiref(L, modname, openf, glb) {
    luaL_getsubtable(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    lua_getfield(L, -1, modname); /* LOADED[modname] */
    if (!lua_toboolean(L, -1)) {
        /* package not already loaded? */
        lua_pop(L, 1); /* remove field */
        lua_pushcfunction(L, openf);
        lua_pushstring(L, modname); /* argument to open function */
        lua_call(L, 1, 1); /* call 'openf' to open module */
        lua_pushvalue(L, -1); /* make copy of module (call result) */
        lua_setfield(L, -3, modname); /* LOADED[modname] = module */
    }
    lua_remove(L, -2); /* remove LOADED table */
    if (glb) {
        lua_pushvalue(L, -1); /* copy of module */
        lua_setglobal(L, modname); /* _G[modname] = module */
    }
};

var find_subarray = function find_subarray(arr, subarr, from_index) {
    var i = from_index >>> 0,
        sl = subarr.length,
        l = arr.length + 1 - sl;

    loop: for (; i < l; i++) {
        for (var j = 0; j < sl; j++) {
            if (arr[i + j] !== subarr[j]) continue loop;
        }return i;
    }
    return -1;
};

var luaL_gsub = function luaL_gsub(L, s, p, r) {
    var wild = void 0;
    var b = new luaL_Buffer();
    luaL_buffinit(L, b);
    while ((wild = find_subarray(s, p)) >= 0) {
        luaL_addlstring(b, s, wild); /* push prefix */
        luaL_addstring(b, r); /* push replacement in place of pattern */
        s = s.subarray(wild + p.length); /* continue after 'p' */
    }
    luaL_addstring(b, s); /* push last suffix */
    luaL_pushresult(b);
    return lua_tostring(L, -1);
};

/*
** ensure that stack[idx][fname] has a table and push that table
** into the stack
*/
var luaL_getsubtable = function luaL_getsubtable(L, idx, fname) {
    if (lua_getfield(L, idx, fname) === LUA_TTABLE) return true; /* table already there */
    else {
            lua_pop(L, 1); /* remove previous result */
            idx = lua_absindex(L, idx);
            lua_newtable(L);
            lua_pushvalue(L, -1); /* copy to be left at top */
            lua_setfield(L, idx, fname); /* assign new table to field */
            return false; /* false, because did not find table there */
        }
};

/*
** set functions from list 'l' into table at top - 'nup'; each
** function gets the 'nup' elements at the top as upvalues.
** Returns with only the table at the stack.
*/
var luaL_setfuncs = function luaL_setfuncs(L, l, nup) {
    luaL_checkstack(L, nup, to_luastring("too many upvalues", true));
    for (var lib in l) {
        /* fill the table with given functions */
        for (var i = 0; i < nup; i++) {
            /* copy upvalues to the top */
            lua_pushvalue(L, -nup);
        }lua_pushcclosure(L, l[lib], nup); /* closure with those upvalues */
        lua_setfield(L, -(nup + 2), to_luastring(lib));
    }
    lua_pop(L, nup); /* remove upvalues */
};

/*
** Ensures the stack has at least 'space' extra slots, raising an error
** if it cannot fulfill the request. (The error handling needs a few
** extra slots to format the error message. In case of an error without
** this extra space, Lua will generate the same 'stack overflow' error,
** but without 'msg'.)
*/
var luaL_checkstack = function luaL_checkstack(L, space, msg) {
    if (!lua_checkstack(L, space)) {
        if (msg) luaL_error(L, to_luastring("stack overflow (%s)"), msg);else luaL_error(L, to_luastring('stack overflow', true));
    }
};

var luaL_newlibtable = function luaL_newlibtable(L) {
    lua_createtable(L);
};

var luaL_newlib = function luaL_newlib(L, l) {
    lua_createtable(L);
    luaL_setfuncs(L, l, 0);
};

/* predefined references */
var LUA_NOREF = -2;
var LUA_REFNIL = -1;

var luaL_ref = function luaL_ref(L, t) {
    var ref = void 0;
    if (lua_isnil(L, -1)) {
        lua_pop(L, 1); /* remove from stack */
        return LUA_REFNIL; /* 'nil' has a unique fixed reference */
    }
    t = lua_absindex(L, t);
    lua_rawgeti(L, t, 0); /* get first free element */
    ref = lua_tointeger(L, -1); /* ref = t[freelist] */
    lua_pop(L, 1); /* remove it from stack */
    if (ref !== 0) {
        /* any free element? */
        lua_rawgeti(L, t, ref); /* remove it from list */
        lua_rawseti(L, t, 0); /* (t[freelist] = t[ref]) */
    } else /* no free elements */
        ref = lua_rawlen(L, t) + 1; /* get a new reference */
    lua_rawseti(L, t, ref);
    return ref;
};

var luaL_unref = function luaL_unref(L, t, ref) {
    if (ref >= 0) {
        t = lua_absindex(L, t);
        lua_rawgeti(L, t, 0);
        lua_rawseti(L, t, ref); /* t[ref] = t[freelist] */
        lua_pushinteger(L, ref);
        lua_rawseti(L, t, 0); /* t[freelist] = ref */
    }
};

var errfile = function errfile(L, what, fnameindex, error) {
    var serr = error.message;
    var filename = lua_tostring(L, fnameindex).subarray(1);
    lua_pushfstring(L, to_luastring("cannot %s %s: %s"), to_luastring(what), filename, to_luastring(serr));
    lua_remove(L, fnameindex);
    return LUA_ERRFILE;
};

var getc = void 0;

var utf8_bom = [0XEF, 0XBB, 0XBF]; /* UTF-8 BOM mark */
var skipBOM = function skipBOM(lf) {
    lf.n = 0;
    var c = void 0;
    var p = 0;
    do {
        c = getc(lf);
        if (c === null || c !== utf8_bom[p]) return c;
        p++;
        lf.buff[lf.n++] = c; /* to be read by the parser */
    } while (p < utf8_bom.length);
    lf.n = 0; /* prefix matched; discard it */
    return getc(lf); /* return next character */
};

/*
** reads the first character of file 'f' and skips an optional BOM mark
** in its beginning plus its first line if it starts with '#'. Returns
** true if it skipped the first line.  In any case, '*cp' has the
** first "valid" character of the file (after the optional BOM and
** a first-line comment).
*/
var skipcomment = function skipcomment(lf) {
    var c = skipBOM(lf);
    if (c === 35 /* '#'.charCodeAt(0) */) {
            /* first line is a comment (Unix exec. file)? */
            do {
                /* skip first line */
                c = getc(lf);
            } while (c && c !== 10 /* '\n'.charCodeAt(0) */);

            return {
                skipped: true,
                c: getc(lf) /* skip end-of-line, if present */
            };
        } else {
        return {
            skipped: false,
            c: c
        };
    }
};

var luaL_loadfilex = void 0;

var LoadF = function LoadF() {
    _classCallCheck(this, LoadF);

    this.n = NaN; /* number of pre-read characters */
    this.f = null; /* file being read */
    this.buff = new Uint8Array(1024); /* area for reading file */
    this.pos = 0; /* current position in file */
    this.err = void 0;
};

if (true) {
    var getF = function getF(L, ud) {
        var lf = ud;

        if (lf.f !== null && lf.n > 0) {
            /* are there pre-read characters to be read? */
            var bytes = lf.n; /* return them (chars already in buffer) */
            lf.n = 0; /* no more pre-read characters */
            lf.f = lf.f.subarray(lf.pos); /* we won't use lf.buff anymore */
            return lf.buff.subarray(0, bytes);
        }

        var f = lf.f;
        lf.f = null;
        return f;
    };

    getc = function getc(lf) {
        return lf.pos < lf.f.length ? lf.f[lf.pos++] : null;
    };

    luaL_loadfilex = function luaL_loadfilex(L, filename, mode) {
        var lf = new LoadF();
        var fnameindex = lua_gettop(L) + 1; /* index of filename on the stack */
        if (filename === null) {
            throw new Error("Can't read stdin in the browser");
        } else {
            lua_pushfstring(L, to_luastring("@%s"), filename);
            var path = to_uristring(filename);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path, false);
            /* XXX: Synchronous xhr in main thread always returns a js string
                Additionally, some browsers make console noise if you even attempt to set responseType
            */
            if (typeof window === "undefined") {
                xhr.responseType = "arraybuffer";
            }
            xhr.send();
            if (xhr.status >= 200 && xhr.status <= 299) {
                if (typeof xhr.response === "string") {
                    lf.f = to_luastring(xhr.response);
                } else {
                    lf.f = new Uint8Array(xhr.response);
                }
            } else {
                lf.err = xhr.status;
                return errfile(L, "open", fnameindex, { message: xhr.status + ': ' + xhr.statusText });
            }
        }
        var com = skipcomment(lf);
        /* check for signature first, as we don't want to add line number corrections in binary case */
        if (com.c === LUA_SIGNATURE[0] && filename) {/* binary file? */
            /* no need to re-open in node.js */
        } else if (com.skipped) {
            /* read initial portion */
            lf.buff[lf.n++] = 10 /* '\n'.charCodeAt(0) */; /* add line to correct line numbers */
        }
        if (com.c !== null) lf.buff[lf.n++] = com.c; /* 'c' is the first character of the stream */
        var status = lua_load(L, getF, lf, lua_tostring(L, -1), mode);
        var readstatus = lf.err;
        if (readstatus) {
            lua_settop(L, fnameindex); /* ignore results from 'lua_load' */
            return errfile(L, "read", fnameindex, readstatus);
        }
        lua_remove(L, fnameindex);
        return status;
    };
} else {
    var fs = require('fs');

    var _getF = function _getF(L, ud) {
        var lf = ud;
        var bytes = 0;
        if (lf.n > 0) {
            /* are there pre-read characters to be read? */
            bytes = lf.n; /* return them (chars already in buffer) */
            lf.n = 0; /* no more pre-read characters */
        } else {
            /* read a block from file */
            try {
                bytes = fs.readSync(lf.f, lf.buff, 0, lf.buff.length, lf.pos); /* read block */
            } catch (e) {
                lf.err = e;
                bytes = 0;
            }
            lf.pos += bytes;
        }
        if (bytes > 0) return lf.buff.subarray(0, bytes);else return null;
    };

    getc = function getc(lf) {
        var b = new Buffer(1);
        var bytes = void 0;
        try {
            bytes = fs.readSync(lf.f, b, 0, 1, lf.pos);
        } catch (e) {
            lf.err = e;
            return null;
        }
        lf.pos += bytes;
        return bytes > 0 ? b.readUInt8() : null;
    };

    luaL_loadfilex = function luaL_loadfilex(L, filename, mode) {
        var lf = new LoadF();
        var fnameindex = lua_gettop(L) + 1; /* index of filename on the stack */
        if (filename === null) {
            lua_pushliteral(L, "=stdin");
            lf.f = process.stdin.fd;
        } else {
            lua_pushfstring(L, to_luastring("@%s"), filename);
            try {
                lf.f = fs.openSync(filename, "r");
            } catch (e) {
                return errfile(L, "open", fnameindex, e);
            }
        }
        var com = skipcomment(lf);
        /* check for signature first, as we don't want to add line number corrections in binary case */
        if (com.c === LUA_SIGNATURE[0] && filename) {/* binary file? */
            /* no need to re-open in node.js */
        } else if (com.skipped) {
            /* read initial portion */
            lf.buff[lf.n++] = 10 /* '\n'.charCodeAt(0) */; /* add line to correct line numbers */
        }
        if (com.c !== null) lf.buff[lf.n++] = com.c; /* 'c' is the first character of the stream */
        var status = lua_load(L, _getF, lf, lua_tostring(L, -1), mode);
        var readstatus = lf.err;
        if (filename) try {
            fs.closeSync(lf.f);
        } catch (e) {} /* close file (even in case of errors) */
        if (readstatus) {
            lua_settop(L, fnameindex); /* ignore results from 'lua_load' */
            return errfile(L, "read", fnameindex, readstatus);
        }
        lua_remove(L, fnameindex);
        return status;
    };
}

var luaL_loadfile = function luaL_loadfile(L, filename) {
    return luaL_loadfilex(L, filename, null);
};

var luaL_dofile = function luaL_dofile(L, filename) {
    return luaL_loadfile(L, filename) || lua_pcall(L, 0, LUA_MULTRET, 0);
};

var lua_writestringerror = function lua_writestringerror() {
    for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (true) {
            /* split along new lines for separate console.error invocations */
            do {
                /* regexp uses [\d\D] to work around matching new lines
                   the 's' flag is non-standard */
                var r = /([^\n]*)\n?([\d\D]*)/.exec(a);
                console.error(r[1]);
                a = r[2];
            } while (a !== "");
        } else {
            process.stderr.write(a);
        }
    }
};

var luaL_checkversion_ = function luaL_checkversion_(L, ver, sz) {
    var v = lua_version(L);
    if (sz != LUAL_NUMSIZES) /* check numeric types */
        luaL_error(L, to_luastring("core and library have incompatible numeric types"));
    if (v != lua_version(null)) luaL_error(L, to_luastring("multiple Lua VMs detected"));else if (v !== ver) luaL_error(L, to_luastring("version mismatch: app. needs %f, Lua core provides %f"), ver, v);
};

/* There is no point in providing this function... */
var luaL_checkversion = function luaL_checkversion(L) {
    luaL_checkversion_(L, LUA_VERSION_NUM, LUAL_NUMSIZES);
};

module.exports.LUA_ERRFILE = LUA_ERRFILE;
module.exports.LUA_FILEHANDLE = LUA_FILEHANDLE;
module.exports.LUA_LOADED_TABLE = LUA_LOADED_TABLE;
module.exports.LUA_NOREF = LUA_NOREF;
module.exports.LUA_PRELOAD_TABLE = LUA_PRELOAD_TABLE;
module.exports.LUA_REFNIL = LUA_REFNIL;
module.exports.luaL_Buffer = luaL_Buffer;
module.exports.luaL_addchar = luaL_addchar;
module.exports.luaL_addlstring = luaL_addlstring;
module.exports.luaL_addsize = luaL_addsize;
module.exports.luaL_addstring = luaL_addstring;
module.exports.luaL_addvalue = luaL_addvalue;
module.exports.luaL_argcheck = luaL_argcheck;
module.exports.luaL_argerror = luaL_argerror;
module.exports.luaL_buffinit = luaL_buffinit;
module.exports.luaL_buffinitsize = luaL_buffinitsize;
module.exports.luaL_callmeta = luaL_callmeta;
module.exports.luaL_checkany = luaL_checkany;
module.exports.luaL_checkinteger = luaL_checkinteger;
module.exports.luaL_checklstring = luaL_checklstring;
module.exports.luaL_checknumber = luaL_checknumber;
module.exports.luaL_checkoption = luaL_checkoption;
module.exports.luaL_checkstack = luaL_checkstack;
module.exports.luaL_checkstring = luaL_checkstring;
module.exports.luaL_checktype = luaL_checktype;
module.exports.luaL_checkudata = luaL_checkudata;
module.exports.luaL_checkversion = luaL_checkversion;
module.exports.luaL_checkversion_ = luaL_checkversion_;
module.exports.luaL_dofile = luaL_dofile;
module.exports.luaL_dostring = luaL_dostring;
module.exports.luaL_error = luaL_error;
module.exports.luaL_execresult = luaL_execresult;
module.exports.luaL_fileresult = luaL_fileresult;
module.exports.luaL_getmetafield = luaL_getmetafield;
module.exports.luaL_getmetatable = luaL_getmetatable;
module.exports.luaL_getsubtable = luaL_getsubtable;
module.exports.luaL_gsub = luaL_gsub;
module.exports.luaL_len = luaL_len;
module.exports.luaL_loadbuffer = luaL_loadbuffer;
module.exports.luaL_loadbufferx = luaL_loadbufferx;
module.exports.luaL_loadfile = luaL_loadfile;
module.exports.luaL_loadfilex = luaL_loadfilex;
module.exports.luaL_loadstring = luaL_loadstring;
module.exports.luaL_newlib = luaL_newlib;
module.exports.luaL_newlibtable = luaL_newlibtable;
module.exports.luaL_newmetatable = luaL_newmetatable;
module.exports.luaL_newstate = luaL_newstate;
module.exports.luaL_opt = luaL_opt;
module.exports.luaL_optinteger = luaL_optinteger;
module.exports.luaL_optlstring = luaL_optlstring;
module.exports.luaL_optnumber = luaL_optnumber;
module.exports.luaL_optstring = luaL_optstring;
module.exports.luaL_prepbuffer = luaL_prepbuffer;
module.exports.luaL_prepbuffsize = luaL_prepbuffsize;
module.exports.luaL_pushresult = luaL_pushresult;
module.exports.luaL_pushresultsize = luaL_pushresultsize;
module.exports.luaL_ref = luaL_ref;
module.exports.luaL_requiref = luaL_requiref;
module.exports.luaL_setfuncs = luaL_setfuncs;
module.exports.luaL_setmetatable = luaL_setmetatable;
module.exports.luaL_testudata = luaL_testudata;
module.exports.luaL_tolstring = luaL_tolstring;
module.exports.luaL_traceback = luaL_traceback;
module.exports.luaL_typename = luaL_typename;
module.exports.luaL_unref = luaL_unref;
module.exports.luaL_where = luaL_where;
module.exports.lua_writestringerror = lua_writestringerror;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_HOOKCALL = _require.LUA_HOOKCALL,
    LUA_HOOKRET = _require.LUA_HOOKRET,
    LUA_HOOKTAILCALL = _require.LUA_HOOKTAILCALL,
    LUA_MASKCALL = _require.LUA_MASKCALL,
    LUA_MASKLINE = _require.LUA_MASKLINE,
    LUA_MASKRET = _require.LUA_MASKRET,
    LUA_MINSTACK = _require.LUA_MINSTACK,
    LUA_MULTRET = _require.LUA_MULTRET,
    LUA_SIGNATURE = _require.LUA_SIGNATURE,
    _require$constant_typ = _require.constant_types,
    LUA_TCCL = _require$constant_typ.LUA_TCCL,
    LUA_TLCF = _require$constant_typ.LUA_TLCF,
    LUA_TLCL = _require$constant_typ.LUA_TLCL,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    _require$thread_statu = _require.thread_status,
    LUA_ERRMEM = _require$thread_statu.LUA_ERRMEM,
    LUA_ERRERR = _require$thread_statu.LUA_ERRERR,
    LUA_ERRRUN = _require$thread_statu.LUA_ERRRUN,
    LUA_ERRSYNTAX = _require$thread_statu.LUA_ERRSYNTAX,
    LUA_OK = _require$thread_statu.LUA_OK,
    LUA_YIELD = _require$thread_statu.LUA_YIELD,
    lua_Debug = _require.lua_Debug,
    luastring_indexOf = _require.luastring_indexOf,
    to_luastring = _require.to_luastring;

var lapi = __webpack_require__(17);
var ldebug = __webpack_require__(10);
var lfunc = __webpack_require__(12);

var _require2 = __webpack_require__(2),
    api_check = _require2.api_check,
    lua_assert = _require2.lua_assert,
    LUAI_MAXCCALLS = _require2.LUAI_MAXCCALLS;

var lobject = __webpack_require__(5);
var lopcodes = __webpack_require__(15);
var lparser = __webpack_require__(22);
var lstate = __webpack_require__(11);

var _require3 = __webpack_require__(9),
    luaS_newliteral = _require3.luaS_newliteral;

var ltm = __webpack_require__(13);

var _require4 = __webpack_require__(4),
    LUAI_MAXSTACK = _require4.LUAI_MAXSTACK;

var lundump = __webpack_require__(33);
var lvm = __webpack_require__(14);

var _require5 = __webpack_require__(18),
    MBuffer = _require5.MBuffer;

var adjust_top = function adjust_top(L, newtop) {
    if (L.top < newtop) {
        while (L.top < newtop) {
            L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
        }
    } else {
        while (L.top > newtop) {
            delete L.stack[--L.top];
        }
    }
};

var seterrorobj = function seterrorobj(L, errcode, oldtop) {
    var current_top = L.top;

    /* extend stack so that L.stack[oldtop] is sure to exist */
    while (L.top < oldtop + 1) {
        L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
    }switch (errcode) {
        case LUA_ERRMEM:
            {
                lobject.setsvalue2s(L, oldtop, luaS_newliteral(L, "not enough memory"));
                break;
            }
        case LUA_ERRERR:
            {
                lobject.setsvalue2s(L, oldtop, luaS_newliteral(L, "error in error handling"));
                break;
            }
        default:
            {
                lobject.setobjs2s(L, oldtop, current_top - 1);
            }
    }

    while (L.top > oldtop + 1) {
        delete L.stack[--L.top];
    }
};

var ERRORSTACKSIZE = LUAI_MAXSTACK + 200;

var luaD_reallocstack = function luaD_reallocstack(L, newsize) {
    lua_assert(newsize <= LUAI_MAXSTACK || newsize == ERRORSTACKSIZE);
    lua_assert(L.stack_last == L.stack.length - lstate.EXTRA_STACK);
    L.stack.length = newsize;
    L.stack_last = newsize - lstate.EXTRA_STACK;
};

var luaD_growstack = function luaD_growstack(L, n) {
    var size = L.stack.length;
    if (size > LUAI_MAXSTACK) luaD_throw(L, LUA_ERRERR);else {
        var needed = L.top + n + lstate.EXTRA_STACK;
        var newsize = 2 * size;
        if (newsize > LUAI_MAXSTACK) newsize = LUAI_MAXSTACK;
        if (newsize < needed) newsize = needed;
        if (newsize > LUAI_MAXSTACK) {
            /* stack overflow? */
            luaD_reallocstack(L, ERRORSTACKSIZE);
            ldebug.luaG_runerror(L, to_luastring("stack overflow", true));
        } else luaD_reallocstack(L, newsize);
    }
};

var luaD_checkstack = function luaD_checkstack(L, n) {
    if (L.stack_last - L.top <= n) luaD_growstack(L, n);
};

var stackinuse = function stackinuse(L) {
    var lim = L.top;
    for (var ci = L.ci; ci !== null; ci = ci.previous) {
        if (lim < ci.top) lim = ci.top;
    }
    lua_assert(lim <= L.stack_last);
    return lim + 1; /* part of stack in use */
};

var luaD_shrinkstack = function luaD_shrinkstack(L) {
    var inuse = stackinuse(L);
    var goodsize = inuse + Math.floor(inuse / 8) + 2 * lstate.EXTRA_STACK;
    if (goodsize > LUAI_MAXSTACK) goodsize = LUAI_MAXSTACK; /* respect stack limit */
    if (L.stack.length > LUAI_MAXSTACK) /* had been handling stack overflow? */
        lstate.luaE_freeCI(L); /* free all CIs (list grew because of an error) */
    /* if thread is currently not handling a stack overflow and its
     good size is smaller than current size, shrink its stack */
    if (inuse <= LUAI_MAXSTACK - lstate.EXTRA_STACK && goodsize < L.stack.length) luaD_reallocstack(L, goodsize);
};

var luaD_inctop = function luaD_inctop(L) {
    luaD_checkstack(L, 1);
    L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
};

/*
** Prepares a function call: checks the stack, creates a new CallInfo
** entry, fills in the relevant information, calls hook if needed.
** If function is a JS function, does the call, too. (Otherwise, leave
** the execution ('luaV_execute') to the caller, to allow stackless
** calls.) Returns true iff function has been executed (JS function).
*/
var luaD_precall = function luaD_precall(L, off, nresults) {
    var func = L.stack[off];

    switch (func.type) {
        case LUA_TCCL:
        case LUA_TLCF:
            {
                var f = func.type === LUA_TCCL ? func.value.f : func.value;

                luaD_checkstack(L, LUA_MINSTACK);
                var ci = lstate.luaE_extendCI(L);
                ci.funcOff = off;
                ci.nresults = nresults;
                ci.func = func;
                ci.top = L.top + LUA_MINSTACK;
                lua_assert(ci.top <= L.stack_last);
                ci.callstatus = 0;
                if (L.hookmask & LUA_MASKCALL) luaD_hook(L, LUA_HOOKCALL, -1);
                var n = f(L); /* do the actual call */
                if (typeof n !== "number" || n < 0 || (n | 0) !== n) throw Error("invalid return value from JS function (expected integer)");
                lapi.api_checknelems(L, n);

                luaD_poscall(L, ci, L.top - n, n);

                return true;
            }
        case LUA_TLCL:
            {
                var base = void 0;
                var p = func.value.p;
                var _n = L.top - off - 1;
                var fsize = p.maxstacksize;
                luaD_checkstack(L, fsize);
                if (p.is_vararg) {
                    base = adjust_varargs(L, p, _n);
                } else {
                    for (; _n < p.numparams; _n++) {
                        L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
                    } // complete missing arguments
                    base = off + 1;
                }

                var _ci = lstate.luaE_extendCI(L);
                _ci.funcOff = off;
                _ci.nresults = nresults;
                _ci.func = func;
                _ci.l_base = base;
                _ci.top = base + fsize;
                adjust_top(L, _ci.top);
                _ci.l_code = p.code;
                _ci.l_savedpc = 0;
                _ci.callstatus = lstate.CIST_LUA;
                if (L.hookmask & LUA_MASKCALL) callhook(L, _ci);
                return false;
            }
        default:
            luaD_checkstack(L, 1);
            tryfuncTM(L, off, func);
            return luaD_precall(L, off, nresults);
    }
};

var luaD_poscall = function luaD_poscall(L, ci, firstResult, nres) {
    var wanted = ci.nresults;

    if (L.hookmask & (LUA_MASKRET | LUA_MASKLINE)) {
        if (L.hookmask & LUA_MASKRET) luaD_hook(L, LUA_HOOKRET, -1);
        L.oldpc = ci.previous.l_savedpc; /* 'oldpc' for caller function */
    }

    var res = ci.funcOff;
    L.ci = ci.previous;
    L.ci.next = null;
    return moveresults(L, firstResult, res, nres, wanted);
};

var moveresults = function moveresults(L, firstResult, res, nres, wanted) {
    switch (wanted) {
        case 0:
            break;
        case 1:
            {
                if (nres === 0) L.stack[res].setnilvalue();else {
                    lobject.setobjs2s(L, res, firstResult); /* move it to proper place */
                }
                break;
            }
        case LUA_MULTRET:
            {
                for (var i = 0; i < nres; i++) {
                    lobject.setobjs2s(L, res + i, firstResult + i);
                }for (var _i = L.top; _i >= res + nres; _i--) {
                    delete L.stack[_i];
                }L.top = res + nres;
                return false;
            }
        default:
            {
                var _i2 = void 0;
                if (wanted <= nres) {
                    for (_i2 = 0; _i2 < wanted; _i2++) {
                        lobject.setobjs2s(L, res + _i2, firstResult + _i2);
                    }
                } else {
                    for (_i2 = 0; _i2 < nres; _i2++) {
                        lobject.setobjs2s(L, res + _i2, firstResult + _i2);
                    }for (; _i2 < wanted; _i2++) {
                        if (res + _i2 >= L.top) L.stack[res + _i2] = new lobject.TValue(LUA_TNIL, null);else L.stack[res + _i2].setnilvalue();
                    }
                }
                break;
            }
    }
    var newtop = res + wanted; /* top points after the last result */
    for (var _i3 = L.top; _i3 >= newtop; _i3--) {
        delete L.stack[_i3];
    }L.top = newtop;
    return true;
};

/*
** Call a hook for the given event. Make sure there is a hook to be
** called. (Both 'L->hook' and 'L->hookmask', which triggers this
** function, can be changed asynchronously by signals.)
*/
var luaD_hook = function luaD_hook(L, event, line) {
    var hook = L.hook;
    if (hook && L.allowhook) {
        /* make sure there is a hook */
        var ci = L.ci;
        var top = L.top;
        var ci_top = ci.top;
        var ar = new lua_Debug();
        ar.event = event;
        ar.currentline = line;
        ar.i_ci = ci;
        luaD_checkstack(L, LUA_MINSTACK); /* ensure minimum stack size */
        ci.top = L.top + LUA_MINSTACK;
        lua_assert(ci.top <= L.stack_last);
        L.allowhook = 0; /* cannot call hooks inside a hook */
        ci.callstatus |= lstate.CIST_HOOKED;
        hook(L, ar);
        lua_assert(!L.allowhook);
        L.allowhook = 1;
        ci.top = ci_top;
        adjust_top(L, top);
        ci.callstatus &= ~lstate.CIST_HOOKED;
    }
};

var callhook = function callhook(L, ci) {
    var hook = LUA_HOOKCALL;
    ci.l_savedpc++; /* hooks assume 'pc' is already incremented */
    if (ci.previous.callstatus & lstate.CIST_LUA && ci.previous.l_code[ci.previous.l_savedpc - 1].opcode == lopcodes.OpCodesI.OP_TAILCALL) {
        ci.callstatus |= lstate.CIST_TAIL;
        hook = LUA_HOOKTAILCALL;
    }
    luaD_hook(L, hook, -1);
    ci.l_savedpc--; /* correct 'pc' */
};

var adjust_varargs = function adjust_varargs(L, p, actual) {
    var nfixargs = p.numparams;
    /* move fixed parameters to final position */
    var fixed = L.top - actual; /* first fixed argument */
    var base = L.top; /* final position of first argument */

    var i = void 0;
    for (i = 0; i < nfixargs && i < actual; i++) {
        lobject.pushobj2s(L, L.stack[fixed + i]);
        L.stack[fixed + i].setnilvalue();
    }

    for (; i < nfixargs; i++) {
        L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
    }return base;
};

var tryfuncTM = function tryfuncTM(L, off, func) {
    var tm = ltm.luaT_gettmbyobj(L, func, ltm.TMS.TM_CALL);
    if (!tm.ttisfunction(tm)) ldebug.luaG_typeerror(L, func, to_luastring("call", true));
    /* Open a hole inside the stack at 'func' */
    lobject.pushobj2s(L, L.stack[L.top - 1]); /* push top of stack again */
    for (var p = L.top - 2; p > off; p--) {
        lobject.setobjs2s(L, p, p - 1);
    } /* move other items up one */
    lobject.setobj2s(L, off, tm); /* tag method is the new function to be called */
};

/*
** Check appropriate error for stack overflow ("regular" overflow or
** overflow while handling stack overflow). If 'nCalls' is larger than
** LUAI_MAXCCALLS (which means it is handling a "regular" overflow) but
** smaller than 9/8 of LUAI_MAXCCALLS, does not report an error (to
** allow overflow handling to work)
*/
var stackerror = function stackerror(L) {
    if (L.nCcalls === LUAI_MAXCCALLS) ldebug.luaG_runerror(L, to_luastring("JS stack overflow", true));else if (L.nCcalls >= LUAI_MAXCCALLS + (LUAI_MAXCCALLS >> 3)) luaD_throw(L, LUA_ERRERR); /* error while handing stack error */
};

/*
** Call a function (JS or Lua). The function to be called is at func.
** The arguments are on the stack, right after the function.
** When returns, all the results are on the stack, starting at the original
** function position.
*/
var luaD_call = function luaD_call(L, off, nResults) {
    if (++L.nCcalls >= LUAI_MAXCCALLS) stackerror(L);
    if (!luaD_precall(L, off, nResults)) lvm.luaV_execute(L);
    L.nCcalls--;
};

var luaD_throw = function luaD_throw(L, errcode) {
    if (L.errorJmp) {
        /* thread has an error handler? */
        L.errorJmp.status = errcode; /* set status */
        throw L.errorJmp;
    } else {
        /* thread has no error handler */
        var g = L.l_G;
        L.status = errcode; /* mark it as dead */
        if (g.mainthread.errorJmp) {
            /* main thread has a handler? */
            g.mainthread.stack[g.mainthread.top++] = L.stack[L.top - 1]; /* copy error obj. */
            luaD_throw(g.mainthread, errcode); /* re-throw in main thread */
        } else {
            /* no handler at all; abort */
            var panic = g.panic;
            if (panic) {
                /* panic function? */
                seterrorobj(L, errcode, L.top); /* assume EXTRA_STACK */
                if (L.ci.top < L.top) L.ci.top = L.top; /* pushing msg. can break this invariant */
                panic(L); /* call panic function (last chance to jump out) */
            }
            throw new Error('Aborted ' + errcode);
        }
    }
};

var luaD_rawrunprotected = function luaD_rawrunprotected(L, f, ud) {
    var oldnCcalls = L.nCcalls;
    var lj = {
        status: LUA_OK,
        previous: L.errorJmp /* chain new error handler */
    };
    L.errorJmp = lj;

    try {
        f(L, ud);
    } catch (e) {
        if (lj.status === LUA_OK) {
            /* error was not thrown via luaD_throw, i.e. it is a JS error */
            /* run user error handler (if it exists) */
            var atnativeerror = L.l_G.atnativeerror;
            if (atnativeerror) {
                try {
                    lj.status = LUA_OK;

                    lapi.lua_pushcfunction(L, atnativeerror);
                    lapi.lua_pushlightuserdata(L, e);
                    luaD_callnoyield(L, L.top - 2, 1);

                    /* Now run the message handler (if it exists) */
                    /* copy of luaG_errormsg without the throw */
                    if (L.errfunc !== 0) {
                        /* is there an error handling function? */
                        var errfunc = L.errfunc;
                        lobject.pushobj2s(L, L.stack[L.top - 1]); /* move argument */
                        lobject.setobjs2s(L, L.top - 2, errfunc); /* push function */
                        luaD_callnoyield(L, L.top - 2, 1);
                    }

                    lj.status = LUA_ERRRUN;
                } catch (e2) {
                    if (lj.status === LUA_OK) {
                        /* also failed */
                        lj.status = -1;
                    }
                }
            } else {
                lj.status = -1;
            }
        }
    }

    L.errorJmp = lj.previous;
    L.nCcalls = oldnCcalls;

    return lj.status;
};

/*
** Completes the execution of an interrupted C function, calling its
** continuation function.
*/
var finishCcall = function finishCcall(L, status) {
    var ci = L.ci;

    /* must have a continuation and must be able to call it */
    lua_assert(ci.c_k !== null && L.nny === 0);
    /* error status can only happen in a protected call */
    lua_assert(ci.callstatus & lstate.CIST_YPCALL || status === LUA_YIELD);

    if (ci.callstatus & lstate.CIST_YPCALL) {
        /* was inside a pcall? */
        ci.callstatus &= ~lstate.CIST_YPCALL; /* continuation is also inside it */
        L.errfunc = ci.c_old_errfunc; /* with the same error function */
    }

    /* finish 'lua_callk'/'lua_pcall'; CIST_YPCALL and 'errfunc' already
       handled */
    if (ci.nresults === LUA_MULTRET && L.ci.top < L.top) L.ci.top = L.top;
    var c_k = ci.c_k; /* don't want to call as method */
    var n = c_k(L, status, ci.c_ctx); /* call continuation function */
    lapi.api_checknelems(L, n);
    luaD_poscall(L, ci, L.top - n, n); /* finish 'luaD_precall' */
};

/*
** Executes "full continuation" (everything in the stack) of a
** previously interrupted coroutine until the stack is empty (or another
** interruption long-jumps out of the loop). If the coroutine is
** recovering from an error, 'ud' points to the error status, which must
** be passed to the first continuation function (otherwise the default
** status is LUA_YIELD).
*/
var unroll = function unroll(L, ud) {
    if (ud !== null) /* error status? */
        finishCcall(L, ud); /* finish 'lua_pcallk' callee */

    while (L.ci !== L.base_ci) {
        /* something in the stack */
        if (!(L.ci.callstatus & lstate.CIST_LUA)) /* C function? */
            finishCcall(L, LUA_YIELD); /* complete its execution */
        else {
                /* Lua function */
                lvm.luaV_finishOp(L); /* finish interrupted instruction */
                lvm.luaV_execute(L); /* execute down to higher C 'boundary' */
            }
    }
};

/*
** Try to find a suspended protected call (a "recover point") for the
** given thread.
*/
var findpcall = function findpcall(L) {
    for (var ci = L.ci; ci !== null; ci = ci.previous) {
        /* search for a pcall */
        if (ci.callstatus & lstate.CIST_YPCALL) return ci;
    }

    return null; /* no pending pcall */
};

/*
** Recovers from an error in a coroutine. Finds a recover point (if
** there is one) and completes the execution of the interrupted
** 'luaD_pcall'. If there is no recover point, returns zero.
*/
var recover = function recover(L, status) {
    var ci = findpcall(L);
    if (ci === null) return 0; /* no recovery point */
    /* "finish" luaD_pcall */
    var oldtop = ci.extra;
    lfunc.luaF_close(L, oldtop);
    seterrorobj(L, status, oldtop);
    L.ci = ci;
    L.allowhook = ci.callstatus & lstate.CIST_OAH; /* restore original 'allowhook' */
    L.nny = 0; /* should be zero to be yieldable */
    luaD_shrinkstack(L);
    L.errfunc = ci.c_old_errfunc;
    return 1; /* continue running the coroutine */
};

/*
** Signal an error in the call to 'lua_resume', not in the execution
** of the coroutine itself. (Such errors should not be handled by any
** coroutine error handler and should not kill the coroutine.)
*/
var resume_error = function resume_error(L, msg, narg) {
    var ts = luaS_newliteral(L, msg);
    if (narg === 0) {
        lobject.pushsvalue2s(L, ts);
        api_check(L, L.top <= L.ci.top, "stack overflow");
    } else {
        /* remove args from the stack */
        for (var i = 1; i < narg; i++) {
            delete L.stack[--L.top];
        }lobject.setsvalue2s(L, L.top - 1, ts); /* push error message */
    }
    return LUA_ERRRUN;
};

/*
** Do the work for 'lua_resume' in protected mode. Most of the work
** depends on the status of the coroutine: initial state, suspended
** inside a hook, or regularly suspended (optionally with a continuation
** function), plus erroneous cases: non-suspended coroutine or dead
** coroutine.
*/
var resume = function resume(L, n) {
    var firstArg = L.top - n; /* first argument */
    var ci = L.ci;
    if (L.status === LUA_OK) {
        /* starting a coroutine? */
        if (!luaD_precall(L, firstArg - 1, LUA_MULTRET)) /* Lua function? */
            lvm.luaV_execute(L); /* call it */
    } else {
        /* resuming from previous yield */
        lua_assert(L.status === LUA_YIELD);
        L.status = LUA_OK; /* mark that it is running (again) */
        ci.funcOff = ci.extra;
        ci.func = L.stack[ci.funcOff];

        if (ci.callstatus & lstate.CIST_LUA) /* yielded inside a hook? */
            lvm.luaV_execute(L); /* just continue running Lua code */
        else {
                /* 'common' yield */
                if (ci.c_k !== null) {
                    /* does it have a continuation function? */
                    n = ci.c_k(L, LUA_YIELD, ci.c_ctx); /* call continuation */
                    lapi.api_checknelems(L, n);
                    firstArg = L.top - n; /* yield results come from continuation */
                }

                luaD_poscall(L, ci, firstArg, n); /* finish 'luaD_precall' */
            }

        unroll(L, null); /* run continuation */
    }
};

var lua_resume = function lua_resume(L, from, nargs) {
    var oldnny = L.nny; /* save "number of non-yieldable" calls */

    if (L.status === LUA_OK) {
        /* may be starting a coroutine */
        if (L.ci !== L.base_ci) /* not in base level? */
            return resume_error(L, "cannot resume non-suspended coroutine", nargs);
    } else if (L.status !== LUA_YIELD) return resume_error(L, "cannot resume dead coroutine", nargs);

    L.nCcalls = from ? from.nCcalls + 1 : 1;
    if (L.nCcalls >= LUAI_MAXCCALLS) return resume_error(L, "JS stack overflow", nargs);

    L.nny = 0; /* allow yields */

    lapi.api_checknelems(L, L.status === LUA_OK ? nargs + 1 : nargs);

    var status = luaD_rawrunprotected(L, resume, nargs);
    if (status === -1) /* error calling 'lua_resume'? */
        status = LUA_ERRRUN;else {
        /* continue running after recoverable errors */
        while (status > LUA_YIELD && recover(L, status)) {
            /* unroll continuation */
            status = luaD_rawrunprotected(L, unroll, status);
        }

        if (status > LUA_YIELD) {
            /* unrecoverable error? */
            L.status = status; /* mark thread as 'dead' */
            seterrorobj(L, status, L.top); /* push error message */
            L.ci.top = L.top;
        } else lua_assert(status === L.status); /* normal end or yield */
    }

    L.nny = oldnny; /* restore 'nny' */
    L.nCcalls--;
    lua_assert(L.nCcalls === (from ? from.nCcalls : 0));
    return status;
};

var lua_isyieldable = function lua_isyieldable(L) {
    return L.nny === 0;
};

var lua_yieldk = function lua_yieldk(L, nresults, ctx, k) {
    var ci = L.ci;
    lapi.api_checknelems(L, nresults);

    if (L.nny > 0) {
        if (L !== L.l_G.mainthread) ldebug.luaG_runerror(L, to_luastring("attempt to yield across a JS-call boundary", true));else ldebug.luaG_runerror(L, to_luastring("attempt to yield from outside a coroutine", true));
    }

    L.status = LUA_YIELD;
    ci.extra = ci.funcOff; /* save current 'func' */
    if (ci.callstatus & lstate.CIST_LUA) /* inside a hook? */
        api_check(L, k === null, "hooks cannot continue after yielding");else {
        ci.c_k = k;
        if (k !== null) /* is there a continuation? */
            ci.c_ctx = ctx; /* save context */
        ci.funcOff = L.top - nresults - 1; /* protect stack below results */
        ci.func = L.stack[ci.funcOff];
        luaD_throw(L, LUA_YIELD);
    }

    lua_assert(ci.callstatus & lstate.CIST_HOOKED); /* must be inside a hook */
    return 0; /* return to 'luaD_hook' */
};

var lua_yield = function lua_yield(L, n) {
    lua_yieldk(L, n, 0, null);
};

var luaD_pcall = function luaD_pcall(L, func, u, old_top, ef) {
    var old_ci = L.ci;
    var old_allowhooks = L.allowhook;
    var old_nny = L.nny;
    var old_errfunc = L.errfunc;
    L.errfunc = ef;

    var status = luaD_rawrunprotected(L, func, u);

    if (status !== LUA_OK) {
        lfunc.luaF_close(L, old_top);
        seterrorobj(L, status, old_top);
        L.ci = old_ci;
        L.allowhook = old_allowhooks;
        L.nny = old_nny;
        luaD_shrinkstack(L);
    }

    L.errfunc = old_errfunc;

    return status;
};

/*
** Similar to 'luaD_call', but does not allow yields during the call
*/
var luaD_callnoyield = function luaD_callnoyield(L, off, nResults) {
    L.nny++;
    luaD_call(L, off, nResults);
    L.nny--;
};

/*
** Execute a protected parser.
*/

var SParser = function SParser(z, name, mode) {
    _classCallCheck(this, SParser);

    /* data to 'f_parser' */
    this.z = z;
    this.buff = new MBuffer(); /* dynamic structure used by the scanner */
    this.dyd = new lparser.Dyndata(); /* dynamic structures used by the parser */
    this.mode = mode;
    this.name = name;
};

var checkmode = function checkmode(L, mode, x) {
    if (mode && luastring_indexOf(mode, x[0]) === -1) {
        lobject.luaO_pushfstring(L, to_luastring("attempt to load a %s chunk (mode is '%s')"), x, mode);
        luaD_throw(L, LUA_ERRSYNTAX);
    }
};

var f_parser = function f_parser(L, p) {
    var cl = void 0;
    var c = p.z.zgetc(); /* read first character */
    if (c === LUA_SIGNATURE[0]) {
        checkmode(L, p.mode, to_luastring("binary", true));
        cl = lundump.luaU_undump(L, p.z, p.name);
    } else {
        checkmode(L, p.mode, to_luastring("text", true));
        cl = lparser.luaY_parser(L, p.z, p.buff, p.dyd, p.name, c);
    }

    lua_assert(cl.nupvalues === cl.p.upvalues.length);
    lfunc.luaF_initupvals(L, cl);
};

var luaD_protectedparser = function luaD_protectedparser(L, z, name, mode) {
    var p = new SParser(z, name, mode);
    L.nny++; /* cannot yield during parsing */
    var status = luaD_pcall(L, f_parser, p, L.top, L.errfunc);
    L.nny--;
    return status;
};

module.exports.adjust_top = adjust_top;
module.exports.luaD_call = luaD_call;
module.exports.luaD_callnoyield = luaD_callnoyield;
module.exports.luaD_checkstack = luaD_checkstack;
module.exports.luaD_growstack = luaD_growstack;
module.exports.luaD_hook = luaD_hook;
module.exports.luaD_inctop = luaD_inctop;
module.exports.luaD_pcall = luaD_pcall;
module.exports.luaD_poscall = luaD_poscall;
module.exports.luaD_precall = luaD_precall;
module.exports.luaD_protectedparser = luaD_protectedparser;
module.exports.luaD_rawrunprotected = luaD_rawrunprotected;
module.exports.luaD_reallocstack = luaD_reallocstack;
module.exports.luaD_throw = luaD_throw;
module.exports.lua_isyieldable = lua_isyieldable;
module.exports.lua_resume = lua_resume;
module.exports.lua_yield = lua_yield;
module.exports.lua_yieldk = lua_yieldk;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TCCL = _require$constant_typ.LUA_TCCL,
    LUA_TLCF = _require$constant_typ.LUA_TLCF,
    LUA_TLCL = _require$constant_typ.LUA_TLCL,
    LUA_TLIGHTUSERDATA = _require$constant_typ.LUA_TLIGHTUSERDATA,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TTHREAD = _require$constant_typ.LUA_TTHREAD,
    LUA_TUSERDATA = _require$constant_typ.LUA_TUSERDATA,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    lua_assert = _require2.lua_assert;

var ldebug = __webpack_require__(10);
var lobject = __webpack_require__(5);

var _require3 = __webpack_require__(9),
    luaS_hashlongstr = _require3.luaS_hashlongstr,
    TString = _require3.TString;

var lstate = __webpack_require__(11);

/* used to prevent conflicts with lightuserdata keys */
var lightuserdata_hashes = new WeakMap();
var get_lightuserdata_hash = function get_lightuserdata_hash(v) {
    var hash = lightuserdata_hashes.get(v);
    if (!hash) {
        /* Hash should be something unique that is a valid WeakMap key
           so that it ends up in dead_weak when removed from a table */
        hash = {};
        lightuserdata_hashes.set(v, hash);
    }
    return hash;
};

var table_hash = function table_hash(L, key) {
    switch (key.type) {
        case LUA_TNIL:
            return ldebug.luaG_runerror(L, to_luastring("table index is nil", true));
        case LUA_TNUMFLT:
            if (isNaN(key.value)) return ldebug.luaG_runerror(L, to_luastring("table index is NaN", true));
        /* fall through */
        case LUA_TNUMINT: /* takes advantage of floats and integers being same in JS */
        case LUA_TBOOLEAN:
        case LUA_TTABLE:
        case LUA_TLCL:
        case LUA_TLCF:
        case LUA_TCCL:
        case LUA_TUSERDATA:
        case LUA_TTHREAD:
            return key.value;
        case LUA_TSHRSTR:
        case LUA_TLNGSTR:
            return luaS_hashlongstr(key.tsvalue());
        case LUA_TLIGHTUSERDATA:
            {
                var v = key.value;
                switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
                    case "string":
                        /* possible conflict with LUA_TSTRING.
                           prefix this string with "*" so they don't clash */
                        return "*" + v;
                    case "number":
                        /* possible conflict with LUA_TNUMBER.
                           turn into string and prefix with "#" to avoid clash with other strings */
                        return "#" + v;
                    case "boolean":
                        /* possible conflict with LUA_TBOOLEAN. use strings ?true and ?false instead */
                        return v ? "?true" : "?false";
                    case "function":
                        /* possible conflict with LUA_TLCF.
                           indirect via a weakmap */
                        return get_lightuserdata_hash(v);
                    case "object":
                        /* v could be a lua_State, CClosure, LClosure, Table or Userdata from this state as returned by lua_topointer */
                        if (v instanceof lstate.lua_State && v.l_G === L.l_G || v instanceof Table || v instanceof lobject.Udata || v instanceof lobject.LClosure || v instanceof lobject.CClosure) {
                            /* indirect via a weakmap */
                            return get_lightuserdata_hash(v);
                        }
                    /* fall through */
                    default:
                        return v;
                }
            }
        default:
            throw new Error("unknown key type: " + key.type);
    }
};

var Table = function Table(L) {
    _classCallCheck(this, Table);

    this.id = L.l_G.id_counter++;
    this.strong = new Map();
    this.dead_strong = new Map();
    this.dead_weak = void 0; /* initialised when needed */
    this.f = void 0; /* first entry */
    this.l = void 0; /* last entry */
    this.metatable = null;
    this.flags = ~0;
};

var invalidateTMcache = function invalidateTMcache(t) {
    t.flags = 0;
};

var add = function add(t, hash, key, value) {
    t.dead_strong.clear();
    t.dead_weak = void 0;
    var prev = null;
    var entry = {
        key: key,
        value: value,
        p: prev = t.l,
        n: void 0
    };
    if (!t.f) t.f = entry;
    if (prev) prev.n = entry;
    t.strong.set(hash, entry);
    t.l = entry;
};

var is_valid_weakmap_key = function is_valid_weakmap_key(k) {
    return (typeof k === 'undefined' ? 'undefined' : _typeof(k)) === 'object' ? k !== null : typeof k === 'function';
};

/* Move out of 'strong' part and into 'dead' part. */
var mark_dead = function mark_dead(t, hash) {
    var e = t.strong.get(hash);
    if (e) {
        e.key.setdeadvalue();
        e.value = void 0;
        var next = e.n;
        var prev = e.p;
        e.p = void 0; /* no need to know previous item any more */
        if (prev) prev.n = next;
        if (next) next.p = prev;
        if (t.f === e) t.f = next;
        if (t.l === e) t.l = prev;
        t.strong.delete(hash);
        if (is_valid_weakmap_key(hash)) {
            if (!t.dead_weak) t.dead_weak = new WeakMap();
            t.dead_weak.set(hash, e);
        } else {
            /* can't be used as key in weakmap */
            t.dead_strong.set(hash, e);
        }
    }
};

var luaH_new = function luaH_new(L) {
    return new Table(L);
};

var getgeneric = function getgeneric(t, hash) {
    var v = t.strong.get(hash);
    return v ? v.value : lobject.luaO_nilobject;
};

var luaH_getint = function luaH_getint(t, key) {
    lua_assert(typeof key == "number" && (key | 0) === key);
    return getgeneric(t, key);
};

var luaH_getstr = function luaH_getstr(t, key) {
    lua_assert(key instanceof TString);
    return getgeneric(t, luaS_hashlongstr(key));
};

var luaH_get = function luaH_get(L, t, key) {
    lua_assert(key instanceof lobject.TValue);
    if (key.ttisnil() || key.ttisfloat() && isNaN(key.value)) return lobject.luaO_nilobject;
    return getgeneric(t, table_hash(L, key));
};

var setgeneric = function setgeneric(t, hash, key) {
    var v = t.strong.get(hash);
    if (v) return v.value;

    var kv = key.value;
    if (key.ttisfloat() && (kv | 0) === kv) {
        /* does index fit in an integer? */
        /* insert it as an integer */
        key = new lobject.TValue(LUA_TNUMINT, kv);
    } else {
        key = new lobject.TValue(key.type, kv);
    }
    var tv = new lobject.TValue(LUA_TNIL, null);
    add(t, hash, key, tv);
    return tv;
};

var luaH_setint = function luaH_setint(t, key, value) {
    lua_assert(typeof key == "number" && (key | 0) === key && value instanceof lobject.TValue);
    var hash = key; /* table_hash known result */
    if (value.ttisnil()) {
        mark_dead(t, hash);
        return;
    }
    var v = t.strong.get(hash);
    if (v) {
        var tv = v.value;
        tv.setfrom(value);
    } else {
        var k = new lobject.TValue(LUA_TNUMINT, key);
        var _v = new lobject.TValue(value.type, value.value);
        add(t, hash, k, _v);
    }
};

var luaH_set = function luaH_set(L, t, key) {
    lua_assert(key instanceof lobject.TValue);
    var hash = table_hash(L, key);
    return setgeneric(t, hash, key);
};

var luaH_delete = function luaH_delete(L, t, key) {
    lua_assert(key instanceof lobject.TValue);
    var hash = table_hash(L, key);
    return mark_dead(t, hash);
};

/*
** Try to find a boundary in table 't'. A 'boundary' is an integer index
** such that t[i] is non-nil and t[i+1] is nil (and 0 if t[1] is nil).
*/
var luaH_getn = function luaH_getn(t) {
    var i = 0;
    var j = t.strong.size + 1; /* use known size of Map to bound search */
    /* now do a binary search between them */
    while (j - i > 1) {
        var m = Math.floor((i + j) / 2);
        if (luaH_getint(t, m).ttisnil()) j = m;else i = m;
    }
    return i;
};

var luaH_next = function luaH_next(L, table, keyI) {
    var keyO = L.stack[keyI];

    var entry = void 0;
    if (keyO.type === LUA_TNIL) {
        entry = table.f;
        if (!entry) return false;
    } else {
        /* First find current key */
        var hash = table_hash(L, keyO);
        /* Look in main part of table */
        entry = table.strong.get(hash);
        if (entry) {
            entry = entry.n;
            if (!entry) return false;
        } else {
            /* Try dead keys */
            entry = table.dead_weak && table.dead_weak.get(hash) || table.dead_strong.get(hash);
            if (!entry)
                /* item not in table */
                return ldebug.luaG_runerror(L, to_luastring("invalid key to 'next'"));
            /* Iterate until either out of keys, or until finding a non-dead key */
            do {
                entry = entry.n;
                if (!entry) return false;
            } while (entry.key.ttisdeadkey());
        }
    }
    lobject.setobj2s(L, keyI, entry.key);
    lobject.setobj2s(L, keyI + 1, entry.value);
    return true;
};

module.exports.invalidateTMcache = invalidateTMcache;
module.exports.luaH_delete = luaH_delete;
module.exports.luaH_get = luaH_get;
module.exports.luaH_getint = luaH_getint;
module.exports.luaH_getn = luaH_getn;
module.exports.luaH_getstr = luaH_getstr;
module.exports.luaH_set = luaH_set;
module.exports.luaH_setint = luaH_setint;
module.exports.luaH_new = luaH_new;
module.exports.luaH_next = luaH_next;
module.exports.Table = Table;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    is_luastring = _require.is_luastring,
    luastring_eq = _require.luastring_eq,
    luastring_from = _require.luastring_from,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    lua_assert = _require2.lua_assert;

var TString = function () {
    function TString(L, str) {
        _classCallCheck(this, TString);

        this.hash = null;
        this.realstring = str;
    }

    _createClass(TString, [{
        key: "getstr",
        value: function getstr() {
            return this.realstring;
        }
    }, {
        key: "tsslen",
        value: function tsslen() {
            return this.realstring.length;
        }
    }]);

    return TString;
}();

var luaS_eqlngstr = function luaS_eqlngstr(a, b) {
    lua_assert(a instanceof TString);
    lua_assert(b instanceof TString);
    return a == b || luastring_eq(a.realstring, b.realstring);
};

/* converts strings (arrays) to a consistent map key
   make sure this doesn't conflict with any of the anti-collision strategies in ltable */
var luaS_hash = function luaS_hash(str) {
    lua_assert(is_luastring(str));
    var len = str.length;
    var s = "|";
    for (var i = 0; i < len; i++) {
        s += str[i].toString(16);
    }return s;
};

var luaS_hashlongstr = function luaS_hashlongstr(ts) {
    lua_assert(ts instanceof TString);
    if (ts.hash === null) {
        ts.hash = luaS_hash(ts.getstr());
    }
    return ts.hash;
};

/* variant that takes ownership of array */
var luaS_bless = function luaS_bless(L, str) {
    lua_assert(str instanceof Uint8Array);
    return new TString(L, str);
};

/* makes a copy */
var luaS_new = function luaS_new(L, str) {
    return luaS_bless(L, luastring_from(str));
};

/* takes a js string */
var luaS_newliteral = function luaS_newliteral(L, str) {
    return luaS_bless(L, to_luastring(str));
};

module.exports.luaS_eqlngstr = luaS_eqlngstr;
module.exports.luaS_hash = luaS_hash;
module.exports.luaS_hashlongstr = luaS_hashlongstr;
module.exports.luaS_bless = luaS_bless;
module.exports.luaS_new = luaS_new;
module.exports.luaS_newliteral = luaS_newliteral;
module.exports.TString = TString;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    LUA_HOOKCOUNT = _require.LUA_HOOKCOUNT,
    LUA_HOOKLINE = _require.LUA_HOOKLINE,
    LUA_MASKCOUNT = _require.LUA_MASKCOUNT,
    LUA_MASKLINE = _require.LUA_MASKLINE,
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    _require$thread_statu = _require.thread_status,
    LUA_ERRRUN = _require$thread_statu.LUA_ERRRUN,
    LUA_YIELD = _require$thread_statu.LUA_YIELD,
    from_userstring = _require.from_userstring,
    luastring_eq = _require.luastring_eq,
    luastring_indexOf = _require.luastring_indexOf,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    api_check = _require2.api_check,
    lua_assert = _require2.lua_assert;

var _require3 = __webpack_require__(4),
    LUA_IDSIZE = _require3.LUA_IDSIZE;

var lapi = __webpack_require__(17);
var ldo = __webpack_require__(7);
var lfunc = __webpack_require__(12);
var llex = __webpack_require__(20);
var lobject = __webpack_require__(5);
var lopcodes = __webpack_require__(15);
var lstate = __webpack_require__(11);
var ltable = __webpack_require__(8);
var ltm = __webpack_require__(13);
var lvm = __webpack_require__(14);

var currentpc = function currentpc(ci) {
    lua_assert(ci.callstatus & lstate.CIST_LUA);
    return ci.l_savedpc - 1;
};

var currentline = function currentline(ci) {
    return ci.func.value.p.lineinfo.length !== 0 ? ci.func.value.p.lineinfo[currentpc(ci)] : -1;
};

/*
** If function yielded, its 'func' can be in the 'extra' field. The
** next function restores 'func' to its correct value for debugging
** purposes. (It exchanges 'func' and 'extra'; so, when called again,
** after debugging, it also "re-restores" ** 'func' to its altered value.
*/
var swapextra = function swapextra(L) {
    if (L.status === LUA_YIELD) {
        var ci = L.ci; /* get function that yielded */
        var temp = ci.funcOff; /* exchange its 'func' and 'extra' values */
        ci.func = L.stack[ci.extra];
        ci.funcOff = ci.extra;
        ci.extra = temp;
    }
};

var lua_sethook = function lua_sethook(L, func, mask, count) {
    if (func === null || mask === 0) {
        /* turn off hooks? */
        mask = 0;
        func = null;
    }
    if (L.ci.callstatus & lstate.CIST_LUA) L.oldpc = L.ci.l_savedpc;
    L.hook = func;
    L.basehookcount = count;
    L.hookcount = L.basehookcount;
    L.hookmask = mask;
};

var lua_gethook = function lua_gethook(L) {
    return L.hook;
};

var lua_gethookmask = function lua_gethookmask(L) {
    return L.hookmask;
};

var lua_gethookcount = function lua_gethookcount(L) {
    return L.basehookcount;
};

var lua_getstack = function lua_getstack(L, level, ar) {
    var ci = void 0;
    var status = void 0;
    if (level < 0) return 0; /* invalid (negative) level */
    for (ci = L.ci; level > 0 && ci !== L.base_ci; ci = ci.previous) {
        level--;
    }if (level === 0 && ci !== L.base_ci) {
        /* level found? */
        status = 1;
        ar.i_ci = ci;
    } else status = 0; /* no such level */
    return status;
};

var upvalname = function upvalname(p, uv) {
    lua_assert(uv < p.upvalues.length);
    var s = p.upvalues[uv].name;
    if (s === null) return to_luastring("?", true);
    return s.getstr();
};

var findvararg = function findvararg(ci, n) {
    var nparams = ci.func.value.p.numparams;
    if (n >= ci.l_base - ci.funcOff - nparams) return null; /* no such vararg */
    else {
            return {
                pos: ci.funcOff + nparams + n,
                name: to_luastring("(*vararg)", true) /* generic name for any vararg */
            };
        }
};

var findlocal = function findlocal(L, ci, n) {
    var base = void 0,
        name = null;

    if (ci.callstatus & lstate.CIST_LUA) {
        if (n < 0) /* access to vararg values? */
            return findvararg(ci, -n);else {
            base = ci.l_base;
            name = lfunc.luaF_getlocalname(ci.func.value.p, n, currentpc(ci));
        }
    } else base = ci.funcOff + 1;

    if (name === null) {
        /* no 'standard' name? */
        var limit = ci === L.ci ? L.top : ci.next.funcOff;
        if (limit - base >= n && n > 0) /* is 'n' inside 'ci' stack? */
            name = to_luastring("(*temporary)", true); /* generic name for any valid slot */
        else return null; /* no name */
    }
    return {
        pos: base + (n - 1),
        name: name
    };
};

var lua_getlocal = function lua_getlocal(L, ar, n) {
    var name = void 0;
    swapextra(L);
    if (ar === null) {
        /* information about non-active function? */
        if (!L.stack[L.top - 1].ttisLclosure()) /* not a Lua function? */
            name = null;else /* consider live variables at function start (parameters) */
            name = lfunc.luaF_getlocalname(L.stack[L.top - 1].value.p, n, 0);
    } else {
        /* active function; get information through 'ar' */
        var local = findlocal(L, ar.i_ci, n);
        if (local) {
            name = local.name;
            lobject.pushobj2s(L, L.stack[local.pos]);
            api_check(L, L.top <= L.ci.top, "stack overflow");
        } else {
            name = null;
        }
    }
    swapextra(L);
    return name;
};

var lua_setlocal = function lua_setlocal(L, ar, n) {
    var name = void 0;
    swapextra(L);
    var local = findlocal(L, ar.i_ci, n);
    if (local) {
        name = local.name;
        lobject.setobjs2s(L, local.pos, L.top - 1);
        delete L.stack[--L.top]; /* pop value */
    } else {
        name = null;
    }
    swapextra(L);
    return name;
};

var funcinfo = function funcinfo(ar, cl) {
    if (cl === null || cl instanceof lobject.CClosure) {
        ar.source = to_luastring("=[JS]", true);
        ar.linedefined = -1;
        ar.lastlinedefined = -1;
        ar.what = to_luastring("J", true);
    } else {
        var p = cl.p;
        ar.source = p.source ? p.source.getstr() : to_luastring("=?", true);
        ar.linedefined = p.linedefined;
        ar.lastlinedefined = p.lastlinedefined;
        ar.what = ar.linedefined === 0 ? to_luastring("main", true) : to_luastring("Lua", true);
    }

    ar.short_src = lobject.luaO_chunkid(ar.source, LUA_IDSIZE);
};

var collectvalidlines = function collectvalidlines(L, f) {
    if (f === null || f instanceof lobject.CClosure) {
        L.stack[L.top] = new lobject.TValue(LUA_TNIL, null);
        lapi.api_incr_top(L);
    } else {
        var lineinfo = f.p.lineinfo;
        var t = ltable.luaH_new(L);
        L.stack[L.top] = new lobject.TValue(LUA_TTABLE, t);
        lapi.api_incr_top(L);
        var v = new lobject.TValue(LUA_TBOOLEAN, true);
        for (var i = 0; i < lineinfo.length; i++) {
            ltable.luaH_setint(t, lineinfo[i], v);
        }
    }
};

var getfuncname = function getfuncname(L, ci) {
    var r = {
        name: null,
        funcname: null
    };
    if (ci === null) return null;else if (ci.callstatus & lstate.CIST_FIN) {
        /* is this a finalizer? */
        r.name = to_luastring("__gc", true);
        r.funcname = to_luastring("metamethod", true); /* report it as such */
        return r;
    }
    /* calling function is a known Lua function? */
    else if (!(ci.callstatus & lstate.CIST_TAIL) && ci.previous.callstatus & lstate.CIST_LUA) return funcnamefromcode(L, ci.previous);else return null; /* no way to find a name */
};

var auxgetinfo = function auxgetinfo(L, what, ar, f, ci) {
    var status = 1;
    for (; what.length > 0; what = what.subarray(1)) {
        switch (what[0]) {
            case 83 /* ('S').charCodeAt(0) */:
                {
                    funcinfo(ar, f);
                    break;
                }
            case 108 /* ('l').charCodeAt(0) */:
                {
                    ar.currentline = ci && ci.callstatus & lstate.CIST_LUA ? currentline(ci) : -1;
                    break;
                }
            case 117 /* ('u').charCodeAt(0) */:
                {
                    ar.nups = f === null ? 0 : f.nupvalues;
                    if (f === null || f instanceof lobject.CClosure) {
                        ar.isvararg = true;
                        ar.nparams = 0;
                    } else {
                        ar.isvararg = f.p.is_vararg;
                        ar.nparams = f.p.numparams;
                    }
                    break;
                }
            case 116 /* ('t').charCodeAt(0) */:
                {
                    ar.istailcall = ci ? ci.callstatus & lstate.CIST_TAIL : 0;
                    break;
                }
            case 110 /* ('n').charCodeAt(0) */:
                {
                    var r = getfuncname(L, ci);
                    if (r === null) {
                        ar.namewhat = to_luastring("", true);
                        ar.name = null;
                    } else {
                        ar.namewhat = r.funcname;
                        ar.name = r.name;
                    }
                    break;
                }
            case 76 /* ('L').charCodeAt(0) */:
            case 102 /* ('f').charCodeAt(0) */:
                /* handled by lua_getinfo */
                break;
            default:
                status = 0; /* invalid option */
        }
    }

    return status;
};

var lua_getinfo = function lua_getinfo(L, what, ar) {
    what = from_userstring(what);
    var status = void 0,
        cl = void 0,
        ci = void 0,
        func = void 0;
    swapextra(L);
    if (what[0] === 62 /* ('>').charCodeAt(0) */) {
            ci = null;
            func = L.stack[L.top - 1];
            api_check(L, func.ttisfunction(), "function expected");
            what = what.subarray(1); /* skip the '>' */
            L.top--; /* pop function */
        } else {
        ci = ar.i_ci;
        func = ci.func;
        lua_assert(ci.func.ttisfunction());
    }

    cl = func.ttisclosure() ? func.value : null;
    status = auxgetinfo(L, what, ar, cl, ci);
    if (luastring_indexOf(what, 102 /* ('f').charCodeAt(0) */) >= 0) {
        lobject.pushobj2s(L, func);
        api_check(L, L.top <= L.ci.top, "stack overflow");
    }

    swapextra(L);
    if (luastring_indexOf(what, 76 /* ('L').charCodeAt(0) */) >= 0) collectvalidlines(L, cl);

    return status;
};

var kname = function kname(p, pc, c) {
    var r = {
        name: null,
        funcname: null
    };

    if (lopcodes.ISK(c)) {
        /* is 'c' a constant? */
        var kvalue = p.k[lopcodes.INDEXK(c)];
        if (kvalue.ttisstring()) {
            /* literal constant? */
            r.name = kvalue.svalue(); /* it is its own name */
            return r;
        }
        /* else no reasonable name found */
    } else {
        /* 'c' is a register */
        var what = getobjname(p, pc, c); /* search for 'c' */
        if (what && what.funcname[0] === 99 /* ('c').charCodeAt(0) */) {
                /* found a constant name? */
                return what; /* 'name' already filled */
            }
        /* else no reasonable name found */
    }
    r.name = to_luastring("?", true);
    return r; /* no reasonable name found */
};

var filterpc = function filterpc(pc, jmptarget) {
    if (pc < jmptarget) /* is code conditional (inside a jump)? */
        return -1; /* cannot know who sets that register */
    else return pc; /* current position sets that register */
};

/*
** try to find last instruction before 'lastpc' that modified register 'reg'
*/
var findsetreg = function findsetreg(p, lastpc, reg) {
    var setreg = -1; /* keep last instruction that changed 'reg' */
    var jmptarget = 0; /* any code before this address is conditional */
    var OCi = lopcodes.OpCodesI;
    for (var pc = 0; pc < lastpc; pc++) {
        var i = p.code[pc];
        var a = i.A;
        switch (i.opcode) {
            case OCi.OP_LOADNIL:
                {
                    var b = i.B;
                    if (a <= reg && reg <= a + b) /* set registers from 'a' to 'a+b' */
                        setreg = filterpc(pc, jmptarget);
                    break;
                }
            case OCi.OP_TFORCALL:
                {
                    if (reg >= a + 2) /* affect all regs above its base */
                        setreg = filterpc(pc, jmptarget);
                    break;
                }
            case OCi.OP_CALL:
            case OCi.OP_TAILCALL:
                {
                    if (reg >= a) /* affect all registers above base */
                        setreg = filterpc(pc, jmptarget);
                    break;
                }
            case OCi.OP_JMP:
                {
                    var _b = i.sBx;
                    var dest = pc + 1 + _b;
                    /* jump is forward and do not skip 'lastpc'? */
                    if (pc < dest && dest <= lastpc) {
                        if (dest > jmptarget) jmptarget = dest; /* update 'jmptarget' */
                    }
                    break;
                }
            default:
                if (lopcodes.testAMode(i.opcode) && reg === a) setreg = filterpc(pc, jmptarget);
                break;
        }
    }

    return setreg;
};

var getobjname = function getobjname(p, lastpc, reg) {
    var r = {
        name: lfunc.luaF_getlocalname(p, reg + 1, lastpc),
        funcname: null
    };

    if (r.name) {
        /* is a local? */
        r.funcname = to_luastring("local", true);
        return r;
    }

    /* else try symbolic execution */
    var pc = findsetreg(p, lastpc, reg);
    var OCi = lopcodes.OpCodesI;
    if (pc !== -1) {
        /* could find instruction? */
        var i = p.code[pc];
        switch (i.opcode) {
            case OCi.OP_MOVE:
                {
                    var b = i.B; /* move from 'b' to 'a' */
                    if (b < i.A) return getobjname(p, pc, b); /* get name for 'b' */
                    break;
                }
            case OCi.OP_GETTABUP:
            case OCi.OP_GETTABLE:
                {
                    var k = i.C; /* key index */
                    var t = i.B; /* table index */
                    var vn = i.opcode === OCi.OP_GETTABLE ? lfunc.luaF_getlocalname(p, t + 1, pc) : upvalname(p, t);
                    r.name = kname(p, pc, k).name;
                    r.funcname = vn && luastring_eq(vn, llex.LUA_ENV) ? to_luastring("global", true) : to_luastring("field", true);
                    return r;
                }
            case OCi.OP_GETUPVAL:
                {
                    r.name = upvalname(p, i.B);
                    r.funcname = to_luastring("upvalue", true);
                    return r;
                }
            case OCi.OP_LOADK:
            case OCi.OP_LOADKX:
                {
                    var _b2 = i.opcode === OCi.OP_LOADK ? i.Bx : p.code[pc + 1].Ax;
                    if (p.k[_b2].ttisstring()) {
                        r.name = p.k[_b2].svalue();
                        r.funcname = to_luastring("constant", true);
                        return r;
                    }
                    break;
                }
            case OCi.OP_SELF:
                {
                    var _k = i.C;
                    r.name = kname(p, pc, _k).name;
                    r.funcname = to_luastring("method", true);
                    return r;
                }
            default:
                break;
        }
    }

    return null;
};

/*
** Try to find a name for a function based on the code that called it.
** (Only works when function was called by a Lua function.)
** Returns what the name is (e.g., "for iterator", "method",
** "metamethod") and sets '*name' to point to the name.
*/
var funcnamefromcode = function funcnamefromcode(L, ci) {
    var r = {
        name: null,
        funcname: null
    };

    var tm = 0; /* (initial value avoids warnings) */
    var p = ci.func.value.p; /* calling function */
    var pc = currentpc(ci); /* calling instruction index */
    var i = p.code[pc]; /* calling instruction */
    var OCi = lopcodes.OpCodesI;

    if (ci.callstatus & lstate.CIST_HOOKED) {
        r.name = to_luastring("?", true);
        r.funcname = to_luastring("hook", true);
        return r;
    }

    switch (i.opcode) {
        case OCi.OP_CALL:
        case OCi.OP_TAILCALL:
            return getobjname(p, pc, i.A); /* get function name */
        case OCi.OP_TFORCALL:
            r.name = to_luastring("for iterator", true);
            r.funcname = to_luastring("for iterator", true);
            return r;
        /* other instructions can do calls through metamethods */
        case OCi.OP_SELF:
        case OCi.OP_GETTABUP:
        case OCi.OP_GETTABLE:
            tm = ltm.TMS.TM_INDEX;
            break;
        case OCi.OP_SETTABUP:
        case OCi.OP_SETTABLE:
            tm = ltm.TMS.TM_NEWINDEX;
            break;
        case OCi.OP_ADD:
            tm = ltm.TMS.TM_ADD;break;
        case OCi.OP_SUB:
            tm = ltm.TMS.TM_SUB;break;
        case OCi.OP_MUL:
            tm = ltm.TMS.TM_MUL;break;
        case OCi.OP_MOD:
            tm = ltm.TMS.TM_MOD;break;
        case OCi.OP_POW:
            tm = ltm.TMS.TM_POW;break;
        case OCi.OP_DIV:
            tm = ltm.TMS.TM_DIV;break;
        case OCi.OP_IDIV:
            tm = ltm.TMS.TM_IDIV;break;
        case OCi.OP_BAND:
            tm = ltm.TMS.TM_BAND;break;
        case OCi.OP_BOR:
            tm = ltm.TMS.TM_BOR;break;
        case OCi.OP_BXOR:
            tm = ltm.TMS.TM_BXOR;break;
        case OCi.OP_SHL:
            tm = ltm.TMS.TM_SHL;break;
        case OCi.OP_SHR:
            tm = ltm.TMS.TM_SHR;break;
        case OCi.OP_UNM:
            tm = ltm.TMS.TM_UNM;break;
        case OCi.OP_BNOT:
            tm = ltm.TMS.TM_BNOT;break;
        case OCi.OP_LEN:
            tm = ltm.TMS.TM_LEN;break;
        case OCi.OP_CONCAT:
            tm = ltm.TMS.TM_CONCAT;break;
        case OCi.OP_EQ:
            tm = ltm.TMS.TM_EQ;break;
        case OCi.OP_LT:
            tm = ltm.TMS.TM_LT;break;
        case OCi.OP_LE:
            tm = ltm.TMS.TM_LE;break;
        default:
            return null; /* cannot find a reasonable name */
    }

    r.name = L.l_G.tmname[tm].getstr();
    r.funcname = to_luastring("metamethod", true);
    return r;
};

var isinstack = function isinstack(L, ci, o) {
    for (var i = ci.l_base; i < ci.top; i++) {
        if (L.stack[i] === o) return i;
    }

    return false;
};

/*
** Checks whether value 'o' came from an upvalue. (That can only happen
** with instructions OP_GETTABUP/OP_SETTABUP, which operate directly on
** upvalues.)
*/
var getupvalname = function getupvalname(L, ci, o) {
    var c = ci.func.value;
    for (var i = 0; i < c.nupvalues; i++) {
        if (c.upvals[i] === o) {
            return {
                name: upvalname(c.p, i),
                funcname: to_luastring('upvalue', true)
            };
        }
    }

    return null;
};

var varinfo = function varinfo(L, o) {
    var ci = L.ci;
    var kind = null;
    if (ci.callstatus & lstate.CIST_LUA) {
        kind = getupvalname(L, ci, o); /* check whether 'o' is an upvalue */
        var stkid = isinstack(L, ci, o);
        if (!kind && stkid) /* no? try a register */
            kind = getobjname(ci.func.value.p, currentpc(ci), stkid - ci.l_base);
    }

    return kind ? lobject.luaO_pushfstring(L, to_luastring(" (%s '%s')", true), kind.funcname, kind.name) : to_luastring("", true);
};

var luaG_typeerror = function luaG_typeerror(L, o, op) {
    var t = ltm.luaT_objtypename(L, o);
    luaG_runerror(L, to_luastring("attempt to %s a %s value%s", true), op, t, varinfo(L, o));
};

var luaG_concaterror = function luaG_concaterror(L, p1, p2) {
    if (p1.ttisstring() || lvm.cvt2str(p1)) p1 = p2;
    luaG_typeerror(L, p1, to_luastring('concatenate', true));
};

/*
** Error when both values are convertible to numbers, but not to integers
*/
var luaG_opinterror = function luaG_opinterror(L, p1, p2, msg) {
    if (lvm.tonumber(p1) === false) p2 = p1;
    luaG_typeerror(L, p2, msg);
};

var luaG_ordererror = function luaG_ordererror(L, p1, p2) {
    var t1 = ltm.luaT_objtypename(L, p1);
    var t2 = ltm.luaT_objtypename(L, p2);
    if (luastring_eq(t1, t2)) luaG_runerror(L, to_luastring("attempt to compare two %s values", true), t1);else luaG_runerror(L, to_luastring("attempt to compare %s with %s", true), t1, t2);
};

/* add src:line information to 'msg' */
var luaG_addinfo = function luaG_addinfo(L, msg, src, line) {
    var buff = void 0;
    if (src) buff = lobject.luaO_chunkid(src.getstr(), LUA_IDSIZE);else buff = to_luastring("?", true);

    return lobject.luaO_pushfstring(L, to_luastring("%s:%d: %s", true), buff, line, msg);
};

var luaG_runerror = function luaG_runerror(L, fmt) {
    var ci = L.ci;

    for (var _len = arguments.length, argp = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        argp[_key - 2] = arguments[_key];
    }

    var msg = lobject.luaO_pushvfstring(L, fmt, argp);
    if (ci.callstatus & lstate.CIST_LUA) /* if Lua function, add source:line information */
        luaG_addinfo(L, msg, ci.func.value.p.source, currentline(ci));
    luaG_errormsg(L);
};

var luaG_errormsg = function luaG_errormsg(L) {
    if (L.errfunc !== 0) {
        /* is there an error handling function? */
        var errfunc = L.errfunc;
        lobject.pushobj2s(L, L.stack[L.top - 1]); /* move argument */
        lobject.setobjs2s(L, L.top - 2, errfunc); /* push function */
        ldo.luaD_callnoyield(L, L.top - 2, 1);
    }

    ldo.luaD_throw(L, LUA_ERRRUN);
};

/*
** Error when both values are convertible to numbers, but not to integers
*/
var luaG_tointerror = function luaG_tointerror(L, p1, p2) {
    var temp = lvm.tointeger(p1);
    if (temp === false) p2 = p1;
    luaG_runerror(L, to_luastring("number%s has no integer representation", true), varinfo(L, p2));
};

var luaG_traceexec = function luaG_traceexec(L) {
    var ci = L.ci;
    var mask = L.hookmask;
    var counthook = --L.hookcount === 0 && mask & LUA_MASKCOUNT;
    if (counthook) L.hookcount = L.basehookcount; /* reset count */
    else if (!(mask & LUA_MASKLINE)) return; /* no line hook and count != 0; nothing to be done */
    if (ci.callstatus & lstate.CIST_HOOKYIELD) {
        /* called hook last time? */
        ci.callstatus &= ~lstate.CIST_HOOKYIELD; /* erase mark */
        return; /* do not call hook again (VM yielded, so it did not move) */
    }
    if (counthook) ldo.luaD_hook(L, LUA_HOOKCOUNT, -1); /* call count hook */
    if (mask & LUA_MASKLINE) {
        var p = ci.func.value.p;
        var npc = ci.l_savedpc - 1; // pcRel(ci.u.l.savedpc, p);
        var newline = p.lineinfo.length !== 0 ? p.lineinfo[npc] : -1;
        if (npc === 0 || /* call linehook when enter a new function, */
        ci.l_savedpc <= L.oldpc || /* when jump back (loop), or when */
        newline !== (p.lineinfo.length !== 0 ? p.lineinfo[L.oldpc - 1] : -1)) /* enter a new line */
            ldo.luaD_hook(L, LUA_HOOKLINE, newline); /* call line hook */
    }
    L.oldpc = ci.l_savedpc;
    if (L.status === LUA_YIELD) {
        /* did hook yield? */
        if (counthook) L.hookcount = 1; /* undo decrement to zero */
        ci.l_savedpc--; /* undo increment (resume will increment it again) */
        ci.callstatus |= lstate.CIST_HOOKYIELD; /* mark that it yielded */
        ci.funcOff = L.top - 1; /* protect stack below results */
        ci.func = L.stack[ci.funcOff];
        ldo.luaD_throw(L, LUA_YIELD);
    }
};

module.exports.luaG_addinfo = luaG_addinfo;
module.exports.luaG_concaterror = luaG_concaterror;
module.exports.luaG_errormsg = luaG_errormsg;
module.exports.luaG_opinterror = luaG_opinterror;
module.exports.luaG_ordererror = luaG_ordererror;
module.exports.luaG_runerror = luaG_runerror;
module.exports.luaG_tointerror = luaG_tointerror;
module.exports.luaG_traceexec = luaG_traceexec;
module.exports.luaG_typeerror = luaG_typeerror;
module.exports.lua_gethook = lua_gethook;
module.exports.lua_gethookcount = lua_gethookcount;
module.exports.lua_gethookmask = lua_gethookmask;
module.exports.lua_getinfo = lua_getinfo;
module.exports.lua_getlocal = lua_getlocal;
module.exports.lua_getstack = lua_getstack;
module.exports.lua_sethook = lua_sethook;
module.exports.lua_setlocal = lua_setlocal;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_MINSTACK = _require.LUA_MINSTACK,
    LUA_RIDX_GLOBALS = _require.LUA_RIDX_GLOBALS,
    LUA_RIDX_MAINTHREAD = _require.LUA_RIDX_MAINTHREAD,
    _require$constant_typ = _require.constant_types,
    LUA_NUMTAGS = _require$constant_typ.LUA_NUMTAGS,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TTHREAD = _require$constant_typ.LUA_TTHREAD,
    LUA_OK = _require.thread_status.LUA_OK;

var lobject = __webpack_require__(5);
var ldo = __webpack_require__(7);
var lapi = __webpack_require__(17);
var ltable = __webpack_require__(8);
var ltm = __webpack_require__(13);

var EXTRA_STACK = 5;

var BASIC_STACK_SIZE = 2 * LUA_MINSTACK;

var CallInfo = function CallInfo() {
    _classCallCheck(this, CallInfo);

    this.func = null;
    this.funcOff = NaN;
    this.top = NaN;
    this.previous = null;
    this.next = null;

    /* only for Lua functions */
    this.l_base = NaN; /* base for this function */
    this.l_code = null; /* reference to this.func.p.code */
    this.l_savedpc = NaN; /* offset into l_code */
    /* only for JS functions */
    this.c_k = null; /* continuation in case of yields */
    this.c_old_errfunc = null;
    this.c_ctx = null; /* context info. in case of yields */

    this.nresults = NaN;
    this.callstatus = NaN;
};

var lua_State = function lua_State(g) {
    _classCallCheck(this, lua_State);

    this.id = g.id_counter++;

    this.base_ci = new CallInfo(); /* CallInfo for first level (C calling Lua) */
    this.top = NaN; /* first free slot in the stack */
    this.stack_last = NaN; /* last free slot in the stack */
    this.oldpc = NaN; /* last pc traced */

    /* preinit_thread */
    this.l_G = g;
    this.stack = null;
    this.ci = null;
    this.errorJmp = null;
    this.nCcalls = 0;
    this.hook = null;
    this.hookmask = 0;
    this.basehookcount = 0;
    this.allowhook = 1;
    this.hookcount = this.basehookcount;
    this.nny = 1;
    this.status = LUA_OK;
    this.errfunc = 0;
};

var global_State = function global_State() {
    _classCallCheck(this, global_State);

    this.id_counter = 1; /* used to give objects unique ids */
    this.ids = new WeakMap();

    this.mainthread = null;
    this.l_registry = new lobject.TValue(LUA_TNIL, null);
    this.panic = null;
    this.atnativeerror = null;
    this.version = null;
    this.tmname = new Array(ltm.TMS.TM_N);
    this.mt = new Array(LUA_NUMTAGS);
};

var luaE_extendCI = function luaE_extendCI(L) {
    var ci = new CallInfo();
    L.ci.next = ci;
    ci.previous = L.ci;
    ci.next = null;
    L.ci = ci;
    return ci;
};

var luaE_freeCI = function luaE_freeCI(L) {
    var ci = L.ci;
    ci.next = null;
};

var stack_init = function stack_init(L1, L) {
    L1.stack = new Array(BASIC_STACK_SIZE);
    L1.top = 0;
    L1.stack_last = BASIC_STACK_SIZE - EXTRA_STACK;
    /* initialize first ci */
    var ci = L1.base_ci;
    ci.next = ci.previous = null;
    ci.callstatus = 0;
    ci.funcOff = L1.top;
    ci.func = L1.stack[L1.top];
    L1.stack[L1.top++] = new lobject.TValue(LUA_TNIL, null);
    ci.top = L1.top + LUA_MINSTACK;
    L1.ci = ci;
};

var freestack = function freestack(L) {
    L.ci = L.base_ci;
    luaE_freeCI(L);
    L.stack = null;
};

/*
** Create registry table and its predefined values
*/
var init_registry = function init_registry(L, g) {
    var registry = ltable.luaH_new(L);
    g.l_registry.sethvalue(registry);
    ltable.luaH_setint(registry, LUA_RIDX_MAINTHREAD, new lobject.TValue(LUA_TTHREAD, L));
    ltable.luaH_setint(registry, LUA_RIDX_GLOBALS, new lobject.TValue(LUA_TTABLE, ltable.luaH_new(L)));
};

/*
** open parts of the state that may cause memory-allocation errors.
** ('g->version' !== NULL flags that the state was completely build)
*/
var f_luaopen = function f_luaopen(L) {
    var g = L.l_G;
    stack_init(L, L);
    init_registry(L, g);
    ltm.luaT_init(L);
    g.version = lapi.lua_version(null);
};

var lua_newthread = function lua_newthread(L) {
    var g = L.l_G;
    var L1 = new lua_State(g);
    L.stack[L.top] = new lobject.TValue(LUA_TTHREAD, L1);
    lapi.api_incr_top(L);
    L1.hookmask = L.hookmask;
    L1.basehookcount = L.basehookcount;
    L1.hook = L.hook;
    L1.hookcount = L1.basehookcount;
    stack_init(L1, L);
    return L1;
};

var luaE_freethread = function luaE_freethread(L, L1) {
    freestack(L1);
};

var lua_newstate = function lua_newstate() {
    var g = new global_State();
    var L = new lua_State(g);
    g.mainthread = L;

    if (ldo.luaD_rawrunprotected(L, f_luaopen, null) !== LUA_OK) {
        L = null;
    }

    return L;
};

var close_state = function close_state(L) {
    freestack(L);
};

var lua_close = function lua_close(L) {
    L = L.l_G.mainthread; /* only the main thread can be closed */
    close_state(L);
};

module.exports.lua_State = lua_State;
module.exports.CallInfo = CallInfo;
module.exports.CIST_OAH = 1 << 0; /* original value of 'allowhook' */
module.exports.CIST_LUA = 1 << 1; /* call is running a Lua function */
module.exports.CIST_HOOKED = 1 << 2; /* call is running a debug hook */
module.exports.CIST_FRESH = 1 << 3; /* call is running on a fresh invocation of luaV_execute */
module.exports.CIST_YPCALL = 1 << 4; /* call is a yieldable protected call */
module.exports.CIST_TAIL = 1 << 5; /* call was tail called */
module.exports.CIST_HOOKYIELD = 1 << 6; /* last hook called yielded */
module.exports.CIST_LEQ = 1 << 7; /* using __lt for __le */
module.exports.CIST_FIN = 1 << 8; /* call is running a finalizer */
module.exports.EXTRA_STACK = EXTRA_STACK;
module.exports.lua_close = lua_close;
module.exports.lua_newstate = lua_newstate;
module.exports.lua_newthread = lua_newthread;
module.exports.luaE_extendCI = luaE_extendCI;
module.exports.luaE_freeCI = luaE_freeCI;
module.exports.luaE_freethread = luaE_freethread;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_TNIL = _require.constant_types.LUA_TNIL;

var lobject = __webpack_require__(5);

var Proto = function Proto(L) {
    _classCallCheck(this, Proto);

    this.id = L.l_G.id_counter++;
    this.k = []; // constants used by the function
    this.p = []; // functions defined inside the function
    this.code = []; // opcodes
    this.cache = null; // last-created closure with this prototype
    this.lineinfo = []; // map from opcodes to source lines (debug information)
    this.upvalues = []; // upvalue information
    this.numparams = 0; // number of fixed parameters
    this.is_vararg = false;
    this.maxstacksize = 0; // number of registers needed by this function
    this.locvars = []; // information about local variables (debug information)
    this.linedefined = 0; // debug information
    this.lastlinedefined = 0; // debug information
    this.source = null; // used for debug information
};

var luaF_newLclosure = function luaF_newLclosure(L, n) {
    return new lobject.LClosure(L, n);
};

var luaF_findupval = function luaF_findupval(L, level) {
    return L.stack[level];
};

var luaF_close = function luaF_close(L, level) {
    /* Create new TValues on stack;
     * any closures will keep referencing old TValues */
    for (var i = level; i < L.top; i++) {
        var old = L.stack[i];
        L.stack[i] = new lobject.TValue(old.type, old.value);
    }
};

/*
** fill a closure with new upvalues
*/
var luaF_initupvals = function luaF_initupvals(L, cl) {
    for (var i = 0; i < cl.nupvalues; i++) {
        cl.upvals[i] = new lobject.TValue(LUA_TNIL, null);
    }
};

/*
** Look for n-th local variable at line 'line' in function 'func'.
** Returns null if not found.
*/
var luaF_getlocalname = function luaF_getlocalname(f, local_number, pc) {
    for (var i = 0; i < f.locvars.length && f.locvars[i].startpc <= pc; i++) {
        if (pc < f.locvars[i].endpc) {
            /* is variable active? */
            local_number--;
            if (local_number === 0) return f.locvars[i].varname.getstr();
        }
    }
    return null; /* not found */
};

module.exports.MAXUPVAL = 255;
module.exports.Proto = Proto;
module.exports.luaF_findupval = luaF_findupval;
module.exports.luaF_close = luaF_close;
module.exports.luaF_getlocalname = luaF_getlocalname;
module.exports.luaF_initupvals = luaF_initupvals;
module.exports.luaF_newLclosure = luaF_newLclosure;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    _require$constant_typ = _require.constant_types,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TUSERDATA = _require$constant_typ.LUA_TUSERDATA,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    lua_assert = _require2.lua_assert;

var lobject = __webpack_require__(5);
var ldo = __webpack_require__(7);
var lstate = __webpack_require__(11);

var _require3 = __webpack_require__(9),
    luaS_bless = _require3.luaS_bless,
    luaS_new = _require3.luaS_new;

var ltable = __webpack_require__(8);
var ldebug = __webpack_require__(10);
var lvm = __webpack_require__(14);

var luaT_typenames_ = ["no value", "nil", "boolean", "userdata", "number", "string", "table", "function", "userdata", "thread", "proto" /* this last case is used for tests only */
].map(function (e) {
    return to_luastring(e);
});

var ttypename = function ttypename(t) {
    return luaT_typenames_[t + 1];
};

/*
* WARNING: if you change the order of this enumeration,
* grep "ORDER TM" and "ORDER OP"
*/
var TMS = {
    TM_INDEX: 0,
    TM_NEWINDEX: 1,
    TM_GC: 2,
    TM_MODE: 3,
    TM_LEN: 4,
    TM_EQ: 5, /* last tag method with fast access */
    TM_ADD: 6,
    TM_SUB: 7,
    TM_MUL: 8,
    TM_MOD: 9,
    TM_POW: 10,
    TM_DIV: 11,
    TM_IDIV: 12,
    TM_BAND: 13,
    TM_BOR: 14,
    TM_BXOR: 15,
    TM_SHL: 16,
    TM_SHR: 17,
    TM_UNM: 18,
    TM_BNOT: 19,
    TM_LT: 20,
    TM_LE: 21,
    TM_CONCAT: 22,
    TM_CALL: 23,
    TM_N: 24 /* number of elements in the enum */
};

var luaT_init = function luaT_init(L) {
    L.l_G.tmname[TMS.TM_INDEX] = new luaS_new(L, to_luastring("__index", true));
    L.l_G.tmname[TMS.TM_NEWINDEX] = new luaS_new(L, to_luastring("__newindex", true));
    L.l_G.tmname[TMS.TM_GC] = new luaS_new(L, to_luastring("__gc", true));
    L.l_G.tmname[TMS.TM_MODE] = new luaS_new(L, to_luastring("__mode", true));
    L.l_G.tmname[TMS.TM_LEN] = new luaS_new(L, to_luastring("__len", true));
    L.l_G.tmname[TMS.TM_EQ] = new luaS_new(L, to_luastring("__eq", true));
    L.l_G.tmname[TMS.TM_ADD] = new luaS_new(L, to_luastring("__add", true));
    L.l_G.tmname[TMS.TM_SUB] = new luaS_new(L, to_luastring("__sub", true));
    L.l_G.tmname[TMS.TM_MUL] = new luaS_new(L, to_luastring("__mul", true));
    L.l_G.tmname[TMS.TM_MOD] = new luaS_new(L, to_luastring("__mod", true));
    L.l_G.tmname[TMS.TM_POW] = new luaS_new(L, to_luastring("__pow", true));
    L.l_G.tmname[TMS.TM_DIV] = new luaS_new(L, to_luastring("__div", true));
    L.l_G.tmname[TMS.TM_IDIV] = new luaS_new(L, to_luastring("__idiv", true));
    L.l_G.tmname[TMS.TM_BAND] = new luaS_new(L, to_luastring("__band", true));
    L.l_G.tmname[TMS.TM_BOR] = new luaS_new(L, to_luastring("__bor", true));
    L.l_G.tmname[TMS.TM_BXOR] = new luaS_new(L, to_luastring("__bxor", true));
    L.l_G.tmname[TMS.TM_SHL] = new luaS_new(L, to_luastring("__shl", true));
    L.l_G.tmname[TMS.TM_SHR] = new luaS_new(L, to_luastring("__shr", true));
    L.l_G.tmname[TMS.TM_UNM] = new luaS_new(L, to_luastring("__unm", true));
    L.l_G.tmname[TMS.TM_BNOT] = new luaS_new(L, to_luastring("__bnot", true));
    L.l_G.tmname[TMS.TM_LT] = new luaS_new(L, to_luastring("__lt", true));
    L.l_G.tmname[TMS.TM_LE] = new luaS_new(L, to_luastring("__le", true));
    L.l_G.tmname[TMS.TM_CONCAT] = new luaS_new(L, to_luastring("__concat", true));
    L.l_G.tmname[TMS.TM_CALL] = new luaS_new(L, to_luastring("__call", true));
};

/*
** Return the name of the type of an object. For tables and userdata
** with metatable, use their '__name' metafield, if present.
*/
var __name = to_luastring('__name', true);
var luaT_objtypename = function luaT_objtypename(L, o) {
    var mt = void 0;
    if (o.ttistable() && (mt = o.value.metatable) !== null || o.ttisfulluserdata() && (mt = o.value.metatable) !== null) {
        var name = ltable.luaH_getstr(mt, luaS_bless(L, __name));
        if (name.ttisstring()) return name.svalue();
    }
    return ttypename(o.ttnov());
};

var luaT_callTM = function luaT_callTM(L, f, p1, p2, p3, hasres) {
    var func = L.top;

    lobject.pushobj2s(L, f); /* push function (assume EXTRA_STACK) */
    lobject.pushobj2s(L, p1); /* 1st argument */
    lobject.pushobj2s(L, p2); /* 2nd argument */

    if (!hasres) /* no result? 'p3' is third argument */
        lobject.pushobj2s(L, p3); /* 3rd argument */

    if (L.ci.callstatus & lstate.CIST_LUA) ldo.luaD_call(L, func, hasres);else ldo.luaD_callnoyield(L, func, hasres);

    if (hasres) {
        /* if has result, move it to its place */
        var tv = L.stack[L.top - 1];
        delete L.stack[--L.top];
        p3.setfrom(tv);
    }
};

var luaT_callbinTM = function luaT_callbinTM(L, p1, p2, res, event) {
    var tm = luaT_gettmbyobj(L, p1, event);
    if (tm.ttisnil()) tm = luaT_gettmbyobj(L, p2, event);
    if (tm.ttisnil()) return false;
    luaT_callTM(L, tm, p1, p2, res, 1);
    return true;
};

var luaT_trybinTM = function luaT_trybinTM(L, p1, p2, res, event) {
    if (!luaT_callbinTM(L, p1, p2, res, event)) {
        switch (event) {
            case TMS.TM_CONCAT:
                return ldebug.luaG_concaterror(L, p1, p2);
            case TMS.TM_BAND:case TMS.TM_BOR:case TMS.TM_BXOR:
            case TMS.TM_SHL:case TMS.TM_SHR:case TMS.TM_BNOT:
                {
                    var n1 = lvm.tonumber(p1);
                    var n2 = lvm.tonumber(p2);
                    if (n1 !== false && n2 !== false) return ldebug.luaG_tointerror(L, p1, p2);else return ldebug.luaG_opinterror(L, p1, p2, to_luastring("perform bitwise operation on", true));
                }
            default:
                return ldebug.luaG_opinterror(L, p1, p2, to_luastring("perform arithmetic on", true));
        }
    }
};

var luaT_callorderTM = function luaT_callorderTM(L, p1, p2, event) {
    var res = new lobject.TValue();
    if (!luaT_callbinTM(L, p1, p2, res, event)) return null;else return !res.l_isfalse();
};

var fasttm = function fasttm(l, et, e) {
    return et === null ? null : et.flags & 1 << e ? null : luaT_gettm(et, e, l.l_G.tmname[e]);
};

var luaT_gettm = function luaT_gettm(events, event, ename) {
    var tm = ltable.luaH_getstr(events, ename);
    lua_assert(event <= TMS.TM_EQ);
    if (tm.ttisnil()) {
        /* no tag method? */
        events.flags |= 1 << event; /* cache this fact */
        return null;
    } else return tm;
};

var luaT_gettmbyobj = function luaT_gettmbyobj(L, o, event) {
    var mt = void 0;
    switch (o.ttnov()) {
        case LUA_TTABLE:
        case LUA_TUSERDATA:
            mt = o.value.metatable;
            break;
        default:
            mt = L.l_G.mt[o.ttnov()];
    }

    return mt ? ltable.luaH_getstr(mt, L.l_G.tmname[event]) : lobject.luaO_nilobject;
};

module.exports.fasttm = fasttm;
module.exports.TMS = TMS;
module.exports.luaT_callTM = luaT_callTM;
module.exports.luaT_callbinTM = luaT_callbinTM;
module.exports.luaT_trybinTM = luaT_trybinTM;
module.exports.luaT_callorderTM = luaT_callorderTM;
module.exports.luaT_gettm = luaT_gettm;
module.exports.luaT_gettmbyobj = luaT_gettmbyobj;
module.exports.luaT_init = luaT_init;
module.exports.luaT_objtypename = luaT_objtypename;
module.exports.ttypename = ttypename;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    LUA_MASKLINE = _require.LUA_MASKLINE,
    LUA_MASKCOUNT = _require.LUA_MASKCOUNT,
    LUA_MULTRET = _require.LUA_MULTRET,
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TLCF = _require$constant_typ.LUA_TLCF,
    LUA_TLIGHTUSERDATA = _require$constant_typ.LUA_TLIGHTUSERDATA,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMBER = _require$constant_typ.LUA_TNUMBER,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TUSERDATA = _require$constant_typ.LUA_TUSERDATA,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(15),
    INDEXK = _require2.INDEXK,
    ISK = _require2.ISK,
    LFIELDS_PER_FLUSH = _require2.LFIELDS_PER_FLUSH,
    _require2$OpCodesI = _require2.OpCodesI,
    OP_ADD = _require2$OpCodesI.OP_ADD,
    OP_BAND = _require2$OpCodesI.OP_BAND,
    OP_BNOT = _require2$OpCodesI.OP_BNOT,
    OP_BOR = _require2$OpCodesI.OP_BOR,
    OP_BXOR = _require2$OpCodesI.OP_BXOR,
    OP_CALL = _require2$OpCodesI.OP_CALL,
    OP_CLOSURE = _require2$OpCodesI.OP_CLOSURE,
    OP_CONCAT = _require2$OpCodesI.OP_CONCAT,
    OP_DIV = _require2$OpCodesI.OP_DIV,
    OP_EQ = _require2$OpCodesI.OP_EQ,
    OP_EXTRAARG = _require2$OpCodesI.OP_EXTRAARG,
    OP_FORLOOP = _require2$OpCodesI.OP_FORLOOP,
    OP_FORPREP = _require2$OpCodesI.OP_FORPREP,
    OP_GETTABLE = _require2$OpCodesI.OP_GETTABLE,
    OP_GETTABUP = _require2$OpCodesI.OP_GETTABUP,
    OP_GETUPVAL = _require2$OpCodesI.OP_GETUPVAL,
    OP_IDIV = _require2$OpCodesI.OP_IDIV,
    OP_JMP = _require2$OpCodesI.OP_JMP,
    OP_LE = _require2$OpCodesI.OP_LE,
    OP_LEN = _require2$OpCodesI.OP_LEN,
    OP_LOADBOOL = _require2$OpCodesI.OP_LOADBOOL,
    OP_LOADK = _require2$OpCodesI.OP_LOADK,
    OP_LOADKX = _require2$OpCodesI.OP_LOADKX,
    OP_LOADNIL = _require2$OpCodesI.OP_LOADNIL,
    OP_LT = _require2$OpCodesI.OP_LT,
    OP_MOD = _require2$OpCodesI.OP_MOD,
    OP_MOVE = _require2$OpCodesI.OP_MOVE,
    OP_MUL = _require2$OpCodesI.OP_MUL,
    OP_NEWTABLE = _require2$OpCodesI.OP_NEWTABLE,
    OP_NOT = _require2$OpCodesI.OP_NOT,
    OP_POW = _require2$OpCodesI.OP_POW,
    OP_RETURN = _require2$OpCodesI.OP_RETURN,
    OP_SELF = _require2$OpCodesI.OP_SELF,
    OP_SETLIST = _require2$OpCodesI.OP_SETLIST,
    OP_SETTABLE = _require2$OpCodesI.OP_SETTABLE,
    OP_SETTABUP = _require2$OpCodesI.OP_SETTABUP,
    OP_SETUPVAL = _require2$OpCodesI.OP_SETUPVAL,
    OP_SHL = _require2$OpCodesI.OP_SHL,
    OP_SHR = _require2$OpCodesI.OP_SHR,
    OP_SUB = _require2$OpCodesI.OP_SUB,
    OP_TAILCALL = _require2$OpCodesI.OP_TAILCALL,
    OP_TEST = _require2$OpCodesI.OP_TEST,
    OP_TESTSET = _require2$OpCodesI.OP_TESTSET,
    OP_TFORCALL = _require2$OpCodesI.OP_TFORCALL,
    OP_TFORLOOP = _require2$OpCodesI.OP_TFORLOOP,
    OP_UNM = _require2$OpCodesI.OP_UNM,
    OP_VARARG = _require2$OpCodesI.OP_VARARG;

var _require3 = __webpack_require__(4),
    LUA_MAXINTEGER = _require3.LUA_MAXINTEGER,
    LUA_MININTEGER = _require3.LUA_MININTEGER,
    lua_numbertointeger = _require3.lua_numbertointeger;

var _require4 = __webpack_require__(2),
    lua_assert = _require4.lua_assert,
    luai_nummod = _require4.luai_nummod;

var lobject = __webpack_require__(5);
var lfunc = __webpack_require__(12);
var lstate = __webpack_require__(11);

var _require5 = __webpack_require__(9),
    luaS_bless = _require5.luaS_bless,
    luaS_eqlngstr = _require5.luaS_eqlngstr,
    luaS_hashlongstr = _require5.luaS_hashlongstr;

var ldo = __webpack_require__(7);
var ltm = __webpack_require__(13);
var ltable = __webpack_require__(8);
var ldebug = __webpack_require__(10);

/*
** finish execution of an opcode interrupted by an yield
*/
var luaV_finishOp = function luaV_finishOp(L) {
    var ci = L.ci;
    var base = ci.l_base;
    var inst = ci.l_code[ci.l_savedpc - 1]; /* interrupted instruction */
    var op = inst.opcode;

    switch (op) {/* finish its execution */
        case OP_ADD:case OP_SUB:case OP_MUL:case OP_DIV:case OP_IDIV:
        case OP_BAND:case OP_BOR:case OP_BXOR:case OP_SHL:case OP_SHR:
        case OP_MOD:case OP_POW:
        case OP_UNM:case OP_BNOT:case OP_LEN:
        case OP_GETTABUP:case OP_GETTABLE:case OP_SELF:
            {
                lobject.setobjs2s(L, base + inst.A, L.top - 1);
                delete L.stack[--L.top];
                break;
            }
        case OP_LE:case OP_LT:case OP_EQ:
            {
                var res = !L.stack[L.top - 1].l_isfalse();
                delete L.stack[--L.top];
                if (ci.callstatus & lstate.CIST_LEQ) {
                    /* "<=" using "<" instead? */
                    lua_assert(op === OP_LE);
                    ci.callstatus ^= lstate.CIST_LEQ; /* clear mark */
                    res = !res; /* negate result */
                }
                lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_JMP);
                if (res !== (inst.A ? true : false)) /* condition failed? */
                    ci.l_savedpc++; /* skip jump instruction */
                break;
            }
        case OP_CONCAT:
            {
                var top = L.top - 1; /* top when 'luaT_trybinTM' was called */
                var b = inst.B; /* first element to concatenate */
                var total = top - 1 - (base + b); /* yet to concatenate */
                lobject.setobjs2s(L, top - 2, top); /* put TM result in proper position */
                if (total > 1) {
                    /* are there elements to concat? */
                    L.top = top - 1; /* top is one after last element (at top-2) */
                    luaV_concat(L, total); /* concat them (may yield again) */
                }
                /* move final result to final position */
                lobject.setobjs2s(L, ci.l_base + inst.A, L.top - 1);
                ldo.adjust_top(L, ci.top); /* restore top */
                break;
            }
        case OP_TFORCALL:
            {
                lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_TFORLOOP);
                ldo.adjust_top(L, ci.top); /* correct top */
                break;
            }
        case OP_CALL:
            {
                if (inst.C - 1 >= 0) /* nresults >= 0? */
                    ldo.adjust_top(L, ci.top); /* adjust results */
                break;
            }
    }
};

var RA = function RA(L, base, i) {
    return base + i.A;
};

var RB = function RB(L, base, i) {
    return base + i.B;
};

// const RC = function(L, base, i) {
//     return base + i.C;
// };

var RKB = function RKB(L, base, k, i) {
    return ISK(i.B) ? k[INDEXK(i.B)] : L.stack[base + i.B];
};

var RKC = function RKC(L, base, k, i) {
    return ISK(i.C) ? k[INDEXK(i.C)] : L.stack[base + i.C];
};

var luaV_execute = function luaV_execute(L) {
    var ci = L.ci;

    ci.callstatus |= lstate.CIST_FRESH;
    newframe: for (;;) {
        lua_assert(ci === L.ci);
        var cl = ci.func.value;
        var k = cl.p.k;
        var base = ci.l_base;

        var i = ci.l_code[ci.l_savedpc++];

        if (L.hookmask & (LUA_MASKLINE | LUA_MASKCOUNT)) {
            ldebug.luaG_traceexec(L);
        }

        var ra = RA(L, base, i);
        var opcode = i.opcode;

        switch (opcode) {
            case OP_MOVE:
                {
                    lobject.setobjs2s(L, ra, RB(L, base, i));
                    break;
                }
            case OP_LOADK:
                {
                    var konst = k[i.Bx];
                    lobject.setobj2s(L, ra, konst);
                    break;
                }
            case OP_LOADKX:
                {
                    lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_EXTRAARG);
                    var _konst = k[ci.l_code[ci.l_savedpc++].Ax];
                    lobject.setobj2s(L, ra, _konst);
                    break;
                }
            case OP_LOADBOOL:
                {
                    L.stack[ra].setbvalue(i.B !== 0);

                    if (i.C !== 0) ci.l_savedpc++; /* skip next instruction (if C) */

                    break;
                }
            case OP_LOADNIL:
                {
                    for (var j = 0; j <= i.B; j++) {
                        L.stack[ra + j].setnilvalue();
                    }break;
                }
            case OP_GETUPVAL:
                {
                    var b = i.B;
                    lobject.setobj2s(L, ra, cl.upvals[b]);
                    break;
                }
            case OP_GETTABUP:
                {
                    var upval = cl.upvals[i.B];
                    var rc = RKC(L, base, k, i);
                    luaV_gettable(L, upval, rc, ra);
                    break;
                }
            case OP_GETTABLE:
                {
                    var rb = L.stack[RB(L, base, i)];
                    var _rc = RKC(L, base, k, i);
                    luaV_gettable(L, rb, _rc, ra);
                    break;
                }
            case OP_SETTABUP:
                {
                    var _upval = cl.upvals[i.A];
                    var _rb = RKB(L, base, k, i);
                    var _rc2 = RKC(L, base, k, i);
                    settable(L, _upval, _rb, _rc2);
                    break;
                }
            case OP_SETUPVAL:
                {
                    var uv = cl.upvals[i.B];
                    uv.setfrom(L.stack[ra]);
                    break;
                }
            case OP_SETTABLE:
                {
                    var table = L.stack[ra];
                    var key = RKB(L, base, k, i);
                    var v = RKC(L, base, k, i);

                    settable(L, table, key, v);
                    break;
                }
            case OP_NEWTABLE:
                {
                    L.stack[ra].sethvalue(ltable.luaH_new(L));
                    break;
                }
            case OP_SELF:
                {
                    var _rb2 = RB(L, base, i);
                    var _rc3 = RKC(L, base, k, i);
                    lobject.setobjs2s(L, ra + 1, _rb2);
                    luaV_gettable(L, L.stack[_rb2], _rc3, ra);
                    break;
                }
            case OP_ADD:
                {
                    var op1 = RKB(L, base, k, i);
                    var op2 = RKC(L, base, k, i);
                    var numberop1 = void 0,
                        numberop2 = void 0;

                    if (op1.ttisinteger() && op2.ttisinteger()) {
                        L.stack[ra].setivalue(op1.value + op2.value | 0);
                    } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
                        L.stack[ra].setfltvalue(numberop1 + numberop2);
                    } else {
                        ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_ADD);
                    }
                    break;
                }
            case OP_SUB:
                {
                    var _op = RKB(L, base, k, i);
                    var _op2 = RKC(L, base, k, i);
                    var _numberop = void 0,
                        _numberop2 = void 0;

                    if (_op.ttisinteger() && _op2.ttisinteger()) {
                        L.stack[ra].setivalue(_op.value - _op2.value | 0);
                    } else if ((_numberop = tonumber(_op)) !== false && (_numberop2 = tonumber(_op2)) !== false) {
                        L.stack[ra].setfltvalue(_numberop - _numberop2);
                    } else {
                        ltm.luaT_trybinTM(L, _op, _op2, L.stack[ra], ltm.TMS.TM_SUB);
                    }
                    break;
                }
            case OP_MUL:
                {
                    var _op3 = RKB(L, base, k, i);
                    var _op4 = RKC(L, base, k, i);
                    var _numberop3 = void 0,
                        _numberop4 = void 0;

                    if (_op3.ttisinteger() && _op4.ttisinteger()) {
                        L.stack[ra].setivalue(luaV_imul(_op3.value, _op4.value));
                    } else if ((_numberop3 = tonumber(_op3)) !== false && (_numberop4 = tonumber(_op4)) !== false) {
                        L.stack[ra].setfltvalue(_numberop3 * _numberop4);
                    } else {
                        ltm.luaT_trybinTM(L, _op3, _op4, L.stack[ra], ltm.TMS.TM_MUL);
                    }
                    break;
                }
            case OP_MOD:
                {
                    var _op5 = RKB(L, base, k, i);
                    var _op6 = RKC(L, base, k, i);
                    var _numberop5 = void 0,
                        _numberop6 = void 0;

                    if (_op5.ttisinteger() && _op6.ttisinteger()) {
                        L.stack[ra].setivalue(luaV_mod(L, _op5.value, _op6.value));
                    } else if ((_numberop5 = tonumber(_op5)) !== false && (_numberop6 = tonumber(_op6)) !== false) {
                        L.stack[ra].setfltvalue(luai_nummod(L, _numberop5, _numberop6));
                    } else {
                        ltm.luaT_trybinTM(L, _op5, _op6, L.stack[ra], ltm.TMS.TM_MOD);
                    }
                    break;
                }
            case OP_POW:
                {
                    var _op7 = RKB(L, base, k, i);
                    var _op8 = RKC(L, base, k, i);
                    var _numberop7 = void 0,
                        _numberop8 = void 0;

                    if ((_numberop7 = tonumber(_op7)) !== false && (_numberop8 = tonumber(_op8)) !== false) {
                        L.stack[ra].setfltvalue(Math.pow(_numberop7, _numberop8));
                    } else {
                        ltm.luaT_trybinTM(L, _op7, _op8, L.stack[ra], ltm.TMS.TM_POW);
                    }
                    break;
                }
            case OP_DIV:
                {
                    var _op9 = RKB(L, base, k, i);
                    var _op10 = RKC(L, base, k, i);
                    var _numberop9 = void 0,
                        _numberop10 = void 0;

                    if ((_numberop9 = tonumber(_op9)) !== false && (_numberop10 = tonumber(_op10)) !== false) {
                        L.stack[ra].setfltvalue(_numberop9 / _numberop10);
                    } else {
                        ltm.luaT_trybinTM(L, _op9, _op10, L.stack[ra], ltm.TMS.TM_DIV);
                    }
                    break;
                }
            case OP_IDIV:
                {
                    var _op11 = RKB(L, base, k, i);
                    var _op12 = RKC(L, base, k, i);
                    var _numberop11 = void 0,
                        _numberop12 = void 0;

                    if (_op11.ttisinteger() && _op12.ttisinteger()) {
                        L.stack[ra].setivalue(luaV_div(L, _op11.value, _op12.value));
                    } else if ((_numberop11 = tonumber(_op11)) !== false && (_numberop12 = tonumber(_op12)) !== false) {
                        L.stack[ra].setfltvalue(Math.floor(_numberop11 / _numberop12));
                    } else {
                        ltm.luaT_trybinTM(L, _op11, _op12, L.stack[ra], ltm.TMS.TM_IDIV);
                    }
                    break;
                }
            case OP_BAND:
                {
                    var _op13 = RKB(L, base, k, i);
                    var _op14 = RKC(L, base, k, i);
                    var _numberop13 = void 0,
                        _numberop14 = void 0;

                    if ((_numberop13 = tointeger(_op13)) !== false && (_numberop14 = tointeger(_op14)) !== false) {
                        L.stack[ra].setivalue(_numberop13 & _numberop14);
                    } else {
                        ltm.luaT_trybinTM(L, _op13, _op14, L.stack[ra], ltm.TMS.TM_BAND);
                    }
                    break;
                }
            case OP_BOR:
                {
                    var _op15 = RKB(L, base, k, i);
                    var _op16 = RKC(L, base, k, i);
                    var _numberop15 = void 0,
                        _numberop16 = void 0;

                    if ((_numberop15 = tointeger(_op15)) !== false && (_numberop16 = tointeger(_op16)) !== false) {
                        L.stack[ra].setivalue(_numberop15 | _numberop16);
                    } else {
                        ltm.luaT_trybinTM(L, _op15, _op16, L.stack[ra], ltm.TMS.TM_BOR);
                    }
                    break;
                }
            case OP_BXOR:
                {
                    var _op17 = RKB(L, base, k, i);
                    var _op18 = RKC(L, base, k, i);
                    var _numberop17 = void 0,
                        _numberop18 = void 0;

                    if ((_numberop17 = tointeger(_op17)) !== false && (_numberop18 = tointeger(_op18)) !== false) {
                        L.stack[ra].setivalue(_numberop17 ^ _numberop18);
                    } else {
                        ltm.luaT_trybinTM(L, _op17, _op18, L.stack[ra], ltm.TMS.TM_BXOR);
                    }
                    break;
                }
            case OP_SHL:
                {
                    var _op19 = RKB(L, base, k, i);
                    var _op20 = RKC(L, base, k, i);
                    var _numberop19 = void 0,
                        _numberop20 = void 0;

                    if ((_numberop19 = tointeger(_op19)) !== false && (_numberop20 = tointeger(_op20)) !== false) {
                        L.stack[ra].setivalue(luaV_shiftl(_numberop19, _numberop20));
                    } else {
                        ltm.luaT_trybinTM(L, _op19, _op20, L.stack[ra], ltm.TMS.TM_SHL);
                    }
                    break;
                }
            case OP_SHR:
                {
                    var _op21 = RKB(L, base, k, i);
                    var _op22 = RKC(L, base, k, i);
                    var _numberop21 = void 0,
                        _numberop22 = void 0;

                    if ((_numberop21 = tointeger(_op21)) !== false && (_numberop22 = tointeger(_op22)) !== false) {
                        L.stack[ra].setivalue(luaV_shiftl(_numberop21, -_numberop22));
                    } else {
                        ltm.luaT_trybinTM(L, _op21, _op22, L.stack[ra], ltm.TMS.TM_SHR);
                    }
                    break;
                }
            case OP_UNM:
                {
                    var op = L.stack[RB(L, base, i)];
                    var numberop = void 0;

                    if (op.ttisinteger()) {
                        L.stack[ra].setivalue(-op.value | 0);
                    } else if ((numberop = tonumber(op)) !== false) {
                        L.stack[ra].setfltvalue(-numberop);
                    } else {
                        ltm.luaT_trybinTM(L, op, op, L.stack[ra], ltm.TMS.TM_UNM);
                    }
                    break;
                }
            case OP_BNOT:
                {
                    var _op23 = L.stack[RB(L, base, i)];

                    if (_op23.ttisinteger()) {
                        L.stack[ra].setivalue(~_op23.value);
                    } else {
                        ltm.luaT_trybinTM(L, _op23, _op23, L.stack[ra], ltm.TMS.TM_BNOT);
                    }
                    break;
                }
            case OP_NOT:
                {
                    var _op24 = L.stack[RB(L, base, i)];
                    L.stack[ra].setbvalue(_op24.l_isfalse());
                    break;
                }
            case OP_LEN:
                {
                    luaV_objlen(L, L.stack[ra], L.stack[RB(L, base, i)]);
                    break;
                }
            case OP_CONCAT:
                {
                    var _b = i.B;
                    var c = i.C;
                    L.top = base + c + 1; /* mark the end of concat operands */
                    luaV_concat(L, c - _b + 1);
                    var _rb3 = base + _b;
                    lobject.setobjs2s(L, ra, _rb3);
                    ldo.adjust_top(L, ci.top); /* restore top */
                    break;
                }
            case OP_JMP:
                {
                    dojump(L, ci, i, 0);
                    break;
                }
            case OP_EQ:
                {
                    if (luaV_equalobj(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A) ci.l_savedpc++;else donextjump(L, ci);
                    break;
                }
            case OP_LT:
                {
                    if (luaV_lessthan(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A) ci.l_savedpc++;else donextjump(L, ci);
                    break;
                }
            case OP_LE:
                {
                    if (luaV_lessequal(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A) ci.l_savedpc++;else donextjump(L, ci);
                    break;
                }
            case OP_TEST:
                {
                    if (i.C ? L.stack[ra].l_isfalse() : !L.stack[ra].l_isfalse()) ci.l_savedpc++;else donextjump(L, ci);
                    break;
                }
            case OP_TESTSET:
                {
                    var rbIdx = RB(L, base, i);
                    var _rb4 = L.stack[rbIdx];
                    if (i.C ? _rb4.l_isfalse() : !_rb4.l_isfalse()) ci.l_savedpc++;else {
                        lobject.setobjs2s(L, ra, rbIdx);
                        donextjump(L, ci);
                    }
                    break;
                }
            case OP_CALL:
                {
                    var _b2 = i.B;
                    var nresults = i.C - 1;
                    if (_b2 !== 0) ldo.adjust_top(L, ra + _b2); /* else previous instruction set top */
                    if (ldo.luaD_precall(L, ra, nresults)) {
                        if (nresults >= 0) ldo.adjust_top(L, ci.top); /* adjust results */
                    } else {
                        ci = L.ci;
                        continue newframe;
                    }

                    break;
                }
            case OP_TAILCALL:
                {
                    var _b3 = i.B;
                    if (_b3 !== 0) ldo.adjust_top(L, ra + _b3); /* else previous instruction set top */
                    if (ldo.luaD_precall(L, ra, LUA_MULTRET)) {// JS function
                    } else {
                        /* tail call: put called frame (n) in place of caller one (o) */
                        var nci = L.ci;
                        var oci = nci.previous;
                        var nfunc = nci.func;
                        var nfuncOff = nci.funcOff;
                        var ofuncOff = oci.funcOff;
                        var lim = nci.l_base + nfunc.value.p.numparams;
                        if (cl.p.p.length > 0) lfunc.luaF_close(L, oci.l_base);
                        for (var aux = 0; nfuncOff + aux < lim; aux++) {
                            lobject.setobjs2s(L, ofuncOff + aux, nfuncOff + aux);
                        }oci.l_base = ofuncOff + (nci.l_base - nfuncOff);
                        oci.top = ofuncOff + (L.top - nfuncOff);
                        ldo.adjust_top(L, oci.top); /* correct top */
                        oci.l_code = nci.l_code;
                        oci.l_savedpc = nci.l_savedpc;
                        oci.callstatus |= lstate.CIST_TAIL;
                        oci.next = null;
                        ci = L.ci = oci;

                        lua_assert(L.top === oci.l_base + L.stack[ofuncOff].value.p.maxstacksize);

                        continue newframe;
                    }
                    break;
                }
            case OP_RETURN:
                {
                    if (cl.p.p.length > 0) lfunc.luaF_close(L, base);
                    var _b4 = ldo.luaD_poscall(L, ci, ra, i.B !== 0 ? i.B - 1 : L.top - ra);

                    if (ci.callstatus & lstate.CIST_FRESH) return; /* external invocation: return */
                    /* invocation via reentry: continue execution */
                    ci = L.ci;
                    if (_b4) ldo.adjust_top(L, ci.top);
                    lua_assert(ci.callstatus & lstate.CIST_LUA);
                    lua_assert(ci.l_code[ci.l_savedpc - 1].opcode === OP_CALL);
                    continue newframe;
                }
            case OP_FORLOOP:
                {
                    if (L.stack[ra].ttisinteger()) {
                        /* integer loop? */
                        var step = L.stack[ra + 2].value;
                        var idx = L.stack[ra].value + step | 0;
                        var limit = L.stack[ra + 1].value;

                        if (0 < step ? idx <= limit : limit <= idx) {
                            ci.l_savedpc += i.sBx;
                            L.stack[ra].chgivalue(idx); /* update internal index... */
                            L.stack[ra + 3].setivalue(idx);
                        }
                    } else {
                        /* floating loop */
                        var _step = L.stack[ra + 2].value;
                        var _idx = L.stack[ra].value + _step;
                        var _limit = L.stack[ra + 1].value;

                        if (0 < _step ? _idx <= _limit : _limit <= _idx) {
                            ci.l_savedpc += i.sBx;
                            L.stack[ra].chgfltvalue(_idx); /* update internal index... */
                            L.stack[ra + 3].setfltvalue(_idx);
                        }
                    }
                    break;
                }
            case OP_FORPREP:
                {
                    var init = L.stack[ra];
                    var plimit = L.stack[ra + 1];
                    var pstep = L.stack[ra + 2];
                    var forlim = void 0;

                    if (init.ttisinteger() && pstep.ttisinteger() && (forlim = forlimit(plimit, pstep.value))) {
                        /* all values are integer */
                        var initv = forlim.stopnow ? 0 : init.value;
                        plimit.value = forlim.ilimit;
                        init.value = initv - pstep.value | 0;
                    } else {
                        /* try making all values floats */
                        var nlimit = void 0,
                            nstep = void 0,
                            ninit = void 0;
                        if ((nlimit = tonumber(plimit)) === false) ldebug.luaG_runerror(L, to_luastring("'for' limit must be a number", true));
                        L.stack[ra + 1].setfltvalue(nlimit);
                        if ((nstep = tonumber(pstep)) === false) ldebug.luaG_runerror(L, to_luastring("'for' step must be a number", true));
                        L.stack[ra + 2].setfltvalue(nstep);
                        if ((ninit = tonumber(init)) === false) ldebug.luaG_runerror(L, to_luastring("'for' initial value must be a number", true));
                        L.stack[ra].setfltvalue(ninit - nstep);
                    }

                    ci.l_savedpc += i.sBx;
                    break;
                }
            case OP_TFORCALL:
                {
                    var cb = ra + 3; /* call base */
                    lobject.setobjs2s(L, cb + 2, ra + 2);
                    lobject.setobjs2s(L, cb + 1, ra + 1);
                    lobject.setobjs2s(L, cb, ra);
                    ldo.adjust_top(L, cb + 3); /* func. + 2 args (state and index) */
                    ldo.luaD_call(L, cb, i.C);
                    ldo.adjust_top(L, ci.top);
                    /* go straight to OP_TFORLOOP */
                    i = ci.l_code[ci.l_savedpc++];
                    ra = RA(L, base, i);
                    lua_assert(i.opcode === OP_TFORLOOP);
                }
            /* fall through */
            case OP_TFORLOOP:
                {
                    if (!L.stack[ra + 1].ttisnil()) {
                        /* continue loop? */
                        lobject.setobjs2s(L, ra, ra + 1); /* save control variable */
                        ci.l_savedpc += i.sBx; /* jump back */
                    }
                    break;
                }
            case OP_SETLIST:
                {
                    var n = i.B;
                    var _c = i.C;

                    if (n === 0) n = L.top - ra - 1;

                    if (_c === 0) {
                        lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_EXTRAARG);
                        _c = ci.l_code[ci.l_savedpc++].Ax;
                    }

                    var h = L.stack[ra].value;
                    var last = (_c - 1) * LFIELDS_PER_FLUSH + n;

                    for (; n > 0; n--) {
                        ltable.luaH_setint(h, last--, L.stack[ra + n]);
                    }
                    ldo.adjust_top(L, ci.top); /* correct top (in case of previous open call) */
                    break;
                }
            case OP_CLOSURE:
                {
                    var p = cl.p.p[i.Bx];
                    var ncl = getcached(p, cl.upvals, L.stack, base); /* cached closure */
                    if (ncl === null) /* no match? */
                        pushclosure(L, p, cl.upvals, base, ra); /* create a new one */
                    else L.stack[ra].setclLvalue(ncl);
                    break;
                }
            case OP_VARARG:
                {
                    var _b5 = i.B - 1;
                    var _n = base - ci.funcOff - cl.p.numparams - 1;
                    var _j = void 0;

                    if (_n < 0) /* less arguments than parameters? */
                        _n = 0; /* no vararg arguments */

                    if (_b5 < 0) {
                        _b5 = _n; /* get all var. arguments */
                        ldo.luaD_checkstack(L, _n);
                        ldo.adjust_top(L, ra + _n);
                    }

                    for (_j = 0; _j < _b5 && _j < _n; _j++) {
                        lobject.setobjs2s(L, ra + _j, base - _n + _j);
                    }for (; _j < _b5; _j++) {
                        /* complete required results with nil */
                        L.stack[ra + _j].setnilvalue();
                    }break;
                }
            case OP_EXTRAARG:
                {
                    throw Error("invalid opcode");
                }
        }
    }
};

var dojump = function dojump(L, ci, i, e) {
    var a = i.A;
    if (a !== 0) lfunc.luaF_close(L, ci.l_base + a - 1);
    ci.l_savedpc += i.sBx + e;
};

var donextjump = function donextjump(L, ci) {
    dojump(L, ci, ci.l_code[ci.l_savedpc], 1);
};

var luaV_lessthan = function luaV_lessthan(L, l, r) {
    if (l.ttisnumber() && r.ttisnumber()) return LTnum(l, r) ? 1 : 0;else if (l.ttisstring() && r.ttisstring()) return l_strcmp(l.tsvalue(), r.tsvalue()) < 0 ? 1 : 0;else {
        var res = ltm.luaT_callorderTM(L, l, r, ltm.TMS.TM_LT);
        if (res === null) ldebug.luaG_ordererror(L, l, r);
        return res ? 1 : 0;
    }
};

var luaV_lessequal = function luaV_lessequal(L, l, r) {
    var res = void 0;

    if (l.ttisnumber() && r.ttisnumber()) return LEnum(l, r) ? 1 : 0;else if (l.ttisstring() && r.ttisstring()) return l_strcmp(l.tsvalue(), r.tsvalue()) <= 0 ? 1 : 0;else {
        res = ltm.luaT_callorderTM(L, l, r, ltm.TMS.TM_LE);
        if (res !== null) return res ? 1 : 0;
    }
    /* try 'lt': */
    L.ci.callstatus |= lstate.CIST_LEQ; /* mark it is doing 'lt' for 'le' */
    res = ltm.luaT_callorderTM(L, r, l, ltm.TMS.TM_LT);
    L.ci.callstatus ^= lstate.CIST_LEQ; /* clear mark */
    if (res === null) ldebug.luaG_ordererror(L, l, r);
    return res ? 0 : 1; /* result is negated */
};

var luaV_equalobj = function luaV_equalobj(L, t1, t2) {
    if (t1.ttype() !== t2.ttype()) {
        /* not the same variant? */
        if (t1.ttnov() !== t2.ttnov() || t1.ttnov() !== LUA_TNUMBER) return 0; /* only numbers can be equal with different variants */
        else {
                /* two numbers with different variants */
                /* OPTIMIZATION: instead of calling luaV_tointeger we can just let JS do the comparison */
                return t1.value === t2.value ? 1 : 0;
            }
    }

    var tm = void 0;

    /* values have same type and same variant */
    switch (t1.ttype()) {
        case LUA_TNIL:
            return 1;
        case LUA_TBOOLEAN:
            return t1.value == t2.value ? 1 : 0; // Might be 1 or true
        case LUA_TLIGHTUSERDATA:
        case LUA_TNUMINT:
        case LUA_TNUMFLT:
        case LUA_TLCF:
            return t1.value === t2.value ? 1 : 0;
        case LUA_TSHRSTR:
        case LUA_TLNGSTR:
            {
                return luaS_eqlngstr(t1.tsvalue(), t2.tsvalue()) ? 1 : 0;
            }
        case LUA_TUSERDATA:
        case LUA_TTABLE:
            if (t1.value === t2.value) return 1;else if (L === null) return 0;

            tm = ltm.fasttm(L, t1.value.metatable, ltm.TMS.TM_EQ);
            if (tm === null) tm = ltm.fasttm(L, t2.value.metatable, ltm.TMS.TM_EQ);
            break;
        default:
            return t1.value === t2.value ? 1 : 0;
    }

    if (tm === null) /* no TM? */
        return 0;

    var tv = new lobject.TValue(); /* doesn't use the stack */
    ltm.luaT_callTM(L, tm, t1, t2, tv, 1);
    return tv.l_isfalse() ? 0 : 1;
};

var luaV_rawequalobj = function luaV_rawequalobj(t1, t2) {
    return luaV_equalobj(null, t1, t2);
};

var forlimit = function forlimit(obj, step) {
    var stopnow = false;
    var ilimit = luaV_tointeger(obj, step < 0 ? 2 : 1);
    if (ilimit === false) {
        var n = tonumber(obj);
        if (n === false) return false;

        if (0 < n) {
            ilimit = LUA_MAXINTEGER;
            if (step < 0) stopnow = true;
        } else {
            ilimit = LUA_MININTEGER;
            if (step >= 0) stopnow = true;
        }
    }

    return {
        stopnow: stopnow,
        ilimit: ilimit
    };
};

/*
** try to convert a value to an integer, rounding according to 'mode':
** mode === 0: accepts only integral values
** mode === 1: takes the floor of the number
** mode === 2: takes the ceil of the number
*/
var luaV_tointeger = function luaV_tointeger(obj, mode) {
    if (obj.ttisfloat()) {
        var n = obj.value;
        var f = Math.floor(n);

        if (n !== f) {
            /* not an integral value? */
            if (mode === 0) return false; /* fails if mode demands integral value */
            else if (mode > 1) /* needs ceil? */
                    f += 1; /* convert floor to ceil (remember: n !== f) */
        }

        return lua_numbertointeger(f);
    } else if (obj.ttisinteger()) {
        return obj.value;
    } else if (cvt2num(obj)) {
        var v = new lobject.TValue();
        if (lobject.luaO_str2num(obj.svalue(), v) === obj.vslen() + 1) return luaV_tointeger(v, mode);
    }

    return false;
};

var tointeger = function tointeger(o) {
    return o.ttisinteger() ? o.value : luaV_tointeger(o, 0);
};

var tonumber = function tonumber(o) {
    if (o.ttnov() === LUA_TNUMBER) return o.value;

    if (cvt2num(o)) {
        /* string convertible to number? */
        var v = new lobject.TValue();
        if (lobject.luaO_str2num(o.svalue(), v) === o.vslen() + 1) return v.value;
    }

    return false;
};

/*
** Return 'l < r', for numbers.
** As fengari uses javascript numbers for both floats and integers and has
** correct semantics, we can just compare values.
*/
var LTnum = function LTnum(l, r) {
    return l.value < r.value;
};

/*
** Return 'l <= r', for numbers.
*/
var LEnum = function LEnum(l, r) {
    return l.value <= r.value;
};

/*
** Compare two strings 'ls' x 'rs', returning an integer smaller-equal-
** -larger than zero if 'ls' is smaller-equal-larger than 'rs'.
*/
var l_strcmp = function l_strcmp(ls, rs) {
    var l = luaS_hashlongstr(ls);
    var r = luaS_hashlongstr(rs);
    /* In fengari we assume string hash has same collation as byte values */
    if (l === r) return 0;else if (l < r) return -1;else return 1;
};

/*
** Main operation 'ra' = #rb'.
*/
var luaV_objlen = function luaV_objlen(L, ra, rb) {
    var tm = void 0;
    switch (rb.ttype()) {
        case LUA_TTABLE:
            {
                var h = rb.value;
                tm = ltm.fasttm(L, h.metatable, ltm.TMS.TM_LEN);
                if (tm !== null) break; /* metamethod? break switch to call it */
                ra.setivalue(ltable.luaH_getn(h)); /* else primitive len */
                return;
            }
        case LUA_TSHRSTR:
        case LUA_TLNGSTR:
            ra.setivalue(rb.vslen());
            return;
        default:
            {
                tm = ltm.luaT_gettmbyobj(L, rb, ltm.TMS.TM_LEN);
                if (tm.ttisnil()) ldebug.luaG_typeerror(L, rb, to_luastring("get length of", true));
                break;
            }
    }

    ltm.luaT_callTM(L, tm, rb, rb, ra, 1);
};

/* Shim taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul */
var luaV_imul = Math.imul || function (a, b) {
    var aHi = a >>> 16 & 0xffff;
    var aLo = a & 0xffff;
    var bHi = b >>> 16 & 0xffff;
    var bLo = b & 0xffff;
    /*
    ** the shift by 0 fixes the sign on the high part
    ** the final |0 converts the unsigned value into a signed value
    */
    return aLo * bLo + (aHi * bLo + aLo * bHi << 16 >>> 0) | 0;
};

var luaV_div = function luaV_div(L, m, n) {
    if (n === 0) ldebug.luaG_runerror(L, to_luastring("attempt to divide by zero"));
    return Math.floor(m / n) | 0;
};

// % semantic on negative numbers is different in js
var luaV_mod = function luaV_mod(L, m, n) {
    if (n === 0) ldebug.luaG_runerror(L, to_luastring("attempt to perform 'n%%0'"));
    return m - Math.floor(m / n) * n | 0;
};

var NBITS = 32;

var luaV_shiftl = function luaV_shiftl(x, y) {
    if (y < 0) {
        /* shift right? */
        if (y <= -NBITS) return 0;else return x >>> -y;
    } else {
        /* shift left */
        if (y >= NBITS) return 0;else return x << y;
    }
};

/*
** check whether cached closure in prototype 'p' may be reused, that is,
** whether there is a cached closure with the same upvalues needed by
** new closure to be created.
*/
var getcached = function getcached(p, encup, stack, base) {
    var c = p.cache;
    if (c !== null) {
        /* is there a cached closure? */
        var uv = p.upvalues;
        var nup = uv.length;
        for (var i = 0; i < nup; i++) {
            /* check whether it has right upvalues */
            var v = uv[i].instack ? stack[base + uv[i].idx] : encup[uv[i].idx];
            if (c.upvals[i] !== v) return null; /* wrong upvalue; cannot reuse closure */
        }
    }
    return c; /* return cached closure (or NULL if no cached closure) */
};

/*
** create a new Lua closure, push it in the stack, and initialize
** its upvalues.
*/
var pushclosure = function pushclosure(L, p, encup, base, ra) {
    var nup = p.upvalues.length;
    var uv = p.upvalues;
    var ncl = new lobject.LClosure(L, nup);
    ncl.p = p;
    L.stack[ra].setclLvalue(ncl);
    for (var i = 0; i < nup; i++) {
        if (uv[i].instack) ncl.upvals[i] = lfunc.luaF_findupval(L, base + uv[i].idx);else ncl.upvals[i] = encup[uv[i].idx];
    }
    p.cache = ncl; /* save it on cache for reuse */
};

var cvt2str = function cvt2str(o) {
    return o.ttisnumber();
};

var cvt2num = function cvt2num(o) {
    return o.ttisstring();
};

var tostring = function tostring(L, i) {
    var o = L.stack[i];

    if (o.ttisstring()) return true;

    if (cvt2str(o)) {
        lobject.luaO_tostring(L, o);
        return true;
    }

    return false;
};

var isemptystr = function isemptystr(o) {
    return o.ttisstring() && o.vslen() === 0;
};

/* copy strings in stack from top - n up to top - 1 to buffer */
var copy2buff = function copy2buff(L, top, n, buff) {
    var tl = 0; /* size already copied */
    do {
        var tv = L.stack[top - n];
        var l = tv.vslen(); /* length of string being copied */
        var s = tv.svalue();
        buff.set(s, tl);
        tl += l;
    } while (--n > 0);
};

/*
** Main operation for concatenation: concat 'total' values in the stack,
** from 'L->top - total' up to 'L->top - 1'.
*/
var luaV_concat = function luaV_concat(L, total) {
    lua_assert(total >= 2);
    do {
        var top = L.top;
        var n = 2; /* number of elements handled in this pass (at least 2) */

        if (!(L.stack[top - 2].ttisstring() || cvt2str(L.stack[top - 2])) || !tostring(L, top - 1)) {
            ltm.luaT_trybinTM(L, L.stack[top - 2], L.stack[top - 1], L.stack[top - 2], ltm.TMS.TM_CONCAT);
        } else if (isemptystr(L.stack[top - 1])) {
            tostring(L, top - 2);
        } else if (isemptystr(L.stack[top - 2])) {
            lobject.setobjs2s(L, top - 2, top - 1);
        } else {
            /* at least two non-empty string values; get as many as possible */
            var tl = L.stack[top - 1].vslen();
            /* collect total length and number of strings */
            for (n = 1; n < total && tostring(L, top - n - 1); n++) {
                var l = L.stack[top - n - 1].vslen();
                tl += l;
            }
            var buff = new Uint8Array(tl);
            copy2buff(L, top, n, buff);
            var ts = luaS_bless(L, buff);
            lobject.setsvalue2s(L, top - n, ts);
        }
        total -= n - 1; /* got 'n' strings to create 1 new */
        /* popped 'n' strings and pushed one */
        for (; L.top > top - (n - 1);) {
            delete L.stack[--L.top];
        }
    } while (total > 1); /* repeat until only 1 result left */
};

var MAXTAGLOOP = 2000;

var luaV_gettable = function luaV_gettable(L, t, key, ra) {
    for (var loop = 0; loop < MAXTAGLOOP; loop++) {
        var tm = void 0;

        if (!t.ttistable()) {
            tm = ltm.luaT_gettmbyobj(L, t, ltm.TMS.TM_INDEX);
            if (tm.ttisnil()) ldebug.luaG_typeerror(L, t, to_luastring('index', true)); /* no metamethod */
            /* else will try the metamethod */
        } else {
            var slot = ltable.luaH_get(L, t.value, key);
            if (!slot.ttisnil()) {
                lobject.setobj2s(L, ra, slot);
                return;
            } else {
                /* 't' is a table */
                tm = ltm.fasttm(L, t.value.metatable, ltm.TMS.TM_INDEX); /* table's metamethod */
                if (tm === null) {
                    /* no metamethod? */
                    L.stack[ra].setnilvalue(); /* result is nil */
                    return;
                }
            }
            /* else will try the metamethod */
        }
        if (tm.ttisfunction()) {
            /* is metamethod a function? */
            ltm.luaT_callTM(L, tm, t, key, L.stack[ra], 1); /* call it */
            return;
        }
        t = tm; /* else try to access 'tm[key]' */
    }

    ldebug.luaG_runerror(L, to_luastring("'__index' chain too long; possible loop", true));
};

var settable = function settable(L, t, key, val) {
    for (var loop = 0; loop < MAXTAGLOOP; loop++) {
        var tm = void 0;
        if (t.ttistable()) {
            var h = t.value; /* save 't' table */
            var slot = ltable.luaH_set(L, h, key);
            if (!slot.ttisnil() || (tm = ltm.fasttm(L, h.metatable, ltm.TMS.TM_NEWINDEX)) === null) {
                if (val.ttisnil()) ltable.luaH_delete(L, h, key);else slot.setfrom(val);
                ltable.invalidateTMcache(h);
                return;
            }
            /* else will try the metamethod */
        } else {
            /* not a table; check metamethod */
            if ((tm = ltm.luaT_gettmbyobj(L, t, ltm.TMS.TM_NEWINDEX)).ttisnil()) ldebug.luaG_typeerror(L, t, to_luastring('index', true));
        }
        /* try the metamethod */
        if (tm.ttisfunction()) {
            ltm.luaT_callTM(L, tm, t, key, val, 0);
            return;
        }
        t = tm; /* else repeat assignment over 'tm' */
    }

    ldebug.luaG_runerror(L, to_luastring("'__newindex' chain too long; possible loop", true));
};

module.exports.cvt2str = cvt2str;
module.exports.cvt2num = cvt2num;
module.exports.luaV_gettable = luaV_gettable;
module.exports.luaV_concat = luaV_concat;
module.exports.luaV_div = luaV_div;
module.exports.luaV_equalobj = luaV_equalobj;
module.exports.luaV_execute = luaV_execute;
module.exports.luaV_finishOp = luaV_finishOp;
module.exports.luaV_imul = luaV_imul;
module.exports.luaV_lessequal = luaV_lessequal;
module.exports.luaV_lessthan = luaV_lessthan;
module.exports.luaV_mod = luaV_mod;
module.exports.luaV_objlen = luaV_objlen;
module.exports.luaV_rawequalobj = luaV_rawequalobj;
module.exports.luaV_shiftl = luaV_shiftl;
module.exports.luaV_tointeger = luaV_tointeger;
module.exports.settable = settable;
module.exports.tointeger = tointeger;
module.exports.tonumber = tonumber;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OpCodes = ["MOVE", "LOADK", "LOADKX", "LOADBOOL", "LOADNIL", "GETUPVAL", "GETTABUP", "GETTABLE", "SETTABUP", "SETUPVAL", "SETTABLE", "NEWTABLE", "SELF", "ADD", "SUB", "MUL", "MOD", "POW", "DIV", "IDIV", "BAND", "BOR", "BXOR", "SHL", "SHR", "UNM", "BNOT", "NOT", "LEN", "CONCAT", "JMP", "EQ", "LT", "LE", "TEST", "TESTSET", "CALL", "TAILCALL", "RETURN", "FORLOOP", "FORPREP", "TFORCALL", "TFORLOOP", "SETLIST", "CLOSURE", "VARARG", "EXTRAARG"];

var OpCodesI = {
    OP_MOVE: 0,
    OP_LOADK: 1,
    OP_LOADKX: 2,
    OP_LOADBOOL: 3,
    OP_LOADNIL: 4,
    OP_GETUPVAL: 5,
    OP_GETTABUP: 6,
    OP_GETTABLE: 7,
    OP_SETTABUP: 8,
    OP_SETUPVAL: 9,
    OP_SETTABLE: 10,
    OP_NEWTABLE: 11,
    OP_SELF: 12,
    OP_ADD: 13,
    OP_SUB: 14,
    OP_MUL: 15,
    OP_MOD: 16,
    OP_POW: 17,
    OP_DIV: 18,
    OP_IDIV: 19,
    OP_BAND: 20,
    OP_BOR: 21,
    OP_BXOR: 22,
    OP_SHL: 23,
    OP_SHR: 24,
    OP_UNM: 25,
    OP_BNOT: 26,
    OP_NOT: 27,
    OP_LEN: 28,
    OP_CONCAT: 29,
    OP_JMP: 30,
    OP_EQ: 31,
    OP_LT: 32,
    OP_LE: 33,
    OP_TEST: 34,
    OP_TESTSET: 35,
    OP_CALL: 36,
    OP_TAILCALL: 37,
    OP_RETURN: 38,
    OP_FORLOOP: 39,
    OP_FORPREP: 40,
    OP_TFORCALL: 41,
    OP_TFORLOOP: 42,
    OP_SETLIST: 43,
    OP_CLOSURE: 44,
    OP_VARARG: 45,
    OP_EXTRAARG: 46
};

/*
** masks for instruction properties. The format is:
** bits 0-1: op mode
** bits 2-3: C arg mode
** bits 4-5: B arg mode
** bit 6: instruction set register A
** bit 7: operator is a test (next instruction must be a jump)
*/
var OpArgN = 0; /* argument is not used */
var OpArgU = 1; /* argument is used */
var OpArgR = 2; /* argument is a register or a jump offset */
var OpArgK = 3; /* argument is a constant or register/constant */

/* basic instruction format */
var iABC = 0;
var iABx = 1;
var iAsBx = 2;
var iAx = 3;

var luaP_opmodes = [0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC, /* OP_MOVE */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgN << 2 | iABx, /* OP_LOADK */
0 << 7 | 1 << 6 | OpArgN << 4 | OpArgN << 2 | iABx, /* OP_LOADKX */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC, /* OP_LOADBOOL */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC, /* OP_LOADNIL */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC, /* OP_GETUPVAL */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgK << 2 | iABC, /* OP_GETTABUP */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgK << 2 | iABC, /* OP_GETTABLE */
0 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_SETTABUP */
0 << 7 | 0 << 6 | OpArgU << 4 | OpArgN << 2 | iABC, /* OP_SETUPVAL */
0 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_SETTABLE */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC, /* OP_NEWTABLE */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgK << 2 | iABC, /* OP_SELF */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_ADD */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_SUB */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_MUL */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_MOD */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_POW */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_DIV */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_IDIV */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_BAND */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_BOR */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_BXOR */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_SHL */
0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_SHR */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC, /* OP_UNM */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC, /* OP_BNOT */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC, /* OP_NOT */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC, /* OP_LEN */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgR << 2 | iABC, /* OP_CONCAT */
0 << 7 | 0 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx, /* OP_JMP */
1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_EQ */
1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_LT */
1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC, /* OP_LE */
1 << 7 | 0 << 6 | OpArgN << 4 | OpArgU << 2 | iABC, /* OP_TEST */
1 << 7 | 1 << 6 | OpArgR << 4 | OpArgU << 2 | iABC, /* OP_TESTSET */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC, /* OP_CALL */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC, /* OP_TAILCALL */
0 << 7 | 0 << 6 | OpArgU << 4 | OpArgN << 2 | iABC, /* OP_RETURN */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx, /* OP_FORLOOP */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx, /* OP_FORPREP */
0 << 7 | 0 << 6 | OpArgN << 4 | OpArgU << 2 | iABC, /* OP_TFORCALL */
0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx, /* OP_TFORLOOP */
0 << 7 | 0 << 6 | OpArgU << 4 | OpArgU << 2 | iABC, /* OP_SETLIST */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABx, /* OP_CLOSURE */
0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC, /* OP_VARARG */
0 << 7 | 0 << 6 | OpArgU << 4 | OpArgU << 2 | iAx /* OP_EXTRAARG */
];

var getOpMode = function getOpMode(m) {
    return luaP_opmodes[m] & 3;
};

var getBMode = function getBMode(m) {
    return luaP_opmodes[m] >> 4 & 3;
};

var getCMode = function getCMode(m) {
    return luaP_opmodes[m] >> 2 & 3;
};

var testAMode = function testAMode(m) {
    return luaP_opmodes[m] & 1 << 6;
};

var testTMode = function testTMode(m) {
    return luaP_opmodes[m] & 1 << 7;
};

var SIZE_C = 9;
var SIZE_B = 9;
var SIZE_Bx = SIZE_C + SIZE_B;
var SIZE_A = 8;
var SIZE_Ax = SIZE_C + SIZE_B + SIZE_A;
var SIZE_OP = 6;
var POS_OP = 0;
var POS_A = POS_OP + SIZE_OP;
var POS_C = POS_A + SIZE_A;
var POS_B = POS_C + SIZE_C;
var POS_Bx = POS_C;
var POS_Ax = POS_A;
var MAXARG_Bx = (1 << SIZE_Bx) - 1;
var MAXARG_sBx = MAXARG_Bx >> 1; /* 'sBx' is signed */
var MAXARG_Ax = (1 << SIZE_Ax) - 1;
var MAXARG_A = (1 << SIZE_A) - 1;
var MAXARG_B = (1 << SIZE_B) - 1;
var MAXARG_C = (1 << SIZE_C) - 1;

/* this bit 1 means constant (0 means register) */
var BITRK = 1 << SIZE_B - 1;

var MAXINDEXRK = BITRK - 1;

/*
** invalid register that fits in 8 bits
*/
var NO_REG = MAXARG_A;

/* test whether value is a constant */
var ISK = function ISK(x) {
    return x & BITRK;
};

/* gets the index of the constant */
var INDEXK = function INDEXK(r) {
    return r & ~BITRK;
};

/* code a constant index as a RK value */
var RKASK = function RKASK(x) {
    return x | BITRK;
};

/* creates a mask with 'n' 1 bits at position 'p' */
var MASK1 = function MASK1(n, p) {
    return ~(~0 << n) << p;
};

/* creates a mask with 'n' 0 bits at position 'p' */
var MASK0 = function MASK0(n, p) {
    return ~MASK1(n, p);
};

var GET_OPCODE = function GET_OPCODE(i) {
    return i.opcode;
};

var SET_OPCODE = function SET_OPCODE(i, o) {
    i.code = i.code & MASK0(SIZE_OP, POS_OP) | o << POS_OP & MASK1(SIZE_OP, POS_OP);
    return fullins(i);
};

var setarg = function setarg(i, v, pos, size) {
    i.code = i.code & MASK0(size, pos) | v << pos & MASK1(size, pos);
    return fullins(i);
};

var GETARG_A = function GETARG_A(i) {
    return i.A;
};

var SETARG_A = function SETARG_A(i, v) {
    return setarg(i, v, POS_A, SIZE_A);
};

var GETARG_B = function GETARG_B(i) {
    return i.B;
};

var SETARG_B = function SETARG_B(i, v) {
    return setarg(i, v, POS_B, SIZE_B);
};

var GETARG_C = function GETARG_C(i) {
    return i.C;
};

var SETARG_C = function SETARG_C(i, v) {
    return setarg(i, v, POS_C, SIZE_C);
};

var GETARG_Bx = function GETARG_Bx(i) {
    return i.Bx;
};

var SETARG_Bx = function SETARG_Bx(i, v) {
    return setarg(i, v, POS_Bx, SIZE_Bx);
};

var GETARG_Ax = function GETARG_Ax(i) {
    return i.Ax;
};

var SETARG_Ax = function SETARG_Ax(i, v) {
    return setarg(i, v, POS_Ax, SIZE_Ax);
};

var GETARG_sBx = function GETARG_sBx(i) {
    return i.sBx;
};

var SETARG_sBx = function SETARG_sBx(i, b) {
    return SETARG_Bx(i, b + MAXARG_sBx);
};

/*
** Pre-calculate all possible part of the instruction
*/
var fullins = function fullins(ins) {
    if (typeof ins === "number") {
        return {
            code: ins,
            opcode: ins >> POS_OP & MASK1(SIZE_OP, 0),
            A: ins >> POS_A & MASK1(SIZE_A, 0),
            B: ins >> POS_B & MASK1(SIZE_B, 0),
            C: ins >> POS_C & MASK1(SIZE_C, 0),
            Bx: ins >> POS_Bx & MASK1(SIZE_Bx, 0),
            Ax: ins >> POS_Ax & MASK1(SIZE_Ax, 0),
            sBx: (ins >> POS_Bx & MASK1(SIZE_Bx, 0)) - MAXARG_sBx
        };
    } else {
        var i = ins.code;
        ins.opcode = i >> POS_OP & MASK1(SIZE_OP, 0);
        ins.A = i >> POS_A & MASK1(SIZE_A, 0);
        ins.B = i >> POS_B & MASK1(SIZE_B, 0);
        ins.C = i >> POS_C & MASK1(SIZE_C, 0);
        ins.Bx = i >> POS_Bx & MASK1(SIZE_Bx, 0);
        ins.Ax = i >> POS_Ax & MASK1(SIZE_Ax, 0);
        ins.sBx = (i >> POS_Bx & MASK1(SIZE_Bx, 0)) - MAXARG_sBx;
        return ins;
    }
};

var CREATE_ABC = function CREATE_ABC(o, a, b, c) {
    return fullins(o << POS_OP | a << POS_A | b << POS_B | c << POS_C);
};

var CREATE_ABx = function CREATE_ABx(o, a, bc) {
    return fullins(o << POS_OP | a << POS_A | bc << POS_Bx);
};

var CREATE_Ax = function CREATE_Ax(o, a) {
    return fullins(o << POS_OP | a << POS_Ax);
};

/* number of list items to accumulate before a SETLIST instruction */
var LFIELDS_PER_FLUSH = 50;

module.exports.BITRK = BITRK;
module.exports.CREATE_ABC = CREATE_ABC;
module.exports.CREATE_ABx = CREATE_ABx;
module.exports.CREATE_Ax = CREATE_Ax;
module.exports.GET_OPCODE = GET_OPCODE;
module.exports.GETARG_A = GETARG_A;
module.exports.GETARG_B = GETARG_B;
module.exports.GETARG_C = GETARG_C;
module.exports.GETARG_Bx = GETARG_Bx;
module.exports.GETARG_Ax = GETARG_Ax;
module.exports.GETARG_sBx = GETARG_sBx;
module.exports.INDEXK = INDEXK;
module.exports.ISK = ISK;
module.exports.LFIELDS_PER_FLUSH = LFIELDS_PER_FLUSH;
module.exports.MAXARG_A = MAXARG_A;
module.exports.MAXARG_Ax = MAXARG_Ax;
module.exports.MAXARG_B = MAXARG_B;
module.exports.MAXARG_Bx = MAXARG_Bx;
module.exports.MAXARG_C = MAXARG_C;
module.exports.MAXARG_sBx = MAXARG_sBx;
module.exports.MAXINDEXRK = MAXINDEXRK;
module.exports.NO_REG = NO_REG;
module.exports.OpArgK = OpArgK;
module.exports.OpArgN = OpArgN;
module.exports.OpArgR = OpArgR;
module.exports.OpArgU = OpArgU;
module.exports.OpCodes = OpCodes;
module.exports.OpCodesI = OpCodesI;
module.exports.POS_A = POS_A;
module.exports.POS_Ax = POS_Ax;
module.exports.POS_B = POS_B;
module.exports.POS_Bx = POS_Bx;
module.exports.POS_C = POS_C;
module.exports.POS_OP = POS_OP;
module.exports.RKASK = RKASK;
module.exports.SETARG_A = SETARG_A;
module.exports.SETARG_Ax = SETARG_Ax;
module.exports.SETARG_B = SETARG_B;
module.exports.SETARG_Bx = SETARG_Bx;
module.exports.SETARG_C = SETARG_C;
module.exports.SETARG_sBx = SETARG_sBx;
module.exports.SET_OPCODE = SET_OPCODE;
module.exports.SIZE_A = SIZE_A;
module.exports.SIZE_Ax = SIZE_Ax;
module.exports.SIZE_B = SIZE_B;
module.exports.SIZE_Bx = SIZE_Bx;
module.exports.SIZE_C = SIZE_C;
module.exports.SIZE_OP = SIZE_OP;
module.exports.fullins = fullins;
module.exports.getBMode = getBMode;
module.exports.getCMode = getCMode;
module.exports.getOpMode = getOpMode;
module.exports.iABC = iABC;
module.exports.iABx = iABx;
module.exports.iAsBx = iAsBx;
module.exports.iAx = iAx;
module.exports.testAMode = testAMode;
module.exports.testTMode = testTMode;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_VERSION_MAJOR = _require.LUA_VERSION_MAJOR,
    LUA_VERSION_MINOR = _require.LUA_VERSION_MINOR;

var LUA_VERSUFFIX = "_" + LUA_VERSION_MAJOR + "_" + LUA_VERSION_MINOR;
module.exports.LUA_VERSUFFIX = LUA_VERSUFFIX;

module.exports.lua_assert = function (c) {};

var LUA_COLIBNAME = "coroutine";
module.exports.LUA_COLIBNAME = LUA_COLIBNAME;
module.exports.luaopen_coroutine = __webpack_require__(23).luaopen_coroutine;

var LUA_TABLIBNAME = "table";
module.exports.LUA_TABLIBNAME = LUA_TABLIBNAME;
module.exports.luaopen_table = __webpack_require__(24).luaopen_table;

if (false) {
    var LUA_IOLIBNAME = "io";
    module.exports.LUA_IOLIBNAME = LUA_IOLIBNAME;
    module.exports.luaopen_io = require("./liolib.js").luaopen_io;
}

var LUA_OSLIBNAME = "os";
module.exports.LUA_OSLIBNAME = LUA_OSLIBNAME;
module.exports.luaopen_os = __webpack_require__(25).luaopen_os;

var LUA_STRLIBNAME = "string";
module.exports.LUA_STRLIBNAME = LUA_STRLIBNAME;
module.exports.luaopen_string = __webpack_require__(26).luaopen_string;

var LUA_UTF8LIBNAME = "utf8";
module.exports.LUA_UTF8LIBNAME = LUA_UTF8LIBNAME;
module.exports.luaopen_utf8 = __webpack_require__(27).luaopen_utf8;

var LUA_BITLIBNAME = "bit32";
module.exports.LUA_BITLIBNAME = LUA_BITLIBNAME;
// module.exports.luaopen_bit32 = require("./lbitlib.js").luaopen_bit32;

var LUA_MATHLIBNAME = "math";
module.exports.LUA_MATHLIBNAME = LUA_MATHLIBNAME;
module.exports.luaopen_math = __webpack_require__(28).luaopen_math;

var LUA_DBLIBNAME = "debug";
module.exports.LUA_DBLIBNAME = LUA_DBLIBNAME;
module.exports.luaopen_debug = __webpack_require__(29).luaopen_debug;

var LUA_LOADLIBNAME = "package";
module.exports.LUA_LOADLIBNAME = LUA_LOADLIBNAME;
module.exports.luaopen_package = __webpack_require__(30).luaopen_package;

var linit = __webpack_require__(37);
module.exports.luaL_openlibs = linit.luaL_openlibs;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    LUA_MULTRET = _require.LUA_MULTRET,
    LUA_OPBNOT = _require.LUA_OPBNOT,
    LUA_OPEQ = _require.LUA_OPEQ,
    LUA_OPLE = _require.LUA_OPLE,
    LUA_OPLT = _require.LUA_OPLT,
    LUA_OPUNM = _require.LUA_OPUNM,
    LUA_REGISTRYINDEX = _require.LUA_REGISTRYINDEX,
    LUA_RIDX_GLOBALS = _require.LUA_RIDX_GLOBALS,
    LUA_VERSION_NUM = _require.LUA_VERSION_NUM,
    _require$constant_typ = _require.constant_types,
    LUA_NUMTAGS = _require$constant_typ.LUA_NUMTAGS,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TCCL = _require$constant_typ.LUA_TCCL,
    LUA_TFUNCTION = _require$constant_typ.LUA_TFUNCTION,
    LUA_TLCF = _require$constant_typ.LUA_TLCF,
    LUA_TLCL = _require$constant_typ.LUA_TLCL,
    LUA_TLIGHTUSERDATA = _require$constant_typ.LUA_TLIGHTUSERDATA,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNONE = _require$constant_typ.LUA_TNONE,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    LUA_TTHREAD = _require$constant_typ.LUA_TTHREAD,
    LUA_TUSERDATA = _require$constant_typ.LUA_TUSERDATA,
    LUA_OK = _require.thread_status.LUA_OK,
    from_userstring = _require.from_userstring,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    api_check = _require2.api_check;

var ldebug = __webpack_require__(10);
var ldo = __webpack_require__(7);

var _require3 = __webpack_require__(34),
    luaU_dump = _require3.luaU_dump;

var lfunc = __webpack_require__(12);
var lobject = __webpack_require__(5);
var lstate = __webpack_require__(11);

var _require4 = __webpack_require__(9),
    luaS_bless = _require4.luaS_bless,
    luaS_new = _require4.luaS_new,
    luaS_newliteral = _require4.luaS_newliteral;

var ltm = __webpack_require__(13);

var _require5 = __webpack_require__(4),
    LUAI_MAXSTACK = _require5.LUAI_MAXSTACK;

var lvm = __webpack_require__(14);
var ltable = __webpack_require__(8);

var _require6 = __webpack_require__(18),
    ZIO = _require6.ZIO;

var TValue = lobject.TValue;
var CClosure = lobject.CClosure;

var api_incr_top = function api_incr_top(L) {
    L.top++;
    api_check(L, L.top <= L.ci.top, "stack overflow");
};

var api_checknelems = function api_checknelems(L, n) {
    api_check(L, n < L.top - L.ci.funcOff, "not enough elements in the stack");
};

var fengari_argcheck = function fengari_argcheck(c) {
    if (!c) throw TypeError("invalid argument");
};

var fengari_argcheckinteger = function fengari_argcheckinteger(n) {
    fengari_argcheck(typeof n === "number" && (n | 0) === n);
};

var isvalid = function isvalid(o) {
    return o !== lobject.luaO_nilobject;
};

var lua_version = function lua_version(L) {
    if (L === null) return LUA_VERSION_NUM;else return L.l_G.version;
};

var lua_atpanic = function lua_atpanic(L, panicf) {
    var old = L.l_G.panic;
    L.l_G.panic = panicf;
    return old;
};

var lua_atnativeerror = function lua_atnativeerror(L, errorf) {
    var old = L.l_G.atnativeerror;
    L.l_G.atnativeerror = errorf;
    return old;
};

// Return value for idx on stack
var index2addr = function index2addr(L, idx) {
    var ci = L.ci;
    if (idx > 0) {
        var o = ci.funcOff + idx;
        api_check(L, idx <= ci.top - (ci.funcOff + 1), "unacceptable index");
        if (o >= L.top) return lobject.luaO_nilobject;else return L.stack[o];
    } else if (idx > LUA_REGISTRYINDEX) {
        api_check(L, idx !== 0 && -idx <= L.top, "invalid index");
        return L.stack[L.top + idx];
    } else if (idx === LUA_REGISTRYINDEX) {
        return L.l_G.l_registry;
    } else {
        /* upvalues */
        idx = LUA_REGISTRYINDEX - idx;
        api_check(L, idx <= lfunc.MAXUPVAL + 1, "upvalue index too large");
        if (ci.func.ttislcf()) /* light C function? */
            return lobject.luaO_nilobject; /* it has no upvalues */
        else {
                return idx <= ci.func.value.nupvalues ? ci.func.value.upvalue[idx - 1] : lobject.luaO_nilobject;
            }
    }
};

// Like index2addr but returns the index on stack; doesn't allow pseudo indices
var index2addr_ = function index2addr_(L, idx) {
    var ci = L.ci;
    if (idx > 0) {
        var o = ci.funcOff + idx;
        api_check(L, idx <= ci.top - (ci.funcOff + 1), "unacceptable index");
        if (o >= L.top) return null;else return o;
    } else if (idx > LUA_REGISTRYINDEX) {
        api_check(L, idx !== 0 && -idx <= L.top, "invalid index");
        return L.top + idx;
    } else {
        /* registry or upvalue */
        throw Error("attempt to use pseudo-index");
    }
};

var lua_checkstack = function lua_checkstack(L, n) {
    var res = void 0;
    var ci = L.ci;
    api_check(L, n >= 0, "negative 'n'");
    if (L.stack_last - L.top > n) /* stack large enough? */
        res = true;else {
        /* no; need to grow stack */
        var inuse = L.top + lstate.EXTRA_STACK;
        if (inuse > LUAI_MAXSTACK - n) /* can grow without overflow? */
            res = false; /* no */
        else {
                /* try to grow stack */
                ldo.luaD_growstack(L, n);
                res = true;
            }
    }

    if (res && ci.top < L.top + n) ci.top = L.top + n; /* adjust frame top */

    return res;
};

var lua_xmove = function lua_xmove(from, to, n) {
    if (from === to) return;
    api_checknelems(from, n);
    api_check(from, from.l_G === to.l_G, "moving among independent states");
    api_check(from, to.ci.top - to.top >= n, "stack overflow");
    from.top -= n;
    for (var i = 0; i < n; i++) {
        to.stack[to.top] = new lobject.TValue();
        lobject.setobj2s(to, to.top, from.stack[from.top + i]);
        delete from.stack[from.top + i];
        to.top++;
    }
};

/*
** basic stack manipulation
*/

/*
** convert an acceptable stack index into an absolute index
*/
var lua_absindex = function lua_absindex(L, idx) {
    return idx > 0 || idx <= LUA_REGISTRYINDEX ? idx : L.top - L.ci.funcOff + idx;
};

var lua_gettop = function lua_gettop(L) {
    return L.top - (L.ci.funcOff + 1);
};

var lua_pushvalue = function lua_pushvalue(L, idx) {
    lobject.pushobj2s(L, index2addr(L, idx));
    api_check(L, L.top <= L.ci.top, "stack overflow");
};

var lua_settop = function lua_settop(L, idx) {
    var func = L.ci.funcOff;
    var newtop = void 0;
    if (idx >= 0) {
        api_check(L, idx <= L.stack_last - (func + 1), "new top too large");
        newtop = func + 1 + idx;
    } else {
        api_check(L, -(idx + 1) <= L.top - (func + 1), "invalid new top");
        newtop = L.top + idx + 1; /* 'subtract' index (index is negative) */
    }
    ldo.adjust_top(L, newtop);
};

var lua_pop = function lua_pop(L, n) {
    lua_settop(L, -n - 1);
};

var reverse = function reverse(L, from, to) {
    for (; from < to; from++, to--) {
        var fromtv = L.stack[from];
        var temp = new TValue(fromtv.type, fromtv.value);
        lobject.setobjs2s(L, from, to);
        lobject.setobj2s(L, to, temp);
    }
};

/*
** Let x = AB, where A is a prefix of length 'n'. Then,
** rotate x n === BA. But BA === (A^r . B^r)^r.
*/
var lua_rotate = function lua_rotate(L, idx, n) {
    var t = L.top - 1;
    var pIdx = index2addr_(L, idx);
    var p = L.stack[pIdx];
    api_check(L, isvalid(p) && idx > LUA_REGISTRYINDEX, "index not in the stack");
    api_check(L, (n >= 0 ? n : -n) <= t - pIdx + 1, "invalid 'n'");
    var m = n >= 0 ? t - n : pIdx - n - 1; /* end of prefix */
    reverse(L, pIdx, m);
    reverse(L, m + 1, L.top - 1);
    reverse(L, pIdx, L.top - 1);
};

var lua_copy = function lua_copy(L, fromidx, toidx) {
    var from = index2addr(L, fromidx);
    index2addr(L, toidx).setfrom(from);
};

var lua_remove = function lua_remove(L, idx) {
    lua_rotate(L, idx, -1);
    lua_pop(L, 1);
};

var lua_insert = function lua_insert(L, idx) {
    lua_rotate(L, idx, 1);
};

var lua_replace = function lua_replace(L, idx) {
    lua_copy(L, -1, idx);
    lua_pop(L, 1);
};

/*
** push functions (JS -> stack)
*/

var lua_pushnil = function lua_pushnil(L) {
    L.stack[L.top] = new TValue(LUA_TNIL, null);
    api_incr_top(L);
};

var lua_pushnumber = function lua_pushnumber(L, n) {
    fengari_argcheck(typeof n === "number");
    L.stack[L.top] = new TValue(LUA_TNUMFLT, n);
    api_incr_top(L);
};

var lua_pushinteger = function lua_pushinteger(L, n) {
    fengari_argcheckinteger(n);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
};

var lua_pushlstring = function lua_pushlstring(L, s, len) {
    fengari_argcheckinteger(len);
    var ts = void 0;
    if (len === 0) {
        s = to_luastring("", true);
        ts = luaS_bless(L, s);
    } else {
        s = from_userstring(s);
        api_check(L, s.length >= len, "invalid length to lua_pushlstring");
        ts = luaS_new(L, s.subarray(0, len));
    }
    lobject.pushsvalue2s(L, ts);
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return ts.value;
};

var lua_pushstring = function lua_pushstring(L, s) {
    if (s === undefined || s === null) {
        L.stack[L.top] = new TValue(LUA_TNIL, null);
        L.top++;
    } else {
        var ts = luaS_new(L, from_userstring(s));
        lobject.pushsvalue2s(L, ts);
        s = ts.getstr(); /* internal copy */
    }
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return s;
};

var lua_pushvfstring = function lua_pushvfstring(L, fmt, argp) {
    fmt = from_userstring(fmt);
    return lobject.luaO_pushvfstring(L, fmt, argp);
};

var lua_pushfstring = function lua_pushfstring(L, fmt) {
    fmt = from_userstring(fmt);

    for (var _len = arguments.length, argp = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        argp[_key - 2] = arguments[_key];
    }

    return lobject.luaO_pushvfstring(L, fmt, argp);
};

/* Similar to lua_pushstring, but takes a JS string */
var lua_pushliteral = function lua_pushliteral(L, s) {
    if (s === undefined || s === null) {
        L.stack[L.top] = new TValue(LUA_TNIL, null);
        L.top++;
    } else {
        fengari_argcheck(typeof s === "string");
        var ts = luaS_newliteral(L, s);
        lobject.pushsvalue2s(L, ts);
        s = ts.getstr(); /* internal copy */
    }
    api_check(L, L.top <= L.ci.top, "stack overflow");

    return s;
};

var lua_pushcclosure = function lua_pushcclosure(L, fn, n) {
    fengari_argcheck(typeof fn === "function");
    fengari_argcheckinteger(n);
    if (n === 0) L.stack[L.top] = new TValue(LUA_TLCF, fn);else {
        api_checknelems(L, n);
        api_check(L, n <= lfunc.MAXUPVAL, "upvalue index too large");
        var cl = new CClosure(L, fn, n);
        for (var i = 0; i < n; i++) {
            cl.upvalue[i].setfrom(L.stack[L.top - n + i]);
        }for (var _i = 1; _i < n; _i++) {
            delete L.stack[--L.top];
        }if (n > 0) --L.top;
        L.stack[L.top].setclCvalue(cl);
    }
    api_incr_top(L);
};

var lua_pushjsclosure = lua_pushcclosure;

var lua_pushcfunction = function lua_pushcfunction(L, fn) {
    lua_pushcclosure(L, fn, 0);
};

var lua_pushjsfunction = lua_pushcfunction;

var lua_pushboolean = function lua_pushboolean(L, b) {
    L.stack[L.top] = new TValue(LUA_TBOOLEAN, !!b);
    api_incr_top(L);
};

var lua_pushlightuserdata = function lua_pushlightuserdata(L, p) {
    L.stack[L.top] = new TValue(LUA_TLIGHTUSERDATA, p);
    api_incr_top(L);
};

var lua_pushthread = function lua_pushthread(L) {
    L.stack[L.top] = new TValue(LUA_TTHREAD, L);
    api_incr_top(L);
    return L.l_G.mainthread === L;
};

var lua_pushglobaltable = function lua_pushglobaltable(L) {
    lua_rawgeti(L, LUA_REGISTRYINDEX, LUA_RIDX_GLOBALS);
};

/*
** set functions (stack -> Lua)
*/

/*
** t[k] = value at the top of the stack (where 'k' is a string)
*/
var auxsetstr = function auxsetstr(L, t, k) {
    var str = luaS_new(L, from_userstring(k));
    api_checknelems(L, 1);
    lobject.pushsvalue2s(L, str); /* push 'str' (to make it a TValue) */
    api_check(L, L.top <= L.ci.top, "stack overflow");
    lvm.settable(L, t, L.stack[L.top - 1], L.stack[L.top - 2]);
    /* pop value and key */
    delete L.stack[--L.top];
    delete L.stack[--L.top];
};

var lua_setglobal = function lua_setglobal(L, name) {
    auxsetstr(L, ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS), name);
};

var lua_setmetatable = function lua_setmetatable(L, objindex) {
    api_checknelems(L, 1);
    var mt = void 0;
    var obj = index2addr(L, objindex);
    if (L.stack[L.top - 1].ttisnil()) mt = null;else {
        api_check(L, L.stack[L.top - 1].ttistable(), "table expected");
        mt = L.stack[L.top - 1].value;
    }

    switch (obj.ttnov()) {
        case LUA_TUSERDATA:
        case LUA_TTABLE:
            {
                obj.value.metatable = mt;
                break;
            }
        default:
            {
                L.l_G.mt[obj.ttnov()] = mt;
                break;
            }
    }

    delete L.stack[--L.top];
    return true;
};

var lua_settable = function lua_settable(L, idx) {
    api_checknelems(L, 2);
    var t = index2addr(L, idx);
    lvm.settable(L, t, L.stack[L.top - 2], L.stack[L.top - 1]);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
};

var lua_setfield = function lua_setfield(L, idx, k) {
    auxsetstr(L, index2addr(L, idx), k);
};

var lua_seti = function lua_seti(L, idx, n) {
    fengari_argcheckinteger(n);
    api_checknelems(L, 1);
    var t = index2addr(L, idx);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
    lvm.settable(L, t, L.stack[L.top - 1], L.stack[L.top - 2]);
    /* pop value and key */
    delete L.stack[--L.top];
    delete L.stack[--L.top];
};

var lua_rawset = function lua_rawset(L, idx) {
    api_checknelems(L, 2);
    var o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    var k = L.stack[L.top - 2];
    var v = L.stack[L.top - 1];
    if (v.ttisnil()) {
        ltable.luaH_delete(L, o.value, k);
    } else {
        var slot = ltable.luaH_set(L, o.value, k);
        slot.setfrom(v);
    }
    ltable.invalidateTMcache(o.value);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
};

var lua_rawseti = function lua_rawseti(L, idx, n) {
    fengari_argcheckinteger(n);
    api_checknelems(L, 1);
    var o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    ltable.luaH_setint(o.value, n, L.stack[L.top - 1]);
    delete L.stack[--L.top];
};

var lua_rawsetp = function lua_rawsetp(L, idx, p) {
    api_checknelems(L, 1);
    var o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    var k = new TValue(LUA_TLIGHTUSERDATA, p);
    var v = L.stack[L.top - 1];
    if (v.ttisnil()) {
        ltable.luaH_delete(L, o.value, k);
    } else {
        var slot = ltable.luaH_set(L, o.value, k);
        slot.setfrom(v);
    }
    delete L.stack[--L.top];
};

/*
** get functions (Lua -> stack)
*/

var auxgetstr = function auxgetstr(L, t, k) {
    var str = luaS_new(L, from_userstring(k));
    lobject.pushsvalue2s(L, str);
    api_check(L, L.top <= L.ci.top, "stack overflow");
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
};

var lua_rawgeti = function lua_rawgeti(L, idx, n) {
    var t = index2addr(L, idx);
    fengari_argcheckinteger(n);
    api_check(L, t.ttistable(), "table expected");
    lobject.pushobj2s(L, ltable.luaH_getint(t.value, n));
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return L.stack[L.top - 1].ttnov();
};

var lua_rawgetp = function lua_rawgetp(L, idx, p) {
    var t = index2addr(L, idx);
    api_check(L, t.ttistable(), "table expected");
    var k = new TValue(LUA_TLIGHTUSERDATA, p);
    lobject.pushobj2s(L, ltable.luaH_get(L, t.value, k));
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return L.stack[L.top - 1].ttnov();
};

var lua_rawget = function lua_rawget(L, idx) {
    var t = index2addr(L, idx);
    api_check(L, t.ttistable(t), "table expected");
    lobject.setobj2s(L, L.top - 1, ltable.luaH_get(L, t.value, L.stack[L.top - 1]));
    return L.stack[L.top - 1].ttnov();
};

// narray and nrec are mostly useless for this implementation
var lua_createtable = function lua_createtable(L, narray, nrec) {
    var t = new lobject.TValue(LUA_TTABLE, ltable.luaH_new(L));
    L.stack[L.top] = t;
    api_incr_top(L);
};

var luaS_newudata = function luaS_newudata(L, size) {
    return new lobject.Udata(L, size);
};

var lua_newuserdata = function lua_newuserdata(L, size) {
    var u = luaS_newudata(L, size);
    L.stack[L.top] = new lobject.TValue(LUA_TUSERDATA, u);
    api_incr_top(L);
    return u.data;
};

var aux_upvalue = function aux_upvalue(L, fi, n) {
    fengari_argcheckinteger(n);
    switch (fi.ttype()) {
        case LUA_TCCL:
            {
                /* C closure */
                var f = fi.value;
                if (!(1 <= n && n <= f.nupvalues)) return null;
                return {
                    name: to_luastring("", true),
                    val: f.upvalue[n - 1]
                };
            }
        case LUA_TLCL:
            {
                /* Lua closure */
                var _f = fi.value;
                var p = _f.p;
                if (!(1 <= n && n <= p.upvalues.length)) return null;
                var name = p.upvalues[n - 1].name;
                return {
                    name: name ? name.getstr() : to_luastring("(*no name)", true),
                    val: _f.upvals[n - 1]
                };
            }
        default:
            return null; /* not a closure */
    }
};

var lua_getupvalue = function lua_getupvalue(L, funcindex, n) {
    var up = aux_upvalue(L, index2addr(L, funcindex), n);
    if (up) {
        var name = up.name;
        var val = up.val;
        lobject.pushobj2s(L, val);
        api_check(L, L.top <= L.ci.top, "stack overflow");
        return name;
    }
    return null;
};

var lua_setupvalue = function lua_setupvalue(L, funcindex, n) {
    var fi = index2addr(L, funcindex);
    api_checknelems(L, 1);
    var aux = aux_upvalue(L, fi, n);
    if (aux) {
        var name = aux.name;
        var val = aux.val;
        val.setfrom(L.stack[L.top - 1]);
        delete L.stack[--L.top];
        return name;
    }
    return null;
};

var lua_newtable = function lua_newtable(L) {
    lua_createtable(L, 0, 0);
};

var lua_register = function lua_register(L, n, f) {
    lua_pushcfunction(L, f);
    lua_setglobal(L, n);
};

var lua_getmetatable = function lua_getmetatable(L, objindex) {
    var obj = index2addr(L, objindex);
    var mt = void 0;
    var res = false;
    switch (obj.ttnov()) {
        case LUA_TTABLE:
        case LUA_TUSERDATA:
            mt = obj.value.metatable;
            break;
        default:
            mt = L.l_G.mt[obj.ttnov()];
            break;
    }

    if (mt !== null && mt !== undefined) {
        L.stack[L.top] = new TValue(LUA_TTABLE, mt);
        api_incr_top(L);
        res = true;
    }

    return res;
};

var lua_getuservalue = function lua_getuservalue(L, idx) {
    var o = index2addr(L, idx);
    api_check(L, o.ttisfulluserdata(), "full userdata expected");
    var uv = o.value.uservalue;
    L.stack[L.top] = new TValue(uv.type, uv.value);
    api_incr_top(L);
    return L.stack[L.top - 1].ttnov();
};

var lua_gettable = function lua_gettable(L, idx) {
    var t = index2addr(L, idx);
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
};

var lua_getfield = function lua_getfield(L, idx, k) {
    return auxgetstr(L, index2addr(L, idx), k);
};

var lua_geti = function lua_geti(L, idx, n) {
    var t = index2addr(L, idx);
    fengari_argcheckinteger(n);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
};

var lua_getglobal = function lua_getglobal(L, name) {
    return auxgetstr(L, ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS), name);
};

/*
** access functions (stack -> JS)
*/

var lua_toboolean = function lua_toboolean(L, idx) {
    var o = index2addr(L, idx);
    return !o.l_isfalse();
};

var lua_tolstring = function lua_tolstring(L, idx) {
    var o = index2addr(L, idx);

    if (!o.ttisstring()) {
        if (!lvm.cvt2str(o)) {
            /* not convertible? */
            return null;
        }
        lobject.luaO_tostring(L, o);
    }
    return o.svalue();
};

var lua_tostring = lua_tolstring;

var lua_tojsstring = function lua_tojsstring(L, idx) {
    var o = index2addr(L, idx);

    if (!o.ttisstring()) {
        if (!lvm.cvt2str(o)) {
            /* not convertible? */
            return null;
        }
        lobject.luaO_tostring(L, o);
    }
    return o.jsstring();
};

var lua_todataview = function lua_todataview(L, idx) {
    var u8 = lua_tolstring(L, idx);
    return new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
};

var lua_rawlen = function lua_rawlen(L, idx) {
    var o = index2addr(L, idx);
    switch (o.ttype()) {
        case LUA_TSHRSTR:
        case LUA_TLNGSTR:
            return o.vslen();
        case LUA_TUSERDATA:
            return o.value.len;
        case LUA_TTABLE:
            return ltable.luaH_getn(o.value);
        default:
            return 0;
    }
};

var lua_tocfunction = function lua_tocfunction(L, idx) {
    var o = index2addr(L, idx);
    if (o.ttislcf() || o.ttisCclosure()) return o.value;else return null; /* not a C function */
};

var lua_tointeger = function lua_tointeger(L, idx) {
    var n = lua_tointegerx(L, idx);
    return n === false ? 0 : n;
};

var lua_tointegerx = function lua_tointegerx(L, idx) {
    return lvm.tointeger(index2addr(L, idx));
};

var lua_tonumber = function lua_tonumber(L, idx) {
    var n = lua_tonumberx(L, idx);
    return n === false ? 0 : n;
};

var lua_tonumberx = function lua_tonumberx(L, idx) {
    return lvm.tonumber(index2addr(L, idx));
};

var lua_touserdata = function lua_touserdata(L, idx) {
    var o = index2addr(L, idx);
    switch (o.ttnov()) {
        case LUA_TUSERDATA:
            return o.value.data;
        case LUA_TLIGHTUSERDATA:
            return o.value;
        default:
            return null;
    }
};

var lua_tothread = function lua_tothread(L, idx) {
    var o = index2addr(L, idx);
    return o.ttisthread() ? o.value : null;
};

var lua_topointer = function lua_topointer(L, idx) {
    var o = index2addr(L, idx);
    switch (o.ttype()) {
        case LUA_TTABLE:
        case LUA_TLCL:
        case LUA_TCCL:
        case LUA_TLCF:
        case LUA_TTHREAD:
        case LUA_TUSERDATA: /* note: this differs in behaviour to reference lua implementation */
        case LUA_TLIGHTUSERDATA:
            return o.value;
        default:
            return null;
    }
};

/* A proxy is a function that the same lua value to the given lua state. */

/* Having a weakmap of created proxies was only way I could think of to provide an 'isproxy' function */
var seen = new WeakMap();

/* is the passed object a proxy? is it from the given state? (if passed) */
var lua_isproxy = function lua_isproxy(p, L) {
    var G = seen.get(p);
    if (!G) return false;
    return L === null || L.l_G === G;
};

/* Use 'create_proxy' helper function so that 'L' is not in scope */
var create_proxy = function create_proxy(G, type, value) {
    var proxy = function proxy(L) {
        api_check(L, L instanceof lstate.lua_State && G === L.l_G, "must be from same global state");
        L.stack[L.top] = new TValue(type, value);
        api_incr_top(L);
    };
    seen.set(proxy, G);
    return proxy;
};

var lua_toproxy = function lua_toproxy(L, idx) {
    var tv = index2addr(L, idx);
    /* pass broken down tv incase it is an upvalue index */
    return create_proxy(L.l_G, tv.type, tv.value);
};

var lua_compare = function lua_compare(L, index1, index2, op) {
    var o1 = index2addr(L, index1);
    var o2 = index2addr(L, index2);

    var i = 0;

    if (isvalid(o1) && isvalid(o2)) {
        switch (op) {
            case LUA_OPEQ:
                i = lvm.luaV_equalobj(L, o1, o2);break;
            case LUA_OPLT:
                i = lvm.luaV_lessthan(L, o1, o2);break;
            case LUA_OPLE:
                i = lvm.luaV_lessequal(L, o1, o2);break;
            default:
                api_check(L, false, "invalid option");
        }
    }

    return i;
};

var lua_stringtonumber = function lua_stringtonumber(L, s) {
    var tv = new TValue();
    var sz = lobject.luaO_str2num(s, tv);
    if (sz !== 0) {
        L.stack[L.top] = tv;
        api_incr_top(L);
    }
    return sz;
};

var f_call = function f_call(L, ud) {
    ldo.luaD_callnoyield(L, ud.funcOff, ud.nresults);
};

var lua_type = function lua_type(L, idx) {
    var o = index2addr(L, idx);
    return isvalid(o) ? o.ttnov() : LUA_TNONE;
};

var lua_typename = function lua_typename(L, t) {
    api_check(L, LUA_TNONE <= t && t < LUA_NUMTAGS, "invalid tag");
    return ltm.ttypename(t);
};

var lua_iscfunction = function lua_iscfunction(L, idx) {
    var o = index2addr(L, idx);
    return o.ttislcf(o) || o.ttisCclosure();
};

var lua_isnil = function lua_isnil(L, n) {
    return lua_type(L, n) === LUA_TNIL;
};

var lua_isboolean = function lua_isboolean(L, n) {
    return lua_type(L, n) === LUA_TBOOLEAN;
};

var lua_isnone = function lua_isnone(L, n) {
    return lua_type(L, n) === LUA_TNONE;
};

var lua_isnoneornil = function lua_isnoneornil(L, n) {
    return lua_type(L, n) <= 0;
};

var lua_istable = function lua_istable(L, idx) {
    return index2addr(L, idx).ttistable();
};

var lua_isinteger = function lua_isinteger(L, idx) {
    return index2addr(L, idx).ttisinteger();
};

var lua_isnumber = function lua_isnumber(L, idx) {
    return lvm.tonumber(index2addr(L, idx)) !== false;
};

var lua_isstring = function lua_isstring(L, idx) {
    var o = index2addr(L, idx);
    return o.ttisstring() || lvm.cvt2str(o);
};

var lua_isuserdata = function lua_isuserdata(L, idx) {
    var o = index2addr(L, idx);
    return o.ttisfulluserdata(o) || o.ttislightuserdata();
};

var lua_isthread = function lua_isthread(L, idx) {
    return lua_type(L, idx) === LUA_TTHREAD;
};

var lua_isfunction = function lua_isfunction(L, idx) {
    return lua_type(L, idx) === LUA_TFUNCTION;
};

var lua_islightuserdata = function lua_islightuserdata(L, idx) {
    return lua_type(L, idx) === LUA_TLIGHTUSERDATA;
};

var lua_rawequal = function lua_rawequal(L, index1, index2) {
    var o1 = index2addr(L, index1);
    var o2 = index2addr(L, index2);
    return isvalid(o1) && isvalid(o2) ? lvm.luaV_equalobj(null, o1, o2) : 0;
};

var lua_arith = function lua_arith(L, op) {
    if (op !== LUA_OPUNM && op !== LUA_OPBNOT) api_checknelems(L, 2); /* all other operations expect two operands */
    else {
            /* for unary operations, add fake 2nd operand */
            api_checknelems(L, 1);
            lobject.pushobj2s(L, L.stack[L.top - 1]);
            api_check(L, L.top <= L.ci.top, "stack overflow");
        }
    /* first operand at top - 2, second at top - 1; result go to top - 2 */
    lobject.luaO_arith(L, op, L.stack[L.top - 2], L.stack[L.top - 1], L.stack[L.top - 2]);
    delete L.stack[--L.top]; /* remove second operand */
};

/*
** 'load' and 'call' functions (run Lua code)
*/

var default_chunkname = to_luastring("?");
var lua_load = function lua_load(L, reader, data, chunkname, mode) {
    if (!chunkname) chunkname = default_chunkname;else chunkname = from_userstring(chunkname);
    if (mode !== null) mode = from_userstring(mode);
    var z = new ZIO(L, reader, data);
    var status = ldo.luaD_protectedparser(L, z, chunkname, mode);
    if (status === LUA_OK) {
        /* no errors? */
        var f = L.stack[L.top - 1].value; /* get newly created function */
        if (f.nupvalues >= 1) {
            /* does it have an upvalue? */
            /* get global table from registry */
            var gt = ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS);
            /* set global table as 1st upvalue of 'f' (may be LUA_ENV) */
            f.upvals[0].setfrom(gt);
        }
    }
    return status;
};

var lua_dump = function lua_dump(L, writer, data, strip) {
    api_checknelems(L, 1);
    var o = L.stack[L.top - 1];
    if (o.ttisLclosure()) return luaU_dump(L, o.value.p, writer, data, strip);
    return 1;
};

var lua_status = function lua_status(L) {
    return L.status;
};

var lua_setuservalue = function lua_setuservalue(L, idx) {
    api_checknelems(L, 1);
    var o = index2addr(L, idx);
    api_check(L, o.ttisfulluserdata(), "full userdata expected");
    o.value.uservalue.setfrom(L.stack[L.top - 1]);
    delete L.stack[--L.top];
};

var checkresults = function checkresults(L, na, nr) {
    api_check(L, nr === LUA_MULTRET || L.ci.top - L.top >= nr - na, "results from function overflow current stack size");
};

var lua_callk = function lua_callk(L, nargs, nresults, ctx, k) {
    api_check(L, k === null || !(L.ci.callstatus & lstate.CIST_LUA), "cannot use continuations inside hooks");
    api_checknelems(L, nargs + 1);
    api_check(L, L.status === LUA_OK, "cannot do calls on non-normal thread");
    checkresults(L, nargs, nresults);
    var func = L.top - (nargs + 1);
    if (k !== null && L.nny === 0) {
        /* need to prepare continuation? */
        L.ci.c_k = k;
        L.ci.c_ctx = ctx;
        ldo.luaD_call(L, func, nresults);
    } else {
        /* no continuation or no yieldable */
        ldo.luaD_callnoyield(L, func, nresults);
    }

    if (nresults === LUA_MULTRET && L.ci.top < L.top) L.ci.top = L.top;
};

var lua_call = function lua_call(L, n, r) {
    lua_callk(L, n, r, 0, null);
};

var lua_pcallk = function lua_pcallk(L, nargs, nresults, errfunc, ctx, k) {
    api_check(L, k === null || !(L.ci.callstatus & lstate.CIST_LUA), "cannot use continuations inside hooks");
    api_checknelems(L, nargs + 1);
    api_check(L, L.status === LUA_OK, "cannot do calls on non-normal thread");
    checkresults(L, nargs, nresults);
    var status = void 0;
    var func = void 0;
    if (errfunc === 0) func = 0;else {
        func = index2addr_(L, errfunc);
    }
    var funcOff = L.top - (nargs + 1); /* function to be called */
    if (k === null || L.nny > 0) {
        /* no continuation or no yieldable? */
        var c = {
            funcOff: funcOff,
            nresults: nresults /* do a 'conventional' protected call */
        };
        status = ldo.luaD_pcall(L, f_call, c, funcOff, func);
    } else {
        /* prepare continuation (call is already protected by 'resume') */
        var ci = L.ci;
        ci.c_k = k; /* prepare continuation (call is already protected by 'resume') */
        ci.c_ctx = ctx; /* prepare continuation (call is already protected by 'resume') */
        /* save information for error recovery */
        ci.extra = funcOff;
        ci.c_old_errfunc = L.errfunc;
        L.errfunc = func;
        ci.callstatus &= ~lstate.CIST_OAH | L.allowhook;
        ci.callstatus |= lstate.CIST_YPCALL; /* function can do error recovery */
        ldo.luaD_call(L, funcOff, nresults); /* do the call */
        ci.callstatus &= ~lstate.CIST_YPCALL;
        L.errfunc = ci.c_old_errfunc;
        status = LUA_OK;
    }

    if (nresults === LUA_MULTRET && L.ci.top < L.top) L.ci.top = L.top;

    return status;
};

var lua_pcall = function lua_pcall(L, n, r, f) {
    return lua_pcallk(L, n, r, f, 0, null);
};

/*
** miscellaneous functions
*/

var lua_error = function lua_error(L) {
    api_checknelems(L, 1);
    ldebug.luaG_errormsg(L);
};

var lua_next = function lua_next(L, idx) {
    var t = index2addr(L, idx);
    api_check(L, t.ttistable(), "table expected");
    L.stack[L.top] = new TValue();
    var more = ltable.luaH_next(L, t.value, L.top - 1);
    if (more) {
        api_incr_top(L);
        return 1;
    } else {
        delete L.stack[L.top];
        delete L.stack[--L.top];
        return 0;
    }
};

var lua_concat = function lua_concat(L, n) {
    api_checknelems(L, n);
    if (n >= 2) lvm.luaV_concat(L, n);else if (n === 0) {
        lobject.pushsvalue2s(L, luaS_bless(L, to_luastring("", true)));
        api_check(L, L.top <= L.ci.top, "stack overflow");
    }
};

var lua_len = function lua_len(L, idx) {
    var t = index2addr(L, idx);
    var tv = new TValue();
    lvm.luaV_objlen(L, tv, t);
    L.stack[L.top] = tv;
    api_incr_top(L);
};

var getupvalref = function getupvalref(L, fidx, n) {
    var fi = index2addr(L, fidx);
    api_check(L, fi.ttisLclosure(), "Lua function expected");
    var f = fi.value;
    fengari_argcheckinteger(n);
    api_check(L, 1 <= n && n <= f.p.upvalues.length, "invalid upvalue index");
    return {
        f: f,
        i: n - 1
    };
};

var lua_upvalueid = function lua_upvalueid(L, fidx, n) {
    var fi = index2addr(L, fidx);
    switch (fi.ttype()) {
        case LUA_TLCL:
            {
                /* lua closure */
                var ref = getupvalref(L, fidx, n);
                return ref.f.upvals[ref.i];
            }
        case LUA_TCCL:
            {
                /* C closure */
                var f = fi.value;
                api_check(L, n | 0 === n && 1 <= n && n <= f.nupvalues, "invalid upvalue index");
                return f.upvalue[n - 1];
            }
        default:
            {
                api_check(L, false, "closure expected");
                return null;
            }
    }
};

var lua_upvaluejoin = function lua_upvaluejoin(L, fidx1, n1, fidx2, n2) {
    var ref1 = getupvalref(L, fidx1, n1);
    var ref2 = getupvalref(L, fidx2, n2);
    var up2 = ref2.f.upvals[ref2.i];
    ref1.f.upvals[ref1.i] = up2;
};

// This functions are only there for compatibility purposes
var lua_gc = function lua_gc() {};

var lua_getallocf = function lua_getallocf() {
    console.warn("lua_getallocf is not available");
    return 0;
};

var lua_setallocf = function lua_setallocf() {
    console.warn("lua_setallocf is not available");
    return 0;
};

var lua_getextraspace = function lua_getextraspace() {
    console.warn("lua_getextraspace is not available");
    return 0;
};

module.exports.api_incr_top = api_incr_top;
module.exports.api_checknelems = api_checknelems;
module.exports.lua_absindex = lua_absindex;
module.exports.lua_arith = lua_arith;
module.exports.lua_atpanic = lua_atpanic;
module.exports.lua_atnativeerror = lua_atnativeerror;
module.exports.lua_call = lua_call;
module.exports.lua_callk = lua_callk;
module.exports.lua_checkstack = lua_checkstack;
module.exports.lua_compare = lua_compare;
module.exports.lua_concat = lua_concat;
module.exports.lua_copy = lua_copy;
module.exports.lua_createtable = lua_createtable;
module.exports.lua_dump = lua_dump;
module.exports.lua_error = lua_error;
module.exports.lua_gc = lua_gc;
module.exports.lua_getallocf = lua_getallocf;
module.exports.lua_getextraspace = lua_getextraspace;
module.exports.lua_getfield = lua_getfield;
module.exports.lua_getglobal = lua_getglobal;
module.exports.lua_geti = lua_geti;
module.exports.lua_getmetatable = lua_getmetatable;
module.exports.lua_gettable = lua_gettable;
module.exports.lua_gettop = lua_gettop;
module.exports.lua_getupvalue = lua_getupvalue;
module.exports.lua_getuservalue = lua_getuservalue;
module.exports.lua_insert = lua_insert;
module.exports.lua_isboolean = lua_isboolean;
module.exports.lua_iscfunction = lua_iscfunction;
module.exports.lua_isfunction = lua_isfunction;
module.exports.lua_isinteger = lua_isinteger;
module.exports.lua_islightuserdata = lua_islightuserdata;
module.exports.lua_isnil = lua_isnil;
module.exports.lua_isnone = lua_isnone;
module.exports.lua_isnoneornil = lua_isnoneornil;
module.exports.lua_isnumber = lua_isnumber;
module.exports.lua_isproxy = lua_isproxy;
module.exports.lua_isstring = lua_isstring;
module.exports.lua_istable = lua_istable;
module.exports.lua_isthread = lua_isthread;
module.exports.lua_isuserdata = lua_isuserdata;
module.exports.lua_len = lua_len;
module.exports.lua_load = lua_load;
module.exports.lua_newtable = lua_newtable;
module.exports.lua_newuserdata = lua_newuserdata;
module.exports.lua_next = lua_next;
module.exports.lua_pcall = lua_pcall;
module.exports.lua_pcallk = lua_pcallk;
module.exports.lua_pop = lua_pop;
module.exports.lua_pushboolean = lua_pushboolean;
module.exports.lua_pushcclosure = lua_pushcclosure;
module.exports.lua_pushcfunction = lua_pushcfunction;
module.exports.lua_pushfstring = lua_pushfstring;
module.exports.lua_pushglobaltable = lua_pushglobaltable;
module.exports.lua_pushinteger = lua_pushinteger;
module.exports.lua_pushjsclosure = lua_pushjsclosure;
module.exports.lua_pushjsfunction = lua_pushjsfunction;
module.exports.lua_pushlightuserdata = lua_pushlightuserdata;
module.exports.lua_pushliteral = lua_pushliteral;
module.exports.lua_pushlstring = lua_pushlstring;
module.exports.lua_pushnil = lua_pushnil;
module.exports.lua_pushnumber = lua_pushnumber;
module.exports.lua_pushstring = lua_pushstring;
module.exports.lua_pushthread = lua_pushthread;
module.exports.lua_pushvalue = lua_pushvalue;
module.exports.lua_pushvfstring = lua_pushvfstring;
module.exports.lua_rawequal = lua_rawequal;
module.exports.lua_rawget = lua_rawget;
module.exports.lua_rawgeti = lua_rawgeti;
module.exports.lua_rawgetp = lua_rawgetp;
module.exports.lua_rawlen = lua_rawlen;
module.exports.lua_rawset = lua_rawset;
module.exports.lua_rawseti = lua_rawseti;
module.exports.lua_rawsetp = lua_rawsetp;
module.exports.lua_register = lua_register;
module.exports.lua_remove = lua_remove;
module.exports.lua_replace = lua_replace;
module.exports.lua_rotate = lua_rotate;
module.exports.lua_setallocf = lua_setallocf;
module.exports.lua_setfield = lua_setfield;
module.exports.lua_setglobal = lua_setglobal;
module.exports.lua_seti = lua_seti;
module.exports.lua_setmetatable = lua_setmetatable;
module.exports.lua_settable = lua_settable;
module.exports.lua_settop = lua_settop;
module.exports.lua_setupvalue = lua_setupvalue;
module.exports.lua_setuservalue = lua_setuservalue;
module.exports.lua_status = lua_status;
module.exports.lua_stringtonumber = lua_stringtonumber;
module.exports.lua_toboolean = lua_toboolean;
module.exports.lua_tocfunction = lua_tocfunction;
module.exports.lua_todataview = lua_todataview;
module.exports.lua_tointeger = lua_tointeger;
module.exports.lua_tointegerx = lua_tointegerx;
module.exports.lua_tojsstring = lua_tojsstring;
module.exports.lua_tolstring = lua_tolstring;
module.exports.lua_tonumber = lua_tonumber;
module.exports.lua_tonumberx = lua_tonumberx;
module.exports.lua_topointer = lua_topointer;
module.exports.lua_toproxy = lua_toproxy;
module.exports.lua_tostring = lua_tostring;
module.exports.lua_tothread = lua_tothread;
module.exports.lua_touserdata = lua_touserdata;
module.exports.lua_type = lua_type;
module.exports.lua_typename = lua_typename;
module.exports.lua_upvalueid = lua_upvalueid;
module.exports.lua_upvaluejoin = lua_upvaluejoin;
module.exports.lua_version = lua_version;
module.exports.lua_xmove = lua_xmove;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(2),
    lua_assert = _require.lua_assert;

var MBuffer = function MBuffer() {
    _classCallCheck(this, MBuffer);

    this.buffer = null;
    this.n = 0;
};

var luaZ_buffer = function luaZ_buffer(buff) {
    return buff.buffer.subarray(0, buff.n);
};

var luaZ_buffremove = function luaZ_buffremove(buff, i) {
    buff.n -= i;
};

var luaZ_resetbuffer = function luaZ_resetbuffer(buff) {
    buff.n = 0;
};

var luaZ_resizebuffer = function luaZ_resizebuffer(L, buff, size) {
    var newbuff = new Uint8Array(size);
    if (buff.buffer) newbuff.set(buff.buffer);
    buff.buffer = newbuff;
};

var ZIO = function () {
    function ZIO(L, reader, data) {
        _classCallCheck(this, ZIO);

        this.L = L; /* Lua state (for reader) */
        lua_assert(typeof reader == "function", "ZIO requires a reader");
        this.reader = reader; /* reader function */
        this.data = data; /* additional data */
        this.n = 0; /* bytes still unread */
        this.buffer = null;
        this.off = 0; /* current position in buffer */
    }

    _createClass(ZIO, [{
        key: "zgetc",
        value: function zgetc() {
            return this.n-- > 0 ? this.buffer[this.off++] : luaZ_fill(this);
        }
    }]);

    return ZIO;
}();

var EOZ = -1;

var luaZ_fill = function luaZ_fill(z) {
    var buff = z.reader(z.L, z.data);
    if (buff === null) return EOZ;
    lua_assert(buff instanceof Uint8Array, "Should only load binary of array of bytes");
    var size = buff.length;
    if (size === 0) return EOZ;
    z.buffer = buff;
    z.off = 0;
    z.n = size - 1;
    return z.buffer[z.off++];
};

/* b should be an array-like that will be set to bytes
 * b_offset is the offset at which to start filling */
var luaZ_read = function luaZ_read(z, b, b_offset, n) {
    while (n) {
        if (z.n === 0) {
            /* no bytes in buffer? */
            if (luaZ_fill(z) === EOZ) return n; /* no more input; return number of missing bytes */
            else {
                    z.n++; /* luaZ_fill consumed first byte; put it back */
                    z.off--;
                }
        }
        var m = n <= z.n ? n : z.n; /* min. between n and z->n */
        for (var i = 0; i < m; i++) {
            b[b_offset++] = z.buffer[z.off++];
        }
        z.n -= m;
        if (z.n === 0) // remove reference to input so it can get freed
            z.buffer = null;
        n -= m;
    }

    return 0;
};

module.exports.EOZ = EOZ;
module.exports.luaZ_buffer = luaZ_buffer;
module.exports.luaZ_buffremove = luaZ_buffremove;
module.exports.luaZ_fill = luaZ_fill;
module.exports.luaZ_read = luaZ_read;
module.exports.luaZ_resetbuffer = luaZ_resetbuffer;
module.exports.luaZ_resizebuffer = luaZ_resizebuffer;
module.exports.MBuffer = MBuffer;
module.exports.ZIO = ZIO;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
@license MIT

Copyright © 2017-2018 Benoit Giannangeli
Copyright © 2017-2018 Daurnimator
Copyright © 1994–2017 Lua.org, PUC-Rio.
*/



var core = __webpack_require__(3);

module.exports.FENGARI_AUTHORS = core.FENGARI_AUTHORS;
module.exports.FENGARI_COPYRIGHT = core.FENGARI_COPYRIGHT;
module.exports.FENGARI_RELEASE = core.FENGARI_RELEASE;
module.exports.FENGARI_VERSION = core.FENGARI_VERSION;
module.exports.FENGARI_VERSION_MAJOR = core.FENGARI_VERSION_MAJOR;
module.exports.FENGARI_VERSION_MINOR = core.FENGARI_VERSION_MINOR;
module.exports.FENGARI_VERSION_NUM = core.FENGARI_VERSION_NUM;
module.exports.FENGARI_VERSION_RELEASE = core.FENGARI_VERSION_RELEASE;

module.exports.luastring_eq = core.luastring_eq;
module.exports.luastring_indexOf = core.luastring_indexOf;
module.exports.luastring_of = core.luastring_of;
module.exports.to_jsstring = core.to_jsstring;
module.exports.to_luastring = core.to_luastring;
module.exports.to_uristring = core.to_uristring;

var luaconf = __webpack_require__(4);
var lua = __webpack_require__(1);
var lauxlib = __webpack_require__(6);
var lualib = __webpack_require__(16);

module.exports.luaconf = luaconf;
module.exports.lua = lua;
module.exports.lauxlib = lauxlib;
module.exports.lualib = lualib;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_TLNGSTR = _require.constant_types.LUA_TLNGSTR,
    LUA_ERRSYNTAX = _require.thread_status.LUA_ERRSYNTAX,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    LUA_MINBUFFER = _require2.LUA_MINBUFFER,
    MAX_INT = _require2.MAX_INT,
    lua_assert = _require2.lua_assert;

var ldebug = __webpack_require__(10);
var ldo = __webpack_require__(7);

var _require3 = __webpack_require__(21),
    lisdigit = _require3.lisdigit,
    lislalnum = _require3.lislalnum,
    lislalpha = _require3.lislalpha,
    lisspace = _require3.lisspace,
    lisxdigit = _require3.lisxdigit;

var lobject = __webpack_require__(5);

var _require4 = __webpack_require__(9),
    luaS_bless = _require4.luaS_bless,
    luaS_hash = _require4.luaS_hash,
    luaS_hashlongstr = _require4.luaS_hashlongstr,
    luaS_new = _require4.luaS_new;

var ltable = __webpack_require__(8);

var _require5 = __webpack_require__(18),
    EOZ = _require5.EOZ,
    luaZ_buffer = _require5.luaZ_buffer,
    luaZ_buffremove = _require5.luaZ_buffremove,
    luaZ_resetbuffer = _require5.luaZ_resetbuffer,
    luaZ_resizebuffer = _require5.luaZ_resizebuffer;

var FIRST_RESERVED = 257;

var LUA_ENV = to_luastring("_ENV", true);

/* terminal symbols denoted by reserved words */
var TK_AND = FIRST_RESERVED;
var TK_BREAK = FIRST_RESERVED + 1;
var TK_DO = FIRST_RESERVED + 2;
var TK_ELSE = FIRST_RESERVED + 3;
var TK_ELSEIF = FIRST_RESERVED + 4;
var TK_END = FIRST_RESERVED + 5;
var TK_FALSE = FIRST_RESERVED + 6;
var TK_FOR = FIRST_RESERVED + 7;
var TK_FUNCTION = FIRST_RESERVED + 8;
var TK_GOTO = FIRST_RESERVED + 9;
var TK_IF = FIRST_RESERVED + 10;
var TK_IN = FIRST_RESERVED + 11;
var TK_LOCAL = FIRST_RESERVED + 12;
var TK_NIL = FIRST_RESERVED + 13;
var TK_NOT = FIRST_RESERVED + 14;
var TK_OR = FIRST_RESERVED + 15;
var TK_REPEAT = FIRST_RESERVED + 16;
var TK_RETURN = FIRST_RESERVED + 17;
var TK_THEN = FIRST_RESERVED + 18;
var TK_TRUE = FIRST_RESERVED + 19;
var TK_UNTIL = FIRST_RESERVED + 20;
var TK_WHILE = FIRST_RESERVED + 21;
/* other terminal symbols */
var TK_IDIV = FIRST_RESERVED + 22;
var TK_CONCAT = FIRST_RESERVED + 23;
var TK_DOTS = FIRST_RESERVED + 24;
var TK_EQ = FIRST_RESERVED + 25;
var TK_GE = FIRST_RESERVED + 26;
var TK_LE = FIRST_RESERVED + 27;
var TK_NE = FIRST_RESERVED + 28;
var TK_SHL = FIRST_RESERVED + 29;
var TK_SHR = FIRST_RESERVED + 30;
var TK_DBCOLON = FIRST_RESERVED + 31;
var TK_EOS = FIRST_RESERVED + 32;
var TK_FLT = FIRST_RESERVED + 33;
var TK_INT = FIRST_RESERVED + 34;
var TK_NAME = FIRST_RESERVED + 35;
var TK_STRING = FIRST_RESERVED + 36;

var RESERVED = {
    "TK_AND": TK_AND,
    "TK_BREAK": TK_BREAK,
    "TK_DO": TK_DO,
    "TK_ELSE": TK_ELSE,
    "TK_ELSEIF": TK_ELSEIF,
    "TK_END": TK_END,
    "TK_FALSE": TK_FALSE,
    "TK_FOR": TK_FOR,
    "TK_FUNCTION": TK_FUNCTION,
    "TK_GOTO": TK_GOTO,
    "TK_IF": TK_IF,
    "TK_IN": TK_IN,
    "TK_LOCAL": TK_LOCAL,
    "TK_NIL": TK_NIL,
    "TK_NOT": TK_NOT,
    "TK_OR": TK_OR,
    "TK_REPEAT": TK_REPEAT,
    "TK_RETURN": TK_RETURN,
    "TK_THEN": TK_THEN,
    "TK_TRUE": TK_TRUE,
    "TK_UNTIL": TK_UNTIL,
    "TK_WHILE": TK_WHILE,
    "TK_IDIV": TK_IDIV,
    "TK_CONCAT": TK_CONCAT,
    "TK_DOTS": TK_DOTS,
    "TK_EQ": TK_EQ,
    "TK_GE": TK_GE,
    "TK_LE": TK_LE,
    "TK_NE": TK_NE,
    "TK_SHL": TK_SHL,
    "TK_SHR": TK_SHR,
    "TK_DBCOLON": TK_DBCOLON,
    "TK_EOS": TK_EOS,
    "TK_FLT": TK_FLT,
    "TK_INT": TK_INT,
    "TK_NAME": TK_NAME,
    "TK_STRING": TK_STRING
};

var luaX_tokens = ["and", "break", "do", "else", "elseif", "end", "false", "for", "function", "goto", "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true", "until", "while", "//", "..", "...", "==", ">=", "<=", "~=", "<<", ">>", "::", "<eof>", "<number>", "<integer>", "<name>", "<string>"].map(function (e, i) {
    return to_luastring(e);
});

var SemInfo = function SemInfo() {
    _classCallCheck(this, SemInfo);

    this.r = NaN;
    this.i = NaN;
    this.ts = null;
};

var Token = function Token() {
    _classCallCheck(this, Token);

    this.token = NaN;
    this.seminfo = new SemInfo();
};

/* state of the lexer plus state of the parser when shared by all
   functions */


var LexState = function LexState() {
    _classCallCheck(this, LexState);

    this.current = NaN; /* current character (charint) */
    this.linenumber = NaN; /* input line counter */
    this.lastline = NaN; /* line of last token 'consumed' */
    this.t = new Token(); /* current token */
    this.lookahead = new Token(); /* look ahead token */
    this.fs = null; /* current function (parser) */
    this.L = null;
    this.z = null; /* input stream */
    this.buff = null; /* buffer for tokens */
    this.h = null; /* to reuse strings */
    this.dyd = null; /* dynamic structures used by the parser */
    this.source = null; /* current source name */
    this.envn = null; /* environment variable name */
};

var save = function save(ls, c) {
    var b = ls.buff;
    if (b.n + 1 > b.buffer.length) {
        if (b.buffer.length >= MAX_INT / 2) lexerror(ls, to_luastring("lexical element too long", true), 0);
        var newsize = b.buffer.length * 2;
        luaZ_resizebuffer(ls.L, b, newsize);
    }
    b.buffer[b.n++] = c < 0 ? 255 + c + 1 : c;
};

var luaX_token2str = function luaX_token2str(ls, token) {
    if (token < FIRST_RESERVED) {
        /* single-byte symbols? */
        return lobject.luaO_pushfstring(ls.L, to_luastring("'%c'", true), token);
    } else {
        var s = luaX_tokens[token - FIRST_RESERVED];
        if (token < TK_EOS) /* fixed format (symbols and reserved words)? */
            return lobject.luaO_pushfstring(ls.L, to_luastring("'%s'", true), s);else /* names, strings, and numerals */
            return s;
    }
};

var currIsNewline = function currIsNewline(ls) {
    return ls.current === 10 /* ('\n').charCodeAt(0) */ || ls.current === 13 /* ('\r').charCodeAt(0) */;
};

var next = function next(ls) {
    ls.current = ls.z.zgetc();
};

var save_and_next = function save_and_next(ls) {
    save(ls, ls.current);
    next(ls);
};

/*
** creates a new string and anchors it in scanner's table so that
** it will not be collected until the end of the compilation
** (by that time it should be anchored somewhere)
*/
var luaX_newstring = function luaX_newstring(ls, str) {
    var L = ls.L;
    var ts = luaS_new(L, str);
    var o = ltable.luaH_set(L, ls.h, new lobject.TValue(LUA_TLNGSTR, ts));
    if (o.ttisnil()) {
        /* not in use yet? */
        o.setbvalue(true);
    } else {
        /* string already present */
        /* HACK: Workaround lack of ltable 'keyfromval' */
        var tpair = ls.h.strong.get(luaS_hashlongstr(ts));
        lua_assert(tpair.value == o); /* fengari addition */
        ts = tpair.key.tsvalue(); /* re-use value previously stored */
    }
    return ts;
};

/*
** increment line number and skips newline sequence (any of
** \n, \r, \n\r, or \r\n)
*/
var inclinenumber = function inclinenumber(ls) {
    var old = ls.current;
    lua_assert(currIsNewline(ls));
    next(ls); /* skip '\n' or '\r' */
    if (currIsNewline(ls) && ls.current !== old) next(ls); /* skip '\n\r' or '\r\n' */
    if (++ls.linenumber >= MAX_INT) lexerror(ls, to_luastring("chunk has too many lines", true), 0);
};

var luaX_setinput = function luaX_setinput(L, ls, z, source, firstchar) {
    ls.t = {
        token: 0,
        seminfo: new SemInfo()
    };
    ls.L = L;
    ls.current = firstchar;
    ls.lookahead = {
        token: TK_EOS,
        seminfo: new SemInfo()
    };
    ls.z = z;
    ls.fs = null;
    ls.linenumber = 1;
    ls.lastline = 1;
    ls.source = source;
    ls.envn = luaS_bless(L, LUA_ENV);
    luaZ_resizebuffer(L, ls.buff, LUA_MINBUFFER); /* initialize buffer */
};

var check_next1 = function check_next1(ls, c) {
    if (ls.current === c) {
        next(ls);
        return true;
    }

    return false;
};

/*
** Check whether current char is in set 'set' (with two chars) and
** saves it
*/
var check_next2 = function check_next2(ls, set) {
    if (ls.current === set[0].charCodeAt(0) || ls.current === set[1].charCodeAt(0)) {
        save_and_next(ls);
        return true;
    }

    return false;
};

var read_numeral = function read_numeral(ls, seminfo) {
    var expo = "Ee";
    var first = ls.current;
    lua_assert(lisdigit(ls.current));
    save_and_next(ls);
    if (first === 48 /* ('0').charCodeAt(0) */ && check_next2(ls, "xX")) /* hexadecimal? */
        expo = "Pp";

    for (;;) {
        if (check_next2(ls, expo)) /* exponent part? */
            check_next2(ls, "-+"); /* optional exponent sign */
        if (lisxdigit(ls.current)) save_and_next(ls);else if (ls.current === 46 /* ('.').charCodeAt(0) */) save_and_next(ls);else break;
    }

    // save(ls, 0);

    var obj = new lobject.TValue();
    if (lobject.luaO_str2num(luaZ_buffer(ls.buff), obj) === 0) /* format error? */
        lexerror(ls, to_luastring("malformed number", true), TK_FLT);
    if (obj.ttisinteger()) {
        seminfo.i = obj.value;
        return TK_INT;
    } else {
        lua_assert(obj.ttisfloat());
        seminfo.r = obj.value;
        return TK_FLT;
    }
};

var txtToken = function txtToken(ls, token) {
    switch (token) {
        case TK_NAME:case TK_STRING:
        case TK_FLT:case TK_INT:
            // save(ls, 0);
            return lobject.luaO_pushfstring(ls.L, to_luastring("'%s'", true), luaZ_buffer(ls.buff));
        default:
            return luaX_token2str(ls, token);
    }
};

var lexerror = function lexerror(ls, msg, token) {
    msg = ldebug.luaG_addinfo(ls.L, msg, ls.source, ls.linenumber);
    if (token) lobject.luaO_pushfstring(ls.L, to_luastring("%s near %s"), msg, txtToken(ls, token));
    ldo.luaD_throw(ls.L, LUA_ERRSYNTAX);
};

var luaX_syntaxerror = function luaX_syntaxerror(ls, msg) {
    lexerror(ls, msg, ls.t.token);
};

/*
** skip a sequence '[=*[' or ']=*]'; if sequence is well formed, return
** its number of '='s; otherwise, return a negative number (-1 iff there
** are no '='s after initial bracket)
*/
var skip_sep = function skip_sep(ls) {
    var count = 0;
    var s = ls.current;
    lua_assert(s === 91 /* ('[').charCodeAt(0) */ || s === 93 /* (']').charCodeAt(0) */);
    save_and_next(ls);
    while (ls.current === 61 /* ('=').charCodeAt(0) */) {
        save_and_next(ls);
        count++;
    }
    return ls.current === s ? count : -count - 1;
};

var read_long_string = function read_long_string(ls, seminfo, sep) {
    var line = ls.linenumber; /* initial line (for error message) */
    save_and_next(ls); /* skip 2nd '[' */

    if (currIsNewline(ls)) /* string starts with a newline? */
        inclinenumber(ls); /* skip it */

    var skip = false;
    for (; !skip;) {
        switch (ls.current) {
            case EOZ:
                {
                    /* error */
                    var what = seminfo ? "string" : "comment";
                    var msg = 'unfinished long ' + what + ' (starting at line ' + line + ')';
                    lexerror(ls, to_luastring(msg), TK_EOS);
                    break;
                }
            case 93 /* (']').charCodeAt(0) */:
                {
                    if (skip_sep(ls) === sep) {
                        save_and_next(ls); /* skip 2nd ']' */
                        skip = true;
                    }
                    break;
                }
            case 10 /* ('\n').charCodeAt(0) */:
            case 13 /* ('\r').charCodeAt(0) */:
                {
                    save(ls, 10 /* ('\n').charCodeAt(0) */);
                    inclinenumber(ls);
                    if (!seminfo) luaZ_resetbuffer(ls.buff);
                    break;
                }
            default:
                {
                    if (seminfo) save_and_next(ls);else next(ls);
                }
        }
    }

    if (seminfo) seminfo.ts = luaX_newstring(ls, ls.buff.buffer.subarray(2 + sep, ls.buff.n - (2 + sep)));
};

var esccheck = function esccheck(ls, c, msg) {
    if (!c) {
        if (ls.current !== EOZ) save_and_next(ls); /* add current to buffer for error message */
        lexerror(ls, msg, TK_STRING);
    }
};

var gethexa = function gethexa(ls) {
    save_and_next(ls);
    esccheck(ls, lisxdigit(ls.current), to_luastring("hexadecimal digit expected", true));
    return lobject.luaO_hexavalue(ls.current);
};

var readhexaesc = function readhexaesc(ls) {
    var r = gethexa(ls);
    r = (r << 4) + gethexa(ls);
    luaZ_buffremove(ls.buff, 2); /* remove saved chars from buffer */
    return r;
};

var readutf8desc = function readutf8desc(ls) {
    var i = 4; /* chars to be removed: '\', 'u', '{', and first digit */
    save_and_next(ls); /* skip 'u' */
    esccheck(ls, ls.current === 123 /* ('{').charCodeAt(0) */, to_luastring("missing '{'", true));
    var r = gethexa(ls); /* must have at least one digit */

    save_and_next(ls);
    while (lisxdigit(ls.current)) {
        i++;
        r = (r << 4) + lobject.luaO_hexavalue(ls.current);
        esccheck(ls, r <= 0x10FFFF, to_luastring("UTF-8 value too large", true));
        save_and_next(ls);
    }
    esccheck(ls, ls.current === 125 /* ('}').charCodeAt(0) */, to_luastring("missing '}'", true));
    next(ls); /* skip '}' */
    luaZ_buffremove(ls.buff, i); /* remove saved chars from buffer */
    return r;
};

var utf8esc = function utf8esc(ls) {
    var buff = new Uint8Array(lobject.UTF8BUFFSZ);
    var n = lobject.luaO_utf8esc(buff, readutf8desc(ls));
    for (; n > 0; n--) {
        /* add 'buff' to string */
        save(ls, buff[lobject.UTF8BUFFSZ - n]);
    }
};

var readdecesc = function readdecesc(ls) {
    var r = 0; /* result accumulator */
    var i = void 0;
    for (i = 0; i < 3 && lisdigit(ls.current); i++) {
        /* read up to 3 digits */
        r = 10 * r + ls.current - 48 /* ('0').charCodeAt(0) */;
        save_and_next(ls);
    }
    esccheck(ls, r <= 255, to_luastring("decimal escape too large", true));
    luaZ_buffremove(ls.buff, i); /* remove read digits from buffer */
    return r;
};

var read_string = function read_string(ls, del, seminfo) {
    save_and_next(ls); /* keep delimiter (for error messages) */

    while (ls.current !== del) {
        switch (ls.current) {
            case EOZ:
                lexerror(ls, to_luastring("unfinished string", true), TK_EOS);
                break;
            case 10 /* ('\n').charCodeAt(0) */:
            case 13 /* ('\r').charCodeAt(0) */:
                lexerror(ls, to_luastring("unfinished string", true), TK_STRING);
                break;
            case 92 /* ('\\').charCodeAt(0) */:
                {
                    /* escape sequences */
                    save_and_next(ls); /* keep '\\' for error messages */
                    var will = void 0;
                    var c = void 0;
                    switch (ls.current) {
                        case 97 /* ('a').charCodeAt(0) */:
                            c = 7 /* \a isn't valid JS */;will = 'read_save';break;
                        case 98 /* ('b').charCodeAt(0) */:
                            c = 8 /* ('\b').charCodeAt(0) */;will = 'read_save';break;
                        case 102 /* ('f').charCodeAt(0) */:
                            c = 12 /* ('\f').charCodeAt(0) */;will = 'read_save';break;
                        case 110 /* ('n').charCodeAt(0) */:
                            c = 10 /* ('\n').charCodeAt(0) */;will = 'read_save';break;
                        case 114 /* ('r').charCodeAt(0) */:
                            c = 13 /* ('\r').charCodeAt(0) */;will = 'read_save';break;
                        case 116 /* ('t').charCodeAt(0) */:
                            c = 9 /* ('\t').charCodeAt(0) */;will = 'read_save';break;
                        case 118 /* ('v').charCodeAt(0) */:
                            c = 11 /* ('\v').charCodeAt(0) */;will = 'read_save';break;
                        case 120 /* ('x').charCodeAt(0) */:
                            c = readhexaesc(ls);will = 'read_save';break;
                        case 117 /* ('u').charCodeAt(0) */:
                            utf8esc(ls);will = 'no_save';break;
                        case 10 /* ('\n').charCodeAt(0) */:
                        case 13 /* ('\r').charCodeAt(0) */:
                            inclinenumber(ls);c = 10 /* ('\n').charCodeAt(0) */;will = 'only_save';break;
                        case 92 /* ('\\').charCodeAt(0) */:
                        case 34 /* ('"').charCodeAt(0) */:
                        case 39 /* ('\'').charCodeAt(0) */:
                            c = ls.current;will = 'read_save';break;
                        case EOZ:
                            will = 'no_save';break; /* will raise an error next loop */
                        case 122 /* ('z').charCodeAt(0) */:
                            {
                                /* zap following span of spaces */
                                luaZ_buffremove(ls.buff, 1); /* remove '\\' */
                                next(ls); /* skip the 'z' */
                                while (lisspace(ls.current)) {
                                    if (currIsNewline(ls)) inclinenumber(ls);else next(ls);
                                }
                                will = 'no_save';break;
                            }
                        default:
                            {
                                esccheck(ls, lisdigit(ls.current), to_luastring("invalid escape sequence", true));
                                c = readdecesc(ls); /* digital escape '\ddd' */
                                will = 'only_save';break;
                            }
                    }

                    if (will === 'read_save') next(ls);

                    if (will === 'read_save' || will === 'only_save') {
                        luaZ_buffremove(ls.buff, 1); /* remove '\\' */
                        save(ls, c);
                    }

                    break;
                }
            default:
                save_and_next(ls);
        }
    }
    save_and_next(ls); /* skip delimiter */

    seminfo.ts = luaX_newstring(ls, ls.buff.buffer.subarray(1, ls.buff.n - 1));
};

var token_to_index = Object.create(null); /* don't want to return true for e.g. 'hasOwnProperty' */
luaX_tokens.forEach(function (e, i) {
    return token_to_index[luaS_hash(e)] = i;
});

var isreserved = function isreserved(w) {
    var kidx = token_to_index[luaS_hashlongstr(w)];
    return kidx !== void 0 && kidx <= 22;
};

var llex = function llex(ls, seminfo) {
    luaZ_resetbuffer(ls.buff);
    for (;;) {
        lua_assert(typeof ls.current == "number"); /* fengari addition */
        switch (ls.current) {
            case 10 /* ('\n').charCodeAt(0) */:
            case 13 /* ('\r').charCodeAt(0) */:
                {
                    /* line breaks */
                    inclinenumber(ls);
                    break;
                }
            case 32 /* (' ').charCodeAt(0) */:
            case 12 /* ('\f').charCodeAt(0) */:
            case 9 /* ('\t').charCodeAt(0) */:
            case 11 /* ('\v').charCodeAt(0) */:
                {
                    /* spaces */
                    next(ls);
                    break;
                }
            case 45 /* ('-').charCodeAt(0) */:
                {
                    /* '-' or '--' (comment) */
                    next(ls);
                    if (ls.current !== 45 /* ('-').charCodeAt(0) */) return 45 /* ('-').charCodeAt(0) */;
                    /* else is a comment */
                    next(ls);
                    if (ls.current === 91 /* ('[').charCodeAt(0) */) {
                            /* long comment? */
                            var sep = skip_sep(ls);
                            luaZ_resetbuffer(ls.buff); /* 'skip_sep' may dirty the buffer */
                            if (sep >= 0) {
                                read_long_string(ls, null, sep); /* skip long comment */
                                luaZ_resetbuffer(ls.buff); /* previous call may dirty the buff. */
                                break;
                            }
                        }

                    /* else short comment */
                    while (!currIsNewline(ls) && ls.current !== EOZ) {
                        next(ls);
                    } /* skip until end of line (or end of file) */
                    break;
                }
            case 91 /* ('[').charCodeAt(0) */:
                {
                    /* long string or simply '[' */
                    var _sep = skip_sep(ls);
                    if (_sep >= 0) {
                        read_long_string(ls, seminfo, _sep);
                        return TK_STRING;
                    } else if (_sep !== -1) /* '[=...' missing second bracket */
                        lexerror(ls, to_luastring("invalid long string delimiter", true), TK_STRING);
                    return 91 /* ('[').charCodeAt(0) */;
                }
            case 61 /* ('=').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 61 /* ('=').charCodeAt(0) */)) return TK_EQ;else return 61 /* ('=').charCodeAt(0) */;
                }
            case 60 /* ('<').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 61 /* ('=').charCodeAt(0) */)) return TK_LE;else if (check_next1(ls, 60 /* ('<').charCodeAt(0) */)) return TK_SHL;else return 60 /* ('<').charCodeAt(0) */;
                }
            case 62 /* ('>').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 61 /* ('=').charCodeAt(0) */)) return TK_GE;else if (check_next1(ls, 62 /* ('>').charCodeAt(0) */)) return TK_SHR;else return 62 /* ('>').charCodeAt(0) */;
                }
            case 47 /* ('/').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 47 /* ('/').charCodeAt(0) */)) return TK_IDIV;else return 47 /* ('/').charCodeAt(0) */;
                }
            case 126 /* ('~').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 61 /* ('=').charCodeAt(0) */)) return TK_NE;else return 126 /* ('~').charCodeAt(0) */;
                }
            case 58 /* (':').charCodeAt(0) */:
                {
                    next(ls);
                    if (check_next1(ls, 58 /* (':').charCodeAt(0) */)) return TK_DBCOLON;else return 58 /* (':').charCodeAt(0) */;
                }
            case 34 /* ('"').charCodeAt(0) */:
            case 39 /* ('\'').charCodeAt(0) */:
                {
                    /* short literal strings */
                    read_string(ls, ls.current, seminfo);
                    return TK_STRING;
                }
            case 46 /* ('.').charCodeAt(0) */:
                {
                    /* '.', '..', '...', or number */
                    save_and_next(ls);
                    if (check_next1(ls, 46 /* ('.').charCodeAt(0) */)) {
                        if (check_next1(ls, 46 /* ('.').charCodeAt(0) */)) return TK_DOTS; /* '...' */
                        else return TK_CONCAT; /* '..' */
                    } else if (!lisdigit(ls.current)) return 46 /* ('.').charCodeAt(0) */;else return read_numeral(ls, seminfo);
                }
            case 48 /* ('0').charCodeAt(0) */:case 49 /* ('1').charCodeAt(0) */:case 50 /* ('2').charCodeAt(0) */:case 51 /* ('3').charCodeAt(0) */:case 52 /* ('4').charCodeAt(0) */:
            case 53 /* ('5').charCodeAt(0) */:case 54 /* ('6').charCodeAt(0) */:case 55 /* ('7').charCodeAt(0) */:case 56 /* ('8').charCodeAt(0) */:case 57 /* ('9').charCodeAt(0) */:
                {
                    return read_numeral(ls, seminfo);
                }
            case EOZ:
                {
                    return TK_EOS;
                }
            default:
                {
                    if (lislalpha(ls.current)) {
                        /* identifier or reserved word? */
                        do {
                            save_and_next(ls);
                        } while (lislalnum(ls.current));
                        var ts = luaX_newstring(ls, luaZ_buffer(ls.buff));
                        seminfo.ts = ts;
                        var kidx = token_to_index[luaS_hashlongstr(ts)];
                        if (kidx !== void 0 && kidx <= 22) /* reserved word? */
                            return kidx + FIRST_RESERVED;else return TK_NAME;
                    } else {
                        /* single-char tokens (+ - / ...) */
                        var c = ls.current;
                        next(ls);
                        return c;
                    }
                }
        }
    }
};

var luaX_next = function luaX_next(ls) {
    ls.lastline = ls.linenumber;
    if (ls.lookahead.token !== TK_EOS) {
        /* is there a look-ahead token? */
        ls.t.token = ls.lookahead.token; /* use this one */
        ls.t.seminfo.i = ls.lookahead.seminfo.i;
        ls.t.seminfo.r = ls.lookahead.seminfo.r;
        ls.t.seminfo.ts = ls.lookahead.seminfo.ts;
        ls.lookahead.token = TK_EOS; /* and discharge it */
    } else ls.t.token = llex(ls, ls.t.seminfo); /* read next token */
};

var luaX_lookahead = function luaX_lookahead(ls) {
    lua_assert(ls.lookahead.token === TK_EOS);
    ls.lookahead.token = llex(ls, ls.lookahead.seminfo);
    return ls.lookahead.token;
};

module.exports.FIRST_RESERVED = FIRST_RESERVED;
module.exports.LUA_ENV = LUA_ENV;
module.exports.LexState = LexState;
module.exports.RESERVED = RESERVED;
module.exports.isreserved = isreserved;
module.exports.luaX_lookahead = luaX_lookahead;
module.exports.luaX_newstring = luaX_newstring;
module.exports.luaX_next = luaX_next;
module.exports.luaX_setinput = luaX_setinput;
module.exports.luaX_syntaxerror = luaX_syntaxerror;
module.exports.luaX_token2str = luaX_token2str;
module.exports.luaX_tokens = luaX_tokens;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    luastring_of = _require.luastring_of;

var luai_ctype_ = luastring_of(0x00, /* EOZ */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* 0. */
0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* 1. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, /* 2. */
0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, /* 3. */
0x16, 0x16, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x15, 0x15, 0x15, 0x15, 0x15, 0x15, 0x05, /* 4. */
0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, /* 5. */
0x05, 0x05, 0x05, 0x04, 0x04, 0x04, 0x04, 0x05, 0x04, 0x15, 0x15, 0x15, 0x15, 0x15, 0x15, 0x05, /* 6. */
0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, 0x05, /* 7. */
0x05, 0x05, 0x05, 0x04, 0x04, 0x04, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* 8. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* 9. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* a. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* b. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* c. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* d. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* e. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, /* f. */
0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);

var ALPHABIT = 0;
var DIGITBIT = 1;
var PRINTBIT = 2;
var SPACEBIT = 3;
var XDIGITBIT = 4;

var lisdigit = function lisdigit(c) {
    return (luai_ctype_[c + 1] & 1 << DIGITBIT) !== 0;
};

var lisxdigit = function lisxdigit(c) {
    return (luai_ctype_[c + 1] & 1 << XDIGITBIT) !== 0;
};

var lisprint = function lisprint(c) {
    return (luai_ctype_[c + 1] & 1 << PRINTBIT) !== 0;
};

var lisspace = function lisspace(c) {
    return (luai_ctype_[c + 1] & 1 << SPACEBIT) !== 0;
};

var lislalpha = function lislalpha(c) {
    return (luai_ctype_[c + 1] & 1 << ALPHABIT) !== 0;
};

var lislalnum = function lislalnum(c) {
    return (luai_ctype_[c + 1] & (1 << ALPHABIT | 1 << DIGITBIT)) !== 0;
};

module.exports.lisdigit = lisdigit;
module.exports.lislalnum = lislalnum;
module.exports.lislalpha = lislalpha;
module.exports.lisprint = lisprint;
module.exports.lisspace = lisspace;
module.exports.lisxdigit = lisxdigit;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_MULTRET = _require.LUA_MULTRET,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(32),
    _require2$BinOpr = _require2.BinOpr,
    OPR_ADD = _require2$BinOpr.OPR_ADD,
    OPR_AND = _require2$BinOpr.OPR_AND,
    OPR_BAND = _require2$BinOpr.OPR_BAND,
    OPR_BOR = _require2$BinOpr.OPR_BOR,
    OPR_BXOR = _require2$BinOpr.OPR_BXOR,
    OPR_CONCAT = _require2$BinOpr.OPR_CONCAT,
    OPR_DIV = _require2$BinOpr.OPR_DIV,
    OPR_EQ = _require2$BinOpr.OPR_EQ,
    OPR_GE = _require2$BinOpr.OPR_GE,
    OPR_GT = _require2$BinOpr.OPR_GT,
    OPR_IDIV = _require2$BinOpr.OPR_IDIV,
    OPR_LE = _require2$BinOpr.OPR_LE,
    OPR_LT = _require2$BinOpr.OPR_LT,
    OPR_MOD = _require2$BinOpr.OPR_MOD,
    OPR_MUL = _require2$BinOpr.OPR_MUL,
    OPR_NE = _require2$BinOpr.OPR_NE,
    OPR_NOBINOPR = _require2$BinOpr.OPR_NOBINOPR,
    OPR_OR = _require2$BinOpr.OPR_OR,
    OPR_POW = _require2$BinOpr.OPR_POW,
    OPR_SHL = _require2$BinOpr.OPR_SHL,
    OPR_SHR = _require2$BinOpr.OPR_SHR,
    OPR_SUB = _require2$BinOpr.OPR_SUB,
    _require2$UnOpr = _require2.UnOpr,
    OPR_BNOT = _require2$UnOpr.OPR_BNOT,
    OPR_LEN = _require2$UnOpr.OPR_LEN,
    OPR_MINUS = _require2$UnOpr.OPR_MINUS,
    OPR_NOT = _require2$UnOpr.OPR_NOT,
    OPR_NOUNOPR = _require2$UnOpr.OPR_NOUNOPR,
    NO_JUMP = _require2.NO_JUMP,
    getinstruction = _require2.getinstruction,
    luaK_checkstack = _require2.luaK_checkstack,
    luaK_codeABC = _require2.luaK_codeABC,
    luaK_codeABx = _require2.luaK_codeABx,
    luaK_codeAsBx = _require2.luaK_codeAsBx,
    luaK_codek = _require2.luaK_codek,
    luaK_concat = _require2.luaK_concat,
    luaK_dischargevars = _require2.luaK_dischargevars,
    luaK_exp2RK = _require2.luaK_exp2RK,
    luaK_exp2anyreg = _require2.luaK_exp2anyreg,
    luaK_exp2anyregup = _require2.luaK_exp2anyregup,
    luaK_exp2nextreg = _require2.luaK_exp2nextreg,
    luaK_exp2val = _require2.luaK_exp2val,
    luaK_fixline = _require2.luaK_fixline,
    luaK_getlabel = _require2.luaK_getlabel,
    luaK_goiffalse = _require2.luaK_goiffalse,
    luaK_goiftrue = _require2.luaK_goiftrue,
    luaK_indexed = _require2.luaK_indexed,
    luaK_infix = _require2.luaK_infix,
    luaK_intK = _require2.luaK_intK,
    luaK_jump = _require2.luaK_jump,
    luaK_jumpto = _require2.luaK_jumpto,
    luaK_nil = _require2.luaK_nil,
    luaK_patchclose = _require2.luaK_patchclose,
    luaK_patchlist = _require2.luaK_patchlist,
    luaK_patchtohere = _require2.luaK_patchtohere,
    luaK_posfix = _require2.luaK_posfix,
    luaK_prefix = _require2.luaK_prefix,
    luaK_reserveregs = _require2.luaK_reserveregs,
    luaK_ret = _require2.luaK_ret,
    luaK_self = _require2.luaK_self,
    luaK_setlist = _require2.luaK_setlist,
    luaK_setmultret = _require2.luaK_setmultret,
    luaK_setoneret = _require2.luaK_setoneret,
    luaK_setreturns = _require2.luaK_setreturns,
    luaK_storevar = _require2.luaK_storevar,
    luaK_stringK = _require2.luaK_stringK;

var ldo = __webpack_require__(7);
var lfunc = __webpack_require__(12);
var llex = __webpack_require__(20);

var _require3 = __webpack_require__(2),
    LUAI_MAXCCALLS = _require3.LUAI_MAXCCALLS,
    MAX_INT = _require3.MAX_INT,
    lua_assert = _require3.lua_assert;

var lobject = __webpack_require__(5);

var _require4 = __webpack_require__(15),
    _require4$OpCodesI = _require4.OpCodesI,
    OP_CALL = _require4$OpCodesI.OP_CALL,
    OP_CLOSURE = _require4$OpCodesI.OP_CLOSURE,
    OP_FORLOOP = _require4$OpCodesI.OP_FORLOOP,
    OP_FORPREP = _require4$OpCodesI.OP_FORPREP,
    OP_GETUPVAL = _require4$OpCodesI.OP_GETUPVAL,
    OP_MOVE = _require4$OpCodesI.OP_MOVE,
    OP_NEWTABLE = _require4$OpCodesI.OP_NEWTABLE,
    OP_SETTABLE = _require4$OpCodesI.OP_SETTABLE,
    OP_TAILCALL = _require4$OpCodesI.OP_TAILCALL,
    OP_TFORCALL = _require4$OpCodesI.OP_TFORCALL,
    OP_TFORLOOP = _require4$OpCodesI.OP_TFORLOOP,
    OP_VARARG = _require4$OpCodesI.OP_VARARG,
    LFIELDS_PER_FLUSH = _require4.LFIELDS_PER_FLUSH,
    SETARG_B = _require4.SETARG_B,
    SETARG_C = _require4.SETARG_C,
    SET_OPCODE = _require4.SET_OPCODE;

var _require5 = __webpack_require__(9),
    luaS_eqlngstr = _require5.luaS_eqlngstr,
    luaS_new = _require5.luaS_new,
    luaS_newliteral = _require5.luaS_newliteral;

var ltable = __webpack_require__(8);
var Proto = lfunc.Proto;
var R = llex.RESERVED;

var MAXVARS = 200;

var hasmultret = function hasmultret(k) {
    return k === expkind.VCALL || k === expkind.VVARARG;
};

var eqstr = function eqstr(a, b) {
    /* TODO: use plain equality as strings are cached */
    return luaS_eqlngstr(a, b);
};

var BlockCnt = function BlockCnt() {
    _classCallCheck(this, BlockCnt);

    this.previous = null; /* chain */
    this.firstlabel = NaN; /* index of first label in this block */
    this.firstgoto = NaN; /* index of first pending goto in this block */
    this.nactvar = NaN; /* # active locals outside the block */
    this.upval = NaN; /* true if some variable in the block is an upvalue */
    this.isloop = NaN; /* true if 'block' is a loop */
};

var expkind = {
    VVOID: 0, /* when 'expdesc' describes the last expression a list,
                 this kind means an empty list (so, no expression) */
    VNIL: 1, /* constant nil */
    VTRUE: 2, /* constant true */
    VFALSE: 3, /* constant false */
    VK: 4, /* constant in 'k'; info = index of constant in 'k' */
    VKFLT: 5, /* floating constant; nval = numerical float value */
    VKINT: 6, /* integer constant; nval = numerical integer value */
    VNONRELOC: 7, /* expression has its value in a fixed register;
                     info = result register */
    VLOCAL: 8, /* local variable; info = local register */
    VUPVAL: 9, /* upvalue variable; info = index of upvalue in 'upvalues' */
    VINDEXED: 10, /* indexed variable;
                     ind.vt = whether 't' is register or upvalue;
                     ind.t = table register or upvalue;
                     ind.idx = key's R/K index */
    VJMP: 11, /* expression is a test/comparison;
                 info = pc of corresponding jump instruction */
    VRELOCABLE: 12, /* expression can put result in any register;
                       info = instruction pc */
    VCALL: 13, /* expression is a function call; info = instruction pc */
    VVARARG: 14 /* vararg expression; info = instruction pc */
};

var vkisvar = function vkisvar(k) {
    return expkind.VLOCAL <= k && k <= expkind.VINDEXED;
};

var vkisinreg = function vkisinreg(k) {
    return k === expkind.VNONRELOC || k === expkind.VLOCAL;
};

var expdesc = function () {
    function expdesc() {
        _classCallCheck(this, expdesc);

        this.k = NaN;
        this.u = {
            ival: NaN, /* for VKINT */
            nval: NaN, /* for VKFLT */
            info: NaN, /* for generic use */
            ind: { /* for indexed variables (VINDEXED) */
                idx: NaN, /* index (R/K) */
                t: NaN, /* table (register or upvalue) */
                vt: NaN /* whether 't' is register (VLOCAL) or upvalue (VUPVAL) */
            }
        };
        this.t = NaN; /* patch list of 'exit when true' */
        this.f = NaN; /* patch list of 'exit when false' */
    }

    _createClass(expdesc, [{
        key: 'to',
        value: function to(e) {
            // Copy e content to this, cf. luaK_posfix
            this.k = e.k;
            this.u = e.u;
            this.t = e.t;
            this.f = e.f;
        }
    }]);

    return expdesc;
}();

var FuncState = function FuncState() {
    _classCallCheck(this, FuncState);

    this.f = null; /* current function header */
    this.prev = null; /* enclosing function */
    this.ls = null; /* lexical state */
    this.bl = null; /* chain of current blocks */
    this.pc = NaN; /* next position to code (equivalent to 'ncode') */
    this.lasttarget = NaN; /* 'label' of last 'jump label' */
    this.jpc = NaN; /* list of pending jumps to 'pc' */
    this.nk = NaN; /* number of elements in 'k' */
    this.np = NaN; /* number of elements in 'p' */
    this.firstlocal = NaN; /* index of first local var (in Dyndata array) */
    this.nlocvars = NaN; /* number of elements in 'f->locvars' */
    this.nactvar = NaN; /* number of active local variables */
    this.nups = NaN; /* number of upvalues */
    this.freereg = NaN; /* first free register */
};

/* description of active local variable */


var Vardesc = function Vardesc() {
    _classCallCheck(this, Vardesc);

    this.idx = NaN; /* variable index in stack */
};

/* description of pending goto statements and label statements */


var Labeldesc = function Labeldesc() {
    _classCallCheck(this, Labeldesc);

    this.name = null; /* label identifier */
    this.pc = NaN; /* position in code */
    this.line = NaN; /* line where it appeared */
    this.nactvar = NaN; /* local level where it appears in current block */
};

/* list of labels or gotos */


var Labellist = function Labellist() {
    _classCallCheck(this, Labellist);

    this.arr = []; /* array */
    this.n = NaN; /* number of entries in use */
    this.size = NaN; /* array size */
};

/* dynamic structures used by the parser */


var Dyndata = function Dyndata() {
    _classCallCheck(this, Dyndata);

    this.actvar = { /* list of active local variables */
        arr: [],
        n: NaN,
        size: NaN
    };
    this.gt = new Labellist();
    this.label = new Labellist();
};

var semerror = function semerror(ls, msg) {
    ls.t.token = 0; /* remove "near <token>" from final message */
    llex.luaX_syntaxerror(ls, msg);
};

var error_expected = function error_expected(ls, token) {
    llex.luaX_syntaxerror(ls, lobject.luaO_pushfstring(ls.L, to_luastring("%s expected", true), llex.luaX_token2str(ls, token)));
};

var errorlimit = function errorlimit(fs, limit, what) {
    var L = fs.ls.L;
    var line = fs.f.linedefined;
    var where = line === 0 ? to_luastring("main function", true) : lobject.luaO_pushfstring(L, to_luastring("function at line %d", true), line);
    var msg = lobject.luaO_pushfstring(L, to_luastring("too many %s (limit is %d) in %s", true), what, limit, where);
    llex.luaX_syntaxerror(fs.ls, msg);
};

var checklimit = function checklimit(fs, v, l, what) {
    if (v > l) errorlimit(fs, l, what);
};

var testnext = function testnext(ls, c) {
    if (ls.t.token === c) {
        llex.luaX_next(ls);
        return true;
    }

    return false;
};

var check = function check(ls, c) {
    if (ls.t.token !== c) error_expected(ls, c);
};

var checknext = function checknext(ls, c) {
    check(ls, c);
    llex.luaX_next(ls);
};

var check_condition = function check_condition(ls, c, msg) {
    if (!c) llex.luaX_syntaxerror(ls, msg);
};

var check_match = function check_match(ls, what, who, where) {
    if (!testnext(ls, what)) {
        if (where === ls.linenumber) error_expected(ls, what);else llex.luaX_syntaxerror(ls, lobject.luaO_pushfstring(ls.L, to_luastring("%s expected (to close %s at line %d)"), llex.luaX_token2str(ls, what), llex.luaX_token2str(ls, who), where));
    }
};

var str_checkname = function str_checkname(ls) {
    check(ls, R.TK_NAME);
    var ts = ls.t.seminfo.ts;
    llex.luaX_next(ls);
    return ts;
};

var init_exp = function init_exp(e, k, i) {
    e.f = e.t = NO_JUMP;
    e.k = k;
    e.u.info = i;
};

var codestring = function codestring(ls, e, s) {
    init_exp(e, expkind.VK, luaK_stringK(ls.fs, s));
};

var checkname = function checkname(ls, e) {
    codestring(ls, e, str_checkname(ls));
};

var registerlocalvar = function registerlocalvar(ls, varname) {
    var fs = ls.fs;
    var f = fs.f;
    f.locvars[fs.nlocvars] = new lobject.LocVar();
    f.locvars[fs.nlocvars].varname = varname;
    return fs.nlocvars++;
};

var new_localvar = function new_localvar(ls, name) {
    var fs = ls.fs;
    var dyd = ls.dyd;
    var reg = registerlocalvar(ls, name);
    checklimit(fs, dyd.actvar.n + 1 - fs.firstlocal, MAXVARS, to_luastring("local variables", true));
    dyd.actvar.arr[dyd.actvar.n] = new Vardesc();
    dyd.actvar.arr[dyd.actvar.n].idx = reg;
    dyd.actvar.n++;
};

var new_localvarliteral = function new_localvarliteral(ls, name) {
    new_localvar(ls, llex.luaX_newstring(ls, to_luastring(name, true)));
};

var getlocvar = function getlocvar(fs, i) {
    var idx = fs.ls.dyd.actvar.arr[fs.firstlocal + i].idx;
    lua_assert(idx < fs.nlocvars);
    return fs.f.locvars[idx];
};

var adjustlocalvars = function adjustlocalvars(ls, nvars) {
    var fs = ls.fs;
    fs.nactvar = fs.nactvar + nvars;
    for (; nvars; nvars--) {
        getlocvar(fs, fs.nactvar - nvars).startpc = fs.pc;
    }
};

var removevars = function removevars(fs, tolevel) {
    fs.ls.dyd.actvar.n -= fs.nactvar - tolevel;
    while (fs.nactvar > tolevel) {
        getlocvar(fs, --fs.nactvar).endpc = fs.pc;
    }
};

var searchupvalue = function searchupvalue(fs, name) {
    var up = fs.f.upvalues;
    for (var i = 0; i < fs.nups; i++) {
        if (eqstr(up[i].name, name)) return i;
    }
    return -1; /* not found */
};

var newupvalue = function newupvalue(fs, name, v) {
    var f = fs.f;
    checklimit(fs, fs.nups + 1, lfunc.MAXUPVAL, to_luastring("upvalues", true));
    f.upvalues[fs.nups] = {
        instack: v.k === expkind.VLOCAL,
        idx: v.u.info,
        name: name
    };
    return fs.nups++;
};

var searchvar = function searchvar(fs, n) {
    for (var i = fs.nactvar - 1; i >= 0; i--) {
        if (eqstr(n, getlocvar(fs, i).varname)) return i;
    }

    return -1;
};

/*
** Mark block where variable at given level was defined
** (to emit close instructions later).
*/
var markupval = function markupval(fs, level) {
    var bl = fs.bl;
    while (bl.nactvar > level) {
        bl = bl.previous;
    }bl.upval = 1;
};

/*
** Find variable with given name 'n'. If it is an upvalue, add this
** upvalue into all intermediate functions.
*/
var singlevaraux = function singlevaraux(fs, n, vr, base) {
    if (fs === null) /* no more levels? */
        init_exp(vr, expkind.VVOID, 0); /* default is global */
    else {
            var v = searchvar(fs, n); /* look up locals at current level */
            if (v >= 0) {
                /* found? */
                init_exp(vr, expkind.VLOCAL, v); /* variable is local */
                if (!base) markupval(fs, v); /* local will be used as an upval */
            } else {
                /* not found as local at current level; try upvalues */
                var idx = searchupvalue(fs, n); /* try existing upvalues */
                if (idx < 0) {
                    /* not found? */
                    singlevaraux(fs.prev, n, vr, 0); /* try upper levels */
                    if (vr.k === expkind.VVOID) /* not found? */
                        return; /* it is a global */
                    /* else was LOCAL or UPVAL */
                    idx = newupvalue(fs, n, vr); /* will be a new upvalue */
                }
                init_exp(vr, expkind.VUPVAL, idx); /* new or old upvalue */
            }
        }
};

var singlevar = function singlevar(ls, vr) {
    var varname = str_checkname(ls);
    var fs = ls.fs;
    singlevaraux(fs, varname, vr, 1);
    if (vr.k === expkind.VVOID) {
        /* is global name? */
        var key = new expdesc();
        singlevaraux(fs, ls.envn, vr, 1); /* get environment variable */
        lua_assert(vr.k !== expkind.VVOID); /* this one must exist */
        codestring(ls, key, varname); /* key is variable name */
        luaK_indexed(fs, vr, key); /* env[varname] */
    }
};

var adjust_assign = function adjust_assign(ls, nvars, nexps, e) {
    var fs = ls.fs;
    var extra = nvars - nexps;
    if (hasmultret(e.k)) {
        extra++; /* includes call itself */
        if (extra < 0) extra = 0;
        luaK_setreturns(fs, e, extra); /* last exp. provides the difference */
        if (extra > 1) luaK_reserveregs(fs, extra - 1);
    } else {
        if (e.k !== expkind.VVOID) luaK_exp2nextreg(fs, e); /* close last expression */
        if (extra > 0) {
            var reg = fs.freereg;
            luaK_reserveregs(fs, extra);
            luaK_nil(fs, reg, extra);
        }
    }
    if (nexps > nvars) ls.fs.freereg -= nexps - nvars; /* remove extra values */
};

var enterlevel = function enterlevel(ls) {
    var L = ls.L;
    ++L.nCcalls;
    checklimit(ls.fs, L.nCcalls, LUAI_MAXCCALLS, to_luastring("JS levels", true));
};

var leavelevel = function leavelevel(ls) {
    return ls.L.nCcalls--;
};

var closegoto = function closegoto(ls, g, label) {
    var fs = ls.fs;
    var gl = ls.dyd.gt;
    var gt = gl.arr[g];
    lua_assert(eqstr(gt.name, label.name));
    if (gt.nactvar < label.nactvar) {
        var vname = getlocvar(fs, gt.nactvar).varname;
        var msg = lobject.luaO_pushfstring(ls.L, to_luastring("<goto %s> at line %d jumps into the scope of local '%s'"), gt.name.getstr(), gt.line, vname.getstr());
        semerror(ls, msg);
    }
    luaK_patchlist(fs, gt.pc, label.pc);
    /* remove goto from pending list */
    for (var i = g; i < gl.n - 1; i++) {
        gl.arr[i] = gl.arr[i + 1];
    }gl.n--;
};

/*
** try to close a goto with existing labels; this solves backward jumps
*/
var findlabel = function findlabel(ls, g) {
    var bl = ls.fs.bl;
    var dyd = ls.dyd;
    var gt = dyd.gt.arr[g];
    /* check labels in current block for a match */
    for (var i = bl.firstlabel; i < dyd.label.n; i++) {
        var lb = dyd.label.arr[i];
        if (eqstr(lb.name, gt.name)) {
            /* correct label? */
            if (gt.nactvar > lb.nactvar && (bl.upval || dyd.label.n > bl.firstlabel)) luaK_patchclose(ls.fs, gt.pc, lb.nactvar);
            closegoto(ls, g, lb); /* close it */
            return true;
        }
    }
    return false; /* label not found; cannot close goto */
};

var newlabelentry = function newlabelentry(ls, l, name, line, pc) {
    var n = l.n;
    l.arr[n] = new Labeldesc();
    l.arr[n].name = name;
    l.arr[n].line = line;
    l.arr[n].nactvar = ls.fs.nactvar;
    l.arr[n].pc = pc;
    l.n = n + 1;
    return n;
};

/*
** check whether new label 'lb' matches any pending gotos in current
** block; solves forward jumps
*/
var findgotos = function findgotos(ls, lb) {
    var gl = ls.dyd.gt;
    var i = ls.fs.bl.firstgoto;
    while (i < gl.n) {
        if (eqstr(gl.arr[i].name, lb.name)) closegoto(ls, i, lb);else i++;
    }
};

/*
** export pending gotos to outer level, to check them against
** outer labels; if the block being exited has upvalues, and
** the goto exits the scope of any variable (which can be the
** upvalue), close those variables being exited.
*/
var movegotosout = function movegotosout(fs, bl) {
    var i = bl.firstgoto;
    var gl = fs.ls.dyd.gt;
    /* correct pending gotos to current block and try to close it
       with visible labels */
    while (i < gl.n) {
        var gt = gl.arr[i];
        if (gt.nactvar > bl.nactvar) {
            if (bl.upval) luaK_patchclose(fs, gt.pc, bl.nactvar);
            gt.nactvar = bl.nactvar;
        }
        if (!findlabel(fs.ls, i)) i++; /* move to next one */
    }
};

var enterblock = function enterblock(fs, bl, isloop) {
    bl.isloop = isloop;
    bl.nactvar = fs.nactvar;
    bl.firstlabel = fs.ls.dyd.label.n;
    bl.firstgoto = fs.ls.dyd.gt.n;
    bl.upval = 0;
    bl.previous = fs.bl;
    fs.bl = bl;
    lua_assert(fs.freereg === fs.nactvar);
};

/*
** create a label named 'break' to resolve break statements
*/
var breaklabel = function breaklabel(ls) {
    var n = luaS_newliteral(ls.L, "break");
    var l = newlabelentry(ls, ls.dyd.label, n, 0, ls.fs.pc);
    findgotos(ls, ls.dyd.label.arr[l]);
};

/*
** generates an error for an undefined 'goto'; choose appropriate
** message when label name is a reserved word (which can only be 'break')
*/
var undefgoto = function undefgoto(ls, gt) {
    var msg = llex.isreserved(gt.name) ? "<%s> at line %d not inside a loop" : "no visible label '%s' for <goto> at line %d";
    msg = lobject.luaO_pushfstring(ls.L, to_luastring(msg), gt.name.getstr(), gt.line);
    semerror(ls, msg);
};

/*
** adds a new prototype into list of prototypes
*/
var addprototype = function addprototype(ls) {
    var L = ls.L;
    var clp = new Proto(L);
    var fs = ls.fs;
    var f = fs.f; /* prototype of current function */
    f.p[fs.np++] = clp;
    return clp;
};

/*
** codes instruction to create new closure in parent function.
*/
var codeclosure = function codeclosure(ls, v) {
    var fs = ls.fs.prev;
    init_exp(v, expkind.VRELOCABLE, luaK_codeABx(fs, OP_CLOSURE, 0, fs.np - 1));
    luaK_exp2nextreg(fs, v); /* fix it at the last register */
};

var open_func = function open_func(ls, fs, bl) {
    fs.prev = ls.fs; /* linked list of funcstates */
    fs.ls = ls;
    ls.fs = fs;
    fs.pc = 0;
    fs.lasttarget = 0;
    fs.jpc = NO_JUMP;
    fs.freereg = 0;
    fs.nk = 0;
    fs.np = 0;
    fs.nups = 0;
    fs.nlocvars = 0;
    fs.nactvar = 0;
    fs.firstlocal = ls.dyd.actvar.n;
    fs.bl = null;
    var f = new Proto(ls.L);
    f = fs.f;
    f.source = ls.source;
    f.maxstacksize = 2; /* registers 0/1 are always valid */
    enterblock(fs, bl, false);
};

var leaveblock = function leaveblock(fs) {
    var bl = fs.bl;
    var ls = fs.ls;
    if (bl.previous && bl.upval) {
        /* create a 'jump to here' to close upvalues */
        var j = luaK_jump(fs);
        luaK_patchclose(fs, j, bl.nactvar);
        luaK_patchtohere(fs, j);
    }

    if (bl.isloop) breaklabel(ls); /* close pending breaks */

    fs.bl = bl.previous;
    removevars(fs, bl.nactvar);
    lua_assert(bl.nactvar === fs.nactvar);
    fs.freereg = fs.nactvar; /* free registers */
    ls.dyd.label.n = bl.firstlabel; /* remove local labels */
    if (bl.previous) /* inner block? */
        movegotosout(fs, bl); /* update pending gotos to outer block */
    else if (bl.firstgoto < ls.dyd.gt.n) /* pending gotos in outer block? */
            undefgoto(ls, ls.dyd.gt.arr[bl.firstgoto]); /* error */
};

var close_func = function close_func(ls) {
    var fs = ls.fs;
    luaK_ret(fs, 0, 0); /* final return */
    leaveblock(fs);
    lua_assert(fs.bl === null);
    ls.fs = fs.prev;
};

/*============================================================*/
/* GRAMMAR RULES */
/*============================================================*/

var block_follow = function block_follow(ls, withuntil) {
    switch (ls.t.token) {
        case R.TK_ELSE:case R.TK_ELSEIF:
        case R.TK_END:case R.TK_EOS:
            return true;
        case R.TK_UNTIL:
            return withuntil;
        default:
            return false;
    }
};

var statlist = function statlist(ls) {
    /* statlist -> { stat [';'] } */
    while (!block_follow(ls, 1)) {
        if (ls.t.token === R.TK_RETURN) {
            statement(ls);
            return; /* 'return' must be last statement */
        }
        statement(ls);
    }
};

var fieldsel = function fieldsel(ls, v) {
    /* fieldsel -> ['.' | ':'] NAME */
    var fs = ls.fs;
    var key = new expdesc();
    luaK_exp2anyregup(fs, v);
    llex.luaX_next(ls); /* skip the dot or colon */
    checkname(ls, key);
    luaK_indexed(fs, v, key);
};

var yindex = function yindex(ls, v) {
    /* index -> '[' expr ']' */
    llex.luaX_next(ls); /* skip the '[' */
    expr(ls, v);
    luaK_exp2val(ls.fs, v);
    checknext(ls, 93 /* (']').charCodeAt(0) */);
};

/*
** {======================================================================
** Rules for Constructors
** =======================================================================
*/

var ConsControl = function ConsControl() {
    _classCallCheck(this, ConsControl);

    this.v = new expdesc(); /* last list item read */
    this.t = new expdesc(); /* table descriptor */
    this.nh = NaN; /* total number of 'record' elements */
    this.na = NaN; /* total number of array elements */
    this.tostore = NaN; /* number of array elements pending to be stored */
};

var recfield = function recfield(ls, cc) {
    /* recfield -> (NAME | '['exp1']') = exp1 */
    var fs = ls.fs;
    var reg = ls.fs.freereg;
    var key = new expdesc();
    var val = new expdesc();

    if (ls.t.token === R.TK_NAME) {
        checklimit(fs, cc.nh, MAX_INT, to_luastring("items in a constructor", true));
        checkname(ls, key);
    } else /* ls->t.token === '[' */
        yindex(ls, key);
    cc.nh++;
    checknext(ls, 61 /* ('=').charCodeAt(0) */);
    var rkkey = luaK_exp2RK(fs, key);
    expr(ls, val);
    luaK_codeABC(fs, OP_SETTABLE, cc.t.u.info, rkkey, luaK_exp2RK(fs, val));
    fs.freereg = reg; /* free registers */
};

var closelistfield = function closelistfield(fs, cc) {
    if (cc.v.k === expkind.VVOID) return; /* there is no list item */
    luaK_exp2nextreg(fs, cc.v);
    cc.v.k = expkind.VVOID;
    if (cc.tostore === LFIELDS_PER_FLUSH) {
        luaK_setlist(fs, cc.t.u.info, cc.na, cc.tostore); /* flush */
        cc.tostore = 0; /* no more items pending */
    }
};

var lastlistfield = function lastlistfield(fs, cc) {
    if (cc.tostore === 0) return;
    if (hasmultret(cc.v.k)) {
        luaK_setmultret(fs, cc.v);
        luaK_setlist(fs, cc.t.u.info, cc.na, LUA_MULTRET);
        cc.na--; /* do not count last expression (unknown number of elements) */
    } else {
        if (cc.v.k !== expkind.VVOID) luaK_exp2nextreg(fs, cc.v);
        luaK_setlist(fs, cc.t.u.info, cc.na, cc.tostore);
    }
};

var listfield = function listfield(ls, cc) {
    /* listfield -> exp */
    expr(ls, cc.v);
    checklimit(ls.fs, cc.na, MAX_INT, to_luastring("items in a constructor", true));
    cc.na++;
    cc.tostore++;
};

var field = function field(ls, cc) {
    /* field -> listfield | recfield */
    switch (ls.t.token) {
        case R.TK_NAME:
            {
                /* may be 'listfield' or 'recfield' */
                if (llex.luaX_lookahead(ls) !== 61 /* ('=').charCodeAt(0) */) /* expression? */
                    listfield(ls, cc);else recfield(ls, cc);
                break;
            }
        case 91 /* ('[').charCodeAt(0) */:
            {
                recfield(ls, cc);
                break;
            }
        default:
            {
                listfield(ls, cc);
                break;
            }
    }
};

var constructor = function constructor(ls, t) {
    /* constructor -> '{' [ field { sep field } [sep] ] '}'
       sep -> ',' | ';' */
    var fs = ls.fs;
    var line = ls.linenumber;
    var pc = luaK_codeABC(fs, OP_NEWTABLE, 0, 0, 0);
    var cc = new ConsControl();
    cc.na = cc.nh = cc.tostore = 0;
    cc.t = t;
    init_exp(t, expkind.VRELOCABLE, pc);
    init_exp(cc.v, expkind.VVOID, 0); /* no value (yet) */
    luaK_exp2nextreg(ls.fs, t); /* fix it at stack top */
    checknext(ls, 123 /* ('{').charCodeAt(0) */);
    do {
        lua_assert(cc.v.k === expkind.VVOID || cc.tostore > 0);
        if (ls.t.token === 125 /* ('}').charCodeAt(0) */) break;
        closelistfield(fs, cc);
        field(ls, cc);
    } while (testnext(ls, 44 /* (',').charCodeAt(0) */) || testnext(ls, 59 /* (';').charCodeAt(0) */));
    check_match(ls, 125 /* ('}').charCodeAt(0) */, 123 /* ('{').charCodeAt(0) */, line);
    lastlistfield(fs, cc);
    SETARG_B(fs.f.code[pc], lobject.luaO_int2fb(cc.na)); /* set initial array size */
    SETARG_C(fs.f.code[pc], lobject.luaO_int2fb(cc.nh)); /* set initial table size */
};

/* }====================================================================== */

var parlist = function parlist(ls) {
    /* parlist -> [ param { ',' param } ] */
    var fs = ls.fs;
    var f = fs.f;
    var nparams = 0;
    f.is_vararg = false;
    if (ls.t.token !== 41 /* (')').charCodeAt(0) */) {
            /* is 'parlist' not empty? */
            do {
                switch (ls.t.token) {
                    case R.TK_NAME:
                        {
                            /* param -> NAME */
                            new_localvar(ls, str_checkname(ls));
                            nparams++;
                            break;
                        }
                    case R.TK_DOTS:
                        {
                            /* param -> '...' */
                            llex.luaX_next(ls);
                            f.is_vararg = true; /* declared vararg */
                            break;
                        }
                    default:
                        llex.luaX_syntaxerror(ls, to_luastring("<name> or '...' expected", true));
                }
            } while (!f.is_vararg && testnext(ls, 44 /* (',').charCodeAt(0) */));
        }
    adjustlocalvars(ls, nparams);
    f.numparams = fs.nactvar;
    luaK_reserveregs(fs, fs.nactvar); /* reserve register for parameters */
};

var body = function body(ls, e, ismethod, line) {
    /* body ->  '(' parlist ')' block END */
    var new_fs = new FuncState();
    var bl = new BlockCnt();
    new_fs.f = addprototype(ls);
    new_fs.f.linedefined = line;
    open_func(ls, new_fs, bl);
    checknext(ls, 40 /* ('(').charCodeAt(0) */);
    if (ismethod) {
        new_localvarliteral(ls, "self"); /* create 'self' parameter */
        adjustlocalvars(ls, 1);
    }
    parlist(ls);
    checknext(ls, 41 /* (')').charCodeAt(0) */);
    statlist(ls);
    new_fs.f.lastlinedefined = ls.linenumber;
    check_match(ls, R.TK_END, R.TK_FUNCTION, line);
    codeclosure(ls, e);
    close_func(ls);
};

var explist = function explist(ls, v) {
    /* explist -> expr { ',' expr } */
    var n = 1; /* at least one expression */
    expr(ls, v);
    while (testnext(ls, 44 /* (',').charCodeAt(0) */)) {
        luaK_exp2nextreg(ls.fs, v);
        expr(ls, v);
        n++;
    }
    return n;
};

var funcargs = function funcargs(ls, f, line) {
    var fs = ls.fs;
    var args = new expdesc();
    switch (ls.t.token) {
        case 40 /* ('(').charCodeAt(0) */:
            {
                /* funcargs -> '(' [ explist ] ')' */
                llex.luaX_next(ls);
                if (ls.t.token === 41 /* (')').charCodeAt(0) */) /* arg list is empty? */
                    args.k = expkind.VVOID;else {
                    explist(ls, args);
                    luaK_setmultret(fs, args);
                }
                check_match(ls, 41 /* (')').charCodeAt(0) */, 40 /* ('(').charCodeAt(0) */, line);
                break;
            }
        case 123 /* ('{').charCodeAt(0) */:
            {
                /* funcargs -> constructor */
                constructor(ls, args);
                break;
            }
        case R.TK_STRING:
            {
                /* funcargs -> STRING */
                codestring(ls, args, ls.t.seminfo.ts);
                llex.luaX_next(ls); /* must use 'seminfo' before 'next' */
                break;
            }
        default:
            {
                llex.luaX_syntaxerror(ls, to_luastring("function arguments expected", true));
            }
    }
    lua_assert(f.k === expkind.VNONRELOC);
    var nparams = void 0;
    var base = f.u.info; /* base register for call */
    if (hasmultret(args.k)) nparams = LUA_MULTRET; /* open call */
    else {
            if (args.k !== expkind.VVOID) luaK_exp2nextreg(fs, args); /* close last argument */
            nparams = fs.freereg - (base + 1);
        }
    init_exp(f, expkind.VCALL, luaK_codeABC(fs, OP_CALL, base, nparams + 1, 2));
    luaK_fixline(fs, line);
    fs.freereg = base + 1; /* call remove function and arguments and leaves (unless changed) one result */
};

/*
** {======================================================================
** Expression parsing
** =======================================================================
*/

var primaryexp = function primaryexp(ls, v) {
    /* primaryexp -> NAME | '(' expr ')' */
    switch (ls.t.token) {
        case 40 /* ('(').charCodeAt(0) */:
            {
                var line = ls.linenumber;
                llex.luaX_next(ls);
                expr(ls, v);
                check_match(ls, 41 /* (')').charCodeAt(0) */, 40 /* ('(').charCodeAt(0) */, line);
                luaK_dischargevars(ls.fs, v);
                return;
            }
        case R.TK_NAME:
            {
                singlevar(ls, v);
                return;
            }
        default:
            {
                llex.luaX_syntaxerror(ls, to_luastring("unexpected symbol", true));
            }
    }
};

var suffixedexp = function suffixedexp(ls, v) {
    /* suffixedexp ->
       primaryexp { '.' NAME | '[' exp ']' | ':' NAME funcargs | funcargs } */
    var fs = ls.fs;
    var line = ls.linenumber;
    primaryexp(ls, v);
    for (;;) {
        switch (ls.t.token) {
            case 46 /* ('.').charCodeAt(0) */:
                {
                    /* fieldsel */
                    fieldsel(ls, v);
                    break;
                }
            case 91 /* ('[').charCodeAt(0) */:
                {
                    /* '[' exp1 ']' */
                    var key = new expdesc();
                    luaK_exp2anyregup(fs, v);
                    yindex(ls, key);
                    luaK_indexed(fs, v, key);
                    break;
                }
            case 58 /* (':').charCodeAt(0) */:
                {
                    /* ':' NAME funcargs */
                    var _key = new expdesc();
                    llex.luaX_next(ls);
                    checkname(ls, _key);
                    luaK_self(fs, v, _key);
                    funcargs(ls, v, line);
                    break;
                }
            case 40 /* ('(').charCodeAt(0) */:case R.TK_STRING:case 123 /* ('{').charCodeAt(0) */:
                {
                    /* funcargs */
                    luaK_exp2nextreg(fs, v);
                    funcargs(ls, v, line);
                    break;
                }
            default:
                return;
        }
    }
};

var simpleexp = function simpleexp(ls, v) {
    /* simpleexp -> FLT | INT | STRING | NIL | TRUE | FALSE | ... |
       constructor | FUNCTION body | suffixedexp */
    switch (ls.t.token) {
        case R.TK_FLT:
            {
                init_exp(v, expkind.VKFLT, 0);
                v.u.nval = ls.t.seminfo.r;
                break;
            }
        case R.TK_INT:
            {
                init_exp(v, expkind.VKINT, 0);
                v.u.ival = ls.t.seminfo.i;
                break;
            }
        case R.TK_STRING:
            {
                codestring(ls, v, ls.t.seminfo.ts);
                break;
            }
        case R.TK_NIL:
            {
                init_exp(v, expkind.VNIL, 0);
                break;
            }
        case R.TK_TRUE:
            {
                init_exp(v, expkind.VTRUE, 0);
                break;
            }
        case R.TK_FALSE:
            {
                init_exp(v, expkind.VFALSE, 0);
                break;
            }
        case R.TK_DOTS:
            {
                /* vararg */
                var fs = ls.fs;
                check_condition(ls, fs.f.is_vararg, to_luastring("cannot use '...' outside a vararg function", true));
                init_exp(v, expkind.VVARARG, luaK_codeABC(fs, OP_VARARG, 0, 1, 0));
                break;
            }
        case 123 /* ('{').charCodeAt(0) */:
            {
                /* constructor */
                constructor(ls, v);
                return;
            }
        case R.TK_FUNCTION:
            {
                llex.luaX_next(ls);
                body(ls, v, 0, ls.linenumber);
                return;
            }
        default:
            {
                suffixedexp(ls, v);
                return;
            }
    }
    llex.luaX_next(ls);
};

var getunopr = function getunopr(op) {
    switch (op) {
        case R.TK_NOT:
            return OPR_NOT;
        case 45 /* ('-').charCodeAt(0) */:
            return OPR_MINUS;
        case 126 /* ('~').charCodeAt(0) */:
            return OPR_BNOT;
        case 35 /* ('#').charCodeAt(0) */:
            return OPR_LEN;
        default:
            return OPR_NOUNOPR;
    }
};

var getbinopr = function getbinopr(op) {
    switch (op) {
        case 43 /* ('+').charCodeAt(0) */:
            return OPR_ADD;
        case 45 /* ('-').charCodeAt(0) */:
            return OPR_SUB;
        case 42 /* ('*').charCodeAt(0) */:
            return OPR_MUL;
        case 37 /* ('%').charCodeAt(0) */:
            return OPR_MOD;
        case 94 /* ('^').charCodeAt(0) */:
            return OPR_POW;
        case 47 /* ('/').charCodeAt(0) */:
            return OPR_DIV;
        case R.TK_IDIV:
            return OPR_IDIV;
        case 38 /* ('&').charCodeAt(0) */:
            return OPR_BAND;
        case 124 /* ('|').charCodeAt(0) */:
            return OPR_BOR;
        case 126 /* ('~').charCodeAt(0) */:
            return OPR_BXOR;
        case R.TK_SHL:
            return OPR_SHL;
        case R.TK_SHR:
            return OPR_SHR;
        case R.TK_CONCAT:
            return OPR_CONCAT;
        case R.TK_NE:
            return OPR_NE;
        case R.TK_EQ:
            return OPR_EQ;
        case 60 /* ('<').charCodeAt(0) */:
            return OPR_LT;
        case R.TK_LE:
            return OPR_LE;
        case 62 /* ('>').charCodeAt(0) */:
            return OPR_GT;
        case R.TK_GE:
            return OPR_GE;
        case R.TK_AND:
            return OPR_AND;
        case R.TK_OR:
            return OPR_OR;
        default:
            return OPR_NOBINOPR;
    }
};

var priority = [/* ORDER OPR */
{ left: 10, right: 10 }, { left: 10, right: 10 }, /* '+' '-' */
{ left: 11, right: 11 }, { left: 11, right: 11 }, /* '*' '%' */
{ left: 14, right: 13 }, /* '^' (right associative) */
{ left: 11, right: 11 }, { left: 11, right: 11 }, /* '/' '//' */
{ left: 6, right: 6 }, { left: 4, right: 4 }, { left: 5, right: 5 }, /* '&' '|' '~' */
{ left: 7, right: 7 }, { left: 7, right: 7 }, /* '<<' '>>' */
{ left: 9, right: 8 }, /* '..' (right associative) */
{ left: 3, right: 3 }, { left: 3, right: 3 }, { left: 3, right: 3 }, /* ==, <, <= */
{ left: 3, right: 3 }, { left: 3, right: 3 }, { left: 3, right: 3 }, /* ~=, >, >= */
{ left: 2, right: 2 }, { left: 1, right: 1 /* and, or */
}];

var UNARY_PRIORITY = 12;

/*
** subexpr -> (simpleexp | unop subexpr) { binop subexpr }
** where 'binop' is any binary operator with a priority higher than 'limit'
*/
var subexpr = function subexpr(ls, v, limit) {
    enterlevel(ls);
    var uop = getunopr(ls.t.token);
    if (uop !== OPR_NOUNOPR) {
        var line = ls.linenumber;
        llex.luaX_next(ls);
        subexpr(ls, v, UNARY_PRIORITY);
        luaK_prefix(ls.fs, uop, v, line);
    } else simpleexp(ls, v);
    /* expand while operators have priorities higher than 'limit' */
    var op = getbinopr(ls.t.token);
    while (op !== OPR_NOBINOPR && priority[op].left > limit) {
        var v2 = new expdesc();
        var _line = ls.linenumber;
        llex.luaX_next(ls);
        luaK_infix(ls.fs, op, v);
        /* read sub-expression with higher priority */
        var nextop = subexpr(ls, v2, priority[op].right);
        luaK_posfix(ls.fs, op, v, v2, _line);
        op = nextop;
    }
    leavelevel(ls);
    return op; /* return first untreated operator */
};

var expr = function expr(ls, v) {
    subexpr(ls, v, 0);
};

/* }==================================================================== */

/*
** {======================================================================
** Rules for Statements
** =======================================================================
*/

var block = function block(ls) {
    /* block -> statlist */
    var fs = ls.fs;
    var bl = new BlockCnt();
    enterblock(fs, bl, 0);
    statlist(ls);
    leaveblock(fs);
};

/*
** structure to chain all variables in the left-hand side of an
** assignment
*/

var LHS_assign = function LHS_assign() {
    _classCallCheck(this, LHS_assign);

    this.prev = null;
    this.v = new expdesc(); /* variable (global, local, upvalue, or indexed) */
};

/*
** check whether, in an assignment to an upvalue/local variable, the
** upvalue/local variable is begin used in a previous assignment to a
** table. If so, save original upvalue/local value in a safe place and
** use this safe copy in the previous assignment.
*/


var check_conflict = function check_conflict(ls, lh, v) {
    var fs = ls.fs;
    var extra = fs.freereg; /* eventual position to save local variable */
    var conflict = false;
    for (; lh; lh = lh.prev) {
        /* check all previous assignments */
        if (lh.v.k === expkind.VINDEXED) {
            /* assigning to a table? */
            /* table is the upvalue/local being assigned now? */
            if (lh.v.u.ind.vt === v.k && lh.v.u.ind.t === v.u.info) {
                conflict = true;
                lh.v.u.ind.vt = expkind.VLOCAL;
                lh.v.u.ind.t = extra; /* previous assignment will use safe copy */
            }
            /* index is the local being assigned? (index cannot be upvalue) */
            if (v.k === expkind.VLOCAL && lh.v.u.ind.idx === v.u.info) {
                conflict = true;
                lh.v.u.ind.idx = extra; /* previous assignment will use safe copy */
            }
        }
    }
    if (conflict) {
        /* copy upvalue/local value to a temporary (in position 'extra') */
        var op = v.k === expkind.VLOCAL ? OP_MOVE : OP_GETUPVAL;
        luaK_codeABC(fs, op, extra, v.u.info, 0);
        luaK_reserveregs(fs, 1);
    }
};

var assignment = function assignment(ls, lh, nvars) {
    var e = new expdesc();
    check_condition(ls, vkisvar(lh.v.k), to_luastring("syntax error", true));
    if (testnext(ls, 44 /* (',').charCodeAt(0) */)) {
        /* assignment -> ',' suffixedexp assignment */
        var nv = new LHS_assign();
        nv.prev = lh;
        suffixedexp(ls, nv.v);
        if (nv.v.k !== expkind.VINDEXED) check_conflict(ls, lh, nv.v);
        checklimit(ls.fs, nvars + ls.L.nCcalls, LUAI_MAXCCALLS, to_luastring("JS levels", true));
        assignment(ls, nv, nvars + 1);
    } else {
        /* assignment -> '=' explist */
        checknext(ls, 61 /* ('=').charCodeAt(0) */);
        var nexps = explist(ls, e);
        if (nexps !== nvars) adjust_assign(ls, nvars, nexps, e);else {
            luaK_setoneret(ls.fs, e); /* close last expression */
            luaK_storevar(ls.fs, lh.v, e);
            return; /* avoid default */
        }
    }
    init_exp(e, expkind.VNONRELOC, ls.fs.freereg - 1); /* default assignment */
    luaK_storevar(ls.fs, lh.v, e);
};

var cond = function cond(ls) {
    /* cond -> exp */
    var v = new expdesc();
    expr(ls, v); /* read condition */
    if (v.k === expkind.VNIL) v.k = expkind.VFALSE; /* 'falses' are all equal here */
    luaK_goiftrue(ls.fs, v);
    return v.f;
};

var gotostat = function gotostat(ls, pc) {
    var line = ls.linenumber;
    var label = void 0;
    if (testnext(ls, R.TK_GOTO)) label = str_checkname(ls);else {
        llex.luaX_next(ls); /* skip break */
        label = luaS_newliteral(ls.L, "break");
    }
    var g = newlabelentry(ls, ls.dyd.gt, label, line, pc);
    findlabel(ls, g); /* close it if label already defined */
};

/* check for repeated labels on the same block */
var checkrepeated = function checkrepeated(fs, ll, label) {
    for (var i = fs.bl.firstlabel; i < ll.n; i++) {
        if (eqstr(label, ll.arr[i].name)) {
            var msg = lobject.luaO_pushfstring(fs.ls.L, to_luastring("label '%s' already defined on line %d", true), label.getstr(), ll.arr[i].line);
            semerror(fs.ls, msg);
        }
    }
};

/* skip no-op statements */
var skipnoopstat = function skipnoopstat(ls) {
    while (ls.t.token === 59 /* (';').charCodeAt(0) */ || ls.t.token === R.TK_DBCOLON) {
        statement(ls);
    }
};

var labelstat = function labelstat(ls, label, line) {
    /* label -> '::' NAME '::' */
    var fs = ls.fs;
    var ll = ls.dyd.label;
    var l = void 0; /* index of new label being created */
    checkrepeated(fs, ll, label); /* check for repeated labels */
    checknext(ls, R.TK_DBCOLON); /* skip double colon */
    /* create new entry for this label */
    l = newlabelentry(ls, ll, label, line, luaK_getlabel(fs));
    skipnoopstat(ls); /* skip other no-op statements */
    if (block_follow(ls, 0)) {
        /* label is last no-op statement in the block? */
        /* assume that locals are already out of scope */
        ll.arr[l].nactvar = fs.bl.nactvar;
    }
    findgotos(ls, ll.arr[l]);
};

var whilestat = function whilestat(ls, line) {
    /* whilestat -> WHILE cond DO block END */
    var fs = ls.fs;
    var bl = new BlockCnt();
    llex.luaX_next(ls); /* skip WHILE */
    var whileinit = luaK_getlabel(fs);
    var condexit = cond(ls);
    enterblock(fs, bl, 1);
    checknext(ls, R.TK_DO);
    block(ls);
    luaK_jumpto(fs, whileinit);
    check_match(ls, R.TK_END, R.TK_WHILE, line);
    leaveblock(fs);
    luaK_patchtohere(fs, condexit); /* false conditions finish the loop */
};

var repeatstat = function repeatstat(ls, line) {
    /* repeatstat -> REPEAT block UNTIL cond */
    var fs = ls.fs;
    var repeat_init = luaK_getlabel(fs);
    var bl1 = new BlockCnt();
    var bl2 = new BlockCnt();
    enterblock(fs, bl1, 1); /* loop block */
    enterblock(fs, bl2, 0); /* scope block */
    llex.luaX_next(ls); /* skip REPEAT */
    statlist(ls);
    check_match(ls, R.TK_UNTIL, R.TK_REPEAT, line);
    var condexit = cond(ls); /* read condition (inside scope block) */
    if (bl2.upval) /* upvalues? */
        luaK_patchclose(fs, condexit, bl2.nactvar);
    leaveblock(fs); /* finish scope */
    luaK_patchlist(fs, condexit, repeat_init); /* close the loop */
    leaveblock(fs); /* finish loop */
};

var exp1 = function exp1(ls) {
    var e = new expdesc();
    expr(ls, e);
    luaK_exp2nextreg(ls.fs, e);
    lua_assert(e.k === expkind.VNONRELOC);
    var reg = e.u.info;
    return reg;
};

var forbody = function forbody(ls, base, line, nvars, isnum) {
    /* forbody -> DO block */
    var bl = new BlockCnt();
    var fs = ls.fs;
    var endfor = void 0;
    adjustlocalvars(ls, 3); /* control variables */
    checknext(ls, R.TK_DO);
    var prep = isnum ? luaK_codeAsBx(fs, OP_FORPREP, base, NO_JUMP) : luaK_jump(fs);
    enterblock(fs, bl, 0); /* scope for declared variables */
    adjustlocalvars(ls, nvars);
    luaK_reserveregs(fs, nvars);
    block(ls);
    leaveblock(fs); /* end of scope for declared variables */
    luaK_patchtohere(fs, prep);
    if (isnum) /* end of scope for declared variables */
        endfor = luaK_codeAsBx(fs, OP_FORLOOP, base, NO_JUMP);else {
        /* generic for */
        luaK_codeABC(fs, OP_TFORCALL, base, 0, nvars);
        luaK_fixline(fs, line);
        endfor = luaK_codeAsBx(fs, OP_TFORLOOP, base + 2, NO_JUMP);
    }
    luaK_patchlist(fs, endfor, prep + 1);
    luaK_fixline(fs, line);
};

var fornum = function fornum(ls, varname, line) {
    /* fornum -> NAME = exp1,exp1[,exp1] forbody */
    var fs = ls.fs;
    var base = fs.freereg;
    new_localvarliteral(ls, "(for index)");
    new_localvarliteral(ls, "(for limit)");
    new_localvarliteral(ls, "(for step)");
    new_localvar(ls, varname);
    checknext(ls, 61 /* ('=').charCodeAt(0) */);
    exp1(ls); /* initial value */
    checknext(ls, 44 /* (',').charCodeAt(0) */);
    exp1(ls); /* limit */
    if (testnext(ls, 44 /* (',').charCodeAt(0) */)) exp1(ls); /* optional step */
    else {
            /* default step = 1 */
            luaK_codek(fs, fs.freereg, luaK_intK(fs, 1));
            luaK_reserveregs(fs, 1);
        }
    forbody(ls, base, line, 1, 1);
};

var forlist = function forlist(ls, indexname) {
    /* forlist -> NAME {,NAME} IN explist forbody */
    var fs = ls.fs;
    var e = new expdesc();
    var nvars = 4; /* gen, state, control, plus at least one declared var */
    var base = fs.freereg;
    /* create control variables */
    new_localvarliteral(ls, "(for generator)");
    new_localvarliteral(ls, "(for state)");
    new_localvarliteral(ls, "(for control)");
    /* create declared variables */
    new_localvar(ls, indexname);
    while (testnext(ls, 44 /* (',').charCodeAt(0) */)) {
        new_localvar(ls, str_checkname(ls));
        nvars++;
    }
    checknext(ls, R.TK_IN);
    var line = ls.linenumber;
    adjust_assign(ls, 3, explist(ls, e), e);
    luaK_checkstack(fs, 3); /* extra space to call generator */
    forbody(ls, base, line, nvars - 3, 0);
};

var forstat = function forstat(ls, line) {
    /* forstat -> FOR (fornum | forlist) END */
    var fs = ls.fs;
    var bl = new BlockCnt();
    enterblock(fs, bl, 1); /* scope for loop and control variables */
    llex.luaX_next(ls); /* skip 'for' */
    var varname = str_checkname(ls); /* first variable name */
    switch (ls.t.token) {
        case 61 /* ('=').charCodeAt(0) */:
            fornum(ls, varname, line);break;
        case 44 /* (',').charCodeAt(0) */:case R.TK_IN:
            forlist(ls, varname);break;
        default:
            llex.luaX_syntaxerror(ls, to_luastring("'=' or 'in' expected", true));
    }
    check_match(ls, R.TK_END, R.TK_FOR, line);
    leaveblock(fs); /* loop scope ('break' jumps to this point) */
};

var test_then_block = function test_then_block(ls, escapelist) {
    /* test_then_block -> [IF | ELSEIF] cond THEN block */
    var bl = new BlockCnt();
    var fs = ls.fs;
    var v = new expdesc();
    var jf = void 0; /* instruction to skip 'then' code (if condition is false) */

    llex.luaX_next(ls); /* skip IF or ELSEIF */
    expr(ls, v); /* read condition */
    checknext(ls, R.TK_THEN);

    if (ls.t.token === R.TK_GOTO || ls.t.token === R.TK_BREAK) {
        luaK_goiffalse(ls.fs, v); /* will jump to label if condition is true */
        enterblock(fs, bl, false); /* must enter block before 'goto' */
        gotostat(ls, v.t); /* handle goto/break */
        while (testnext(ls, 59 /* (';').charCodeAt(0) */)) {} /* skip colons */
        if (block_follow(ls, 0)) {
            /* 'goto' is the entire block? */
            leaveblock(fs);
            return escapelist; /* and that is it */
        } else /* must skip over 'then' part if condition is false */
            jf = luaK_jump(fs);
    } else {
        /* regular case (not goto/break) */
        luaK_goiftrue(ls.fs, v); /* skip over block if condition is false */
        enterblock(fs, bl, false);
        jf = v.f;
    }

    statlist(ls); /* 'then' part */
    leaveblock(fs);
    if (ls.t.token === R.TK_ELSE || ls.t.token === R.TK_ELSEIF) /* followed by 'else'/'elseif'? */
        escapelist = luaK_concat(fs, escapelist, luaK_jump(fs)); /* must jump over it */
    luaK_patchtohere(fs, jf);

    return escapelist;
};

var ifstat = function ifstat(ls, line) {
    /* ifstat -> IF cond THEN block {ELSEIF cond THEN block} [ELSE block] END */
    var fs = ls.fs;
    var escapelist = NO_JUMP; /* exit list for finished parts */
    escapelist = test_then_block(ls, escapelist); /* IF cond THEN block */
    while (ls.t.token === R.TK_ELSEIF) {
        escapelist = test_then_block(ls, escapelist);
    } /* ELSEIF cond THEN block */
    if (testnext(ls, R.TK_ELSE)) block(ls); /* 'else' part */
    check_match(ls, R.TK_END, R.TK_IF, line);
    luaK_patchtohere(fs, escapelist); /* patch escape list to 'if' end */
};

var localfunc = function localfunc(ls) {
    var b = new expdesc();
    var fs = ls.fs;
    new_localvar(ls, str_checkname(ls)); /* new local variable */
    adjustlocalvars(ls, 1); /* enter its scope */
    body(ls, b, 0, ls.linenumber); /* function created in next register */
    /* debug information will only see the variable after this point! */
    getlocvar(fs, b.u.info).startpc = fs.pc;
};

var localstat = function localstat(ls) {
    /* stat -> LOCAL NAME {',' NAME} ['=' explist] */
    var nvars = 0;
    var nexps = void 0;
    var e = new expdesc();
    do {
        new_localvar(ls, str_checkname(ls));
        nvars++;
    } while (testnext(ls, 44 /* (',').charCodeAt(0) */));
    if (testnext(ls, 61 /* ('=').charCodeAt(0) */)) nexps = explist(ls, e);else {
        e.k = expkind.VVOID;
        nexps = 0;
    }
    adjust_assign(ls, nvars, nexps, e);
    adjustlocalvars(ls, nvars);
};

var funcname = function funcname(ls, v) {
    /* funcname -> NAME {fieldsel} [':' NAME] */
    var ismethod = 0;
    singlevar(ls, v);
    while (ls.t.token === 46 /* ('.').charCodeAt(0) */) {
        fieldsel(ls, v);
    }if (ls.t.token === 58 /* (':').charCodeAt(0) */) {
            ismethod = 1;
            fieldsel(ls, v);
        }
    return ismethod;
};

var funcstat = function funcstat(ls, line) {
    /* funcstat -> FUNCTION funcname body */
    var v = new expdesc();
    var b = new expdesc();
    llex.luaX_next(ls); /* skip FUNCTION */
    var ismethod = funcname(ls, v);
    body(ls, b, ismethod, line);
    luaK_storevar(ls.fs, v, b);
    luaK_fixline(ls.fs, line); /* definition "happens" in the first line */
};

var exprstat = function exprstat(ls) {
    /* stat -> func | assignment */
    var fs = ls.fs;
    var v = new LHS_assign();
    suffixedexp(ls, v.v);
    if (ls.t.token === 61 /* ('=').charCodeAt(0) */ || ls.t.token === 44 /* (',').charCodeAt(0) */) {
            /* stat . assignment ? */
            v.prev = null;
            assignment(ls, v, 1);
        } else {
        /* stat -> func */
        check_condition(ls, v.v.k === expkind.VCALL, to_luastring("syntax error", true));
        SETARG_C(getinstruction(fs, v.v), 1); /* call statement uses no results */
    }
};

var retstat = function retstat(ls) {
    /* stat -> RETURN [explist] [';'] */
    var fs = ls.fs;
    var e = new expdesc();
    var first = void 0,
        nret = void 0; /* registers with returned values */
    if (block_follow(ls, 1) || ls.t.token === 59 /* (';').charCodeAt(0) */) first = nret = 0; /* return no values */
    else {
            nret = explist(ls, e); /* optional return values */
            if (hasmultret(e.k)) {
                luaK_setmultret(fs, e);
                if (e.k === expkind.VCALL && nret === 1) {
                    /* tail call? */
                    SET_OPCODE(getinstruction(fs, e), OP_TAILCALL);
                    lua_assert(getinstruction(fs, e).A === fs.nactvar);
                }
                first = fs.nactvar;
                nret = LUA_MULTRET; /* return all values */
            } else {
                if (nret === 1) /* only one single value? */
                    first = luaK_exp2anyreg(fs, e);else {
                    luaK_exp2nextreg(fs, e); /* values must go to the stack */
                    first = fs.nactvar; /* return all active values */
                    lua_assert(nret === fs.freereg - first);
                }
            }
        }
    luaK_ret(fs, first, nret);
    testnext(ls, 59 /* (';').charCodeAt(0) */); /* skip optional semicolon */
};

var statement = function statement(ls) {
    var line = ls.linenumber; /* may be needed for error messages */
    enterlevel(ls);
    switch (ls.t.token) {
        case 59 /* (';').charCodeAt(0) */:
            {
                /* stat -> ';' (empty statement) */
                llex.luaX_next(ls); /* skip ';' */
                break;
            }
        case R.TK_IF:
            {
                /* stat -> ifstat */
                ifstat(ls, line);
                break;
            }
        case R.TK_WHILE:
            {
                /* stat -> whilestat */
                whilestat(ls, line);
                break;
            }
        case R.TK_DO:
            {
                /* stat -> DO block END */
                llex.luaX_next(ls); /* skip DO */
                block(ls);
                check_match(ls, R.TK_END, R.TK_DO, line);
                break;
            }
        case R.TK_FOR:
            {
                /* stat -> forstat */
                forstat(ls, line);
                break;
            }
        case R.TK_REPEAT:
            {
                /* stat -> repeatstat */
                repeatstat(ls, line);
                break;
            }
        case R.TK_FUNCTION:
            {
                /* stat -> funcstat */
                funcstat(ls, line);
                break;
            }
        case R.TK_LOCAL:
            {
                /* stat -> localstat */
                llex.luaX_next(ls); /* skip LOCAL */
                if (testnext(ls, R.TK_FUNCTION)) /* local function? */
                    localfunc(ls);else localstat(ls);
                break;
            }
        case R.TK_DBCOLON:
            {
                /* stat -> label */
                llex.luaX_next(ls); /* skip double colon */
                labelstat(ls, str_checkname(ls), line);
                break;
            }
        case R.TK_RETURN:
            {
                /* skip double colon */
                llex.luaX_next(ls); /* skip RETURN */
                retstat(ls);
                break;
            }
        case R.TK_BREAK: /* stat -> breakstat */
        case R.TK_GOTO:
            {
                /* stat -> 'goto' NAME */
                gotostat(ls, luaK_jump(ls.fs));
                break;
            }
        default:
            {
                /* stat -> func | assignment */
                exprstat(ls);
                break;
            }
    }
    lua_assert(ls.fs.f.maxstacksize >= ls.fs.freereg && ls.fs.freereg >= ls.fs.nactvar);
    ls.fs.freereg = ls.fs.nactvar; /* free registers */
    leavelevel(ls);
};

/*
** compiles the main function, which is a regular vararg function with an
** upvalue named LUA_ENV
*/
var mainfunc = function mainfunc(ls, fs) {
    var bl = new BlockCnt();
    var v = new expdesc();
    open_func(ls, fs, bl);
    fs.f.is_vararg = true; /* main function is always declared vararg */
    init_exp(v, expkind.VLOCAL, 0); /* create and... */
    newupvalue(fs, ls.envn, v); /* ...set environment upvalue */
    llex.luaX_next(ls); /* read first token */
    statlist(ls); /* parse main body */
    check(ls, R.TK_EOS);
    close_func(ls);
};

var luaY_parser = function luaY_parser(L, z, buff, dyd, name, firstchar) {
    var lexstate = new llex.LexState();
    var funcstate = new FuncState();
    var cl = lfunc.luaF_newLclosure(L, 1); /* create main closure */
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].setclLvalue(cl);
    lexstate.h = ltable.luaH_new(L); /* create table for scanner */
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].sethvalue(lexstate.h);
    funcstate.f = cl.p = new Proto(L);
    funcstate.f.source = luaS_new(L, name);
    lexstate.buff = buff;
    lexstate.dyd = dyd;
    dyd.actvar.n = dyd.gt.n = dyd.label.n = 0;
    llex.luaX_setinput(L, lexstate, z, funcstate.f.source, firstchar);
    mainfunc(lexstate, funcstate);
    lua_assert(!funcstate.prev && funcstate.nups === 1 && !lexstate.fs);
    /* all scopes should be correctly finished */
    lua_assert(dyd.actvar.n === 0 && dyd.gt.n === 0 && dyd.label.n === 0);
    delete L.stack[--L.top]; /* remove scanner's table */
    return cl; /* closure is on the stack, too */
};

module.exports.Dyndata = Dyndata;
module.exports.expkind = expkind;
module.exports.expdesc = expdesc;
module.exports.luaY_parser = luaY_parser;
module.exports.vkisinreg = vkisinreg;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_OK = _require.LUA_OK,
    LUA_TFUNCTION = _require.LUA_TFUNCTION,
    LUA_TSTRING = _require.LUA_TSTRING,
    LUA_YIELD = _require.LUA_YIELD,
    lua_Debug = _require.lua_Debug,
    lua_checkstack = _require.lua_checkstack,
    lua_concat = _require.lua_concat,
    lua_error = _require.lua_error,
    lua_getstack = _require.lua_getstack,
    lua_gettop = _require.lua_gettop,
    lua_insert = _require.lua_insert,
    lua_isyieldable = _require.lua_isyieldable,
    lua_newthread = _require.lua_newthread,
    lua_pop = _require.lua_pop,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushcclosure = _require.lua_pushcclosure,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushthread = _require.lua_pushthread,
    lua_pushvalue = _require.lua_pushvalue,
    lua_resume = _require.lua_resume,
    lua_status = _require.lua_status,
    lua_tothread = _require.lua_tothread,
    lua_type = _require.lua_type,
    lua_upvalueindex = _require.lua_upvalueindex,
    lua_xmove = _require.lua_xmove,
    lua_yield = _require.lua_yield;

var _require2 = __webpack_require__(6),
    luaL_argcheck = _require2.luaL_argcheck,
    luaL_checktype = _require2.luaL_checktype,
    luaL_newlib = _require2.luaL_newlib,
    luaL_where = _require2.luaL_where;

var _require3 = __webpack_require__(3),
    to_luastring = _require3.to_luastring;

var getco = function getco(L) {
    var co = lua_tothread(L, 1);
    luaL_argcheck(L, co, 1, to_luastring("thread expected", true));
    return co;
};

var auxresume = function auxresume(L, co, narg) {
    if (!lua_checkstack(co, narg)) {
        lua_pushliteral(L, "too many arguments to resume");
        return -1; /* error flag */
    }

    if (lua_status(co) === LUA_OK && lua_gettop(co) === 0) {
        lua_pushliteral(L, "cannot resume dead coroutine");
        return -1; /* error flag */
    }

    lua_xmove(L, co, narg);
    var status = lua_resume(co, L, narg);
    if (status === LUA_OK || status === LUA_YIELD) {
        var nres = lua_gettop(co);
        if (!lua_checkstack(L, nres + 1)) {
            lua_pop(co, nres); /* remove results anyway */
            lua_pushliteral(L, "too many results to resume");
            return -1; /* error flag */
        }

        lua_xmove(co, L, nres); /* move yielded values */
        return nres;
    } else {
        lua_xmove(co, L, 1); /* move error message */
        return -1; /* error flag */
    }
};

var luaB_coresume = function luaB_coresume(L) {
    var co = getco(L);
    var r = auxresume(L, co, lua_gettop(L) - 1);
    if (r < 0) {
        lua_pushboolean(L, 0);
        lua_insert(L, -2);
        return 2; /* return false + error message */
    } else {
        lua_pushboolean(L, 1);
        lua_insert(L, -(r + 1));
        return r + 1; /* return true + 'resume' returns */
    }
};

var luaB_auxwrap = function luaB_auxwrap(L) {
    var co = lua_tothread(L, lua_upvalueindex(1));
    var r = auxresume(L, co, lua_gettop(L));
    if (r < 0) {
        if (lua_type(L, -1) === LUA_TSTRING) {
            /* error object is a string? */
            luaL_where(L, 1); /* add extra info */
            lua_insert(L, -2);
            lua_concat(L, 2);
        }

        return lua_error(L); /* propagate error */
    }

    return r;
};

var luaB_cocreate = function luaB_cocreate(L) {
    luaL_checktype(L, 1, LUA_TFUNCTION);
    var NL = lua_newthread(L);
    lua_pushvalue(L, 1); /* move function to top */
    lua_xmove(L, NL, 1); /* move function from L to NL */
    return 1;
};

var luaB_cowrap = function luaB_cowrap(L) {
    luaB_cocreate(L);
    lua_pushcclosure(L, luaB_auxwrap, 1);
    return 1;
};

var luaB_yield = function luaB_yield(L) {
    return lua_yield(L, lua_gettop(L));
};

var luaB_costatus = function luaB_costatus(L) {
    var co = getco(L);
    if (L === co) lua_pushliteral(L, "running");else {
        switch (lua_status(co)) {
            case LUA_YIELD:
                lua_pushliteral(L, "suspended");
                break;
            case LUA_OK:
                {
                    var ar = new lua_Debug();
                    if (lua_getstack(co, 0, ar) > 0) /* does it have frames? */
                        lua_pushliteral(L, "normal"); /* it is running */
                    else if (lua_gettop(co) === 0) lua_pushliteral(L, "dead");else lua_pushliteral(L, "suspended"); /* initial state */
                    break;
                }
            default:
                /* some error occurred */
                lua_pushliteral(L, "dead");
                break;
        }
    }

    return 1;
};

var luaB_yieldable = function luaB_yieldable(L) {
    lua_pushboolean(L, lua_isyieldable(L));
    return 1;
};

var luaB_corunning = function luaB_corunning(L) {
    lua_pushboolean(L, lua_pushthread(L));
    return 2;
};

var co_funcs = {
    "create": luaB_cocreate,
    "isyieldable": luaB_yieldable,
    "resume": luaB_coresume,
    "running": luaB_corunning,
    "status": luaB_costatus,
    "wrap": luaB_cowrap,
    "yield": luaB_yield
};

var luaopen_coroutine = function luaopen_coroutine(L) {
    luaL_newlib(L, co_funcs);
    return 1;
};

module.exports.luaopen_coroutine = luaopen_coroutine;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(4),
    LUA_MAXINTEGER = _require.LUA_MAXINTEGER;

var _require2 = __webpack_require__(1),
    LUA_OPEQ = _require2.LUA_OPEQ,
    LUA_OPLT = _require2.LUA_OPLT,
    LUA_TFUNCTION = _require2.LUA_TFUNCTION,
    LUA_TNIL = _require2.LUA_TNIL,
    LUA_TTABLE = _require2.LUA_TTABLE,
    lua_call = _require2.lua_call,
    lua_checkstack = _require2.lua_checkstack,
    lua_compare = _require2.lua_compare,
    lua_createtable = _require2.lua_createtable,
    lua_geti = _require2.lua_geti,
    lua_getmetatable = _require2.lua_getmetatable,
    lua_gettop = _require2.lua_gettop,
    lua_insert = _require2.lua_insert,
    lua_isnil = _require2.lua_isnil,
    lua_isnoneornil = _require2.lua_isnoneornil,
    lua_isstring = _require2.lua_isstring,
    lua_pop = _require2.lua_pop,
    lua_pushinteger = _require2.lua_pushinteger,
    lua_pushnil = _require2.lua_pushnil,
    lua_pushstring = _require2.lua_pushstring,
    lua_pushvalue = _require2.lua_pushvalue,
    lua_rawget = _require2.lua_rawget,
    lua_setfield = _require2.lua_setfield,
    lua_seti = _require2.lua_seti,
    lua_settop = _require2.lua_settop,
    lua_toboolean = _require2.lua_toboolean,
    lua_type = _require2.lua_type;

var _require3 = __webpack_require__(6),
    luaL_Buffer = _require3.luaL_Buffer,
    luaL_addlstring = _require3.luaL_addlstring,
    luaL_addvalue = _require3.luaL_addvalue,
    luaL_argcheck = _require3.luaL_argcheck,
    luaL_buffinit = _require3.luaL_buffinit,
    luaL_checkinteger = _require3.luaL_checkinteger,
    luaL_checktype = _require3.luaL_checktype,
    luaL_error = _require3.luaL_error,
    luaL_len = _require3.luaL_len,
    luaL_newlib = _require3.luaL_newlib,
    luaL_opt = _require3.luaL_opt,
    luaL_optinteger = _require3.luaL_optinteger,
    luaL_optlstring = _require3.luaL_optlstring,
    luaL_pushresult = _require3.luaL_pushresult,
    luaL_typename = _require3.luaL_typename;

var lualib = __webpack_require__(16);

var _require4 = __webpack_require__(3),
    to_luastring = _require4.to_luastring;

/*
** Operations that an object must define to mimic a table
** (some functions only need some of them)
*/


var TAB_R = 1; /* read */
var TAB_W = 2; /* write */
var TAB_L = 4; /* length */
var TAB_RW = TAB_R | TAB_W; /* read/write */

var checkfield = function checkfield(L, key, n) {
    lua_pushstring(L, key);
    return lua_rawget(L, -n) !== LUA_TNIL;
};

/*
** Check that 'arg' either is a table or can behave like one (that is,
** has a metatable with the required metamethods)
*/
var checktab = function checktab(L, arg, what) {
    if (lua_type(L, arg) !== LUA_TTABLE) {
        /* is it not a table? */
        var n = 1;
        if (lua_getmetatable(L, arg) && ( /* must have metatable */
        !(what & TAB_R) || checkfield(L, to_luastring("__index", true), ++n)) && (!(what & TAB_W) || checkfield(L, to_luastring("__newindex", true), ++n)) && (!(what & TAB_L) || checkfield(L, to_luastring("__len", true), ++n))) {
            lua_pop(L, n); /* pop metatable and tested metamethods */
        } else luaL_checktype(L, arg, LUA_TTABLE); /* force an error */
    }
};

var aux_getn = function aux_getn(L, n, w) {
    checktab(L, n, w | TAB_L);
    return luaL_len(L, n);
};

var addfield = function addfield(L, b, i) {
    lua_geti(L, 1, i);
    if (!lua_isstring(L, -1)) luaL_error(L, to_luastring("invalid value (%s) at index %d in table for 'concat'"), luaL_typename(L, -1), i);

    luaL_addvalue(b);
};

var tinsert = function tinsert(L) {
    var e = aux_getn(L, 1, TAB_RW) + 1; /* first empty element */
    var pos = void 0;
    switch (lua_gettop(L)) {
        case 2:
            pos = e;
            break;
        case 3:
            {
                pos = luaL_checkinteger(L, 2); /* 2nd argument is the position */
                luaL_argcheck(L, 1 <= pos && pos <= e, 2, to_luastring("position out of bounds", true));
                for (var i = e; i > pos; i--) {
                    /* move up elements */
                    lua_geti(L, 1, i - 1);
                    lua_seti(L, 1, i); /* t[i] = t[i - 1] */
                }
                break;
            }
        default:
            {
                return luaL_error(L, to_luastring("wrong number of arguments to 'insert'", true));
            }
    }

    lua_seti(L, 1, pos); /* t[pos] = v */
    return 0;
};

var tremove = function tremove(L) {
    var size = aux_getn(L, 1, TAB_RW);
    var pos = luaL_optinteger(L, 2, size);
    if (pos !== size) /* validate 'pos' if given */
        luaL_argcheck(L, 1 <= pos && pos <= size + 1, 1, to_luastring("position out of bounds", true));
    lua_geti(L, 1, pos); /* result = t[pos] */
    for (; pos < size; pos++) {
        lua_geti(L, 1, pos + 1);
        lua_seti(L, 1, pos); /* t[pos] = t[pos + 1] */
    }
    lua_pushnil(L);
    lua_seti(L, 1, pos); /* t[pos] = nil */
    return 1;
};

/*
** Copy elements (1[f], ..., 1[e]) into (tt[t], tt[t+1], ...). Whenever
** possible, copy in increasing order, which is better for rehashing.
** "possible" means destination after original range, or smaller
** than origin, or copying to another table.
*/
var tmove = function tmove(L) {
    var f = luaL_checkinteger(L, 2);
    var e = luaL_checkinteger(L, 3);
    var t = luaL_checkinteger(L, 4);
    var tt = !lua_isnoneornil(L, 5) ? 5 : 1; /* destination table */
    checktab(L, 1, TAB_R);
    checktab(L, tt, TAB_W);
    if (e >= f) {
        /* otherwise, nothing to move */
        luaL_argcheck(L, f > 0 || e < LUA_MAXINTEGER + f, 3, to_luastring("too many elements to move", true));
        var n = e - f + 1; /* number of elements to move */
        luaL_argcheck(L, t <= LUA_MAXINTEGER - n + 1, 4, to_luastring("destination wrap around", true));

        if (t > e || t <= f || tt !== 1 && lua_compare(L, 1, tt, LUA_OPEQ) !== 1) {
            for (var i = 0; i < n; i++) {
                lua_geti(L, 1, f + i);
                lua_seti(L, tt, t + i);
            }
        } else {
            for (var _i = n - 1; _i >= 0; _i--) {
                lua_geti(L, 1, f + _i);
                lua_seti(L, tt, t + _i);
            }
        }
    }

    lua_pushvalue(L, tt); /* return destination table */
    return 1;
};

var tconcat = function tconcat(L) {
    var last = aux_getn(L, 1, TAB_R);
    var sep = luaL_optlstring(L, 2, to_luastring(""));
    var lsep = sep.length;
    var i = luaL_optinteger(L, 3, 1);
    last = luaL_optinteger(L, 4, last);

    var b = new luaL_Buffer();
    luaL_buffinit(L, b);

    for (; i < last; i++) {
        addfield(L, b, i);
        luaL_addlstring(b, sep, lsep);
    }

    if (i === last) addfield(L, b, i);

    luaL_pushresult(b);

    return 1;
};

var pack = function pack(L) {
    var n = lua_gettop(L); /* number of elements to pack */
    lua_createtable(L, n, 1); /* create result table */
    lua_insert(L, 1); /* put it at index 1 */
    for (var i = n; i >= 1; i--) {
        /* assign elements */
        lua_seti(L, 1, i);
    }lua_pushinteger(L, n);
    lua_setfield(L, 1, to_luastring("n")); /* t.n = number of elements */
    return 1; /* return table */
};

var unpack = function unpack(L) {
    var i = luaL_optinteger(L, 2, 1);
    var e = luaL_opt(L, luaL_checkinteger, 3, luaL_len(L, 1));
    if (i > e) return 0; /* empty range */
    var n = e - i; /* number of elements minus 1 (avoid overflows) */
    if (n >= Number.MAX_SAFE_INTEGER || !lua_checkstack(L, ++n)) return luaL_error(L, to_luastring("too many results to unpack", true));
    for (; i < e; i++) {
        /* push arg[i..e - 1] (to avoid overflows) */
        lua_geti(L, 1, i);
    }lua_geti(L, 1, e); /* push last element */
    return n;
};

var l_randomizePivot = function l_randomizePivot() {
    return Math.floor(Math.random() * 1 << 32);
};

var RANLIMIT = 100;

var set2 = function set2(L, i, j) {
    lua_seti(L, 1, i);
    lua_seti(L, 1, j);
};

var sort_comp = function sort_comp(L, a, b) {
    if (lua_isnil(L, 2)) /* no function? */
        return lua_compare(L, a, b, LUA_OPLT); /* a < b */
    else {
            /* function */
            lua_pushvalue(L, 2); /* push function */
            lua_pushvalue(L, a - 1); /* -1 to compensate function */
            lua_pushvalue(L, b - 2); /* -2 to compensate function and 'a' */
            lua_call(L, 2, 1); /* call function */
            var res = lua_toboolean(L, -1); /* get result */
            lua_pop(L, 1); /* pop result */
            return res;
        }
};

var partition = function partition(L, lo, up) {
    var i = lo; /* will be incremented before first use */
    var j = up - 1; /* will be decremented before first use */
    /* loop invariant: a[lo .. i] <= P <= a[j .. up] */
    for (;;) {
        /* next loop: repeat ++i while a[i] < P */
        while (lua_geti(L, 1, ++i), sort_comp(L, -1, -2)) {
            if (i == up - 1) /* a[i] < P  but a[up - 1] == P  ?? */
                luaL_error(L, to_luastring("invalid order function for sorting"));
            lua_pop(L, 1); /* remove a[i] */
        }
        /* after the loop, a[i] >= P and a[lo .. i - 1] < P */
        /* next loop: repeat --j while P < a[j] */
        while (lua_geti(L, 1, --j), sort_comp(L, -3, -1)) {
            if (j < i) /* j < i  but  a[j] > P ?? */
                luaL_error(L, to_luastring("invalid order function for sorting"));
            lua_pop(L, 1); /* remove a[j] */
        }
        /* after the loop, a[j] <= P and a[j + 1 .. up] >= P */
        if (j < i) {
            /* no elements out of place? */
            /* a[lo .. i - 1] <= P <= a[j + 1 .. i .. up] */
            lua_pop(L, 1); /* pop a[j] */
            /* swap pivot (a[up - 1]) with a[i] to satisfy pos-condition */
            set2(L, up - 1, i);
            return i;
        }
        /* otherwise, swap a[i] - a[j] to restore invariant and repeat */
        set2(L, i, j);
    }
};

var choosePivot = function choosePivot(lo, up, rnd) {
    var r4 = Math.floor((up - lo) / 4); /* range/4 */
    var p = rnd % (r4 * 2) + (lo + r4);
    lualib.lua_assert(lo + r4 <= p && p <= up - r4);
    return p;
};

var auxsort = function auxsort(L, lo, up, rnd) {
    while (lo < up) {
        /* loop for tail recursion */
        /* sort elements 'lo', 'p', and 'up' */
        lua_geti(L, 1, lo);
        lua_geti(L, 1, up);
        if (sort_comp(L, -1, -2)) /* a[up] < a[lo]? */
            set2(L, lo, up); /* swap a[lo] - a[up] */
        else lua_pop(L, 2); /* remove both values */
        if (up - lo == 1) /* only 2 elements? */
            return; /* already sorted */
        var p = void 0; /* Pivot index */
        if (up - lo < RANLIMIT || rnd === 0) /* small interval or no randomize? */
            p = Math.floor((lo + up) / 2); /* middle element is a good pivot */
        else /* for larger intervals, it is worth a random pivot */
            p = choosePivot(lo, up, rnd);
        lua_geti(L, 1, p);
        lua_geti(L, 1, lo);
        if (sort_comp(L, -2, -1)) /* a[p] < a[lo]? */
            set2(L, p, lo); /* swap a[p] - a[lo] */
        else {
                lua_pop(L, 1); /* remove a[lo] */
                lua_geti(L, 1, up);
                if (sort_comp(L, -1, -2)) /* a[up] < a[p]? */
                    set2(L, p, up); /* swap a[up] - a[p] */
                else lua_pop(L, 2);
            }
        if (up - lo == 2) /* only 3 elements? */
            return; /* already sorted */
        lua_geti(L, 1, p); /* get middle element (Pivot) */
        lua_pushvalue(L, -1); /* push Pivot */
        lua_geti(L, 1, up - 1); /* push a[up - 1] */
        set2(L, p, up - 1); /* swap Pivot (a[p]) with a[up - 1] */
        p = partition(L, lo, up);
        var n = void 0;
        /* a[lo .. p - 1] <= a[p] == P <= a[p + 1 .. up] */
        if (p - lo < up - p) {
            /* lower interval is smaller? */
            auxsort(L, lo, p - 1, rnd); /* call recursively for lower interval */
            n = p - lo; /* size of smaller interval */
            lo = p + 1; /* tail call for [p + 1 .. up] (upper interval) */
        } else {
            auxsort(L, p + 1, up, rnd); /* call recursively for upper interval */
            n = up - p; /* size of smaller interval */
            up = p - 1; /* tail call for [lo .. p - 1]  (lower interval) */
        }
        if ((up - lo) / 128 > n) /* partition too imbalanced? */
            rnd = l_randomizePivot(); /* try a new randomization */
    } /* tail call auxsort(L, lo, up, rnd) */
};

var sort = function sort(L) {
    var n = aux_getn(L, 1, TAB_RW);
    if (n > 1) {
        /* non-trivial interval? */
        luaL_argcheck(L, n < LUA_MAXINTEGER, 1, to_luastring("array too big", true));
        if (!lua_isnoneornil(L, 2)) /* is there a 2nd argument? */
            luaL_checktype(L, 2, LUA_TFUNCTION); /* must be a function */
        lua_settop(L, 2); /* make sure there are two arguments */
        auxsort(L, 1, n, 0);
    }
    return 0;
};

var tab_funcs = {
    "concat": tconcat,
    "insert": tinsert,
    "move": tmove,
    "pack": pack,
    "remove": tremove,
    "sort": sort,
    "unpack": unpack
};

var luaopen_table = function luaopen_table(L) {
    luaL_newlib(L, tab_funcs);
    return 1;
};

module.exports.luaopen_table = luaopen_table;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_TNIL = _require.LUA_TNIL,
    LUA_TTABLE = _require.LUA_TTABLE,
    lua_close = _require.lua_close,
    lua_createtable = _require.lua_createtable,
    lua_getfield = _require.lua_getfield,
    lua_isboolean = _require.lua_isboolean,
    lua_isnoneornil = _require.lua_isnoneornil,
    lua_pop = _require.lua_pop,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushfstring = _require.lua_pushfstring,
    lua_pushinteger = _require.lua_pushinteger,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushnil = _require.lua_pushnil,
    lua_pushnumber = _require.lua_pushnumber,
    lua_pushstring = _require.lua_pushstring,
    lua_setfield = _require.lua_setfield,
    lua_settop = _require.lua_settop,
    lua_toboolean = _require.lua_toboolean,
    lua_tointegerx = _require.lua_tointegerx;

var _require2 = __webpack_require__(6),
    luaL_Buffer = _require2.luaL_Buffer,
    luaL_addchar = _require2.luaL_addchar,
    luaL_addstring = _require2.luaL_addstring,
    luaL_argerror = _require2.luaL_argerror,
    luaL_buffinit = _require2.luaL_buffinit,
    luaL_checkinteger = _require2.luaL_checkinteger,
    luaL_checkstring = _require2.luaL_checkstring,
    luaL_checktype = _require2.luaL_checktype,
    luaL_error = _require2.luaL_error,
    luaL_execresult = _require2.luaL_execresult,
    luaL_fileresult = _require2.luaL_fileresult,
    luaL_newlib = _require2.luaL_newlib,
    luaL_opt = _require2.luaL_opt,
    luaL_optinteger = _require2.luaL_optinteger,
    luaL_optlstring = _require2.luaL_optlstring,
    luaL_optstring = _require2.luaL_optstring,
    luaL_pushresult = _require2.luaL_pushresult;

var _require3 = __webpack_require__(3),
    luastring_indexOf = _require3.luastring_indexOf,
    to_jsstring = _require3.to_jsstring,
    to_luastring = _require3.to_luastring;

var strftime = __webpack_require__(35);

/* options for ANSI C 89 (only 1-char options) */
var L_STRFTIMEC89 = to_luastring("aAbBcdHIjmMpSUwWxXyYZ%");
var LUA_STRFTIMEOPTIONS = L_STRFTIMEC89;

/* options for ISO C 99 and POSIX */
// const L_STRFTIMEC99 = to_luastring("aAbBcCdDeFgGhHIjmMnprRStTuUVwWxXyYzZ%||EcECExEXEyEYOdOeOHOIOmOMOSOuOUOVOwOWOy");  /* two-char options */
// const LUA_STRFTIMEOPTIONS = L_STRFTIMEC99;

/* options for Windows */
// const L_STRFTIMEWIN = to_luastring("aAbBcdHIjmMpSUwWxXyYzZ%||#c#x#d#H#I#j#m#M#S#U#w#W#y#Y");  /* two-char options */
// const LUA_STRFTIMEOPTIONS = L_STRFTIMEWIN;


var setfield = function setfield(L, key, value) {
    lua_pushinteger(L, value);
    lua_setfield(L, -2, to_luastring(key, true));
};

var setallfields = function setallfields(L, time, utc) {
    setfield(L, "sec", !utc ? time.getSeconds() : time.getUTCSeconds());
    setfield(L, "min", !utc ? time.getMinutes() : time.getUTCMinutes());
    setfield(L, "hour", !utc ? time.getHours() : time.getUTCHours());
    setfield(L, "day", !utc ? time.getDate() : time.getUTCDate());
    setfield(L, "month", !utc ? time.getMonth() : time.getUTCMonth());
    setfield(L, "year", !utc ? time.getFullYear() : time.getUTCFullYear());
    setfield(L, "wday", !utc ? time.getDay() : time.getUTCDay());
    var now = new Date();
    setfield(L, "yday", Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)));
    // setboolfield(L, "isdst", time.get);
};

var L_MAXDATEFIELD = Number.MAX_SAFE_INTEGER / 2;

var getfield = function getfield(L, key, d, delta) {
    var t = lua_getfield(L, -1, to_luastring(key, true)); /* get field and its type */
    var res = lua_tointegerx(L, -1);
    if (res === false) {
        /* field is not an integer? */
        if (t !== LUA_TNIL) /* some other value? */
            return luaL_error(L, to_luastring("field '%s' is not an integer"), key);else if (d < 0) /* absent field; no default? */
            return luaL_error(L, to_luastring("field '%s' missing in date table"), key);
        res = d;
    } else {
        if (!(-L_MAXDATEFIELD <= res && res <= L_MAXDATEFIELD)) return luaL_error(L, to_luastring("field '%s' is out-of-bound"), key);
        res -= delta;
    }
    lua_pop(L, 1);
    return res;
};

var array_cmp = function array_cmp(a, ai, b, bi, len) {
    for (var i = 0; i < len; i++) {
        if (a[ai + i] !== b[bi + i]) return false;
    }
    return true;
};

var checkoption = function checkoption(L, conv, i, buff) {
    var option = LUA_STRFTIMEOPTIONS;
    var o = 0;
    var oplen = 1; /* length of options being checked */
    for (; o < option.length && oplen <= conv.length - i; o += oplen) {
        if (option[o] === '|'.charCodeAt(0)) /* next block? */
            oplen++; /* will check options with next length (+1) */
        else if (array_cmp(conv, i, option, o, oplen)) {
                /* match? */
                buff.set(conv.subarray(i, i + oplen)); /* copy valid option to buffer */
                return i + oplen; /* return next item */
            }
    }
    luaL_argerror(L, 1, lua_pushfstring(L, to_luastring("invalid conversion specifier '%%%s'"), conv));
};

/* maximum size for an individual 'strftime' item */
// const SIZETIMEFMT = 250;


var os_date = function os_date(L) {
    var s = luaL_optlstring(L, 1, to_luastring("%c"));
    var t = luaL_opt(L, l_checktime, 2, new Date().getTime() / 1000) * 1000;
    var stm = new Date(t);
    var utc = false;
    var i = 0;
    if (s[i] === '!'.charCodeAt(0)) {
        /* UTC? */
        utc = true;
        i++; /* skip '!' */
    }

    if (stm === null) /* invalid date? */
        luaL_error(L, to_luastring("time result cannot be represented in this installation", true));
    if (s[i] === "*".charCodeAt(0) && s[i + 1] === "t".charCodeAt(0)) {
        lua_createtable(L, 0, 9); /* 9 = number of fields */
        setallfields(L, stm, utc);
    } else {
        var cc = new Uint8Array(4);
        cc[0] = "%".charCodeAt(0);
        var b = new luaL_Buffer();
        luaL_buffinit(L, b);
        while (i < s.length) {
            if (s[i] !== '%'.charCodeAt(0)) {
                /* not a conversion specifier? */
                luaL_addchar(b, s[i++]);
            } else {
                i++; /* skip '%' */
                i = checkoption(L, s, i, cc.subarray(1)); /* copy specifier to 'cc' */
                var len = luastring_indexOf(cc, 0);
                if (len !== -1) cc = cc.subarray(0, len);
                var buff = strftime(to_jsstring(cc), stm);
                luaL_addstring(b, to_luastring(buff));
            }
        }
        luaL_pushresult(b);
    }
    return 1;
};

var os_time = function os_time(L) {
    var t = new Date();
    if (!lua_isnoneornil(L, 1)) /* called with arg */{
            luaL_checktype(L, 1, LUA_TTABLE); /* make sure table is at the top */
            lua_settop(L, 1);
            t.setSeconds(getfield(L, "sec", 0, 0));
            t.setMinutes(getfield(L, "min", 0, 0));
            t.setHours(getfield(L, "hour", 12, 0));
            t.setDate(getfield(L, "day", -1, 0));
            t.setMonth(getfield(L, "month", -1, 1));
            t.setFullYear(getfield(L, "year", -1, 0));
            setallfields(L, t);
        }

    lua_pushinteger(L, Math.floor(t / 1000));
    return 1;
};

var l_checktime = function l_checktime(L, arg) {
    var t = luaL_checkinteger(L, arg);
    // luaL_argcheck(L, t, arg, to_luastring("time out-of-bounds"));
    return t;
};

var os_difftime = function os_difftime(L) {
    var t1 = l_checktime(L, 1);
    var t2 = l_checktime(L, 2);
    lua_pushnumber(L, new Date(t1) - new Date(t2));
    return 1;
};

var syslib = {
    "date": os_date,
    "difftime": os_difftime,
    "time": os_time
};

if (true) {
    syslib.clock = function (L) {
        lua_pushnumber(L, performance.now() / 1000);
        return 1;
    };
} else {
    /* Only with Node */
    var fs = require('fs');
    var tmp = require('tmp');
    var child_process = require('child_process');

    syslib.exit = function (L) {
        var status = void 0;
        if (lua_isboolean(L, 1)) status = lua_toboolean(L, 1) ? 0 : 1;else status = luaL_optinteger(L, 1, 0);
        if (lua_toboolean(L, 2)) lua_close(L);
        if (L) process.exit(status); /* 'if' to avoid warnings for unreachable 'return' */
        return 0;
    };

    syslib.getenv = function (L) {
        var key = luaL_checkstring(L, 1);
        key = to_jsstring(key); /* https://github.com/nodejs/node/issues/16961 */
        if (Object.prototype.hasOwnProperty.call(process.env, key)) {
            lua_pushliteral(L, process.env[key]);
        } else {
            lua_pushnil(L);
        }
        return 1;
    };

    syslib.clock = function (L) {
        lua_pushnumber(L, process.uptime());
        return 1;
    };

    var lua_tmpname = function lua_tmpname() {
        return tmp.tmpNameSync();
    };

    syslib.remove = function (L) {
        var filename = luaL_checkstring(L, 1);
        try {
            if (fs.lstatSync(filename).isDirectory()) {
                fs.rmdirSync(filename);
            } else {
                fs.unlinkSync(filename);
            }
        } catch (e) {
            return luaL_fileresult(L, false, filename, e);
        }
        return luaL_fileresult(L, true);
    };

    syslib.rename = function (L) {
        var fromname = luaL_checkstring(L, 1);
        var toname = luaL_checkstring(L, 2);
        try {
            fs.renameSync(fromname, toname);
        } catch (e) {
            return luaL_fileresult(L, false, false, e);
        }
        return luaL_fileresult(L, true);
    };

    syslib.tmpname = function (L) {
        var name = lua_tmpname();
        if (!name) return luaL_error(L, to_luastring("unable to generate a unique filename"));
        lua_pushstring(L, to_luastring(name));
        return 1;
    };

    syslib.execute = function (L) {
        var cmd = luaL_optstring(L, 1, null);
        if (cmd !== null) {
            try {
                child_process.execSync(cmd, {
                    stdio: [process.stdin, process.stdout, process.stderr]
                });
            } catch (e) {
                return luaL_execresult(L, e);
            }

            return luaL_execresult(L, null);
        } else {
            /* Assume a shell is available.
               If it's good enough for musl it's good enough for us.
               http://git.musl-libc.org/cgit/musl/tree/src/process/system.c?id=ac45692a53a1b8d2ede329d91652d43c1fb5dc8d#n22
            */
            lua_pushboolean(L, 1);
            return 1;
        }
    };
}

var luaopen_os = function luaopen_os(L) {
    luaL_newlib(L, syslib);
    return 1;
};

module.exports.luaopen_os = luaopen_os;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(36),
    sprintf = _require.sprintf;

var _require2 = __webpack_require__(4),
    LUA_INTEGER_FMT = _require2.LUA_INTEGER_FMT,
    LUA_INTEGER_FRMLEN = _require2.LUA_INTEGER_FRMLEN,
    LUA_MININTEGER = _require2.LUA_MININTEGER,
    LUA_NUMBER_FMT = _require2.LUA_NUMBER_FMT,
    LUA_NUMBER_FRMLEN = _require2.LUA_NUMBER_FRMLEN,
    frexp = _require2.frexp,
    lua_getlocaledecpoint = _require2.lua_getlocaledecpoint;

var _require3 = __webpack_require__(1),
    LUA_TBOOLEAN = _require3.LUA_TBOOLEAN,
    LUA_TFUNCTION = _require3.LUA_TFUNCTION,
    LUA_TNIL = _require3.LUA_TNIL,
    LUA_TNUMBER = _require3.LUA_TNUMBER,
    LUA_TSTRING = _require3.LUA_TSTRING,
    LUA_TTABLE = _require3.LUA_TTABLE,
    lua_call = _require3.lua_call,
    lua_createtable = _require3.lua_createtable,
    lua_dump = _require3.lua_dump,
    lua_gettable = _require3.lua_gettable,
    lua_gettop = _require3.lua_gettop,
    lua_isinteger = _require3.lua_isinteger,
    lua_isstring = _require3.lua_isstring,
    lua_pop = _require3.lua_pop,
    lua_pushcclosure = _require3.lua_pushcclosure,
    lua_pushinteger = _require3.lua_pushinteger,
    lua_pushlightuserdata = _require3.lua_pushlightuserdata,
    lua_pushliteral = _require3.lua_pushliteral,
    lua_pushlstring = _require3.lua_pushlstring,
    lua_pushnil = _require3.lua_pushnil,
    lua_pushnumber = _require3.lua_pushnumber,
    lua_pushstring = _require3.lua_pushstring,
    lua_pushvalue = _require3.lua_pushvalue,
    lua_remove = _require3.lua_remove,
    lua_setfield = _require3.lua_setfield,
    lua_setmetatable = _require3.lua_setmetatable,
    lua_settop = _require3.lua_settop,
    lua_toboolean = _require3.lua_toboolean,
    lua_tointeger = _require3.lua_tointeger,
    lua_tonumber = _require3.lua_tonumber,
    lua_tostring = _require3.lua_tostring,
    lua_touserdata = _require3.lua_touserdata,
    lua_type = _require3.lua_type,
    lua_upvalueindex = _require3.lua_upvalueindex;

var _require4 = __webpack_require__(6),
    luaL_Buffer = _require4.luaL_Buffer,
    luaL_addchar = _require4.luaL_addchar,
    luaL_addlstring = _require4.luaL_addlstring,
    luaL_addsize = _require4.luaL_addsize,
    luaL_addstring = _require4.luaL_addstring,
    luaL_addvalue = _require4.luaL_addvalue,
    luaL_argcheck = _require4.luaL_argcheck,
    luaL_argerror = _require4.luaL_argerror,
    luaL_buffinit = _require4.luaL_buffinit,
    luaL_buffinitsize = _require4.luaL_buffinitsize,
    luaL_checkinteger = _require4.luaL_checkinteger,
    luaL_checknumber = _require4.luaL_checknumber,
    luaL_checkstack = _require4.luaL_checkstack,
    luaL_checkstring = _require4.luaL_checkstring,
    luaL_checktype = _require4.luaL_checktype,
    luaL_error = _require4.luaL_error,
    luaL_newlib = _require4.luaL_newlib,
    luaL_optinteger = _require4.luaL_optinteger,
    luaL_optstring = _require4.luaL_optstring,
    luaL_prepbuffsize = _require4.luaL_prepbuffsize,
    luaL_pushresult = _require4.luaL_pushresult,
    luaL_pushresultsize = _require4.luaL_pushresultsize,
    luaL_tolstring = _require4.luaL_tolstring,
    luaL_typename = _require4.luaL_typename;

var lualib = __webpack_require__(16);

var _require5 = __webpack_require__(3),
    luastring_indexOf = _require5.luastring_indexOf,
    to_jsstring = _require5.to_jsstring,
    to_luastring = _require5.to_luastring;

var sL_ESC = '%';
var L_ESC = sL_ESC.charCodeAt(0);

/*
** maximum number of captures that a pattern can do during
** pattern-matching. This limit is arbitrary, but must fit in
** an unsigned char.
*/
var LUA_MAXCAPTURES = 32;

// (sizeof(size_t) < sizeof(int) ? MAX_SIZET : (size_t)(INT_MAX))
var MAXSIZE = 2147483647;

/* Give natural (i.e. strings end at the first \0) length of a string represented by an array of bytes */
var strlen = function strlen(s) {
    var len = luastring_indexOf(s, 0);
    return len > -1 ? len : s.length;
};

/* translate a relative string position: negative means back from end */
var posrelat = function posrelat(pos, len) {
    if (pos >= 0) return pos;else if (0 - pos > len) return 0;else return len + pos + 1;
};

var str_sub = function str_sub(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var start = posrelat(luaL_checkinteger(L, 2), l);
    var end = posrelat(luaL_optinteger(L, 3, -1), l);
    if (start < 1) start = 1;
    if (end > l) end = l;
    if (start <= end) lua_pushstring(L, s.subarray(start - 1, start - 1 + (end - start + 1)));else lua_pushliteral(L, "");
    return 1;
};

var str_len = function str_len(L) {
    lua_pushinteger(L, luaL_checkstring(L, 1).length);
    return 1;
};

var str_char = function str_char(L) {
    var n = lua_gettop(L); /* number of arguments */
    var b = new luaL_Buffer();
    var p = luaL_buffinitsize(L, b, n);
    for (var i = 1; i <= n; i++) {
        var c = luaL_checkinteger(L, i);
        luaL_argcheck(L, c >= 0 && c <= 255, "value out of range"); // Strings are 8-bit clean
        p[i - 1] = c;
    }
    luaL_pushresultsize(b, n);
    return 1;
};

var writer = function writer(L, b, size, B) {
    luaL_addlstring(B, b, size);
    return 0;
};

var str_dump = function str_dump(L) {
    var b = new luaL_Buffer();
    var strip = lua_toboolean(L, 2);
    luaL_checktype(L, 1, LUA_TFUNCTION);
    lua_settop(L, 1);
    luaL_buffinit(L, b);
    if (lua_dump(L, writer, b, strip) !== 0) return luaL_error(L, to_luastring("unable to dump given function"));
    luaL_pushresult(b);
    return 1;
};

var SIZELENMOD = LUA_NUMBER_FRMLEN.length + 1;

var L_NBFD = 1;

var num2straux = function num2straux(x) {
    /* if 'inf' or 'NaN', format it like '%g' */
    if (Object.is(x, Infinity)) return to_luastring('inf');else if (Object.is(x, -Infinity)) return to_luastring('-inf');else if (Number.isNaN(x)) return to_luastring('nan');else if (x === 0) {
        /* can be -0... */
        /* create "0" or "-0" followed by exponent */
        var zero = sprintf(LUA_NUMBER_FMT + "x0p+0", x);
        if (Object.is(x, -0)) zero = "-" + zero;
        return to_luastring(zero);
    } else {
        var buff = "";
        var fe = frexp(x); /* 'x' fraction and exponent */
        var m = fe[0];
        var e = fe[1];
        if (m < 0) {
            /* is number negative? */
            buff += '-'; /* add signal */
            m = -m; /* make it positive */
        }
        buff += "0x"; /* add "0x" */
        buff += (m * (1 << L_NBFD)).toString(16);
        e -= L_NBFD; /* this digit goes before the radix point */
        buff += sprintf("p%+d", e); /* add exponent */
        return to_luastring(buff);
    }
};

var lua_number2strx = function lua_number2strx(L, fmt, x) {
    var buff = num2straux(x);
    if (fmt[SIZELENMOD] === 65 /* 'A'.charCodeAt(0) */) {
            for (var i = 0; i < buff.length; i++) {
                var c = buff[i];
                if (c >= 97) /* toupper */
                    buff[i] = c & 0xdf;
            }
        } else if (fmt[SIZELENMOD] !== 97 /* 'a'.charCodeAt(0) */) luaL_error(L, to_luastring("modifiers for format '%%a'/'%%A' not implemented"));
    return buff;
};

/*
** Maximum size of each formatted item. This maximum size is produced
** by format('%.99f', -maxfloat), and is equal to 99 + 3 ('-', '.',
** and '\0') + number of decimal digits to represent maxfloat (which
** is maximum exponent + 1). (99+3+1 then rounded to 120 for "extra
** expenses", such as locale-dependent stuff)
*/
// const MAX_ITEM   = 120;// TODO: + l_mathlim(MAX_10_EXP);


/* valid flags in a format specification */
var FLAGS = to_luastring("-+ #0");

/*
** maximum size of each format specification (such as "%-099.99d")
*/
// const MAX_FORMAT = 32;

var isalpha = function isalpha(e) {
    return 97 <= e && e <= 122 || 65 <= e && e <= 90;
};
var isdigit = function isdigit(e) {
    return 48 <= e && e <= 57;
};
var iscntrl = function iscntrl(e) {
    return 0x00 <= e && e <= 0x1f || e === 0x7f;
};
var isgraph = function isgraph(e) {
    return 33 <= e && e <= 126;
};
var islower = function islower(e) {
    return 97 <= e && e <= 122;
};
var isupper = function isupper(e) {
    return 65 <= e && e <= 90;
};
var isalnum = function isalnum(e) {
    return 97 <= e && e <= 122 || 65 <= e && e <= 90 || 48 <= e && e <= 57;
};
var ispunct = function ispunct(e) {
    return isgraph(e) && !isalnum(e);
};
var isspace = function isspace(e) {
    return e === 32 || e >= 9 && e <= 13;
};
var isxdigit = function isxdigit(e) {
    return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
};

var addquoted = function addquoted(b, s, len) {
    luaL_addchar(b, 34 /* '"'.charCodeAt(0) */);
    var i = 0;
    while (len--) {
        if (s[i] === 34 /* '"'.charCodeAt(0) */ || s[i] === 92 /* '\\'.charCodeAt(0) */ || s[i] === 10 /* '\n'.charCodeAt(0) */) {
                luaL_addchar(b, 92 /* '\\'.charCodeAt(0) */);
                luaL_addchar(b, s[i]);
            } else if (iscntrl(s[i])) {
            var buff = '' + s[i];
            if (isdigit(s[i + 1])) buff = '0'.repeat(3 - buff.length) + buff; /* pad to 3 '0's */
            luaL_addstring(b, to_luastring("\\" + buff));
        } else luaL_addchar(b, s[i]);
        i++;
    }
    luaL_addchar(b, 34 /* '"'.charCodeAt(0) */);
};

/*
** Ensures the 'buff' string uses a dot as the radix character.
*/
var checkdp = function checkdp(buff) {
    if (luastring_indexOf(buff, 46 /* ('.').charCodeAt(0) */) < 0) {
        /* no dot? */
        var point = lua_getlocaledecpoint(); /* try locale point */
        var ppoint = luastring_indexOf(buff, point);
        if (ppoint) buff[ppoint] = 46 /* ('.').charCodeAt(0) */; /* change it to a dot */
    }
};

var addliteral = function addliteral(L, b, arg) {
    switch (lua_type(L, arg)) {
        case LUA_TSTRING:
            {
                var s = lua_tostring(L, arg);
                addquoted(b, s, s.length);
                break;
            }
        case LUA_TNUMBER:
            {
                var buff = void 0;
                if (!lua_isinteger(L, arg)) {
                    /* float? */
                    var n = lua_tonumber(L, arg); /* write as hexa ('%a') */
                    buff = lua_number2strx(L, to_luastring('%' + LUA_INTEGER_FRMLEN + 'a'), n);
                    checkdp(buff); /* ensure it uses a dot */
                } else {
                    /* integers */
                    var _n = lua_tointeger(L, arg);
                    var format = _n === LUA_MININTEGER ? /* corner case? */
                    "0x%" + LUA_INTEGER_FRMLEN + "x" /* use hexa */
                    : LUA_INTEGER_FMT; /* else use default format */
                    buff = to_luastring(sprintf(format, _n));
                }
                luaL_addstring(b, buff);
                break;
            }
        case LUA_TNIL:case LUA_TBOOLEAN:
            {
                luaL_tolstring(L, arg);
                luaL_addvalue(b);
                break;
            }
        default:
            {
                luaL_argerror(L, arg, to_luastring("value has no literal form", true));
            }
    }
};

var scanformat = function scanformat(L, strfrmt, i, form) {
    var p = i;
    while (strfrmt[p] !== 0 && luastring_indexOf(FLAGS, strfrmt[p]) >= 0) {
        p++;
    } /* skip flags */
    if (p - i >= FLAGS.length) luaL_error(L, to_luastring("invalid format (repeated flags)", true));
    if (isdigit(strfrmt[p])) p++; /* skip width */
    if (isdigit(strfrmt[p])) p++; /* (2 digits at most) */
    if (strfrmt[p] === 46 /* '.'.charCodeAt(0) */) {
            p++;
            if (isdigit(strfrmt[p])) p++; /* skip precision */
            if (isdigit(strfrmt[p])) p++; /* (2 digits at most) */
        }
    if (isdigit(strfrmt[p])) luaL_error(L, to_luastring("invalid format (width or precision too long)", true));
    form[0] = 37 /* "%".charCodeAt(0) */;
    for (var j = 0; j < p - i + 1; j++) {
        form[j + 1] = strfrmt[i + j];
    }return p;
};

/*
** add length modifier into formats
*/
var addlenmod = function addlenmod(form, lenmod) {
    var l = form.length;
    var lm = lenmod.length;
    var spec = form[l - 1];
    for (var i = 0; i < lm; i++) {
        form[i + l - 1] = lenmod[i];
    }form[l + lm - 1] = spec;
    // form[l + lm] = 0;
};

var str_format = function str_format(L) {
    var top = lua_gettop(L);
    var arg = 1;
    var strfrmt = luaL_checkstring(L, arg);
    var i = 0;
    var b = new luaL_Buffer();
    luaL_buffinit(L, b);
    while (i < strfrmt.length) {
        if (strfrmt[i] !== L_ESC) {
            luaL_addchar(b, strfrmt[i++]);
        } else if (strfrmt[++i] === L_ESC) {
            luaL_addchar(b, strfrmt[i++]); /* %% */
        } else {
            /* format item */
            var form = []; /* to store the format ('%...') */
            if (++arg > top) luaL_argerror(L, arg, to_luastring("no value", true));
            i = scanformat(L, strfrmt, i, form);
            switch (String.fromCharCode(strfrmt[i++])) {
                case 'c':
                    {
                        // sprintf(String.fromCharCode(...form), luaL_checkinteger(L, arg));
                        luaL_addchar(b, luaL_checkinteger(L, arg));
                        break;
                    }
                case 'd':case 'i':
                case 'o':case 'u':case 'x':case 'X':
                    {
                        var n = luaL_checkinteger(L, arg);
                        addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
                        luaL_addstring(b, to_luastring(sprintf(String.fromCharCode.apply(String, form), n)));
                        break;
                    }
                case 'a':case 'A':
                    {
                        addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
                        luaL_addstring(b, lua_number2strx(L, form, luaL_checknumber(L, arg)));
                        break;
                    }
                case 'e':case 'E':case 'f':
                case 'g':case 'G':
                    {
                        var _n2 = luaL_checknumber(L, arg);
                        addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
                        luaL_addstring(b, to_luastring(sprintf(String.fromCharCode.apply(String, form), _n2)));
                        break;
                    }
                case 'q':
                    {
                        addliteral(L, b, arg);
                        break;
                    }
                case 's':
                    {
                        var s = luaL_tolstring(L, arg);
                        if (form.length <= 2 || form[2] === 0) {
                            /* no modifiers? */
                            luaL_addvalue(b); /* keep entire string */
                        } else {
                            luaL_argcheck(L, s.length === strlen(s), arg, to_luastring("string contains zeros", true));
                            if (luastring_indexOf(form, 46 /* '.'.charCodeAt(0) */) < 0 && s.length >= 100) {
                                /* no precision and string is too long to be formatted */
                                luaL_addvalue(b); /* keep entire string */
                            } else {
                                /* format the string into 'buff' */
                                // TODO: will fail if s is not valid UTF-8
                                luaL_addstring(b, to_luastring(sprintf(String.fromCharCode.apply(String, form), to_jsstring(s))));
                                lua_pop(L, 1); /* remove result from 'luaL_tolstring' */
                            }
                        }
                        break;
                    }
                default:
                    {
                        /* also treat cases 'pnLlh' */
                        return luaL_error(L, to_luastring("invalid option '%%%c' to 'format'"), strfrmt[i - 1]);
                    }
            }
        }
    }
    luaL_pushresult(b);
    return 1;
};

/* value used for padding */
var LUAL_PACKPADBYTE = 0x00;

/* maximum size for the binary representation of an integer */
var MAXINTSIZE = 16;

var SZINT = 4; // Size of lua_Integer

/* number of bits in a character */
var NB = 8;

/* mask for one character (NB 1's) */
var MC = (1 << NB) - 1;

var MAXALIGN = 8;

/*
** information to pack/unpack stuff
*/

var Header = function Header(L) {
    _classCallCheck(this, Header);

    this.L = L;
    this.islittle = true;
    this.maxalign = 1;
};

/*
** options for pack/unpack
*/


var Kint = 0; /* signed integers */
var Kuint = 1; /* unsigned integers */
var Kfloat = 2; /* floating-point numbers */
var Kchar = 3; /* fixed-length strings */
var Kstring = 4; /* strings with prefixed length */
var Kzstr = 5; /* zero-terminated strings */
var Kpadding = 6; /* padding */
var Kpaddalign = 7; /* padding for alignment */
var Knop = 8; /* no-op (configuration or spaces) */

var digit = isdigit;

var getnum = function getnum(fmt, df) {
    if (fmt.off >= fmt.s.length || !digit(fmt.s[fmt.off])) /* no number? */
        return df; /* return default value */
    else {
            var a = 0;
            do {
                a = a * 10 + (fmt.s[fmt.off++] - 48 /* '0'.charCodeAt(0) */);
            } while (fmt.off < fmt.s.length && digit(fmt.s[fmt.off]) && a <= (MAXSIZE - 9) / 10);
            return a;
        }
};

/*
** Read an integer numeral and raises an error if it is larger
** than the maximum size for integers.
*/
var getnumlimit = function getnumlimit(h, fmt, df) {
    var sz = getnum(fmt, df);
    if (sz > MAXINTSIZE || sz <= 0) luaL_error(h.L, to_luastring("integral size (%d) out of limits [1,%d]"), sz, MAXINTSIZE);
    return sz;
};

/*
** Read and classify next option. 'size' is filled with option's size.
*/
var getoption = function getoption(h, fmt) {
    var r = {
        opt: fmt.s[fmt.off++],
        size: 0 /* default */
    };
    switch (r.opt) {
        case 98 /*'b'*/:
            r.size = 1;r.opt = Kint;return r; // sizeof(char): 1
        case 66 /*'B'*/:
            r.size = 1;r.opt = Kuint;return r;
        case 104 /*'h'*/:
            r.size = 2;r.opt = Kint;return r; // sizeof(short): 2
        case 72 /*'H'*/:
            r.size = 2;r.opt = Kuint;return r;
        case 108 /*'l'*/:
            r.size = 4;r.opt = Kint;return r; // sizeof(long): 4
        case 76 /*'L'*/:
            r.size = 4;r.opt = Kuint;return r;
        case 106 /*'j'*/:
            r.size = 4;r.opt = Kint;return r; // sizeof(lua_Integer): 4
        case 74 /*'J'*/:
            r.size = 4;r.opt = Kuint;return r;
        case 84 /*'T'*/:
            r.size = 4;r.opt = Kuint;return r; // sizeof(size_t): 4
        case 102 /*'f'*/:
            r.size = 4;r.opt = Kfloat;return r; // sizeof(float): 4
        case 100 /*'d'*/:
            r.size = 8;r.opt = Kfloat;return r; // sizeof(double): 8
        case 110 /*'n'*/:
            r.size = 8;r.opt = Kfloat;return r; // sizeof(lua_Number): 8
        case 105 /*'i'*/:
            r.size = getnumlimit(h, fmt, 4);r.opt = Kint;return r; // sizeof(int): 4
        case 73 /*'I'*/:
            r.size = getnumlimit(h, fmt, 4);r.opt = Kuint;return r;
        case 115 /*'s'*/:
            r.size = getnumlimit(h, fmt, 4);r.opt = Kstring;return r;
        case 99 /*'c'*/:
            {
                r.size = getnum(fmt, -1);
                if (r.size === -1) luaL_error(h.L, to_luastring("missing size for format option 'c'"));
                r.opt = Kchar;
                return r;
            }
        case 122 /*'z'*/:
            r.opt = Kzstr;return r;
        case 120 /*'x'*/:
            r.size = 1;r.opt = Kpadding;return r;
        case 88 /*'X'*/:
            r.opt = Kpaddalign;return r;
        case 32 /*' '*/:
            break;
        case 60 /*'<'*/:
            h.islittle = true;break;
        case 62 /*'>'*/:
            h.islittle = false;break;
        case 61 /*'='*/:
            h.islittle = true;break;
        case 33 /*'!'*/:
            h.maxalign = getnumlimit(h, fmt, MAXALIGN);break;
        default:
            luaL_error(h.L, to_luastring("invalid format option '%c'"), r.opt);
    }
    r.opt = Knop;
    return r;
};

/*
** Read, classify, and fill other details about the next option.
** 'psize' is filled with option's size, 'notoalign' with its
** alignment requirements.
** Local variable 'size' gets the size to be aligned. (Kpadal option
** always gets its full alignment, other options are limited by
** the maximum alignment ('maxalign'). Kchar option needs no alignment
** despite its size.
*/
var getdetails = function getdetails(h, totalsize, fmt) {
    var r = {
        opt: NaN,
        size: NaN,
        ntoalign: NaN
    };

    var opt = getoption(h, fmt);
    r.size = opt.size;
    r.opt = opt.opt;
    var align = r.size; /* usually, alignment follows size */
    if (r.opt === Kpaddalign) {
        /* 'X' gets alignment from following option */
        if (fmt.off >= fmt.s.length || fmt.s[fmt.off] === 0) luaL_argerror(h.L, 1, to_luastring("invalid next option for option 'X'", true));else {
            var o = getoption(h, fmt);
            align = o.size;
            o = o.opt;
            if (o === Kchar || align === 0) luaL_argerror(h.L, 1, to_luastring("invalid next option for option 'X'", true));
        }
    }
    if (align <= 1 || r.opt === Kchar) /* need no alignment? */
        r.ntoalign = 0;else {
        if (align > h.maxalign) /* enforce maximum alignment */
            align = h.maxalign;
        if ((align & align - 1) !== 0) /* is 'align' not a power of 2? */
            luaL_argerror(h.L, 1, to_luastring("format asks for alignment not power of 2", true));
        r.ntoalign = align - (totalsize & align - 1) & align - 1;
    }
    return r;
};

/*
** Pack integer 'n' with 'size' bytes and 'islittle' endianness.
** The final 'if' handles the case when 'size' is larger than
** the size of a Lua integer, correcting the extra sign-extension
** bytes if necessary (by default they would be zeros).
*/
var packint = function packint(b, n, islittle, size, neg) {
    var buff = luaL_prepbuffsize(b, size);
    buff[islittle ? 0 : size - 1] = n & MC; /* first byte */
    for (var i = 1; i < size; i++) {
        n >>= NB;
        buff[islittle ? i : size - 1 - i] = n & MC;
    }
    if (neg && size > SZINT) {
        /* negative number need sign extension? */
        for (var _i = SZINT; _i < size; _i++) {
            /* correct extra bytes */
            buff[islittle ? _i : size - 1 - _i] = MC;
        }
    }
    luaL_addsize(b, size); /* add result to buffer */
};

var str_pack = function str_pack(L) {
    var b = new luaL_Buffer();
    var h = new Header(L);
    var fmt = {
        s: luaL_checkstring(L, 1), /* format string */
        off: 0
    };
    var arg = 1; /* current argument to pack */
    var totalsize = 0; /* accumulate total size of result */
    lua_pushnil(L); /* mark to separate arguments from string buffer */
    luaL_buffinit(L, b);
    while (fmt.off < fmt.s.length) {
        var details = getdetails(h, totalsize, fmt);
        var opt = details.opt;
        var size = details.size;
        var ntoalign = details.ntoalign;
        totalsize += ntoalign + size;
        while (ntoalign-- > 0) {
            luaL_addchar(b, LUAL_PACKPADBYTE);
        } /* fill alignment */
        arg++;
        switch (opt) {
            case Kint:
                {
                    /* signed integers */
                    var n = luaL_checkinteger(L, arg);
                    if (size < SZINT) {
                        /* need overflow check? */
                        var lim = 1 << size * 8 - 1;
                        luaL_argcheck(L, -lim <= n && n < lim, arg, to_luastring("integer overflow", true));
                    }
                    packint(b, n, h.islittle, size, n < 0);
                    break;
                }
            case Kuint:
                {
                    /* unsigned integers */
                    var _n3 = luaL_checkinteger(L, arg);
                    if (size < SZINT) luaL_argcheck(L, _n3 >>> 0 < 1 << size * NB, arg, to_luastring("unsigned overflow", true));
                    packint(b, _n3 >>> 0, h.islittle, size, false);
                    break;
                }
            case Kfloat:
                {
                    /* floating-point options */
                    var buff = luaL_prepbuffsize(b, size);
                    var _n4 = luaL_checknumber(L, arg); /* get argument */
                    var dv = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
                    if (size === 4) dv.setFloat32(0, _n4, h.islittle);else dv.setFloat64(0, _n4, h.islittle);
                    luaL_addsize(b, size);
                    break;
                }
            case Kchar:
                {
                    /* fixed-size string */
                    var s = luaL_checkstring(L, arg);
                    var len = s.length;
                    luaL_argcheck(L, len <= size, arg, to_luastring("string longer than given size", true));
                    luaL_addlstring(b, s, len); /* add string */
                    while (len++ < size) {
                        /* pad extra space */
                        luaL_addchar(b, LUAL_PACKPADBYTE);
                    }break;
                }
            case Kstring:
                {
                    /* strings with length count */
                    var _s = luaL_checkstring(L, arg);
                    var _len = _s.length;
                    luaL_argcheck(L, size >= 4 /* sizeof(size_t) */ || _len < 1 << size * NB, arg, to_luastring("string length does not fit in given size", true));
                    packint(b, _len, h.islittle, size, 0); /* pack length */
                    luaL_addlstring(b, _s, _len);
                    totalsize += _len;
                    break;
                }
            case Kzstr:
                {
                    /* zero-terminated string */
                    var _s2 = luaL_checkstring(L, arg);
                    var _len2 = _s2.length;
                    luaL_argcheck(L, luastring_indexOf(_s2, 0) < 0, arg, to_luastring("strings contains zeros", true));
                    luaL_addlstring(b, _s2, _len2);
                    luaL_addchar(b, 0); /* add zero at the end */
                    totalsize += _len2 + 1;
                    break;
                }
            case Kpadding:
                luaL_addchar(b, LUAL_PACKPADBYTE); /* fall through */
            case Kpaddalign:case Knop:
                arg--; /* undo increment */
                break;
        }
    }
    luaL_pushresult(b);
    return 1;
};

var str_reverse = function str_reverse(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var r = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        r[i] = s[l - 1 - i];
    }lua_pushstring(L, r);
    return 1;
};

var str_lower = function str_lower(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var r = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        var c = s[i];
        if (isupper(c)) c = c | 0x20;
        r[i] = c;
    }
    lua_pushstring(L, r);
    return 1;
};

var str_upper = function str_upper(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var r = new Uint8Array(l);
    for (var i = 0; i < l; i++) {
        var c = s[i];
        if (islower(c)) c = c & 0xdf;
        r[i] = c;
    }
    lua_pushstring(L, r);
    return 1;
};

var str_rep = function str_rep(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var n = luaL_checkinteger(L, 2);
    var sep = luaL_optstring(L, 3, to_luastring(""));
    var lsep = sep.length;
    if (n <= 0) lua_pushliteral(L, "");else if (l + lsep < l || l + lsep > MAXSIZE / n) /* may overflow? */
        return luaL_error(L, to_luastring("resulting string too large"));else {
        var totallen = n * l + (n - 1) * lsep;
        var b = new luaL_Buffer();
        var p = luaL_buffinitsize(L, b, totallen);
        var pi = 0;
        while (n-- > 1) {
            /* first n-1 copies (followed by separator) */
            p.set(s, pi);
            pi += l;
            if (lsep > 0) {
                /* empty 'memcpy' is not that cheap */
                p.set(sep, pi);
                pi += lsep;
            }
        }
        p.set(s, pi); /* last copy (not followed by separator) */
        luaL_pushresultsize(b, totallen);
    }
    return 1;
};

var str_byte = function str_byte(L) {
    var s = luaL_checkstring(L, 1);
    var l = s.length;
    var posi = posrelat(luaL_optinteger(L, 2, 1), l);
    var pose = posrelat(luaL_optinteger(L, 3, posi), l);

    if (posi < 1) posi = 1;
    if (pose > l) pose = l;
    if (posi > pose) return 0; /* empty interval; return no values */
    if (pose - posi >= Number.MAX_SAFE_INTEGER) /* arithmetic overflow? */
        return luaL_error(L, to_luastring("string slice too long", true));

    var n = pose - posi + 1;
    luaL_checkstack(L, n, to_luastring("string slice too long", true));
    for (var i = 0; i < n; i++) {
        lua_pushinteger(L, s[posi + i - 1]);
    }return n;
};

var str_packsize = function str_packsize(L) {
    var h = new Header(L);
    var fmt = {
        s: luaL_checkstring(L, 1),
        off: 0
    };
    var totalsize = 0; /* accumulate total size of result */
    while (fmt.off < fmt.s.length) {
        var details = getdetails(h, totalsize, fmt);
        var opt = details.opt;
        var size = details.size;
        var ntoalign = details.ntoalign;
        size += ntoalign; /* total space used by option */
        luaL_argcheck(L, totalsize <= MAXSIZE - size, 1, to_luastring("format result too large", true));
        totalsize += size;
        switch (opt) {
            case Kstring: /* strings with length count */
            case Kzstr:
                /* zero-terminated string */
                luaL_argerror(L, 1, to_luastring("variable-length format", true));
            /* call never return, but to avoid warnings: */ /* fall through */
            default:
                break;
        }
    }
    lua_pushinteger(L, totalsize);
    return 1;
};

/*
** Unpack an integer with 'size' bytes and 'islittle' endianness.
** If size is smaller than the size of a Lua integer and integer
** is signed, must do sign extension (propagating the sign to the
** higher bits); if size is larger than the size of a Lua integer,
** it must check the unread bytes to see whether they do not cause an
** overflow.
*/
var unpackint = function unpackint(L, str, islittle, size, issigned) {
    var res = 0;
    var limit = size <= SZINT ? size : SZINT;
    for (var i = limit - 1; i >= 0; i--) {
        res <<= NB;
        res |= str[islittle ? i : size - 1 - i];
    }
    if (size < SZINT) {
        /* real size smaller than lua_Integer? */
        if (issigned) {
            /* needs sign extension? */
            var mask = 1 << size * NB - 1;
            res = (res ^ mask) - mask; /* do sign extension */
        }
    } else if (size > SZINT) {
        /* must check unread bytes */
        var _mask = !issigned || res >= 0 ? 0 : MC;
        for (var _i2 = limit; _i2 < size; _i2++) {
            if (str[islittle ? _i2 : size - 1 - _i2] !== _mask) luaL_error(L, to_luastring("%d-byte integer does not fit into Lua Integer"), size);
        }
    }
    return res;
};

var unpacknum = function unpacknum(L, b, islittle, size) {
    lualib.lua_assert(b.length >= size);

    var dv = new DataView(new ArrayBuffer(size));
    for (var i = 0; i < size; i++) {
        dv.setUint8(i, b[i], islittle);
    }if (size == 4) return dv.getFloat32(0, islittle);else return dv.getFloat64(0, islittle);
};

var str_unpack = function str_unpack(L) {
    var h = new Header(L);
    var fmt = {
        s: luaL_checkstring(L, 1),
        off: 0
    };
    var data = luaL_checkstring(L, 2);
    var ld = data.length;
    var pos = posrelat(luaL_optinteger(L, 3, 1), ld) - 1;
    var n = 0; /* number of results */
    luaL_argcheck(L, pos <= ld && pos >= 0, 3, to_luastring("initial position out of string", true));
    while (fmt.off < fmt.s.length) {
        var details = getdetails(h, pos, fmt);
        var opt = details.opt;
        var size = details.size;
        var ntoalign = details.ntoalign;
        if ( /*ntoalign + size > ~pos ||*/pos + ntoalign + size > ld) luaL_argerror(L, 2, to_luastring("data string too short", true));
        pos += ntoalign; /* skip alignment */
        /* stack space for item + next position */
        luaL_checkstack(L, 2, to_luastring("too many results", true));
        n++;
        switch (opt) {
            case Kint:
            case Kuint:
                {
                    var res = unpackint(L, data.subarray(pos), h.islittle, size, opt === Kint);
                    lua_pushinteger(L, res);
                    break;
                }
            case Kfloat:
                {
                    var _res = unpacknum(L, data.subarray(pos), h.islittle, size);
                    lua_pushnumber(L, _res);
                    break;
                }
            case Kchar:
                {
                    lua_pushstring(L, data.subarray(pos, pos + size));
                    break;
                }
            case Kstring:
                {
                    var len = unpackint(L, data.subarray(pos), h.islittle, size, 0);
                    luaL_argcheck(L, pos + len + size <= ld, 2, to_luastring("data string too short", true));
                    lua_pushstring(L, data.subarray(pos + size, pos + size + len));
                    pos += len; /* skip string */
                    break;
                }
            case Kzstr:
                {
                    var e = luastring_indexOf(data, 0, pos);
                    if (e === -1) e = data.length - pos;
                    lua_pushstring(L, data.subarray(pos, e));
                    pos = e + 1; /* skip string plus final '\0' */
                    break;
                }
            case Kpaddalign:case Kpadding:case Knop:
                n--; /* undo increment */
                break;
        }
        pos += size;
    }
    lua_pushinteger(L, pos + 1); /* next position */
    return n + 1;
};

var CAP_UNFINISHED = -1;
var CAP_POSITION = -2;
var MAXCCALLS = 200;
var SPECIALS = to_luastring("^$*+?.([%-");

var MatchState = function MatchState(L) {
    _classCallCheck(this, MatchState);

    this.src = null; /* unmodified source string */
    this.src_init = null; /* init of source string */
    this.src_end = null; /* end ('\0') of source string */
    this.p = null; /* unmodified pattern string */
    this.p_end = null; /* end ('\0') of pattern */
    this.L = L;
    this.matchdepth = NaN; /* control for recursive depth */
    this.level = NaN; /* total number of captures (finished or unfinished) */
    this.capture = [];
};

var check_capture = function check_capture(ms, l) {
    l = l - 49 /* '1'.charCodeAt(0) */;
    if (l < 0 || l >= ms.level || ms.capture[l].len === CAP_UNFINISHED) return luaL_error(ms.L, to_luastring("invalid capture index %%%d"), l + 1);
    return l;
};

var capture_to_close = function capture_to_close(ms) {
    var level = ms.level;
    for (level--; level >= 0; level--) {
        if (ms.capture[level].len === CAP_UNFINISHED) return level;
    }return luaL_error(ms.L, to_luastring("invalid pattern capture"));
};

var classend = function classend(ms, p) {
    switch (ms.p[p++]) {
        case L_ESC:
            {
                if (p === ms.p_end) luaL_error(ms.L, to_luastring("malformed pattern (ends with '%%')"));
                return p + 1;
            }
        case 91 /* '['.charCodeAt(0) */:
            {
                if (ms.p[p] === 94 /* '^'.charCodeAt(0) */) p++;
                do {
                    /* look for a ']' */
                    if (p === ms.p_end) luaL_error(ms.L, to_luastring("malformed pattern (missing ']')"));
                    if (ms.p[p++] === L_ESC && p < ms.p_end) p++; /* skip escapes (e.g. '%]') */
                } while (ms.p[p] !== 93 /* ']'.charCodeAt(0) */);
                return p + 1;
            }
        default:
            {
                return p;
            }
    }
};

var match_class = function match_class(c, cl) {
    switch (cl) {
        case 97 /* 'a'.charCodeAt(0) */:
            return isalpha(c);
        case 65 /* 'A'.charCodeAt(0) */:
            return !isalpha(c);
        case 99 /* 'c'.charCodeAt(0) */:
            return iscntrl(c);
        case 67 /* 'C'.charCodeAt(0) */:
            return !iscntrl(c);
        case 100 /* 'd'.charCodeAt(0) */:
            return isdigit(c);
        case 68 /* 'D'.charCodeAt(0) */:
            return !isdigit(c);
        case 103 /* 'g'.charCodeAt(0) */:
            return isgraph(c);
        case 71 /* 'G'.charCodeAt(0) */:
            return !isgraph(c);
        case 108 /* 'l'.charCodeAt(0) */:
            return islower(c);
        case 76 /* 'L'.charCodeAt(0) */:
            return !islower(c);
        case 112 /* 'p'.charCodeAt(0) */:
            return ispunct(c);
        case 80 /* 'P'.charCodeAt(0) */:
            return !ispunct(c);
        case 115 /* 's'.charCodeAt(0) */:
            return isspace(c);
        case 83 /* 'S'.charCodeAt(0) */:
            return !isspace(c);
        case 117 /* 'u'.charCodeAt(0) */:
            return isupper(c);
        case 85 /* 'U'.charCodeAt(0) */:
            return !isupper(c);
        case 119 /* 'w'.charCodeAt(0) */:
            return isalnum(c);
        case 87 /* 'W'.charCodeAt(0) */:
            return !isalnum(c);
        case 120 /* 'x'.charCodeAt(0) */:
            return isxdigit(c);
        case 88 /* 'X'.charCodeAt(0) */:
            return !isxdigit(c);
        case 122 /* 'z'.charCodeAt(0) */:
            return c === 0; /* deprecated option */
        case 90 /* 'z'.charCodeAt(0) */:
            return c !== 0; /* deprecated option */
        default:
            return cl === c;
    }
};

var matchbracketclass = function matchbracketclass(ms, c, p, ec) {
    var sig = true;
    if (ms.p[p + 1] === 94 /* '^'.charCodeAt(0) */) {
            sig = false;
            p++; /* skip the '^' */
        }
    while (++p < ec) {
        if (ms.p[p] === L_ESC) {
            p++;
            if (match_class(c, ms.p[p])) return sig;
        } else if (ms.p[p + 1] === 45 /* '-'.charCodeAt(0) */ && p + 2 < ec) {
            p += 2;
            if (ms.p[p - 2] <= c && c <= ms.p[p]) return sig;
        } else if (ms.p[p] === c) return sig;
    }
    return !sig;
};

var singlematch = function singlematch(ms, s, p, ep) {
    if (s >= ms.src_end) return false;else {
        var c = ms.src[s];
        switch (ms.p[p]) {
            case 46 /* '.'.charCodeAt(0) */:
                return true; /* matches any char */
            case L_ESC:
                return match_class(c, ms.p[p + 1]);
            case 91 /* '['.charCodeAt(0) */:
                return matchbracketclass(ms, c, p, ep - 1);
            default:
                return ms.p[p] === c;
        }
    }
};

var matchbalance = function matchbalance(ms, s, p) {
    if (p >= ms.p_end - 1) luaL_error(ms.L, to_luastring("malformed pattern (missing arguments to '%%b'"));
    if (ms.src[s] !== ms.p[p]) return null;else {
        var b = ms.p[p];
        var e = ms.p[p + 1];
        var cont = 1;
        while (++s < ms.src_end) {
            if (ms.src[s] === e) {
                if (--cont === 0) return s + 1;
            } else if (ms.src[s] === b) cont++;
        }
    }
    return null; /* string ends out of balance */
};

var max_expand = function max_expand(ms, s, p, ep) {
    var i = 0; /* counts maximum expand for item */
    while (singlematch(ms, s + i, p, ep)) {
        i++;
    } /* keeps trying to match with the maximum repetitions */
    while (i >= 0) {
        var res = match(ms, s + i, ep + 1);
        if (res) return res;
        i--; /* else didn't match; reduce 1 repetition to try again */
    }
    return null;
};

var min_expand = function min_expand(ms, s, p, ep) {
    for (;;) {
        var res = match(ms, s, ep + 1);
        if (res !== null) return res;else if (singlematch(ms, s, p, ep)) s++; /* try with one more repetition */
        else return null;
    }
};

var start_capture = function start_capture(ms, s, p, what) {
    var level = ms.level;
    if (level >= LUA_MAXCAPTURES) luaL_error(ms.L, to_luastring("too many captures", true));
    ms.capture[level] = ms.capture[level] ? ms.capture[level] : {};
    ms.capture[level].init = s;
    ms.capture[level].len = what;
    ms.level = level + 1;
    var res = void 0;
    if ((res = match(ms, s, p)) === null) /* match failed? */
        ms.level--; /* undo capture */
    return res;
};

var end_capture = function end_capture(ms, s, p) {
    var l = capture_to_close(ms);
    ms.capture[l].len = s - ms.capture[l].init; /* close capture */
    var res = void 0;
    if ((res = match(ms, s, p)) === null) /* match failed? */
        ms.capture[l].len = CAP_UNFINISHED; /* undo capture */
    return res;
};

/* Compare the elements of arrays 'a' and 'b' to see if they contain the same elements */
var array_cmp = function array_cmp(a, ai, b, bi, len) {
    if (len === 0) return true;
    var aj = ai + len;
    loop: for (;;) {
        ai = luastring_indexOf(a, b[bi], ai);
        if (ai === -1 || ai >= aj) return false;
        for (var j = 1; j < len; j++) {
            if (a[ai + j] !== b[bi + j]) {
                ai++;
                continue loop;
            }
        }
        return true;
    }
};

var match_capture = function match_capture(ms, s, l) {
    l = check_capture(ms, l);
    var len = ms.capture[l].len;
    if (ms.src_end - s >= len && array_cmp(ms.src, ms.capture[l].init, ms.src, s, len)) return s + len;else return null;
};

var match = function match(ms, s, p) {
    var gotodefault = false;
    var gotoinit = true;

    if (ms.matchdepth-- === 0) luaL_error(ms.L, to_luastring("pattern too complex", true));

    while (gotoinit || gotodefault) {
        gotoinit = false;
        if (p !== ms.p_end) {
            /* end of pattern? */
            switch (gotodefault ? void 0 : ms.p[p]) {
                case 40 /* '('.charCodeAt(0) */:
                    {
                        /* start capture */
                        if (ms.p[p + 1] === 41 /* ')'.charCodeAt(0) */) /* position capture? */
                            s = start_capture(ms, s, p + 2, CAP_POSITION);else s = start_capture(ms, s, p + 1, CAP_UNFINISHED);
                        break;
                    }
                case 41 /* ')'.charCodeAt(0) */:
                    {
                        /* end capture */
                        s = end_capture(ms, s, p + 1);
                        break;
                    }
                case 36 /* '$'.charCodeAt(0) */:
                    {
                        if (p + 1 !== ms.p_end) {
                            /* is the '$' the last char in pattern? */
                            gotodefault = true; /* no; go to default */
                            break;
                        }
                        s = ms.src.length - s === 0 ? s : null; /* check end of string */
                        break;
                    }
                case L_ESC:
                    {
                        /* escaped sequences not in the format class[*+?-]? */
                        switch (ms.p[p + 1]) {
                            case 98 /* 'b'.charCodeAt(0) */:
                                {
                                    /* balanced string? */
                                    s = matchbalance(ms, s, p + 2);
                                    if (s !== null) {
                                        p += 4;
                                        gotoinit = true;
                                    }
                                    break;
                                }
                            case 102 /* 'f'.charCodeAt(0) */:
                                {
                                    /* frontier? */
                                    p += 2;
                                    if (ms.p[p] !== 91 /* '['.charCodeAt(0) */) luaL_error(ms.L, to_luastring("missing '[' after '%%f' in pattern"));
                                    var ep = classend(ms, p); /* points to what is next */
                                    var previous = s === ms.src_init ? 0 : ms.src[s - 1];
                                    if (!matchbracketclass(ms, previous, p, ep - 1) && matchbracketclass(ms, s === ms.src_end ? 0 : ms.src[s], p, ep - 1)) {
                                        p = ep;gotoinit = true;break;
                                    }
                                    s = null; /* match failed */
                                    break;
                                }
                            case 48:case 49:case 50:case 51:case 52:
                            case 53:case 54:case 55:case 56:case 57:
                                {
                                    /* capture results (%0-%9)? */
                                    s = match_capture(ms, s, ms.p[p + 1]);
                                    if (s !== null) {
                                        p += 2;gotoinit = true;
                                    }
                                    break;
                                }
                            default:
                                gotodefault = true;
                        }
                        break;
                    }
                default:
                    {
                        /* pattern class plus optional suffix */
                        gotodefault = false;
                        var _ep = classend(ms, p); /* points to optional suffix */
                        /* does not match at least once? */
                        if (!singlematch(ms, s, p, _ep)) {
                            if (ms.p[_ep] === 42 /* '*'.charCodeAt(0) */ || ms.p[_ep] === 63 /* '?'.charCodeAt(0) */ || ms.p[_ep] === 45 /* '-'.charCodeAt(0) */
                            ) {
                                    /* accept empty? */
                                    p = _ep + 1;gotoinit = true;break;
                                } else /* '+' or no suffix */
                                s = null; /* fail */
                        } else {
                            /* matched once */
                            switch (ms.p[_ep]) {/* handle optional suffix */
                                case 63 /* '?'.charCodeAt(0) */:
                                    {
                                        /* optional */
                                        var res = void 0;
                                        if ((res = match(ms, s + 1, _ep + 1)) !== null) s = res;else {
                                            p = _ep + 1;gotoinit = true;
                                        }
                                        break;
                                    }
                                case 43 /* '+'.charCodeAt(0) */:
                                    /* 1 or more repetitions */
                                    s++; /* 1 match already done */
                                /* fall through */
                                case 42 /* '*'.charCodeAt(0) */:
                                    /* 0 or more repetitions */
                                    s = max_expand(ms, s, p, _ep);
                                    break;
                                case 45 /* '-'.charCodeAt(0) */:
                                    /* 0 or more repetitions (minimum) */
                                    s = min_expand(ms, s, p, _ep);
                                    break;
                                default:
                                    /* no suffix */
                                    s++;p = _ep;gotoinit = true;
                            }
                        }
                        break;
                    }
            }
        }
    }
    ms.matchdepth++;
    return s;
};

var push_onecapture = function push_onecapture(ms, i, s, e) {
    if (i >= ms.level) {
        if (i === 0) lua_pushlstring(ms.L, ms.src.subarray(s, e), e - s); /* add whole match */
        else luaL_error(ms.L, to_luastring("invalid capture index %%%d"), i + 1);
    } else {
        var l = ms.capture[i].len;
        if (l === CAP_UNFINISHED) luaL_error(ms.L, to_luastring("unfinished capture", true));
        if (l === CAP_POSITION) lua_pushinteger(ms.L, ms.capture[i].init - ms.src_init + 1);else lua_pushlstring(ms.L, ms.src.subarray(ms.capture[i].init), l);
    }
};

var push_captures = function push_captures(ms, s, e) {
    var nlevels = ms.level === 0 && ms.src.subarray(s) ? 1 : ms.level;
    luaL_checkstack(ms.L, nlevels, to_luastring("too many catpures", true));
    for (var i = 0; i < nlevels; i++) {
        push_onecapture(ms, i, s, e);
    }return nlevels; /* number of strings pushed */
};

var nospecials = function nospecials(p, l) {
    for (var i = 0; i < l; i++) {
        if (luastring_indexOf(SPECIALS, p[i]) !== -1) return false;
    }
    return true;
};

var prepstate = function prepstate(ms, L, s, ls, p, lp) {
    ms.L = L;
    ms.matchdepth = MAXCCALLS;
    ms.src = s;
    ms.src_init = 0;
    ms.src_end = ls;
    ms.p = p;
    ms.p_end = lp;
};

var reprepstate = function reprepstate(ms) {
    ms.level = 0;
    lualib.lua_assert(ms.matchdepth === MAXCCALLS);
};

var find_subarray = function find_subarray(arr, subarr, from_index) {
    var i = from_index >>> 0,
        sl = subarr.length;

    if (sl === 0) return i;

    loop: for (;;) {
        i = arr.indexOf(subarr[0], i);
        if (i === -1) break;
        for (var j = 1; j < sl; j++) {
            if (arr[i + j] !== subarr[j]) {
                i++;
                continue loop;
            }
        }
        return i;
    }
    return -1;
};

var str_find_aux = function str_find_aux(L, find) {
    var s = luaL_checkstring(L, 1);
    var p = luaL_checkstring(L, 2);
    var ls = s.length;
    var lp = p.length;
    var init = posrelat(luaL_optinteger(L, 3, 1), ls);
    if (init < 1) init = 1;else if (init > ls + 1) {
        /* start after string's end? */
        lua_pushnil(L); /* cannot find anything */
        return 1;
    }
    /* explicit request or no special characters? */
    if (find && (lua_toboolean(L, 4) || nospecials(p, lp))) {
        /* do a plain search */
        var f = find_subarray(s.subarray(init - 1), p, 0);
        if (f > -1) {
            lua_pushinteger(L, init + f);
            lua_pushinteger(L, init + f + lp - 1);
            return 2;
        }
    } else {
        var ms = new MatchState(L);
        var s1 = init - 1;
        var anchor = p[0] === 94 /* '^'.charCodeAt(0) */;
        if (anchor) {
            p = p.subarray(1);lp--; /* skip anchor character */
        }
        prepstate(ms, L, s, ls, p, lp);
        do {
            var res = void 0;
            reprepstate(ms);
            if ((res = match(ms, s1, 0)) !== null) {
                if (find) {
                    lua_pushinteger(L, s1 + 1); /* start */
                    lua_pushinteger(L, res); /* end */
                    return push_captures(ms, null, 0) + 2;
                } else return push_captures(ms, s1, res);
            }
        } while (s1++ < ms.src_end && !anchor);
    }
    lua_pushnil(L); /* not found */
    return 1;
};

var str_find = function str_find(L) {
    return str_find_aux(L, 1);
};

var str_match = function str_match(L) {
    return str_find_aux(L, 0);
};

/* state for 'gmatch' */

var GMatchState = function GMatchState() {
    _classCallCheck(this, GMatchState);

    this.src = NaN; /* current position */
    this.p = NaN; /* pattern */
    this.lastmatch = NaN; /* end of last match */
    this.ms = new MatchState(); /* match state */
};

var gmatch_aux = function gmatch_aux(L) {
    var gm = lua_touserdata(L, lua_upvalueindex(3));
    gm.ms.L = L;
    for (var src = gm.src; src <= gm.ms.src_end; src++) {
        reprepstate(gm.ms);
        var e = void 0;
        if ((e = match(gm.ms, src, gm.p)) !== null && e !== gm.lastmatch) {
            gm.src = gm.lastmatch = e;
            return push_captures(gm.ms, src, e);
        }
    }
    return 0; /* not found */
};

var str_gmatch = function str_gmatch(L) {
    var s = luaL_checkstring(L, 1);
    var p = luaL_checkstring(L, 2);
    var ls = s.length;
    var lp = p.length;
    lua_settop(L, 2); /* keep them on closure to avoid being collected */
    var gm = new GMatchState();
    lua_pushlightuserdata(L, gm);
    prepstate(gm.ms, L, s, ls, p, lp);
    gm.src = 0;
    gm.p = 0;
    gm.lastmatch = null;
    lua_pushcclosure(L, gmatch_aux, 3);
    return 1;
};

var add_s = function add_s(ms, b, s, e) {
    var L = ms.L;
    var news = lua_tostring(L, 3);
    var l = news.length;
    for (var i = 0; i < l; i++) {
        if (news[i] !== L_ESC) luaL_addchar(b, news[i]);else {
            i++; /* skip ESC */
            if (!isdigit(news[i])) {
                if (news[i] !== L_ESC) luaL_error(L, to_luastring("invalid use of '%c' in replacement string"), L_ESC);
                luaL_addchar(b, news[i]);
            } else if (news[i] === 48 /* '0'.charCodeAt(0) */) luaL_addlstring(b, ms.src.subarray(s, e), e - s);else {
                push_onecapture(ms, news[i] - 49 /* '1'.charCodeAt(0) */, s, e);
                luaL_tolstring(L, -1);
                lua_remove(L, -2); /* remove original value */
                luaL_addvalue(b); /* add capture to accumulated result */
            }
        }
    }
};

var add_value = function add_value(ms, b, s, e, tr) {
    var L = ms.L;
    switch (tr) {
        case LUA_TFUNCTION:
            {
                lua_pushvalue(L, 3);
                var n = push_captures(ms, s, e);
                lua_call(L, n, 1);
                break;
            }
        case LUA_TTABLE:
            {
                push_onecapture(ms, 0, s, e);
                lua_gettable(L, 3);
                break;
            }
        default:
            {
                /* LUA_TNUMBER or LUA_TSTRING */
                add_s(ms, b, s, e);
                return;
            }
    }
    if (!lua_toboolean(L, -1)) {
        /* nil or false? */
        lua_pop(L, 1);
        lua_pushlstring(L, ms.src.subarray(s, e), e - s); /* keep original text */
    } else if (!lua_isstring(L, -1)) luaL_error(L, to_luastring("invalid replacement value (a %s)"), luaL_typename(L, -1));
    luaL_addvalue(b); /* add result to accumulator */
};

var str_gsub = function str_gsub(L) {
    var src = luaL_checkstring(L, 1); /* subject */
    var srcl = src.length;
    var p = luaL_checkstring(L, 2); /* pattern */
    var lp = p.length;
    var lastmatch = null; /* end of last match */
    var tr = lua_type(L, 3); /* replacement type */
    var max_s = luaL_optinteger(L, 4, srcl + 1); /* max replacements */
    var anchor = p[0] === 94 /* '^'.charCodeAt(0) */;
    var n = 0; /* replacement count */
    var ms = new MatchState(L);
    var b = new luaL_Buffer();
    luaL_argcheck(L, tr === LUA_TNUMBER || tr === LUA_TSTRING || tr === LUA_TFUNCTION || tr === LUA_TTABLE, 3, to_luastring("string/function/table expected", true));
    luaL_buffinit(L, b);
    if (anchor) {
        p = p.subarray(1);lp--; /* skip anchor character */
    }
    prepstate(ms, L, src, srcl, p, lp);
    src = 0;p = 0;
    while (n < max_s) {
        var e = void 0;
        reprepstate(ms);
        if ((e = match(ms, src, p)) !== null && e !== lastmatch) {
            /* match? */
            n++;
            add_value(ms, b, src, e, tr); /* add replacement to buffer */
            src = lastmatch = e;
        } else if (src < ms.src_end) /* otherwise, skip one character */
            luaL_addchar(b, ms.src[src++]);else break; /* end of subject */
        if (anchor) break;
    }
    luaL_addlstring(b, ms.src.subarray(src, ms.src_end), ms.src_end - src);
    luaL_pushresult(b);
    lua_pushinteger(L, n); /* number of substitutions */
    return 2;
};

var strlib = {
    "byte": str_byte,
    "char": str_char,
    "dump": str_dump,
    "find": str_find,
    "format": str_format,
    "gmatch": str_gmatch,
    "gsub": str_gsub,
    "len": str_len,
    "lower": str_lower,
    "match": str_match,
    "pack": str_pack,
    "packsize": str_packsize,
    "rep": str_rep,
    "reverse": str_reverse,
    "sub": str_sub,
    "unpack": str_unpack,
    "upper": str_upper
};

var createmetatable = function createmetatable(L) {
    lua_createtable(L, 0, 1); /* table to be metatable for strings */
    lua_pushliteral(L, ""); /* dummy string */
    lua_pushvalue(L, -2); /* copy table */
    lua_setmetatable(L, -2); /* set table as metatable for strings */
    lua_pop(L, 1); /* pop dummy string */
    lua_pushvalue(L, -2); /* get string library */
    lua_setfield(L, -2, to_luastring("__index", true)); /* metatable.__index = string */
    lua_pop(L, 1); /* pop metatable */
};

var luaopen_string = function luaopen_string(L) {
    luaL_newlib(L, strlib);
    createmetatable(L);
    return 1;
};

module.exports.luaopen_string = luaopen_string;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    lua_gettop = _require.lua_gettop,
    lua_pushcfunction = _require.lua_pushcfunction,
    lua_pushfstring = _require.lua_pushfstring,
    lua_pushinteger = _require.lua_pushinteger,
    lua_pushnil = _require.lua_pushnil,
    lua_pushstring = _require.lua_pushstring,
    lua_pushvalue = _require.lua_pushvalue,
    lua_setfield = _require.lua_setfield,
    lua_tointeger = _require.lua_tointeger;

var _require2 = __webpack_require__(6),
    luaL_Buffer = _require2.luaL_Buffer,
    luaL_addvalue = _require2.luaL_addvalue,
    luaL_argcheck = _require2.luaL_argcheck,
    luaL_buffinit = _require2.luaL_buffinit,
    luaL_checkinteger = _require2.luaL_checkinteger,
    luaL_checkstack = _require2.luaL_checkstack,
    luaL_checkstring = _require2.luaL_checkstring,
    luaL_error = _require2.luaL_error,
    luaL_newlib = _require2.luaL_newlib,
    luaL_optinteger = _require2.luaL_optinteger,
    luaL_pushresult = _require2.luaL_pushresult;

var _require3 = __webpack_require__(3),
    luastring_of = _require3.luastring_of,
    to_luastring = _require3.to_luastring;

var MAXUNICODE = 0x10FFFF;

var iscont = function iscont(p) {
    var c = p & 0xC0;
    return c === 0x80;
};

/* translate a relative string position: negative means back from end */
var u_posrelat = function u_posrelat(pos, len) {
    if (pos >= 0) return pos;else if (0 - pos > len) return 0;else return len + pos + 1;
};

/*
** Decode one UTF-8 sequence, returning NULL if byte sequence is invalid.
*/
var limits = [0xFF, 0x7F, 0x7FF, 0xFFFF];
var utf8_decode = function utf8_decode(s, pos) {
    var c = s[pos];
    var res = 0; /* final result */
    if (c < 0x80) /* ascii? */
        res = c;else {
        var count = 0; /* to count number of continuation bytes */
        while (c & 0x40) {
            /* still have continuation bytes? */
            var cc = s[pos + ++count]; /* read next byte */
            if ((cc & 0xC0) !== 0x80) /* not a continuation byte? */
                return null; /* invalid byte sequence */
            res = res << 6 | cc & 0x3F; /* add lower 6 bits from cont. byte */
            c <<= 1; /* to test next bit */
        }
        res |= (c & 0x7F) << count * 5; /* add first byte */
        if (count > 3 || res > MAXUNICODE || res <= limits[count]) return null; /* invalid byte sequence */
        pos += count; /* skip continuation bytes read */
    }

    return {
        code: res,
        pos: pos + 1
    };
};

/*
** utf8len(s [, i [, j]]) --> number of characters that start in the
** range [i,j], or nil + current position if 's' is not well formed in
** that interval
*/
var utflen = function utflen(L) {
    var n = 0;
    var s = luaL_checkstring(L, 1);
    var len = s.length;
    var posi = u_posrelat(luaL_optinteger(L, 2, 1), len);
    var posj = u_posrelat(luaL_optinteger(L, 3, -1), len);

    luaL_argcheck(L, 1 <= posi && --posi <= len, 2, to_luastring("initial position out of string"));
    luaL_argcheck(L, --posj < len, 3, to_luastring("final position out of string"));

    while (posi <= posj) {
        var dec = utf8_decode(s, posi);
        if (dec === null) {
            /* conversion error? */
            lua_pushnil(L); /* return nil ... */
            lua_pushinteger(L, posi + 1); /* ... and current position */
            return 2;
        }
        posi = dec.pos;
        n++;
    }
    lua_pushinteger(L, n);
    return 1;
};

var p_U = to_luastring("%U");
var pushutfchar = function pushutfchar(L, arg) {
    var code = luaL_checkinteger(L, arg);
    luaL_argcheck(L, 0 <= code && code <= MAXUNICODE, arg, to_luastring("value out of range", true));
    lua_pushfstring(L, p_U, code);
};

/*
** utfchar(n1, n2, ...)  -> char(n1)..char(n2)...
*/
var utfchar = function utfchar(L) {
    var n = lua_gettop(L); /* number of arguments */
    if (n === 1) /* optimize common case of single char */
        pushutfchar(L, 1);else {
        var b = new luaL_Buffer();
        luaL_buffinit(L, b);
        for (var i = 1; i <= n; i++) {
            pushutfchar(L, i);
            luaL_addvalue(b);
        }
        luaL_pushresult(b);
    }
    return 1;
};

/*
** offset(s, n, [i])  -> index where n-th character counting from
**   position 'i' starts; 0 means character at 'i'.
*/
var byteoffset = function byteoffset(L) {
    var s = luaL_checkstring(L, 1);
    var n = luaL_checkinteger(L, 2);
    var posi = n >= 0 ? 1 : s.length + 1;
    posi = u_posrelat(luaL_optinteger(L, 3, posi), s.length);

    luaL_argcheck(L, 1 <= posi && --posi <= s.length, 3, to_luastring("position out of range", true));

    if (n === 0) {
        /* find beginning of current byte sequence */
        while (posi > 0 && iscont(s[posi])) {
            posi--;
        }
    } else {
        if (iscont(s[posi])) luaL_error(L, to_luastring("initial position is a continuation byte", true));

        if (n < 0) {
            while (n < 0 && posi > 0) {
                /* move back */
                do {
                    /* find beginning of previous character */
                    posi--;
                } while (posi > 0 && iscont(s[posi]));
                n++;
            }
        } else {
            n--; /* do not move for 1st character */
            while (n > 0 && posi < s.length) {
                do {
                    /* find beginning of next character */
                    posi++;
                } while (iscont(s[posi])); /* (cannot pass final '\0') */
                n--;
            }
        }
    }

    if (n === 0) /* did it find given character? */
        lua_pushinteger(L, posi + 1);else /* no such character */
        lua_pushnil(L);

    return 1;
};

/*
** codepoint(s, [i, [j]])  -> returns codepoints for all characters
** that start in the range [i,j]
*/
var codepoint = function codepoint(L) {
    var s = luaL_checkstring(L, 1);
    var posi = u_posrelat(luaL_optinteger(L, 2, 1), s.length);
    var pose = u_posrelat(luaL_optinteger(L, 3, posi), s.length);

    luaL_argcheck(L, posi >= 1, 2, to_luastring("out of range", true));
    luaL_argcheck(L, pose <= s.length, 3, to_luastring("out of range", true));

    if (posi > pose) return 0; /* empty interval; return no values */
    if (pose - posi >= Number.MAX_SAFE_INTEGER) return luaL_error(L, to_luastring("string slice too long", true));
    var n = pose - posi + 1;
    luaL_checkstack(L, n, to_luastring("string slice too long", true));
    n = 0;
    for (posi -= 1; posi < pose;) {
        var dec = utf8_decode(s, posi);
        if (dec === null) return luaL_error(L, to_luastring("invalid UTF-8 code", true));
        lua_pushinteger(L, dec.code);
        posi = dec.pos;
        n++;
    }
    return n;
};

var iter_aux = function iter_aux(L) {
    var s = luaL_checkstring(L, 1);
    var len = s.length;
    var n = lua_tointeger(L, 2) - 1;

    if (n < 0) /* first iteration? */
        n = 0; /* start from here */
    else if (n < len) {
            n++; /* skip current byte */
            while (iscont(s[n])) {
                n++;
            } /* and its continuations */
        }

    if (n >= len) return 0; /* no more codepoints */
    else {
            var dec = utf8_decode(s, n);
            if (dec === null || iscont(s[dec.pos])) return luaL_error(L, to_luastring("invalid UTF-8 code", true));
            lua_pushinteger(L, n + 1);
            lua_pushinteger(L, dec.code);
            return 2;
        }
};

var iter_codes = function iter_codes(L) {
    luaL_checkstring(L, 1);
    lua_pushcfunction(L, iter_aux);
    lua_pushvalue(L, 1);
    lua_pushinteger(L, 0);
    return 3;
};

var funcs = {
    "char": utfchar,
    "codepoint": codepoint,
    "codes": iter_codes,
    "len": utflen,
    "offset": byteoffset
};

/* pattern to match a single UTF-8 character */
var UTF8PATT = luastring_of(91, 0, 45, 127, 194, 45, 244, 93, 91, 128, 45, 191, 93, 42);

var luaopen_utf8 = function luaopen_utf8(L) {
    luaL_newlib(L, funcs);
    lua_pushstring(L, UTF8PATT);
    lua_setfield(L, -2, to_luastring("charpattern", true));
    return 1;
};

module.exports.luaopen_utf8 = luaopen_utf8;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_OPLT = _require.LUA_OPLT,
    LUA_TNUMBER = _require.LUA_TNUMBER,
    lua_compare = _require.lua_compare,
    lua_gettop = _require.lua_gettop,
    lua_isinteger = _require.lua_isinteger,
    lua_isnoneornil = _require.lua_isnoneornil,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushinteger = _require.lua_pushinteger,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushnil = _require.lua_pushnil,
    lua_pushnumber = _require.lua_pushnumber,
    lua_pushvalue = _require.lua_pushvalue,
    lua_setfield = _require.lua_setfield,
    lua_settop = _require.lua_settop,
    lua_tointeger = _require.lua_tointeger,
    lua_tointegerx = _require.lua_tointegerx,
    lua_type = _require.lua_type;

var _require2 = __webpack_require__(6),
    luaL_argcheck = _require2.luaL_argcheck,
    luaL_argerror = _require2.luaL_argerror,
    luaL_checkany = _require2.luaL_checkany,
    luaL_checkinteger = _require2.luaL_checkinteger,
    luaL_checknumber = _require2.luaL_checknumber,
    luaL_error = _require2.luaL_error,
    luaL_newlib = _require2.luaL_newlib,
    luaL_optnumber = _require2.luaL_optnumber;

var _require3 = __webpack_require__(4),
    LUA_MAXINTEGER = _require3.LUA_MAXINTEGER,
    LUA_MININTEGER = _require3.LUA_MININTEGER,
    lua_numbertointeger = _require3.lua_numbertointeger;

var _require4 = __webpack_require__(3),
    to_luastring = _require4.to_luastring;

var rand_state = void 0;
/* use same parameters as glibc LCG */
var l_rand = function l_rand() {
    rand_state = 1103515245 * rand_state + 12345 & 0x7fffffff;
    return rand_state;
};
var l_srand = function l_srand(x) {
    rand_state = x | 0;
    if (rand_state === 0) rand_state = 1;
};

var math_random = function math_random(L) {
    var low = void 0,
        up = void 0;
    /* use Math.random until randomseed is called */
    var r = rand_state === void 0 ? Math.random() : l_rand() / 0x80000000;
    switch (lua_gettop(L)) {/* check number of arguments */
        case 0:
            lua_pushnumber(L, r); /* Number between 0 and 1 */
            return 1;
        case 1:
            {
                low = 1;
                up = luaL_checkinteger(L, 1);
                break;
            }
        case 2:
            {
                low = luaL_checkinteger(L, 1);
                up = luaL_checkinteger(L, 2);
                break;
            }
        default:
            return luaL_error(L, to_luastring("wrong number of arguments", true));
    }

    /* random integer in the interval [low, up] */
    luaL_argcheck(L, low <= up, 1, to_luastring("interval is empty", true));
    luaL_argcheck(L, low >= 0 || up <= LUA_MAXINTEGER + low, 1, to_luastring("interval too large", true));

    r *= up - low + 1;
    lua_pushinteger(L, Math.floor(r) + low);
    return 1;
};

var math_randomseed = function math_randomseed(L) {
    l_srand(luaL_checknumber(L, 1));
    l_rand(); /* discard first value to avoid undesirable correlations */
    return 0;
};

var math_abs = function math_abs(L) {
    if (lua_isinteger(L, 1)) {
        var n = lua_tointeger(L, 1);
        if (n < 0) n = -n | 0;
        lua_pushinteger(L, n);
    } else lua_pushnumber(L, Math.abs(luaL_checknumber(L, 1)));
    return 1;
};

var math_sin = function math_sin(L) {
    lua_pushnumber(L, Math.sin(luaL_checknumber(L, 1)));
    return 1;
};

var math_cos = function math_cos(L) {
    lua_pushnumber(L, Math.cos(luaL_checknumber(L, 1)));
    return 1;
};

var math_tan = function math_tan(L) {
    lua_pushnumber(L, Math.tan(luaL_checknumber(L, 1)));
    return 1;
};

var math_asin = function math_asin(L) {
    lua_pushnumber(L, Math.asin(luaL_checknumber(L, 1)));
    return 1;
};

var math_acos = function math_acos(L) {
    lua_pushnumber(L, Math.acos(luaL_checknumber(L, 1)));
    return 1;
};

var math_atan = function math_atan(L) {
    var y = luaL_checknumber(L, 1);
    var x = luaL_optnumber(L, 2, 1);
    lua_pushnumber(L, Math.atan2(y, x));
    return 1;
};

var math_toint = function math_toint(L) {
    var n = lua_tointegerx(L, 1);
    if (n !== false) lua_pushinteger(L, n);else {
        luaL_checkany(L, 1);
        lua_pushnil(L); /* value is not convertible to integer */
    }
    return 1;
};

var pushnumint = function pushnumint(L, d) {
    var n = lua_numbertointeger(d);
    if (n !== false) /* does 'd' fit in an integer? */
        lua_pushinteger(L, n); /* result is integer */
    else lua_pushnumber(L, d); /* result is float */
};

var math_floor = function math_floor(L) {
    if (lua_isinteger(L, 1)) lua_settop(L, 1);else pushnumint(L, Math.floor(luaL_checknumber(L, 1)));

    return 1;
};

var math_ceil = function math_ceil(L) {
    if (lua_isinteger(L, 1)) lua_settop(L, 1);else pushnumint(L, Math.ceil(luaL_checknumber(L, 1)));

    return 1;
};

var math_sqrt = function math_sqrt(L) {
    lua_pushnumber(L, Math.sqrt(luaL_checknumber(L, 1)));
    return 1;
};

var math_ult = function math_ult(L) {
    var a = luaL_checkinteger(L, 1);
    var b = luaL_checkinteger(L, 2);
    lua_pushboolean(L, a >= 0 ? b < 0 || a < b : b < 0 && a < b);
    return 1;
};

var math_log = function math_log(L) {
    var x = luaL_checknumber(L, 1);
    var res = void 0;
    if (lua_isnoneornil(L, 2)) res = Math.log(x);else {
        var base = luaL_checknumber(L, 2);
        if (base === 2) res = Math.log2(x);else if (base === 10) res = Math.log10(x);else res = Math.log(x) / Math.log(base);
    }
    lua_pushnumber(L, res);
    return 1;
};

var math_exp = function math_exp(L) {
    lua_pushnumber(L, Math.exp(luaL_checknumber(L, 1)));
    return 1;
};

var math_deg = function math_deg(L) {
    lua_pushnumber(L, luaL_checknumber(L, 1) * (180 / Math.PI));
    return 1;
};

var math_rad = function math_rad(L) {
    lua_pushnumber(L, luaL_checknumber(L, 1) * (Math.PI / 180));
    return 1;
};

var math_min = function math_min(L) {
    var n = lua_gettop(L); /* number of arguments */
    var imin = 1; /* index of current minimum value */
    luaL_argcheck(L, n >= 1, 1, to_luastring("value expected", true));
    for (var i = 2; i <= n; i++) {
        if (lua_compare(L, i, imin, LUA_OPLT)) imin = i;
    }
    lua_pushvalue(L, imin);
    return 1;
};

var math_max = function math_max(L) {
    var n = lua_gettop(L); /* number of arguments */
    var imax = 1; /* index of current minimum value */
    luaL_argcheck(L, n >= 1, 1, to_luastring("value expected", true));
    for (var i = 2; i <= n; i++) {
        if (lua_compare(L, imax, i, LUA_OPLT)) imax = i;
    }
    lua_pushvalue(L, imax);
    return 1;
};

var math_type = function math_type(L) {
    if (lua_type(L, 1) === LUA_TNUMBER) {
        if (lua_isinteger(L, 1)) lua_pushliteral(L, "integer");else lua_pushliteral(L, "float");
    } else {
        luaL_checkany(L, 1);
        lua_pushnil(L);
    }
    return 1;
};

var math_fmod = function math_fmod(L) {
    if (lua_isinteger(L, 1) && lua_isinteger(L, 2)) {
        var d = lua_tointeger(L, 2);
        /* no special case needed for -1 in javascript */
        if (d === 0) {
            luaL_argerror(L, 2, to_luastring("zero", true));
        } else lua_pushinteger(L, lua_tointeger(L, 1) % d | 0);
    } else {
        var a = luaL_checknumber(L, 1);
        var b = luaL_checknumber(L, 2);
        lua_pushnumber(L, a % b);
    }
    return 1;
};

var math_modf = function math_modf(L) {
    if (lua_isinteger(L, 1)) {
        lua_settop(L, 1); /* number is its own integer part */
        lua_pushnumber(L, 0); /* no fractional part */
    } else {
        var n = luaL_checknumber(L, 1);
        var ip = n < 0 ? Math.ceil(n) : Math.floor(n);
        pushnumint(L, ip);
        lua_pushnumber(L, n === ip ? 0 : n - ip);
    }
    return 2;
};

var mathlib = {
    "abs": math_abs,
    "acos": math_acos,
    "asin": math_asin,
    "atan": math_atan,
    "ceil": math_ceil,
    "cos": math_cos,
    "deg": math_deg,
    "exp": math_exp,
    "floor": math_floor,
    "fmod": math_fmod,
    "log": math_log,
    "max": math_max,
    "min": math_min,
    "modf": math_modf,
    "rad": math_rad,
    "random": math_random,
    "randomseed": math_randomseed,
    "sin": math_sin,
    "sqrt": math_sqrt,
    "tan": math_tan,
    "tointeger": math_toint,
    "type": math_type,
    "ult": math_ult
};

var luaopen_math = function luaopen_math(L) {
    luaL_newlib(L, mathlib);
    lua_pushnumber(L, Math.PI);
    lua_setfield(L, -2, to_luastring("pi", true));
    lua_pushnumber(L, Infinity);
    lua_setfield(L, -2, to_luastring("huge", true));
    lua_pushinteger(L, LUA_MAXINTEGER);
    lua_setfield(L, -2, to_luastring("maxinteger", true));
    lua_pushinteger(L, LUA_MININTEGER);
    lua_setfield(L, -2, to_luastring("mininteger", true));
    return 1;
};

module.exports.luaopen_math = luaopen_math;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_MASKCALL = _require.LUA_MASKCALL,
    LUA_MASKCOUNT = _require.LUA_MASKCOUNT,
    LUA_MASKLINE = _require.LUA_MASKLINE,
    LUA_MASKRET = _require.LUA_MASKRET,
    LUA_REGISTRYINDEX = _require.LUA_REGISTRYINDEX,
    LUA_TFUNCTION = _require.LUA_TFUNCTION,
    LUA_TNIL = _require.LUA_TNIL,
    LUA_TTABLE = _require.LUA_TTABLE,
    LUA_TUSERDATA = _require.LUA_TUSERDATA,
    lua_Debug = _require.lua_Debug,
    lua_call = _require.lua_call,
    lua_checkstack = _require.lua_checkstack,
    lua_gethook = _require.lua_gethook,
    lua_gethookcount = _require.lua_gethookcount,
    lua_gethookmask = _require.lua_gethookmask,
    lua_getinfo = _require.lua_getinfo,
    lua_getlocal = _require.lua_getlocal,
    lua_getmetatable = _require.lua_getmetatable,
    lua_getstack = _require.lua_getstack,
    lua_getupvalue = _require.lua_getupvalue,
    lua_getuservalue = _require.lua_getuservalue,
    lua_insert = _require.lua_insert,
    lua_iscfunction = _require.lua_iscfunction,
    lua_isfunction = _require.lua_isfunction,
    lua_isnoneornil = _require.lua_isnoneornil,
    lua_isthread = _require.lua_isthread,
    lua_newtable = _require.lua_newtable,
    lua_pcall = _require.lua_pcall,
    lua_pop = _require.lua_pop,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushfstring = _require.lua_pushfstring,
    lua_pushinteger = _require.lua_pushinteger,
    lua_pushlightuserdata = _require.lua_pushlightuserdata,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushnil = _require.lua_pushnil,
    lua_pushstring = _require.lua_pushstring,
    lua_pushvalue = _require.lua_pushvalue,
    lua_rawgetp = _require.lua_rawgetp,
    lua_rawsetp = _require.lua_rawsetp,
    lua_rotate = _require.lua_rotate,
    lua_setfield = _require.lua_setfield,
    lua_sethook = _require.lua_sethook,
    lua_setlocal = _require.lua_setlocal,
    lua_setmetatable = _require.lua_setmetatable,
    lua_settop = _require.lua_settop,
    lua_setupvalue = _require.lua_setupvalue,
    lua_setuservalue = _require.lua_setuservalue,
    lua_tojsstring = _require.lua_tojsstring,
    lua_toproxy = _require.lua_toproxy,
    lua_tostring = _require.lua_tostring,
    lua_tothread = _require.lua_tothread,
    lua_touserdata = _require.lua_touserdata,
    lua_type = _require.lua_type,
    lua_upvalueid = _require.lua_upvalueid,
    lua_upvaluejoin = _require.lua_upvaluejoin,
    lua_xmove = _require.lua_xmove;

var _require2 = __webpack_require__(6),
    luaL_argcheck = _require2.luaL_argcheck,
    luaL_argerror = _require2.luaL_argerror,
    luaL_checkany = _require2.luaL_checkany,
    luaL_checkinteger = _require2.luaL_checkinteger,
    luaL_checkstring = _require2.luaL_checkstring,
    luaL_checktype = _require2.luaL_checktype,
    luaL_error = _require2.luaL_error,
    luaL_loadbuffer = _require2.luaL_loadbuffer,
    luaL_newlib = _require2.luaL_newlib,
    luaL_optinteger = _require2.luaL_optinteger,
    luaL_optstring = _require2.luaL_optstring,
    luaL_traceback = _require2.luaL_traceback,
    lua_writestringerror = _require2.lua_writestringerror;

var lualib = __webpack_require__(16);

var _require3 = __webpack_require__(3),
    luastring_indexOf = _require3.luastring_indexOf,
    to_luastring = _require3.to_luastring;

/*
** If L1 != L, L1 can be in any state, and therefore there are no
** guarantees about its stack space; any push in L1 must be
** checked.
*/


var checkstack = function checkstack(L, L1, n) {
    if (L !== L1 && !lua_checkstack(L1, n)) luaL_error(L, to_luastring("stack overflow", true));
};

var db_getregistry = function db_getregistry(L) {
    lua_pushvalue(L, LUA_REGISTRYINDEX);
    return 1;
};

var db_getmetatable = function db_getmetatable(L) {
    luaL_checkany(L, 1);
    if (!lua_getmetatable(L, 1)) {
        lua_pushnil(L); /* no metatable */
    }
    return 1;
};

var db_setmetatable = function db_setmetatable(L) {
    var t = lua_type(L, 2);
    luaL_argcheck(L, t == LUA_TNIL || t == LUA_TTABLE, 2, to_luastring("nil or table expected", true));
    lua_settop(L, 2);
    lua_setmetatable(L, 1);
    return 1; /* return 1st argument */
};

var db_getuservalue = function db_getuservalue(L) {
    if (lua_type(L, 1) !== LUA_TUSERDATA) lua_pushnil(L);else lua_getuservalue(L, 1);
    return 1;
};

var db_setuservalue = function db_setuservalue(L) {
    luaL_checktype(L, 1, LUA_TUSERDATA);
    luaL_checkany(L, 2);
    lua_settop(L, 2);
    lua_setuservalue(L, 1);
    return 1;
};

/*
** Auxiliary function used by several library functions: check for
** an optional thread as function's first argument and set 'arg' with
** 1 if this argument is present (so that functions can skip it to
** access their other arguments)
*/
var getthread = function getthread(L) {
    if (lua_isthread(L, 1)) {
        return {
            arg: 1,
            thread: lua_tothread(L, 1)
        };
    } else {
        return {
            arg: 0,
            thread: L
        }; /* function will operate over current thread */
    }
};

/*
** Variations of 'lua_settable', used by 'db_getinfo' to put results
** from 'lua_getinfo' into result table. Key is always a string;
** value can be a string, an int, or a boolean.
*/
var settabss = function settabss(L, k, v) {
    lua_pushstring(L, v);
    lua_setfield(L, -2, k);
};

var settabsi = function settabsi(L, k, v) {
    lua_pushinteger(L, v);
    lua_setfield(L, -2, k);
};

var settabsb = function settabsb(L, k, v) {
    lua_pushboolean(L, v);
    lua_setfield(L, -2, k);
};

/*
** In function 'db_getinfo', the call to 'lua_getinfo' may push
** results on the stack; later it creates the result table to put
** these objects. Function 'treatstackoption' puts the result from
** 'lua_getinfo' on top of the result table so that it can call
** 'lua_setfield'.
*/
var treatstackoption = function treatstackoption(L, L1, fname) {
    if (L == L1) lua_rotate(L, -2, 1); /* exchange object and table */
    else lua_xmove(L1, L, 1); /* move object to the "main" stack */
    lua_setfield(L, -2, fname); /* put object into table */
};

/*
** Calls 'lua_getinfo' and collects all results in a new table.
** L1 needs stack space for an optional input (function) plus
** two optional outputs (function and line table) from function
** 'lua_getinfo'.
*/
var db_getinfo = function db_getinfo(L) {
    var ar = new lua_Debug();
    var thread = getthread(L);
    var arg = thread.arg;
    var L1 = thread.thread;
    var options = luaL_optstring(L, arg + 2, to_luastring("flnStu", true));
    checkstack(L, L1, 3);
    if (lua_isfunction(L, arg + 1)) {
        /* info about a function? */
        options = lua_pushfstring(L, to_luastring(">%s"), options); /* add '>' to 'options' */
        lua_pushvalue(L, arg + 1); /* move function to 'L1' stack */
        lua_xmove(L, L1, 1);
    } else {
        /* stack level */
        if (!lua_getstack(L1, luaL_checkinteger(L, arg + 1), ar)) {
            lua_pushnil(L); /* level out of range */
            return 1;
        }
    }

    if (!lua_getinfo(L1, options, ar)) luaL_argerror(L, arg + 2, to_luastring("invalid option", true));
    lua_newtable(L); /* table to collect results */
    if (luastring_indexOf(options, 83 /* 'S'.charCodeAt(0) */) > -1) {
        settabss(L, to_luastring("source", true), ar.source);
        settabss(L, to_luastring("short_src", true), ar.short_src);
        settabsi(L, to_luastring("linedefined", true), ar.linedefined);
        settabsi(L, to_luastring("lastlinedefined", true), ar.lastlinedefined);
        settabss(L, to_luastring("what", true), ar.what);
    }
    if (luastring_indexOf(options, 108 /* 'l'.charCodeAt(0) */) > -1) settabsi(L, to_luastring("currentline", true), ar.currentline);
    if (luastring_indexOf(options, 117 /* 'u'.charCodeAt(0) */) > -1) {
        settabsi(L, to_luastring("nups", true), ar.nups);
        settabsi(L, to_luastring("nparams", true), ar.nparams);
        settabsb(L, to_luastring("isvararg", true), ar.isvararg);
    }
    if (luastring_indexOf(options, 110 /* 'n'.charCodeAt(0) */) > -1) {
        settabss(L, to_luastring("name", true), ar.name);
        settabss(L, to_luastring("namewhat", true), ar.namewhat);
    }
    if (luastring_indexOf(options, 116 /* 't'.charCodeAt(0) */) > -1) settabsb(L, to_luastring("istailcall", true), ar.istailcall);
    if (luastring_indexOf(options, 76 /* 'L'.charCodeAt(0) */) > -1) treatstackoption(L, L1, to_luastring("activelines", true));
    if (luastring_indexOf(options, 102 /* 'f'.charCodeAt(0) */) > -1) treatstackoption(L, L1, to_luastring("func", true));
    return 1; /* return table */
};

var db_getlocal = function db_getlocal(L) {
    var thread = getthread(L);
    var L1 = thread.thread;
    var arg = thread.arg;
    var ar = new lua_Debug();
    var nvar = luaL_checkinteger(L, arg + 2); /* local-variable index */
    if (lua_isfunction(L, arg + 1)) {
        lua_pushvalue(L, arg + 1); /* push function */
        lua_pushstring(L, lua_getlocal(L, null, nvar)); /* push local name */
        return 1; /* return only name (there is no value) */
    } else {
        /* stack-level argument */
        var level = luaL_checkinteger(L, arg + 1);
        if (!lua_getstack(L1, level, ar)) /* out of range? */
            return luaL_argerror(L, arg + 1, to_luastring("level out of range", true));
        checkstack(L, L1, 1);
        var name = lua_getlocal(L1, ar, nvar);
        if (name) {
            lua_xmove(L1, L, 1); /* move local value */
            lua_pushstring(L, name); /* push name */
            lua_rotate(L, -2, 1); /* re-order */
            return 2;
        } else {
            lua_pushnil(L); /* no name (nor value) */
            return 1;
        }
    }
};

var db_setlocal = function db_setlocal(L) {
    var thread = getthread(L);
    var L1 = thread.thread;
    var arg = thread.arg;
    var ar = new lua_Debug();
    var level = luaL_checkinteger(L, arg + 1);
    var nvar = luaL_checkinteger(L, arg + 2);
    if (!lua_getstack(L1, level, ar)) /* out of range? */
        return luaL_argerror(L, arg + 1, to_luastring("level out of range", true));
    luaL_checkany(L, arg + 3);
    lua_settop(L, arg + 3);
    checkstack(L, L1, 1);
    lua_xmove(L, L1, 1);
    var name = lua_setlocal(L1, ar, nvar);
    if (name === null) lua_pop(L1, 1); /* pop value (if not popped by 'lua_setlocal') */
    lua_pushstring(L, name);
    return 1;
};

/*
** get (if 'get' is true) or set an upvalue from a closure
*/
var auxupvalue = function auxupvalue(L, get) {
    var n = luaL_checkinteger(L, 2); /* upvalue index */
    luaL_checktype(L, 1, LUA_TFUNCTION); /* closure */
    var name = get ? lua_getupvalue(L, 1, n) : lua_setupvalue(L, 1, n);
    if (name === null) return 0;
    lua_pushstring(L, name);
    lua_insert(L, -(get + 1)); /* no-op if get is false */
    return get + 1;
};

var db_getupvalue = function db_getupvalue(L) {
    return auxupvalue(L, 1);
};

var db_setupvalue = function db_setupvalue(L) {
    luaL_checkany(L, 3);
    return auxupvalue(L, 0);
};

/*
** Check whether a given upvalue from a given closure exists and
** returns its index
*/
var checkupval = function checkupval(L, argf, argnup) {
    var nup = luaL_checkinteger(L, argnup); /* upvalue index */
    luaL_checktype(L, argf, LUA_TFUNCTION); /* closure */
    luaL_argcheck(L, lua_getupvalue(L, argf, nup) !== null, argnup, to_luastring("invalid upvalue index", true));
    return nup;
};

var db_upvalueid = function db_upvalueid(L) {
    var n = checkupval(L, 1, 2);
    lua_pushlightuserdata(L, lua_upvalueid(L, 1, n));
    return 1;
};

var db_upvaluejoin = function db_upvaluejoin(L) {
    var n1 = checkupval(L, 1, 2);
    var n2 = checkupval(L, 3, 4);
    luaL_argcheck(L, !lua_iscfunction(L, 1), 1, to_luastring("Lua function expected", true));
    luaL_argcheck(L, !lua_iscfunction(L, 3), 3, to_luastring("Lua function expected", true));
    lua_upvaluejoin(L, 1, n1, 3, n2);
    return 0;
};

/*
** The hook table at registry[HOOKKEY] maps threads to their current
** hook function. (We only need the unique address of 'HOOKKEY'.)
*/
var HOOKKEY = to_luastring("__hooks__", true);

var hooknames = ["call", "return", "line", "count", "tail call"].map(function (e) {
    return to_luastring(e);
});

/*
** Call hook function registered at hook table for the current
** thread (if there is one)
*/
var hookf = function hookf(L, ar) {
    lua_rawgetp(L, LUA_REGISTRYINDEX, HOOKKEY);
    var hooktable = lua_touserdata(L, -1);
    var proxy = hooktable.get(L);
    if (proxy) {
        /* is there a hook function? */
        proxy(L);
        lua_pushstring(L, hooknames[ar.event]); /* push event name */
        if (ar.currentline >= 0) lua_pushinteger(L, ar.currentline); /* push current line */
        else lua_pushnil(L);
        lualib.lua_assert(lua_getinfo(L, to_luastring("lS"), ar));
        lua_call(L, 2, 0); /* call hook function */
    }
};

/*
** Convert a string mask (for 'sethook') into a bit mask
*/
var makemask = function makemask(smask, count) {
    var mask = 0;
    if (luastring_indexOf(smask, 99 /* 'c'.charCodeAt(0) */) > -1) mask |= LUA_MASKCALL;
    if (luastring_indexOf(smask, 114 /* 'r'.charCodeAt(0) */) > -1) mask |= LUA_MASKRET;
    if (luastring_indexOf(smask, 108 /* 'l'.charCodeAt(0) */) > -1) mask |= LUA_MASKLINE;
    if (count > 0) mask |= LUA_MASKCOUNT;
    return mask;
};

/*
** Convert a bit mask (for 'gethook') into a string mask
*/
var unmakemask = function unmakemask(mask, smask) {
    var i = 0;
    if (mask & LUA_MASKCALL) smask[i++] = 99 /* 'c'.charCodeAt(0) */;
    if (mask & LUA_MASKRET) smask[i++] = 114 /* 'r'.charCodeAt(0) */;
    if (mask & LUA_MASKLINE) smask[i++] = 108 /* 'l'.charCodeAt(0) */;
    return smask.subarray(0, i);
};

var db_sethook = function db_sethook(L) {
    var mask = void 0,
        count = void 0,
        func = void 0;
    var thread = getthread(L);
    var L1 = thread.thread;
    var arg = thread.arg;
    if (lua_isnoneornil(L, arg + 1)) {
        /* no hook? */
        lua_settop(L, arg + 1);
        func = null;mask = 0;count = 0; /* turn off hooks */
    } else {
        var smask = luaL_checkstring(L, arg + 2);
        luaL_checktype(L, arg + 1, LUA_TFUNCTION);
        count = luaL_optinteger(L, arg + 3, 0);
        func = hookf;mask = makemask(smask, count);
    }
    /* as weak tables are not supported; use a JS weak-map */
    var hooktable = void 0;
    if (lua_rawgetp(L, LUA_REGISTRYINDEX, HOOKKEY) === LUA_TNIL) {
        hooktable = new WeakMap();
        lua_pushlightuserdata(L, hooktable);
        lua_rawsetp(L, LUA_REGISTRYINDEX, HOOKKEY); /* set it in position */
    } else {
        hooktable = lua_touserdata(L, -1);
    }
    var proxy = lua_toproxy(L, arg + 1); /* value (hook function) */
    hooktable.set(L1, proxy);
    lua_sethook(L1, func, mask, count);
    return 0;
};

var db_gethook = function db_gethook(L) {
    var thread = getthread(L);
    var L1 = thread.thread;
    var buff = new Uint8Array(5);
    var mask = lua_gethookmask(L1);
    var hook = lua_gethook(L1);
    if (hook === null) /* no hook? */
        lua_pushnil(L);else if (hook !== hookf) /* external hook? */
        lua_pushliteral(L, "external hook");else {
        /* hook table must exist */
        lua_rawgetp(L, LUA_REGISTRYINDEX, HOOKKEY);
        var hooktable = lua_touserdata(L, -1);
        var proxy = hooktable.get(L1);
        proxy(L);
    }
    lua_pushstring(L, unmakemask(mask, buff)); /* 2nd result = mask */
    lua_pushinteger(L, lua_gethookcount(L1)); /* 3rd result = count */
    return 3;
};

var db_traceback = function db_traceback(L) {
    var thread = getthread(L);
    var L1 = thread.thread;
    var arg = thread.arg;
    var msg = lua_tostring(L, arg + 1);
    if (msg === null && !lua_isnoneornil(L, arg + 1)) /* non-string 'msg'? */
        lua_pushvalue(L, arg + 1); /* return it untouched */
    else {
            var level = luaL_optinteger(L, arg + 2, L === L1 ? 1 : 0);
            luaL_traceback(L, L1, msg, level);
        }
    return 1;
};

var dblib = {
    "gethook": db_gethook,
    "getinfo": db_getinfo,
    "getlocal": db_getlocal,
    "getmetatable": db_getmetatable,
    "getregistry": db_getregistry,
    "getupvalue": db_getupvalue,
    "getuservalue": db_getuservalue,
    "sethook": db_sethook,
    "setlocal": db_setlocal,
    "setmetatable": db_setmetatable,
    "setupvalue": db_setupvalue,
    "setuservalue": db_setuservalue,
    "traceback": db_traceback,
    "upvalueid": db_upvalueid,
    "upvaluejoin": db_upvaluejoin
};

var getinput = void 0;
if (false) {
    // Only with Node
    var readlineSync = require('readline-sync');
    readlineSync.setDefaultOptions({
        prompt: 'lua_debug> '
    });
    getinput = function getinput() {
        return readlineSync.prompt();
    };
} else if (typeof window !== "undefined") {
    /* if in browser use window.prompt. Doesn't work from web workers.
       See https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt
    */
    getinput = function getinput() {
        var input = prompt("lua_debug>", "");
        return input !== null ? input : "";
    };
}
if (getinput) {
    dblib.debug = function (L) {
        for (;;) {
            var input = getinput();

            if (input === "cont") return 0;

            if (input.length === 0) continue;

            var buffer = to_luastring(input);
            if (luaL_loadbuffer(L, buffer, buffer.length, to_luastring("=(debug command)", true)) || lua_pcall(L, 0, 0, 0)) {
                lua_writestringerror(lua_tojsstring(L, -1), "\n");
            }
            lua_settop(L, 0); /* remove eventual returns */
        }
    };
}

var luaopen_debug = function luaopen_debug(L) {
    luaL_newlib(L, dblib);
    return 1;
};

module.exports.luaopen_debug = luaopen_debug;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(1),
    LUA_DIRSEP = _require.LUA_DIRSEP,
    LUA_EXEC_DIR = _require.LUA_EXEC_DIR,
    LUA_JSPATH_DEFAULT = _require.LUA_JSPATH_DEFAULT,
    LUA_OK = _require.LUA_OK,
    LUA_PATH_DEFAULT = _require.LUA_PATH_DEFAULT,
    LUA_PATH_MARK = _require.LUA_PATH_MARK,
    LUA_PATH_SEP = _require.LUA_PATH_SEP,
    LUA_REGISTRYINDEX = _require.LUA_REGISTRYINDEX,
    LUA_TNIL = _require.LUA_TNIL,
    LUA_TTABLE = _require.LUA_TTABLE,
    LUA_VERSUFFIX = _require.LUA_VERSUFFIX,
    lua_callk = _require.lua_callk,
    lua_createtable = _require.lua_createtable,
    lua_getfield = _require.lua_getfield,
    lua_insert = _require.lua_insert,
    lua_isfunction = _require.lua_isfunction,
    lua_isnil = _require.lua_isnil,
    lua_isstring = _require.lua_isstring,
    lua_newtable = _require.lua_newtable,
    lua_pop = _require.lua_pop,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushcclosure = _require.lua_pushcclosure,
    lua_pushcfunction = _require.lua_pushcfunction,
    lua_pushfstring = _require.lua_pushfstring,
    lua_pushglobaltable = _require.lua_pushglobaltable,
    lua_pushlightuserdata = _require.lua_pushlightuserdata,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushlstring = _require.lua_pushlstring,
    lua_pushnil = _require.lua_pushnil,
    lua_pushstring = _require.lua_pushstring,
    lua_pushvalue = _require.lua_pushvalue,
    lua_rawgeti = _require.lua_rawgeti,
    lua_rawgetp = _require.lua_rawgetp,
    lua_rawseti = _require.lua_rawseti,
    lua_rawsetp = _require.lua_rawsetp,
    lua_remove = _require.lua_remove,
    lua_setfield = _require.lua_setfield,
    lua_setmetatable = _require.lua_setmetatable,
    lua_settop = _require.lua_settop,
    lua_toboolean = _require.lua_toboolean,
    lua_tostring = _require.lua_tostring,
    lua_touserdata = _require.lua_touserdata,
    lua_upvalueindex = _require.lua_upvalueindex;

var _require2 = __webpack_require__(6),
    LUA_LOADED_TABLE = _require2.LUA_LOADED_TABLE,
    LUA_PRELOAD_TABLE = _require2.LUA_PRELOAD_TABLE,
    luaL_Buffer = _require2.luaL_Buffer,
    luaL_addvalue = _require2.luaL_addvalue,
    luaL_buffinit = _require2.luaL_buffinit,
    luaL_checkstring = _require2.luaL_checkstring,
    luaL_error = _require2.luaL_error,
    luaL_getsubtable = _require2.luaL_getsubtable,
    luaL_gsub = _require2.luaL_gsub,
    luaL_len = _require2.luaL_len,
    luaL_loadfile = _require2.luaL_loadfile,
    luaL_newlib = _require2.luaL_newlib,
    luaL_optstring = _require2.luaL_optstring,
    luaL_pushresult = _require2.luaL_pushresult,
    luaL_setfuncs = _require2.luaL_setfuncs;

var _require3 = __webpack_require__(3),
    luastring_indexOf = _require3.luastring_indexOf,
    to_jsstring = _require3.to_jsstring,
    to_luastring = _require3.to_luastring,
    to_uristring = _require3.to_uristring;

var fengari = __webpack_require__(19);

var global_env = function () {
    /* global WorkerGlobalScope */ /* see https://github.com/sindresorhus/globals/issues/127 */
    if (false) {
        /* node */
        return global;
    } else if (typeof window !== "undefined") {
        /* browser window */
        return window;
    } else if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        /* web worker */
        return self;
    } else {
        /* unknown global env */
        return eval('this'); /* use non-strict mode to get global env */
    }
}();

var JSLIBS = to_luastring("__JSLIBS__");
var LUA_PATH_VAR = "LUA_PATH";
var LUA_JSPATH_VAR = "LUA_JSPATH";

var LUA_IGMARK = "-";

/*
** LUA_CSUBSEP is the character that replaces dots in submodule names
** when searching for a JS loader.
** LUA_LSUBSEP is the character that replaces dots in submodule names
** when searching for a Lua loader.
*/
var LUA_CSUBSEP = LUA_DIRSEP;
var LUA_LSUBSEP = LUA_DIRSEP;

/* prefix for open functions in JS libraries */
var LUA_POF = to_luastring("luaopen_");

/* separator for open functions in JS libraries */
var LUA_OFSEP = to_luastring("_");
var LIB_FAIL = "open";

var AUXMARK = to_luastring("\x01");

/*
** load JS library in file 'path'. If 'seeglb', load with all names in
** the library global.
** Returns the library; in case of error, returns NULL plus an
** error string in the stack.
*/
var lsys_load = void 0;
if (true) {
    lsys_load = function lsys_load(L, path, seeglb) {
        path = to_uristring(path);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.send();

        if (xhr.status < 200 || xhr.status >= 300) {
            lua_pushstring(L, to_luastring(xhr.status + ': ' + xhr.statusText));
            return null;
        }

        var code = xhr.response;
        /* Add sourceURL comment to get path in debugger+tracebacks */
        if (!/\/\/[#@] sourceURL=/.test(code)) code += " //# sourceURL=" + path;
        var func = void 0;
        try {
            func = Function("fengari", code);
        } catch (e) {
            lua_pushstring(L, to_luastring(e.name + ': ' + e.message));
            return null;
        }
        var res = func(fengari);
        if (typeof res === "function" || (typeof res === 'undefined' ? 'undefined' : _typeof(res)) === "object" && res !== null) {
            return res;
        } else if (res === void 0) {
            /* assume library added symbols to global environment */
            return global_env;
        } else {
            lua_pushstring(L, to_luastring('library returned unexpected type (' + (typeof res === 'undefined' ? 'undefined' : _typeof(res)) + ')'));
            return null;
        }
    };
} else {
    var pathlib = require('path');
    lsys_load = function lsys_load(L, path, seeglb) {
        path = to_jsstring(path);
        /* relative paths should be relative to cwd, not this js file */
        path = pathlib.resolve(process.cwd(), path);
        try {
            return require(path);
        } catch (e) {
            lua_pushstring(L, to_luastring(e.message));
            return null;
        }
    };
}

/*
** Try to find a function named 'sym' in library 'lib'.
** Returns the function; in case of error, returns NULL plus an
** error string in the stack.
*/
var lsys_sym = function lsys_sym(L, lib, sym) {
    var f = lib[to_jsstring(sym)];

    if (f && typeof f === 'function') return f;else {
        lua_pushfstring(L, to_luastring("undefined symbol: %s"), sym);
        return null;
    }
};

/*
** return registry.LUA_NOENV as a boolean
*/
var noenv = function noenv(L) {
    lua_getfield(L, LUA_REGISTRYINDEX, to_luastring("LUA_NOENV"));
    var b = lua_toboolean(L, -1);
    lua_pop(L, 1); /* remove value */
    return b;
};

var readable = void 0;
if (false) {
    // Only with Node
    var fs = require('fs');

    readable = function readable(filename) {
        try {
            var fd = fs.openSync(filename, 'r');
            fs.closeSync(fd);
        } catch (e) {
            return false;
        }
        return true;
    };
} else {
    readable = function readable(path) {
        path = to_uristring(path);
        var xhr = new XMLHttpRequest();
        /* Following GET request done by searcher_Web will be cached */
        xhr.open("GET", path, false);
        xhr.send();

        return xhr.status >= 200 && xhr.status <= 299;
    };
}

/* error codes for 'lookforfunc' */
var ERRLIB = 1;
var ERRFUNC = 2;

/*
** Look for a C function named 'sym' in a dynamically loaded library
** 'path'.
** First, check whether the library is already loaded; if not, try
** to load it.
** Then, if 'sym' is '*', return true (as library has been loaded).
** Otherwise, look for symbol 'sym' in the library and push a
** C function with that symbol.
** Return 0 and 'true' or a function in the stack; in case of
** errors, return an error code and an error message in the stack.
*/
var lookforfunc = function lookforfunc(L, path, sym) {
    var reg = checkjslib(L, path); /* check loaded JS libraries */
    if (reg === null) {
        /* must load library? */
        reg = lsys_load(L, path, sym[0] === '*'.charCodeAt(0)); /* a global symbols if 'sym'=='*' */
        if (reg === null) return ERRLIB; /* unable to load library */
        addtojslib(L, path, reg);
    }
    if (sym[0] === '*'.charCodeAt(0)) {
        /* loading only library (no function)? */
        lua_pushboolean(L, 1); /* return 'true' */
        return 0; /* no errors */
    } else {
        var f = lsys_sym(L, reg, sym);
        if (f === null) return ERRFUNC; /* unable to find function */
        lua_pushcfunction(L, f); /* else create new function */
        return 0; /* no errors */
    }
};

var ll_loadlib = function ll_loadlib(L) {
    var path = luaL_checkstring(L, 1);
    var init = luaL_checkstring(L, 2);
    var stat = lookforfunc(L, path, init);
    if (stat === 0) /* no errors? */
        return 1; /* return the loaded function */
    else {
            /* error; error message is on stack top */
            lua_pushnil(L);
            lua_insert(L, -2);
            lua_pushliteral(L, stat === ERRLIB ? LIB_FAIL : "init");
            return 3; /* return nil, error message, and where */
        }
};

var env = function () {
    if (false) {
        /* node */
        return process.env;
    } else {
        return global_env;
    }
}();

/*
** Set a path
*/
var setpath = function setpath(L, fieldname, envname, dft) {
    var nver = '' + envname + LUA_VERSUFFIX;
    lua_pushstring(L, to_luastring(nver));
    var path = env[nver]; /* use versioned name */
    if (path === undefined) /* no environment variable? */
        path = env[envname]; /* try unversioned name */
    if (path === undefined || noenv(L)) /* no environment variable? */
        lua_pushstring(L, dft); /* use default */
    else {
            /* replace ";;" by ";AUXMARK;" and then AUXMARK by default path */
            path = luaL_gsub(L, to_luastring(path), to_luastring(LUA_PATH_SEP + LUA_PATH_SEP, true), to_luastring(LUA_PATH_SEP + to_jsstring(AUXMARK) + LUA_PATH_SEP, true));
            luaL_gsub(L, path, AUXMARK, dft);
            lua_remove(L, -2); /* remove result from 1st 'gsub' */
        }
    lua_setfield(L, -3, fieldname); /* package[fieldname] = path value */
    lua_pop(L, 1); /* pop versioned variable name */
};

/*
** return registry.JSLIBS[path]
*/
var checkjslib = function checkjslib(L, path) {
    lua_rawgetp(L, LUA_REGISTRYINDEX, JSLIBS);
    lua_getfield(L, -1, path);
    var plib = lua_touserdata(L, -1); /* plib = JSLIBS[path] */
    lua_pop(L, 2); /* pop JSLIBS table and 'plib' */
    return plib;
};

/*
** registry.JSLIBS[path] = plib        -- for queries
** registry.JSLIBS[#JSLIBS + 1] = plib  -- also keep a list of all libraries
*/
var addtojslib = function addtojslib(L, path, plib) {
    lua_rawgetp(L, LUA_REGISTRYINDEX, JSLIBS);
    lua_pushlightuserdata(L, plib);
    lua_pushvalue(L, -1);
    lua_setfield(L, -3, path); /* JSLIBS[path] = plib */
    lua_rawseti(L, -2, luaL_len(L, -2) + 1); /* JSLIBS[#JSLIBS + 1] = plib */
    lua_pop(L, 1); /* pop JSLIBS table */
};

var pushnexttemplate = function pushnexttemplate(L, path) {
    while (path[0] === LUA_PATH_SEP.charCodeAt(0)) {
        path = path.subarray(1);
    } /* skip separators */
    if (path.length === 0) return null; /* no more templates */
    var l = luastring_indexOf(path, LUA_PATH_SEP.charCodeAt(0)); /* find next separator */
    if (l < 0) l = path.length;
    lua_pushlstring(L, path, l); /* template */
    return path.subarray(l);
};

var searchpath = function searchpath(L, name, path, sep, dirsep) {
    var msg = new luaL_Buffer(); /* to build error message */
    luaL_buffinit(L, msg);
    if (sep[0] !== 0) /* non-empty separator? */
        name = luaL_gsub(L, name, sep, dirsep); /* replace it by 'dirsep' */
    while ((path = pushnexttemplate(L, path)) !== null) {
        var filename = luaL_gsub(L, lua_tostring(L, -1), to_luastring(LUA_PATH_MARK, true), name);
        lua_remove(L, -2); /* remove path template */
        if (readable(filename)) /* does file exist and is readable? */
            return filename; /* return that file name */
        lua_pushfstring(L, to_luastring("\n\tno file '%s'"), filename);
        lua_remove(L, -2); /* remove file name */
        luaL_addvalue(msg);
    }
    luaL_pushresult(msg); /* create error message */
    return null; /* not found */
};

var ll_searchpath = function ll_searchpath(L) {
    var f = searchpath(L, luaL_checkstring(L, 1), luaL_checkstring(L, 2), luaL_optstring(L, 3, to_luastring(".")), luaL_optstring(L, 4, to_luastring(LUA_DIRSEP)));
    if (f !== null) return 1;else {
        /* error message is on top of the stack */
        lua_pushnil(L);
        lua_insert(L, -2);
        return 2; /* return nil + error message */
    }
};

var findfile = function findfile(L, name, pname, dirsep) {
    lua_getfield(L, lua_upvalueindex(1), pname);
    var path = lua_tostring(L, -1);
    if (path === null) luaL_error(L, to_luastring("'package.%s' must be a string"), pname);
    return searchpath(L, name, path, to_luastring("."), dirsep);
};

var checkload = function checkload(L, stat, filename) {
    if (stat) {
        /* module loaded successfully? */
        lua_pushstring(L, filename); /* will be 2nd argument to module */
        return 2; /* return open function and file name */
    } else return luaL_error(L, to_luastring("error loading module '%s' from file '%s':\n\t%s"), lua_tostring(L, 1), filename, lua_tostring(L, -1));
};

var searcher_Lua = function searcher_Lua(L) {
    var name = luaL_checkstring(L, 1);
    var filename = findfile(L, name, to_luastring("path", true), to_luastring(LUA_LSUBSEP, true));
    if (filename === null) return 1; /* module not found in this path */
    return checkload(L, luaL_loadfile(L, filename) === LUA_OK, filename);
};

/*
** Try to find a load function for module 'modname' at file 'filename'.
** First, change '.' to '_' in 'modname'; then, if 'modname' has
** the form X-Y (that is, it has an "ignore mark"), build a function
** name "luaopen_X" and look for it. (For compatibility, if that
** fails, it also tries "luaopen_Y".) If there is no ignore mark,
** look for a function named "luaopen_modname".
*/
var loadfunc = function loadfunc(L, filename, modname) {
    var openfunc = void 0;
    modname = luaL_gsub(L, modname, to_luastring("."), LUA_OFSEP);
    var mark = luastring_indexOf(modname, LUA_IGMARK.charCodeAt(0));
    if (mark >= 0) {
        openfunc = lua_pushlstring(L, modname, mark);
        openfunc = lua_pushfstring(L, to_luastring("%s%s"), LUA_POF, openfunc);
        var stat = lookforfunc(L, filename, openfunc);
        if (stat !== ERRFUNC) return stat;
        modname = mark + 1; /* else go ahead and try old-style name */
    }
    openfunc = lua_pushfstring(L, to_luastring("%s%s"), LUA_POF, modname);
    return lookforfunc(L, filename, openfunc);
};

var searcher_C = function searcher_C(L) {
    var name = luaL_checkstring(L, 1);
    var filename = findfile(L, name, to_luastring("jspath", true), to_luastring(LUA_CSUBSEP, true));
    if (filename === null) return 1; /* module not found in this path */
    return checkload(L, loadfunc(L, filename, name) === 0, filename);
};

var searcher_Croot = function searcher_Croot(L) {
    var name = luaL_checkstring(L, 1);
    var p = luastring_indexOf(name, '.'.charCodeAt(0));
    var stat = void 0;
    if (p < 0) return 0; /* is root */
    lua_pushlstring(L, name, p);
    var filename = findfile(L, lua_tostring(L, -1), to_luastring("jspath", true), to_luastring(LUA_CSUBSEP, true));
    if (filename === null) return 1; /* root not found */
    if ((stat = loadfunc(L, filename, name)) !== 0) {
        if (stat != ERRFUNC) return checkload(L, 0, filename); /* real error */
        else {
                /* open function not found */
                lua_pushstring(L, to_luastring("\n\tno module '%s' in file '%s'"), name, filename);
                return 1;
            }
    }
    lua_pushstring(L, filename); /* will be 2nd argument to module */
    return 2;
};

var searcher_preload = function searcher_preload(L) {
    var name = luaL_checkstring(L, 1);
    lua_getfield(L, LUA_REGISTRYINDEX, LUA_PRELOAD_TABLE);
    if (lua_getfield(L, -1, name) === LUA_TNIL) /* not found? */
        lua_pushfstring(L, to_luastring("\n\tno field package.preload['%s']"), name);
    return 1;
};

var findloader = function findloader(L, name, ctx, k) {
    var msg = new luaL_Buffer(); /* to build error message */
    luaL_buffinit(L, msg);
    /* push 'package.searchers' to index 3 in the stack */
    if (lua_getfield(L, lua_upvalueindex(1), to_luastring("searchers", true)) !== LUA_TTABLE) luaL_error(L, to_luastring("'package.searchers' must be a table"));
    var ctx2 = { name: name, i: 1, msg: msg, ctx: ctx, k: k };
    return findloader_cont(L, LUA_OK, ctx2);
};

var findloader_cont = function findloader_cont(L, status, ctx) {
    /*  iterate over available searchers to find a loader */
    for (;; ctx.i++) {
        if (status === LUA_OK) {
            if (lua_rawgeti(L, 3, ctx.i) === LUA_TNIL) {
                /* no more searchers? */
                lua_pop(L, 1); /* remove nil */
                luaL_pushresult(ctx.msg); /* create error message */
                luaL_error(L, to_luastring("module '%s' not found:%s"), ctx.name, lua_tostring(L, -1));
            }
            lua_pushstring(L, ctx.name);
            lua_callk(L, 1, 2, ctx, findloader_cont); /* call it */
        } else {
            status = LUA_OK;
        }
        if (lua_isfunction(L, -2)) /* did it find a loader? */
            break; /* module loader found */
        else if (lua_isstring(L, -2)) {
                /* searcher returned error message? */
                lua_pop(L, 1); /* remove extra return */
                luaL_addvalue(ctx.msg); /* concatenate error message */
            } else lua_pop(L, 2); /* remove both returns */
    }
    return ctx.k(L, LUA_OK, ctx.ctx);
};

var ll_require = function ll_require(L) {
    var name = luaL_checkstring(L, 1);
    lua_settop(L, 1); /* LOADED table will be at index 2 */
    lua_getfield(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    lua_getfield(L, 2, name); /* LOADED[name] */
    if (lua_toboolean(L, -1)) /* is it there? */
        return 1; /* package is already loaded */
    /* else must load package */
    lua_pop(L, 1); /* remove 'getfield' result */
    var ctx = name;
    return findloader(L, name, ctx, ll_require_cont);
};

var ll_require_cont = function ll_require_cont(L, status, ctx) {
    var name = ctx;
    lua_pushstring(L, name); /* pass name as argument to module loader */
    lua_insert(L, -2); /* name is 1st argument (before search data) */
    lua_callk(L, 2, 1, ctx, ll_require_cont2);
    return ll_require_cont2(L, LUA_OK, ctx); /* run loader to load module */
};

var ll_require_cont2 = function ll_require_cont2(L, status, ctx) {
    var name = ctx;
    if (!lua_isnil(L, -1)) /* non-nil return? */
        lua_setfield(L, 2, name); /* LOADED[name] = returned value */
    if (lua_getfield(L, 2, name) == LUA_TNIL) {
        /* module set no value? */
        lua_pushboolean(L, 1); /* use true as result */
        lua_pushvalue(L, -1); /* extra copy to be returned */
        lua_setfield(L, 2, name); /* LOADED[name] = true */
    }
    return 1;
};

var pk_funcs = {
    "loadlib": ll_loadlib,
    "searchpath": ll_searchpath
};

var ll_funcs = {
    "require": ll_require
};

var createsearcherstable = function createsearcherstable(L) {
    var searchers = [searcher_preload, searcher_Lua, searcher_C, searcher_Croot, null];
    /* create 'searchers' table */
    lua_createtable(L);
    /* fill it with predefined searchers */
    for (var i = 0; searchers[i]; i++) {
        lua_pushvalue(L, -2); /* set 'package' as upvalue for all searchers */
        lua_pushcclosure(L, searchers[i], 1);
        lua_rawseti(L, -2, i + 1);
    }
    lua_setfield(L, -2, to_luastring("searchers", true)); /* put it in field 'searchers' */
};

/*
** create table JSLIBS to keep track of loaded JS libraries,
** setting a finalizer to close all libraries when closing state.
*/
var createjslibstable = function createjslibstable(L) {
    lua_newtable(L); /* create JSLIBS table */
    lua_createtable(L, 0, 1); /* create metatable for JSLIBS */
    lua_setmetatable(L, -2);
    lua_rawsetp(L, LUA_REGISTRYINDEX, JSLIBS); /* set JSLIBS table in registry */
};

var luaopen_package = function luaopen_package(L) {
    createjslibstable(L);
    luaL_newlib(L, pk_funcs); /* create 'package' table */
    createsearcherstable(L);
    /* set paths */
    setpath(L, to_luastring("path", true), LUA_PATH_VAR, LUA_PATH_DEFAULT);
    setpath(L, to_luastring("jspath", true), LUA_JSPATH_VAR, LUA_JSPATH_DEFAULT);
    /* store config information */
    lua_pushliteral(L, LUA_DIRSEP + "\n" + LUA_PATH_SEP + "\n" + LUA_PATH_MARK + "\n" + LUA_EXEC_DIR + "\n" + LUA_IGMARK + "\n");
    lua_setfield(L, -2, to_luastring("config", true));
    /* set field 'loaded' */
    luaL_getsubtable(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    lua_setfield(L, -2, to_luastring("loaded", true));
    /* set field 'preload' */
    luaL_getsubtable(L, LUA_REGISTRYINDEX, LUA_PRELOAD_TABLE);
    lua_setfield(L, -2, to_luastring("preload", true));
    lua_pushglobaltable(L);
    lua_pushvalue(L, -2); /* set 'package' as upvalue for next lib */
    luaL_setfuncs(L, ll_funcs, 1); /* open lib into global table */
    lua_pop(L, 1); /* pop global table */
    return 1; /* return 'package' table */
};

module.exports.luaopen_package = luaopen_package;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.L = exports.interop = exports.lualib = exports.lauxlib = exports.lua = exports.to_uristring = exports.to_luastring = exports.to_jsstring = exports.luastring_of = exports.luastring_indexOf = exports.luastring_eq = exports.FENGARI_VERSION_RELEASE = exports.FENGARI_VERSION_NUM = exports.FENGARI_VERSION_MINOR = exports.FENGARI_VERSION_MAJOR = exports.FENGARI_VERSION = exports.FENGARI_RELEASE = exports.FENGARI_COPYRIGHT = exports.FENGARI_AUTHORS = undefined;
exports.load = load;

var _fengari = __webpack_require__(19);

var _fengariInterop = __webpack_require__(39);

var interop = _interopRequireWildcard(_fengariInterop);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var LUA_ERRRUN = _fengari.lua.LUA_ERRRUN,
    LUA_ERRSYNTAX = _fengari.lua.LUA_ERRSYNTAX,
    LUA_OK = _fengari.lua.LUA_OK,
    lua_Debug = _fengari.lua.lua_Debug,
    lua_getinfo = _fengari.lua.lua_getinfo,
    lua_getstack = _fengari.lua.lua_getstack,
    lua_gettop = _fengari.lua.lua_gettop,
    lua_insert = _fengari.lua.lua_insert,
    lua_pcall = _fengari.lua.lua_pcall,
    lua_pop = _fengari.lua.lua_pop,
    lua_pushcfunction = _fengari.lua.lua_pushcfunction,
    lua_pushstring = _fengari.lua.lua_pushstring,
    lua_remove = _fengari.lua.lua_remove,
    lua_setglobal = _fengari.lua.lua_setglobal,
    lua_tojsstring = _fengari.lua.lua_tojsstring;
var luaL_loadbuffer = _fengari.lauxlib.luaL_loadbuffer,
    luaL_newstate = _fengari.lauxlib.luaL_newstate,
    luaL_requiref = _fengari.lauxlib.luaL_requiref;
var checkjs = interop.checkjs,
    luaopen_js = interop.luaopen_js,
    push = interop.push,
    tojs = interop.tojs;
exports.FENGARI_AUTHORS = _fengari.FENGARI_AUTHORS;
exports.FENGARI_COPYRIGHT = _fengari.FENGARI_COPYRIGHT;
exports.FENGARI_RELEASE = _fengari.FENGARI_RELEASE;
exports.FENGARI_VERSION = _fengari.FENGARI_VERSION;
exports.FENGARI_VERSION_MAJOR = _fengari.FENGARI_VERSION_MAJOR;
exports.FENGARI_VERSION_MINOR = _fengari.FENGARI_VERSION_MINOR;
exports.FENGARI_VERSION_NUM = _fengari.FENGARI_VERSION_NUM;
exports.FENGARI_VERSION_RELEASE = _fengari.FENGARI_VERSION_RELEASE;
exports.luastring_eq = _fengari.luastring_eq;
exports.luastring_indexOf = _fengari.luastring_indexOf;
exports.luastring_of = _fengari.luastring_of;
exports.to_jsstring = _fengari.to_jsstring;
exports.to_luastring = _fengari.to_luastring;
exports.to_uristring = _fengari.to_uristring;
exports.lua = _fengari.lua;
exports.lauxlib = _fengari.lauxlib;
exports.lualib = _fengari.lualib;
exports.interop = interop;
var L = exports.L = luaL_newstate();

/* open standard libraries */
_fengari.lualib.luaL_openlibs(L);
luaL_requiref(L, (0, _fengari.to_luastring)("js"), luaopen_js, 1);
lua_pop(L, 1); /* remove lib */

lua_pushstring(L, (0, _fengari.to_luastring)(_fengari.FENGARI_COPYRIGHT));
lua_setglobal(L, (0, _fengari.to_luastring)("_COPYRIGHT"));

/* Helper function to load a JS string of Lua source */
function load(source, chunkname) {
	if (typeof source == "string") source = (0, _fengari.to_luastring)(source);else if (!Array.isArray(source)) throw TypeError("expected string or array of bytes");

	chunkname = chunkname ? (0, _fengari.to_luastring)(chunkname) : null;
	var ok = luaL_loadbuffer(L, source, null, chunkname);
	var res = void 0;
	if (ok === LUA_ERRSYNTAX) {
		res = new SyntaxError(lua_tojsstring(L, -1));
	} else {
		res = tojs(L, -1);
	}
	lua_pop(L, 1);
	if (ok !== LUA_OK) {
		throw res;
	}
	return res;
}

/* global WorkerGlobalScope */ /* see https://github.com/sindresorhus/globals/issues/127 */
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	/* in a web worker */
} else {
	var crossorigin_to_credentials = function crossorigin_to_credentials(crossorigin) {
		switch (crossorigin) {
			case "anonymous":
				return "omit";
			case "use-credentials":
				return "include";
			default:
				return "same-origin";
		}
	};

	var msghandler = function msghandler(L) {
		var ar = new lua_Debug();
		if (lua_getstack(L, 2, ar)) lua_getinfo(L, (0, _fengari.to_luastring)("Sl"), ar);
		push(L, new ErrorEvent("error", {
			bubbles: true,
			cancelable: true,
			message: lua_tojsstring(L, 1),
			error: tojs(L, 1),
			filename: ar.short_src ? (0, _fengari.to_jsstring)(ar.short_src) : void 0,
			lineno: ar.currentline > 0 ? ar.currentline : void 0
		}));
		return 1;
	};

	var run_lua_script = function run_lua_script(tag, code, chunkname) {
		var ok = luaL_loadbuffer(L, code, null, chunkname);
		var e = void 0;
		if (ok === LUA_ERRSYNTAX) {
			var msg = lua_tojsstring(L, -1);
			var filename = tag.src ? tag.src : document.location;
			var lineno = void 0; /* TODO: extract out of msg */
			var syntaxerror = new SyntaxError(msg, filename, lineno);
			e = new ErrorEvent("error", {
				message: msg,
				error: syntaxerror,
				filename: filename,
				lineno: lineno
			});
		} else if (ok === LUA_OK) {
			/* insert message handler below function */
			var base = lua_gettop(L);
			lua_pushcfunction(L, msghandler);
			lua_insert(L, base);
			/* set document.currentScript.
      We can't set it normally; but we can create a getter for it, then remove the getter */
			Object.defineProperty(document, 'currentScript', {
				value: tag,
				configurable: true
			});
			ok = lua_pcall(L, 0, 0, base);
			/* Remove the currentScript getter installed above; this restores normal behaviour */
			delete document.currentScript;
			/* Remove message handler */
			lua_remove(L, base);
			/* Check if normal error that msghandler would have handled */
			if (ok === LUA_ERRRUN) {
				e = checkjs(L, -1);
			}
		}
		if (ok !== LUA_OK) {
			if (e === void 0) {
				e = new ErrorEvent("error", {
					message: lua_tojsstring(L, -1),
					error: tojs(L, -1)
				});
			}
			lua_pop(L, 1);
			if (window.dispatchEvent(e)) {
				console.error("uncaught exception", e.error);
			}
		}
	};

	var process_xhr_response = function process_xhr_response(xhr, tag, chunkname) {
		if (xhr.status >= 200 && xhr.status < 300) {
			var code = xhr.response;
			if (typeof code === "string") {
				code = (0, _fengari.to_luastring)(xhr.response);
			} else {
				/* is an array buffer */
				code = new Uint8Array(code);
			}
			/* TODO: subresource integrity check? */
			run_lua_script(tag, code, chunkname);
		} else {
			tag.dispatchEvent(new Event("error"));
		}
	};

	/* in main browser window */
	var run_lua_script_tag = function run_lua_script_tag(tag) {
		if (tag.src) {
			var chunkname = (0, _fengari.to_luastring)("@" + tag.src);
			/* JS script tags are async after document has loaded */
			if (document.readyState === "complete" || tag.async) {
				if (typeof fetch === "function") {
					fetch(tag.src, {
						method: "GET",
						credentials: crossorigin_to_credentials(tag.crossorigin),
						redirect: "follow",
						integrity: tag.integrity
					}).then(function (resp) {
						if (resp.ok) {
							return resp.arrayBuffer();
						} else {
							throw "unable to fetch";
						}
					}).then(function (buffer) {
						var code = new Uint8Array(buffer);
						run_lua_script(tag, code, chunkname);
					}).catch(function (reason) {
						tag.dispatchEvent(new Event("error"));
					});
				} else {
					var xhr = new XMLHttpRequest();
					xhr.open("GET", tag.src, true);
					xhr.responseType = "arraybuffer";
					xhr.onreadystatechange = function () {
						if (xhr.readyState === 4) process_xhr_response(xhr, tag, chunkname);
					};
					xhr.send();
				}
			} else {
				/* Needs to be synchronous: use an XHR */
				var _xhr = new XMLHttpRequest();
				_xhr.open("GET", tag.src, false);
				_xhr.send();
				process_xhr_response(_xhr, tag, chunkname);
			}
		} else {
			var code = (0, _fengari.to_luastring)(tag.innerHTML);
			var _chunkname = tag.id ? (0, _fengari.to_luastring)("=" + tag.id) : code;
			run_lua_script(tag, code, _chunkname);
		}
	};

	var contentTypeRegexp = /^(.*?\/.*?)([\t ]*;.*)?$/;
	var try_tag = function try_tag(tag) {
		if (tag.tagName !== "SCRIPT") return;

		/* strip off mime type parameters */
		var contentTypeMatch = contentTypeRegexp.exec(tag.type);
		if (contentTypeMatch) {
			var mimetype = contentTypeMatch[1];
			if (mimetype === "application/lua" || mimetype === "text/lua") {
				run_lua_script_tag(tag);
			}
		}
	};

	/* watch for new script tags added to document */
	new MutationObserver(function (records, observer) {
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			for (var j = 0; j < record.addedNodes.length; j++) {
				try_tag(record.addedNodes[j]);
			}
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});

	/* the query selector here is slightly liberal,
    more checks occur in try_tag */
	var selector = 'script[type^="application/lua"] script[type^="text/lua"]';

	/* try to run existing script tags */
	Array.prototype.forEach.call(document.querySelectorAll(selector), try_tag);
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    LUA_MULTRET = _require.LUA_MULTRET,
    LUA_OPADD = _require.LUA_OPADD,
    LUA_OPBAND = _require.LUA_OPBAND,
    LUA_OPBNOT = _require.LUA_OPBNOT,
    LUA_OPBOR = _require.LUA_OPBOR,
    LUA_OPBXOR = _require.LUA_OPBXOR,
    LUA_OPDIV = _require.LUA_OPDIV,
    LUA_OPIDIV = _require.LUA_OPIDIV,
    LUA_OPMOD = _require.LUA_OPMOD,
    LUA_OPSHL = _require.LUA_OPSHL,
    LUA_OPSHR = _require.LUA_OPSHR,
    LUA_OPUNM = _require.LUA_OPUNM,
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TLIGHTUSERDATA = _require$constant_typ.LUA_TLIGHTUSERDATA,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TTABLE = _require$constant_typ.LUA_TTABLE,
    to_luastring = _require.to_luastring;

var _require2 = __webpack_require__(2),
    lua_assert = _require2.lua_assert;

var llex = __webpack_require__(20);
var lobject = __webpack_require__(5);
var lopcodes = __webpack_require__(15);
var lparser = __webpack_require__(22);
var ltable = __webpack_require__(8);
var lvm = __webpack_require__(14);

var OpCodesI = lopcodes.OpCodesI;
var TValue = lobject.TValue;

/* Maximum number of registers in a Lua function (must fit in 8 bits) */
var MAXREGS = 255;

/*
** Marks the end of a patch list. It is an invalid value both as an absolute
** address, and as a list link (would link an element to itself).
*/
var NO_JUMP = -1;

var BinOpr = {
    OPR_ADD: 0,
    OPR_SUB: 1,
    OPR_MUL: 2,
    OPR_MOD: 3,
    OPR_POW: 4,
    OPR_DIV: 5,
    OPR_IDIV: 6,
    OPR_BAND: 7,
    OPR_BOR: 8,
    OPR_BXOR: 9,
    OPR_SHL: 10,
    OPR_SHR: 11,
    OPR_CONCAT: 12,
    OPR_EQ: 13,
    OPR_LT: 14,
    OPR_LE: 15,
    OPR_NE: 16,
    OPR_GT: 17,
    OPR_GE: 18,
    OPR_AND: 19,
    OPR_OR: 20,
    OPR_NOBINOPR: 21
};

var UnOpr = {
    OPR_MINUS: 0,
    OPR_BNOT: 1,
    OPR_NOT: 2,
    OPR_LEN: 3,
    OPR_NOUNOPR: 4
};

var hasjumps = function hasjumps(e) {
    return e.t !== e.f;
};

/*
** If expression is a numeric constant returns either true or a new TValue
** (depending on 'make_tvalue'). Otherwise, returns false.
*/
var tonumeral = function tonumeral(e, make_tvalue) {
    var ek = lparser.expkind;
    if (hasjumps(e)) return false; /* not a numeral */
    switch (e.k) {
        case ek.VKINT:
            if (make_tvalue) {
                return new TValue(LUA_TNUMINT, e.u.ival);
            }
            return true;
        case ek.VKFLT:
            if (make_tvalue) {
                return new TValue(LUA_TNUMFLT, e.u.nval);
            }
            return true;
        default:
            return false;
    }
};

/*
** Create a OP_LOADNIL instruction, but try to optimize: if the previous
** instruction is also OP_LOADNIL and ranges are compatible, adjust
** range of previous instruction instead of emitting a new one. (For
** instance, 'local a; local b' will generate a single opcode.)
*/
var luaK_nil = function luaK_nil(fs, from, n) {
    var previous = void 0;
    var l = from + n - 1; /* last register to set nil */
    if (fs.pc > fs.lasttarget) {
        /* no jumps to current position? */
        previous = fs.f.code[fs.pc - 1];
        if (previous.opcode === OpCodesI.OP_LOADNIL) {
            /* previous is LOADNIL? */
            var pfrom = previous.A; /* get previous range */
            var pl = pfrom + previous.B;
            if (pfrom <= from && from <= pl + 1 || from <= pfrom && pfrom <= l + 1) {
                /* can connect both? */
                if (pfrom < from) from = pfrom; /* from = min(from, pfrom) */
                if (pl > l) l = pl; /* l = max(l, pl) */
                lopcodes.SETARG_A(previous, from);
                lopcodes.SETARG_B(previous, l - from);
                return;
            }
        } /* else go through */
    }
    luaK_codeABC(fs, OpCodesI.OP_LOADNIL, from, n - 1, 0); /* else no optimization */
};

var getinstruction = function getinstruction(fs, e) {
    return fs.f.code[e.u.info];
};

/*
** Gets the destination address of a jump instruction. Used to traverse
** a list of jumps.
*/
var getjump = function getjump(fs, pc) {
    var offset = fs.f.code[pc].sBx;
    if (offset === NO_JUMP) /* point to itself represents end of list */
        return NO_JUMP; /* end of list */
    else return pc + 1 + offset; /* turn offset into absolute position */
};

/*
** Fix jump instruction at position 'pc' to jump to 'dest'.
** (Jump addresses are relative in Lua)
*/
var fixjump = function fixjump(fs, pc, dest) {
    var jmp = fs.f.code[pc];
    var offset = dest - (pc + 1);
    lua_assert(dest !== NO_JUMP);
    if (Math.abs(offset) > lopcodes.MAXARG_sBx) llex.luaX_syntaxerror(fs.ls, to_luastring("control structure too long", true));
    lopcodes.SETARG_sBx(jmp, offset);
};

/*
** Concatenate jump-list 'l2' into jump-list 'l1'
*/
var luaK_concat = function luaK_concat(fs, l1, l2) {
    if (l2 === NO_JUMP) return l1; /* nothing to concatenate? */
    else if (l1 === NO_JUMP) /* no original list? */
            l1 = l2;else {
            var list = l1;
            var next = getjump(fs, list);
            while (next !== NO_JUMP) {
                /* find last element */
                list = next;
                next = getjump(fs, list);
            }
            fixjump(fs, list, l2);
        }

    return l1;
};

/*
** Create a jump instruction and return its position, so its destination
** can be fixed later (with 'fixjump'). If there are jumps to
** this position (kept in 'jpc'), link them all together so that
** 'patchlistaux' will fix all them directly to the final destination.
*/
var luaK_jump = function luaK_jump(fs) {
    var jpc = fs.jpc; /* save list of jumps to here */
    fs.jpc = NO_JUMP; /* no more jumps to here */
    var j = luaK_codeAsBx(fs, OpCodesI.OP_JMP, 0, NO_JUMP);
    j = luaK_concat(fs, j, jpc); /* keep them on hold */
    return j;
};

var luaK_jumpto = function luaK_jumpto(fs, t) {
    return luaK_patchlist(fs, luaK_jump(fs), t);
};

/*
** Code a 'return' instruction
*/
var luaK_ret = function luaK_ret(fs, first, nret) {
    luaK_codeABC(fs, OpCodesI.OP_RETURN, first, nret + 1, 0);
};

/*
** Code a "conditional jump", that is, a test or comparison opcode
** followed by a jump. Return jump position.
*/
var condjump = function condjump(fs, op, A, B, C) {
    luaK_codeABC(fs, op, A, B, C);
    return luaK_jump(fs);
};

/*
** returns current 'pc' and marks it as a jump target (to avoid wrong
** optimizations with consecutive instructions not in the same basic block).
*/
var luaK_getlabel = function luaK_getlabel(fs) {
    fs.lasttarget = fs.pc;
    return fs.pc;
};

/*
** Returns the position of the instruction "controlling" a given
** jump (that is, its condition), or the jump itself if it is
** unconditional.
*/
var getjumpcontroloffset = function getjumpcontroloffset(fs, pc) {
    if (pc >= 1 && lopcodes.testTMode(fs.f.code[pc - 1].opcode)) return pc - 1;else return pc;
};
var getjumpcontrol = function getjumpcontrol(fs, pc) {
    return fs.f.code[getjumpcontroloffset(fs, pc)];
};

/*
** Patch destination register for a TESTSET instruction.
** If instruction in position 'node' is not a TESTSET, return 0 ("fails").
** Otherwise, if 'reg' is not 'NO_REG', set it as the destination
** register. Otherwise, change instruction to a simple 'TEST' (produces
** no register value)
*/
var patchtestreg = function patchtestreg(fs, node, reg) {
    var pc = getjumpcontroloffset(fs, node);
    var i = fs.f.code[pc];
    if (i.opcode !== OpCodesI.OP_TESTSET) return false; /* cannot patch other instructions */
    if (reg !== lopcodes.NO_REG && reg !== i.B) lopcodes.SETARG_A(i, reg);else {
        /* no register to put value or register already has the value;
           change instruction to simple test */
        fs.f.code[pc] = lopcodes.CREATE_ABC(OpCodesI.OP_TEST, i.B, 0, i.C);
    }
    return true;
};

/*
** Traverse a list of tests ensuring no one produces a value
*/
var removevalues = function removevalues(fs, list) {
    for (; list !== NO_JUMP; list = getjump(fs, list)) {
        patchtestreg(fs, list, lopcodes.NO_REG);
    }
};

/*
** Traverse a list of tests, patching their destination address and
** registers: tests producing values jump to 'vtarget' (and put their
** values in 'reg'), other tests jump to 'dtarget'.
*/
var patchlistaux = function patchlistaux(fs, list, vtarget, reg, dtarget) {
    while (list !== NO_JUMP) {
        var next = getjump(fs, list);
        if (patchtestreg(fs, list, reg)) fixjump(fs, list, vtarget);else fixjump(fs, list, dtarget); /* jump to default target */
        list = next;
    }
};

/*
** Ensure all pending jumps to current position are fixed (jumping
** to current position with no values) and reset list of pending
** jumps
*/
var dischargejpc = function dischargejpc(fs) {
    patchlistaux(fs, fs.jpc, fs.pc, lopcodes.NO_REG, fs.pc);
    fs.jpc = NO_JUMP;
};

/*
** Add elements in 'list' to list of pending jumps to "here"
** (current position)
*/
var luaK_patchtohere = function luaK_patchtohere(fs, list) {
    luaK_getlabel(fs); /* mark "here" as a jump target */
    fs.jpc = luaK_concat(fs, fs.jpc, list);
};

/*
** Path all jumps in 'list' to jump to 'target'.
** (The assert means that we cannot fix a jump to a forward address
** because we only know addresses once code is generated.)
*/
var luaK_patchlist = function luaK_patchlist(fs, list, target) {
    if (target === fs.pc) /* 'target' is current position? */
        luaK_patchtohere(fs, list); /* add list to pending jumps */
    else {
            lua_assert(target < fs.pc);
            patchlistaux(fs, list, target, lopcodes.NO_REG, target);
        }
};

/*
** Path all jumps in 'list' to close upvalues up to given 'level'
** (The assertion checks that jumps either were closing nothing
** or were closing higher levels, from inner blocks.)
*/
var luaK_patchclose = function luaK_patchclose(fs, list, level) {
    level++; /* argument is +1 to reserve 0 as non-op */
    for (; list !== NO_JUMP; list = getjump(fs, list)) {
        var ins = fs.f.code[list];
        lua_assert(ins.opcode === OpCodesI.OP_JMP && (ins.A === 0 || ins.A >= level));
        lopcodes.SETARG_A(ins, level);
    }
};

/*
** Emit instruction 'i', checking for array sizes and saving also its
** line information. Return 'i' position.
*/
var luaK_code = function luaK_code(fs, i) {
    var f = fs.f;
    dischargejpc(fs); /* 'pc' will change */
    /* put new instruction in code array */
    f.code[fs.pc] = i;
    f.lineinfo[fs.pc] = fs.ls.lastline;
    return fs.pc++;
};

/*
** Format and emit an 'iABC' instruction. (Assertions check consistency
** of parameters versus opcode.)
*/
var luaK_codeABC = function luaK_codeABC(fs, o, a, b, c) {
    lua_assert(lopcodes.getOpMode(o) === lopcodes.iABC);
    lua_assert(lopcodes.getBMode(o) !== lopcodes.OpArgN || b === 0);
    lua_assert(lopcodes.getCMode(o) !== lopcodes.OpArgN || c === 0);
    lua_assert(a <= lopcodes.MAXARG_A && b <= lopcodes.MAXARG_B && c <= lopcodes.MAXARG_C);
    return luaK_code(fs, lopcodes.CREATE_ABC(o, a, b, c));
};

/*
** Format and emit an 'iABx' instruction.
*/
var luaK_codeABx = function luaK_codeABx(fs, o, a, bc) {
    lua_assert(lopcodes.getOpMode(o) === lopcodes.iABx || lopcodes.getOpMode(o) === lopcodes.iAsBx);
    lua_assert(lopcodes.getCMode(o) === lopcodes.OpArgN);
    lua_assert(a <= lopcodes.MAXARG_A && bc <= lopcodes.MAXARG_Bx);
    return luaK_code(fs, lopcodes.CREATE_ABx(o, a, bc));
};

var luaK_codeAsBx = function luaK_codeAsBx(fs, o, A, sBx) {
    return luaK_codeABx(fs, o, A, sBx + lopcodes.MAXARG_sBx);
};

/*
** Emit an "extra argument" instruction (format 'iAx')
*/
var codeextraarg = function codeextraarg(fs, a) {
    lua_assert(a <= lopcodes.MAXARG_Ax);
    return luaK_code(fs, lopcodes.CREATE_Ax(OpCodesI.OP_EXTRAARG, a));
};

/*
** Emit a "load constant" instruction, using either 'OP_LOADK'
** (if constant index 'k' fits in 18 bits) or an 'OP_LOADKX'
** instruction with "extra argument".
*/
var luaK_codek = function luaK_codek(fs, reg, k) {
    if (k <= lopcodes.MAXARG_Bx) return luaK_codeABx(fs, OpCodesI.OP_LOADK, reg, k);else {
        var p = luaK_codeABx(fs, OpCodesI.OP_LOADKX, reg, 0);
        codeextraarg(fs, k);
        return p;
    }
};

/*
** Check register-stack level, keeping track of its maximum size
** in field 'maxstacksize'
*/
var luaK_checkstack = function luaK_checkstack(fs, n) {
    var newstack = fs.freereg + n;
    if (newstack > fs.f.maxstacksize) {
        if (newstack >= MAXREGS) llex.luaX_syntaxerror(fs.ls, to_luastring("function or expression needs too many registers", true));
        fs.f.maxstacksize = newstack;
    }
};

/*
** Reserve 'n' registers in register stack
*/
var luaK_reserveregs = function luaK_reserveregs(fs, n) {
    luaK_checkstack(fs, n);
    fs.freereg += n;
};

/*
** Free register 'reg', if it is neither a constant index nor
** a local variable.
*/
var freereg = function freereg(fs, reg) {
    if (!lopcodes.ISK(reg) && reg >= fs.nactvar) {
        fs.freereg--;
        lua_assert(reg === fs.freereg);
    }
};

/*
** Free register used by expression 'e' (if any)
*/
var freeexp = function freeexp(fs, e) {
    if (e.k === lparser.expkind.VNONRELOC) freereg(fs, e.u.info);
};

/*
** Free registers used by expressions 'e1' and 'e2' (if any) in proper
** order.
*/
var freeexps = function freeexps(fs, e1, e2) {
    var r1 = e1.k === lparser.expkind.VNONRELOC ? e1.u.info : -1;
    var r2 = e2.k === lparser.expkind.VNONRELOC ? e2.u.info : -1;
    if (r1 > r2) {
        freereg(fs, r1);
        freereg(fs, r2);
    } else {
        freereg(fs, r2);
        freereg(fs, r1);
    }
};

/*
** Add constant 'v' to prototype's list of constants (field 'k').
** Use scanner's table to cache position of constants in constant list
** and try to reuse constants. Because some values should not be used
** as keys (nil cannot be a key, integer keys can collapse with float
** keys), the caller must provide a useful 'key' for indexing the cache.
*/
var addk = function addk(fs, key, v) {
    var f = fs.f;
    var idx = ltable.luaH_set(fs.L, fs.ls.h, key); /* index scanner table */
    if (idx.ttisinteger()) {
        /* is there an index there? */
        var _k = idx.value;
        /* correct value? (warning: must distinguish floats from integers!) */
        if (_k < fs.nk && f.k[_k].ttype() === v.ttype() && f.k[_k].value === v.value) return _k; /* reuse index */
    }
    /* constant not found; create a new entry */
    var k = fs.nk;
    idx.setivalue(k);
    f.k[k] = v;
    fs.nk++;
    return k;
};

/*
** Add a string to list of constants and return its index.
*/
var luaK_stringK = function luaK_stringK(fs, s) {
    var o = new TValue(LUA_TLNGSTR, s);
    return addk(fs, o, o); /* use string itself as key */
};

/*
** Add an integer to list of constants and return its index.
** Integers use userdata as keys to avoid collision with floats with
** same value.
*/
var luaK_intK = function luaK_intK(fs, n) {
    var k = new TValue(LUA_TLIGHTUSERDATA, n);
    var o = new TValue(LUA_TNUMINT, n);
    return addk(fs, k, o);
};

/*
** Add a float to list of constants and return its index.
*/
var luaK_numberK = function luaK_numberK(fs, r) {
    var o = new TValue(LUA_TNUMFLT, r);
    return addk(fs, o, o); /* use number itself as key */
};

/*
** Add a boolean to list of constants and return its index.
*/
var boolK = function boolK(fs, b) {
    var o = new TValue(LUA_TBOOLEAN, b);
    return addk(fs, o, o); /* use boolean itself as key */
};

/*
** Add nil to list of constants and return its index.
*/
var nilK = function nilK(fs) {
    var v = new TValue(LUA_TNIL, null);
    var k = new TValue(LUA_TTABLE, fs.ls.h);
    /* cannot use nil as key; instead use table itself to represent nil */
    return addk(fs, k, v);
};

/*
** Fix an expression to return the number of results 'nresults'.
** Either 'e' is a multi-ret expression (function call or vararg)
** or 'nresults' is LUA_MULTRET (as any expression can satisfy that).
*/
var luaK_setreturns = function luaK_setreturns(fs, e, nresults) {
    var ek = lparser.expkind;
    if (e.k === ek.VCALL) {
        /* expression is an open function call? */
        lopcodes.SETARG_C(getinstruction(fs, e), nresults + 1);
    } else if (e.k === ek.VVARARG) {
        var pc = getinstruction(fs, e);
        lopcodes.SETARG_B(pc, nresults + 1);
        lopcodes.SETARG_A(pc, fs.freereg);
        luaK_reserveregs(fs, 1);
    } else lua_assert(nresults === LUA_MULTRET);
};

var luaK_setmultret = function luaK_setmultret(fs, e) {
    luaK_setreturns(fs, e, LUA_MULTRET);
};

/*
** Fix an expression to return one result.
** If expression is not a multi-ret expression (function call or
** vararg), it already returns one result, so nothing needs to be done.
** Function calls become VNONRELOC expressions (as its result comes
** fixed in the base register of the call), while vararg expressions
** become VRELOCABLE (as OP_VARARG puts its results where it wants).
** (Calls are created returning one result, so that does not need
** to be fixed.)
*/
var luaK_setoneret = function luaK_setoneret(fs, e) {
    var ek = lparser.expkind;
    if (e.k === ek.VCALL) {
        /* expression is an open function call? */
        /* already returns 1 value */
        lua_assert(getinstruction(fs, e).C === 2);
        e.k = ek.VNONRELOC; /* result has fixed position */
        e.u.info = getinstruction(fs, e).A;
    } else if (e.k === ek.VVARARG) {
        lopcodes.SETARG_B(getinstruction(fs, e), 2);
        e.k = ek.VRELOCABLE; /* can relocate its simple result */
    }
};

/*
** Ensure that expression 'e' is not a variable.
*/
var luaK_dischargevars = function luaK_dischargevars(fs, e) {
    var ek = lparser.expkind;

    switch (e.k) {
        case ek.VLOCAL:
            {
                /* already in a register */
                e.k = ek.VNONRELOC; /* becomes a non-relocatable value */
                break;
            }
        case ek.VUPVAL:
            {
                /* move value to some (pending) register */
                e.u.info = luaK_codeABC(fs, OpCodesI.OP_GETUPVAL, 0, e.u.info, 0);
                e.k = ek.VRELOCABLE;
                break;
            }
        case ek.VINDEXED:
            {
                var op = void 0;
                freereg(fs, e.u.ind.idx);
                if (e.u.ind.vt === ek.VLOCAL) {
                    /* is 't' in a register? */
                    freereg(fs, e.u.ind.t);
                    op = OpCodesI.OP_GETTABLE;
                } else {
                    lua_assert(e.u.ind.vt === ek.VUPVAL);
                    op = OpCodesI.OP_GETTABUP; /* 't' is in an upvalue */
                }
                e.u.info = luaK_codeABC(fs, op, 0, e.u.ind.t, e.u.ind.idx);
                e.k = ek.VRELOCABLE;
                break;
            }
        case ek.VVARARG:case ek.VCALL:
            {
                luaK_setoneret(fs, e);
                break;
            }
        default:
            break; /* there is one value available (somewhere) */
    }
};

var code_loadbool = function code_loadbool(fs, A, b, jump) {
    luaK_getlabel(fs); /* those instructions may be jump targets */
    return luaK_codeABC(fs, OpCodesI.OP_LOADBOOL, A, b, jump);
};

/*
** Ensures expression value is in register 'reg' (and therefore
** 'e' will become a non-relocatable expression).
*/
var discharge2reg = function discharge2reg(fs, e, reg) {
    var ek = lparser.expkind;
    luaK_dischargevars(fs, e);
    switch (e.k) {
        case ek.VNIL:
            {
                luaK_nil(fs, reg, 1);
                break;
            }
        case ek.VFALSE:case ek.VTRUE:
            {
                luaK_codeABC(fs, OpCodesI.OP_LOADBOOL, reg, e.k === ek.VTRUE, 0);
                break;
            }
        case ek.VK:
            {
                luaK_codek(fs, reg, e.u.info);
                break;
            }
        case ek.VKFLT:
            {
                luaK_codek(fs, reg, luaK_numberK(fs, e.u.nval));
                break;
            }
        case ek.VKINT:
            {
                luaK_codek(fs, reg, luaK_intK(fs, e.u.ival));
                break;
            }
        case ek.VRELOCABLE:
            {
                var pc = getinstruction(fs, e);
                lopcodes.SETARG_A(pc, reg); /* instruction will put result in 'reg' */
                break;
            }
        case ek.VNONRELOC:
            {
                if (reg !== e.u.info) luaK_codeABC(fs, OpCodesI.OP_MOVE, reg, e.u.info, 0);
                break;
            }
        default:
            {
                lua_assert(e.k === ek.VJMP);
                return; /* nothing to do... */
            }
    }
    e.u.info = reg;
    e.k = ek.VNONRELOC;
};

/*
** Ensures expression value is in any register.
*/
var discharge2anyreg = function discharge2anyreg(fs, e) {
    if (e.k !== lparser.expkind.VNONRELOC) {
        /* no fixed register yet? */
        luaK_reserveregs(fs, 1); /* get a register */
        discharge2reg(fs, e, fs.freereg - 1); /* put value there */
    }
};

/*
** check whether list has any jump that do not produce a value
** or produce an inverted value
*/
var need_value = function need_value(fs, list) {
    for (; list !== NO_JUMP; list = getjump(fs, list)) {
        var i = getjumpcontrol(fs, list);
        if (i.opcode !== OpCodesI.OP_TESTSET) return true;
    }
    return false; /* not found */
};

/*
** Ensures final expression result (including results from its jump
** lists) is in register 'reg'.
** If expression has jumps, need to patch these jumps either to
** its final position or to "load" instructions (for those tests
** that do not produce values).
*/
var exp2reg = function exp2reg(fs, e, reg) {
    var ek = lparser.expkind;
    discharge2reg(fs, e, reg);
    if (e.k === ek.VJMP) /* expression itself is a test? */
        e.t = luaK_concat(fs, e.t, e.u.info); /* put this jump in 't' list */
    if (hasjumps(e)) {
        var final = void 0; /* position after whole expression */
        var p_f = NO_JUMP; /* position of an eventual LOAD false */
        var p_t = NO_JUMP; /* position of an eventual LOAD true */
        if (need_value(fs, e.t) || need_value(fs, e.f)) {
            var fj = e.k === ek.VJMP ? NO_JUMP : luaK_jump(fs);
            p_f = code_loadbool(fs, reg, 0, 1);
            p_t = code_loadbool(fs, reg, 1, 0);
            luaK_patchtohere(fs, fj);
        }
        final = luaK_getlabel(fs);
        patchlistaux(fs, e.f, final, reg, p_f);
        patchlistaux(fs, e.t, final, reg, p_t);
    }
    e.f = e.t = NO_JUMP;
    e.u.info = reg;
    e.k = ek.VNONRELOC;
};

/*
** Ensures final expression result (including results from its jump
** lists) is in next available register.
*/
var luaK_exp2nextreg = function luaK_exp2nextreg(fs, e) {
    luaK_dischargevars(fs, e);
    freeexp(fs, e);
    luaK_reserveregs(fs, 1);
    exp2reg(fs, e, fs.freereg - 1);
};

/*
** Ensures final expression result (including results from its jump
** lists) is in some (any) register and return that register.
*/
var luaK_exp2anyreg = function luaK_exp2anyreg(fs, e) {
    luaK_dischargevars(fs, e);
    if (e.k === lparser.expkind.VNONRELOC) {
        /* expression already has a register? */
        if (!hasjumps(e)) /* no jumps? */
            return e.u.info; /* result is already in a register */
        if (e.u.info >= fs.nactvar) {
            /* reg. is not a local? */
            exp2reg(fs, e, e.u.info); /* put final result in it */
            return e.u.info;
        }
    }
    luaK_exp2nextreg(fs, e); /* otherwise, use next available register */
    return e.u.info;
};

/*
** Ensures final expression result is either in a register or in an
** upvalue.
*/
var luaK_exp2anyregup = function luaK_exp2anyregup(fs, e) {
    if (e.k !== lparser.expkind.VUPVAL || hasjumps(e)) luaK_exp2anyreg(fs, e);
};

/*
** Ensures final expression result is either in a register or it is
** a constant.
*/
var luaK_exp2val = function luaK_exp2val(fs, e) {
    if (hasjumps(e)) luaK_exp2anyreg(fs, e);else luaK_dischargevars(fs, e);
};

/*
** Ensures final expression result is in a valid R/K index
** (that is, it is either in a register or in 'k' with an index
** in the range of R/K indices).
** Returns R/K index.
*/
var luaK_exp2RK = function luaK_exp2RK(fs, e) {
    var ek = lparser.expkind;
    var vk = false;
    luaK_exp2val(fs, e);
    switch (e.k) {/* move constants to 'k' */
        case ek.VTRUE:
            e.u.info = boolK(fs, true);vk = true;break;
        case ek.VFALSE:
            e.u.info = boolK(fs, false);vk = true;break;
        case ek.VNIL:
            e.u.info = nilK(fs);vk = true;break;
        case ek.VKINT:
            e.u.info = luaK_intK(fs, e.u.ival);vk = true;break;
        case ek.VKFLT:
            e.u.info = luaK_numberK(fs, e.u.nval);vk = true;break;
        case ek.VK:
            vk = true;break;
        default:
            break;
    }

    if (vk) {
        e.k = ek.VK;
        if (e.u.info <= lopcodes.MAXINDEXRK) /* constant fits in 'argC'? */
            return lopcodes.RKASK(e.u.info);
    }

    /* not a constant in the right range: put it in a register */
    return luaK_exp2anyreg(fs, e);
};

/*
** Generate code to store result of expression 'ex' into variable 'var'.
*/
var luaK_storevar = function luaK_storevar(fs, vr, ex) {
    var ek = lparser.expkind;
    switch (vr.k) {
        case ek.VLOCAL:
            {
                freeexp(fs, ex);
                exp2reg(fs, ex, vr.u.info); /* compute 'ex' into proper place */
                return;
            }
        case ek.VUPVAL:
            {
                var e = luaK_exp2anyreg(fs, ex);
                luaK_codeABC(fs, OpCodesI.OP_SETUPVAL, e, vr.u.info, 0);
                break;
            }
        case ek.VINDEXED:
            {
                var op = vr.u.ind.vt === ek.VLOCAL ? OpCodesI.OP_SETTABLE : OpCodesI.OP_SETTABUP;
                var _e = luaK_exp2RK(fs, ex);
                luaK_codeABC(fs, op, vr.u.ind.t, vr.u.ind.idx, _e);
                break;
            }
    }
    freeexp(fs, ex);
};

/*
** Emit SELF instruction (convert expression 'e' into 'e:key(e,').
*/
var luaK_self = function luaK_self(fs, e, key) {
    luaK_exp2anyreg(fs, e);
    var ereg = e.u.info; /* register where 'e' was placed */
    freeexp(fs, e);
    e.u.info = fs.freereg; /* base register for op_self */
    e.k = lparser.expkind.VNONRELOC; /* self expression has a fixed register */
    luaK_reserveregs(fs, 2); /* function and 'self' produced by op_self */
    luaK_codeABC(fs, OpCodesI.OP_SELF, e.u.info, ereg, luaK_exp2RK(fs, key));
    freeexp(fs, key);
};

/*
** Negate condition 'e' (where 'e' is a comparison).
*/
var negatecondition = function negatecondition(fs, e) {
    var pc = getjumpcontrol(fs, e.u.info);
    lua_assert(lopcodes.testTMode(pc.opcode) && pc.opcode !== OpCodesI.OP_TESTSET && pc.opcode !== OpCodesI.OP_TEST);
    lopcodes.SETARG_A(pc, !pc.A);
};

/*
** Emit instruction to jump if 'e' is 'cond' (that is, if 'cond'
** is true, code will jump if 'e' is true.) Return jump position.
** Optimize when 'e' is 'not' something, inverting the condition
** and removing the 'not'.
*/
var jumponcond = function jumponcond(fs, e, cond) {
    if (e.k === lparser.expkind.VRELOCABLE) {
        var ie = getinstruction(fs, e);
        if (ie.opcode === OpCodesI.OP_NOT) {
            fs.pc--; /* remove previous OP_NOT */
            return condjump(fs, OpCodesI.OP_TEST, ie.B, 0, !cond);
        }
        /* else go through */
    }
    discharge2anyreg(fs, e);
    freeexp(fs, e);
    return condjump(fs, OpCodesI.OP_TESTSET, lopcodes.NO_REG, e.u.info, cond);
};

/*
** Emit code to go through if 'e' is true, jump otherwise.
*/
var luaK_goiftrue = function luaK_goiftrue(fs, e) {
    var ek = lparser.expkind;
    var pc = void 0; /* pc of new jump */
    luaK_dischargevars(fs, e);
    switch (e.k) {
        case ek.VJMP:
            {
                /* condition? */
                negatecondition(fs, e); /* jump when it is false */
                pc = e.u.info; /* save jump position */
                break;
            }
        case ek.VK:case ek.VKFLT:case ek.VKINT:case ek.VTRUE:
            {
                pc = NO_JUMP; /* always true; do nothing */
                break;
            }
        default:
            {
                pc = jumponcond(fs, e, 0); /* jump when false */
                break;
            }
    }
    e.f = luaK_concat(fs, e.f, pc); /* insert new jump in false list */
    luaK_patchtohere(fs, e.t); /* true list jumps to here (to go through) */
    e.t = NO_JUMP;
};

/*
** Emit code to go through if 'e' is false, jump otherwise.
*/
var luaK_goiffalse = function luaK_goiffalse(fs, e) {
    var ek = lparser.expkind;
    var pc = void 0; /* pc of new jump */
    luaK_dischargevars(fs, e);
    switch (e.k) {
        case ek.VJMP:
            {
                pc = e.u.info; /* already jump if true */
                break;
            }
        case ek.VNIL:case ek.VFALSE:
            {
                pc = NO_JUMP; /* always false; do nothing */
                break;
            }
        default:
            {
                pc = jumponcond(fs, e, 1); /* jump if true */
                break;
            }
    }
    e.t = luaK_concat(fs, e.t, pc); /* insert new jump in 't' list */
    luaK_patchtohere(fs, e.f); /* false list jumps to here (to go through) */
    e.f = NO_JUMP;
};

/*
** Code 'not e', doing constant folding.
*/
var codenot = function codenot(fs, e) {
    var ek = lparser.expkind;
    luaK_dischargevars(fs, e);
    switch (e.k) {
        case ek.VNIL:case ek.VFALSE:
            {
                e.k = ek.VTRUE; /* true === not nil === not false */
                break;
            }
        case ek.VK:case ek.VKFLT:case ek.VKINT:case ek.VTRUE:
            {
                e.k = ek.VFALSE; /* false === not "x" === not 0.5 === not 1 === not true */
                break;
            }
        case ek.VJMP:
            {
                negatecondition(fs, e);
                break;
            }
        case ek.VRELOCABLE:
        case ek.VNONRELOC:
            {
                discharge2anyreg(fs, e);
                freeexp(fs, e);
                e.u.info = luaK_codeABC(fs, OpCodesI.OP_NOT, 0, e.u.info, 0);
                e.k = ek.VRELOCABLE;
                break;
            }
    }
    /* interchange true and false lists */
    {
        var temp = e.f;e.f = e.t;e.t = temp;
    }
    removevalues(fs, e.f); /* values are useless when negated */
    removevalues(fs, e.t);
};

/*
** Create expression 't[k]'. 't' must have its final result already in a
** register or upvalue.
*/
var luaK_indexed = function luaK_indexed(fs, t, k) {
    var ek = lparser.expkind;
    lua_assert(!hasjumps(t) && (lparser.vkisinreg(t.k) || t.k === ek.VUPVAL));
    t.u.ind.t = t.u.info; /* register or upvalue index */
    t.u.ind.idx = luaK_exp2RK(fs, k); /* R/K index for key */
    t.u.ind.vt = t.k === ek.VUPVAL ? ek.VUPVAL : ek.VLOCAL;
    t.k = ek.VINDEXED;
};

/*
** Return false if folding can raise an error.
** Bitwise operations need operands convertible to integers; division
** operations cannot have 0 as divisor.
*/
var validop = function validop(op, v1, v2) {
    switch (op) {
        case LUA_OPBAND:case LUA_OPBOR:case LUA_OPBXOR:
        case LUA_OPSHL:case LUA_OPSHR:case LUA_OPBNOT:
            {
                /* conversion errors */
                return lvm.tointeger(v1) !== false && lvm.tointeger(v2) !== false;
            }
        case LUA_OPDIV:case LUA_OPIDIV:case LUA_OPMOD:
            /* division by 0 */
            return v2.value !== 0;
        default:
            return 1; /* everything else is valid */
    }
};

/*
** Try to "constant-fold" an operation; return 1 iff successful.
** (In this case, 'e1' has the final result.)
*/
var constfolding = function constfolding(op, e1, e2) {
    var ek = lparser.expkind;
    var v1 = void 0,
        v2 = void 0;
    if (!(v1 = tonumeral(e1, true)) || !(v2 = tonumeral(e2, true)) || !validop(op, v1, v2)) return 0; /* non-numeric operands or not safe to fold */
    var res = new TValue(); /* FIXME */
    lobject.luaO_arith(null, op, v1, v2, res); /* does operation */
    if (res.ttisinteger()) {
        e1.k = ek.VKINT;
        e1.u.ival = res.value;
    } else {
        /* folds neither NaN nor 0.0 (to avoid problems with -0.0) */
        var n = res.value;
        if (isNaN(n) || n === 0) return false;
        e1.k = ek.VKFLT;
        e1.u.nval = n;
    }
    return true;
};

/*
** Emit code for unary expressions that "produce values"
** (everything but 'not').
** Expression to produce final result will be encoded in 'e'.
*/
var codeunexpval = function codeunexpval(fs, op, e, line) {
    var r = luaK_exp2anyreg(fs, e); /* opcodes operate only on registers */
    freeexp(fs, e);
    e.u.info = luaK_codeABC(fs, op, 0, r, 0); /* generate opcode */
    e.k = lparser.expkind.VRELOCABLE; /* all those operations are relocatable */
    luaK_fixline(fs, line);
};

/*
** Emit code for binary expressions that "produce values"
** (everything but logical operators 'and'/'or' and comparison
** operators).
** Expression to produce final result will be encoded in 'e1'.
** Because 'luaK_exp2RK' can free registers, its calls must be
** in "stack order" (that is, first on 'e2', which may have more
** recent registers to be released).
*/
var codebinexpval = function codebinexpval(fs, op, e1, e2, line) {
    var rk2 = luaK_exp2RK(fs, e2); /* both operands are "RK" */
    var rk1 = luaK_exp2RK(fs, e1);
    freeexps(fs, e1, e2);
    e1.u.info = luaK_codeABC(fs, op, 0, rk1, rk2); /* generate opcode */
    e1.k = lparser.expkind.VRELOCABLE; /* all those operations are relocatable */
    luaK_fixline(fs, line);
};

/*
** Emit code for comparisons.
** 'e1' was already put in R/K form by 'luaK_infix'.
*/
var codecomp = function codecomp(fs, opr, e1, e2) {
    var ek = lparser.expkind;

    var rk1 = void 0;
    if (e1.k === ek.VK) rk1 = lopcodes.RKASK(e1.u.info);else {
        lua_assert(e1.k === ek.VNONRELOC);
        rk1 = e1.u.info;
    }

    var rk2 = luaK_exp2RK(fs, e2);
    freeexps(fs, e1, e2);
    switch (opr) {
        case BinOpr.OPR_NE:
            {
                /* '(a ~= b)' ==> 'not (a === b)' */
                e1.u.info = condjump(fs, OpCodesI.OP_EQ, 0, rk1, rk2);
                break;
            }
        case BinOpr.OPR_GT:case BinOpr.OPR_GE:
            {
                /* '(a > b)' ==> '(b < a)';  '(a >= b)' ==> '(b <= a)' */
                var op = opr - BinOpr.OPR_NE + OpCodesI.OP_EQ;
                e1.u.info = condjump(fs, op, 1, rk2, rk1); /* invert operands */
                break;
            }
        default:
            {
                /* '==', '<', '<=' use their own opcodes */
                var _op = opr - BinOpr.OPR_EQ + OpCodesI.OP_EQ;
                e1.u.info = condjump(fs, _op, 1, rk1, rk2);
                break;
            }
    }
    e1.k = ek.VJMP;
};

/*
** Apply prefix operation 'op' to expression 'e'.
*/
var luaK_prefix = function luaK_prefix(fs, op, e, line) {
    var ef = new lparser.expdesc();
    ef.k = lparser.expkind.VKINT;
    ef.u.ival = ef.u.nval = ef.u.info = 0;
    ef.t = NO_JUMP;
    ef.f = NO_JUMP;
    switch (op) {
        case UnOpr.OPR_MINUS:case UnOpr.OPR_BNOT:
            /* use 'ef' as fake 2nd operand */
            if (constfolding(op + LUA_OPUNM, e, ef)) break;
        /* FALLTHROUGH */
        case UnOpr.OPR_LEN:
            codeunexpval(fs, op + OpCodesI.OP_UNM, e, line);
            break;
        case UnOpr.OPR_NOT:
            codenot(fs, e);break;
    }
};

/*
** Process 1st operand 'v' of binary operation 'op' before reading
** 2nd operand.
*/
var luaK_infix = function luaK_infix(fs, op, v) {
    switch (op) {
        case BinOpr.OPR_AND:
            {
                luaK_goiftrue(fs, v); /* go ahead only if 'v' is true */
                break;
            }
        case BinOpr.OPR_OR:
            {
                luaK_goiffalse(fs, v); /* go ahead only if 'v' is false */
                break;
            }
        case BinOpr.OPR_CONCAT:
            {
                luaK_exp2nextreg(fs, v); /* operand must be on the 'stack' */
                break;
            }
        case BinOpr.OPR_ADD:case BinOpr.OPR_SUB:
        case BinOpr.OPR_MUL:case BinOpr.OPR_DIV:case BinOpr.OPR_IDIV:
        case BinOpr.OPR_MOD:case BinOpr.OPR_POW:
        case BinOpr.OPR_BAND:case BinOpr.OPR_BOR:case BinOpr.OPR_BXOR:
        case BinOpr.OPR_SHL:case BinOpr.OPR_SHR:
            {
                if (!tonumeral(v, false)) luaK_exp2RK(fs, v);
                /* else keep numeral, which may be folded with 2nd operand */
                break;
            }
        default:
            {
                luaK_exp2RK(fs, v);
                break;
            }
    }
};

/*
** Finalize code for binary operation, after reading 2nd operand.
** For '(a .. b .. c)' (which is '(a .. (b .. c))', because
** concatenation is right associative), merge second CONCAT into first
** one.
*/
var luaK_posfix = function luaK_posfix(fs, op, e1, e2, line) {
    var ek = lparser.expkind;
    switch (op) {
        case BinOpr.OPR_AND:
            {
                lua_assert(e1.t === NO_JUMP); /* list closed by 'luK_infix' */
                luaK_dischargevars(fs, e2);
                e2.f = luaK_concat(fs, e2.f, e1.f);
                e1.to(e2);
                break;
            }
        case BinOpr.OPR_OR:
            {
                lua_assert(e1.f === NO_JUMP); /* list closed by 'luK_infix' */
                luaK_dischargevars(fs, e2);
                e2.t = luaK_concat(fs, e2.t, e1.t);
                e1.to(e2);
                break;
            }
        case BinOpr.OPR_CONCAT:
            {
                luaK_exp2val(fs, e2);
                var ins = getinstruction(fs, e2);
                if (e2.k === ek.VRELOCABLE && ins.opcode === OpCodesI.OP_CONCAT) {
                    lua_assert(e1.u.info === ins.B - 1);
                    freeexp(fs, e1);
                    lopcodes.SETARG_B(ins, e1.u.info);
                    e1.k = ek.VRELOCABLE;e1.u.info = e2.u.info;
                } else {
                    luaK_exp2nextreg(fs, e2); /* operand must be on the 'stack' */
                    codebinexpval(fs, OpCodesI.OP_CONCAT, e1, e2, line);
                }
                break;
            }
        case BinOpr.OPR_ADD:case BinOpr.OPR_SUB:case BinOpr.OPR_MUL:case BinOpr.OPR_DIV:
        case BinOpr.OPR_IDIV:case BinOpr.OPR_MOD:case BinOpr.OPR_POW:
        case BinOpr.OPR_BAND:case BinOpr.OPR_BOR:case BinOpr.OPR_BXOR:
        case BinOpr.OPR_SHL:case BinOpr.OPR_SHR:
            {
                if (!constfolding(op + LUA_OPADD, e1, e2)) codebinexpval(fs, op + OpCodesI.OP_ADD, e1, e2, line);
                break;
            }
        case BinOpr.OPR_EQ:case BinOpr.OPR_LT:case BinOpr.OPR_LE:
        case BinOpr.OPR_NE:case BinOpr.OPR_GT:case BinOpr.OPR_GE:
            {
                codecomp(fs, op, e1, e2);
                break;
            }
    }

    return e1;
};

/*
** Change line information associated with current position.
*/
var luaK_fixline = function luaK_fixline(fs, line) {
    fs.f.lineinfo[fs.pc - 1] = line;
};

/*
** Emit a SETLIST instruction.
** 'base' is register that keeps table;
** 'nelems' is #table plus those to be stored now;
** 'tostore' is number of values (in registers 'base + 1',...) to add to
** table (or LUA_MULTRET to add up to stack top).
*/
var luaK_setlist = function luaK_setlist(fs, base, nelems, tostore) {
    var c = (nelems - 1) / lopcodes.LFIELDS_PER_FLUSH + 1;
    var b = tostore === LUA_MULTRET ? 0 : tostore;
    lua_assert(tostore !== 0 && tostore <= lopcodes.LFIELDS_PER_FLUSH);
    if (c <= lopcodes.MAXARG_C) luaK_codeABC(fs, OpCodesI.OP_SETLIST, base, b, c);else if (c <= lopcodes.MAXARG_Ax) {
        luaK_codeABC(fs, OpCodesI.OP_SETLIST, base, b, 0);
        codeextraarg(fs, c);
    } else llex.luaX_syntaxerror(fs.ls, to_luastring("constructor too long", true));
    fs.freereg = base + 1; /* free registers with list values */
};

module.exports.BinOpr = BinOpr;
module.exports.NO_JUMP = NO_JUMP;
module.exports.UnOpr = UnOpr;
module.exports.getinstruction = getinstruction;
module.exports.luaK_checkstack = luaK_checkstack;
module.exports.luaK_code = luaK_code;
module.exports.luaK_codeABC = luaK_codeABC;
module.exports.luaK_codeABx = luaK_codeABx;
module.exports.luaK_codeAsBx = luaK_codeAsBx;
module.exports.luaK_codek = luaK_codek;
module.exports.luaK_concat = luaK_concat;
module.exports.luaK_dischargevars = luaK_dischargevars;
module.exports.luaK_exp2RK = luaK_exp2RK;
module.exports.luaK_exp2anyreg = luaK_exp2anyreg;
module.exports.luaK_exp2anyregup = luaK_exp2anyregup;
module.exports.luaK_exp2nextreg = luaK_exp2nextreg;
module.exports.luaK_exp2val = luaK_exp2val;
module.exports.luaK_fixline = luaK_fixline;
module.exports.luaK_getlabel = luaK_getlabel;
module.exports.luaK_goiffalse = luaK_goiffalse;
module.exports.luaK_goiftrue = luaK_goiftrue;
module.exports.luaK_indexed = luaK_indexed;
module.exports.luaK_infix = luaK_infix;
module.exports.luaK_intK = luaK_intK;
module.exports.luaK_jump = luaK_jump;
module.exports.luaK_jumpto = luaK_jumpto;
module.exports.luaK_nil = luaK_nil;
module.exports.luaK_numberK = luaK_numberK;
module.exports.luaK_patchclose = luaK_patchclose;
module.exports.luaK_patchlist = luaK_patchlist;
module.exports.luaK_patchtohere = luaK_patchtohere;
module.exports.luaK_posfix = luaK_posfix;
module.exports.luaK_prefix = luaK_prefix;
module.exports.luaK_reserveregs = luaK_reserveregs;
module.exports.luaK_ret = luaK_ret;
module.exports.luaK_self = luaK_self;
module.exports.luaK_setlist = luaK_setlist;
module.exports.luaK_setmultret = luaK_setmultret;
module.exports.luaK_setoneret = luaK_setoneret;
module.exports.luaK_setreturns = luaK_setreturns;
module.exports.luaK_storevar = luaK_storevar;
module.exports.luaK_stringK = luaK_stringK;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_SIGNATURE = _require.LUA_SIGNATURE,
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    LUA_ERRSYNTAX = _require.thread_status.LUA_ERRSYNTAX,
    is_luastring = _require.is_luastring,
    luastring_eq = _require.luastring_eq,
    to_luastring = _require.to_luastring;

var ldo = __webpack_require__(7);
var lfunc = __webpack_require__(12);
var lobject = __webpack_require__(5);

var _require2 = __webpack_require__(15),
    MAXARG_sBx = _require2.MAXARG_sBx,
    POS_A = _require2.POS_A,
    POS_Ax = _require2.POS_Ax,
    POS_B = _require2.POS_B,
    POS_Bx = _require2.POS_Bx,
    POS_C = _require2.POS_C,
    POS_OP = _require2.POS_OP,
    SIZE_A = _require2.SIZE_A,
    SIZE_Ax = _require2.SIZE_Ax,
    SIZE_B = _require2.SIZE_B,
    SIZE_Bx = _require2.SIZE_Bx,
    SIZE_C = _require2.SIZE_C,
    SIZE_OP = _require2.SIZE_OP;

var _require3 = __webpack_require__(2),
    lua_assert = _require3.lua_assert;

var _require4 = __webpack_require__(9),
    luaS_bless = _require4.luaS_bless;

var _require5 = __webpack_require__(18),
    luaZ_read = _require5.luaZ_read,
    ZIO = _require5.ZIO;

var LUAC_DATA = [0x19, 0x93, 13, 10, 0x1a, 10];

var BytecodeParser = function () {
    function BytecodeParser(L, Z, name) {
        _classCallCheck(this, BytecodeParser);

        this.intSize = 4;
        this.size_tSize = 4;
        this.instructionSize = 4;
        this.integerSize = 4;
        this.numberSize = 8;

        lua_assert(Z instanceof ZIO, "BytecodeParser only operates on a ZIO");
        lua_assert(is_luastring(name));

        if (name[0] === 64 /* ('@').charCodeAt(0) */ || name[0] === 61 /* ('=').charCodeAt(0) */) this.name = name.subarray(1);else if (name[0] == LUA_SIGNATURE[0]) this.name = to_luastring("binary string", true);else this.name = name;

        this.L = L;
        this.Z = Z;

        // Used to do buffer to number conversions
        this.arraybuffer = new ArrayBuffer(Math.max(this.intSize, this.size_tSize, this.instructionSize, this.integerSize, this.numberSize));
        this.dv = new DataView(this.arraybuffer);
        this.u8 = new Uint8Array(this.arraybuffer);
    }

    _createClass(BytecodeParser, [{
        key: 'read',
        value: function read(size) {
            var u8 = new Uint8Array(size);
            if (luaZ_read(this.Z, u8, 0, size) !== 0) this.error("truncated");
            return u8;
        }
    }, {
        key: 'readByte',
        value: function readByte() {
            if (luaZ_read(this.Z, this.u8, 0, 1) !== 0) this.error("truncated");
            return this.u8[0];
        }
    }, {
        key: 'readInteger',
        value: function readInteger() {
            if (luaZ_read(this.Z, this.u8, 0, this.integerSize) !== 0) this.error("truncated");
            return this.dv.getInt32(0, true);
        }
    }, {
        key: 'readSize_t',
        value: function readSize_t() {
            return this.readInteger();
        }
    }, {
        key: 'readInt',
        value: function readInt() {
            if (luaZ_read(this.Z, this.u8, 0, this.intSize) !== 0) this.error("truncated");
            return this.dv.getInt32(0, true);
        }
    }, {
        key: 'readNumber',
        value: function readNumber() {
            if (luaZ_read(this.Z, this.u8, 0, this.numberSize) !== 0) this.error("truncated");
            return this.dv.getFloat64(0, true);
        }
    }, {
        key: 'readString',
        value: function readString() {
            var size = Math.max(this.readByte() - 1, 0);

            if (size + 1 === 0xFF) size = this.readSize_t() - 1;

            if (size === 0) {
                return null;
            }

            return luaS_bless(this.L, this.read(size));
        }

        /* creates a mask with 'n' 1 bits at position 'p' */

    }, {
        key: 'readInstruction',
        value: function readInstruction() {
            if (luaZ_read(this.Z, this.u8, 0, this.instructionSize) !== 0) this.error("truncated");
            return this.dv.getUint32(0, true);
        }
    }, {
        key: 'readCode',
        value: function readCode(f) {
            var n = this.readInt();
            var p = BytecodeParser;

            for (var i = 0; i < n; i++) {
                var ins = this.readInstruction();
                f.code[i] = {
                    code: ins,
                    opcode: ins >> POS_OP & p.MASK1(SIZE_OP, 0),
                    A: ins >> POS_A & p.MASK1(SIZE_A, 0),
                    B: ins >> POS_B & p.MASK1(SIZE_B, 0),
                    C: ins >> POS_C & p.MASK1(SIZE_C, 0),
                    Bx: ins >> POS_Bx & p.MASK1(SIZE_Bx, 0),
                    Ax: ins >> POS_Ax & p.MASK1(SIZE_Ax, 0),
                    sBx: (ins >> POS_Bx & p.MASK1(SIZE_Bx, 0)) - MAXARG_sBx
                };
            }
        }
    }, {
        key: 'readUpvalues',
        value: function readUpvalues(f) {
            var n = this.readInt();

            for (var i = 0; i < n; i++) {
                f.upvalues[i] = {
                    name: null,
                    instack: this.readByte(),
                    idx: this.readByte()
                };
            }
        }
    }, {
        key: 'readConstants',
        value: function readConstants(f) {
            var n = this.readInt();

            for (var i = 0; i < n; i++) {
                var t = this.readByte();

                switch (t) {
                    case LUA_TNIL:
                        f.k.push(new lobject.TValue(LUA_TNIL, null));
                        break;
                    case LUA_TBOOLEAN:
                        f.k.push(new lobject.TValue(LUA_TBOOLEAN, this.readByte() !== 0));
                        break;
                    case LUA_TNUMFLT:
                        f.k.push(new lobject.TValue(LUA_TNUMFLT, this.readNumber()));
                        break;
                    case LUA_TNUMINT:
                        f.k.push(new lobject.TValue(LUA_TNUMINT, this.readInteger()));
                        break;
                    case LUA_TSHRSTR:
                    case LUA_TLNGSTR:
                        f.k.push(new lobject.TValue(LUA_TLNGSTR, this.readString()));
                        break;
                    default:
                        this.error('unrecognized constant \'' + t + '\'');
                }
            }
        }
    }, {
        key: 'readProtos',
        value: function readProtos(f) {
            var n = this.readInt();

            for (var i = 0; i < n; i++) {
                f.p[i] = new lfunc.Proto(this.L);
                this.readFunction(f.p[i], f.source);
            }
        }
    }, {
        key: 'readDebug',
        value: function readDebug(f) {
            var n = this.readInt();
            for (var i = 0; i < n; i++) {
                f.lineinfo[i] = this.readInt();
            }n = this.readInt();
            for (var _i = 0; _i < n; _i++) {
                f.locvars[_i] = {
                    varname: this.readString(),
                    startpc: this.readInt(),
                    endpc: this.readInt()
                };
            }

            n = this.readInt();
            for (var _i2 = 0; _i2 < n; _i2++) {
                f.upvalues[_i2].name = this.readString();
            }
        }
    }, {
        key: 'readFunction',
        value: function readFunction(f, psource) {
            f.source = this.readString();
            if (f.source === null) /* no source in dump? */
                f.source = psource; /* reuse parent's source */
            f.linedefined = this.readInt();
            f.lastlinedefined = this.readInt();
            f.numparams = this.readByte();
            f.is_vararg = this.readByte() !== 0;
            f.maxstacksize = this.readByte();
            this.readCode(f);
            this.readConstants(f);
            this.readUpvalues(f);
            this.readProtos(f);
            this.readDebug(f);
        }
    }, {
        key: 'checkliteral',
        value: function checkliteral(s, msg) {
            var buff = this.read(s.length);
            if (!luastring_eq(buff, s)) this.error(msg);
        }
    }, {
        key: 'checkHeader',
        value: function checkHeader() {
            this.checkliteral(LUA_SIGNATURE.subarray(1), "not a"); /* 1st char already checked */

            if (this.readByte() !== 0x53) this.error("version mismatch in");

            if (this.readByte() !== 0) this.error("format mismatch in");

            this.checkliteral(LUAC_DATA, "corrupted");

            this.intSize = this.readByte();
            this.size_tSize = this.readByte();
            this.instructionSize = this.readByte();
            this.integerSize = this.readByte();
            this.numberSize = this.readByte();

            this.checksize(this.intSize, 4, "int");
            this.checksize(this.size_tSize, 4, "size_t");
            this.checksize(this.instructionSize, 4, "instruction");
            this.checksize(this.integerSize, 4, "integer");
            this.checksize(this.numberSize, 8, "number");

            if (this.readInteger() !== 0x5678) this.error("endianness mismatch in");

            if (this.readNumber() !== 370.5) this.error("float format mismatch in");
        }
    }, {
        key: 'error',
        value: function error(why) {
            lobject.luaO_pushfstring(this.L, to_luastring("%s: %s precompiled chunk"), this.name, to_luastring(why));
            ldo.luaD_throw(this.L, LUA_ERRSYNTAX);
        }
    }, {
        key: 'checksize',
        value: function checksize(byte, size, tname) {
            if (byte !== size) this.error(tname + ' size mismatch in');
        }
    }], [{
        key: 'MASK1',
        value: function MASK1(n, p) {
            return ~(~0 << n) << p;
        }

        /* creates a mask with 'n' 0 bits at position 'p' */

    }, {
        key: 'MASK0',
        value: function MASK0(n, p) {
            return ~BytecodeParser.MASK1(n, p);
        }
    }]);

    return BytecodeParser;
}();

var luaU_undump = function luaU_undump(L, Z, name) {
    var S = new BytecodeParser(L, Z, name);
    S.checkHeader();
    var cl = lfunc.luaF_newLclosure(L, S.readByte());
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].setclLvalue(cl);
    cl.p = new lfunc.Proto(L);
    S.readFunction(cl.p, null);
    lua_assert(cl.nupvalues === cl.p.upvalues.length);
    /* luai_verifycode */
    return cl;
};

module.exports.luaU_undump = luaU_undump;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0),
    LUA_SIGNATURE = _require.LUA_SIGNATURE,
    LUA_VERSION_MAJOR = _require.LUA_VERSION_MAJOR,
    LUA_VERSION_MINOR = _require.LUA_VERSION_MINOR,
    _require$constant_typ = _require.constant_types,
    LUA_TBOOLEAN = _require$constant_typ.LUA_TBOOLEAN,
    LUA_TLNGSTR = _require$constant_typ.LUA_TLNGSTR,
    LUA_TNIL = _require$constant_typ.LUA_TNIL,
    LUA_TNUMFLT = _require$constant_typ.LUA_TNUMFLT,
    LUA_TNUMINT = _require$constant_typ.LUA_TNUMINT,
    LUA_TSHRSTR = _require$constant_typ.LUA_TSHRSTR,
    luastring_of = _require.luastring_of;

var LUAC_DATA = luastring_of(25, 147, 13, 10, 26, 10);
var LUAC_INT = 0x5678;
var LUAC_NUM = 370.5;
var LUAC_VERSION = Number(LUA_VERSION_MAJOR) * 16 + Number(LUA_VERSION_MINOR);
var LUAC_FORMAT = 0; /* this is the official format */

var DumpState = function DumpState() {
    _classCallCheck(this, DumpState);

    this.L = null;
    this.write = null;
    this.data = null;
    this.strip = NaN;
    this.status = NaN;
};

var DumpBlock = function DumpBlock(b, size, D) {
    if (D.status === 0 && size > 0) D.status = D.writer(D.L, b, size, D.data);
};

var DumpByte = function DumpByte(y, D) {
    DumpBlock(luastring_of(y), 1, D);
};

var DumpInt = function DumpInt(x, D) {
    var ab = new ArrayBuffer(4);
    var dv = new DataView(ab);
    dv.setInt32(0, x, true);
    var t = new Uint8Array(ab);
    DumpBlock(t, 4, D);
};

var DumpInteger = function DumpInteger(x, D) {
    var ab = new ArrayBuffer(4);
    var dv = new DataView(ab);
    dv.setInt32(0, x, true);
    var t = new Uint8Array(ab);
    DumpBlock(t, 4, D);
};

var DumpNumber = function DumpNumber(x, D) {
    var ab = new ArrayBuffer(8);
    var dv = new DataView(ab);
    dv.setFloat64(0, x, true);
    var t = new Uint8Array(ab);
    DumpBlock(t, 8, D);
};

var DumpString = function DumpString(s, D) {
    if (s === null) DumpByte(0, D);else {
        var size = s.tsslen() + 1;
        var str = s.getstr();
        if (size < 0xFF) DumpByte(size, D);else {
            DumpByte(0xFF, D);
            DumpInteger(size, D);
        }
        DumpBlock(str, size - 1, D); /* no need to save '\0' */
    }
};

var DumpCode = function DumpCode(f, D) {
    var s = f.code.map(function (e) {
        return e.code;
    });
    DumpInt(s.length, D);

    for (var i = 0; i < s.length; i++) {
        DumpInt(s[i], D);
    }
};

var DumpConstants = function DumpConstants(f, D) {
    var n = f.k.length;
    DumpInt(n, D);
    for (var i = 0; i < n; i++) {
        var o = f.k[i];
        DumpByte(o.ttype(), D);
        switch (o.ttype()) {
            case LUA_TNIL:
                break;
            case LUA_TBOOLEAN:
                DumpByte(o.value ? 1 : 0, D);
                break;
            case LUA_TNUMFLT:
                DumpNumber(o.value, D);
                break;
            case LUA_TNUMINT:
                DumpInteger(o.value, D);
                break;
            case LUA_TSHRSTR:
            case LUA_TLNGSTR:
                DumpString(o.tsvalue(), D);
                break;
        }
    }
};

var DumpProtos = function DumpProtos(f, D) {
    var n = f.p.length;
    DumpInt(n, D);
    for (var i = 0; i < n; i++) {
        DumpFunction(f.p[i], f.source, D);
    }
};

var DumpUpvalues = function DumpUpvalues(f, D) {
    var n = f.upvalues.length;
    DumpInt(n, D);
    for (var i = 0; i < n; i++) {
        DumpByte(f.upvalues[i].instack ? 1 : 0, D);
        DumpByte(f.upvalues[i].idx, D);
    }
};

var DumpDebug = function DumpDebug(f, D) {
    var n = D.strip ? 0 : f.lineinfo.length;
    DumpInt(n, D);
    for (var i = 0; i < n; i++) {
        DumpInt(f.lineinfo[i], D);
    }n = D.strip ? 0 : f.locvars.length;
    DumpInt(n, D);
    for (var _i = 0; _i < n; _i++) {
        DumpString(f.locvars[_i].varname, D);
        DumpInt(f.locvars[_i].startpc, D);
        DumpInt(f.locvars[_i].endpc, D);
    }
    n = D.strip ? 0 : f.upvalues.length;
    DumpInt(n, D);
    for (var _i2 = 0; _i2 < n; _i2++) {
        DumpString(f.upvalues[_i2].name, D);
    }
};

var DumpFunction = function DumpFunction(f, psource, D) {
    if (D.strip || f.source === psource) DumpString(null, D); /* no debug info or same source as its parent */
    else DumpString(f.source, D);
    DumpInt(f.linedefined, D);
    DumpInt(f.lastlinedefined, D);
    DumpByte(f.numparams, D);
    DumpByte(f.is_vararg ? 1 : 0, D);
    DumpByte(f.maxstacksize, D);
    DumpCode(f, D);
    DumpConstants(f, D);
    DumpUpvalues(f, D);
    DumpProtos(f, D);
    DumpDebug(f, D);
};

var DumpHeader = function DumpHeader(D) {
    DumpBlock(LUA_SIGNATURE, LUA_SIGNATURE.length, D);
    DumpByte(LUAC_VERSION, D);
    DumpByte(LUAC_FORMAT, D);
    DumpBlock(LUAC_DATA, LUAC_DATA.length, D);
    DumpByte(4, D); // intSize
    DumpByte(4, D); // size_tSize
    DumpByte(4, D); // instructionSize
    DumpByte(4, D); // integerSize
    DumpByte(8, D); // numberSize
    DumpInteger(LUAC_INT, D);
    DumpNumber(LUAC_NUM, D);
};

/*
** dump Lua function as precompiled chunk
*/
var luaU_dump = function luaU_dump(L, f, w, data, strip) {
    var D = new DumpState();
    D.L = L;
    D.writer = w;
    D.data = data;
    D.strip = strip;
    D.status = 0;
    DumpHeader(D);
    DumpByte(f.upvalues.length, D);
    DumpFunction(f, null, D);
    return D.status;
};

module.exports.luaU_dump = luaU_dump;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
// strftime
// github.com/samsonjs/strftime
// @_sjs
//
// Copyright 2010 - 2016 Sami Samhuri <sami@samhuri.net>
//
// MIT License
// http://sjs.mit-license.org
//

;(function () {

    var Locales = {
        de_DE: {
            days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d.%m.%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        en_CA: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            ordinalSuffixes: ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d/%m/%y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%r',
                x: '%D'
            }
        },

        en_US: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            ordinalSuffixes: ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%m/%d/%y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%r',
                x: '%D'
            }
        },

        es_MX: {
            days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', ' diciembre'],
            shortMonths: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d/%m/%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        fr_FR: {
            days: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
            shortDays: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            shortMonths: ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d/%m/%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        it_IT: {
            days: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
            shortDays: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
            months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
            shortMonths: ['pr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d/%m/%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        nl_NL: {
            days: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
            shortDays: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
            months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
            shortMonths: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d-%m-%y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        pt_BR: {
            days: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
            shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
            shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d-%m-%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        ru_RU: {
            days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            shortDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
            AM: 'AM',
            PM: 'PM',
            am: 'am',
            pm: 'pm',
            formats: {
                c: '%a %d %b %Y %X',
                D: '%d.%m.%y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        tr_TR: {
            days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            shortDays: ['Paz', 'Pzt', 'Sal', 'Çrş', 'Prş', 'Cum', 'Cts'],
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            AM: 'ÖÖ',
            PM: 'ÖS',
            am: 'ÖÖ',
            pm: 'ÖS',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d-%m-%Y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%T',
                x: '%D'
            }
        },

        // By michaeljayt<michaeljayt@gmail.com>
        // https://github.com/michaeljayt/strftime/commit/bcb4c12743811d51e568175aa7bff3fd2a77cef3
        zh_CN: {
            days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            shortDays: ['日', '一', '二', '三', '四', '五', '六'],
            months: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'],
            shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            AM: '上午',
            PM: '下午',
            am: '上午',
            pm: '下午',
            formats: {
                c: '%a %d %b %Y %X %Z',
                D: '%d/%m/%y',
                F: '%Y-%m-%d',
                R: '%H:%M',
                r: '%I:%M:%S %p',
                T: '%H:%M:%S',
                v: '%e-%b-%Y',
                X: '%r',
                x: '%D'
            }
        }
    };

    var DefaultLocale = Locales['en_US'],
        defaultStrftime = new Strftime(DefaultLocale, 0, false),
        isCommonJS = typeof module !== 'undefined',
        namespace;

    // CommonJS / Node module
    if (isCommonJS) {
        namespace = module.exports = defaultStrftime;
    }
    // Browsers and other environments
    else {
            // Get the global object. Works in ES3, ES5, and ES5 strict mode.
            namespace = function () {
                return this || (1, eval)('this');
            }();
            namespace.strftime = defaultStrftime;
        }

    // Polyfill Date.now for old browsers.
    if (typeof Date.now !== 'function') {
        Date.now = function () {
            return +new Date();
        };
    }

    function Strftime(locale, customTimezoneOffset, useUtcTimezone) {
        var _locale = locale || DefaultLocale,
            _customTimezoneOffset = customTimezoneOffset || 0,
            _useUtcBasedDate = useUtcTimezone || false,


        // we store unix timestamp value here to not create new Date() each iteration (each millisecond)
        // Date.now() is 2 times faster than new Date()
        // while millisecond precise is enough here
        // this could be very helpful when strftime triggered a lot of times one by one
        _cachedDateTimestamp = 0,
            _cachedDate;

        function _strftime(format, date) {
            var timestamp;

            if (!date) {
                var currentTimestamp = Date.now();
                if (currentTimestamp > _cachedDateTimestamp) {
                    _cachedDateTimestamp = currentTimestamp;
                    _cachedDate = new Date(_cachedDateTimestamp);

                    timestamp = _cachedDateTimestamp;

                    if (_useUtcBasedDate) {
                        // how to avoid duplication of date instantiation for utc here?
                        // we tied to getTimezoneOffset of the current date
                        _cachedDate = new Date(_cachedDateTimestamp + getTimestampToUtcOffsetFor(_cachedDate) + _customTimezoneOffset);
                    }
                } else {
                    timestamp = _cachedDateTimestamp;
                }
                date = _cachedDate;
            } else {
                timestamp = date.getTime();

                if (_useUtcBasedDate) {
                    var utcOffset = getTimestampToUtcOffsetFor(date);
                    date = new Date(timestamp + utcOffset + _customTimezoneOffset);
                    // If we've crossed a DST boundary with this calculation we need to
                    // adjust the new date accordingly or it will be off by an hour in UTC.
                    if (getTimestampToUtcOffsetFor(date) !== utcOffset) {
                        var newUTCOffset = getTimestampToUtcOffsetFor(date);
                        date = new Date(timestamp + newUTCOffset + _customTimezoneOffset);
                    }
                }
            }

            return _processFormat(format, date, _locale, timestamp);
        }

        function _processFormat(format, date, locale, timestamp) {
            var resultString = '',
                padding = null,
                isInScope = false,
                length = format.length,
                extendedTZ = false;

            for (var i = 0; i < length; i++) {

                var currentCharCode = format.charCodeAt(i);

                if (isInScope === true) {
                    // '-'
                    if (currentCharCode === 45) {
                        padding = '';
                        continue;
                    }
                    // '_'
                    else if (currentCharCode === 95) {
                            padding = ' ';
                            continue;
                        }
                        // '0'
                        else if (currentCharCode === 48) {
                                padding = '0';
                                continue;
                            }
                            // ':'
                            else if (currentCharCode === 58) {
                                    if (extendedTZ) {
                                        warn("[WARNING] detected use of unsupported %:: or %::: modifiers to strftime");
                                    }
                                    extendedTZ = true;
                                    continue;
                                }

                    switch (currentCharCode) {

                        // Examples for new Date(0) in GMT

                        // '%'
                        // case '%':
                        case 37:
                            resultString += '%';
                            break;

                        // 'Thursday'
                        // case 'A':
                        case 65:
                            resultString += locale.days[date.getDay()];
                            break;

                        // 'January'
                        // case 'B':
                        case 66:
                            resultString += locale.months[date.getMonth()];
                            break;

                        // '19'
                        // case 'C':
                        case 67:
                            resultString += padTill2(Math.floor(date.getFullYear() / 100), padding);
                            break;

                        // '01/01/70'
                        // case 'D':
                        case 68:
                            resultString += _processFormat(locale.formats.D, date, locale, timestamp);
                            break;

                        // '1970-01-01'
                        // case 'F':
                        case 70:
                            resultString += _processFormat(locale.formats.F, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'H':
                        case 72:
                            resultString += padTill2(date.getHours(), padding);
                            break;

                        // '12'
                        // case 'I':
                        case 73:
                            resultString += padTill2(hours12(date.getHours()), padding);
                            break;

                        // '000'
                        // case 'L':
                        case 76:
                            resultString += padTill3(Math.floor(timestamp % 1000));
                            break;

                        // '00'
                        // case 'M':
                        case 77:
                            resultString += padTill2(date.getMinutes(), padding);
                            break;

                        // 'am'
                        // case 'P':
                        case 80:
                            resultString += date.getHours() < 12 ? locale.am : locale.pm;
                            break;

                        // '00:00'
                        // case 'R':
                        case 82:
                            resultString += _processFormat(locale.formats.R, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'S':
                        case 83:
                            resultString += padTill2(date.getSeconds(), padding);
                            break;

                        // '00:00:00'
                        // case 'T':
                        case 84:
                            resultString += _processFormat(locale.formats.T, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'U':
                        case 85:
                            resultString += padTill2(weekNumber(date, 'sunday'), padding);
                            break;

                        // '00'
                        // case 'W':
                        case 87:
                            resultString += padTill2(weekNumber(date, 'monday'), padding);
                            break;

                        // '16:00:00'
                        // case 'X':
                        case 88:
                            resultString += _processFormat(locale.formats.X, date, locale, timestamp);
                            break;

                        // '1970'
                        // case 'Y':
                        case 89:
                            resultString += date.getFullYear();
                            break;

                        // 'GMT'
                        // case 'Z':
                        case 90:
                            if (_useUtcBasedDate && _customTimezoneOffset === 0) {
                                resultString += "GMT";
                            } else {
                                // fixme optimize
                                var tzString = date.toString().match(/\(([\w\s]+)\)/);
                                resultString += tzString && tzString[1] || '';
                            }
                            break;

                        // 'Thu'
                        // case 'a':
                        case 97:
                            resultString += locale.shortDays[date.getDay()];
                            break;

                        // 'Jan'
                        // case 'b':
                        case 98:
                            resultString += locale.shortMonths[date.getMonth()];
                            break;

                        // ''
                        // case 'c':
                        case 99:
                            resultString += _processFormat(locale.formats.c, date, locale, timestamp);
                            break;

                        // '01'
                        // case 'd':
                        case 100:
                            resultString += padTill2(date.getDate(), padding);
                            break;

                        // ' 1'
                        // case 'e':
                        case 101:
                            resultString += padTill2(date.getDate(), padding == null ? ' ' : padding);
                            break;

                        // 'Jan'
                        // case 'h':
                        case 104:
                            resultString += locale.shortMonths[date.getMonth()];
                            break;

                        // '000'
                        // case 'j':
                        case 106:
                            var y = new Date(date.getFullYear(), 0, 1);
                            var day = Math.ceil((date.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
                            resultString += padTill3(day);
                            break;

                        // ' 0'
                        // case 'k':
                        case 107:
                            resultString += padTill2(date.getHours(), padding == null ? ' ' : padding);
                            break;

                        // '12'
                        // case 'l':
                        case 108:
                            resultString += padTill2(hours12(date.getHours()), padding == null ? ' ' : padding);
                            break;

                        // '01'
                        // case 'm':
                        case 109:
                            resultString += padTill2(date.getMonth() + 1, padding);
                            break;

                        // '\n'
                        // case 'n':
                        case 110:
                            resultString += '\n';
                            break;

                        // '1st'
                        // case 'o':
                        case 111:
                            // Try to use an ordinal suffix from the locale, but fall back to using the old
                            // function for compatibility with old locales that lack them.
                            var day = date.getDate();
                            if (locale.ordinalSuffixes) {
                                resultString += String(day) + (locale.ordinalSuffixes[day - 1] || ordinal(day));
                            } else {
                                resultString += String(day) + ordinal(day);
                            }
                            break;

                        // 'AM'
                        // case 'p':
                        case 112:
                            resultString += date.getHours() < 12 ? locale.AM : locale.PM;
                            break;

                        // '12:00:00 AM'
                        // case 'r':
                        case 114:
                            resultString += _processFormat(locale.formats.r, date, locale, timestamp);
                            break;

                        // '0'
                        // case 's':
                        case 115:
                            resultString += Math.floor(timestamp / 1000);
                            break;

                        // '\t'
                        // case 't':
                        case 116:
                            resultString += '\t';
                            break;

                        // '4'
                        // case 'u':
                        case 117:
                            var day = date.getDay();
                            resultString += day === 0 ? 7 : day;
                            break; // 1 - 7, Monday is first day of the week

                        // ' 1-Jan-1970'
                        // case 'v':
                        case 118:
                            resultString += _processFormat(locale.formats.v, date, locale, timestamp);
                            break;

                        // '4'
                        // case 'w':
                        case 119:
                            resultString += date.getDay();
                            break; // 0 - 6, Sunday is first day of the week

                        // '12/31/69'
                        // case 'x':
                        case 120:
                            resultString += _processFormat(locale.formats.x, date, locale, timestamp);
                            break;

                        // '70'
                        // case 'y':
                        case 121:
                            resultString += ('' + date.getFullYear()).slice(2);
                            break;

                        // '+0000'
                        // case 'z':
                        case 122:
                            if (_useUtcBasedDate && _customTimezoneOffset === 0) {
                                resultString += extendedTZ ? "+00:00" : "+0000";
                            } else {
                                var off;
                                if (_customTimezoneOffset !== 0) {
                                    off = _customTimezoneOffset / (60 * 1000);
                                } else {
                                    off = -date.getTimezoneOffset();
                                }
                                var sign = off < 0 ? '-' : '+';
                                var sep = extendedTZ ? ':' : '';
                                var hours = Math.floor(Math.abs(off / 60));
                                var mins = Math.abs(off % 60);
                                resultString += sign + padTill2(hours) + sep + padTill2(mins);
                            }
                            break;

                        default:
                            if (isInScope) {
                                resultString += '%';
                            }
                            resultString += format[i];
                            break;
                    }

                    padding = null;
                    isInScope = false;
                    continue;
                }

                // '%'
                if (currentCharCode === 37) {
                    isInScope = true;
                    continue;
                }

                resultString += format[i];
            }

            return resultString;
        }

        var strftime = _strftime;

        strftime.localize = function (locale) {
            return new Strftime(locale || _locale, _customTimezoneOffset, _useUtcBasedDate);
        };

        strftime.localizeByIdentifier = function (localeIdentifier) {
            var locale = Locales[localeIdentifier];
            if (!locale) {
                warn('[WARNING] No locale found with identifier "' + localeIdentifier + '".');
                return strftime;
            }
            return strftime.localize(locale);
        };

        strftime.timezone = function (timezone) {
            var customTimezoneOffset = _customTimezoneOffset;
            var useUtcBasedDate = _useUtcBasedDate;

            var timezoneType = typeof timezone === 'undefined' ? 'undefined' : _typeof(timezone);
            if (timezoneType === 'number' || timezoneType === 'string') {
                useUtcBasedDate = true;

                // ISO 8601 format timezone string, [-+]HHMM
                if (timezoneType === 'string') {
                    var sign = timezone[0] === '-' ? -1 : 1,
                        hours = parseInt(timezone.slice(1, 3), 10),
                        minutes = parseInt(timezone.slice(3, 5), 10);

                    customTimezoneOffset = sign * (60 * hours + minutes) * 60 * 1000;
                    // in minutes: 420
                } else if (timezoneType === 'number') {
                    customTimezoneOffset = timezone * 60 * 1000;
                }
            }

            return new Strftime(_locale, customTimezoneOffset, useUtcBasedDate);
        };

        strftime.utc = function () {
            return new Strftime(_locale, _customTimezoneOffset, true);
        };

        return strftime;
    }

    function padTill2(numberToPad, paddingChar) {
        if (paddingChar === '' || numberToPad > 9) {
            return numberToPad;
        }
        if (paddingChar == null) {
            paddingChar = '0';
        }
        return paddingChar + numberToPad;
    }

    function padTill3(numberToPad) {
        if (numberToPad > 99) {
            return numberToPad;
        }
        if (numberToPad > 9) {
            return '0' + numberToPad;
        }
        return '00' + numberToPad;
    }

    function hours12(hour) {
        if (hour === 0) {
            return 12;
        } else if (hour > 12) {
            return hour - 12;
        }
        return hour;
    }

    // firstWeekday: 'sunday' or 'monday', default is 'sunday'
    //
    // Pilfered & ported from Ruby's strftime implementation.
    function weekNumber(date, firstWeekday) {
        firstWeekday = firstWeekday || 'sunday';

        // This works by shifting the weekday back by one day if we
        // are treating Monday as the first day of the week.
        var weekday = date.getDay();
        if (firstWeekday === 'monday') {
            if (weekday === 0) // Sunday
                weekday = 6;else weekday--;
        }

        var firstDayOfYearUtc = Date.UTC(date.getFullYear(), 0, 1),
            dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            yday = Math.floor((dateUtc - firstDayOfYearUtc) / 86400000),
            weekNum = (yday + 7 - weekday) / 7;

        return Math.floor(weekNum);
    }

    // Get the ordinal suffix for a number: st, nd, rd, or th
    function ordinal(number) {
        var i = number % 10;
        var ii = number % 100;

        if (ii >= 11 && ii <= 13 || i === 0 || i >= 4) {
            return 'th';
        }
        switch (i) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
        }
    }

    function getTimestampToUtcOffsetFor(date) {
        return (date.getTimezoneOffset() || 0) * 60000;
    }

    function warn(message) {
        if (typeof console !== 'undefined' && typeof console.warn == 'function') {
            console.warn(message);
        }
    }
})();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/* global window, exports, define */

!function () {
    'use strict';

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments);
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []));
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1,
            tree_length = parse_tree.length,
            arg,
            output = '',
            i,
            k,
            match,
            pad,
            pad_character,
            pad_length,
            is_positive,
            sign;
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i];
            } else if (Array.isArray(parse_tree[i])) {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) {
                    // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                } else if (match[1]) {
                    // positional argument (explicit)
                    arg = argv[match[1]];
                } else {
                    // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (re.not_type.test(match[8]) && re.not_primitive.test(match[8]) && arg instanceof Function) {
                    arg = arg();
                }

                if (re.numeric_arg.test(match[8]) && typeof arg !== 'number' && isNaN(arg)) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg));
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0;
                }

                switch (match[8]) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2);
                        break;
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10));
                        break;
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                        break;
                    case 'j':
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
                        break;
                    case 'e':
                        arg = match[7] ? parseFloat(arg).toExponential(match[7]) : parseFloat(arg).toExponential();
                        break;
                    case 'f':
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                        break;
                    case 'g':
                        arg = match[7] ? String(Number(arg.toPrecision(match[7]))) : parseFloat(arg);
                        break;
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8);
                        break;
                    case 's':
                        arg = String(arg);
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 't':
                        arg = String(!!arg);
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0;
                        break;
                    case 'v':
                        arg = arg.valueOf();
                        arg = match[7] ? arg.substring(0, match[7]) : arg;
                        break;
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16);
                        break;
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                        break;
                }
                if (re.json.test(match[8])) {
                    output += arg;
                } else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');
                    } else {
                        sign = '';
                    }
                    pad_character = match[4] ? match[4] === '0' ? '0' : match[4].charAt(1) : ' ';
                    pad_length = match[6] - (sign + arg).length;
                    pad = match[6] ? pad_length > 0 ? pad_character.repeat(pad_length) : '' : '';
                    output += match[5] ? sign + arg + pad : pad_character === '0' ? sign + pad + arg : pad + sign + arg;
                }
            }
        }
        return output;
    }

    var sprintf_cache = Object.create(null);

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt];
        }

        var _fmt = fmt,
            match,
            parse_tree = [],
            arg_names = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%');
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [],
                        replacement_field = match[2],
                        field_match = [];
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            } else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    } else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }
                    match[2] = field_list;
                } else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            } else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return sprintf_cache[fmt] = parse_tree;
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (true) {
        exports['sprintf'] = sprintf;
        exports['vsprintf'] = vsprintf;
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf;
        window['vsprintf'] = vsprintf;

        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                };
            }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
    }
    /* eslint-enable quote-props */
}();

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    lua_pop = _require.lua_pop;

var _require2 = __webpack_require__(6),
    luaL_requiref = _require2.luaL_requiref;

var _require3 = __webpack_require__(3),
    to_luastring = _require3.to_luastring;

var loadedlibs = {};

/* export before requiring lualib.js */
var luaL_openlibs = function luaL_openlibs(L) {
    /* "require" functions from 'loadedlibs' and set results to global table */
    for (var lib in loadedlibs) {
        luaL_requiref(L, to_luastring(lib), loadedlibs[lib], 1);
        lua_pop(L, 1); /* remove lib */
    }
};
module.exports.luaL_openlibs = luaL_openlibs;

var lualib = __webpack_require__(16);

var _require4 = __webpack_require__(38),
    luaopen_base = _require4.luaopen_base;

var _require5 = __webpack_require__(23),
    luaopen_coroutine = _require5.luaopen_coroutine;

var _require6 = __webpack_require__(29),
    luaopen_debug = _require6.luaopen_debug;

var _require7 = __webpack_require__(28),
    luaopen_math = _require7.luaopen_math;

var _require8 = __webpack_require__(30),
    luaopen_package = _require8.luaopen_package;

var _require9 = __webpack_require__(25),
    luaopen_os = _require9.luaopen_os;

var _require10 = __webpack_require__(26),
    luaopen_string = _require10.luaopen_string;

var _require11 = __webpack_require__(24),
    luaopen_table = _require11.luaopen_table;

var _require12 = __webpack_require__(27),
    luaopen_utf8 = _require12.luaopen_utf8;

loadedlibs["_G"] = luaopen_base, loadedlibs[lualib.LUA_LOADLIBNAME] = luaopen_package;
loadedlibs[lualib.LUA_COLIBNAME] = luaopen_coroutine;
loadedlibs[lualib.LUA_TABLIBNAME] = luaopen_table;
loadedlibs[lualib.LUA_OSLIBNAME] = luaopen_os;
loadedlibs[lualib.LUA_STRLIBNAME] = luaopen_string;
loadedlibs[lualib.LUA_MATHLIBNAME] = luaopen_math;
loadedlibs[lualib.LUA_UTF8LIBNAME] = luaopen_utf8;
loadedlibs[lualib.LUA_DBLIBNAME] = luaopen_debug;
if (false) loadedlibs[lualib.LUA_IOLIBNAME] = require('./liolib.js').luaopen_io;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    LUA_MULTRET = _require.LUA_MULTRET,
    LUA_OK = _require.LUA_OK,
    LUA_TFUNCTION = _require.LUA_TFUNCTION,
    LUA_TNIL = _require.LUA_TNIL,
    LUA_TNONE = _require.LUA_TNONE,
    LUA_TNUMBER = _require.LUA_TNUMBER,
    LUA_TSTRING = _require.LUA_TSTRING,
    LUA_TTABLE = _require.LUA_TTABLE,
    LUA_VERSION = _require.LUA_VERSION,
    LUA_YIELD = _require.LUA_YIELD,
    lua_call = _require.lua_call,
    lua_callk = _require.lua_callk,
    lua_concat = _require.lua_concat,
    lua_error = _require.lua_error,
    lua_getglobal = _require.lua_getglobal,
    lua_geti = _require.lua_geti,
    lua_getmetatable = _require.lua_getmetatable,
    lua_gettop = _require.lua_gettop,
    lua_insert = _require.lua_insert,
    lua_isnil = _require.lua_isnil,
    lua_isnone = _require.lua_isnone,
    lua_isstring = _require.lua_isstring,
    lua_load = _require.lua_load,
    lua_next = _require.lua_next,
    lua_pcallk = _require.lua_pcallk,
    lua_pop = _require.lua_pop,
    lua_pushboolean = _require.lua_pushboolean,
    lua_pushcfunction = _require.lua_pushcfunction,
    lua_pushglobaltable = _require.lua_pushglobaltable,
    lua_pushinteger = _require.lua_pushinteger,
    lua_pushliteral = _require.lua_pushliteral,
    lua_pushnil = _require.lua_pushnil,
    lua_pushstring = _require.lua_pushstring,
    lua_pushvalue = _require.lua_pushvalue,
    lua_rawequal = _require.lua_rawequal,
    lua_rawget = _require.lua_rawget,
    lua_rawlen = _require.lua_rawlen,
    lua_rawset = _require.lua_rawset,
    lua_remove = _require.lua_remove,
    lua_replace = _require.lua_replace,
    lua_rotate = _require.lua_rotate,
    lua_setfield = _require.lua_setfield,
    lua_setmetatable = _require.lua_setmetatable,
    lua_settop = _require.lua_settop,
    lua_setupvalue = _require.lua_setupvalue,
    lua_stringtonumber = _require.lua_stringtonumber,
    lua_toboolean = _require.lua_toboolean,
    lua_tolstring = _require.lua_tolstring,
    lua_tostring = _require.lua_tostring,
    lua_type = _require.lua_type,
    lua_typename = _require.lua_typename;

var _require2 = __webpack_require__(6),
    luaL_argcheck = _require2.luaL_argcheck,
    luaL_checkany = _require2.luaL_checkany,
    luaL_checkinteger = _require2.luaL_checkinteger,
    luaL_checkoption = _require2.luaL_checkoption,
    luaL_checkstack = _require2.luaL_checkstack,
    luaL_checktype = _require2.luaL_checktype,
    luaL_error = _require2.luaL_error,
    luaL_getmetafield = _require2.luaL_getmetafield,
    luaL_loadbufferx = _require2.luaL_loadbufferx,
    luaL_loadfile = _require2.luaL_loadfile,
    luaL_loadfilex = _require2.luaL_loadfilex,
    luaL_optinteger = _require2.luaL_optinteger,
    luaL_optstring = _require2.luaL_optstring,
    luaL_setfuncs = _require2.luaL_setfuncs,
    luaL_tolstring = _require2.luaL_tolstring,
    luaL_where = _require2.luaL_where;

var _require3 = __webpack_require__(3),
    to_jsstring = _require3.to_jsstring,
    to_luastring = _require3.to_luastring;

var lua_writestring = void 0;
var lua_writeline = void 0;
if (true) {
    if (typeof TextDecoder === "function") {
        /* Older browsers don't have TextDecoder */
        var buff = "";
        var decoder = new TextDecoder("utf-8");
        lua_writestring = function lua_writestring(s) {
            buff += decoder.decode(s, { stream: true });
        };
        var empty = new Uint8Array(0);
        lua_writeline = function lua_writeline() {
            buff += decoder.decode(empty);
            console.log(buff);
            buff = "";
        };
    } else {
        var _buff = [];
        lua_writestring = function lua_writestring(s) {
            try {
                /* If the string is valid utf8, then we can use to_jsstring */
                s = to_jsstring(s);
            } catch (e) {
                /* otherwise push copy of raw array */
                var copy = new Uint8Array(s.length);
                copy.set(s);
                s = copy;
            }
            _buff.push(s);
        };
        lua_writeline = function lua_writeline() {
            console.log.apply(console.log, _buff);
            _buff = [];
        };
    }
} else {
    lua_writestring = function lua_writestring(s) {
        process.stdout.write(Buffer.from(s));
    };
    lua_writeline = function lua_writeline() {
        process.stdout.write("\n");
    };
}
var luaB_print = function luaB_print(L) {
    var n = lua_gettop(L); /* number of arguments */
    lua_getglobal(L, to_luastring("tostring", true));
    for (var i = 1; i <= n; i++) {
        lua_pushvalue(L, -1); /* function to be called */
        lua_pushvalue(L, i); /* value to print */
        lua_call(L, 1, 1);
        var s = lua_tolstring(L, -1);
        if (s === null) return luaL_error(L, to_luastring("'tostring' must return a string to 'print'"));
        if (i > 1) lua_writestring(to_luastring("\t"));
        lua_writestring(s);
        lua_pop(L, 1);
    }
    lua_writeline();
    return 0;
};

var luaB_tostring = function luaB_tostring(L) {
    luaL_checkany(L, 1);
    luaL_tolstring(L, 1);

    return 1;
};

var luaB_getmetatable = function luaB_getmetatable(L) {
    luaL_checkany(L, 1);
    if (!lua_getmetatable(L, 1)) {
        lua_pushnil(L);
        return 1; /* no metatable */
    }
    luaL_getmetafield(L, 1, to_luastring("__metatable", true));
    return 1; /* returns either __metatable field (if present) or metatable */
};

var luaB_setmetatable = function luaB_setmetatable(L) {
    var t = lua_type(L, 2);
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_argcheck(L, t === LUA_TNIL || t === LUA_TTABLE, 2, to_luastring("nil or table expected", true));
    if (luaL_getmetafield(L, 1, to_luastring("__metatable", true)) !== LUA_TNIL) return luaL_error(L, to_luastring("cannot change a protected metatable"));
    lua_settop(L, 2);
    lua_setmetatable(L, 1);
    return 1;
};

var luaB_rawequal = function luaB_rawequal(L) {
    luaL_checkany(L, 1);
    luaL_checkany(L, 2);
    lua_pushboolean(L, lua_rawequal(L, 1, 2));
    return 1;
};

var luaB_rawlen = function luaB_rawlen(L) {
    var t = lua_type(L, 1);
    luaL_argcheck(L, t === LUA_TTABLE || t === LUA_TSTRING, 1, to_luastring("table or string expected", true));
    lua_pushinteger(L, lua_rawlen(L, 1));
    return 1;
};

var luaB_rawget = function luaB_rawget(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_checkany(L, 2);
    lua_settop(L, 2);
    lua_rawget(L, 1);
    return 1;
};

var luaB_rawset = function luaB_rawset(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_checkany(L, 2);
    luaL_checkany(L, 3);
    lua_settop(L, 3);
    lua_rawset(L, 1);
    return 1;
};

var opts = ["stop", "restart", "collect", "count", "step", "setpause", "setstepmul", "isrunning"].map(function (e) {
    return to_luastring(e);
});
var luaB_collectgarbage = function luaB_collectgarbage(L) {
    luaL_checkoption(L, 1, to_luastring("collect"), opts);
    luaL_optinteger(L, 2, 0);
    luaL_error(L, to_luastring("lua_gc not implemented"));
};

var luaB_type = function luaB_type(L) {
    var t = lua_type(L, 1);
    luaL_argcheck(L, t !== LUA_TNONE, 1, to_luastring("value expected", true));
    lua_pushstring(L, lua_typename(L, t));
    return 1;
};

var pairsmeta = function pairsmeta(L, method, iszero, iter) {
    luaL_checkany(L, 1);
    if (luaL_getmetafield(L, 1, method) === LUA_TNIL) {
        /* no metamethod? */
        lua_pushcfunction(L, iter); /* will return generator, */
        lua_pushvalue(L, 1); /* state, */
        if (iszero) lua_pushinteger(L, 0); /* and initial value */
        else lua_pushnil(L);
    } else {
        lua_pushvalue(L, 1); /* argument 'self' to metamethod */
        lua_call(L, 1, 3); /* get 3 values from metamethod */
    }
    return 3;
};

var luaB_next = function luaB_next(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    lua_settop(L, 2); /* create a 2nd argument if there isn't one */
    if (lua_next(L, 1)) return 2;else {
        lua_pushnil(L);
        return 1;
    }
};

var luaB_pairs = function luaB_pairs(L) {
    return pairsmeta(L, to_luastring("__pairs", true), 0, luaB_next);
};

/*
** Traversal function for 'ipairs'
*/
var ipairsaux = function ipairsaux(L) {
    var i = luaL_checkinteger(L, 2) + 1;
    lua_pushinteger(L, i);
    return lua_geti(L, 1, i) === LUA_TNIL ? 1 : 2;
};

/*
** 'ipairs' function. Returns 'ipairsaux', given "table", 0.
** (The given "table" may not be a table.)
*/
var luaB_ipairs = function luaB_ipairs(L) {
    // Lua 5.2
    // return pairsmeta(L, "__ipairs", 1, ipairsaux);

    luaL_checkany(L, 1);
    lua_pushcfunction(L, ipairsaux); /* iteration function */
    lua_pushvalue(L, 1); /* state */
    lua_pushinteger(L, 0); /* initial value */
    return 3;
};

var b_str2int = function b_str2int(s, base) {
    try {
        s = to_jsstring(s);
    } catch (e) {
        return null;
    }
    var r = /^[\t\v\f \n\r]*([+-]?)0*([0-9A-Za-z]+)[\t\v\f \n\r]*$/.exec(s);
    if (!r) return null;
    var v = parseInt(r[1] + r[2], base);
    if (isNaN(v)) return null;
    return v | 0;
};

var luaB_tonumber = function luaB_tonumber(L) {
    if (lua_type(L, 2) <= 0) {
        /* standard conversion? */
        luaL_checkany(L, 1);
        if (lua_type(L, 1) === LUA_TNUMBER) {
            /* already a number? */
            lua_settop(L, 1);
            return 1;
        } else {
            var s = lua_tostring(L, 1);
            if (s !== null && lua_stringtonumber(L, s) === s.length + 1) return 1; /* successful conversion to number */
        }
    } else {
        var base = luaL_checkinteger(L, 2);
        luaL_checktype(L, 1, LUA_TSTRING); /* no numbers as strings */
        var _s = lua_tostring(L, 1);
        luaL_argcheck(L, 2 <= base && base <= 36, 2, to_luastring("base out of range", true));
        var n = b_str2int(_s, base);
        if (n !== null) {
            lua_pushinteger(L, n);
            return 1;
        }
    }

    lua_pushnil(L);
    return 1;
};

var luaB_error = function luaB_error(L) {
    var level = luaL_optinteger(L, 2, 1);
    lua_settop(L, 1);
    if (lua_type(L, 1) === LUA_TSTRING && level > 0) {
        luaL_where(L, level); /* add extra information */
        lua_pushvalue(L, 1);
        lua_concat(L, 2);
    }
    return lua_error(L);
};

var luaB_assert = function luaB_assert(L) {
    if (lua_toboolean(L, 1)) /* condition is true? */
        return lua_gettop(L); /* return all arguments */
    else {
            luaL_checkany(L, 1); /* there must be a condition */
            lua_remove(L, 1); /* remove it */
            lua_pushliteral(L, "assertion failed!"); /* default message */
            lua_settop(L, 1); /* leave only message (default if no other one) */
            return luaB_error(L); /* call 'error' */
        }
};

var luaB_select = function luaB_select(L) {
    var n = lua_gettop(L);
    if (lua_type(L, 1) === LUA_TSTRING && lua_tostring(L, 1)[0] === 35 /* '#'.charCodeAt(0) */) {
            lua_pushinteger(L, n - 1);
            return 1;
        } else {
        var i = luaL_checkinteger(L, 1);
        if (i < 0) i = n + i;else if (i > n) i = n;
        luaL_argcheck(L, 1 <= i, 1, to_luastring("index out of range", true));
        return n - i;
    }
};

/*
** Continuation function for 'pcall' and 'xpcall'. Both functions
** already pushed a 'true' before doing the call, so in case of success
** 'finishpcall' only has to return everything in the stack minus
** 'extra' values (where 'extra' is exactly the number of items to be
** ignored).
*/
var finishpcall = function finishpcall(L, status, extra) {
    if (status !== LUA_OK && status !== LUA_YIELD) {
        /* error? */
        lua_pushboolean(L, 0); /* first result (false) */
        lua_pushvalue(L, -2); /* error message */
        return 2; /* return false, msg */
    } else return lua_gettop(L) - extra;
};

var luaB_pcall = function luaB_pcall(L) {
    luaL_checkany(L, 1);
    lua_pushboolean(L, 1); /* first result if no errors */
    lua_insert(L, 1); /* put it in place */
    var status = lua_pcallk(L, lua_gettop(L) - 2, LUA_MULTRET, 0, 0, finishpcall);
    return finishpcall(L, status, 0);
};

/*
** Do a protected call with error handling. After 'lua_rotate', the
** stack will have <f, err, true, f, [args...]>; so, the function passes
** 2 to 'finishpcall' to skip the 2 first values when returning results.
*/
var luaB_xpcall = function luaB_xpcall(L) {
    var n = lua_gettop(L);
    luaL_checktype(L, 2, LUA_TFUNCTION); /* check error function */
    lua_pushboolean(L, 1); /* first result */
    lua_pushvalue(L, 1); /* function */
    lua_rotate(L, 3, 2); /* move them below function's arguments */
    var status = lua_pcallk(L, n - 2, LUA_MULTRET, 2, 2, finishpcall);
    return finishpcall(L, status, 2);
};

var load_aux = function load_aux(L, status, envidx) {
    if (status === LUA_OK) {
        if (envidx !== 0) {
            /* 'env' parameter? */
            lua_pushvalue(L, envidx); /* environment for loaded function */
            if (!lua_setupvalue(L, -2, 1)) /* set it as 1st upvalue */
                lua_pop(L, 1); /* remove 'env' if not used by previous call */
        }
        return 1;
    } else {
        /* error (message is on top of the stack) */
        lua_pushnil(L);
        lua_insert(L, -2); /* put before error message */
        return 2; /* return nil plus error message */
    }
};

/*
** reserved slot, above all arguments, to hold a copy of the returned
** string to avoid it being collected while parsed. 'load' has four
** optional arguments (chunk, source name, mode, and environment).
*/
var RESERVEDSLOT = 5;

/*
** Reader for generic 'load' function: 'lua_load' uses the
** stack for internal stuff, so the reader cannot change the
** stack top. Instead, it keeps its resulting string in a
** reserved slot inside the stack.
*/
var generic_reader = function generic_reader(L, ud) {
    luaL_checkstack(L, 2, to_luastring("too many nested functions", true));
    lua_pushvalue(L, 1); /* get function */
    lua_call(L, 0, 1); /* call it */
    if (lua_isnil(L, -1)) {
        lua_pop(L, 1); /* pop result */
        return null;
    } else if (!lua_isstring(L, -1)) luaL_error(L, to_luastring("reader function must return a string", true));
    lua_replace(L, RESERVEDSLOT); /* save string in reserved slot */
    return lua_tostring(L, RESERVEDSLOT);
};

var luaB_load = function luaB_load(L) {
    var s = lua_tostring(L, 1);
    var mode = luaL_optstring(L, 3, to_luastring("bt", true));
    var env = !lua_isnone(L, 4) ? 4 : 0; /* 'env' index or 0 if no 'env' */
    var status = void 0;
    if (s !== null) {
        /* loading a string? */
        var chunkname = luaL_optstring(L, 2, s);
        status = luaL_loadbufferx(L, s, s.length, chunkname, mode);
    } else {
        /* loading from a reader function */
        var _chunkname = luaL_optstring(L, 2, to_luastring("=(load)", true));
        luaL_checktype(L, 1, LUA_TFUNCTION);
        lua_settop(L, RESERVEDSLOT); /* create reserved slot */
        status = lua_load(L, generic_reader, null, _chunkname, mode);
    }
    return load_aux(L, status, env);
};

var luaB_loadfile = function luaB_loadfile(L) {
    var fname = luaL_optstring(L, 1, null);
    var mode = luaL_optstring(L, 2, null);
    var env = !lua_isnone(L, 3) ? 3 : 0; /* 'env' index or 0 if no 'env' */
    var status = luaL_loadfilex(L, fname, mode);
    return load_aux(L, status, env);
};

var dofilecont = function dofilecont(L, d1, d2) {
    return lua_gettop(L) - 1;
};

var luaB_dofile = function luaB_dofile(L) {
    var fname = luaL_optstring(L, 1, null);
    lua_settop(L, 1);
    if (luaL_loadfile(L, fname) !== LUA_OK) return lua_error(L);
    lua_callk(L, 0, LUA_MULTRET, 0, dofilecont);
    return dofilecont(L, 0, 0);
};

var base_funcs = {
    "assert": luaB_assert,
    "collectgarbage": luaB_collectgarbage,
    "dofile": luaB_dofile,
    "error": luaB_error,
    "getmetatable": luaB_getmetatable,
    "ipairs": luaB_ipairs,
    "load": luaB_load,
    "loadfile": luaB_loadfile,
    "next": luaB_next,
    "pairs": luaB_pairs,
    "pcall": luaB_pcall,
    "print": luaB_print,
    "rawequal": luaB_rawequal,
    "rawget": luaB_rawget,
    "rawlen": luaB_rawlen,
    "rawset": luaB_rawset,
    "select": luaB_select,
    "setmetatable": luaB_setmetatable,
    "tonumber": luaB_tonumber,
    "tostring": luaB_tostring,
    "type": luaB_type,
    "xpcall": luaB_xpcall
};

var luaopen_base = function luaopen_base(L) {
    /* open lib into global table */
    lua_pushglobaltable(L);
    luaL_setfuncs(L, base_funcs, 0);
    /* set global _G */
    lua_pushvalue(L, -1);
    lua_setfield(L, -2, to_luastring("_G"));
    /* set global _VERSION */
    lua_pushliteral(L, LUA_VERSION);
    lua_setfield(L, -2, to_luastring("_VERSION"));
    return 1;
};

module.exports.luaopen_base = luaopen_base;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(19),
    lua = _require.lua,
    lauxlib = _require.lauxlib,
    lualib = _require.lualib,
    to_luastring = _require.to_luastring;

var LUA_MULTRET = lua.LUA_MULTRET,
    LUA_OK = lua.LUA_OK,
    LUA_REGISTRYINDEX = lua.LUA_REGISTRYINDEX,
    LUA_RIDX_MAINTHREAD = lua.LUA_RIDX_MAINTHREAD,
    LUA_TBOOLEAN = lua.LUA_TBOOLEAN,
    LUA_TFUNCTION = lua.LUA_TFUNCTION,
    LUA_TLIGHTUSERDATA = lua.LUA_TLIGHTUSERDATA,
    LUA_TNIL = lua.LUA_TNIL,
    LUA_TNONE = lua.LUA_TNONE,
    LUA_TNUMBER = lua.LUA_TNUMBER,
    LUA_TSTRING = lua.LUA_TSTRING,
    LUA_TTABLE = lua.LUA_TTABLE,
    LUA_TTHREAD = lua.LUA_TTHREAD,
    LUA_TUSERDATA = lua.LUA_TUSERDATA,
    lua_atnativeerror = lua.lua_atnativeerror,
    lua_getfield = lua.lua_getfield,
    lua_gettable = lua.lua_gettable,
    lua_gettop = lua.lua_gettop,
    lua_isnil = lua.lua_isnil,
    lua_isproxy = lua.lua_isproxy,
    lua_newuserdata = lua.lua_newuserdata,
    lua_pcall = lua.lua_pcall,
    lua_pop = lua.lua_pop,
    lua_pushboolean = lua.lua_pushboolean,
    lua_pushcfunction = lua.lua_pushcfunction,
    lua_pushlightuserdata = lua.lua_pushlightuserdata,
    lua_pushliteral = lua.lua_pushliteral,
    lua_pushnil = lua.lua_pushnil,
    lua_pushnumber = lua.lua_pushnumber,
    lua_pushstring = lua.lua_pushstring,
    lua_pushvalue = lua.lua_pushvalue,
    lua_rawgeti = lua.lua_rawgeti,
    lua_rawgetp = lua.lua_rawgetp,
    lua_rawsetp = lua.lua_rawsetp,
    lua_remove = lua.lua_remove,
    lua_rotate = lua.lua_rotate,
    lua_setfield = lua.lua_setfield,
    lua_settable = lua.lua_settable,
    lua_settop = lua.lua_settop,
    lua_toboolean = lua.lua_toboolean,
    lua_tojsstring = lua.lua_tojsstring,
    lua_tonumber = lua.lua_tonumber,
    lua_toproxy = lua.lua_toproxy,
    lua_tothread = lua.lua_tothread,
    lua_touserdata = lua.lua_touserdata,
    lua_type = lua.lua_type;
var luaL_argerror = lauxlib.luaL_argerror,
    luaL_checkany = lauxlib.luaL_checkany,
    luaL_checkoption = lauxlib.luaL_checkoption,
    luaL_checkstack = lauxlib.luaL_checkstack,
    luaL_checkudata = lauxlib.luaL_checkudata,
    luaL_error = lauxlib.luaL_error,
    luaL_getmetafield = lauxlib.luaL_getmetafield,
    luaL_newlib = lauxlib.luaL_newlib,
    luaL_newmetatable = lauxlib.luaL_newmetatable,
    luaL_requiref = lauxlib.luaL_requiref,
    luaL_setfuncs = lauxlib.luaL_setfuncs,
    luaL_setmetatable = lauxlib.luaL_setmetatable,
    luaL_testudata = lauxlib.luaL_testudata,
    luaL_tolstring = lauxlib.luaL_tolstring;
var luaopen_base = lualib.luaopen_base;


var custom_inspect_symbol = void 0;
if (false) {
	try {
		/* for node.js */
		custom_inspect_symbol = require('util').inspect.custom;
	} catch (e) {}
}

var global_env = function () {
	/* global WorkerGlobalScope */ /* see https://github.com/sindresorhus/globals/issues/127 */
	if (false) {
		/* node */
		return global;
	} else if (typeof window !== "undefined") {
		/* browser window */
		return window;
	} else if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
		/* web worker */
		return self;
	} else {
		/* unknown global env */
		return eval('this'); /* use non-strict mode to get global env */
	}
}();

var apply = void 0,
    construct = void 0;
if (typeof Reflect !== "undefined") {
	apply = Reflect.apply;
	construct = Reflect.construct;
} else {
	var fApply = Function.apply;
	var bind = Function.bind;
	apply = function apply(target, thisArgument, argumentsList) {
		return fApply.call(target, thisArgument, argumentsList);
	};
	construct = function construct(target, argumentsList /*, newTarget */) {
		switch (argumentsList.length) {
			case 0:
				return new target();
			case 1:
				return new target(argumentsList[0]);
			case 2:
				return new target(argumentsList[0], argumentsList[1]);
			case 3:
				return new target(argumentsList[0], argumentsList[1], argumentsList[2]);
			case 4:
				return new target(argumentsList[0], argumentsList[1], argumentsList[2], argumentsList[3]);
		}
		var args = [null];
		args.push.apply(args, argumentsList);
		return new (bind.apply(target, args))();
	};
}

var toString = function toString(o) {
	return "" + o;
};

var isobject = function isobject(o) {
	return (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" ? o !== null : typeof o === "function";
};

var js_tname = to_luastring("js object");

var testjs = function testjs(L, idx) {
	var u = luaL_testudata(L, idx, js_tname);
	if (u) return u.data;else return void 0;
};

var checkjs = function checkjs(L, idx) {
	return luaL_checkudata(L, idx, js_tname).data;
};

var pushjs = function pushjs(L, v) {
	var b = lua_newuserdata(L);
	b.data = v;
	luaL_setmetatable(L, js_tname);
};

var getmainthread = function getmainthread(L) {
	lua_rawgeti(L, LUA_REGISTRYINDEX, LUA_RIDX_MAINTHREAD);
	var mainL = lua_tothread(L, -1);
	lua_pop(L, 1);
	return mainL;
};

/* weak map from states to proxy objects (for each object) in that state */
var states = new WeakMap();

var push = function push(L, v) {
	switch (typeof v === "undefined" ? "undefined" : _typeof(v)) {
		case "undefined":
			lua_pushnil(L);
			break;
		case "number":
			lua_pushnumber(L, v);
			break;
		case "string":
			lua_pushstring(L, to_luastring(v));
			break;
		case "boolean":
			lua_pushboolean(L, v);
			break;
		case "symbol":
			lua_pushlightuserdata(L, v);
			break;
		case "function":
			if (lua_isproxy(v, L)) {
				v(L);
				break;
			}
		/* fall through */
		case "object":
			if (v === null) {
				/* can't use null in a WeakMap; grab from registry */
				if (lua_rawgetp(L, LUA_REGISTRYINDEX, null) !== LUA_TUSERDATA) throw Error("js library not loaded into lua_State");
				break;
			}
		/* fall through */
		default:
			{
				/* Try and push same object again */
				var objects_seen = states.get(getmainthread(L));
				if (!objects_seen) throw Error("js library not loaded into lua_State");
				var p = objects_seen.get(v);
				if (p) {
					p(L);
				} else {
					pushjs(L, v);
					p = lua_toproxy(L, -1);
					objects_seen.set(v, p);
				}
			}
	}
};

var atnativeerror = function atnativeerror(L) {
	var u = lua_touserdata(L, 1);
	push(L, u);
	return 1;
};

var tojs = function tojs(L, idx) {
	switch (lua_type(L, idx)) {
		case LUA_TNONE:
		case LUA_TNIL:
			return void 0;
		case LUA_TBOOLEAN:
			return lua_toboolean(L, idx);
		case LUA_TLIGHTUSERDATA:
			return lua_touserdata(L, idx);
		case LUA_TNUMBER:
			return lua_tonumber(L, idx);
		case LUA_TSTRING:
			return lua_tojsstring(L, idx);
		case LUA_TUSERDATA:
			{
				var u = testjs(L, idx);
				if (u !== void 0) return u;
			}
		/* fall through */
		case LUA_TTABLE:
		case LUA_TFUNCTION:
		case LUA_TTHREAD:
		/* fall through */
		default:
			return wrap(L, lua_toproxy(L, idx));
	}
};

/* Calls function on the stack with `nargs` from the stack.
   On lua error, re-throws as javascript error
   On success, returns single return value */
var jscall = function jscall(L, nargs) {
	var status = lua_pcall(L, nargs, 1, 0);
	var r = tojs(L, -1);
	lua_pop(L, 1);
	switch (status) {
		case LUA_OK:
			return r;
		default:
			throw r;
	}
};

var invoke = function invoke(L, p, thisarg, args, n_results) {
	luaL_checkstack(L, 2 + args.length, null);
	if (n_results === void 0 || n_results === null) {
		n_results = LUA_MULTRET;
	}
	var base = lua_gettop(L);
	p(L);
	push(L, thisarg);
	for (var i = 0; i < args.length; i++) {
		push(L, args[i]);
	}
	switch (lua_pcall(L, 1 + args.length, n_results, 0)) {
		case LUA_OK:
			{
				var nres = lua_gettop(L) - base;
				var res = new Array(nres);
				for (var _i = 0; _i < nres; _i++) {
					res[_i] = tojs(L, base + _i + 1);
				}
				lua_settop(L, base);
				return res;
			}
		default:
			{
				var r = tojs(L, -1);
				lua_settop(L, base);
				throw r;
			}
	}
};

var gettable = function gettable(L) {
	lua_gettable(L, 1);
	return 1;
};

var _get = function _get(L, p, prop) {
	luaL_checkstack(L, 3, null);
	lua_pushcfunction(L, gettable);
	p(L);
	push(L, prop);
	return jscall(L, 2);
};

var _has = function _has(L, p, prop) {
	luaL_checkstack(L, 3, null);
	lua_pushcfunction(L, gettable);
	p(L);
	push(L, prop);
	var status = lua_pcall(L, 2, 1, 0);
	switch (status) {
		case LUA_OK:
			{
				var r = lua_isnil(L, -1);
				lua_pop(L, 1);
				return !r;
			}
		default:
			{
				var _r = tojs(L, -1);
				lua_pop(L, 1);
				throw _r;
			}
	}
};

var _set = function _set(L, p, prop, value) {
	luaL_checkstack(L, 4, null);
	lua_pushcfunction(L, function (L) {
		lua_settable(L, 1);
		return 0;
	});
	p(L);
	push(L, prop);
	push(L, value);
	switch (lua_pcall(L, 3, 0, 0)) {
		case LUA_OK:
			return;
		default:
			{
				var r = tojs(L, -1);
				lua_pop(L, 1);
				throw r;
			}
	}
};

var _deleteProperty = function _deleteProperty(L, p, prop) {
	luaL_checkstack(L, 4, null);
	lua_pushcfunction(L, function (L) {
		lua_settable(L, 1);
		return 0;
	});
	p(L);
	push(L, prop);
	lua_pushnil(L);
	switch (lua_pcall(L, 3, 0, 0)) {
		case LUA_OK:
			return;
		default:
			{
				var r = tojs(L, -1);
				lua_pop(L, 1);
				throw r;
			}
	}
};

var tostring = function tostring(L, p) {
	luaL_checkstack(L, 2, null);
	lua_pushcfunction(L, function (L) {
		luaL_tolstring(L, 1);
		return 1;
	});
	p(L);
	return jscall(L, 1);
};

/* implements lua's "Generic For" protocol */
var iter_next = function iter_next() {
	var L = this.L;
	luaL_checkstack(L, 3, null);
	var top = lua_gettop(L);
	this.iter(L);
	this.state(L);
	this.last(L);
	switch (lua_pcall(L, 2, LUA_MULTRET, 0)) {
		case LUA_OK:
			{
				this.last = lua_toproxy(L, top + 1);
				var r = void 0;
				if (lua_isnil(L, -1)) {
					r = {
						done: true,
						value: void 0
					};
				} else {
					var n_results = lua_gettop(L) - top;
					var result = new Array(n_results);
					for (var i = 0; i < n_results; i++) {
						result[i] = tojs(L, top + i + 1);
					}
					r = {
						done: false,
						value: result
					};
				}
				lua_settop(L, top);
				return r;
			}
		default:
			{
				var e = tojs(L, -1);
				lua_pop(L, 1);
				throw e;
			}
	}
};

/* make iteration use pairs() */
var jsiterator = function jsiterator(L, p) {
	luaL_checkstack(this.L, 2, null);
	luaL_requiref(L, to_luastring("_G"), luaopen_base, 0);
	lua_getfield(L, -1, to_luastring("pairs"));
	lua_remove(L, -2);
	p(L);
	switch (lua_pcall(L, 1, 3, 0)) {
		case LUA_OK:
			{
				var iter = lua_toproxy(L, -3);
				var state = lua_toproxy(L, -2);
				var last = lua_toproxy(L, -1);
				lua_pop(L, 3);
				return {
					L: L,
					iter: iter,
					state: state,
					last: last,
					next: iter_next
				};
			}
		default:
			{
				var r = tojs(L, -1);
				lua_pop(L, 1);
				throw r;
			}
	}
};

var wrap = function wrap(L1, p) {
	var L = getmainthread(L1);
	/* we need `typeof js_proxy` to be "function" so that it's acceptable to native apis */
	var js_proxy = function js_proxy() {
		/* only get one result */
		return invoke(L, p, this, arguments, 1)[0];
	};
	js_proxy.apply = function (thisarg, args) {
		/* only get one result */
		return invoke(L, p, thisarg, args, 1)[0];
	};
	js_proxy.invoke = function (thisarg, args) {
		return invoke(L, p, thisarg, args, LUA_MULTRET);
	};
	js_proxy.get = function (k) {
		return _get(L, p, k);
	};
	js_proxy.has = function (k) {
		return _has(L, p, k);
	};
	js_proxy.set = function (k, v) {
		return _set(L, p, k, v);
	};
	js_proxy.delete = function (k) {
		return _deleteProperty(L, p, k);
	};
	js_proxy.toString = function () {
		return tostring(L, p);
	};
	if (typeof Symbol === "function") {
		js_proxy[Symbol.toStringTag] = "Fengari object";
		js_proxy[Symbol.iterator] = function () {
			return jsiterator(L, p);
		};
		if (Symbol.toPrimitive) {
			js_proxy[Symbol.toPrimitive] = function (hint) {
				if (hint === "string") {
					return tostring(L, p);
				}
			};
		}
	}
	if (custom_inspect_symbol) {
		js_proxy[custom_inspect_symbol] = js_proxy.toString;
	}
	var objects_seen = states.get(L);
	if (!objects_seen) throw Error("js library not loaded into lua_State");
	objects_seen.set(js_proxy, p);
	return js_proxy;
};

var jslib = {
	"new": function _new(L) {
		var u = tojs(L, 1);
		var nargs = lua_gettop(L) - 1;
		var args = new Array(nargs);
		for (var i = 0; i < nargs; i++) {
			args[i] = tojs(L, i + 2);
		}
		push(L, construct(u, args));
		return 1;
	},
	"tonumber": function tonumber(L) {
		var u = tojs(L, 1);
		lua_pushnumber(L, +u);
		return 1;
	},
	"instanceof": function _instanceof(L) {
		var u1 = tojs(L, 1);
		var u2 = tojs(L, 2);
		lua_pushboolean(L, u1 instanceof u2);
		return 1;
	},
	"typeof": function _typeof(L) {
		var u = tojs(L, 1);
		lua_pushliteral(L, typeof u === "undefined" ? "undefined" : _typeof(u));
		return 1;
	}
};

if (typeof Symbol === "function" && Symbol.iterator) {
	var get_iterator = function get_iterator(L, idx) {
		var u = checkjs(L, idx);
		var getiter = u[Symbol.iterator];
		if (!getiter) luaL_argerror(L, idx, to_luastring("object not iterable"));
		var iter = apply(getiter, u, []);
		if (!isobject(iter)) luaL_argerror(L, idx, to_luastring("Result of the Symbol.iterator method is not an object"));
		return iter;
	};

	var next = function next(L) {
		var iter = tojs(L, 1);
		var r = iter.next();
		if (r.done) {
			return 0;
		} else {
			push(L, r.value);
			return 1;
		}
	};

	jslib["of"] = function (L) {
		var iter = get_iterator(L, 1);
		lua_pushcfunction(L, next);
		push(L, iter);
		return 2;
	};
}

if (typeof Proxy === "function" && typeof Symbol === "function") {
	var L_symbol = Symbol("lua_State");
	var p_symbol = Symbol("fengari-proxy");

	var proxy_handlers = {
		"apply": function apply(target, thisarg, args) {
			return invoke(target[L_symbol], target[p_symbol], thisarg, args, 1)[0];
		},
		"construct": function construct(target, argumentsList) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			var arg_length = argumentsList.length;
			luaL_checkstack(L, 2 + arg_length, null);
			p(L);
			var idx = lua_gettop(L);
			if (luaL_getmetafield(L, idx, to_luastring("construct")) === LUA_TNIL) {
				lua_pop(L, 1);
				throw new TypeError("not a constructor");
			}
			lua_rotate(L, idx, 1);
			for (var i = 0; i < arg_length; i++) {
				push(L, argumentsList[i]);
			}
			return jscall(L, 1 + arg_length);
		},
		"defineProperty": function defineProperty(target, prop, desc) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			luaL_checkstack(L, 4, null);
			p(L);
			if (luaL_getmetafield(L, -1, to_luastring("defineProperty")) === LUA_TNIL) {
				lua_pop(L, 1);
				return false;
			}
			lua_rotate(L, -2, 1);
			push(L, prop);
			push(L, desc);
			return jscall(L, 3);
		},
		"deleteProperty": function deleteProperty(target, k) {
			return _deleteProperty(target[L_symbol], target[p_symbol], k);
		},
		"get": function get(target, k) {
			return _get(target[L_symbol], target[p_symbol], k);
		},
		"getOwnPropertyDescriptor": function getOwnPropertyDescriptor(target, prop) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			luaL_checkstack(L, 3, null);
			p(L);
			if (luaL_getmetafield(L, -1, to_luastring("getOwnPropertyDescriptor")) === LUA_TNIL) {
				lua_pop(L, 1);
				return;
			}
			lua_rotate(L, -2, 1);
			push(L, prop);
			return jscall(L, 2);
		},
		"getPrototypeOf": function getPrototypeOf(target) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			luaL_checkstack(L, 2, null);
			p(L);
			if (luaL_getmetafield(L, -1, to_luastring("getPrototypeOf")) === LUA_TNIL) {
				lua_pop(L, 1);
				return null;
			}
			lua_rotate(L, -2, 1);
			return jscall(L, 1);
		},
		"has": function has(target, k) {
			return _has(target[L_symbol], target[p_symbol], k);
		},
		"ownKeys": function ownKeys(target) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			luaL_checkstack(L, 2, null);
			p(L);
			if (luaL_getmetafield(L, -1, to_luastring("ownKeys")) === LUA_TNIL) {
				lua_pop(L, 1);
				return;
			}
			lua_rotate(L, -2, 1);
			return jscall(L, 1);
		},
		"set": function set(target, k, v) {
			return _set(target[L_symbol], target[p_symbol], k, v);
		},
		"setPrototypeOf": function setPrototypeOf(target, prototype) {
			var L = target[L_symbol];
			var p = target[p_symbol];
			luaL_checkstack(L, 3, null);
			p(L);
			if (luaL_getmetafield(L, -1, to_luastring("setPrototypeOf")) === LUA_TNIL) {
				lua_pop(L, 1);
				return false;
			}
			lua_rotate(L, -2, 1);
			push(L, prototype);
			return jscall(L, 2);
		}
	};

	/*
   Functions created with `function(){}` have a non-configurable .prototype
   field. This causes issues with the .ownKeys and .getOwnPropertyDescriptor
   traps.
   However ES6 arrow functions do not (tested in firefox 57.0 and chrome 62).
 	  ```js
   Reflect.ownKeys((function(){})) // Array [ "prototype", "length", "name" ]
   Reflect.ownKeys((()=>void 0))   // Array [ "length", "name" ]
   ```
 	  We use Function() here to get prevent transpilers from converting to a
   non-arrow function.
   Additionally, we avoid setting the internal name field by never giving the
   new function a name in the block it was defined (and instead delete-ing
   the configurable fields .length and .name in a wrapper function)
 */
	var make_arrow_function = Function("return ()=>void 0;");
	var raw_function = function raw_function() {
		var f = make_arrow_function();
		delete f.length;
		delete f.name;
		return f;
	};

	var createproxy = function createproxy(L1, p, type) {
		var L = getmainthread(L1);
		var target = void 0;
		switch (type) {
			case "function":
				target = raw_function();
				break;
			case "object":
				target = {};
				break;
			default:
				throw TypeError("invalid type to createproxy");
		}
		target[p_symbol] = p;
		target[L_symbol] = L;
		return new Proxy(target, proxy_handlers);
	};

	var valid_types = ["function", "object"];
	var valid_types_as_luastring = valid_types.map(function (v) {
		return to_luastring(v);
	});
	jslib["createproxy"] = function (L) {
		luaL_checkany(L, 1);
		var type = valid_types[luaL_checkoption(L, 2, valid_types_as_luastring[0], valid_types_as_luastring)];
		var fengariProxy = createproxy(L, lua_toproxy(L, 1), type);
		push(L, fengariProxy);
		return 1;
	};
}

var jsmt = {
	"__index": function __index(L) {
		var u = checkjs(L, 1);
		var k = tojs(L, 2);
		push(L, u[k]);
		return 1;
	},
	"__newindex": function __newindex(L) {
		var u = checkjs(L, 1);
		var k = tojs(L, 2);
		var v = tojs(L, 3);
		if (v === void 0) delete u[k];else u[k] = v;
		return 0;
	},
	"__tostring": function __tostring(L) {
		var u = checkjs(L, 1);
		var s = toString(u);
		lua_pushstring(L, to_luastring(s));
		return 1;
	},
	"__call": function __call(L) {
		var u = checkjs(L, 1);
		var nargs = lua_gettop(L) - 1;
		var thisarg = void 0;
		var args = new Array(Math.max(0, nargs - 1));
		if (nargs > 0) {
			thisarg = tojs(L, 2);
			if (nargs-- > 0) {
				for (var i = 0; i < nargs; i++) {
					args[i] = tojs(L, i + 3);
				}
			}
		}
		push(L, apply(u, thisarg, args));
		return 1;
	},
	"__pairs": function __pairs(L) {
		var u = checkjs(L, 1);
		var f = void 0;
		if (typeof Symbol !== "function" || (f = u[Symbol.for("__pairs")]) === void 0) luaL_argerror(L, 1, to_luastring("js object has no __pairs Symbol"));
		var r = apply(f, u, []);
		if (r === void 0) luaL_error(L, to_luastring("bad '__pairs' result (object with keys 'iter', 'state', 'first' expected)"));
		var iter = r.iter;
		if (iter === void 0) luaL_error(L, to_luastring("bad '__pairs' result (object.iter is missing)"));
		lua_pushcfunction(L, function () {
			var state = tojs(L, 1);
			var last = tojs(L, 2);
			var r = iter.call(state, last);
			/* returning undefined indicates end of iteration */
			if (r === void 0) return 0;
			/* otherwise it should return an array of results */
			if (!Array.isArray(r)) luaL_error(L, to_luastring("bad iterator result (Array or undefined expected)"));
			luaL_checkstack(L, r.length, null);
			for (var i = 0; i < r.length; i++) {
				push(L, r[i]);
			}
			return r.length;
		});
		push(L, r.state);
		push(L, r.first);
		return 3;
	},
	"__len": function __len(L) {
		var u = checkjs(L, 1);
		var f = void 0;
		if (typeof Symbol !== "function" || (f = u[Symbol.for("__len")]) === void 0) luaL_argerror(L, 1, to_luastring("js object has no __len Symbol"));
		var r = apply(f, u, []);
		push(L, r);
		return 1;
	}
};

if (typeof Symbol === "function") {
	/* Create __pairs for all objects that inherit from Object */
	Object.prototype[Symbol.for("__pairs")] = function () {
		return {
			"iter": function iter(last) {
				if (this.index >= this.keys.length) return;
				var key = this.keys[this.index++];
				return [key, this.object[key]];
			},
			"state": {
				object: this,
				keys: Object.keys(this),
				index: 0
			}
		};
	};

	var arraylikes = [Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
	if (typeof NodeList !== "undefined") arraylikes.push(NodeList);
	if (typeof DOMTokenList !== "undefined") arraylikes.push(DOMTokenList);

	/* Add __len metamethod for all Array-like objects */
	var __len = function __len() {
		return this.length;
	};

	arraylikes.forEach(function (c) {
		c.prototype[Symbol.for("__len")] = __len;
	});
}

var luaopen_js = function luaopen_js(L) {
	/* Add weak map to track objects seen */
	states.set(getmainthread(L), new WeakMap());

	lua_atnativeerror(L, atnativeerror);

	luaL_newlib(L, jslib);

	luaL_newmetatable(L, js_tname);
	luaL_setfuncs(L, jsmt, 0);
	lua_pop(L, 1);

	pushjs(L, null);
	/* Store null object in registry under lightuserdata null */
	lua_pushvalue(L, -1);
	lua_rawsetp(L, LUA_REGISTRYINDEX, null);
	lua_setfield(L, -2, to_luastring("null"));

	push(L, global_env);
	lua_setfield(L, -2, to_luastring("global"));

	return 1;
};

module.exports.checkjs = checkjs;
module.exports.testjs = testjs;
module.exports.pushjs = pushjs;
module.exports.push = push;
module.exports.tojs = tojs;
module.exports.luaopen_js = luaopen_js;

/***/ })
/******/ ]);
});