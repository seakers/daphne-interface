import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    pages: ['stakeholders', 'instruments', 'requirement rules', 'mission analysis', 'attributes', 'groups', 'problems'],
    page_selected: 'groups',
};

// const initialState = _.cloneDeep(state);

const getters = {};

const actions = {};

const mutations = {
    set_page_selected(state, page_selected) {
        state.page_selected = page_selected;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}