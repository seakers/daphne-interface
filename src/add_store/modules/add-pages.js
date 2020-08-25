import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    page_selected: 'graph',
    light_theme: true,

    selections: {
        'Group': {name: null, id: 1},
        'Orbit': {name: null, id: null},
        'Launch_Vehicle': {name: null, id: null},
    }

};

// const initialState = _.cloneDeep(state);

const getters = {
    get_group_id(state){
        return state.selections.Group.id;
    },
    get_group_name(state){
        return state.selections.Group.name;
    },

    get_orbit_id(state){
        return state.selections.Orbit.id;
    },
    get_orbit_name(state){
        return state.selections.Orbit.name;
    },

    get_launch_vehicle_id(state){
        return state.selections['Launch Vehicle'].id;
    },
    get_launch_vehicle_name(state){
        return state.selections['Launch Vehicle'].name;
    },
};

const actions = {};

const mutations = {
    set_page_selected(state, page_selected) {
        state.page_selected = page_selected;
    },
    set_theme(state){
        state.light_theme = !state.light_theme;
    },
    set_global_id(state, params){
        Vue.set(state.selections[params[0]], 'id', params[1]);
        Vue.set(state.selections[params[0]], 'name', params[2]);
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
