// initial state
import * as _ from 'lodash-es';
import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    runBackgroundSearch: true,
    runProactiveTeacher: false,
    showFoundArchitectures: true,
    runDiversifier: false,
    showSuggestions: false,
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
    toggleProactiveTeacher({ state, commit, dispatch }, value) {
        if (value) {
            dispatch("turnProactiveTeacherOn");
        }
        else {
            dispatch("turnProactiveTeacherOff");
        }
        commit("setRunProactiveTeacher", value);
    },

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
            reqData.append('show_background_search_feedback', state.showFoundArchitectures);
            reqData.append('check_for_diversity', state.runDiversifier);
            reqData.append('show_arch_suggestions', state.showSuggestions);

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
                commit("setShowFoundArchitectures", data["show_background_search_feedback"]);
                commit("setRunDiversifier", data["check_for_diversity"]);
                commit("setShowSuggestions", data["show_arch_suggestions"]);
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
    setRunProactiveTeacher(state, value) {
        state.runProactiveTeacher = value;
    },
    setRunBackgroundSearch(state, value) {
        state.runBackgroundSearch = value;
        if (value === false) {
            state.showFoundArchitectures = false;
        }
    },
    setShowFoundArchitectures(state, value) {
        state.showFoundArchitectures = value;
    },
    setRunDiversifier(state, value) {
        state.runDiversifier = value;
    },
    setShowSuggestions(state, value) {
        state.showSuggestions = value;
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
