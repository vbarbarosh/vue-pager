const Vue = require('vue');
const Promise = require('bluebird');

function vue_pager(fn, options = {})
{
    let token = 0;
    const promise_loaded_items = [];

    const out = {
        reactive: {
            limit: options.limit,
            offset: options.offset,
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
            return Math.ceil((out.reactive.offset+1)/out.reactive.limit) || 1;
        },
        set page_active(value) {
            out.reactive.offset = out.reactive.limit*(value-1);
            load_begin();
        },
        get has_prev() {
            return out.page_active > 1;
        },
        get has_next() {
            return out.page_active < out.page_total;
        },
        prev() {
            if (out.has_prev) {
                out.page_active--;
            }
        },
        next() {
            if (out.has_next) {
                out.page_active++;
            }
        },
        goto(page_no) {
            if (out.can_goto(page_no)) {
                out.page_active = page_no;
            }
        },
        can_goto(page_no) {
            return page_no >= 1 && page_no <= out.page_total;
        },
        rewind() {
            out.reactive.offset = 0;
            return load_begin();
        },
        promise_loaded: function () {
            if (!this.is_loading) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => promise_loaded_items.push({resolve, reject}));
        },
        page_total: null,
        page_numbers: null,
        reload: load_begin,
    };

    // Computed properties are not accessible from `data` function (`fn` might require this data).
    // Postpone `load_begin` with `Vue.nextTick` will seems to fix this.
    Vue.nextTick(load_begin);
    return out;

    function load_begin() {
        const t = ++token;

        out.is_loading = true;
        return Promise.method(fn)(out.reactive).then(load_succeed).catch(load_failed).finally(load_finished);

        function load_succeed(response) {
            if (t !== token) {
                return;
            }
            out.error = null;
            out.response = response;
            out.reactive.limit = response.limit;
            out.reactive.offset = response.offset;
            out.page_total = Math.ceil(response.total/response.limit) || 0;
            out.page_numbers = Array(out.page_total).fill(0).map((v,i) => i+1);
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
            }
            else if (options.on_error !== false) {
                console.log(error);
            }
        }

        function load_finished() {
            if (t !== token) {
                return;
            }
            out.is_loading = false;
            const {error} = out;
            promise_loaded_items.splice(0).forEach(function ({resolve, reject}) {
                try {
                    error ? reject(error) : resolve();
                }
                catch (error2) {
                    console.log(error2);
                }
            });
        }
    }
}

module.exports = vue_pager;
