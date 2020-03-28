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



    selected_problem_id: '',
    selected_problem_name: '',

    current_problem: '',
    table_name: 'Problems',             // 'Groups'
    table_headers: ['ID', 'Problem'],   // ['ID', 'Group']
    row_keys: ['id', 'name'],           // ['id', 'name']
    row_objects: {},                    // {'1': [{'id': '1', 'name': 'seakers'}, {'id': '2', 'name': 'jpl'}] }
};



const getters = {
    get_problem_rows(state, getters, rootState){
        console.log("Get Problem Rows", state.row_objects);
        return state.row_objects[rootState.groups.selected_group_id];
    }



};





const actions = {
    async query_problems({ state, commit, rootState }){
        let num_goups = rootState.groups.row_objects.length;
        console.log("Num groups", num_goups);
        let query = {};
        let dataResponse = {};
        let problem_names = [];
        let params = [];
        for(let i = 0; i < num_goups; i++){
            let current_group = rootState.groups.row_objects[i];
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
            commit('append_group_problems', params);
        }


    },

};



const mutations = {



    append_group_problems(state, params){
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
        state.row_objects[group_id] = entry;
        console.log("Appending Group Problem:", entry);
    },


    set_problem_name(state, selected_problem_name){
        state.selected_problem_name = selected_problem_name;
    },
    set_problem_id(state, selected_problem_id){
        state.selected_problem_id = selected_problem_id;
    },
};








export default {
    state,
    getters,
    actions,
    mutations
}