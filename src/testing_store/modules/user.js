import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';

const state = {

    // --> User info
    user_id: null,
    username: 'Gabe Apaza',
    email: 'gapaza@tamu.edu',

    // --> User abilities
    ability_parameters: [
        { name: 'Topic 1', value: 0.65 },
        { name: 'Topic 2', value: 0.32 },
        { name: 'Topic 3', value: 0.29 },
        { name: 'Topic 4', value: 0.74 }
    ],

    // --> User testing history
    test_history: [
        { type: 'Adaptive', score: '5/15', date: '1/4/2021', icon: 'mdi-brain', time: 30, active:false},
        { type: 'Adaptive', score: '12/20', date: '1/7/2021', icon: 'mdi-brain', time: 60, active:false},
        { type: 'Targeted', score: '20/22', date: '1/8/2021', icon: 'mdi-bullseye-arrow', time: 120, active:false}
    ],

    // --> User excel exercise progression
    excel_exercises: [
        { file: 'Tutorial.xls',  completed: true},
        { file: 'Exercise 1.xls', completed: true},
        { file: 'Exercise 2.xls', completed: false},
        { file: 'Exercise 3.xls', completed: false},
        { file: 'Exercise 4.xls', completed: false},
        { file: 'Exercise 5.xls', completed: false},
    ],


    // -----------------------------------------------------------------------


    // --> Mastery page (main items in navbar)
    main_items: [
        { title: 'Mastery', icon: 'mdi-school', link: '/mastery'},
    ],

    // --> Learning modules
    learning_modules: [
        { title: 'Basics', icon: 'mdi-function-variant', link: '/basics', progress: 0},
    ],

    // --> Tests
    tests: [
        { title: 'Adaptive Test', icon: 'mdi-brain', link: '/adaptive-test'},
        { title: 'Targeted Test', icon: 'mdi-bullseye-arrow', link: '/targeted-test'},
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
