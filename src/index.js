'use strict';

import Vue from 'vue';

import App from './components/App';
import store from './store';

// Non ES-modularized libraries
let annyang = require('annyang');
let SpeechKITT = window.SpeechKITT;
let responsiveVoice = window.responsiveVoice;

// Styles
import 'intro.js/introjs.css';
import './styles/app.scss';

// Record state and mutations when inside an experiment
let stateTimer = 0;
let mutationBlackList = ['setIsLoading', 'resetDaphne', 'clearFeatures', 'resetDataMining', 'resetFeatureApplication',
    'resetFilter', 'resetFunctionalityList', 'setProblem', 'updateExtra', 'updateProblemData', 'resetProblem',
    'updatePlotData', 'resetTradespacePlot', 'restoreProblem', 'restoreFilter', 'restoreTradespacePlot',
    'restoreDaphne', 'restoreFunctionalityList', 'restoreDataMining', 'restoreFeatureApplication', 'restoreExperiment',
    'setIsRecovering'];
let updatesContextList = ['updateClickedArch'];

// Experiment Websocket connection
store.subscribe(async (mutation, state) => {
    // Only update if inside experiment
    if (state.experiment.inExperiment) {
        // Only update mutations if after tutorial (currentStageNum > 0)
        if (state.experiment.currentStageNum > 0 && !mutationBlackList.includes(mutation.type)) {
            // Upload mutation to server
            state.experiment.experimentWebsocket.send(JSON.stringify({
                msg_type: 'add_action',
                stage: state.experiment.currentStageNum - 1,
                action: mutation
            }));
        }

        // Upload new state to server
        if (stateTimer === 0) {
            stateTimer = window.setInterval(async () => {
                state.experiment.experimentWebsocket.send(JSON.stringify({
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
        const websocketPromise = new Promise((resolve, reject) => {
            if (state.websocket === null) {
                // Websocket connection
                let websocket = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/api/daphne');
                websocket.onopen = function() {
                    console.log('Web Socket Conenction Made');
                    resolve();
                };
                websocket.onmessage = function (data) {
                    //ws.send(JSON.stringify(data));
                };
                store.commit('setWebsocket', websocket);
            }
            else {
                resolve();
            }
        });

        websocketPromise.then(() => {
            if (mutation.type === 'updateClickedArch') {
                state.websocket.send(JSON.stringify({
                    msg_type: 'context_add',
                    new_context: {
                        current_design_id: mutation.payload
                    }
                }));
            }
        });
    }
});

let app = new Vue({
    el: '#app',
    store,
    render: h => h(App)
});

// Voice recognition
if (annyang) {
    annyang.addCallback('result', phrases => {
        if (responsiveVoice.isPlaying()) {
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
