// initial state
import * as _ from 'lodash-es';
import {wsTools} from "../../scripts/websocket-tools";
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
        console.log("Applying a feature to the GA!!");
        wsTools.websocket.send(JSON.stringify({
            msg_type: 'apply_feature',
            featureExpression: state.featureExpression
        }));
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
