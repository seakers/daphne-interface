'use strict';

import Vue from 'vue';
import AddPage from './components/AddPage';
import store from './add_store';

// Apollo
import VueApollo from "vue-apollo";
import { ApolloClient } from '@apollo/client/core';
import { HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';
// import VueNeo4j from 'vue-neo4j'



Vue.use(VueApollo);
// Vue.use(VueNeo4j);

// APOLLO HEADERS
const getHeaders = () => {
    const headers = {};
    const token = window.localStorage.getItem('apollo-token');
    if (token) {
        headers.authorization = `Bearer ${token}`;
    }
    return headers;
};

// HASURA URL
const link = new HttpLink({
    uri: GRAPH_QL_URL,
    fetch,
    headers: getHeaders()
});

// APOLLO
export const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
        addTypename: true
    })
});
const apolloProvider = new VueApollo({
    defaultClient: client,
})





let add = new Vue({
    el: '#add',
    store,
    apolloProvider,
    render: h => h(AddPage)
});
