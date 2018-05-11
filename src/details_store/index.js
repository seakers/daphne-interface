import Vue from 'vue';
import Vuex from 'vuex';
import score from'./modules/score';
import launchCost from './modules/launch-cost';
import lifecycleCost from './modules/lifecycle-cost';

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
    },
    modules: {
        score,
        launchCost,
        lifecycleCost
    },
    strict: debug
});
