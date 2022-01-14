import Vue from 'vue';
import Vuex from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";

import adaptiveTestingPages from './modules/adaptive-testing-page';
import adaptiveTest from './modules/adaptive-test'

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
        adaptiveTestingPages,
        adaptiveTest
    },
    strict: debug
});
