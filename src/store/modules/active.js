// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    runBackgroundSearch: true,
    showFoundArchitectures: false,
    runDiversifier: true,
    showSuggestions: true
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {
    toggleRunBackgroundSearch({ state, commit, dispatch }, value) {
        if (value) {
            dispatch("startBackgroundSearch");
        }
        else {
            dispatch("stopBackgroundSearch");
        }
        commit("setRunBackgroundSearch", value);
    },
    async updateActiveSettings({ state }) {
        // Get the settings from the server to have them synced
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
};

// mutations
const mutations = {
    setRunBackgroundSearch(state, value) {
        state.runBackgroundSearch = value;
        if (value === false) {
            state.showFoundArchitectures = false;
        }
    },
    setShowFoundArchitectures(state, value) {
        state.showFoundArchitectures = value;
    },
    setRunDiversifier(state, value) {
        state.runDiversifier = value;
    },
    setShowSuggestions(state, value) {
        state.showSuggestions = value;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
