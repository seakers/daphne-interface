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
        ga: 'rgba(0,0,255,255)',
        human: 'rgb(128,0,0)',
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
    humanArchs: [],
    gaStatus: false,
    nextColor: 1
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getNumPoints(state) {
        return state.plotData.length;
    },
    getHoveredArch(state) {
        return state.hoveredArch;
    },
    getClickedArch(state) {
        return state.clickedArch;
    },
    getPointColor: (state) => (index, selectedArchsSet, highlightedArchsSet, gaArchsSet, humanArchsSet) => {
        if (state.clickedArch === index) {
            return state.colorList.important;
        }
        else {
            if (state.hoveredArch === index) {
                return state.colorList.mouseover;
            }
            else {
                if (selectedArchsSet.has(index) && highlightedArchsSet.has(index)) {
                    return state.colorList.overlap;
                }
                else if (selectedArchsSet.has(index)) {
                    return state.colorList.selected;
                }
                else if (highlightedArchsSet.has(index)) {
                    return state.colorList.highlighted;
                }
                else if (gaArchsSet.has(index)) {
                    return state.colorList.ga;
                }
                else if (humanArchsSet.has(index)) {
                    return state.colorList.human;
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
        state.highlightedArchs = [];
        state.hiddenArchs = [];
        state.gaArchs = [];
        state.humanArchs = [];

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
        let plotPoint = JSON.parse(JSON.stringify(problemData));
        plotPoint.interactColor = genColor();
        state.colorMap[plotPoint.interactColor] = plotPoint.id;
        state.plotData.splice(plotPoint.id, 0, plotPoint);
    },
    addPlotDataFromHuman(state, problemData) {
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

        let plotPoint = JSON.parse(JSON.stringify(problemData));
        plotPoint.interactColor = genColor();
        state.colorMap[plotPoint.interactColor] = plotPoint.id;
        state.plotData.splice(plotPoint.id, 0, plotPoint);
        state.humanArchs.push(plotPoint.id);
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

        let plotPoint = JSON.parse(JSON.stringify(problemData));
        plotPoint.interactColor = genColor();
        state.colorMap[plotPoint.interactColor] = plotPoint.id;
        state.plotData.splice(plotPoint.id, 0, plotPoint);
        state.gaArchs.push(plotPoint.id);
    },
    updateClickedArch(state, clickedArch) {
        state.clickedArch = clickedArch;
        state.clickedArchInputs = state.plotData.find((point) => point.id === state.clickedArch).inputs;
    },
    updateClickedArch_DB(state, clickedArch_db) {
        let point_local_id = state.plotData.find((point) => point.db_id === clickedArch_db).id;
        state.clickedArch = point_local_id;
        state.clickedArchInputs = state.plotData.find((point) => point.id === state.clickedArch).inputs;
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
    },
    setGaStatus(state, gaStatus) {
        console.log("Setting GA Status", gaStatus);
        state.gaStatus = gaStatus;
    },
    clearHighlightedArchs(state) {
        state.highlightedArchs = [];
    },
    clearGaArchs(state) {
        state.gaArchs = [];
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
