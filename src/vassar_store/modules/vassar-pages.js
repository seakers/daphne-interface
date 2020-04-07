import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    page_selected: 'groups',
    light_theme: true,

    message_display: false,
    message_content: '',
    success_message: false,
};

// const initialState = _.cloneDeep(state);

const getters = {};

const actions = {};

const mutations = {
    set_page_selected(state, page_selected) {
        state.page_selected = page_selected;
    },
    set_theme(state){
        state.light_theme = !state.light_theme;
    },

    push_error_message(state, message_content){
        state.message_content = message_content;
        state.message_display = true;
        state.success_message = false;
    },
    push_success_message(state, message_content){
        state.message_content = message_content;
        state.message_display = true;
        state.success_message = false;
    },
    set_hide_message(state){
        state.message_display = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}