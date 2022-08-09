import Vue from 'vue';
import Vuex from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";

import graph from './modules/graph';
import table from './modules/table';
import vassarPages from './modules/add-pages';

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
        graph,
        table,
        vassarPages
    },
    strict: debug
});
