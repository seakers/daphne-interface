'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('https://dev.selva-research.com/api/'),
            'WS_URL': JSON.stringify('wss://dev.selva-research.com/api/'),
            'GRAPH_QL_URL': JSON.stringify('https://dev.selva-research.com/v1/graphql'),
            'GRAPH_QL_WS_URL': JSON.stringify('wss://dev.selva-research.com/v1/graphql'),
            'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://52.15.172.32:8080/subscriptions'),
            'PROBLEM__ID': JSON.stringify('3'),
        })
    ],
});
