import * as _ from 'lodash-es';

let functionalityTypes = new Map();
functionalityTypes.set('DaphneAnswer', { title: 'Answers', component: 'DaphneAnswer', class: 'answers', minSize: 'half', maxRepeat: 1});
functionalityTypes.set('DesignBuilder', { title: 'Design Builder', component: 'DesignBuilder', class: 'design-builder', minSize: 'full', maxRepeat: 1});
functionalityTypes.set('DataMining', { title: 'Data Mining', component: 'DataMining', class: 'data-mining', minSize: 'half', maxRepeat: 1});
functionalityTypes.set('EOSSFilter', { title: 'Filter', component: 'EOSSFilter', class: 'filter', minSize: 'half', maxRepeat: 1});
functionalityTypes.set('FeatureApplication', { title: 'Feature Application', component: 'FeatureApplication', class: 'feature-application', minSize: 'half', maxRepeat: 1});
functionalityTypes.set('OrbitInstrInfo', {
    title: 'Orbits and Instruments Information',
    component: 'Cheatsheet',
    class: 'orbit-instr-info',
    minSize: 'half',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "Orbits Information", value: "orb_info"},
        {name: "Instruments Information", value: "instr_info"}
    ]});
functionalityTypes.set('AvailableCommands', {
    title: 'Available Commands',
    component: 'Cheatsheet',
    class: 'available-commands',
    minSize: 'half',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "General", value: "general"},
        {name: "Engineer", value: "engineer"},
        {name: "Analyst", value: "analyst"},
        {name: "Explorer", value: "explorer"},
        {name: "Historian", value: "historian"},
        {name: "Critic", value: "critic"}
    ]});
functionalityTypes.set('CommandsInformation', {
    title: 'Commands Information',
    component: 'Cheatsheet',
    class: 'commands-information',
    minSize: 'half',
    maxRepeat: 10,
    optionsList: [
        {name: "", value: ""},
        {name: "Instruments (Engineer)", value: "engineer_instruments"},
        {name: "Instrument Parameters (Engineer)", value: "engineer_instrument_parameters"},
        {name: "Measurements (Engineer)", value: "engineer_measurements"},
        {name: "Stakeholders (Engineer)", value: "engineer_stakeholders"},
        {name: "Objectives (Engineer)", value: "engineer_objectives"},
        {name: "Subobjectives (Engineer)", value: "engineer_subobjectives"},
        {name: "Measurements (Historian)", value: "historian_measurements"},
        {name: "Missions (Historian)", value: "historian_missions"},
        {name: "Technologies (Historian)", value: "historian_technologies"},
        {name: "Space Agencies (Historian)", value: "historian_space_agencies"}
    ]});
functionalityTypes.set('TimelinePlot', {
    title: 'Timeline Plot',
    component: 'TimelinePlot',
    class: 'timeline-plot',
    minSize: 'half',
    maxRepeat: 10
});
functionalityTypes.set('Scheduler', {
    title: 'Scheduler',
    component: 'Scheduling',
    class: 'scheduling',
    minSize: 'half',
    maxRepeat: 10
});


let newFunctionalityId = 0;

// initial state
// shape: [{ id, quantity }]
const state = {
    availableFunctionalities: [
        { name: 'DaphneAnswer', title: 'Answers', icon: 'fa-comments' },
        { name: 'DesignBuilder', title: 'Design Builder', icon: 'fa-search' },
        { name: 'DataMining', title: 'Data Mining', icon: 'fa-chart-bar' },
        { name: 'EOSSFilter', title: 'Filter', icon: 'fa-filter' },
        { name: 'FeatureApplication', title: 'Feature Application', icon: 'fa-sitemap' },
        { name: 'OrbitInstrInfo', title: 'Orbits and Instruments Information', icon: 'fa-book' },
        { name: 'AvailableCommands', title: 'Available Commands', icon: 'fa-book' },
        { name: 'CommandsInformation', title: 'Commands Information', icon: 'fa-book' },
        { name: 'Scheduler', title: 'Scheduling Formulation', icon: 'fa-book' }
    ],
    functionalities: [],
    functionalityCount: {
        'DaphneAnswer': 0,
        'DesignBuilder': 0,
        'DataMining': 0,
        'EOSSFilter': 0,
        'FeatureApplication': 0,
        'OrbitInstrInfo': 0,
        'AvailableCommands': 0,
        'CommandsInformation': 0,
        'TimelinePlot': 0,
        'Scheduler': 0
    }
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getOptionsList: (state) => (name) => {
        return functionalityTypes.get(name).optionsList;
    }
};

// actions
const actions = {
};

// mutations
const mutations = {
    addFunctionality(state, {functionality, funcData}) {
        let funcInfo = functionalityTypes.get(functionality);

        if (state.functionalityCount[functionality] < funcInfo.maxRepeat) {
            // Add to columns and to the array
            state.functionalities.push({
                name: functionality,
                component: funcInfo.component,
                title: funcInfo.title,
                funcClass: funcInfo.class,
                initialSize: funcInfo.minSize,
                id: newFunctionalityId++,
                funcData: funcData
            });
            state.functionalityCount[functionality]++;
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
    },
    restoreFunctionalityList(state, recoveredState) {
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
