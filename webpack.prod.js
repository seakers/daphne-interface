'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            // 'API_URL': JSON.stringify('http://daphne-dev-load-balancer-1316892040.us-east-2.elb.amazonaws.com:8000/api/'),
            // 'WS_URL': JSON.stringify('ws://daphne-dev-load-balancer-1316892040.us-east-2.elb.amazonaws.com:8000/api/'),
            // 'API_URL': JSON.stringify('https://daphne-dev-load-balancer-1316892040.us-east-2.elb.amazonaws.com:443/api/'),
            // 'WS_URL': JSON.stringify('wss://daphne-dev-load-balancer-1316892040.us-east-2.elb.amazonaws.com:443/api/'),
            // 'API_URL': JSON.stringify('https://daphne-dev-services.selva-research.com:443/api/'), // PROD
            // 'WS_URL': JSON.stringify('wss://daphne-dev-services.selva-research.com:443/api/'),    // PROD
            'API_URL': JSON.stringify('http://daphne-dev-services.selva-research.com:8000/api/'), // PROD 2
            'WS_URL': JSON.stringify('ws://daphne-dev-services.selva-research.com:8000/api/'),    // PROD 2
            // 'API_URL': JSON.stringify('http://localhost:8000/api/'),
            // 'WS_URL': JSON.stringify('ws://localhost:8000/api/'),
            'GRAPH_QL_URL': JSON.stringify('http://52.15.172.32:8080/v1/graphql'),
            'GRAPH_QL_WS_URL': JSON.stringify('ws://52.15.172.32:8080/v1/graphql'),
            'GRAPH_QL_WS_URL_SUB': JSON.stringify('ws://52.15.172.32:8080/subscriptions'),
            'PROBLEM__ID': JSON.stringify('1'),
            'ADMIN_SECRET': JSON.stringify('daphne'),
        })
    ],
});
