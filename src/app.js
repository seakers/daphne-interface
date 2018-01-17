import Vue from 'vue';

import FunctionalityList from './components/FunctionalityList';

import Daphne from './scripts/daphne';
import EOSS from './scripts/eoss';
import EOSSLabel from './scripts/eoss_label';
import TradespacePlot from './scripts/tradespace_plot';
import DataMining from './scripts/data_mining';
import EOSSFilter from './scripts/eoss_filter';
import FeatureApplication from './scripts/feature_application';
import CheatsheetManager from './scripts/cheatsheet_manager';
let styles = require('./styles/app.scss');
let Sortable = require('sortablejs');

let daphne = new Daphne();

// General Code
daphne.problem = new EOSS(daphne);
daphne.label = new EOSSLabel(daphne.problem);
daphne.tradespacePlot = new TradespacePlot(daphne.problem.output_list);
daphne.dataMining = new DataMining(daphne.tradespacePlot, daphne.label);
daphne.filter = new EOSSFilter(daphne.problem,daphne.tradespacePlot, daphne.label);
daphne.featureApplication = new FeatureApplication(daphne.label);
daphne.cheatsheetManager = new CheatsheetManager();

daphne.import_new_data().then(() => {
    daphne.calculate_pareto_ranking();
});

daphne.addNewFunctionality("design_inspector");
//await daphne.addNewFunctionality("daphne_answer");
//await daphne.addNewFunctionality("filter");
daphne.addNewFunctionality("feature_application");
daphne.addNewFunctionality("data_mining");

new Vue({
    data: function () {
        return {
            message: 'Webpack and Vue setup'
        }
    },
    el: '#admin-panel',
    components: { FunctionalityList }
});

let sortable_list = document.getElementById('functionalities_list');
Sortable.create(sortable_list, {
    handle: '.panel-heading',
    animation: 150
});
