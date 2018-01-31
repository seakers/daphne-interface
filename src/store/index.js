import Vue from 'vue';
import Vuex from 'vuex';
import problem from './modules/problem';
import tradespacePlot from './modules/tradespace-plot';
import functionalityList from './modules/functionality-list';
import daphne from './modules/daphne';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions: {},
    modules: {
        daphne,
        problem,
        tradespacePlot,
        functionalityList
    },
    strict: debug
});
