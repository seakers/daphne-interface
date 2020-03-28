import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    username: '',
    user_id: '',

    groups: [],
    group: 'seakers',
    group_id: '1',

    problems: {},
    problem: '',
    problem_id: '',

    // The keys will be the group ID
    prob: {'1': [{'name': 'smap', 'id': '1'}, 'climate'], '2': ['decadal']},

    selected_group_name: '',
    selected_group_id: '',


    table_name: 'Groups',             // 'Groups'
    table_headers: ['ID', 'Group'],   // ['ID', 'Group']
    row_keys: ['id', 'name'],         // ['id', 'name']
    row_objects: [],                  // [ {'id': '1', 'name': 'seakers'}, {'id': '2', 'name': 'jpl'} ]





};

// const initialState = _.cloneDeep(state);

const getters = {};



const actions = {
    async query_groups({ state, commit }){
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
        commit('set_group_name', group_names.data.auth_user[0].Join__AuthUser_Groups[0].Group.name);
        commit('set_group_id', group_names.data.auth_user[0].Join__AuthUser_Groups[0].Group.id);
    },
};

const mutations = {
    set_username(state, username){
        state.username = username;
    },
    set_user_id(state, user_id){
        state.user_id = user_id;
    },



    set_groups(state, groups){
        let num_groups = groups.length;
        let entry = [];
        for(let x=0;x<num_groups;x++){
            let group = groups[x];
            let group_details = {'name': group.Group.name, 'id': group.Group.id};
            entry.push(group_details);
        }
        state.groups = entry;
        state.row_objects = entry;
    },



    set_group_name(state, selected_group_name){
        state.selected_group_name = selected_group_name;
    },
    set_group_id(state, selected_group_id){
        state.selected_group_id = selected_group_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}