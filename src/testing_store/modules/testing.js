import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import * as _ from 'lodash-es';

const state = {


    demo_mc1: {
        answer: -1,
        step: 1,
        text: 'What spectrum do radars operate in?',
        choices: [
            {text: 'Centimeter - Millimeter', correct: true},
            {text: 'Millimeter - Nanometer', correct: false},
            {text: 'Meter - Centimeter', correct: false},
            {text: 'None of the above', correct: false}
        ]
    },
    demo_mc2: {
        answer: -1,
        step: 2,
        text: 'Which of the following are NOT approaches to cost estimation?',
        choices: [
            {text: 'Top Down', correct: false},
            {text: 'Bottom Up', correct: false},
            {text: 'Kamikaze', correct: true},
            {text: 'Anaology', correct: false}
        ]
    },
    demo_mc3: {
        answer: -1,
        step: 3,
        text: 'Which of the following are considered functions of the spacecraft bus?',
        choices: [
            {text: 'Maintains temperature', correct: false},
            {text: 'Provides power', correct: false},
            {text: 'Transmits mission and tracking data to ground', correct: false},
            {text: 'All of the above', correct: true},
        ]
    },




    example_mc: {
        answer: -1,
        step: 4,
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
        await commit('push_exam_question', _.cloneDeep(state.demo_mc1))
        await commit('push_exam_question', _.cloneDeep(state.demo_mc2))
        await commit('push_exam_question', _.cloneDeep(state.demo_mc3))


        for(let x = 3; x < state.exam_length; x++){
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
