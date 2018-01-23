import Vue from 'vue';

import MainMenu from './components/MainMenu';
import TradespacePlot from './components/TradespacePlot';
import FunctionalityList from './components/FunctionalityList';

import EOSS from './scripts/eoss';
// Old stuff
import Daphne from './scripts/daphne';
import { EOSSOld } from './scripts/eoss';
import EOSSLabel from './scripts/eoss_label';
import TradespacePlotOld from './scripts/tradespace_plot';
import DataMining from './scripts/data_mining';
import EOSSFilter from './scripts/eoss_filter';
import FeatureApplication from './scripts/feature_application';
let styles = require('./styles/app.scss');
let Sortable = require('sortablejs');

import store from './store';

new Vue({
    el: '#app',
    store,
    data: function () {
        return {
        }
    },
    methods: {
    },
    components: { MainMenu, TradespacePlot, FunctionalityList },
    beforeMount() {
        // Set up initial state
        this.$store.commit('setProblem', EOSS);
        this.$store.dispatch('loadNewData', 'EOSS_data_recalculated.csv');
        this.$store.commit('addFunctionality', 'Cheatsheet');
    }
});

let daphne = new Daphne();

// General Code
daphne.problem = new EOSSOld(daphne);
daphne.label = new EOSSLabel(daphne.problem);
daphne.dataMining = new DataMining(daphne.tradespacePlot, daphne.label);
daphne.filter = new EOSSFilter(daphne.problem,daphne.tradespacePlot, daphne.label);
daphne.featureApplication = new FeatureApplication(daphne.label);

daphne.addNewFunctionality('design_inspector');
//await daphne.addNewFunctionality('daphne_answer');
//await daphne.addNewFunctionality('filter');
daphne.addNewFunctionality('feature_application');
daphne.addNewFunctionality('data_mining');

let sortable_list = document.getElementById('functionalities_list');
Sortable.create(sortable_list, {
    handle: '.panel-heading',
    animation: 150
});
