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
    clickedArch: -1,
    clickedArchInputs: [],
    hoveredArch: -1,
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
    },
    getHoveredArch(state) {
        return state.hoveredArch;
    },
    getClickedArch(state) {
        return state.clickedArch;
    },
    getPointColor: (state) => (index) => {
        let point = state.plotData[index];
        if (state.clickedArch === index) {
            return state.colorList.important;
        }
        else {
            if (state.hoveredArch === index) {
                return state.colorList.mouseover;
            }
            else {
                if (point.selected && point.highlighted) {
                    return state.colorList.overlap;
                }
                else if (point.selected) {
                    return state.colorList.selected;
                }
                else if (point.highlighted) {
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
            point.selected = false;
            point.highlighted = false;
            point.hidden = false;
        });
        // Mark the last point added as the selected one
        state.clickedArch = plotData.length - 1;
        state.clickedArchInputs = plotData[state.clickedArch].inputs;

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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
