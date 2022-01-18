import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import * as _ from 'lodash-es';

const state = {

    example_mc: {
        answer: -1,
        step: 1,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?',
        choices: [
            {text: 'Choice 1', correct: true},
            {text: 'Choice 2', correct: false},
            {text: 'Choice 3', correct: false},
            {text: 'Choice 4', correct: false}
        ]
    },

    exam: [],
    exam_duration: 5,
    exam_length: 10,
};

const getters = {

};

const actions = {
    async create_adaptive_exam({ state, commit, rootState}){

        // 1. Delete the last exam
        await commit('new_exam');

        // 2. For now, build temporary exam
        for(let x = 0; x < state.exam_length; x++){
            let clone = _.cloneDeep(state.example_mc);
            clone.step = x + 1;
            await commit('push_exam_question', clone)
        }
    }
};

const mutations = {
    async new_exam(state){
        state.exam = [];
    },
    async set_duration(state, exam_duration){
        state.exam_duration = exam_duration;
    },

    async push_exam_question(state, question){
        state.exam.push(question)
    },


    set_exam_length(state, exam_length){
        state.exam_length = exam_length;
    },
    set_exam_duration(state, exam_duration){
        state.exam_duration = exam_duration;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
