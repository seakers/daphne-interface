import Vue from 'vue';

import MainMenu from './components/MainMenu';
import QuestionBar from './components/QuestionBar';
import TradespacePlot from './components/TradespacePlot';
import FunctionalityList from './components/FunctionalityList';

import EOSS from './scripts/eoss';
import EOSSFilter from './scripts/eoss-filter';

let annyang = require('annyang');
let SpeechKITT = window.SpeechKITT;
let responsiveVoice = window.responsiveVoice;

// Old stuff
import Daphne from './scripts/daphne';
import EOSSLabel from './scripts/eoss_label';
import FeatureApplication from './scripts/feature_application';
let styles = require('./styles/app.scss');

import store from './store';

let app = new Vue({
    el: '#app',
    store,
    data: function () {
        return {
        }
    },
    methods: {
    },
    components: { MainMenu, QuestionBar, TradespacePlot, FunctionalityList },
    mounted() {
        // Set up initial state
        this.$store.commit('setProblem', EOSS);
        this.$store.commit('setFilter', EOSSFilter);
        this.$store.dispatch('loadNewData', 'EOSS_data_recalculated.csv');
        this.$store.commit('addFunctionality', 'DesignBuilder');
        this.$store.commit('addFunctionality', 'DataMining');
        this.$store.commit('addFunctionality', 'DaphneAnswer');
        this.$store.commit('addFunctionality', 'Cheatsheet');
    }
});

let daphne = new Daphne();

// General Code
//daphne.label = new EOSSLabel(daphne.problem);
//daphne.featureApplication = new FeatureApplication(daphne.label);

//daphne.addNewFunctionality('feature_application');

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
