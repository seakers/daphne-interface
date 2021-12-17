'use strict';

import Vue from 'vue';

import App from './components/App';
import store from './store';
import {wsTools} from "./scripts/websocket-tools";
import { onError } from "@apollo/client/link/error";

// Bulma

// Apollo
import VueApollo from "vue-apollo";
import {ApolloClient, from, HttpLink, split} from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from "@apollo/client/cache";





// Non ES-modularized libraries
let annyang = require('annyang');
let SpeechKITT = window.SpeechKITT;

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';
import {getMainDefinition} from "@apollo/client/utilities";
import {logErrorMessages} from "@vue/apollo-util";

// Record state and mutations when inside an experiment
let stateTimer = 0;
let mutationBlackList = ['setIsLoading', 'resetDaphne', 'clearFeatures', 'resetDataMining', 'resetFeatureApplication',
    'resetFilter', 'resetFunctionalityList', 'setProblem', 'updateExtra', 'updateProblemData', 'resetProblem',
    'updatePlotData', 'resetTradespacePlot', 'restoreProblem', 'restoreFilter', 'restoreTradespacePlot',
    'restoreDaphne', 'restoreFunctionalityList', 'restoreDataMining', 'restoreFeatureApplication', 'restoreExperiment',
    'setIsRecovering'];
let updatesContextList = ['updateClickedArch', 'updateClickedArchInputs'];

// Active timers
let numberOfEngChanges = 0;
let numberOfHistChanges = 0;

// APOLLO HEADERS
Vue.use(VueApollo);
const getHeaders = () => {
    const headers = {};
    const token = window.localStorage.getItem('apollo-token');
    if (token) {
        headers.authorization = `Bearer ${token}`;
    }
    return headers;
};

// WEBSOCKET LINK URL
const wsLink = new WebSocketLink({
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

const httpLink = new HttpLink({
    uri: GRAPH_QL_URL
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

// ERROR LINK
const errorLink = onError(error => {
    logErrorMessages(error);
});

const defaultOptions = {
    query: {
        errorPolicy: 'all',
    }
};


// APOLLO
export const client = new ApolloClient({
    link: from([errorLink, splitLink]),
    cache: new InMemoryCache({
        addTypename: true
    }),
    defaultOptions: defaultOptions,
});
const apolloProvider = new VueApollo({
    defaultClient: client,
})



// Experiment Websocket connection
store.subscribe(async (mutation, state) => {
    // Only update if inside experiment
    if (state.experiment.inExperiment) {
        // Only update mutations if after tutorial (currentStageNum > 0)
        if (state.experiment.currentStageNum > 0 && !mutationBlackList.includes(mutation.type)) {
            // Upload mutation to server
            wsTools.experimentWebsocket.send(JSON.stringify({
                msg_type: 'add_action',
                stage: state.experiment.currentStageNum - 1,
                action: mutation
            }));
        }

        // Upload new state to server
        if (stateTimer === 0) {
            stateTimer = window.setInterval(async () => {
                wsTools.experimentWebsocket.send(JSON.stringify({
                    msg_type: 'update_state',
                    state: state
                }));
            }, 10000);
        }
    }
    else {
        if (stateTimer !== 0) {
            clearInterval(stateTimer);
            stateTimer = 0;
        }
    }

    // Context updates TODO: Refactor into something more modular
    if (updatesContextList.includes(mutation.type)) {
        // Lazily create the Websocket to ensure the session is already created by this point
        if (mutation.type === 'updateClickedArch') {
            wsTools.websocket.send(JSON.stringify({
                msg_type: 'context_add',
                new_context: {
                    eosscontext: {
                        selected_arch_id: mutation.payload
                    }
                }
            }));
        }

        // Live Recommender System
        if (mutation.type === "updateClickedArchInputs") {
            // TODO: Find a way to differentiate between binary and discrete problems
            // Active Engineer
            window.setTimeout(function() {
                if (numberOfEngChanges > 0) {
                    --numberOfEngChanges;
                }
            },60*1000);
            ++numberOfEngChanges;

            if (numberOfEngChanges >= 3) {
                numberOfEngChanges = 0;
                console.log(mutation);
                // Send a WS request for expert information on current arch
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'active_engineer',
                    type: 'binary', // TODO!
                    genome: mutation.payload
                }));
            }

            // Active Historian
            window.setTimeout(function() {
                if (numberOfHistChanges > 0) {
                    --numberOfHistChanges;
                }
            }, 60*1000);
            ++numberOfHistChanges;

            if (numberOfHistChanges >= 3) {
                numberOfHistChanges = 0;
                // Send a WS request for historian information on current arch
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'active_historian',
                    type: 'binary', // TODO!
                    genome: mutation.payload
                }));
            }
        }
    }
});



let app = new Vue({
    el: '#app',
    store,
    apolloProvider,
    render: h => h(App)
});

// Voice recognition
if (annyang) {
    annyang.addCallback('result', phrases => {
        if (SpeechSynthesis.speaking) {
            return;
        }
        app.$store.commit('setCommand', phrases[0]);
        app.$store.dispatch('executeCommand');
    });

    annyang.debug();

    // Tell KITT to use annyang
    SpeechKITT.annyang();

    // Define a stylesheet for KITT to use
    SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

    // Render KITT's interface
    SpeechKITT.vroom();

    SpeechKITT.startRecognition();
}
