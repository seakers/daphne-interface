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
import mycroft from './modules/mycroft';
import services from './modules/services';

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
        async initProblem({ commit, state }, problemId) {

            // Load correct problem module based on problem
            let problem = null;
            let filter  = null;

            problem             = SMAP;
            problem.problemName = problemId;
            filter              = EOSSFilter;

            commit('setProblem', problem);
            if (filter !== null) {
                commit('setFilter', filter);
            }

            commit('updateExtra', await problem.initFunction(problemId));

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
            if (received_info['type'] === 'services.vassar_status') {
                commit('setVassarStatus', received_info['status']);
            }
            if (received_info['type'] === 'services.ga_status') {
                commit('setGaStatus', received_info['status']);
            }
            if (received_info['type'] === 'ping') {
                console.log("Ping back!");
            }



            if (received_info['type'] === 'formulation.main_effect') {
                console.log('--> FORMULATION MAIN EFFECT MESSAGE');
                // --> 1. Set message data in store for message component to parse
                commit('setMainEffects', received_info['data']);

                // --> 2. Place message in chatbox
                commit('addDialoguePiece', {
                    "voice_message": 'testing',
                    "visual_message_type": ["formulation_main_effect"],
                    "visual_message": ["ping"],
                    "writer": "daphne"
                });
            }
            if (received_info['type'] === 'formulation.feature') {
                console.log('--> FORMULATION FEATURE MESSAGE');
                // --> 1. Set message data in store for message component to parse
                commit('setFormulationFeatures', received_info['data']);

                // --> 2. Place message in chatbox
                commit('addDialoguePiece', {
                    "voice_message": 'testing',
                    "visual_message_type": ["formulation_feature"],
                    "visual_message": ["ping"],
                    "writer": "daphne"
                });
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
                let objective_objs = rootState.problem.objective_objs;
                console.log('--> OBJECTIVE OBJS:', objective_objs);
                let objective_str = "";
                for(let x = 0; x < objective_objs.length; x++){
                    if(objective_objs[x].active === true){
                        objective_str = objective_str + objective_objs[x].key + ",";
                    }
                }
                let trimmed_obj_string = objective_str.slice(0, -1);
                reqData.append("objectives", trimmed_obj_string);
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
                reqData.append('problem_id', rootState.problem.problem_id);

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
        services,
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
