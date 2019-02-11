'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('https://selva-research.engr.tamu.edu/api/'),
            'WS_URL': JSON.stringify('wss://selva-research.engr.tamu.edu/api/')
        })
    ],
});
