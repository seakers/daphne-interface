import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    page_selected: 'groups',
    light_theme: true,
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}