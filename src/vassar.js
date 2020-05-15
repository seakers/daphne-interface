'use strict';

import Vue from 'vue';
import VassarPage from './components/VassarPage';
import store from './vassar_store';

// Apollo
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

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
    uri: 'http://localhost:6001/v1/graphql',
    fetch,
    headers: getHeaders()
});

// APOLLO
const client = new ApolloClient({
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
