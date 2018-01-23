// initial state
// shape: [{ id, quantity }]
const state = {
    mainPlotParams: {
        margin: {top: 20, right: 20, bottom: 30, left: 90},
        width: 960,
        height: 450,
        scale: 1
    },
    colorList: {
        default: 'rgba(110,110,110,255)',
        selected: 'rgba(25,186,215,255)',
        highlighted: 'rgba(248,101,145,255)',
        overlap: 'rgba(163,64,240,255)',
        mouseover: 'rgba(116,255,110,255)',
        hidden: 'rgba(110,110,110,22)',
        important: 'rgba(255,0,0,255)'
    }
};

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
    addFunctionality(state, functionality) {
        let funcInfo = functionalityTypes.get(functionality);

        if (state.functionalityCount[functionality] < funcInfo.maxRepeat) {
            // Add to columns and to the array
            state.functionalities.push({
                name: functionality,
                title: funcInfo.title,
                initialSize: funcInfo.minSize,
                id: newFunctionalityId++
            });
            state.functionalityCount[functionality]++;

            // Consider it added
            // PubSub.publish(functionality + '_added', newFunctionalityId-1);
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
