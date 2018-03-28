// initial state
// shape: [{ id, quantity }]
import * as _ from 'lodash-es';

const state = {
    plotData: [],
    colorList: {
        default: 'rgba(110,110,110,255)',
        selected: 'rgba(25,186,215,255)',
        highlighted: 'rgba(248,101,145,255)',
        overlap: 'rgba(163,64,240,255)',
        mouseover: 'rgba(116,255,110,255)',
        hidden: 'rgba(110,110,110,22)',
        important: 'rgba(255,0,0,255)'
    },
    clickedArch: -1,
    clickedArchInputs: [],
    hoveredArch: -1,
    colorMap: {},
    selectionMode: 'zoom-pan',
    selectedArchs: [],
    highlightedArchs: [],
    hiddenArchs: []
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getPlotData(state) {
        return state.plotData;
    },
    getColorMap(state) {
        return state.colorMap;
    },
    getNumPoints(state) {
        return state.plotData.length;
    },
    getHoveredArch(state) {
        return state.hoveredArch;
    },
    getClickedArch(state) {
        return state.clickedArch;
    },
    getPointColor: (state) => (index) => {
        if (state.clickedArch === index) {
            return state.colorList.important;
        }
        else {
            if (state.hoveredArch === index) {
                return state.colorList.mouseover;
            }
            else {
                if (state.selectedArchs[index] && state.highlightedArchs[index]) {
                    return state.colorList.overlap;
                }
                else if (state.selectedArchs[index]) {
                    return state.colorList.selected;
                }
                else if (state.highlightedArchs[index]) {
                    return state.colorList.highlighted;
                }
                else {
                    return state.colorList.default;
                }
            }
        }
    },
    getPointShape: (state) => (index) => {
        if (state.clickedArch === index) {
            return 'cross';
        }
        else {
            return 'circle';
        }
    },
    getSelectedArchs(state) {
        return state.selectedArchs;
    },
    getHighlightedArchs(state) {
        return state.highlightedArchs;
    },
    getHiddenArchs(state) {
        return state.hiddenArchs;
    }
};

// actions
const actions = {
    updatePlotData({state, commit}, problemData) {
        commit('updatePlotData', problemData);
        // Mark the last point added as the selected one
        if (state.plotData.length > 0) {
            commit('updateClickedArch', state.plotData.length - 1);
        }
    }
};

// mutations
const mutations = {
    updatePlotData(state, problemData) {
        let plotData = JSON.parse(JSON.stringify(problemData));
        // Create aux arrays
        state.selectedArchs = [];
        state.selectedArchs.length = plotData.length;
        state.selectedArchs.fill(false);
        state.highlightedArchs = [];
        state.highlightedArchs.length = plotData.length;
        state.highlightedArchs.fill(false);
        state.hiddenArchs = [];
        state.hiddenArchs.length = plotData.length;
        state.hiddenArchs.fill(false);

        // Function to create new colours for the picking.
        let nextCol = 1;
        function genColor() {
            let ret = [];
            if (nextCol < 16777215) {
                ret.push(nextCol & 0xff); // R
                ret.push((nextCol & 0xff00) >> 8); // G
                ret.push((nextCol & 0xff0000) >> 16); // B
                nextCol += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        // Add one unique color to each point and save the backreference
        state.colorMap = {};
        plotData.forEach((point, index) => {
            point.interactColor = genColor();
            state.colorMap[point.interactColor] = index;
        });

        state.plotData = plotData;
    },
    updateClickedArch(state, clickedArch) {
        state.clickedArch = clickedArch;
        state.clickedArchInputs = state.plotData[state.clickedArch].inputs;
    },
    updateHoveredArch(state, hoveredArch) {
        state.hoveredArch = hoveredArch;
    },
    updateClickedArchInputs(state, inputs) {
        state.clickedArchInputs = inputs;
    },
    updateSelectionMode(state, selectionMode) {
        state.selectionMode = selectionMode;
    },
    updateSelectedArchs(state, selectedArchs) {
        state.selectedArchs = selectedArchs;
    },
    updateHighlightedArchs(state, highlightedArchs) {
        state.highlightedArchs = highlightedArchs;
    },
    clearSelectedArchs(state) {
        state.selectedArchs = [];
        state.selectedArchs.length = state.plotData.length;
        state.selectedArchs.fill(false);
    },
    clearHighlightedArchs(state) {
        state.highlightedArchs = [];
        state.highlightedArchs.length = state.plotData.length;
        state.highlightedArchs.fill(false);
    },
    resetTradespacePlot(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreTradespacePlot(state, recoveredState) {
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
