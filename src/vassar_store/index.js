import Vue from 'vue';
import Vuex from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";

import vassarPages from './modules/vassar-pages';
import stakeholders from './modules/stakeholders';
import groups from './modules/groups';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        vassarPages,
        stakeholders,
        groups
    },
    strict: debug
});
