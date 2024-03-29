// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    runBackgroundSearch: false,
    runDiversifier: false,
    showEngineerSuggestions: false,
    showHistorianSuggestions: false,
    showAnalystSuggestions: false,
    engineerSuggestionsFrequency: 0,
    historianSuggestionsFrequency: 0,
    analystSuggestionsFrequency: 0,
    notificationTitle: "",
    notificationBody: "",
    notificationSetting: "",
    showNotification: false,
    modification: null,
    suggestionsByType: {}
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
    getFullSuggestionsList(state) {
        let fullSuggestionsList = [];
        for (let key in state.suggestionsByType) {
            // skip loop if the property is from prototype
            if (!state.suggestionsByType.hasOwnProperty(key)) continue;

            let suggestionsList = state.suggestionsByType[key];
            console.log(key, suggestionsList);
            fullSuggestionsList.push(...suggestionsList);
        }
        return fullSuggestionsList;
    }
};

// actions
const actions = {
    toggleRunBackgroundSearch({ state, commit, dispatch }, value) {
        if (value) {
            dispatch("startBackgroundSearch");
        }
        else {
            dispatch("stopBackgroundSearch");
        }
        commit("setRunBackgroundSearch", value);
    },

    async updateActiveSettings({ state }) {
        // Get the settings from the server to have them synced
        try {
            let reqData = new FormData();
            reqData.append('check_for_diversity', state.runDiversifier);
            reqData.append('show_engineer_suggestions', state.showEngineerSuggestions);
            reqData.append('engineer_suggestions_frequency', state.engineerSuggestionsFrequency);
            reqData.append('show_historian_suggestions', state.showHistorianSuggestions);
            reqData.append('historian_suggestions_frequency', state.historianSuggestionsFrequency);
            reqData.append('show_analyst_suggestions', state.showAnalystSuggestions);
            reqData.append('analyst_suggestions_frequency', state.analystSuggestionsFrequency);

            let url = API_URL + 'eoss/settings/active-feedback-settings';
            let dataResponse = await fetchPost(url, reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                console.log(data);
            }
            else {
                console.error('Error uploading settings to the server.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async retrieveActiveSettings({ commit }) {
        // Get the settings from the server to have them synced
        try {
            let url = API_URL + 'eoss/settings/active-feedback-settings';
            let dataResponse = await fetchGet(url);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                commit("setRunDiversifier", data["check_for_diversity"]);
                commit("setShowEngineerSuggestions", data["show_engineer_suggestions"]);
                commit("setShowHistorianSuggestions", data["show_historian_suggestions"]);
                commit("setShowAnalystSuggestions", data["show_analyst_suggestions"]);
                commit("setEngineerSuggestionsFrequency", data["engineer_suggestions_frequency"]);
                commit("setHistorianSuggestionsFrequency", data["historian_suggestions_frequency"]);
                commit("setAnalystSuggestionsFrequency", data["analyst_suggestions_frequency"]);
                console.log(data);
            }
            else {
                console.error('Error downloading settings from the server.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
};

// mutations
const mutations = {
    setRunBackgroundSearch(state, value) {
        state.runBackgroundSearch = value;
        if (value === false) {
            state.showFoundArchitectures = false;
        }
    },
    setRunDiversifier(state, value) {
        state.runDiversifier = value;
    },
    setShowEngineerSuggestions(state, value) {
        state.showEngineerSuggestions = value;
    },
    setShowHistorianSuggestions(state, value) {
        state.showHistorianSuggestions = value;
    },
    setShowAnalystSuggestions(state, value) {
        state.showAnalystSuggestions = value;
    },
    setEngineerSuggestionsFrequency(state, value) {
        state.engineerSuggestionsFrequency = value;
    },
    setHistorianSuggestionsFrequency(state, value) {
        state.historianSuggestionsFrequency = value;
    },
    setAnalystSuggestionsFrequency(state, value) {
        state.analystSuggestionsFrequency = value;
    },
    setNotificationTitle(state, notificationTitle) {
        state.notificationTitle = notificationTitle;
    },
    setNotificationBody(state, notificationBody) {
        state.notificationBody = notificationBody;
    },
    setNotificationSetting(state, notificationSetting) {
        state.notificationSetting = notificationSetting;
    },
    setShowNotification(state, showNotification) {
        state.showNotification = showNotification;
    },
    setActiveModification(state, activeModification) {
        state.modification = activeModification
    },
    addSuggestionListType(state, suggestionsInfo) {
        Vue.set(state.suggestionsByType, suggestionsInfo.type, suggestionsInfo.list);
    },
    clearSuggestionsByType(state) {
        state.suggestionsByType = {};
    },
    resetActive(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    restoreActive(state, recoveredState) {
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
