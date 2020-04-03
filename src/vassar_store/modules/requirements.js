// import { query__table } from "../../scripts/query-helpers";
// import { insert__one_to_many_obj } from "../../scripts/insert-helpers";
// import { update__table_row } from "../../scripts/update-helpers";
// import * as _ from 'lodash-es';
// import Vue from 'vue'

// // Requirement_Rule_Attribute
// // Requirement_Rule_Case


// const state = {


//     tables: {
//         'Requirement_Rule_Attribute': Requirement_Rule_Attribute,
//         'Requirement_Rule_Case': Requirement_Rule_Case
//     },



//     //--------------\\
//     //  Table Info  \\
//     //--------------\\
//     case_requirements__display_name: 'By Case',
//     case_requirements__table_name: 'Requirement_Rule_Case',

//     attr_requirements__display_name: 'By Attribute',
//     attr_requirements__table_name: 'Requirement_Rule_Attribute',

//     table_headers: ['ID', 'Subobjective', 'Measurement', 'Attribute', 'Attribute Type', 'Threshold', 'Scores', 'Justification', 'Units', 'Notes'],
//     row_keys: ['id', 'subobjective', 'measurement', 'attribute', 'type', 'threshold', 'scores', 'justification', 'units', 'notes'],

//     // Much more efficient to have an object
//     attr_requirements_row_types: ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
//     case_requirements_row_types: ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
//     row_types_object: {
//         'Requirement_Rule_Attribute': ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string'],
//         'Requirement_Rule_Case': ['int', 'string', 'string', 'string', 'string', 'list', 'list', 'string', 'string', 'string']
//     },

//     //--------\\
//     //  Rows  \\
//     //--------\\
//     rows_object: {
//         'Requirement_Rule_Attribute': [],
//         'Requirement_Rule_Case': [],
//     },

//     attr_requirements__rows: [],      // Loaded for one problem
//     case_requirements__rows: [],      // Loaded for one problem


//     //--------------\\
//     //  Selections  \\
//     //--------------\\
//     selections_object: {
//         'Requirement_Rule_Attribute': { 'id': null},
//         'Requirement_Rule_Case': { 'id': null},
//     },


//     selected_attr_requirement_name: null,
//     selected_attr_requirement_id: null,

//     selected_case_requirement_name: null,
//     selected_case_requirement_id: null,
// };


// const getters = {

//     //------------\\
//     //  Get Rows  \\
//     //------------\\
//     attr_requirements__get_rows(state, getters){
//         return state.tables.Requirement_Rule_Attribute.row_object_mapper[getters.problems__get_selected_problem_id];
//     },
//     case_requirements__get_rows(state, getters){
//         return state.tables.Requirement_Rule_Case.row_object_mapper[getters.problems__get_selected_problem_id];
//     },

//     //------------------\\
//     //  Get Selections  \\
//     //------------------\\
//     attr_requirements__get_selected_id(state, getters){
//         return state.tables.Requirement_Rule_Attribute.selected_id;
//     },
//     case_requirements__get_selected_id(state, getters){
//         return state.tables.Requirement_Rule_Case.selected_id;
//     },
// };



// const actions = {

//     //--------------\\
//     //  Query Rows  \\
//     //--------------\\
//     async requirements__fetch({state, getters, commit}){
//         let problem_id = getters.problems__get_selected_problem_id;
//         if(problem_id === null){return false;}
//         let table_names = Object.keys(state.tables);
//         for(let x=0;x<table_names.length;x++){
//             let table = state.tables[table_names[x]];
//             let row_objects = await query__table(table, problem_id);
//             let params = {
//                 'row_objects': row_objects,
//                 'getters': getters
//             }
//             commit('requirements__set_rows', params);
//         }

        
//     },

//     //--------------\\
//     //  Select Row  \\
//     //--------------\\
//     requirements__toggle_select({state, getters, commit}, row_object){
//         let params = {
//             'row_object': row_object,
//             'getters': getters
//         };
//         commit('requirements__set_selected_row', params);
//     },

//     //------------\\
//     //  Edit Row  \\
//     //------------\\
//     async requirements__commit_edit({state, getters, commit}, row_object){
//         let rows = state.tables[row_object.table_name].row_object_mapper[getters.problems__get_selected_problem_id];

//         if(JSON.stringify(row_object.items) != JSON.stringify(rows[row_object.index].items)){
//             await update__table_row(row_object, row_object.table_name, state.row_keys, state.row_types_object[row_object.table_name]);
//             let params = {
//                 'row_object': row_object,
//                 'getters': getters
//             };
//             commit('requirements__update_row', params);
//             commit('requirements__reset_edit_all', params);
//         }
//     },
//     async requirements__set_edit_state_wrapper({commit, getters}, row_object){
//         let params = {
//             'row_object': row_object,
//             'getters': getters
//         };
//         commit('requirements__set_edit_state', params);
//     },

//     //--------------\\
//     //  Insert Row  \\
//     //--------------\\
//     async requirements__insert_row({state, commit, getters}, row_object){
//         let table = state.tables[row_object.table_name];

//         let insert_object = await insert__one_to_many_obj(table, row_object, getters.problems__get_selected_problem_id);
//         let params = {
//             'insert_object': insert_object,
//             'getters': getters
//         };
//         commit('requirements__insert_row_local', params);
//     },
// };




// const mutations = {

//     //--------------\\
//     //  Query Rows  \\
//     //--------------\\
//     requirements__set_rows(state, params){
//         if(params.row_objects.length === 0){return;}
//         // state.tables[params.row_objects[0].table_name].row_object_mapper[params.getters.problems__get_selected_problem_id] = _.cloneDeep(params.row_objects);
//         Vue.set(state.tables[params.row_objects[0].table_name].row_object_mapper, params.getters.problems__get_selected_problem_id, _.cloneDeep(params.row_objects));
//     },

//     //--------------\\
//     //  Select Row  \\
//     //--------------\\
//     requirements__set_selected_row(state, params){
//         if(params.row_object.selected_state === false){  //-------------------------------- Select
//             // state.selections_object[params.row_object.table_name].id = params.row_object.items[0];
//             state.tables[params.row_object.table_name].selected_id = params.row_object.items[0];
//         }
//         else{  //------------------------------------------------------------------- Unselect
//             state.tables[params.row_object.table_name].selected_id = null;
//         }
//         let rows = state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id];
//         for(let x=0;x<rows.length;x++){
//             if(params.row_object.index === rows[x].index){
//                 rows[x]['selected_state'] = !(rows[x]['selected_state']);
//             }
//             else{
//                 rows[x]['selected_state'] = false;
//             }
//         }
//     },

//     //------------\\
//     //  Edit Row  \\
//     //------------\\
//     requirements__set_edit_state(state, params){
//         // let rows = state.rows_object[params.row_object.table_name];
//         let rows = state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id];
//         for(let x=0;x<rows.length;x++){
//             if(params.row_object.index === rows[x].index){
//                 rows[x]['editing_state'] = !(rows[x]['editing_state']);
//             }
//             else{
//                 rows[x]['editing_state'] = false;
//             }
//         }
//     },


//     requirements__update_row(state, params){
//         state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id][params.row_object.index].items = _.cloneDeep(params.row_object.items)
//     },
//     requirements__reset_edit_all(state, params){
//         let rows = state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id];
//         for(let x=0;x<rows.length;x++){
//             rows[x]['editing_state'] = false;
//         }
//     },

//     //--------------\\
//     //  Insert Row  \\
//     //--------------\\
//     requirements__insert_row_local(state, params){
//         state.tables[params.insert_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id].push(params.insert_object);
//     },
// };



// export default {
//     state,
//     getters,
//     actions,
//     mutations
// }