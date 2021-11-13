// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";


const state = {
    vassarServiceStatus: 'waiting_for_user',
    gaServiceStatus: 'waiting_for_user',
    vassarRebuildStatus: '',
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
    setVassarServiceStatus(state, vassarServiceStatus) {
        state.vassarServiceStatus = vassarServiceStatus;
    },
    setGaServiceStatus(state, gaServiceStatus) {
        state.gaServiceStatus = gaServiceStatus;
    },
    setVassarRebuildStatus(state, vassarRebuildStatus) {
        state.vassarRebuildStatus = vassarRebuildStatus;
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
