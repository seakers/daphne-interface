// initial state

import {fetchPost} from "../../scripts/fetch-helpers";

const state = {
    scoreInfo: [],
    subobjectiveHeaders: null,
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
        let existingProps = new Set();
        for (let row of subobjectiveDetails.rows) {
            // Create a list of all important props
            for (let prop in row.attribute_values) {
                if (row.attribute_values.hasOwnProperty(prop)) {
                    if (!existingProps.has(prop)) {
                        existingProps.add(prop);
                    }
                }
            }
        }
        state.subobjectiveHeaders = [...existingProps];
        // Add all missing props
        for (let row of subobjectiveDetails.rows) {
            let missingProps = new Set(existingProps);
            for (let prop in row.attribute_values) {
                if (row.attribute_values.hasOwnProperty(prop)) {
                    missingProps.delete(prop);
                }
            }
            for (let prop of missingProps) {
                row.attribute_values[prop] = "N/A";
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
