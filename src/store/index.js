import Vue from 'vue';
import Vuex from 'vuex';
import functionalityList from './modules/functionality-list';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions: {},
    modules: {
        functionalityList
    },
    strict: debug
});
