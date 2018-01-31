// initial state
const state = {
    command: '',
    response: {}
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
    }
};

// mutations
const mutations = {
    setCommand(state, command) {
        state.command = command;
    },
    setResponse(state, response) {
        state.response = response;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
