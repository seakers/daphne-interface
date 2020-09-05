// initial state

import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    missions: null,
    mission_measurements: null,
    DC_meas: null
};

// getters
const getters = {
};

// actions
const actions = {
    async setMissions({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-missions', reqData);

            if (dataResponse.ok) {
                let miss = await dataResponse.json();
                commit('setMissions', miss);
            }
            else {
                console.error('Error downloading missions.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async setMissionMeasurements({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-mission-measurements', reqData);

            if (dataResponse.ok) {
                let miss = await dataResponse.json();
                commit('setMissionMeasurements', miss);
            }
            else {
                console.error('Error downloading mission measurements.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async setDataContinuity({state, commit, rootState}) {
        try {
            console.log("Setting data continuity.");
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-data-continuity', reqData);

            if (dataResponse.ok) {
                console.log("Downloaded data continuity.");
                let xd = await dataResponse.json();
                commit('setDataContinuity', xd);
            }
            else {
                console.error('Error downloading data continuity.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setMissions(state, missions) {
        state.missions = missions;
    },
    setMissionMeasurements(state, mission_measurements) {
        state.mission_measurements = mission_measurements;
    },
    setDataContinuity(state, DC_meas) {
        state.DC_meas = DC_meas;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
