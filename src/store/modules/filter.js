// initial state
const state = {
    presetOptions: [],
    selectedFilter: '',
    currentExpression: '',
    processFilterExpression: (point, expression, logic) => false // Should return true if a datapoint conforms to expression
};

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
    },
    setSelectedFilter(state, selectedFilter) {
        state.selectedFilter = selectedFilter;
    },
    setCurrentExpression(state, currentExpression) {
        state.currentExpression = currentExpression;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
