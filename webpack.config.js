function render_config(mode)
{
    // noinspection EqualityComparisonWithCoercionJS
    const is_development = (mode == 'development');

    return {
        mode,
        entry: './src/vue_pager.js',
        devtool: false,
        output: {
            filename: is_development ? 'vue-pager.js' : 'vue-pager.min.js',
            library: 'vue_pager',
        },
        externals: {
            vue: 'Vue',
            bluebird: 'Promise',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        },
                    },
                },
            ],
        },
    };
}

// noinspection WebpackConfigHighlighting
module.exports = [
    render_config('development'),
    render_config('production'),
];
