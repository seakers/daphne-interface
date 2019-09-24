// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";


const state = {
    command: '',
    dialogueHistory: [],
    isLoading: false
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getIsLoading(state) {
        return state.isLoading;
    }
};

// actions
const actions = {
    async loadDialogue({ state, commit, rootState }) {
        try {
            let dataResponse = await fetchGet(API_URL + 'eoss/dialogue/history');

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setDialogueHistory', data['dialogue_pieces']);
            }
            else {
                console.error('Error retrieving past conversation history.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async executeCommand({ state, commit, rootState }) {
        commit('setIsLoading', true);
        try {
            let reqData = new FormData();
            reqData.append('command', state.command);
            commit('addDialoguePiece', {
                "voice_message": state.command,
                "visual_message_type": ["text"],
                "visual_message": [state.command],
                "writer": "user"
            });
            if (rootState.experiment.inExperiment) {
                let experimentStage = rootState.experiment.experimentStage;
                let restrictedQuestions = rootState.experiment.stageInformation[experimentStage].restrictedQuestions;
                if (restrictedQuestions !== null) {
                    reqData.append('allowed_commands', JSON.stringify(restrictedQuestions));
                }
            }
            let dataResponse = await fetchPost(API_URL + 'eoss/dialogue/command', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                console.log(data['response']['visual_answer_type']);
                commit('addDialoguePiece', data['response']);
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
    setDialogueHistory(state, dialogueHistory) {
        state.dialogueHistory = dialogueHistory;
    },
    addDialoguePiece(state, dialoguePiece) {
        state.dialogueHistory.push(dialoguePiece);
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
