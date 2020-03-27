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
    prob: {'1': [{'name': 'smap', 'id': '1'}, 'climate'], '2': ['decadal']}
};

// const initialState = _.cloneDeep(state);

const getters = {};



const actions = {
    async init_page({ state, commit, dispatch }){
        // 1. Find all the groups
        // 2. Find all the problems for each of the groups


        await dispatch('query_groups');
        await dispatch('query_problems');


    },


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

    async query_problems({ state, commit }){
        let num_goups = state.groups.length;
        console.log("Num groups", num_goups);
        let query = {};
        let dataResponse = {};
        let problem_names = [];
        let params = [];
        for(let i = 0; i < num_goups; i++){
            let current_group = state.groups[i];
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
            console.log("Problems", probs);
            params = []
            params.push(current_group.id);
            params.push(probs);
            commit('set_problems', params);
        }
    },






    async query__user_id_from_username({ state, commit }){
        let id_query = {};
        id_query.query = `{  auth_user (where: {username: {_eq: "${state.username}"}}) {id username}  }`;
        let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(id_query));
        let auth_user_data = await dataResponse.json();
        console.log(auth_user_data);
        let auth_user_entry_id = auth_user_data.data.auth_user[0].id;
        console.log("User found from auth_user", auth_user_data.data.auth_user[0], "ID", auth_user_entry_id);
        commit('set_user_id', auth_user_entry_id);
    }





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
    },



    set_group_name(state, group){
        state.group = group;
    },
    set_group_id(state, group_id){
        state.group_id = group_id;
    },




    set_problems(state, params){
        let group_id = params[0];
        let problems = params[1];
        console.log(problems)
        let num_problems = problems.length;
        let entry = [];
        for(let x=0;x<num_problems;x++){
            let problem = problems[x];
            let problem_details = {'name': problem.Problem.name, 'id': problem.Problem.id};
            entry.push(problem_details);
        }
        state.problems[group_id] = entry;
        console.log("group problems", state.problems);
    },


    set_problem(state, problem, problem_id){
        state.problem = problem;
        state.problem_id = problem_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}