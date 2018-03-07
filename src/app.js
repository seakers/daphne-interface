'use strict';

import Vue from 'vue';

import App from './components/App';

// Non ES-modularized libraries
let annyang = require('annyang');
let SpeechKITT = window.SpeechKITT;
let responsiveVoice = window.responsiveVoice;

// Styles
import 'intro.js/introjs.css';
import './styles/app.scss';

import store from './store';

// Record state and mutations when inside an experiment
// TODO: Rework to use WS and avoid so many connections? -> Do, connections too slow
let stateTimer = 0;
let mutationBlackList = ['setIsLoading', 'resetDaphne', 'clearFeatures', 'resetDataMining', 'resetFeatureApplication',
    'resetFilter', 'resetFunctionalityList', 'setProblem', 'updateExtra', 'updateProblemData', 'resetProblem',
    'updatePlotData', 'resetTradespacePlot'];
store.subscribe(async (mutation, state) => {
    // Only update if inside experiment
    if (state.experiment.inExperiment) {
        // Only update mutations if after tutorial (currentStageNum > 0)
        if (state.experiment.currentStageNum > 0 && !mutationBlackList.includes(mutation.type)) {
            // Upload mutation to server
            try {
                let reqData = new FormData();
                reqData.append('action', JSON.stringify(mutation));
                let response = await fetch(
                    '/api/experiment/add-action/' + (state.experiment.currentStageNum - 1),
                    {
                        method: 'POST',
                        body: reqData,
                        credentials: 'same-origin'
                    });
                if (!response.ok) {
                    console.error('Error uploading a mutation.', response);
                }
            }
            catch(e) {
                console.error('Networking error:', e);
            }
        }

        // Upload new state to server
        if (stateTimer === 0) {
            stateTimer = window.setInterval(async () => {
                try {
                    let reqData = new FormData();
                    reqData.append('state', JSON.stringify(state));
                    let response = await fetch(
                        '/api/experiment/update-state',
                        {
                            method: 'POST',
                            body: reqData,
                            credentials: 'same-origin'
                        });
                    if (!response.ok) {
                        console.error('Error updating the state in the server.', response);
                    }
                }
                catch(e) {
                    console.error('Networking error:', e);
                }
            }, 10000);
        }
    }
    else {
        if (stateTimer !== 0) {
            clearInterval(stateTimer);
            stateTimer = 0;
        }
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
