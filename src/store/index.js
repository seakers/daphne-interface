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
import teacherAgent from './modules/teacher-agent';

import ClimateCentric from '../scripts/climate-centric';
import SMAP from '../scripts/smap';
import Decadal2017Aerosols from '../scripts/decadal';
import DecadalFilter from '../scripts/decadal-filter';
import EOSSFilter from '../scripts/eoss-filter';
import {fetchPost} from "../scripts/fetch-helpers";

import store from '../store';

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
            let filter = null;
            switch (state.problem.problemName) {
            case 'ClimateCentric':
                problem = ClimateCentric;
                filter = EOSSFilter;
                break;
            case 'SMAP':
                problem = SMAP;
                problem.problemName = 'SMAP';
                filter = EOSSFilter;
                break;
            case 'SMAP_JPL1':
                problem = SMAP;
                problem.problemName = 'SMAP_JPL1';
                filter = EOSSFilter;
                break;
            case 'SMAP_JPL2':
                problem = SMAP;
                problem.problemName = 'SMAP_JPL2';
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
            await fetchPost(API_URL + 'eoss/settings/change-port', reqData);
            commit('updateExtra', await problem.initFunction(state.problem.problemName));

            // Load all the initial functionalities
            commit('resetDaphne');
            commit('resetTradespacePlot');
            commit('resetFunctionalityList');
            commit('resetDataMining');
            commit('resetFilter');
            commit('resetFeatureApplication');
            commit('resetActive');
            if (!state.experiment.inExperiment) {
                for (let functionality of problem.shownFunctionalities) {
                    commit('addFunctionality', functionality);
                }
            }
        },
        async onWebsocketsMessage({ commit, state, getters, dispatch }, message) {
            let received_info = JSON.parse(message.data);

            //----> Teacher: receive websocket messages ----------------------------------------------------------------
            //--> ---------------------------------------------------------------------------------Design Space messages
            console.log("Websocket Message - Testing Proactive Teacher");
            if (received_info['type'] === 'teacher.design_space') {
                console.log('Success !!!!!');


                if(received_info['name'] === 'displayDesignSpaceInformation'){
                    //--> Set design space information
                    store.commit('setDesignSpaceInformation', received_info['data']);

                    //--> Set design space plot
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["design_space_plot"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });
                }
                if(received_info['name'] === 'designQuestion'){
                    store.commit('set_current_question_type', 'design');
                    store.commit('set_teacher_choice_one', received_info['first_choice']);
                    store.commit('set_teacher_choice_two', received_info['second_choice']);
                    store.commit('set_teacher_choice_one_revealed', received_info['first_choice']);
                    store.commit('set_teacher_choice_two_revealed', received_info['second_choice']);
                    store.commit('set_correct_choice', received_info['correct_answer']);
                    store.commit('set_current_teacher_question', received_info['question']);

                    //--> Display question
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["question_template"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });
                }
            }

            //--> ----------------------------------------------------------------------------- Objective Space messages
            if (received_info['type'] === 'teacher.objective_space') {
                console.log('Success !!!!!');

                if(received_info['name'] === 'displayObjectiveSpaceInformation') {

                    //--> Set plot informaiton in teacher so component can find it
                    store.commit('set_objective_chat_plot_info', received_info['data']);

                    //--> This message places objective space plot in chatbox
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["objective_space_plot"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });
                }

            }

            //--> ------------------------------------------------------------------------------- Sensitivities messages
            if (received_info['type'] === 'teacher.sensitivities') {
                console.log('Success !!!!!');
                let responsiveVoice = window.responsiveVoice;
                //store.state.daphne.dialogueHistory.push(received_info['speak']);


                if(received_info['name'] === 'displaySensitivityInformation'){

                    //--> Set sensitivities so SensitivityPlot.vue will have information
                    store.commit('setSensitivities', received_info['data']);

                    //--> This message places sensitivity plot in chatbox
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["sensitivity_plot"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });
                }


                if(received_info['name'] === 'sensitivityQuestion'){
                    //--> Set question information
                    store.commit('set_current_question_type', 'sensitivity');
                    store.commit('set_teacher_choice_one', received_info['first_choice']);
                    store.commit('set_teacher_choice_two', received_info['second_choice']);
                    store.commit('set_teacher_choice_one_revealed', received_info['first_choice_revealed']);
                    store.commit('set_teacher_choice_two_revealed', received_info['second_choice_revealed']);
                    store.commit('set_correct_choice', received_info['correct_answer']);
                    store.commit('set_current_teacher_question', received_info['question']);

                    //--> Display question
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["question_template"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });

                }



            }

            //--> ------------------------------------------------------------------------------------ Features messages
            if (received_info['type'] === 'teacher.features') {
                console.log('Success !!!!!');

                if(received_info['name'] === 'displayFeatureInformation'){

                    store.commit('set_features', received_info['data']);
                    store.commit('addDialoguePiece', {
                        "voice_message": 'testing',
                        "visual_message_type": ["feature_plot"],
                        "visual_message": ["ping"],
                        "writer": "daphne"
                    });
                }

                if(received_info['name'] === 'featureQuestion'){
                    console.log("Feature Question");
                }

                if(received_info['name'] === 'featureSuggestion'){
                    console.log("Feature Suggestion");
                }







            }
            //----------------------------------------------------------------------------------------------------------




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
        teacherAgent
    },
    strict: debug
});
