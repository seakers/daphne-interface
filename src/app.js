'use strict';

import Vue from 'vue';

import MainMenu from './components/MainMenu';
import QuestionBar from './components/QuestionBar';
import TradespacePlot from './components/TradespacePlot';
import FunctionalityList from './components/FunctionalityList';

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
import * as _ from "lodash-es";

let app = new Vue({
    el: '#app',
    store,
    data: function () {
        return {
            websocket: {},
            tutorial: {}
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
                return this.$store.state.experiment.stageInformation[this.experimentStage].availableFunctionalities.includes('QuestionBar');
            }
        }
    },
    methods: {
    },
    components: { MainMenu, QuestionBar, TradespacePlot, FunctionalityList },
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
        this.$store.commit('setInExperiment', true);
        this.$store.commit('setExperimentStage', 'tutorial');

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
                    switch (this.experimentStage) {
                        case 'tutorial': {
                            this.tutorial.addSteps(this.$store.state.experiment.stageInformation.tutorial.steps);
                            this.tutorial.oncomplete(() => {
                                this.$store.commit('setExperimentStage', this.$store.state.experiment.stageInformation.tutorial.nextStage);
                            });
                            // TODO: Hijack next button action on tutorial
                            this.tutorial.start();
                            break;
                        }
                        case 'stage1': {
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
