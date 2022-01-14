import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import * as _ from 'lodash-es';

const state = {

    example_question_mc: {
        step: 1,
        answer: 0,
        type: 'MC',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?',
        choices: [
            {text: 'Choice 1', correct: true},
            {text: 'Choice 2', correct: false},
            {text: 'Choice 3', correct: false},
            {text: 'Choice 4', correct: false}
        ]
    },


    // Possible question types: MC | TF
    questions: [
        {
            step: 1,
            type: 'MC',
            text: 'Which cost estimation method starts with pricing individual components and works its way up to the whole system?',
            choices: [
                {text: 'Bottom up cost estimation', correct: true},
                {text: 'Top down cost estimation', correct: false},
                {text: 'Parametric cost estimation', correct: false}
            ]
        },
        {
            step: 2,
            type: 'MC',
            text: 'Example question...',
            choices: [
                {text: 'Choice 1', correct: true},
                {text: 'Choice 2', correct: false},
                {text: 'Choice 3', correct: false},
                {text: 'Choice 4', correct: false}
            ]
        },
        {
            step: 3,
            type: 'MC',
            text: 'Example question...',
            choices: [
                {text: 'Choice 1', correct: true},
                {text: 'Choice 2', correct: false},
                {text: 'Choice 3', correct: false},
                {text: 'Choice 4', correct: false}
            ]
        },
        {
            step: 4,
            type: 'MC',
            text: 'Example question...',
            choices: [
                {text: 'Choice 1', correct: true},
                {text: 'Choice 2', correct: false},
                {text: 'Choice 3', correct: false},
                {text: 'Choice 4', correct: false}
            ]
        }
    ],



    exam: [],
    exam_length: 1,
};

const getters = {

};

const actions = {
    async build_adaptive_exam({ state, commit, rootState}, questions, exam_length){
        await commit('clear_exam');
        for(let x = 0; x < questions; x++){
            let clone = _.cloneDeep(state.example_question_mc);
            clone.step = x + 1;
            await commit('add_exam_question', clone)
        }
    }
};

const mutations = {
    async clear_exam(state){
        state.exam = [];
    },
    async add_exam_question(state, question){
        state.exam.push(question)
    },
    async set_exam_length(state, exam_length){
        state.exam_length = exam_length;
    }

};

export default {
    state,
    getters,
    actions,
    mutations
}
