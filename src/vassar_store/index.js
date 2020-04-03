import Vue from 'vue';
import Vuex from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";

import vassarPages from './modules/vassar-pages';
import stakeholders from './modules/stakeholders';
import groups from './modules/groups';
import problems from './modules/problems';
import requirements from './modules/requirements';
import missionAnalysis from './modules/mission-analysis';
import attributes from './modules/attributes';
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
        stakeholders,
        groups,
        problems,
        requirements,
        missionAnalysis,
        attributes,
        table
    },
    strict: debug
});
