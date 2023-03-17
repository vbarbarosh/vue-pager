var vue_pager =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/vue_pager.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/vue_pager.js":
/*!**************************!*\
  !*** ./src/vue_pager.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Vue = __webpack_require__(/*! vue */ "vue");
var Promise = __webpack_require__(/*! bluebird */ "bluebird");
function vue_pager(fn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var token = 0;
  var promise_loaded_items = [];
  var out = {
    reactive: {
      limit: options.limit,
      offset: options.offset
    },
    response: null,
    total: undefined,
    items: [],
    error: null,
    is_loading: true,
    get limit() {
      return out.reactive.limit;
    },
    set limit(value) {
      out.reactive.limit = value;
      load_begin();
    },
    get offset() {
      return out.reactive.offset;
    },
    set offset(value) {
      out.reactive.offset = value;
      load_begin();
    },
    get page_active() {
      return Math.ceil((out.reactive.offset + 1) / out.reactive.limit) || 1;
    },
    set page_active(value) {
      out.reactive.offset = out.reactive.limit * (value - 1);
      load_begin();
    },
    get has_prev() {
      return out.page_active > 1;
    },
    get has_next() {
      return out.page_active < out.page_total;
    },
    prev: function prev() {
      if (out.has_prev) {
        out.page_active--;
      }
    },
    next: function next() {
      if (out.has_next) {
        out.page_active++;
      }
    },
    "goto": function goto(page_no) {
      if (out.can_goto(page_no)) {
        out.page_active = page_no;
      }
    },
    can_goto: function can_goto(page_no) {
      return page_no >= 1 && page_no <= out.page_total;
    },
    rewind: function rewind() {
      out.reactive.offset = 0;
      return load_begin();
    },
    promise_loaded: function promise_loaded() {
      if (!this.is_loading) {
        return Promise.resolve();
      }
      return new Promise(function (resolve, reject) {
        return promise_loaded_items.push({
          resolve: resolve,
          reject: reject
        });
      });
    },
    page_total: null,
    page_numbers: null,
    reload: load_begin
  };

  // Computed properties are not accessible from `data` function (`fn` might require this data).
  // Postpone `load_begin` with `Vue.nextTick` will seems to fix this.
  Vue.nextTick(load_begin);
  return out;
  function load_begin() {
    var t = ++token;
    out.is_loading = true;
    return Promise.method(fn)(out.reactive).then(load_succeed)["catch"](load_failed)["finally"](load_finished);
    function load_succeed(response) {
      if (t !== token) {
        return;
      }
      out.error = null;
      out.response = response;
      out.reactive.limit = response.limit;
      out.reactive.offset = response.offset;
      out.page_total = Math.ceil(response.total / response.limit) || 0;
      out.page_numbers = Array(out.page_total).fill(0).map(function (v, i) {
        return i + 1;
      });
      out.total = response.total;
      // XXX rows for backward compatibility; will be remove at next major release
      out.items = response.items || response.rows;
      // http://bluebirdjs.com/docs/warning-explanations.html#warning-a-promise-was-created-in-a-handler-but-was-not-returned-from-it
      // > If you know what you're doing and don't want to silence all
      // > warnings, you can create runaway promises without causing
      // > this warning by returning e.g. null
      return null;
    }
    function load_failed(error) {
      if (t !== token) {
        return;
      }
      out.error = error;
      out.response = null;
      // The first use-case for this options is vue_pager.m.js
      if (typeof options.on_error == 'function') {
        options.on_error(error);
      } else if (options.on_error !== false) {
        console.log(error);
      }
    }
    function load_finished() {
      if (t !== token) {
        return;
      }
      out.is_loading = false;
      var error = out.error;
      promise_loaded_items.splice(0).forEach(function (_ref) {
        var resolve = _ref.resolve,
          reject = _ref.reject;
        try {
          error ? reject(error) : resolve();
        } catch (error2) {
          console.log(error2);
        }
      });
    }
  }
}
module.exports = vue_pager;

/***/ }),

/***/ "bluebird":
/*!**************************!*\
  !*** external "Promise" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Promise;

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ })

/******/ });