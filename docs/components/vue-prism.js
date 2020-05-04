document.write('<link href="https://unpkg.com/prismjs@1.19.0/themes/prism-okaidia.css" rel="stylesheet" />');
document.write('<script src="https://unpkg.com/prismjs@1.19.0/prism.js" data-manual></script>');

Vue.component('vue-prism', {
    template: '<pre v-once v-bind:class="x"><slot>{{ value }}</slot></pre>',
    props: ['value', 'type'],
    computed: {
        x: function () {
            return 'lang-' + this.type;
        },
    },
    mounted: function () {
        Prism.highlightElement(this.$el);
    },
});
