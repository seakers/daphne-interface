import { calculateParetoRanking } from '../../scripts/utils';
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";
import {parse} from "graphql";

// initial state
const state = {
    group_id: null,
    problem_id: null,
    status: false,


    problemList: [
        'ClimateCentric',
        'SMAP',
        'SMAP_JPL1',
        'SMAP_JPL2',
        'Decadal2017Aerosols'
    ],
    problemName: '',
    vassarPort: 9090,
    problemData: [],
    dataUpdateFrom: '',
    datasetList: [],


    // eslint-disable-next-line no-undef
    datasetInformation: parseInt(PROBLEM__ID),
    inputNum: 0,
    outputNum: 0,
    inputList: [],
    outputList: [],
    outputObj: [], // 1 for larger-is-better, -1 for smaller-is-better
    inputType: 'binary',
    displayComponent: '',
    problemFunctionalities: [],
    importCallback: (data, extra) => {
        return {};
    }, // Callback function to be called after importing data (preprocessing)
    extra: {}, // Data that is exclusive to the problem at hand at won't be used for the general interfaces
    actualName2Index: (name, type) => -1, // To be implemented
    index2ActualName: (index, type) => '', // To be implemented
    displayName2Index: (input, type) => -1, // To be implemented
    index2DisplayName: (index, type) => '', // To be implemented
    ppFeatureSingle: (expression) => '' // To be implemented
};

let initialState = {};

// getters
const getters = {
    getProblemData(state) {
        return state.problemData;
    },
    getExtraInfo(state) {
        return state.extra;
    },
    getProblemModuleId(state) {
        return state.problem_id;
    },
    getProblemStatus(state) {
        return state.status;
    }
};

// actions
const actions = {


    async loadNewData({ state, commit }, parameters) {
        console.log('Importing data...');

        try {
            let reqData = new FormData();

            let problem_id = parameters['problem_id'];
            let group_id   = parameters['group_id'];

            reqData.append('problem_id', problem_id);
            reqData.append('group_id', group_id);

            commit('commitProblemId', problem_id);
            commit('commitGroupId', group_id);


            // GET PROBLEM DATA
            let dataResponse = await fetchPost(API_URL + 'eoss/data/import-data', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                let problemData = state.importCallback(data, state.extra);
                calculateParetoRanking(problemData);
                commit('updateProblemData', problemData);
                commit('setDataUpdateFrom', 'loadNewData');
            }
            else {
                console.error('Error accessing the data.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async reloadOldData({ state, commit }, oldData) {
        console.log("---> Old data", oldData);
        let problemData = state.importCallback(oldData, state.extra);
        console.log("---> Reload problem data", problemData);
        calculateParetoRanking(problemData);
        commit('updateProblemData', problemData);
        commit('setDataUpdateFrom', 'reloadOldData');
    },
    async addNewData({ state, commit }, newData) {
        let dataAlreadyThere = false;
        let newIndex = -1;
        state.problemData.forEach((d, i) => {
            if (d.outputs[0] === newData.outputs[0] && d.outputs[1] === newData.outputs[1]) {
                dataAlreadyThere = true;
                newIndex = i;
            }
        });

        if (!dataAlreadyThere) {
            let problemData = state.importCallback([newData], state.extra);
            commit('addProblemData', problemData[0]);
            commit('addPlotData', problemData[0]);
        }
        else {
            commit('updateClickedArch', newIndex);
        }
    },
    // GENETIC
    async addNewDataFromGA({ state, commit }, newData) {
        // We can assume it's a new point as the server makes sure of that!

        // we must add an ID to the new data
        newData.id = state.plotData.length;

        let problemData = state.importCallback([newData], state.extra);
        commit('addProblemData', problemData[0]);
        commit('addPlotDataFromGA', problemData[0]);
    },
    async addNewArchitecture({ state, commit }, arch) {
        // New architecture is pushed to front-end from graphql
        let reqData = new FormData();
        reqData.append('design', JSON.stringify(arch));
        let dataResponse = await fetchPost(API_URL + 'eoss/data/add-design', reqData);
    },
    async changeVassarPort({ state, commit }, port) {
        try {
            let reqData = new FormData();
            let vassarPort = state.vassarPort;
            if (port !== undefined) {
                vassarPort = port;
            }
            reqData.append('port', vassarPort);
            let dataResponse = await fetchPost(API_URL + 'eoss/settings/change-port', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
            }
            else {
                console.error('Error changing VASSAR port.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    // setting the problem name gets the different datasets for that problem
    async setProblemName({ state, commit, rootState }, problemName) {
        try {
            commit('setProblemName', problemName);


            let datasetList = [];
            commit('setDatasetList', datasetList);
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
};

// mutations
const mutations = {
    setProblemStatus(state, status) {
        state.status = status;
    },
    setProblem(state, problemInfo) {
        // Set the problem instance
        state.problemName = problemInfo.problemName;
        state.vassarPort = problemInfo.vassarPort;
        state.inputNum = problemInfo.inputNum;
        state.outputNum = problemInfo.outputNum;
        state.inputList = problemInfo.inputList;
        state.outputList = problemInfo.outputList;
        state.outputObj = problemInfo.outputObj;
        state.inputType = problemInfo.inputType;
        state.displayComponent = problemInfo.displayComponent;
        state.problemFunctionalities = problemInfo.problemFunctionalities;
        state.importCallback = problemInfo.importCallback;
        state.extra = problemInfo.extra;
        state.actualName2Index = problemInfo.actualName2Index;
        state.index2ActualName = problemInfo.index2ActualName;
        state.displayName2Index = problemInfo.displayName2Index;
        state.index2DisplayName = problemInfo.index2DisplayName;
        state.ppFeatureSingle = problemInfo.ppFeatureSingle;
        initialState = _.cloneDeep(state);
    },
    setProblemFunctions(state, problemInfo) {
        // Set the problem instance
        state.importCallback = problemInfo.importCallback;
        state.actualName2Index = problemInfo.actualName2Index;
        state.index2ActualName = problemInfo.index2ActualName;
        state.displayName2Index = problemInfo.displayName2Index;
        state.index2DisplayName = problemInfo.index2DisplayName;
        state.ppFeatureSingle = problemInfo.ppFeatureSingle;
    },
    setProblemName(state, problemName) {
        state.problemName = problemName;
    },
    setDatasetList(state, datasetList) {
        state.datasetList = datasetList;
    },
    setDatasetInformation(state, datasetInformation) {
        state.datasetInformation = datasetInformation;
    },
    updateExtra(state, extra) {
        state.extra = extra;
    },
    updateProblemData(state, problemData) {
        state.problemData = problemData;
    },
    addProblemData(state, newData) {
        state.problemData.splice(newData.id, 0, newData);
    },
    setDataUpdateFrom(state, dataUpdateFrom) {
        state.dataUpdateFrom = dataUpdateFrom;
    },
    resetProblem(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreProblem(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    },

    commitGroupId(state, group_id){
        state.group_id = group_id;
    },
    commitProblemId(state, problem_id) {
        state.problem_id = problem_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
