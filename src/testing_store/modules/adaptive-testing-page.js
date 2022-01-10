import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    user_id: null,
};

const getters = {

};

const actions = {

};

const mutations = {
    set_user_id(state, user_id){
        state.user_id = user_id;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
