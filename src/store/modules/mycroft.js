// initial state
import * as _ from 'lodash-es';
import {fetchPost} from '../../scripts/fetch-helpers';

// state
const state = {
    mycroft_connection: false,
    access_token: 'receiving...',


};
const initialState = _.cloneDeep(state);


// getters
const getters = {};

// actions
const actions = {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Check if a mycroft device is connected
    // calls: set_mycroft_connection
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async check_mycroft_connection({ state, commit, rootState }){

        // --> 1. Check to see if mycroft is already connected
        let reqData = new FormData();
        let dataResponse = await fetchPost(API_URL + 'mycroft/check-connection', reqData);

        if (dataResponse.ok) {
            let data = await dataResponse.json();
            if (data['connection'] === 'false'){
                commit('set_mycroft_connection', false);
                commit('set_access_token', data['access_token']);
            }
            else if (data['connection'] === 'true'){
                commit('set_mycroft_connection', true);
            }

        }
    },


    async get_disconnected_view({ state, commit, rootState }){},

    async get_connected_view({ state, commit, rootState}){},


};

// mutations
const mutations = {

    set_mycroft_connection(state, mycroft_connection){
        state.mycroft_connection = mycroft_connection;
    },
    set_access_token(state, access_token){
        state.access_token = access_token;
    },
    resetMycroft(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
};


export default {
    state,
    getters,
    actions,
    mutations
}
