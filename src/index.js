'use strict';

import Vue from 'vue';

import App from './components/App';
import store from './store';
import {wsTools} from "./scripts/websocket-tools";

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
let updatesContextList = ['updateClickedArch', 'updateClickedArchInputs'];

//----> Mutation types for teacher agent
//--> Architecture the user currently has selected (first architecture doesn't count) use 'updateClickedArch' done
//--> How the user changes a currently selected architecture done
//--> Architecture that user requested to have evaluated done
let teacherMutationTypes = ['setSelectedArchitecture', 'setUpdatedArchitecture', 'setLastEvaluatedArchitecture'];

// Active timers
let numberOfEngChanges = 0;
let numberOfHistChanges = 0;

// Experiment Websocket connection
store.subscribe(async (mutation, state) => {
    //console.log(mutation.type);

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
                    msg_type: 'recordDetailView',
                    state: state
                }));
            }, 30000);
        }
    }
    else {
        if (stateTimer !== 0) {
            clearInterval(stateTimer);
            stateTimer = 0;
        }
    }


    //--> Mutations that will be used by the teacher agent
    if (teacherMutationTypes.includes(mutation.type)) {
        if (mutation.type === 'setSelectedArchitecture') {
            wsTools.websocket.send(JSON.stringify({
                msg_type: 'teacher_clicked_arch',
                teacher_context: mutation.payload,
            }));
        }
        if (mutation.type === 'setUpdatedArchitecture') {
            wsTools.websocket.send(JSON.stringify({
                msg_type: 'teacher_clicked_arch_update',
                teacher_context: mutation.payload,
            }));
        }
        if (mutation.type === 'setLastEvaluatedArchitecture') {
            wsTools.websocket.send(JSON.stringify({
                msg_type: 'teacher_evaluated_arch',
                teacher_context: mutation.payload,
            }));
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
