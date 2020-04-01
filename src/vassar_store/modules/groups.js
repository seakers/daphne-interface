import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import { query__many_to_many } from "../../scripts/query-helpers";


const state = {

    //--------\\
    //  User  \\
    //--------\\
    username: '',
    user_id: '',

    //--------------\\
    //  Table Info  \\
    //--------------\\
    display_name: 'Groups',
    table_name: 'Group',             // Panel Title
    table_headers: ['ID', 'Group'],   // Column Headers
    row_keys: ['id', 'name'],         // Column Keys
    row_types: ['int', 'string'],

    //--------\\
    //  Rows  \\
    //--------\\
    groups__rows: [],

    //--------------\\
    //  Selections  \\
    //--------------\\
    selected_group_name: '',
    selected_group_id: '',
};

// const initialState = _.cloneDeep(state);

const getters = {

    //------------\\
    //  Get Rows  \\
    //------------\\
    groups__get_rows(state) {
        return state.groups__rows;
    },

    //------------------\\
    //  Get Selections  \\
    //------------------\\
    groups__get_selected_group_id(state, getters, rootState){
        return state.selected_group_id;
    },
    groups__get_selected_group_name(state, getters, rootState){
        return state.selected_group_name;
    },
};



const actions = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    async groups__query({ state, commit, dispatch }){
        let row_objects = await query__many_to_many(state.user_id, 'auth_user', 'Join__AuthUser_Groups', 'Group', state.row_keys, state.row_types);
        commit('groups_append_query', row_objects);
        commit('groups_set_name', row_objects[0].objects.name);
        commit('groups__set_id', row_objects[0].objects.id);
        console.log("GROUPS", row_objects);
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    async groups__toggle_select({ state, commit, rootState}, row){
        commit('groups__set_row_select', row);
        if(!row.selected_state === true){
            commit('groups__set_id', null);
            commit('groups_set_name', null);
        }
        else{
            commit('groups__set_id', row.items[0]);
            commit('groups_set_name', row.items[1]);
        }
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    async groups__toggle_edit({ state, commit, rootState}, row){
        commit('groups__set_edit_state', row);
    }
};



const mutations = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    groups_append_query(state, row_objects){
        state.groups__rows = row_objects;
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    groups__set_row_select(state, row_object) {
        for(let x=0;x<state.groups__rows.length;x++){
            if(row_object.index === state.groups__rows[x].index){
                state.groups__rows[x]['selected_state'] = !(state.groups__rows[x]['selected_state']);
            }
            else{
                state.groups__rows[x]['selected_state'] = false;
            }
        }
    },

    //------------\\
    //  Edit Row  \\
    //------------\\
    groups__set_edit_state(state, row) {
        for(let x=0;x<state.groups__rows.length;x++){
            if(row_object.index === state.groups__rows[x].index){
                state.groups__rows[x]['editing_state'] = !row_object.editing_state;
            }
            else{
                state.groups__rows[x]['editing_state'] = false;
            }
        }
    },

    //---------------------\\
    //  Current Selection  \\
    //---------------------\\
    set_username(state, username){
        state.username = username;
    },
    set_user_id(state, user_id){
        state.user_id = user_id;
    },
    groups_set_name(state, selected_group_name){
        state.selected_group_name = selected_group_name;
    },
    groups__set_id(state, selected_group_id){
        state.selected_group_id = selected_group_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}