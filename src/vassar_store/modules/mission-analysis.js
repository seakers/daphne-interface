// import { query__table } from "../../scripts/query-helpers";
// import { insert__one_to_many_obj } from "../../scripts/insert-helpers";
// import { update__table_row } from "../../scripts/update-helpers";
// import * as _ from 'lodash-es';
// import Vue from 'vue';




// const state = {

//     tables: {
//         'Walker_Mission_Analysis': Walker_Mission_Analysis,
//         'Power_Mission_Analysis': Power_Mission_Analysis,
//         'Launch_Vehicle_Mission_Analysis': Launch_Vehicle_Mission_Analysis,
//     },


// };


// const getters = {

//     //--------------\\
//     //  Get Tables  \\
//     //--------------\\
//     analysis__walker_table(state){
//         return state.tables.Walker_Mission_Analysis;
//     },
//     analysis__power_table(state){
//         return state.tables.Power_Mission_Analysis;
//     },
//     analysis__launch_vehicle_table(state){
//         return state.tables.Launch_Vehicle_Mission_Analysis;
//     },

//     //------------\\
//     //  Get Rows  \\
//     //------------\\
//     analysis__walker_rows(state, getters){
//         return state.tables.Walker_Mission_Analysis.row_object_mapper[getters.problems__get_selected_problem_id];
//     },
//     analysis__power_rows(state, getters){
//         return state.tables.Power_Mission_Analysis.row_object_mapper[getters.problems__get_selected_problem_id];
//     },
//     analysis__launch_vehicle_rows(state, getters){
//         return state.tables.Launch_Vehicle_Mission_Analysis.row_object_mapper[getters.problems__get_selected_problem_id];
//     },

//     //------------------\\
//     //  Get Selections  \\
//     //------------------\\
//     analysis__walker_id(state){
//         return state.tables.Walker_Mission_Analysis.selected_id;
//     },
//     analysis__power_id(state){
//         return state.tables.Power_Mission_Analysis.selected_id;
//     },
//     analysis__launch_vehicle_id(state){
//         return state.tables.Launch_Vehicle_Mission_Analysis.selected_id;
//     },
// };


// const actions = {

//     //--------------\\
//     //  Query Rows  \\
//     //--------------\\
//     async analysis__fetch({state, getters, commit}){
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
//             commit('analysis__set_rows', params);
//         }
//         console.log("ANALYSIS", state.tables);
//     },

//     //--------------\\
//     //  Select Row  \\
//     //--------------\\
//     analysis__toggle_select({getters, commit}, row_object){
//         let params = {
//             'row_object': row_object,
//             'getters': getters
//         };
//         commit('analysis__set_selected_row', params);
//     },

//     //------------\\
//     //  Edit Row  \\
//     //------------\\
//     async analysis__commit_edit({state, getters, commit}, row_object){
//         let rows = state.tables[row_object.table_name].row_object_mapper[getters.problems__get_selected_problem_id];

//         if(JSON.stringify(row_object.items) != JSON.stringify(rows[row_object.index].items)){
//             await update__table_row(row_object, row_object.table_name, state.tables[row_object.table_name].col_keys, state.tables[row_object.table_name].col_types);
//             let params = {
//                 'row_object': row_object,
//                 'getters': getters
//             };
//             commit('analysis__update_row', params);
//             commit('analysis__reset_edit_all', params);
//         }
//     },
//     async analysis__set_edit_state_wrapper({commit, getters}, row_object){
//         let params = {
//             'row_object': row_object,
//             'getters': getters
//         };
//         commit('analysis__set_edit_state', params);
//     },

//     //--------------\\
//     //  Insert Row  \\
//     //--------------\\
//     async analysis__insert_row({state, commit, getters}, row_object){
//         let table = state.tables[row_object.table_name];
//         let insert_object = await insert__one_to_many_obj(table, row_object, getters.problems__get_selected_problem_id);
//         let params = {
//             'insert_object': insert_object,
//             'getters': getters
//         };
//         commit('analysis__insert_row_local', params);
//     },
// };


// const mutations = {

//     //--------------\\
//     //  Query Rows  \\
//     //--------------\\
//     analysis__set_rows(state, params){
//         if(params.row_objects.length === 0){return;}
//         Vue.set(state.tables[params.row_objects[0].table_name].row_object_mapper, params.getters.problems__get_selected_problem_id, _.cloneDeep(params.row_objects));
//         console.log("SETTING ROWS", state.tables);
//     },

//     //--------------\\
//     //  Select Row  \\
//     //--------------\\
//     analysis__set_selected_row(state, params){
//         if(params.row_object.selected_state === false){  //-------------------------------- Select
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
//     analysis__set_edit_state(state, params){
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
//     analysis__update_row(state, params){
//         state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id][params.row_object.index].items = _.cloneDeep(params.row_object.items)
//     },
//     analysis__reset_edit_all(state, params){
//         let rows = state.tables[params.row_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id];
//         for(let x=0;x<rows.length;x++){
//             rows[x]['editing_state'] = false;
//         }
//     },

//     //--------------\\
//     //  Insert Row  \\
//     //--------------\\
//     analysis__insert_row_local(state, params){
//         state.tables[params.insert_object.table_name].row_object_mapper[params.getters.problems__get_selected_problem_id].push(params.insert_object);
//     },
// };






// export default {
//     state,
//     getters,
//     actions,
//     mutations
// }