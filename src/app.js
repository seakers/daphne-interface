import Vue from 'vue';

import FunctionalityList from './components/FunctionalityList';

import Daphne from './scripts/daphne';
import EOSS from './scripts/eoss';
import EOSSLabel from './scripts/eoss_label';
import TradespacePlot from './scripts/tradespace_plot';
import DataMining from './scripts/data_mining';
import EOSSFilter from './scripts/eoss_filter';
import FeatureApplication from './scripts/feature_application';
let styles = require('./styles/app.scss');
let Sortable = require('sortablejs');

import EventBus from './scripts/event-bus';

new Vue({
    el: '#app',
    data: function () {
        return {
            functionalityCount: {
                'DaphneAnswer': 0,
                'DesignInspector': 0,
                'DataMining': 0,
                'Cheatsheet': 0,
                'Filter': 0,
                'FeatureApplication': 0
            }
        }
    },
    methods: {
        addFunctionality(functionality) {
            EventBus.$emit('add-functionality', functionality);
        },
        isActive(functionality) {
            return this.functionalityCount[functionality] > 0;
        },
        updateCount(functionalityCount) {
            this.functionalityCount = Vue.util.extend({}, functionalityCount);
        }
    },
    components: { FunctionalityList }

});

let daphne = new Daphne();

// General Code
daphne.problem = new EOSS(daphne);
daphne.label = new EOSSLabel(daphne.problem);
daphne.tradespacePlot = new TradespacePlot(daphne.problem.output_list);
daphne.dataMining = new DataMining(daphne.tradespacePlot, daphne.label);
daphne.filter = new EOSSFilter(daphne.problem,daphne.tradespacePlot, daphne.label);
daphne.featureApplication = new FeatureApplication(daphne.label);

daphne.import_new_data().then(() => {
    daphne.calculate_pareto_ranking();
});

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
