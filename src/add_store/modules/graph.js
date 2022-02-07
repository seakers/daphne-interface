import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import {parse_root_node, parse_design_node, parse_child_nodes, parse_decision_nodes} from "../utils";
import Vue from 'vue';
import D3Network from 'vue-d3-network';
import * as _ from "lodash-es";

const state = {





    formulation_name: '',

    // --> NEO4J Client (experimental)
    neo: null,


    // --> NEO4J Connection
    protocol: 'bolt',
    host: 'localhost',
    port: 7688,
    username: 'neo4j',
    password: 'test',


    // --> Query Nodes
    root_node: null,
    decision_nodes: null,
    design_node: null,

    // --> Graph nodes / edges
    nodes: [],
    edges: [],

    selected_node: null,
    selected_edge: null,



};

// const initialState = _.cloneDeep(state);

const getters = {

    get_selected_design_id(state){
        return state.selected_design_id;
    }

};

const actions = {

    connect_graph({ state, commit }){
        state.neo.connect(state.protocol, state.host, state.port, state.username, state.password).then(driver => {
            console.log('--> CONNECTING NEO4J');
        })
    },


    // --> NEO4J QUERIES
    async query_formulation({ state, commit, dispatch }, formulation_name){

        await dispatch('query_root', formulation_name);
        await dispatch('query_decisions', formulation_name);
        await dispatch('query_design', formulation_name);



    },

    async query_root({ state, commit, dispatch }, formulation_name){
        let query = `MATCH (n:${formulation_name}:Root) RETURN n.name, n.type, n.initial_params`;
        await state.neo.run(query, {})
            .then(res => {
                console.log('--> ROOT QUERY:', res);
                let result = null;
                if(res.records.length > 0){
                    result = _.cloneDeep(parse_root_node(res))
                }

                commit('set_root_node', result);
            }
        );
    },

    async query_decisions({ state, commit, dispatch }, formulation_name){
        let query = `MATCH (n:${formulation_name}:Decision) RETURN n.name, n.type, n.decisions, n.dependencies`;
        await state.neo.run(query, {})
            .then(res => {
                console.log('--> DECISION QUERY:', res);
                let result = null;
                if(res.records.length > 0){
                    result = _.cloneDeep(parse_decision_nodes(res))
                }

                commit('set_decision_nodes', result);
            }
        );
    },

    async query_design({ state, commit, dispatch }, formulation_name){
        let query = `MATCH (n:${formulation_name}:Design) RETURN n.name, n.type, n.designs`;
        await state.neo.run(query, {})
            .then(res => {
                console.log('--> DESIGN QUERY:', res);
                let result = null;
                if(res.records.length > 0){
                    result = _.cloneDeep(parse_design_node(res))
                }

                commit('set_design_node', result);
            });
    },









    async build_graph({ state, commit, dispatch }, neo4j){

        // --> 1. Check if graph can be built
        if(state.root_node === null || state.decision_nodes === null || state.design_node === null){
            console.log('--> COULD NOT BUILD GRAPH');
            return 0;
        }

        // --> 2. Build nodes
        await dispatch('build_nodes', neo4j);

        // --> 3. Build edges
        await dispatch('build_edges', neo4j);
    },

    async build_nodes({state, commit}, neo4j){
        let nodes = []
        nodes.push(state.root_node);
        for(let x=0;x<state.decision_nodes.length;x++){
            nodes.push(state.decision_nodes[x]);
        }
        commit('set_design_node_id', nodes.length + 1);
        nodes.push(state.design_node);
        await commit('set_nodes', nodes);
    },

    async build_edges({state, commit}, neo4j){
        let edges = [];

        // 1. Iterate over nodes
        for(let x=0;x<state.nodes.length;x++){
            let node = state.nodes[x];

            // This should set this.child_data
            let child_data = null;
            await neo4j.run(`
                    MATCH (m:${state.formulation_name}:${node.type})-->(dec)
                    WHERE m.name = "${node.name}"
                    RETURN dec.name, dec.type`,
                {}
            ).then(res => {
                child_data = parse_child_nodes(res);
            });

            for(let y=0;y<child_data.length;y++){
                let child = child_data[y];
                let link = {
                    sid: node.id,
                    tid: this.nodes.find(item => item.name === child.name && item.type === child.type).id,
                    _color: 'gray'
                }
                edges.push(link);
            }
        }

        await commit('set_edges', edges);
    },


};

const mutations = {
    set_neo(state, neo){
        state.neo = neo;
    },



    // --> Queries from Graph vue component
    set_root_node(state, root_node){
        state.root_node = root_node;
        console.log("--> ROOT NODE", state.root_node);
    },
    set_decision_nodes(state, decision_nodes){
        state.decision_nodes = decision_nodes;
        console.log("--> DECISION NODES", state.decision_nodes);
    },
    set_design_node(state, design_node){
        state.design_node = design_node;
        console.log("--> DESIGN NODE", state.design_node);
    },
    set_design_node_id(state, id){
        state.design_node.id = id;
    },



    // --> Build graph
    async set_nodes(state, nodes){
        state.nodes = nodes;
    },
    async set_edges(state, edges){
        state.edges = edges;
    },







    async set_selected_node(state, selected_node){
        state.selected_node = selected_node;
    },
    async set_selected_edge(state, selected_edge){
        state.selected_edge = selected_edge;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
