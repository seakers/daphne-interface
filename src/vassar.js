'use strict';

import Vue from 'vue';
import VassarPage from './components/VassarPage';
import store from './vassar_store';

import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';

Vue.use(VueApollo);

const getHeaders = () => {
    const headers = {};
    const token = window.localStorage.getItem('apollo-token');
    if (token) {
    headers.authorization = `Bearer ${token}`;
    }
    return headers;
};

 // Create an http link:

const link = new HttpLink({
    uri: 'http://localhost:6001/v1/graphql',
    fetch,
    headers: getHeaders()
});

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
