import { calculateParetoRanking } from '../../scripts/utils';
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";

// initial state
const state = {
    problem_id: null,


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
    datasetInformation: {
        filename: 'EOSS_data_recalculated.csv',
        user: false
    },
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
};

// actions
const actions = {


    async loadNewData({ state, commit }, datasetInformation) {
        console.log('Importing data...');

        try {
            let reqData = new FormData();


            reqData.append('problem_id', '5');
            reqData.append('group_id', '1');
            reqData.append('load_user_files', datasetInformation.user);


            // GET PROBLEM DATA
            let dataResponse = await fetchPost(API_URL + 'eoss/data/import-data', reqData);

            console.log("---> Importing new data");
            console.log(dataResponse);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                console.log("---> Problem data1", data);
                let problemData = state.importCallback(data, state.extra);
                console.log("---> Problem data2", problemData);
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
        let problemData = state.importCallback([newData], state.extra);
        commit('addProblemData', problemData[0]);
        commit('addPlotDataFromGA', problemData[0]);
    },
    async addNewArchitecture({ state, commit }, arch) {
        // New architecture is pushed to front-end from graphql
        console.log("--> Adding new design", JSON.stringify(arch));
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

            // let reqData = new FormData();
            // reqData.append('problem', problemName);
            // let dataResponse = await fetchPost(API_URL + 'eoss/data/dataset-list', reqData);

            // if (dataResponse.ok) {
            //     let data = await dataResponse.json();
            //     let datasetList = [];
            //     data['default'].forEach((dataset) => {
            //         datasetList.push({
            //             name: dataset,
            //             value: dataset,
            //             user: false
            //         });
            //     });
            //     datasetList.push({
            //         name: '---',
            //         value: ''
            //     });
            //     data['user'].forEach((dataset) => {
            //         datasetList.push({
            //             name: dataset,
            //             value: dataset,
            //             user: true
            //         });
            //     });

            //     // let datasetList = [];
            //     commit('setDatasetList', datasetList);
            // }

            let datasetList = [];
            commit('setDatasetList', datasetList);
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },


    // LOADS NEW PROBLEM
    async setProblemId({ state, commit }, new_id) {
        console.log("---> Loading new problem: " + new_id);

        commit('commitProblemId', new_id);
    },
};

// mutations
const mutations = {
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


    commitProblemId(state, new_id) {
        state.problem_id = new_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
