// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";


const state = {
    features: [],
    featureIDsJustAdded: [],
    scores: [],
    supportThreshold: 0.1,
    confidenceThreshold: 0.1,
    liftThreshold: 1
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {

    async runConjunctiveLocalSearch({ state, commit, rootState}){
        try {
            let reqData = new FormData();
            // Generate list of selected and not selected point ids
            let selectedArchsSet = new Set(rootState.tradespacePlot.selectedArchs);
            let selectedIds = [];
            let nonSelectedIds = [];
            rootState.tradespacePlot.plotData.forEach(point => {
                if (selectedArchsSet.has(point.id)) {
                    selectedIds.push(point.id);
                }
                else {
                    nonSelectedIds.push(point.id);
                }
            });
            reqData.append('selected', JSON.stringify(selectedIds));
            reqData.append('non_selected', JSON.stringify(nonSelectedIds));
            reqData.append('supp', state.supportThreshold);
            reqData.append('conf', state.confidenceThreshold);
            reqData.append('lift', state.liftThreshold);
            reqData.append('problem', rootState.problem.problemName);
            reqData.append('input_type', rootState.problem.inputType);

            reqData.append('featureExpression', rootState.featureApplication.clickedExpression);
            reqData.append('logical_connective', 'AND');

            let dataResponse = await fetchPost(API_URL + 'eoss/analyst/get-marginal-driving-features', reqData);

            if (dataResponse.ok) {
                let features = await dataResponse.json();

                commit('addFeatures', features);
            }
            else {
                console.error('Error obtaining the driving features.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async runDisjunctiveLocalSearch({ state, commit, rootState}){
        try {
            let reqData = new FormData();
            // Generate list of selected and not selected point ids
            let selectedArchsSet = new Set(rootState.tradespacePlot.selectedArchs);
            let selectedIds = [];
            let nonSelectedIds = [];
            rootState.tradespacePlot.plotData.forEach(point => {
                if (selectedArchsSet.has(point.id)) {
                    selectedIds.push(point.id);
                }
                else {
                    nonSelectedIds.push(point.id);
                }
            });
            reqData.append('selected', JSON.stringify(selectedIds));
            reqData.append('non_selected', JSON.stringify(nonSelectedIds));
            reqData.append('supp', state.supportThreshold);
            reqData.append('conf', state.confidenceThreshold);
            reqData.append('lift', state.liftThreshold);
            reqData.append('problem', rootState.problem.problemName);
            reqData.append('input_type', rootState.problem.inputType);

            reqData.append('featureExpression', rootState.featureApplication.clickedExpression);
            reqData.append('logical_connective', 'OR');

            let dataResponse = await fetchPost(API_URL + 'eoss/analyst/get-marginal-driving-features', reqData);

            if (dataResponse.ok) {
                let features = await dataResponse.json();

                commit('addFeatures', features);
            }
            else {
                console.error('Error obtaining the driving features.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async getDrivingFeatures({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            // Generate list of selected and not selected point ids
            let selectedArchsSet = new Set(rootState.tradespacePlot.selectedArchs);
            let selectedIds = [];
            let nonSelectedIds = [];
            console.log(selectedArchsSet);
            rootState.tradespacePlot.plotData.forEach(point => {
                if (selectedArchsSet.has(point.id)) {
                    selectedIds.push(point.id);
                }
                else {
                    nonSelectedIds.push(point.id);
                }
            });
            reqData.append('selected', JSON.stringify(selectedIds));
            reqData.append('non_selected', JSON.stringify(nonSelectedIds));
            reqData.append('problem', rootState.problem.problemName);
            reqData.append('input_type', rootState.problem.inputType);

            let dataResponse = await fetchPost(API_URL + 'eoss/analyst/get-driving-features-epsilon-moea', reqData);

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
    },

    async setProblemParameters({ state, commit, rootState }) {
        try {
            console.log("-------> SETTING PROBLEM PARAMETERS");
            let reqData = new FormData();
            reqData.append('problem', rootState.problem.problemName);
            if (!rootState.problem.extra){
                console.error("Data mining cannot run as there is no orbit or instrument info");
            } else if(!rootState.problem.extra.instrumentList || !rootState.problem.extra.orbitList){
                console.error("Data mining cannot run as there is no orbit or instrument info");
            }else {
                let params = {orbit_list: rootState.problem.extra.orbitList, instrument_list: rootState.problem.extra.instrumentList};
                reqData.append('params', JSON.stringify(params));
            }
            let dataResponse = await fetchPost(API_URL + 'eoss/analyst/set-problem-parameters', reqData);

            if (dataResponse.ok) {}
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
        console.log("FEATURES");
        console.log(features);
        state.features = features;
        state.featureIDsJustAdded = [];
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
    addFeatures(state, features) {
        // Add a list of new features
        state.features = state.features.concat(features);
        state.featureIDsJustAdded = [];

        for(let i = 0; i < features.length; i++){
            let index = state.features.length - 1 - features.length + i;

            // Initialize id
            state.features[index].id = index;
            state.featureIDsJustAdded.push(index);

            // Compute new score
            let score = 1 - Math.sqrt(Math.pow(1 - features[i].metrics[2], 2) + Math.pow(1 - features[i].metrics[3], 2));
            state.scores.push(score);
        }

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
