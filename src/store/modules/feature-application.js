// initial state
const state = {
    hoveredExpression: '',
    clickedExpression: ''
};

// getters
const getters = {
    getHoveredExpression(state) {
        return state.hoveredExpression;
    },
    getClickedExpression(state) {
        return state.clickedExpression;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    setHoveredExpression(state, hoveredExpression) {
        // Set the problem instance
        state.hoveredExpression = hoveredExpression;
    },
    setClickedExpression(state, clickedExpression) {
        state.clickedExpression = clickedExpression;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
