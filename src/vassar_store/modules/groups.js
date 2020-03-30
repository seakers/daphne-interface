import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";


const state = {
    username: '',
    user_id: '',

    selected_group_name: '',
    selected_group_id: '',

    table_name: 'Groups',             // 'Groups'
    table_headers: ['ID', 'Group'],   // ['ID', 'Group']
    row_keys: ['id', 'name'],         // ['id', 'name']
    table_view_rows_data: [],
};

// const initialState = _.cloneDeep(state);

const getters = {

    //------------\\
    //  Get Rows  \\
    //------------\\
    groups__get_rows(state) {
        return this.table_view_rows_data;
    },










};



const actions = {
    async groups__query({ state, commit, dispatch }){
        let query = {};
        query.query = `{
            auth_user(where: {id: {_eq: ${state.user_id}}}) {
              Join__AuthUser_Groups {
                Group {
                  id  
                  name
                }
              }
            }
        }`
        let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
        let group_names = await dataResponse.json();
        console.log("Groups", group_names.data.auth_user[0].Join__AuthUser_Groups);
        commit('set_groups', group_names.data.auth_user[0].Join__AuthUser_Groups);

        // Remove this dev auto-set for production
        commit('group__set_name', group_names.data.auth_user[0].Join__AuthUser_Groups[0].Group.name);
        commit('group__set_id', group_names.data.auth_user[0].Join__AuthUser_Groups[0].Group.id);
    },



    async groups__toggle_select({ state, commit, rootState}, row){
        commit('group__set_row_select', row);
        if(!row.selected_state === true){
            commit('group__set_id', null);
            commit('group__set_name', null);
        }
        else{
            commit('group__set_id', row.items[0]);
            commit('group__set_name', row.items[1]);
        }
    },

    async groups__toggle_edit({ state, commit, rootState}, row){
        commit('groups__set_edit_state', row);
    }
};



const mutations = {
    set_username(state, username){
        state.username = username;
    },
    set_user_id(state, user_id){
        state.user_id = user_id;
    },


    groups__set_edit_state(state, row) {
        for(let x=0;x<state.table_view_rows_data.length;x++){
            if(row_object.index === state.table_view_rows_data[x].index){
                state.table_view_rows_data[x]['editing_state'] = !row_object.editing_state;
            }
            else{
                state.table_view_rows_data[x]['editing_state'] = false;
            }
        }
        console.log("Edit state setter", state.table_view_rows_data);
    },

    group__set_row_select(state, row_object) {
        for(let x=0;x<state.table_view_rows_data.length;x++){
            if(row_object.index === state.table_view_rows_data[x].index){
                state.table_view_rows_data[x]['selected_state'] = !row_object.selected_state;
            }
            else{
                state.table_view_rows_data[x]['selected_state'] = false;
            }
        }
    },

    set_groups(state, groups){
        let table_view_rows_data = []
        let num_groups = groups.length;
        for(let x=0;x<num_groups;x++){
            let group = groups[x];

            let table_view_row_data = {};
            table_view_row_data['objects'] = group.Group;
            table_view_row_data['index'] = x;
            table_view_row_data['selected_state'] = false;
            table_view_row_data['editing_state'] = false

            // Iterate over the keys and create the items list
            let items = [];
            for(let y=0;y<state.row_keys.length;y++){
                let key = state.row_keys[y];
                items.push(group.Group[key]);
            }
            table_view_row_data['items'] = items
            table_view_rows_data.push(table_view_row_data);
        }
        state.table_view_rows_data = table_view_rows_data;
    },

    group__set_name(state, selected_group_name){
        state.selected_group_name = selected_group_name;
    },
    group__set_id(state, selected_group_id){
        console.log("Group ID", selected_group_id)
        state.selected_group_id = selected_group_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}