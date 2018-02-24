import Vue from 'vue';
import Vuex from 'vuex';
import problem from './modules/problem';
import tradespacePlot from './modules/tradespace-plot';
import functionalityList from './modules/functionality-list';
import daphne from './modules/daphne';
import dataMining from './modules/data-mining';
import filter from './modules/filter';
import featureApplication from './modules/feature-application';
import experiment from './modules/experiment';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions: {},
    modules: {
        daphne,
        problem,
        tradespacePlot,
        functionalityList,
        dataMining,
        filter,
        featureApplication,
        experiment
    },
    strict: debug
});
