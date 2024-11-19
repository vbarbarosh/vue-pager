var vue_pager;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/vue_pager.js":
/*!**************************!*\
  !*** ./src/vue_pager.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Vue = (__webpack_require__(/*! vue */ "vue")["default"]) || __webpack_require__(/*! vue */ "vue");
var Promise = (__webpack_require__(/*! bluebird */ "bluebird")["default"]) || __webpack_require__(/*! bluebird */ "bluebird");
function vue_pager(fn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var token = 0;
  var promise_loaded_items = [];
  var hidden = {
    limit: options.limit,
    offset: options.offset
  };
  var out = Vue.reactive({
    response: null,
    total: undefined,
    items: [],
    error: null,
    is_loading: false,
    get limit() {
      return hidden.limit;
    },
    set limit(value) {
      hidden.limit = value;
      load_begin();
    },
    get offset() {
      return hidden.offset;
    },
    set offset(value) {
      hidden.offset = value;
      load_begin();
    },
    get page_active() {
      return Math.ceil((hidden.offset + 1) / hidden.limit) || 1;
    },
    set page_active(value) {
      hidden.offset = hidden.limit * (value - 1);
      load_begin();
    },
    get has_prev() {
      return out.page_active > 1;
    },
    get has_next() {
      return out.page_active < out.page_total;
    },
    get has_response() {
      return out.response !== null;
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
      return page_no > 0 && page_no <= out.page_total && page_no != out.page_active;
    },
    rewind: function rewind() {
      hidden.offset = 0;
      return load_begin();
    },
    promise_loaded: function promise_loaded() {
      if (this.response === null || this.is_loading) {
        return new Promise(function (resolve, reject) {
          return promise_loaded_items.push({
            resolve: resolve,
            reject: reject
          });
        });
      }
      return Promise.resolve();
    },
    page_total: null,
    page_numbers: null,
    reload: load_begin,
    refresh: function refresh() {
      if (this.is_loading) {
        return this.promise_loaded();
      }
      return load_begin();
    }
  });

  // Computed properties are not accessible from `data` function (`fn` might require this data).
  // Postpone `load_begin` with `Vue.nextTick` will seems to fix this.
  Vue.nextTick(out.refresh.bind(out));
  return out;
  function load_begin() {
    var t = ++token;
    out.is_loading = true;
    return Promise.method(fn)(hidden).then(load_succeed)["catch"](load_failed)["finally"](load_finished);
    function load_succeed(response) {
      if (t !== token) {
        return;
      }
      out.error = null;
      out.response = response;
      hidden.limit = response.limit;
      hidden.offset = response.offset;
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
      if (typeof options.onerror == 'function') {
        options.onerror(error);
      } else if (options.onerror !== false) {
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
/***/ ((module) => {

"use strict";
module.exports = Promise;

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/vue_pager.js");
/******/ 	vue_pager = __webpack_exports__;
/******/ 	
/******/ })()
;