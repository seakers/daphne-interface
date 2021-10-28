'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('https://dev2.selva-research.com/api/'),
            'WS_URL': JSON.stringify('wss://dev2.selva-research.com/api/'),
            'GRAPH_QL_URL': JSON.stringify('https://dev2.selva-research.com/v1/graphql'),
            'GRAPH_QL_WS_URL': JSON.stringify('wss://dev2.selva-research.com/v1/graphql'),
            'PROBLEM__ID': JSON.stringify('3'),
        })
    ],
});
