// initial state

import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    scoreInfo: [],
    subobjectiveDetails: null
};

// getters
const getters = {
};

// actions
const actions = {
    async setSubobjectiveDetails({ state, commit, rootState }, subobjective) {
        try {
            let reqData = new FormData();
            reqData.append('arch_id', rootState.archID);
            reqData.append('subobjective', subobjective);
            reqData.append('problem', rootState.problem);
            let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-subobjective-details', reqData);

            if (dataResponse.ok) {
                let archData = await dataResponse.json();
                commit('setSubobjectiveDetails', archData['subobjective']);
            }
            else {
                console.error('Error downloading subobjective details.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setScoreInfo(state, scoreInfo) {
        state.scoreInfo = scoreInfo;
    },
    setSubobjectiveDetails(state, subobjectiveDetails) {
        state.subobjectiveDetails = subobjectiveDetails;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
