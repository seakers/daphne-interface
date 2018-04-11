import { calculateParetoRanking } from '../../scripts/utils';
import * as _ from 'lodash-es';

// initial state
const state = {
    problemData: [],
    resultFilename: '', // String
    inputNum: 0,
    outputNum: 0,
    inputList: [],
    outputList: [],
    outputObj: [], // 1 for larger-is-better, -1 for smaller-is-better
    displayComponent: '',
    importCallback: (data) => {
        return {
            problemData: data,
            extra: {}
        };
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
    }
};

// actions
const actions = {
    async loadNewData({ state, commit }, fileName) {
        console.log('Importing data...');

        try {
            let reqData = new FormData();
            reqData.append('filename', fileName);
            let dataResponse = await fetch(
                '/api/ifeed/import-data',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                let {problemData, extra} = await state.importCallback(data);
                calculateParetoRanking(problemData);
                commit('updateExtra', extra);
                commit('updateProblemData', problemData);
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
        let dataAlreadyThere = false;
        let newIndex = -1;
        state.problemData.forEach((d, i) => {
            if (d.outputs[0] === newData.outputs[0] && d.outputs[1] === newData.outputs[1]) {
                dataAlreadyThere = true;
                newIndex = i;
            }
        });

        if (!dataAlreadyThere) {
            let procData = await state.importCallback([newData]);
            commit('addProblemData', procData.problemData[0]);
        }
        else {
            commit('updateClickedArch', newIndex);
        }
    },
    async changeProblemLoadedFiles({ state, commit }, filesDict) {
        try {
            let reqData = new FormData();
            reqData.append('loaded_files', JSON.stringify(filesDict));
            let dataResponse = await fetch(
                '/api/vassar/change-loaded-files',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
            }
            else {
                console.error('Error accessing the data.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setProblem(state, problemInfo) {
        // Set the problem instance
        state.inputNum = problemInfo.inputNum;
        state.outputNum = problemInfo.outputNum;
        state.inputList = problemInfo.inputList;
        state.outputList = problemInfo.outputList;
        state.outputObj = problemInfo.outputObj;
        state.displayComponent = problemInfo.displayComponent;
        state.importCallback = problemInfo.importCallback;
        state.extra = problemInfo.extra;
        state.actualName2Index = problemInfo.actualName2Index;
        state.index2ActualName = problemInfo.index2ActualName;
        state.displayName2Index = problemInfo.displayName2Index;
        state.index2DisplayName = problemInfo.index2DisplayName;
        state.ppFeatureSingle = problemInfo.ppFeatureSingle;
        initialState = _.cloneDeep(state);
    },
    updateExtra(state, extra) {
        state.extra = extra;
    },
    updateProblemData(state, problemData) {
        state.problemData = problemData;
    },
    addProblemData(state, newData) {
        state.problemData.push(newData);
    },
    resetProblem(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreProblem(state, recoveredState) {
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
