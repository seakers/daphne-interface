'use strict';

import Vue from 'vue';
import vuetify from './plugins/vuetify' // path to vuetify export
import AdaptiveTestingPage from './components/adaptive-testing/AdaptiveTestingPage';
import store from './testing_store';

import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Apollo
import VueApollo from "vue-apollo";
import { ApolloClient } from '@apollo/client/core';
import { HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';


// --- Vue Router ---
import Mastery from './components/adaptive-testing/Mastery'
import Basics from './components/adaptive-testing/subjects/Basics'
import AdaptiveTest from './components/adaptive-testing/tests/AdaptiveTest'
import TargetedTest from './components/adaptive-testing/tests/TargetedTest'
import Test from './components/adaptive-testing/tests/Test'

const routes = [

    // Mastery
    { path: '/mastery', component: Mastery },

    // Learning modules
    { path: '/basics', component: Basics },

    // Testing
    { path: '/adaptive-test', component: AdaptiveTest },
    { path: '/targeted-test', component: TargetedTest },
    { path: '/test', component: Test },
]
const router = new VueRouter({
    routes // short for `routes: routes`
})



let AdaptiveTesting = new Vue({
    el: '#AdaptiveTesting',
    store,
    router,
    vuetify,
    render: h => h(AdaptiveTestingPage)
});
