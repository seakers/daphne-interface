import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import auth from "../../store/modules/auth";
import {AbilityLevelQuery, ExcelExerciseQuery, LearningModuleQuery, TestHistoryQuery} from "../queries";
import { client } from "../../AdaptiveTesting";
import { get_slide_src } from "../content/utils";
import * as _ from "lodash-es";

const state = {

    // --> User Info <--
    user_id: null,
    username: '',
    email: '',


    // --> Navigation Drawer State <--
    drawer: null,
    drawer_store: null,
    chatbox: null,
    chatbox_store: null,


    // --> Login Module State <--
    login_overlay: true,


    // --> Chatbox State <--
    user_message: '',
    dialogue: [
        {
            message: 'What do you think of this design?',
            from: 'User'
        },
        {
            message: 'This design should not contain the instrument VIIRS',
            from: 'Daphne'
        },
        {
            message: 'Why does this design cost so much?',
            from: 'User'
        }

    ]
};

const getters = {

};

const actions = {
    async initialize({ state, commit }){
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


    set_drawer_value(state, drawer){
        state.drawer = drawer;
    },
    set_chatbox_value(state, chatbox){
        state.chatbox = chatbox;
    },


    set_user_message_value(state, user_message){
        state.user_message = user_message;
    },


    async set_login_overlay(state, login_overlay){
        state.login_overlay = login_overlay;
    },




    open_slide(state){
        state.chatbox_store = state.chatbox;
        state.drawer_store = state.drawer;
        state.chatbox = false;
        state.drawer = false;
    },
    close_slide(state){
        state.chatbox = state.chatbox_store;
        state.drawer = state.drawer_store
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
