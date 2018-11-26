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

import ClimateCentric from '../scripts/climate-centric';
import SMAP from '../scripts/smap';
import Decadal2017Aerosols from '../scripts/decadal';
import DecadalFilter from '../scripts/decadal-filter';
import EOSSFilter from '../scripts/eoss-filter';
import {fetchPost} from "../scripts/fetch-helpers";
import ReconnectingWebSocket from "reconnecting-websocket";

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
            case 'ClimateCentric':
                problem = ClimateCentric;
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
            commit('updateExtra', await problem.initFunction(state.problem.problemName));

            // Load all the initial functionalities
            commit('resetDaphne');
            commit('resetTradespacePlot');
            commit('resetFunctionalityList');
            commit('resetDataMining');
            commit('resetFeatureApplication');
            for (let functionality of problem.shownFunctionalities) {
                commit('addFunctionality', functionality);
            }
        },
        async startWebsocket({ state, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                // Websocket connection
                let websocket = new ReconnectingWebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/api/daphne');
                websocket.onopen = function () {
                    console.log('Web Socket Connection Made');
                    resolve();
                };
                websocket.onmessage = function (event) {
                    let received_info = JSON.parse(event.data);
                    console.log(received_info);
                    if (received_info['type'] === 'ga.new_archs') {
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
                    if (received_info['type'] === 'ping') {
                        websocket.send(JSON.stringify({'msg_type': 'ping'}));
                    }
                };
                commit('setWebsocket', websocket);
            });
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

                let url = '/api/vassar/start-ga';
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

                let url = '/api/vassar/stop-ga';
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
        modal
    },
    strict: false
});
