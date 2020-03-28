import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";

const state = {
    panel_table_name: 'Panels',
    panel_table_headers: ['ID', 'Name', 'Description', 'weight'],
    panel_row_keys: ['id', 'name', 'description', 'weight'],
    panel_row_objects: [],

    objective_table_name: 'Objectives',
    objective_table_headers: ['ID', 'Name', 'Description', 'weight'],
    objective_row_keys: ['id', 'name', 'description', 'weight'],
    objective_row_objects: {},

    subobjective_table_name: 'Subobjectives' ,
    subobjective_table_headers: ['ID', 'Name', 'Description', 'weight'],
    subobjective_row_keys: ['id', 'name', 'description', 'weight'],
    subobjective_row_objects: {},

    stakeholder_info: {}, // Object containing all of the stakeholder information
                          //   to be parsed by the row getters
                          // {'problem_id': {}}


    selected_panel_name: false,
    selected_panel_id: false,

    selected_objective_name: false,
    selected_objective_id: false,

    selected_subobjective_name: false,
    selected_subobjective_id: false,

};

// const initialState = _.cloneDeep(state);

const getters = {
    get_panel_rows(state){
        return state.panel_row_objects;
    },

    // Return null if no panel row is selected
    get_objective_rows(state){
        if(state.selected_panel_id === false){
            return false;
        }
        return state.objective_row_objects[state.selected_panel_id];
    },

    // Return null if no objective row is selected
    get_subobjective_rows(state){
        if(state.selected_objective_id === false){
            return false;
        }
        return state.subobjective_row_objects[state.selected_objective_id]
    },
};

const actions = {
    async query_stakeholder_info({ state, commit, rootState }){
        let query_info = {};
        let problem_id  = rootState.problems.selected_problem_id;

        // 1. Query the panels for this problem
        let query = {};
        query.query = `{
            Stakeholder_Needs_Panel(where: {Problem: {id: {_eq: ${problem_id}}}}) {
              id
              name
              description
              weight
              index_id
            }
        }`
        let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
        let panel_objs = await dataResponse.json();

        let num_panels = panel_objs.data.Stakeholder_Needs_Panel.length;
        let panel_row_objects = [];
        for(let x=0;x<num_panels;x++){
            panel_row_objects.push(panel_objs.data.Stakeholder_Needs_Panel[x]);
        }
        commit('set_panel_row_objects', panel_row_objects);
        console.log("Stakeholder Panels", panel_row_objects);

        // 2. For each panel, get all objective row objects
        let objective_row_objects = {};
        for(let x=0;x<num_panels;x++){
            let panel_id = panel_row_objects[x].id;
            query = {};
            query.query = `{
                Stakeholder_Needs_Objective(where: {Stakeholder_Needs_Panel: {id: {_eq: ${panel_id}}}}) {
                  id
                  name
                  description
                  weight
                }
            }`
            let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
            let objective_objs = await dataResponse.json();
            objective_row_objects[panel_id] = objective_objs.data.Stakeholder_Needs_Objective;
        }
        commit('set_objective_row_objects', objective_row_objects);
        console.log("Stakeholder Objectives", objective_row_objects);


        // 3. For each of the panel's objectives, query that objective's subobjectives
        let subobjective_row_objects = {};
        let keys = Object.keys(objective_row_objects);
        for(let x=0;x<keys.length;x++){
            let object_array = objective_row_objects[keys[x]];

            for(let y=0;y<object_array.length;y++) {
                let objective_id = object_array[y].id;
                query = {};
                query.query = `{
                    Stakeholder_Needs_Subobjective(where: {Stakeholder_Needs_Objective: {id: {_eq: ${objective_id}}}}) {
                      id
                      name
                      description
                      weight
                    }
                }`
                let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
                let subobjective_objs = await dataResponse.json();
                subobjective_row_objects[objective_id] = subobjective_objs.data.Stakeholder_Needs_Subobjective;
            }
        }
        commit('set_subobjective_row_objects', subobjective_row_objects);
        console.log("Stakeholder Subobjectives", subobjective_row_objects);
    }


};

const mutations = {
    set_stakeholder_info(state, stakeholder_info){
        state.stakeholder_info = stakeholder_info;
    },

    set_panel_row_objects(state, panel_row_objects){
        state.panel_row_objects = panel_row_objects;
    },

    set_objective_row_objects(state, objective_row_objects){
        state.objective_row_objects = objective_row_objects;
    },

    set_subobjective_row_objects(state, subobjective_row_objects){
        state.subobjective_row_objects = subobjective_row_objects;
    },

    set_selected_panel_id(state, selected_panel_id){
        state.selected_panel_id = selected_panel_id;
    },

    set_selected_panel_name(state, selected_panel_name){
        state.selected_panel_name = selected_panel_name
    },

    set_selected_objective_id(state, selected_objective_id){
        state.selected_objective_id = selected_objective_id;
    },

    set_selected_objective_name(state, selected_objective_name){
        state.selected_objective_name = selected_objective_name;
    },

    reset_panel_selection(state){
        state.selected_panel_name = false;
        state.selected_panel_id = false;
    },
    reset_objective_selection(state){
        state.selected_objective_name = false;
        state.selected_objective_id = false;
    },
    reset_subobjective_selection(state){
        state.selected_subobjective_name = false;
        state.selected_subobjective_id = false;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}