import Vue from 'vue';
import Vuex from 'vuex';
import score from'./modules/score';
import cost from './modules/cost';
import {fetchPost} from "../scripts/fetch-helpers";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    state: {
        archID: null
    },
    getters: {
    },
    mutations: {
        setArchID(state, archID) {
            state.archID = archID;
        },
    },
    actions: {
        async getArchitectureDetails({ state, commit }) {
            try {
                let reqData = new FormData();
                reqData.append('arch_id', state.archID);
                let dataResponse = await fetchPost('/api/vassar/get-arch-details', reqData);

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
        score,
        cost
    },
    strict: debug
});
