// initial state
import * as _ from 'lodash-es';

const state = {
    command: '',
    response: {},
    isLoading: false
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getResponse(state) {
        return state.response;
    },
    getIsLoading(state) {
        return state.isLoading;
    }
};

// actions
const actions = {
    async executeCommand({ state, commit, rootState }) {
        commit('setIsLoading', true);
        try {
            let reqData = new FormData();
            reqData.append('command', state.command);
            if (rootState.experiment.inExperiment) {
                let experimentStage = rootState.experiment.experimentStage;
                let restrictedQuestions = rootState.experiment.stageInformation[experimentStage].restrictedQuestions;
                if (restrictedQuestions !== null) {
                    reqData.append('allowed_commands', JSON.stringify(restrictedQuestions));
                }
            }
            let dataResponse = await fetch(
                '/api/daphne/command',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setResponse', data['response']);
            }
            else {
                console.error('Error processing the command.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
        commit('setIsLoading', false);
    }
};

// mutations
const mutations = {
    setCommand(state, command) {
        state.command = command;
    },
    setResponse(state, response) {
        state.response = response;
    },
    setIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    resetDaphne(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreDaphne(state, recoveredState) {
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
