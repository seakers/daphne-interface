// initial state
const state = {
    command: '',
    response: {},
    isLoading: false
};

// getters
const getters = {
    getResponse(state) {
        return state.response;
    }
};

// actions
const actions = {
    async executeCommand({ state, commit }) {
        commit('setIsLoading', true);
        try {
            let reqData = new FormData();
            reqData.append('command', state.command);
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
