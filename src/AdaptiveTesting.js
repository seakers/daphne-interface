'use strict';

import Vue from 'vue';
import AdaptiveTestingPage from './components/adaptive-testing/AdaptiveTestingPage';
import store from './testing_store';

// Apollo
import VueApollo from "vue-apollo";
import { ApolloClient } from '@apollo/client/core';
import { HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';



let AdaptiveTesting = new Vue({
    el: '#AdaptiveTesting',
    store,
    render: h => h(AdaptiveTestingPage)
});
