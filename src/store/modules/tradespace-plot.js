// initial state
// shape: [{ id, quantity }]
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
    selectedArch: -1,
    colorMap: {}
};

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
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    updatePlotData(state, problemData) {
        let plotData = JSON.parse(JSON.stringify(problemData));
        plotData.forEach(point => {
            point.modifiedInputs = point.inputs;
            point.selected = false;
            point.highlighted = false;
            point.hidden = false;
            point.drawingColor = state.colorList.default;
            point.importantColor = state.colorList.important;
            point.shape = 'circle';
        });
        // Mark the last point added as the selected one
        plotData[plotData.length-1].shape = 'cross';
        state.plotData = plotData;
        state.selectedArch = state.plotData[state.plotData.length-1];

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
        state.plotData.forEach(point => {
            point.interactColor = genColor();
            state.colorMap[point.interactColor] = point;
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
