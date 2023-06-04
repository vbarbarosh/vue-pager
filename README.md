A reactive object for working with paged data in Vue.

## Installation

```sh
npm i @vbarbarosh/vue-pager
```

## Codepen

https://codepen.io/vbarbarosh/pen/xxRMaaz?editors=1000

## YouTube

[![ALT](https://img.youtube.com/vi/Q55jBnEcc3g/0.jpg)](https://www.youtube.com/watch?v=Q55jBnEcc3g)

## Usage

The goal of this package is to provide a reactive
object to any paged data. Technically, this object
is nothing more than a thin wrapper around async
`fn` function. This function will be called each
time a paged data is requested.

The following reactive properties are provided: `limit`,
`offset`, `total`, and `items` for items. `page_active`,
`page_total`, and `page_numbers` for pages.

### Usage • Step 1: Create `fn` function

```javascript
// http://www.filltext.com/?rows=100&fname={firstName}&lname={lastName}&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}&pretty=true
const api_articles_query_db = Array(100).fill(0).map(function (v, i) {
    return {
        uid: i + 1,
        author: `${faker.name.firstName()} ${faker.name.lastName()}`,
        title: faker.lorem.sentence(),
    };
});

function api_articles_query(query)
{
    const limit = Math.max(0, +query.limit || 10);
    const offset = Math.max(0, +query.offset || 0);
    const total = api_articles_query_db.length;
    const items = api_articles_query_db.slice(offset, offset + limit);
    const ms = faker.random.number({min: 100, max: 500});
    return Promise.delay(ms).return({limit, offset, total, items});
}
```

### Usage • Step 2: Create pager object

```javascript
import Vue from 'vue';
import vue_pager from '@vbarbarosh/vue-pager';

new Vue({
    el: '#app',
    data: {
        pager: vue_pager(api_articles_query),
    },
});
```

### Usage • Step 3: Create html

```html
<ul>
    <li v-for="item in pager.items" v-bind:key="item.uid">
        {{ item.title }}
    </li>
</ul>
<button v-on:click="pager.prev" v-bind:disabled="!pager.has_prev">prev</button>
<button v-on:click="pager.next" v-bind:disabled="!pager.has_next">next</button>
<div v-if="pager.is_loading">Loading...</div>
<div v-if="pager.error">{{ error }}</div>
```

## Props

| Name | Type | Description
| --- | :--- | :---
| `response`          | `object` | A return value of `fn`
| `error`             | `any` | Will be set to value other than `null` in case of error
| `is_loading`        | `boolean` | Will be set to `true` while `fn` is executed.
| `items`             | `array` | `response.items`
| `limit`             | `number` | `response.limit`
| `offset`            | `number` | `response.offset`
| `total`             | `number` | Total number of items reported by `fn` (the same as `response.total`)
| `page_active`       | `number` | Current page
| `page_total`        | `number` | Total number of pages
| `page_numbers`      | `array` | An array of page numbers (e.g. `[1,2,3,4,5]`)
| `has_prev`          | `boolean` | `true` if `page_active > 1`
| `has_next`          | `boolean` | `true` if `page_active < page_total`
| `can_goto(page_no)` | `Function` | `true` if `page_no >= 1 && page_no <= page_total`
| `prev()`            | `Function` | Navigate to the previous page
| `next()`            | `Function` | Navigate to the next page
| `goto(page_no)`     | `Function` | Go to the specified page
| `rewind()`          | `Function` | Reset offset and fetch very first page
| `reload()`          | `Function` | Fetch current page again
| `promise_loaded()`  | `Function` | Returns a promise which would be resolved after `is_loading=false`;
