// initial state
import * as _ from 'lodash-es';
import {fetchPost} from '../../scripts/fetch-helpers';

const state = {
    isLoggedIn: false,
    username: '',
    permissions: [],
    hasLoginError: false,
    loginError: ''
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {
    async loginUser({ state, commit, rootState }, form) {
        try {
            let reqData = new FormData(form);
            let dataResponse = await fetchPost('/api/auth/login',  reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                if (data['status'] === 'logged_in') {
                    commit('logUserIn', data);
                }
                else {
                    commit('setLoginError', data);
                }
            }
            else {
                console.error('Error logging in.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    logUserIn(state, userInfo) {
        state.isLoggedIn = true;
        state.hasLoginError = false;
        state.username = userInfo['username'];
        state.permissions = userInfo['permissions'];

    },
    setLoginError(state, loginInfo) {
        state.isLoggedIn = false;
        state.hasLoginError = true;
        state.loginError = loginInfo['login_error'];
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
