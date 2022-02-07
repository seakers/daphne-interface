'use strict';


// --> Vue
import Vue from 'vue';
import AddPage from './components/AddPage';
import store from './add_store';


// --> VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)


// --> Vuetify
import vuetify from './plugins/vuetify' // path to vuetify export


// --> Apollo
import VueApollo from "vue-apollo";
import { ApolloClient } from '@apollo/client/core';
import { HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
Vue.use(VueApollo);


// --> Neo4j
import VueNeo4j from 'vue-neo4j'
Vue.use(VueNeo4j);


// --> Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';
import {WebSocketLink} from "@apollo/client/link/ws";





// --> 1. Build routes
import ADDGraph from "./components/add/ADDGraph";
const routes = [

    // Problems
    // { path: '/problem', component: Mastery },

    // Formulations
    { path: '/formulation/:name', component: ADDGraph },
    // { path: '/LearningModule/:name/:id', component: LearningModule, props:true },
]
const router = new VueRouter({
    routes // short for `routes: routes`
})


// --> 2. Create apolloProvider
const getHeaders = () => {
    const headers = {};
    const token = window.localStorage.getItem('apollo-token');
    if (token) {
        headers.authorization = `Bearer ${token}`;
    }
    return headers;
};
const link = new WebSocketLink({
    uri: GRAPH_QL_WS_URL,
    options: {
        reconnect: true,
        lazy: true,
        timeout: 30000,
        connectionParams: () => {
            return { headers: getHeaders() };
        },
    }
});
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
    router,
    vuetify,
    apolloProvider,
    render: h => h(AddPage)
});
