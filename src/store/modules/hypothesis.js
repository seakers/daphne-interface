// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    currentHypothesis: "",
    featureExpression: "",
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {
    async startHypothesisTesting({ state, commit, dispatch }, value) {
        console.log("Starting the GA!!");
        // Start the GA on login
        try {
            let reqData = new FormData();
            reqData.append("featureExpression", state.featureExpression)
            let url = API_URL + 'eoss/explorer/start-ga';
            let dataResponse = await fetchPost(url, reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.text();
                console.log(data);
            }
            else {
                console.error('Error starting the hypothesis tester.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
};

// mutations
const mutations = {
    setCurrentHypothesis(state, value) {
        state.currentHypothesis = value;
    },
    setFeatureExpression(state, value) {
        state.featureExpression = value;
    },
    resetHypothesis(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreHypothesis(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
