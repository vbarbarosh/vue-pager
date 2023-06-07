const Promise = require('bluebird');
const Vue = require('vue');
const assert = require('assert');
const vue_pager = require('./vue_pager');

describe('vue_pager', function () {
    it('should handle basic response', async function () {
        const app = new Vue({data: {pager: vue_pager(() => ({limit: 5, offset: 0, total: 3, items: [1,2,3]}))}});
        await wait(app, 'pager.items');
        const {limit, offset, total, items} = app.pager;
        const having = {limit, offset, total, items: items.slice()};
        const expecting = {limit: 5, offset: 0, total: 3, items: [1,2,3]};
        assert.deepStrictEqual(having, expecting);
    });
    it('should handle response with no items', async function () {
        const app = new Vue({data: {pager: vue_pager(() => ({limit: 0, offset: 0, total: 0, items: []}))}});
        await wait(app, 'pager.items');
        const {limit, offset, total, items} = app.pager;
        const having = {limit, offset, total, items: items.slice()};
        const expecting = {limit: 0, offset: 0, total: 0, items: []};
        assert.deepStrictEqual(having, expecting);
    });
    it('should reset error on successful response', async function () {
        let fn = function () { throw new Error(); };
        const app = new Vue({data: {pager: vue_pager(() => fn(), {onerror: false})}});
        await wait(app, 'pager.error');
        assert(app.pager.error !== null);
        fn = function () { return {limit: 0, offset: 0, total: 0, items: []}; };
        app.pager.reload();
        await wait(app, 'pager.error');
        assert(app.pager.error === null);
    });

    // const page_reports_list = {
    //     data: function () {
    //         return {
    //             pager: vue_pager(api_reports_list),
    //         };
    //     },
    //     methods: {
    //         refresh: async function () {
    //             await this.pager.refresh();
    //         },
    //     },
    //     created: async function () {
    //         await blocking(this.refresh());
    //     },
    // };
    describe('refresh', function() {
        it('should not initiate new request when old one is still loading', async function () {
            const calls = [];
            const app = new Vue({
                data: {
                    pager: vue_pager(function (query) {
                        calls.push(query);
                        return {limit: 5, offset: 0, total: 3, items: [1,2,3]};
                    }),
                },
                methods: {
                    refresh: async function () {
                        await this.pager.refresh();
                    },
                },
                created: async function () {
                    await this.refresh();
                }
            });
            await wait(app, 'pager.items');
            assert.strictEqual(1, calls.length);
        });
    });
});

function wait(app, prop)
{
    return new Promise(function (resolve) {
        const off = app.$watch(prop, function (value) {
            off();
            resolve(value);
        });
    });
}
