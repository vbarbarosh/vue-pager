import Vue from 'vue';
import Promise from 'bluebird';
import vue_pager from './vue_pager';

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
