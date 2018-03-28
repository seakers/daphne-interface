// initial state
import * as _ from 'lodash-es';

const state = {
    features: [],
    scores: [],
    supportThreshold: 0.002,
    confidenceThreshold: 0.2,
    liftThreshold: 1
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getFeatures(state) {
        return state.features;
    },
    getScores(state) {
        return state.scores;
    }
};

// actions
const actions = {
    async getDrivingFeatures({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            // Generate list of selected and not selected point ids
            let selectedIds = [];
            let nonSelectedIds = [];
            rootState.tradespacePlot.selectedArchs.forEach((point, index) => {
                if (point) {
                    selectedIds.push(index);
                }
                else {
                    nonSelectedIds.push(index);
                }
            });
            reqData.append('selected', JSON.stringify(selectedIds));
            reqData.append('non_selected', JSON.stringify(nonSelectedIds));
            reqData.append('supp', state.supportThreshold);
            reqData.append('conf', state.confidenceThreshold);
            reqData.append('lift', state.liftThreshold);
            let dataResponse = await fetch(
                '/api/data-mining/get-driving-features',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let features = await dataResponse.json();
                if (features === []) {
                    alert('No driving features mined. Please try modifying the selection. (Try selecting more designs)');
                }

                commit('setFeatures', features);
            }
            else {
                console.error('Error obtaining the driving features.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

function getNewUtopiaPoint(features) {
    let supps = [];
    let lifts = [];
    let conf1s = [];
    let conf2s = [];

    features.forEach(feature => {
        supps.push(feature.metrics[0]);
        lifts.push(feature.metrics[1]);
        conf1s.push(feature.metrics[2]);
        conf2s.push(feature.metrics[3]);
    });

    // Add utopia point to the list
    let maxConf = Math.max(...conf1s, ...conf2s);

    // Add utopia point
    let utopiaPoint = { name: 'utopiaPoint', expression: null, metrics: null, id: 0 };
    utopiaPoint.metrics = [Math.max(...lifts), Math.max(...supps), maxConf, maxConf];

    return utopiaPoint;
}

function computeScores(features) {
    let scores = [];

    features.forEach(feature => {
        let score = 1 - Math.sqrt(Math.pow(1 - feature.metrics[2], 2) + Math.pow(1 - feature.metrics[3], 2));
        scores.push(score);
    });

    return scores;
}

// mutations
const mutations = {
    setFeatures(state, features) {
        state.features = features;
        state.scores = computeScores(features);

        let utopiaPoint = getNewUtopiaPoint(features);

        // Insert the utopia point to the list of features
        state.features.unshift(utopiaPoint);

        // Add score for the utopia point (0.2 more than the best score found so far)
        state.scores.unshift(Math.max(...state.scores) + 0.2);

        // Initialize ids
        for(let i = 1; i < state.features.length; i++){
            state.features[i].id = i;
        }
    },
    addFeature(state, feature) {
        // Add new feature
        state.features.push(feature);

        // Initialize id
        let lastFeatureIndex = state.features.length-1;
        state.features[lastFeatureIndex].id = lastFeatureIndex;

        // Compute new score
        let score = 1 - Math.sqrt(Math.pow(1 - feature.metrics[2], 2) + Math.pow(1 - feature.metrics[3], 2));
        state.scores.push(score);

        // Remove old utopia point
        state.features.shift();
        state.scores.shift();

        // compute new utopia point
        let utopiaPoint = getNewUtopiaPoint(state.features);

        // Insert the utopia point to the list of features
        state.features.unshift(utopiaPoint);

        // Add score for the utopia point (0.2 more than the best score found so far)
        state.scores.unshift(Math.max(...state.scores) + 0.2);
    },
    clearFeatures(state) {
        state.features = [];
    },
    resetDataMining(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreDataMining(state, recoveredState) {
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
