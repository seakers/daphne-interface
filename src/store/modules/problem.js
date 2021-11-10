import { calculateParetoRanking } from '../../scripts/utils';
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";
import {parse} from "graphql";

// initial state
const state = {
    groupId: null,
    problemId: null,
    // eslint-disable-next-line no-undef
    datasetId: null,
    status: false,
    ignoreQuery: true,
    problemData: [],
    dataUpdateFrom: '',
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
    getProblemId(state) {
        return state.problemId;
    },
    getProblemStatus(state) {
        return state.status;
    }
};

// actions
const actions = {
    async loadData({ state, commit }, parameters) {
        console.log('Importing data from the database...');

        try {
            let reqData = new FormData();

            let problemId = parameters['problem_id'];
            let groupId   = parameters['group_id'];
            let datasetId = parameters['dataset_id'];

            commit('setProblemId', problemId);
            commit('setGroupId', groupId);
            commit('setDatasetId', datasetId);

            reqData.append('problem_id', problemId);
            reqData.append('group_id', groupId);
            reqData.append('dataset_id', datasetId);

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
    async addNewData({ state, commit }, newData) {
        let problemData = state.importCallback([newData], state.extra);
        commit('addProblemData', problemData[0]);
        commit('addPlotData', problemData[0]);
    },
    // GENETIC
    async addNewDataFromGA({ state, commit }, newData) {
        // We can assume it's a new point as the server makes sure of that!
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
};

// mutations
const mutations = {
    setProblemStatus(state, status) {
        state.status = status;
    },
    setProblem(state, problemInfo) {
        // Set the problem instance
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
    setGroupId(state, groupId){
        state.groupId = groupId;
    },
    setProblemId(state, problemId) {
        state.problemId = problemId;
    },
    setDatasetId(state, datasetId) {
        state.datasetId = datasetId;
    },
    setIgnoreQuery(state, ignoreQuery) {
        state.ignoreQuery = ignoreQuery;
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
};

export default {
    state,
    getters,
    actions,
    mutations
}
