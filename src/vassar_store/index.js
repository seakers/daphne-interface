import Vue from 'vue';
import Vuex from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";

import vassarPages from './modules/vassar-pages';
import table from './modules/table';

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
        table
    },
    strict: debug
});
