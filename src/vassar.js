'use strict';

import Vue from 'vue';
import VassarPage from './components/VassarPage';
import store from './vassar_store';

// Apollo
import VueApollo from "vue-apollo";
import { ApolloClient } from '@apollo/client/core';
import { HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';



Vue.use(VueApollo);

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





let vassar = new Vue({
    el: '#vassar',
    store,
    apolloProvider,
    render: h => h(VassarPage)
});
