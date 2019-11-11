// initial state
import * as _ from 'lodash-es';

const state = {
    hoveredExpression: '',
    clickedExpression: ''
};

const initialState = _.cloneDeep(state);

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
    },
    resetFeatureApplication(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreFeatureApplication(state, recoveredState) {
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
