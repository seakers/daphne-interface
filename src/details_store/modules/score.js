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
            reqData.append('problem_id', rootState.problemId);
            reqData.append('dataset_id', rootState.datasetId);
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
        for (let row of subobjectiveDetails.rows) {
            // Remove all unnecessary props
            allowed_props = ["Accuracy#", "orbit-inclination", "Temporal-resolution#", "Horizontal-Spatial-Resolution#"];
            for (let prop in row.attribute_values) {
                if (row.attribute_values.hasOwnProperty(prop)) {
                    if (!allowed_props.includes(prop)) {
                        delete row.attribute_values[prop];
                    }
                }
            }
            // Add all missing props
            for (let prop in allowed_props) {
                if (!row.attribute_values.hasOwnProperty(prop)) { 
                    row.attribute_values[prop] = "N/A";
                }
            }
        }
        state.subobjectiveDetails = subobjectiveDetails;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
