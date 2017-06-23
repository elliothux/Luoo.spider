const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: {
        index: path.join(__dirname, './js/index.js')
    },
    output: {
        path: path.join(__dirname, './js'),
        filename: '[name].build.js',
        publicPath: '/assets/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2'],
                },
                exclude: /node_modules/
            },
        ]
    },
    target: 'web'
};
