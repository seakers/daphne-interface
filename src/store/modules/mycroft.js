// initial state
import * as _ from 'lodash-es';
import {fetchPost} from '../../scripts/fetch-helpers';

// state
const state = {


};
const initialState = _.cloneDeep(state);


// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {



    resetMycroft(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
};


export default {
    state,
    getters,
    actions,
    mutations
}
