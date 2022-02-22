import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import {parse_root_node, parse_design_node, parse_child_nodes, parse_decision_nodes} from "../utils";
import Vue from 'vue';
import D3Network from 'vue-d3-network';
import * as _ from "lodash-es";

const state = {



    // --> NEO4J Client (experimental)
    neo: null,
    nodes: [],
    edges: [],


    // --> NEO4J Connection
    protocol: 'bolt',
    host: 'localhost',
    port: 7687,
    username: 'neo4j',
    password: 'test',


    // --> Query Nodes
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


        await dispatch('build_graph', formulation_name);
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



    // --> NEO4J --> vue-d3-network
    async build_graph({ state, commit }, formulation_name){
        let unique_idx = 1;

        if(state.root_node === null || state.decision_nodes === null || state.design_node === null){
            console.log('--> COULD NOT BUILD GRAPH');
            return null;
        }


        // --> 1. Push all nodes into list (root node, decision nodes, design node)
        console.log('--> vue-d3-network conversion - nodes');
        let nodes = []
        let temp_root = _.cloneDeep(state.root_node);
        temp_root.obj_type = 'Node';
        temp_root.unique_idx = unique_idx;
        unique_idx += 1;
        nodes.push(temp_root);
        for(let x=0;x<state.decision_nodes.length;x++){
            let temp_dec = _.cloneDeep(state.decision_nodes[x]);
            temp_dec.obj_type = 'Node';
            temp_dec.unique_idx = unique_idx;
            unique_idx += 1;
            nodes.push(temp_dec);
        }
        let design_node = _.cloneDeep(state.design_node);
        design_node.id = (nodes.length + 1);
        design_node.obj_type = 'Node';
        design_node.unique_idx = unique_idx;
        unique_idx += 1;
        nodes.push(design_node);
        await commit('set_nodes', nodes);


        // --> 2. Build edges
        console.log('--> vue-d3-network conversion - edges');
        let edges = [];
        for(let x=0;x<state.nodes.length;x++){
            let node = _.cloneDeep(state.nodes[x]);

            // Get all child nodes
            let child_data = null;
            await state.neo.run(`
                    MATCH (m:${formulation_name}:${node.type})-->(dec)
                    WHERE m.name = "${node.name}"
                    RETURN dec.name, dec.type`,
                {}
            ).then(res => {
                child_data = parse_child_nodes(res);
            });

            // For each child node, create an edge
            for(let y=0;y<child_data.length;y++){
                let child = child_data[y];
                let link = {
                    sid: node.id,
                    tid: state.nodes.find(item => item.name === child.name && item.type === child.type).id,
                    _color: '#877b67',
                    obj_type: 'Edge',
                    unique_idx: unique_idx,
                }
                unique_idx += 1;
                edges.push(link);
            }
        }
        await commit('set_edges', edges);
    }
};

const mutations = {
    set_neo(state, neo){
        state.neo = neo;
    },


    // --> NEO4J QUERY OBJECTS
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


    // --> VUE-D3-NETWORK OBJECTS
    async set_nodes(state, nodes){
        state.nodes = nodes;
    },
    async set_edges(state, edges){
        state.edges = edges;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
