import Vue from 'vue';
import Vuex from 'vuex';
import measurements from './modules/measurements';
import missions from './modules/missions';
import {fetchPost} from "../scripts/fetch-helpers";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
        archIDs: null,
        problem: null
    },
    getters: {
    },
    mutations: {
        setArchIDs(state, archIDs) {
            state.archIDs = archIDs;
        },
        setProblem(state, problem) {
            state.problem = problem;
        },
    },
    actions: {
        async getArchitectureDetails({ state, commit }) {
            try {
                console.log("getting architecture details");
                let reqData = new FormData();
                reqData.append('arch_id', state.archID);
                reqData.append('problem', state.problem);
                let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-arch-details', reqData);

                if (dataResponse.ok) {
                    let archData = await dataResponse.json();
                    commit('setScoreInfo', archData['score']);
                    commit('setBudgets', archData['budgets']);
                }
                else {
                    console.error('Error downloading architecture information.');
                }
            }
            catch(e) {
                console.error('Networking error:', e);
            }
        },
    },
    modules: {
        measurements,
        missions
    },
    strict: debug
});
