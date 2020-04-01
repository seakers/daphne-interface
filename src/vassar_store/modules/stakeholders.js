import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import { query__one_to_many } from "../../scripts/query-helpers";
import { insert__one_to_many } from "../../scripts/insert-helpers";
import { update__table_row } from "../../scripts/update-helpers";
import * as _ from 'lodash-es';
import Vue from 'vue'

// Stakeholder_Needs_Panel
// Stakeholder_Needs_Objective
// Stakeholder_Needs_Subobjective

const state = {

    //--------------\\
    //  Table Info  \\
    //--------------\\
    panels__display_name: 'Panels',
    panels__table_name: 'Stakeholder_Needs_Panel',

    objectives__display_name: 'Objectives',
    objectives__table_name: 'Stakeholder_Needs_Objective',

    subobjectives__display_name: 'Subobjectives',
    subobjectives__table_name: 'Stakeholder_Needs_Subobjective',

    // Each table will have the same headers / keys / types
    table_headers: ['ID', 'Name', 'Description', 'weight'],
    row_keys: ['id', 'name', 'description', 'weight'],
    row_types: ['int', 'string', 'string', 'float'],

    //--------\\
    //  Rows  \\
    //--------\\
    panels__rows: [],               // Loaded for one problem
    objectives__rows_mapper: {},    // Maps all loaded panels to objectives
    subobjectives__rows_mapper: {}, // Maps all loaded objectives to subobjectives

    //--------------\\
    //  Selections  \\
    //--------------\\
    selected_panel_name: null,
    selected_panel_id: null,

    selected_objective_name: null,
    selected_objective_id: null,

    selected_subobjective_name: null,
    selected_subobjective_id: null,

};

// const initialState = _.cloneDeep(state);

const getters = {

    //------------\\
    //  Get Rows  \\
    //------------\\
    panels__get_rows(state, getters, rootState){
        return state.panels__rows;
    },
    objectives__get_rows(state, getters, rootState){
        if(state.selected_panel_id === null){return false;}
        return state.objectives__rows_mapper[state.selected_panel_id];
    },
    subobjectives__get_rows(state, getters, rootState){
        if(state.selected_objective_id === null){return false;}
        return state.subobjectives__rows_mapper[state.selected_objective_id];
    },

    //------------------\\
    //  Get Selections  \\
    //------------------\\
    panels__get_selected_panel_id(state, getters, rootState){
        return state.selected_panel_id;
    },
    panels__get_selected_panel_name(state, getters, rootState){
        return state.selected_panel_name;
    },
    objectives__get_selected_objective_id(state, getters, rootState){
        return state.selected_objective_id;
    },
    objectives__get_selected_objective_name(state, getters, rootState){
        return state.selected_objective_name;
    },
    subobjectives__get_selected_subobjective_id(state, getters, rootState){
        return state.selected_subobjective_id;
    },
    subobjectives__get_selected_subobjective_name(state, getters, rootState){
        return state.selected_subobjective_name;
    },
};










const actions = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    async panels__get_rows({state, getters, commit}){
        let problem_id = getters.problems__get_selected_problem_id;
        if(problem_id === null){return false;}
        let row_objects = await query__one_to_many(problem_id, 'Problem', state.panels__table_name, state.row_keys, state.row_types);
        commit('panels__set_rows', row_objects);
    },
    async objectives__get_rows({state, getters, commit}){
        let problem_panels = getters.panels__get_rows;
        for(let x=0;x<problem_panels.length;x++){
            let panel_id = problem_panels[x].objects.id;
            let row_objects = await query__one_to_many(panel_id, state.panels__table_name, state.objectives__table_name, state.row_keys, state.row_types);
            let params = [panel_id, row_objects];
            commit('objectives__add_rows', params);
        }

    },
    async subobjectives__get_rows({state, getters, commit}){
        let problem_objectives = state.objectives__rows_mapper;
        let keys = Object.keys(problem_objectives);
        for(let x=0;x<keys.length;x++){
            let panel_objectives = problem_objectives[keys[x]];
            for(let y=0;y<panel_objectives.length;y++){
                let objective_id = panel_objectives[y].objects.id;
                let row_objects = await query__one_to_many(objective_id, state.objectives__table_name, state.subobjectives__table_name, state.row_keys, state.row_types);
                let params = [objective_id, row_objects];
                commit('subobjectives__add_rows', params);
            }
        }
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    async panels__toggle_select({state, getters, commit}, row_object) {
        commit('panels__set_selected_row', row_object);        
    },
    async objectives__toggle_select({state, getters, commit}, row_object) {
        commit('objectives__set_selected_row', row_object);         
    },
    async subobjectives__toggle_select({state, getters, commit}, row_object) {
        commit('subobjectives__set_selected_row', row_object);       
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    stakeholders__commit_edit({state, getters, commit}, row_object){
        let before_edit = null;
        let insert_table = null;
        if(row_object.table_name === 'Stakeholder_Needs_Panel'){
            before_edit = state.panels__rows[row_object.index];
        }
        if(row_object.table_name === 'Stakeholder_Needs_Objective'){
            before_edit = state.objectives__rows_mapper[state.selected_panel_id][row_object.index];
        }
        if(row_object.table_name === 'Stakeholder_Needs_Subobjective'){
            before_edit = state.subobjectives__rows_mapper[state.selected_objective_id][row_object.index];
        }

        if(JSON.stringify(row_object.items) != JSON.stringify(before_edit.items)){
            update__table_row(row_object, row_object.table_name, state.row_keys, state.row_types);
            commit('stakeholders__update_row', row_object);
            commit('stakeholders__reset_edit_all', row_object);

        }
    },

    //--------------\\
    //  Insert Row  \\
    //--------------\\
    async stakeholders__insert_row({state, commit, getters}, row_object){
        let insert_object = null;
        if(row_object.table_name === 'Stakeholder_Needs_Panel'){
            insert_object = await insert__one_to_many(row_object, row_object.table_name, 'problem_id', getters.problems__get_selected_problem_id, state.row_keys, state.row_types);
        }
        if(row_object.table_name === 'Stakeholder_Needs_Objective'){
            insert_object = await insert__one_to_many(row_object, row_object.table_name, 'panel_id', state.selected_panel_id, state.row_keys, state.row_types);
        }
        if(row_object.table_name === 'Stakeholder_Needs_Subobjective'){
            insert_object = await insert__one_to_many(row_object, row_object.table_name, 'objective_id', state.selected_objective_id, state.row_keys, state.row_types);
        }
        commit('stakeholders__insert_row_local', insert_object);
    }
};






const mutations = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    panels__set_rows(state, row_objects){
        state.panels__rows = row_objects;
    },
    objectives__add_rows(state, params){
        Vue.set(state.objectives__rows_mapper, params[0], params[1]);
    },
    subobjectives__add_rows(state, params){
        Vue.set(state.subobjectives__rows_mapper, params[0], params[1]);
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    panels__set_selected_row(state, row_object){
        if(row_object.selected_state === false){
            state.selected_panel_id = row_object.items[0];
            state.selected_panel_name = row_object.items[1];
        }
        else{
            state.selected_panel_id = null;
            state.selected_panel_name = null;
        }
        for(let x=0;x<state.panels__rows.length;x++){
            if(row_object.index === state.panels__rows[x].index){
                state.panels__rows[x]['selected_state'] = !row_object.selected_state;
            }
            else{
                state.panels__rows[x]['selected_state'] = false;
            }
        }
    },
    panels__reset_selections(state){
        state.selected_panel_id = null;
        state.selected_panel_name = null;
        for(let x=0;x<state.panels__rows.length;x++){
            state.panels__rows[x]['selected_state'] = false;
        }
    },

    objectives__set_selected_row(state, row_object){
        if(row_object.selected_state === false){
            state.selected_objective_id = row_object.items[0];
            state.selected_objective_name = row_object.items[1];
        }
        else{
            state.selected_objective_id = null;
            state.selected_objective_name = null;
        }
        let objective_rows = state.objectives__rows_mapper[state.selected_panel_id];
        for(let x=0;x<objective_rows.length;x++){
            if(row_object.index === objective_rows[x].index){
                objective_rows[x]['selected_state'] = !row_object.selected_state;
            }
            else{
                objective_rows[x]['selected_state'] = false;
            }
        }
    },
    objectives__reset_selections(state){
        state.selected_objective_id = null;
        state.selected_objective_name = null;
        let keys = Object.keys(state.objectives__rows_mapper);
        for(let x=0;x<keys.length;x++){
            let panel_rows = state.objectives__rows_mapper[keys[x]];
            for(let y=0;y<panel_rows.length;y++){
                panel_rows[y]['selected_state'] = false;
            }
        }
    },

    subobjectives__set_selected_row(state, row_object){
        if(row_object.selected_state === false){
            state.selected_subobjective_id = row_object.items[0];
            state.selected_subobjective_name = row_object.items[1];
        }
        else{
            state.selected_subobjective_id = null;
            state.selected_subobjective_name = null;
        }
        let subobjective_rows = state.subobjectives__rows_mapper[state.selected_objective_id];
        for(let x=0;x<subobjective_rows.length;x++){
            if(row_object.index === subobjective_rows[x].index){
                subobjective_rows[x]['selected_state'] = !row_object.selected_state;
            }
            else{
                subobjective_rows[x]['selected_state'] = false;
            }
        }
    },
    subobjectives__reset_selections(state){
        state.selected_subobjective_id = null;
        state.selected_subobjective_name = null;
        let keys = Object.keys(state.subobjectives__rows_mapper);
        for(let x=0;x<keys.length;x++){
            let objective_rows = state.subobjectives__rows_mapper[keys[x]];
            for(let y=0;y<objective_rows.length;y++){
                objective_rows[y]['selected_state'] = false;
            }
        }
    },

    stakeholders__reset_selections(state){
        state.selected_subobjective_id = null;
        state.selected_subobjective_name = null;
        state.selected_objective_id = null;
        state.selected_objective_name = null;
        state.selected_panel_id = null;
        state.selected_panel_name = null;
    },
    stakeholders__reset_data(state){
        state.panels__rows = [];
        state.objectives__rows_mapper = {};
        state.subobjective__rows_mapper = {};
    },


    //------------\\
    //  Edit Row  \\
    //------------\\
    stakeholders__set_edit_state(state, row_object){
        let rows = null;
        if(row_object.table_name === 'Stakeholder_Needs_Panel'){
            rows = state.panels__rows;
        }
        if(row_object.table_name === 'Stakeholder_Needs_Objective'){
            rows = state.objectives__rows_mapper[state.selected_panel_id];
        }
        if(row_object.table_name === 'Stakeholder_Needs_Subobjective'){
            rows = state.subobjectives__rows_mapper[state.selected_objective_id];
        }
        for(let x=0;x<rows.length;x++){
            if(row_object.index === rows[x].index){
                rows[x]['editing_state'] = !(rows[x]['editing_state']);
            }
            else{
                rows[x]['editing_state'] = false;
            }
        }
    },
    stakeholders__update_row(state, row_object){
        if(row_object.table_name === 'Stakeholder_Needs_Panel'){
            console.log("TEST");
            console.log(state.panels__rows[row_object.index], row_object);
            // Vue.set(state.panels__rows[row_object.index], 'items', _.cloneDeep(row_object.items));
            state.panels__rows[row_object.index].items = _.cloneDeep(row_object.items)
        }
        if(row_object.table_name === 'Stakeholder_Needs_Objective'){
            Vue.set(state.objectives__rows_mapper[state.selected_panel_id], row_object.index, _.cloneDeep(row_object));
        }
        if(row_object.table_name === 'Stakeholder_Needs_Subobjective'){
            Vue.set(state.subobjectives__rows_mapper[state.selected_objective_id], row_object.index, _.cloneDeep(row_object));
        }
    },
    stakeholders__reset_edit_all(state, row_object){
        console.log("resetting all edits", row_object);
        let rows = null;
        if(row_object.table_name === 'Stakeholder_Needs_Panel'){
            rows = state.panels__rows;
        }
        if(row_object.table_name === 'Stakeholder_Needs_Objective'){
            rows = state.objectives__rows_mapper[state.selected_panel_id];
        }
        if(row_object.table_name === 'Stakeholder_Needs_Subobjective'){
            rows = state.subobjectives__rows_mapper[state.selected_objective_id];
        }
        for(let x=0;x<rows.length;x++){
            rows[x]['editing_state'] = false;
        }
    },



    //--------------\\
    //  Insert Row  \\
    //--------------\\
    stakeholders__insert_row_local(state, insert_object){
        if(insert_object.table_name === 'Stakeholder_Needs_Panel'){
            state.panels__rows.push(insert_object);
        }
        if(insert_object.table_name === 'Stakeholder_Needs_Objective'){
            state.objectives__rows_mapper[state.selected_panel_id].push(insert_object);
        }
        if(insert_object.table_name === 'Stakeholder_Needs_Subobjective'){
            state.subobjectives__rows_mapper[state.selected_objective_id].push(insert_object);
        }
    },

};

export default {
    state,
    getters,
    actions,
    mutations
}