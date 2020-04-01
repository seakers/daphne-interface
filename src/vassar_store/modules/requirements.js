import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import { query__one_to_many } from "../../scripts/query-helpers";
import { insert__one_to_many } from "../../scripts/insert-helpers";
import { update__table_row } from "../../scripts/update-helpers";
import * as _ from 'lodash-es';
import Vue from 'vue'

// Requirement_Rule_Attribute
// Requirement_Rule_Case


const state = {
    //--------------\\
    //  Table Info  \\
    //--------------\\
    case_requirements__display_name: 'By Case',
    case_requirements__table_name: 'Requirement_Rule_Case',

    attr_requirements__display_name: 'By Attribute',
    attr_requirements__table_name: 'Requirement_Rule_Attribute',

    table_headers: ['ID', 'Subobjective', 'Measurement', 'Attribute', 'Attribute Type', 'Threshold', 'Scores', 'Justification', 'Units', 'Notes'],
    row_keys: ['id', 'subobjective', 'measurement', 'attribute', 'type', 'threshold', 'scores', 'justification', 'units', 'notes'],

    // Much more efficient to have an object
    attr_requirements_row_types: ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
    case_requirements_row_types: ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
    row_types_object: {
        'Requirement_Rule_Attribute': ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
        'Requirement_Rule_Case': ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string']
    },

    //--------\\
    //  Rows  \\
    //--------\\
    rows_object: {
        'Requirement_Rule_Attribute': [],
        'Requirement_Rule_Case': [],
    },

    attr_requirements__rows: [],      // Loaded for one problem
    case_requirements__rows: [],      // Loaded for one problem


    //--------------\\
    //  Selections  \\
    //--------------\\
    selections_object: {
        'Requirement_Rule_Attribute': { 'id': null},
        'Requirement_Rule_Case': { 'id': null},
    },


    selected_attr_requirement_name: null,
    selected_attr_requirement_id: null,

    selected_case_requirement_name: null,
    selected_case_requirement_id: null,
};


const getters = {

    //------------\\
    //  Get Rows  \\
    //------------\\
    attr_requirements__get_rows(state){
        console.log("GETTING REQUIREMENTS", state.rows_object);
        return state.rows_object[state.attr_requirements__table_name];
    },
    case_requirements__get_rows(state){
        return state.rows_object[state.case_requirements__table_name];
    },

    //------------------\\
    //  Get Selections  \\
    //------------------\\
    attr_requirements__get_selected_id(state){
        return state.selections_object[state.attr_requirements__table_name].id;
    },
    case_requirements__get_selected_id(state){
        return state.selections_object[state.case_requirements__table_name].id;
    },
};



const actions = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    async attr_requirements__get_rows({state, getters, commit}){
        let problem_id = getters.problems__get_selected_problem_id;
        if(problem_id === null){return false;}
        let row_objects = await query__one_to_many(problem_id, 'Problem', state.attr_requirements__table_name, state.row_keys, state.row_types_object['Requirement_Rule_Attribute']);
        commit('attr_requirements__set_rows', row_objects);
    },
    async case_requirements__get_rows({state, getters, commit}){
        let problem_id = getters.problems__get_selected_problem_id;
        if(problem_id === null){return false;}
        let row_objects = await query__one_to_many(problem_id, 'Problem', state.case_requirements__table_name, state.row_keys, state.row_types_object['Requirement_Rule_Case']);
        commit('case_requirements__set_rows', row_objects);
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    requirements__toggle_select({state, getters, commit}, row_object){
        commit('requirements__set_selected_row', row_object);
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    async requirements__commit_edit({state, getters, commit}, row_object){
        let rows = state.rows_object[row_object.table_name];
        if(JSON.stringify(row_object.items) != JSON.stringify(rows[row_object.index].items)){
            await update__table_row(row_object, row_object.table_name, state.row_keys, state.row_types_object[row_object.table_name]);
            commit('requirements__update_row', row_object);
            commit('requirements__reset_edit_all', row_object);
        }
    },

    //--------------\\
    //  Insert Row  \\
    //--------------\\
    async requirements__insert_row({state, commit, getters}, row_object){
        let insert_object = await insert__one_to_many(row_object, row_object.table_name, 'problem_id', getters.problems__get_selected_problem_id, state.row_keys, state.row_types_object[row_object.table_name]);
        commit('requirements__insert_row_local', insert_object);
    }
};




const mutations = {
    //--------------\\
    //  Query Rows  \\
    //--------------\\
    attr_requirements__set_rows(state, row_objects){
        // state.attr_requirements__rows = row_objects;
        // state.rows_object[state.attr_requirements__table_name] = row_objects;
        Vue.set(state.rows_object, state.attr_requirements__table_name, row_objects);
    },
    case_requirements__set_rows(state, row_objects){
        // state.case_requirements__rows = row_objects;
        state.rows_object[state.case_requirements__table_name] = row_objects;
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    requirements__set_selected_row(state, row_object){
        if(row_object.selected_state === false){
            state.selections_object[row_object.table_name].id = row_object.items[0];
        }
        else{
            state.selections_object[row_object.table_name].id = null;
        }
        let rows = state.rows_object[row_object.table_name];
        for(let x=0;x<rows.length;x++){
            if(row_object.index === rows[x].index){
                rows[x]['selected_state'] = !(rows[x]['selected_state']);
            }
            else{
                rows[x]['selected_state'] = false;
            }
        }
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    requirements__set_edit_state(state, row_object){
        let rows = state.rows_object[row_object.table_name];
        for(let x=0;x<rows.length;x++){
            if(row_object.index === rows[x].index){
                rows[x]['editing_state'] = !(rows[x]['editing_state']);
            }
            else{
                rows[x]['editing_state'] = false;
            }
        }
    },
    requirements__update_row(state, row_object){
        state.rows_object[row_object.table_name][row_object.index].items = _.cloneDeep(row_object.items)
    },
    requirements__reset_edit_all(state, row_object){
        let rows = state.rows_object[row_object.table_name];
        for(let x=0;x<rows.length;x++){
            rows[x]['editing_state'] = false;
        }
    },

    //--------------\\
    //  Insert Row  \\
    //--------------\\
    requirements__insert_row_local(state, insert_object){
        state.rows_object[insert_object.table_name].push(insert_object);
    },
};



export default {
    state,
    getters,
    actions,
    mutations
}