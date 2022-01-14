import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {
    user_id: null,
    username: 'Gabe Apaza',
    email: 'gapaza@tamu.edu',
    ability_parameters: [
        { name: 'Topic 1', value: 0.65 },
        { name: 'Topic 2', value: 0.32 },
        { name: 'Topic 3', value: 0.29 },
        { name: 'Topic 4', value: 0.74 }
    ],
    test_history: [
        { type: 'Adaptive', score: '5/15', date: '1/4/2021', icon: 'mdi-brain', time: 30, active:false},
        { type: 'Adaptive', score: '12/20', date: '1/7/2021', icon: 'mdi-brain', time: 60, active:false},
        { type: 'Targeted', score: '20/22', date: '1/8/2021', icon: 'mdi-bullseye-arrow', time: 120, active:false}
    ],
    tests: [
        { title: 'Adaptive Test', icon: 'mdi-brain', link: '/adaptive-test'},
        { title: 'Targeted Test', icon: 'mdi-bullseye-arrow', link: '/targeted-test'},
    ],
    learning_modules: [
        { title: 'Module 1', icon: 'mdi-function-variant', link: '/cers', progress: 1},
        { title: 'Module 2', icon: 'mdi-factory', link: '/eos', progress: 1},
        { title: 'Module 3', icon: 'mdi-book-open-blank-variant', link: '/em', progress: 0.2},
        { title: 'Module 4', icon: 'mdi-cash', link: '/em', progress: 0},
    ],
    excel_exercises: [
        { file: 'Tutorial.xls',  completed: true},
        { file: 'Exercise 1.xls', completed: true},
        { file: 'Exercise 2.xls', completed: false},
        { file: 'Exercise 3.xls', completed: false},
        { file: 'Exercise 4.xls', completed: false},
        { file: 'Exercise 5.xls', completed: false},
    ],
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
