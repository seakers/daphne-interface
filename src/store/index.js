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
import Decadal2017Aerosols from '../scripts/decadal';
import DecadalFilter from '../scripts/decadal-filter';
import EOSSFilter from '../scripts/eoss-filter';
import {fetchPost} from "../scripts/fetch-helpers";

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
        async initProblem({ commit, state }) {
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
            case 'Decadal2017Aerosols':
                problem = Decadal2017Aerosols;
                filter = DecadalFilter;
            }
            commit('setProblem', problem);
            if (filter !== null) {
                commit('setFilter', filter);
            }
            let reqData = new FormData();
            reqData.append('port', problem.vassarPort);
            await fetchPost('/api/vassar/change-port', reqData);
            commit('updateExtra', await problem.initFunction());

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
