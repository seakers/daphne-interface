import Vue from 'vue';
import Vuex from 'vuex';
import active from'./modules/active';
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
import mycroft from './modules/mycroft'

import ClimateCentric from '../scripts/climate-centric';
import SMAP from '../scripts/smap';
import Decadal2017Aerosols from '../scripts/decadal';
import DecadalFilter from '../scripts/decadal-filter';
import EOSSFilter from '../scripts/eoss-filter';
import {fetchPost} from "../scripts/fetch-helpers";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        async initProblem({ commit, state }) {

            // Load correct problem module based on problem
            let problem = null;
            let filter  = null;

            problem             = SMAP;
            // problem.problemName = 'SMAP';
            // eslint-disable-next-line no-undef
            problem.problemName = parseInt(PROBLEM__ID);
            filter              = EOSSFilter;



            commit('setProblem', problem);
            if (filter !== null) {
                commit('setFilter', filter);
            }
            let reqData = new FormData();
            reqData.append('port', problem.vassarPort);
            // await fetchPost(API_URL + 'eoss/settings/change-port', reqData);
            commit('updateExtra', await problem.initFunction(state.problem.problemName));

            // Load all the initial functionalities
            commit('resetDaphne');
            commit('resetTradespacePlot');
            commit('resetFunctionalityList');
            commit('resetDataMining');
            commit('resetFilter');
            commit('resetFeatureApplication');
            commit('resetActive');
            commit('resetMycroft');
            if (!state.experiment.inExperiment) {
                for (let functionality of problem.shownFunctionalities) {
                    commit('addFunctionality', { functionality: functionality, funcData: null });
                }
            }
        },



        async onWebsocketsMessage({ commit, state, getters, dispatch }, message) {
            let received_info = JSON.parse(message.data);
            console.log(received_info);

            if (received_info['type'] === 'ga.new_archs') {
                console.log("---> new ga architecture");
                console.log(received_info['archs']);
                received_info['archs'].forEach((arch) => {
                    dispatch('addNewDataFromGA', arch);
                });
            }
            if (received_info['type'] === 'ga.started') {
                commit('setGaStatus', true);
            }
            if (received_info['type'] === 'ga.finished') {
                commit('setGaStatus', false);
            }
            if (received_info['type'] === 'active.notification') {
                commit('setNotificationTitle', received_info["notification"]["title"]);
                commit('setNotificationBody', received_info["notification"]["message"]);
                commit('setNotificationSetting', received_info["notification"]["setting"]);
                commit('setShowNotification', true);
            }
            if (received_info['type'] === 'active.modification') {
                commit('setNotificationTitle', received_info["notification"]["title"]);
                commit('setNotificationBody', received_info["notification"]["message"]);
                commit('setActiveModification', received_info["modification"]);
                commit('setNotificationSetting', "modification");
                commit('setShowNotification', true);
            }
            if (received_info['type'] === 'active.live_suggestion') {
                if (received_info['agent'] === 'engineer') {
                    commit('addSuggestionListType', {
                        type: 'engineer',
                        list: received_info['suggestion_list']
                    });

                }
                if (received_info['agent'] === 'historian') {
                    commit('addSuggestionListType', {
                        type: 'historian',
                        list: received_info['suggestion_list']
                    });
                }
                let daphneResponse = {
                    "visual_answer_type": "list",
                    "visual_answer": {
                        "list": getters.getFullSuggestionsList
                    }
                };
                commit('setResponse', daphneResponse);
            }
            if (received_info['type'] === 'active.message') {
                commit('addDialoguePiece', received_info['message']);
            }


            if (received_info['type'] === 'mycroft.message') {
                //--> Connection Information
                if (received_info['subject'] === 'connection') {
                    if (received_info['status'] === 'true') {
                        console.log("connection established");
                        // commit('set_mycroft_connection', true);
                        dispatch('check_mycroft_connection');
                    }
                    else if (received_info['status'] === 'false') {
                        console.log("connection broken");
                        // commit('set_mycroft_connection', false);
                        dispatch('check_mycroft_connection');
                    }
                }
                //--> Master command processing
                if (received_info['subject'] === 'command') {
                    commit('setCommand', received_info['command']);
                    dispatch('executeCommand');
                }
            }











            if (received_info['type'] === 'ping') {
                console.log("Ping back!");
            }



        },
        async stopBackgroundTasks({ dispatch }) {
            // Stop all background tasks
            await Promise.all([dispatch("stopBackgroundSearch")]);
        },
        async startBackgroundSearch({ rootState }) {
            console.log("Starting the GA!!");
            // Start the GA on login
            try {
                let reqData = new FormData();
                reqData.append('problem', rootState.problem.problemName);
                reqData.append('inputType', rootState.problem.inputType);

                let url = API_URL + 'eoss/explorer/start-ga';
                let dataResponse = await fetchPost(url, reqData);

                if (dataResponse.ok) {
                    let data = await dataResponse.text();
                    console.log(data);
                }
                else {
                    console.error('Error starting the GA.');
                }
            }
            catch(e) {
                console.error('Networking error:', e);
            }
        },
        async stopBackgroundSearch({ rootState }) {
            // Stop the GA
            try {
                let reqData = new FormData();
                reqData.append('problem', rootState.problem.problemName);
                reqData.append('inputType', rootState.problem.inputType);

                let url = API_URL + 'eoss/explorer/stop-ga';
                let dataResponse = await fetchPost(url, reqData);

                if (dataResponse.ok) {
                    let data = await dataResponse.text();
                    console.log(data);
                }
                else {
                    console.error('Error starting the GA.');
                }
            }
            catch(e) {
                console.error('Networking error:', e);
            }
        }
    },
    modules: {
        active,
        auth,
        daphne,
        problem,
        tradespacePlot,
        functionalityList,
        dataMining,
        filter,
        featureApplication,
        experiment,
        modal,
        mycroft
    },
    strict: debug
});
