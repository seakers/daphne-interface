'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify('http://brain.daphne.dev:8000/api/'),
            'WS_URL': JSON.stringify('ws://brain.daphne.dev:8000/api/'),
            'GRAPH_QL_URL': JSON.stringify('http://graphql.daphne.dev:8080/v1/graphql'),
            'GRAPH_QL_WS_URL': JSON.stringify('ws://graphql.daphne.dev:8080/v1/graphql'),
            'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://graphql.daphne.dev:8080/subscriptions'),
            'PROBLEM__ID': JSON.stringify('1'),
            'ADMIN_SECRET': JSON.stringify('daphne'),
        })
    ],
});
