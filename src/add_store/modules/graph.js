import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import {parse_root_node, parse_decision_nodes, parse_design_node, parse_child_nodes } from "../../scripts/graph-helpers";
import D3Network from 'vue-d3-network';

const state = {
    user_id: null,
    problem: 'ClimateCentric',


    // BUILD
    root_node: null,
    decision_nodes: null,
    design_node: null,

    selected_node: null,
    selected_edge: null,

    nodes: null,

    selected_design_id: 0,


};

// const initialState = _.cloneDeep(state);

const getters = {

    get_selected_design_id(state){
        return state.selected_design_id;
    }

};

const actions = {

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
    set_user_id(state, user_id){
        console.log("--> USER ID", user_id);
        state.user_id = user_id;
    },

    set_root_node(state, root_node){
        state.root_node = root_node;
        console.log("--> set_root_node", state.root_node);
    },
    set_decision_nodes(state, decision_nodes){
        state.decision_nodes = decision_nodes;
        console.log("--> set_decision_nodes", state.decision_nodes);
    },
    set_design_node(state, design_node){
        state.design_node = design_node;
        console.log("--> set_design_node", state.design_node);
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
