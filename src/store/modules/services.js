// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";


const state = {
    vassarServiceStatus: 'waiting_for_user',
    vassarServicePingId: -1,
    gaServiceStatus: 'waiting_for_user',
    gaServicePingId: -1,
    vassarRebuildStatus: '',
    gaRunningStatus: 'stopped',
    gaRunningPingId: -1,

    // --> Services (ping results)
    serviceStatus: {
        'vassar_containers': [],
        'ga_containers': []
    },

    requestId: null,
    pingId: null,
    requestResults: { 'ga': [], 'vassar': [] }
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getServiceStatus(state){
        return state.serviceStatus;
    },
    getPingId(state){
        return state.pingId;
    },
    getRequestId(state){
        return state.requestId;
    },
    getRequestResults(state){
        return state.requestResults;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    setVassarServiceStatus(state, vassarServiceStatus) {
        state.vassarServiceStatus = vassarServiceStatus;
    },
    setVassarServicePingId(state, vassarServicePingId) {
        state.vassarServicePingId = vassarServicePingId;
    },
    setGaServiceStatus(state, gaServiceStatus) {
        state.gaServiceStatus = gaServiceStatus;
    },
    setGaServicePingId(state, gaServicePingId) {
        state.gaServicePingId = gaServicePingId;
    },
    setVassarRebuildStatus(state, vassarRebuildStatus) {
        state.vassarRebuildStatus = vassarRebuildStatus;
    },
    setGARunningStatus(state, gaRunningStatus) {
        state.gaRunningStatus = gaRunningStatus;
    },
    setGARunningPingId(state, gaRunningPingId) {
        state.gaRunningPingId = gaRunningPingId;
    },
    resetServices(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreServices(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    },

    // --> Services
    setServiceStatus(state, serviceStatus){
        state.serviceStatus = serviceStatus;
    },
    setPingId(state, pingId){
        state.pingId = pingId;
    },
    setRequestId(state, requestId){
        state.requestId = requestId;
    },
    setRequestResults(state, requestResults){
        state.requestResults = requestResults;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
