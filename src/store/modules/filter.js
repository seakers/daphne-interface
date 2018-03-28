// initial state
import * as _ from 'lodash-es';

const state = {
    presetOptions: [],
    selectedFilter: '',
    currentExpression: '',
    processFilterExpression: (point, expression, logic) => false // Should return true if a datapoint conforms to expression
};

let initialState = {};

// getters
const getters = {
    getPresetOptions(state) {
        return state.presetOptions;
    },
    getCurrentExpression(state) {
        return state.currentExpression;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    setFilter(state, filterInfo) {
        // Set the problem instance
        state.presetOptions = filterInfo.presetOptions;
        state.selectedFilter = filterInfo.selectedFilter;
        state.processFilterExpression = filterInfo.processFilterExpression;

        initialState = _.cloneDeep(state);
    },
    setSelectedFilter(state, selectedFilter) {
        state.selectedFilter = selectedFilter;
    },
    setCurrentExpression(state, currentExpression) {
        state.currentExpression = currentExpression;
    },
    resetFilter(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreFilter(state, recoveredState) {
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
