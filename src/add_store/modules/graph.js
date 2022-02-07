import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import {get_node_color} from "../utils";
import Vue from 'vue';
import {parse_root_node, parse_decision_nodes, parse_design_node, parse_child_nodes } from "../../scripts/graph-helpers";
import D3Network from 'vue-d3-network';
import * as _ from "lodash-es";

const state = {


    // --> OLD STUFF
    user_id: null,
    problem: 'ClimateCentric',

    selected_node: null,
    selected_edge: null,

    nodes: null,

    selected_design_id: 0,







    // -----------------------------------------------------------

    formulation_name: 'Decadal',
    problem_name: 'Decadal',

    // --> NEO4J Connection
    protocol: 'bolt',
    host: 'localhost',
    port: 7688,
    username: 'neo4j',
    password: 'test',


    // --> NODES
    root_node: null,
    decision_nodes: null,
    design_node: null,



};

// const initialState = _.cloneDeep(state);

const getters = {

    get_selected_design_id(state){
        return state.selected_design_id;
    }

};

const actions = {

    async connect({ state, commit }, neo4j){
        console.log('--> CONNECTING NEO4J');
        neo4j.connect(state.protocol, state.host, state.port, state.username, state.password).then(driver => {
            // Update Context
        })
    },


    async build_graph({ state, commit, dispatch }, neo4j){


        // --> 1. Query root node
        await dispatch('query_root', neo4j);

        // --> 2. Query decision nodes
        await dispatch('query_decisions', neo4j);

        // --> 3. Query final node
        await dispatch('query_design', neo4j);


    },


    async query_root({ state, commit }, neo4j){
        let query = `MATCH (n:${state.formulation_name}:Root) RETURN n.name, n.type, n.initial_params`;
        await neo4j.run(query, {})
            .then(res => {
                let record = res.records[0];
                let root = {
                    id: 1,
                    _color: 'green',
                    name: record._fields[0],
                    type: record._fields[1],
                    initial_params: JSON.parse(record._fields[2])
                }
                await commit('set_root_node', _.cloneDeep(root));
            }
        );
    },

    async query_decisions({ state, commit }, neo4j){
        let query = `MATCH (n:${state.formulation_name}:Decision) RETURN n.name, n.type, n.decisions, n.dependencies`;
        await neo4j.run(query, {})
            .then(res => {
                let decisions = [];
                let records = res.records;
                for(let x=0;x<records.length;x++){
                    let record = records[x];
                    decisions.push({
                        id: x + 2,
                        _color: get_node_color(record._fields[1]),
                        name: record._fields[0],
                        type: record._fields[1],
                        decisions: JSON.parse(record._fields[2]),
                    });
                }
                await commit('set_decision_nodes', _.cloneDeep(decisions));
            });
    },

    async query_design({ state, commit }, neo4j){
        let query = `MATCH (n:${state.formulation_name}:Design) RETURN n.name, n.type, n.designs`;

    },












    async get_user_id({commit}){

        let dataResponse = await fetchGet(API_URL + 'auth/check-status');
        let auth_information = await dataResponse.json();
        console.log("Login Status:", auth_information.is_logged_in);

        // Get the user's private key
        if(auth_information.is_logged_in){
            dataResponse         = await fetchPost(API_URL + 'auth/get-user-pk');
            let user_information = await dataResponse.json();
            commit('set_user_id', user_information['user_id']);
            commit('user__set_id', user_information['user_id']);
        }

    },
};

const mutations = {


    async set_root_node(state, root_node){
        state.root_node = root_node;
        console.log("--> ROOT NODE", state.root_node);
    },
    async set_decision_nodes(state, decision_nodes){
        state.decision_nodes = decision_nodes;
        console.log("--> DECISION NODES", state.decision_nodes);
    },
    async set_design_node(state, design_node){
        state.design_node = design_node;
        console.log("--> DESIGN NODE", state.design_node);
    },




    set_selected_node(state, selected_node){
        state.selected_node = selected_node;
    },
    set_selected_edge(state, selected_edge){
        state.selected_edge = selected_edge;
    },

    set_nodes(state, nodes){
        state.nodes = nodes;
    },

    set_selected_design_id(state, selected_desing_id){
        state.selected_design_id = selected_desing_id;
    },

};

export default {
    state,
    getters,
    actions,
    mutations
}
