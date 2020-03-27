import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    headers: ['name', 'description', 'weight'],

    panel_rows:        [{ name: 'example', description: 'exmple', weight: 'example'}],
    objective_rows:    [{ name: 'example', description: 'exmple', weight: 'example'}],
    subobjective_rows: [{ name: 'example', description: 'exmple', weight: 'example'}],

};

// const initialState = _.cloneDeep(state);

const getters = {};

const actions = {};

const mutations = {

};

export default {
    state,
    getters,
    actions,
    mutations
}