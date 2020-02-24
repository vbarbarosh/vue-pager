A reactive object for working with paged data in Vue.

## Installation

```sh
npm i @vbarbarosh/vue-pager
```

## Usage

### Usage • JavaScript

```javascript
import Vue from 'vue';
import vue_pager from '@vbarbarosh/vue-pager';

new Vue({
    el: '#app',
    data: {
        pager: vue_pager(fn),
    },
});

function fn({limit, offset})
{
    return {limit: ..., offset: ..., total: ..., items: [...]};
}
```

### Usage • HTML

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

### Usage • Props

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
