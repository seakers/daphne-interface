import * as _ from "lodash-es";

let functionalityTypes = new Map();
functionalityTypes.set('DaphneAnswer', { title: 'Answers', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('DesignBuilder', { title: 'Design Builder', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('DataMining', { title: 'Data Mining', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('Cheatsheet', { title: 'Cheatsheet', minSize: 'one-third', maxRepeat: 1000});
functionalityTypes.set('EOSSFilter', { title: 'Filter', minSize: 'one-third', maxRepeat: 1});
functionalityTypes.set('FeatureApplication', { title: 'Feature Application', minSize: 'one-third', maxRepeat: 1});

let newFunctionalityId = 0;

// initial state
// shape: [{ id, quantity }]
const state = {
    availableFunctionalities: [
        { name: 'DaphneAnswer', title: 'Answers', icon: 'fa-comments' },
        { name: 'DesignBuilder', title: 'Design Builder', icon: 'fa-search' },
        { name: 'DataMining', title: 'Data Mining', icon: 'fa-bar-chart' },
        { name: 'Cheatsheet', title: 'Cheatsheet', icon: 'fa-book' },
        { name: 'EOSSFilter', title: 'Filter', icon: 'fa-filter' },
        { name: 'FeatureApplication', title: 'Feature Application', icon: 'fa-sitemap' }
    ],
    functionalities: [],
    functionalityCount: {
        'DaphneAnswer': 0,
        'DesignBuilder': 0,
        'DataMining': 0,
        'Cheatsheet': 0,
        'EOSSFilter': 0,
        'FeatureApplication': 0
    }
};

const initialState = _.cloneDeep(state);

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
    },
    closeFunctionality(state, funcId) {
        let funcIndex = state.functionalities.findIndex((elem) => elem.id === funcId);
        let funcName = state.functionalities[funcIndex].name;
        state.functionalities.splice(funcIndex, 1);
        state.functionalityCount[funcName]--;
    },
    resetFunctionalityList(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    }

};

export default {
    state,
    getters,
    actions,
    mutations
}
