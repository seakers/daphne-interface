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
    username: 'Gabe Apaza',
    email: 'gapaza@tamu.edu',

    drawer: null,
};

const getters = {

};

const actions = {
    async get_user_info({ state, commit }){
        console.log('--> SETTING USER INFO');

        let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
        let auth_information = await dataResponse.json();

        // --> 1. Load local user info
        if(auth_information.is_logged_in){
            await commit('set_user_id', auth_information.pk);
            await commit('set_user_username', auth_information.username);
            await commit('set_user_email', auth_information.email);
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
