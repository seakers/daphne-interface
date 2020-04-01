import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import { query__many_to_many } from "../../scripts/query-helpers";
import { insert__many_to_many } from "../../scripts/insert-helpers";
import { update__table_row } from "../../scripts/update-helpers";
import * as _ from 'lodash-es';
import Vue from 'vue'


const state = {

    //--------------\\
    //  Table Info  \\
    //--------------\\
    display_name: 'Problems',
    table_name: 'Problem',             // Panel Title
    table_headers: ['ID', 'Problem'],   // Column Headers
    row_keys: ['id', 'name'],           // Column Keys
    row_types: ['int', 'string'],

    //--------\\
    //  Rows  \\
    //--------\\
    problems__rows_mapper: {},

    //--------------\\
    //  Selections  \\
    //--------------\\
    selected_problem_id: '',
    selected_problem_name: '',
};



const getters = {

    //------------\\
    //  Get Rows  \\
    //------------\\
    problems__get_rows(state, getters, rootState){
        return state.problems__rows_mapper[rootState.groups.selected_group_id];
    },

    //------------------\\
    //  Get Selections  \\
    //------------------\\
    problems__get_selected_problem_id(state, getters, rootState){
        if(rootState.groups.selected_group_id === null){
            return null;
        }
        return state.selected_problem_id;
    },
    problems__get_selected_problem_name(state, getters, rootState){
        if(rootState.groups.selected_group_name === null){
            return null;
        }
        return state.selected_problem_name;
    },
};





const actions = {
    //--------------\\
    //  Query Rows  \\
    //--------------\\
    async problems__query({ state, commit, getters }){
        let num_goups = getters.groups__get_rows.length;
        for(let i = 0; i < num_goups; i++){
            let current_group = getters.groups__get_rows[i].objects;
            let row_objects = await query__many_to_many(current_group.id, 'Group', 'Join__Problem_Groups', state.table_name, state.row_keys, state.row_types);
            let params = [];
            params.push(current_group.id);
            params.push(row_objects);
            commit('problems__append_query', params);
        }
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    async problems__toggle_select({state, commit, rootState}, row_object) {
        let params = {};
        params['object'] = row_object;
        params['rootState'] = rootState;
        params['set_value'] = !row_object.selected_state;
        commit('problems__set_selected_row', params);

        if(!row_object.selected_state === true){
            commit('problems__set_id', null);
            commit('problems__set_name', null);
        }
        else{
            commit('problems__set_id', row_object.items[0]);
            commit('problems__set_name', row_object.items[1]);
        }
        
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    async problems__toggle_edit({state, commit, rootState}, row_object) {
        let params = {};
        params['object'] = row_object;
        params['rootState'] = rootState;
        params['set_value'] = !row_object.editing_state;
        commit('problems__set_edit_state', params);
    },
    async problems__commit_edit({state, commit, rootState}, row_object){
        // row_object (deep_copy) contains the user's changes

        // 1. Compare the unchanged row with the deep copy
        let unchanged_row = state.problems__rows_mapper[rootState.groups.selected_group_id][row_object.index];
        let new_name = row_object.items[1];
        let old_name = unchanged_row.items[1];

        // 2. If there are changes, commit those changes
        if(old_name !== new_name){
            update__table_row(row_object, row_object.table_name, state.row_keys, state.row_types);
            let params = [];
            params.push(row_object);
            params.push(rootState);
            commit('problems__update_row', params);
            commit('problems__reset_edit_all', rootState);
        }
    },

    //--------------\\
    //  Insert Row  \\
    //--------------\\
    async problems__insert_row({state, commit, getters, rootState}, row_object){        
        // row_object.items[0].value = `"${row_object.items[0].value}"`;
        let insert_object = await insert__many_to_many(row_object, state.table_name, 'Join__Problem_Groups', 'group_id', getters.groups__get_selected_group_id, state.row_keys, state.row_types);

        let params = {};
        params['insert_object'] = insert_object;
        params['group_id'] = getters.groups__get_selected_group_id;
        commit('problems__insert_row_local', params);
    },
};






const mutations = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    problems__append_query(state, params){
        Vue.set(state.problems__rows_mapper, params[0], params[1]);
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    problems__reset_select_all(state, rootState){
        let problems__rows = state.problems__rows_mapper[rootState.groups.selected_group_id];
        for(let x=0;x<problems__rows.length;x++){
            state.problems__rows_mapper[rootState.groups.selected_group_id][x]['selected_state'] = false;
        }
    },
    problems__set_selected_row(state, params) {
        let row_object = params.object;
        let rootState = params.rootState;
        let problems__rows = state.problems__rows_mapper[rootState.groups.selected_group_id];
        for(let x=0;x<problems__rows.length;x++){
            if(row_object.index === problems__rows[x].index){
                state.problems__rows_mapper[rootState.groups.selected_group_id][x]['selected_state'] = params.set_value;
            }
            else{
                state.problems__rows_mapper[rootState.groups.selected_group_id][x]['selected_state'] = false;
            }
        }
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    problems__reset_edit_all(state, rootState){
        let problems__rows = state.problems__rows_mapper[rootState.groups.selected_group_id];
        for(let x=0;x<problems__rows.length;x++){
            state.problems__rows_mapper[rootState.groups.selected_group_id][x]['editing_state'] = false;
        }
    },
    problems__update_row(state, params){
        let row_object = params[0];
        let rootState = params[1];
        state.problems__rows_mapper[rootState.groups.selected_group_id][row_object.index].items[1] = _.cloneDeep(row_object.items[1]);
    },
    problems__set_edit_state(state, params) {
        let row_object = params.object;
        let rootState = params.rootState;
        let problems__rows = state.problems__rows_mapper[rootState.groups.selected_group_id];
        for(let x=0;x<problems__rows.length;x++){
            if(row_object.index === problems__rows[x].index){
                state.problems__rows_mapper[rootState.groups.selected_group_id][x]['editing_state'] = params.set_value;
            }
            else{
                state.problems__rows_mapper[rootState.groups.selected_group_id][x]['editing_state'] = false;
            }
        }
    },

    //---------------------\\
    //  Current Selection  \\
    //---------------------\\
    problems__set_name(state, selected_problem_name){
        state.selected_problem_name = selected_problem_name;
    },
    problems__set_id(state, selected_problem_id){
        state.selected_problem_id = selected_problem_id;
    },


    //--------------\\
    //  Insert Row  \\
    //--------------\\
    problems__insert_row_local(state, params){
        state.problems__rows_mapper[params.group_id].push(params.insert_object);
    }


};








export default {
    state,
    getters,
    actions,
    mutations
}