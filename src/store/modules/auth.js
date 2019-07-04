// initial state
import * as _ from 'lodash-es';
import {fetchPost} from '../../scripts/fetch-helpers';

const state = {
    isLoggedIn: false,
    username: '',
    permissions: [],
    hasLoginError: false,
    loginError: '',
    hasRegistrationError: false,
    registrationError: '',
    resetPasswordSent: false
};

const initialState = _.cloneDeep(state);

// getters
const getters = {
};

// actions
const actions = {
    async loginUser({ state, commit, rootState }, { username, password }) {
        try {
            let reqData = new FormData();
            reqData.append("username", username);
            reqData.append("password", password);
            let dataResponse = await fetchPost(API_URL + 'auth/login', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                console.log(data);
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
    },
    async logoutUser({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'auth/logout', reqData);

            if (dataResponse.ok) {
                await dataResponse.json();
                commit('logUserOut');
            }
            else {
                console.error('Error logging out.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async registerUser({ state, commit }, form) {
        try {
            let reqData = new FormData(form);
            let dataResponse = await fetchPost(API_URL + 'auth/register', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                if (data['status'] === 'registered') {
                    commit('activateModal', 'LoginModal');
                }
                else {
                    commit('setRegistrationError', data);
                }
            }
            else {
                console.error('Error registering.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },
    async resetPasswordEmail({ state, commit }, form) {
        try {
            let reqData = new FormData(form);
            let dataResponse = await fetchPost(API_URL + 'auth/reset-password', reqData);

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                if (data['status'] === 'email sent') {
                    commit('setResetPasswordSent', true);
                }
                else {
                    commit('setRegistrationError', data);
                }
            }
            else {
                console.error('Error sending the email.');
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
    logUserOut(state) {
        state.isLoggedIn = false;
        state.hasLoginError = false;
        state.username = '';
        state.permissions = [];
    },
    setLoginError(state, loginInfo) {
        state.isLoggedIn = false;
        state.hasLoginError = true;
        state.loginError = loginInfo['login_error'];
    },
    setRegistrationError(state, registrationInfo) {
        state.isLoggedIn = false;
        state.hasRegistrationError = true;
        state.registrationError = registrationInfo['login_error'];
    },
    setResetPasswordSent(state, resetPasswordSent) {
        state.resetPasswordSent = true;
    },
    restoreAuth(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            state[key] = recoveredState[key];
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
