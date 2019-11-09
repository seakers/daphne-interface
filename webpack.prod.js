'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('http://18.189.44.130/api/'),
            'WS_URL': JSON.stringify('ws://18.189.44.130/api/')
        })
    ],
});
