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
        important: 'rgba(255,0,0,255)',
        ga: 'rgba(0,0,255,255)'
    },
    clickedArch: -1,
    clickedArchInputs: [],
    hoveredArch: -1,
    colorMap: {},
    selectionMode: 'zoom-pan',
    selectedArchs: [],
    highlightedArchs: [],
    hiddenArchs: [],
    gaArchs: [],
    gaStatus: false,
    nextColor: 1
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
                else if (state.gaArchs[index]) {
                    return state.colorList.ga;
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
        state.gaArchs = [];
        state.gaArchs.length = plotData.length;
        state.gaArchs.fill(false);

        // Function to create new colours for the picking.
        function genColor() {
            let ret = [];
            if (state.nextColor < 16777215) {
                ret.push(state.nextColor & 0xff); // R
                ret.push((state.nextColor & 0xff00) >> 8); // G
                ret.push((state.nextColor & 0xff0000) >> 16); // B
                state.nextColor += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        // Add one unique color to each point and save the backreference
        state.colorMap = {};
        plotData.forEach(point => {
            point.interactColor = genColor();
            state.colorMap[point.interactColor] = point.id;
        });

        state.plotData = plotData;
    },
    addPlotData(state, problemData) {
        // Function to create new colours for the picking.
        function genColor() {
            let ret = [];
            if (state.nextColor < 16777215) {
                ret.push(state.nextColor & 0xff); // R
                ret.push((state.nextColor & 0xff00) >> 8); // G
                ret.push((state.nextColor & 0xff0000) >> 16); // B
                state.nextColor += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        let lengthDiff = problemData.length - state.plotData.length;
        for (let i = 0; i < lengthDiff; ++i) {
            state.selectedArchs.push(false);
            state.highlightedArchs.push(false);
            state.hiddenArchs.push(false);
            state.gaArchs.push(false);
            let plotPoint = JSON.parse(JSON.stringify(problemData[state.plotData.length+i]));
            plotPoint.interactColor = genColor();
            state.colorMap[plotPoint.interactColor] = plotPoint.id;
            state.plotData.push(plotPoint);
        }

        if (lengthDiff !== 0) {
            state.clickedArch = state.plotData.length - 1;
        }
    },
    addPlotDataFromGA(state, problemData) {
        // Function to create new colours for the picking.
        function genColor() {
            let ret = [];
            if (state.nextColor < 16777215) {
                ret.push(state.nextColor & 0xff); // R
                ret.push((state.nextColor & 0xff00) >> 8); // G
                ret.push((state.nextColor & 0xff0000) >> 16); // B
                state.nextColor += 1;
            }
            return 'rgb(' + ret.join(',') + ')';
        }

        let lengthDiff = problemData.length - state.plotData.length;
        for (let i = 0; i < lengthDiff; ++i) {
            state.selectedArchs.push(false);
            state.highlightedArchs.push(false);
            state.hiddenArchs.push(false);
            state.gaArchs.push(true);
            let plotPoint = JSON.parse(JSON.stringify(problemData[state.plotData.length+i]));
            plotPoint.interactColor = genColor();
            state.colorMap[plotPoint.interactColor] = plotPoint.id;
            state.plotData.push(plotPoint);
        }
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
    setGaStatus(state, gaStatus) {
        console.log("Setting GA Status", gaStatus);
        state.gaStatus = gaStatus;
    },
    clearHighlightedArchs(state) {
        state.highlightedArchs = [];
        state.highlightedArchs.length = state.plotData.length;
        state.highlightedArchs.fill(false);
    },
    clearGaArchs(state) {
        state.gaArchs = [];
        state.gaArchs.length = state.plotData.length;
        state.gaArchs.fill(false);
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
