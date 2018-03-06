'use strict';

import Vue from 'vue';

import MainMenu from './components/MainMenu';
import Timer from './components/Timer';
import QuestionBar from './components/QuestionBar';
import TradespacePlot from './components/TradespacePlot';
import FunctionalityList from './components/FunctionalityList';
import Modal from './components/Modal';

import EOSS from './scripts/eoss';
import EOSSFilter from './scripts/eoss-filter';

// Non ES-modularized libraries
let annyang = require('annyang');
let SpeechKITT = window.SpeechKITT;
let responsiveVoice = window.responsiveVoice;
let introJs = require('intro.js').introJs;

// Styles
let introJsStyles = require('intro.js/introjs.css');
let styles = require('./styles/app.scss');


import store from './store';
import { mapGetters } from 'vuex';

// Record state and mutations when inside an experiment
// TODO: Rework to use WS and avoid so many connections?
let stateTimer = 0;
store.subscribe(async (mutation, state) => {
    // Only update if inside experiment
    if (state.experiment.inExperiment) {
        // Only update mutations if after tutorial (currentStageNum > 0)
        if (state.experiment.currentStageNum > 0) {
            // Upload mutation to server
            try {
                let reqData = new FormData();
                reqData.append('action', mutation);
                let response = await fetch(
                    '/api/experiment/add-action/' + state.experiment.currentStageNum - 1,
                    {
                        method: 'POST',
                        body: reqData,
                        credentials: 'same-origin'
                    });
                if (!response.ok) {
                    console.error('Error uploading a mutation.');
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
    data: function () {
        return {
            websocket: {},
            tutorial: {},
            isModalActive: false
        }
    },
    computed: {
        ...mapGetters({
            inExperiment: 'getInExperiment',
            experimentStage: 'getExperimentStage',
            stageInformation: 'getStageInformation'
        }),
        questionBarExperimentCondition() {
            if (!this.inExperiment) {
                return true;
            }
            else {
                return this.stageInformation[this.experimentStage].availableFunctionalities.includes('QuestionBar');
            }
        },
        timerExperimentCondition() {
            if (!this.inExperiment) {
                return false;
            }
            else {
                return this.experimentStage === 'no_dapne' || this.experimentStage === 'daphne_peer' || this.experimentStage === 'daphne_assistant';
            }
        },
        stageDuration() {
            return this.stageInformation[this.experimentStage].stageDuration;
        },
        stageStartTime() {
            return this.stageInformation[this.experimentStage].startTime;
        },
        modalContent() {
            return this.$store.state.experiment.modalContent[this.$store.state.experiment.currentStageNum];
        }
    },
    methods: {
        onCountdownEnd() {
            console.log('Countdown ended!');
            // First stop the current stage
            this.$store.dispatch('finishStage').then(() => {
                // Activate the modal with end of stage information
                this.isModalActive = true;
            });
        },
        onCloseModal() {
            this.isModalActive = false;
        }
    },
    components: { MainMenu, Timer, QuestionBar, TradespacePlot, FunctionalityList, Modal },
    mounted() {
        // Websocket connection
        this.websocket = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/api/daphne');
        this.websocket.onopen = function() {
            console.log('Web Socket Conenction Made');
        };
        this.websocket.onmessage = function (data) {
            //ws.send(JSON.stringify(data));
        };

        // Tutorial
        this.tutorial = introJs();

        // Set up initial state
        this.$store.commit('setProblem', EOSS);
        this.$store.commit('setFilter', EOSSFilter);

        // Experiment
        this.$store.dispatch('startExperiment').then(() => {
            this.$store.commit('setInExperiment', true);
            this.$store.commit('setExperimentStage', 'tutorial');
        });

        /*this.$store.commit('addFunctionality', 'DesignBuilder');
        this.$store.commit('addFunctionality', 'DataMining');
        this.$store.commit('addFunctionality', 'FeatureApplication');
        this.$store.commit('addFunctionality', 'EOSSFilter');
        this.$store.commit('addFunctionality', 'DaphneAnswer');
        this.$store.commit('addFunctionality', 'Cheatsheet');
        this.$store.dispatch('loadNewData', 'EOSS_data_recalculated.csv');*/
    },
    watch: {
        experimentStage: function (val, oldVal) {
            if (this.inExperiment) {
                // Reset state
                this.$store.commit('resetDaphne');
                this.$store.commit('resetTradespacePlot');
                this.$store.commit('resetProblem');
                this.$store.commit('resetFunctionalityList');
                this.$store.commit('resetDataMining');
                this.$store.commit('resetFilter');
                this.$store.commit('resetFeatureApplication');

                // Add functionalities
                for (let shownFunc of this.stageInformation[this.experimentStage].shownFunctionalities) {
                    this.$store.commit('addFunctionality', shownFunc);
                }

                // Load stage dataset
                this.$store.dispatch('loadNewData', this.stageInformation[this.experimentStage].dataset).then(() => {
                    // Stage specific behaviour
                    switch (this.experimentStage) {
                        case 'tutorial': {
                            this.tutorial.addSteps(this.$store.state.experiment.stageInformation.tutorial.steps);
                            this.tutorial.setOption('exitOnOverlayClick', false);
                            this.tutorial.setOption('exitOnEsc', false);
                            this.tutorial.oncomplete(() => {
                                this.$store.dispatch('startStage', this.stageInformation.tutorial.nextStage).then(() => {
                                    this.$store.commit('setExperimentStage', this.stageInformation.tutorial.nextStage);
                                });
                            });
                            // TODO: Hijack next button action on tutorial
                            this.tutorial.start();
                            break;
                        }
                        case 'no_daphne': {
                            break;
                        }
                        case 'daphne_peer': {
                            break;
                        }
                        case 'daphne_assistant': {
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
            }
        }
    }
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
