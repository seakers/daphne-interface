// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";


const state = {
    vassarStatus: 'waiting_for_user',
    gaStatus: 'waiting_for_user'
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
    setVassarStatus(state, vassarStatus) {
        state.vassarStatus = vassarStatus;
    },
    setGaStatus(state, gaStatus) {
        state.gaStatus = gaStatus;
    },
    resetServices(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreServices(state, recoveredState) {
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
