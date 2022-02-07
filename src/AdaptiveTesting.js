'use strict';


// --> Vue
import Vue from 'vue';
import AdaptiveTestingPage from './components/adaptive-testing/AdaptiveTestingPage';
import store from './testing_store';


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




// --> Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';
import {WebSocketLink} from "@apollo/client/link/ws";



// --> 1. Build routes
import Mastery from './components/adaptive-testing/Mastery'
// import Basics from './components/adaptive-testing/modules/Basics'
// import AbstractModule from './components/adaptive-testing/modules/AbstractModule'
// import AbstractModule2 from './components/adaptive-testing/modules/AbstractModule2'
import LearningModule from './components/adaptive-testing/modules/LearningModule'
import AdaptiveTest from './components/adaptive-testing/tests/AdaptiveTest'
import TargetedTest from './components/adaptive-testing/tests/TargetedTest'
import Test from './components/adaptive-testing/tests/Test'
const routes = [

    // Mastery
    { path: '/mastery', component: Mastery },

    // Learning modules
    { path: '/LearningModule/:name/:id', component: LearningModule, props:true },

    // Testing
    { path: '/adaptive-test', component: AdaptiveTest },
    { path: '/targeted-test', component: TargetedTest },
    { path: '/test', component: Test },
]
const router = new VueRouter({
    routes // short for `routes: routes`
})



// --> 2. Build apollo client
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




// --> 3. Build Vue instance
let AdaptiveTesting = new Vue({
    el: '#AdaptiveTesting',
    store,
    router,
    vuetify,
    apolloProvider,
    render: h => h(AdaptiveTestingPage)
});
