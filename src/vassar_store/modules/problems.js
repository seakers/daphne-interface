import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import * as _ from 'lodash-es';
import Vue from 'vue'


const state = {

    //--------------\\
    //  Table Info  \\
    //--------------\\
    table_name: 'Problems',             // Panel Title
    table_headers: ['ID', 'Problem'],   // Column Headers
    row_keys: ['id', 'name'],           // Column Keys

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
    async problems__query({ state, commit, rootState }){
        let num_goups = rootState.groups.table_view_rows_data.length;
        let query = {};
        let dataResponse = {};
        let problem_names = [];
        let params = [];
        for(let i = 0; i < num_goups; i++){
            let current_group = rootState.groups.table_view_rows_data[i].objects;
            query = {};
            query.query = `{
                Group(where: {id: {_eq: ${current_group.id}}}) {
                  Join__Problem_Groups {
                    Problem {
                      id
                      name
                    }
                  }
                }
            }`
            dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
            problem_names = await dataResponse.json();
            let probs = problem_names.data.Group[0].Join__Problem_Groups;
            params = []
            params.push(current_group.id);
            params.push(probs);
            commit('append_group_problems', params);
            console.log("PROBLEMS", probs)
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
        // 1. Find the equivalent unchanged row
        let unchanged_row = state.problems__rows_mapper[rootState.groups.selected_group_id][row_object.index];
        console.log("ORIGINAL ROW", unchanged_row);
        let new_name = row_object.items[1];
        let old_name = unchanged_row.items[1];
        if(old_name !== new_name){
            //  TODO: Commit new row to database
            let params = [];
            params.push(row_object);
            params.push(rootState);
            commit('problems__update_row', params);
            // TODO: Turn edit state off after commit
            commit('problems__reset_edit_all', rootState);
        }
    },
};






const mutations = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    append_group_problems(state, params){
        let problems__rows = []
        let group_id = params[0];
        let problems = params[1];
        console.log("PROBLEMS", problems)
        let num_problems = problems.length;
        for(let x=0;x<num_problems;x++){
            let problem = problems[x];
            let items = [];
            for(let y=0;y<state.row_keys.length;y++){
                let key = state.row_keys[y];
                items.push(problem.Problem[key]);
            }

            // Row creation --->
            let table_view_row_data = {};
            table_view_row_data['objects'] = problem.Problem;
            table_view_row_data['index'] = x;
            table_view_row_data['selected_state'] = false;
            table_view_row_data['editing_state'] = false
            table_view_row_data['items'] = items

            let problem_details = {'name': problem.Problem.name, 'id': problem.Problem.id};
            problems__rows.push(table_view_row_data);
        }
        console.log("Mapping problem rows", group_id, problems__rows);
        Vue.set(state.problems__rows_mapper, group_id, problems__rows);
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
        console.log("Edit state setter", state.problems__rows_mapper);
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
};








export default {
    state,
    getters,
    actions,
    mutations
}