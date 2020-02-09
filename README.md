An abstraction for working with paged data

    Page:
    <select v-model="pager.page_active">
        <option v-for="page_no in pager.page_numbers">{{ page_no }}</option>
    </select>
    <span v-if="pager.is_loading">Loading...</span>
    <br>
    <div v-if="pager.error">
        {{ pager.error }}
    </div>
    <ul>
        <li v-for="item in pager.items" v-bind:key="item.uid">
            {{ item.title }}
        </li>
    </ul>

    <script>
        new Vue({
            el: '#app',
            data: {
                pager: vue_pager(api_articles_query),
            },
        });

        const articles = [...];
        function api_articles_query(query)
        {
            const limit = Math.max(0, +query.limit || 10);
            const offset = Math.max(0, +query.offset || 0);
            const total = articles.length;
            const items = articles.slice(offset, offset + limit);
            return {limit, offset, total, items};
        }
    </script>
