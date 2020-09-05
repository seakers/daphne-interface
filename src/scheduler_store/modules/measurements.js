// initial state

import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    measurements: null,
    dates: null,
    score: null,
    GAData: null,
    enumScore: null
};

// getters
const getters = {
};

// actions
const actions = {
    async setMeasurements({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            reqData.append('arch_ids', rootState.archIDs);
            reqData.append('problem', rootState.problem);
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-measurements', reqData);

            if (dataResponse.ok) {
                let meas = await dataResponse.json();
                commit('setMeasurements', meas);
            }
            else {
                console.error('Error downloading measurements.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async getDates({commit}) {
      try {
            var inputTextValue;
            var elem = document.getElementById('dates');
            if(typeof elem !== null && elem !== 'undefined') {
                let dates = document.getElementById("dates").value;
                inputTextValue = dates;
            } else {
                inputTextValue = "xd";
            }
            console.log(inputTextValue);
            commit('setDates',inputTextValue);
      }
      catch(e) {
          console.error('Error getting dates', e);
      }
    },
    async getSchedulingScore({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            var temp = state.measurements;
            reqData.append('arch_ids', rootState.archIDs);
            reqData.append('problem', rootState.problem);
            reqData.append('dates', state.dates);
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-scheduling-eval', reqData);

            if (dataResponse.ok) {
                let meas = await dataResponse.json();
                commit('setScores', meas);
            }
            else {
                console.error('Error downloading measurements.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async startSchedulingGA({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            reqData.append('arch_ids', rootState.archIDs);
            reqData.append('problem', rootState.problem);
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/start-ga', reqData);

            if (dataResponse.ok) {
                let miss = await dataResponse.json();
                commit('setGAData', miss);
            }
            else {
                console.error('Error downloading mission measurements.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async startEnumeration({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            reqData.append('arch_ids', rootState.archIDs);
            reqData.append('problem', rootState.problem);
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/start-enumeration', reqData);

            if (dataResponse.ok) {
                let miss = await dataResponse.json();
                commit('setEnumScore', miss);
            }
            else {
                console.error('Error enumerating.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setMeasurements(state, measurements) {
        state.measurements = measurements;
    },
    setScores(state, score) {
        state.score = score;
    },
    setGAData(state, GAData) {
        state.GAData = GAData;
    },
    setDates(state, dates) {
        state.dates = dates;
    },
    setEnumScore(state, enumScore) {
        state.enumScore = enumScore;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
