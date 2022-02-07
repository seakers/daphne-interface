import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import auth from "../../store/modules/auth";
import { client } from "../../adds";
import * as _ from "lodash-es";

const state = {

    // --> User Info <--
    user_id: null,
    username: '',
    email: '',


    // --> Navigation Drawer State <--
    drawer: true,
    drawer_store: null,


    // --> Login Module State <--
    login_overlay: false,
};

const getters = {

};

const actions = {
    async initialize({ state, commit, dispatch }, neo4j){
        console.log('--> SETTING USER INFO');

        // --> 1. Check to see if user is logged in
        let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
        let auth_information = await dataResponse.json();


        if(auth_information.is_logged_in){
            // --> 2. If logged in, get: username, email, pk
            await commit('set_user_id', auth_information.pk);
            await commit('set_user_username', auth_information.username);
            await commit('set_user_email', auth_information.email);
            await commit('set_login_overlay', false);
            await dispatch('connect', neo4j);
        }
        else{
            // --> 3. If not logged in, open login overlay
            await commit('set_login_overlay', true);
        }
    },
};

const mutations = {
    async set_user_id(state, user_id){
        state.user_id = user_id;
    },
    async set_user_username(state, username){
        state.username = username;
    },
    async set_user_email(state, email){
        state.email = email
    },
    async set_login_overlay(state, login_overlay){
        state.login_overlay = login_overlay;
    },
    async set_drawer_value(state, drawer){
        state.drawer = drawer;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
