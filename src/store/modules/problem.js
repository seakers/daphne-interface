// initial state
const state = {
    problemData: [],
    resultFilename: '', // String
    inputNum: 0,
    outputNum: 0,
    inputList: [],
    outputList: [],
    outputObj: [], // 1 for larger-is-better, -1 for smaller-is-better
    importCallback: (data) => {
        return {
            problemData: data,
            extra: {}
        };
    }, // Callback function to be called after importing data (preprocessing)
    extra: {} // Data that is exclusive to the problem at hand at won't be used for the general interfaces
};

// getters
const getters = {
    getProblemData(state) {
        return state.problemData;
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
                '/api/ifeed/import-data/',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();

                let {problemData, extra} = await state.importCallback(data);
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
        state.importCallback = problemInfo.importCallback;
        state.extra = problemInfo.extra;
    },
    updateExtra(state, extra) {
        state.extra = extra;
    },
    updateProblemData(state, problemData) {
        state.problemData = problemData;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
