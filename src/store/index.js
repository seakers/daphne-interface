import Vue from 'vue';
import Vuex from 'vuex';
import auth from'./modules/auth';
import problem from './modules/problem';
import tradespacePlot from './modules/tradespace-plot';
import functionalityList from './modules/functionality-list';
import daphne from './modules/daphne';
import dataMining from './modules/data-mining';
import filter from './modules/filter';
import featureApplication from './modules/feature-application';
import experiment from './modules/experiment';
import modal from './modules/modal';

import EOSS from '../scripts/eoss';
import SMAP from '../scripts/smap';
import EOSSFilter from '../scripts/eoss-filter';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
        websocket: null
    },
    getters: {
        getWebsocket(state) {
            return state.websocket;
        }
    },
    mutations: {
        setWebsocket(state, websocket) {
            state.websocket = websocket;
        },
    },
    actions: {
        initProblem({ commit, state }) {
            // Load correct problem module based on problem
            let problem = null;
            let filter = null;
            switch (state.problem.problemName) {
            case 'EOSS':
                problem = EOSS;
                filter = EOSSFilter;
                break;
            case 'SMAP':
                problem = SMAP;
                filter = EOSSFilter;
                break;
            }
            commit('setProblem', problem);
            if (filter !== null) {
                commit('setFilter', filter);
            }

            // Load all the initial functionalities
            commit('resetDaphne');
            commit('resetTradespacePlot');
            commit('resetFunctionalityList');
            commit('resetDataMining');
            commit('resetFeatureApplication');
            for (let functionality of problem.shownFunctionalities) {
                commit('addFunctionality', functionality);
            }
        }
    },
    modules: {
        auth,
        daphne,
        problem,
        tradespacePlot,
        functionalityList,
        dataMining,
        filter,
        featureApplication,
        experiment,
        modal
    },
    strict: debug
});
