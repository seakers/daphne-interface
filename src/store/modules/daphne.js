// initial state
import * as _ from 'lodash-es';
import { fetchGet, fetchPost } from "../../scripts/fetch-helpers";
import filter from './filter';


const state = {
    command: '',
    dialogueHistory: [],
    isLoading: false
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
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
        catch (e) {
            console.error('Networking error:', e);
        }
    },
    async clearHistory({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'eoss/dialogue/clear-history', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit('setDialogueHistory', []);
            }
            else {
                console.error('Error clearing conversation history.');
            }
        }
        catch (e) {
            console.error('Networking error:', e);
        }
    },
    async executeCommand({ state, commit, rootState }) {
        try {
            commit('setIsLoading', true);
            commit('addDialoguePiece', {
                "voice_message": state.command,
                "visual_message_type": ["text"],
                "visual_message": [state.command],
                "writer": "user"
            });

            let reqData = new FormData();
            reqData.append('command', state.command);
            if (rootState.experiment.inExperiment) {
                let experimentStage = rootState.experiment.experimentStage;
                let restrictedQuestions = rootState.experiment.stageInformation[experimentStage].restrictedQuestions;
                if (restrictedQuestions !== null) {
                    reqData.append('allowed_commands', JSON.stringify(restrictedQuestions));
                }
            }
            const selectedArchs = rootState.tradespacePlot.selectedArchs ?
                Array.from(rootState.tradespacePlot.selectedArchs) : [];
            const highlightedArchs = rootState.tradespacePlot.highlightedArchs ?
                Array.from(rootState.tradespacePlot.highlightedArchs) : [];

            // Combine both arrays into one
            const combinedArchs = [...selectedArchs, ...highlightedArchs];
            console.log("added selected and highlighted archs to the chat", combinedArchs);

            const plotData = rootState.tradespacePlot.plotData;

            reqData.append('user_selected_ids', JSON.stringify(combinedArchs));
            reqData.append('plot_data', JSON.stringify(plotData));
            console.log("calling the chat function", reqData)
            let dataResponse = await fetchPost(API_URL + 'eoss/dialogue/command', reqData);


            if (dataResponse.ok) {
                let data = await dataResponse.json();
                // console.log(data['response']['visual_answer_type']);
                console.log("selected design ids chat", data['selected_designs']);
                if (data["selected_designs"] !== '' && data["selected_designs"].length > 0) {
                    console.log("set current expression");
                    commit('setCurrentExpression', data["selected_designs"], { root: true });
                }

                commit('addDialoguePiece', data['response']);
            }
            else {
                console.error('Error processing the command.');
            }
        }
        catch (e) {
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
