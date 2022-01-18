import {fetchGet, fetchPost} from "../../scripts/fetch-helpers";
import Vue from 'vue';
import auth from "../../store/modules/auth";
import {AbilityLevelQuery, ExcelExerciseQuery, LearningModuleQuery, TestHistoryQuery} from "../queries";
import { client } from "../../AdaptiveTesting";
import { get_slide_src } from "../content/utils";
import * as _ from "lodash-es";

const state = {

    // --> User Info <--
    user_id: null,
    username: 'Gabe Apaza',
    email: 'gapaza@tamu.edu',

    // --> User Tests <--
    test_history: [],

    // --> User Abilities <--
    ability_parameters: [],

    // --> Excel Exercises <--
    excel_exercises: [],

    // --> Learning Modules <--
    learning_module_pages: [],
};

const getters = {
    get_learning_module_info: (state) => (module_name) => {
        for(let x = 0; x < state.learning_module_pages.length; x++){
            let page = state.learning_module_pages[x];
            if(page.name === module_name){
                return page;
            }
        }
        return {}
    }
};

const actions = {
    async get_user_info({ state, commit }){
        console.log('--> SETTING USER INFO');

        let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
        let auth_information = await dataResponse.json();

        // --> 1. Load local user info
        if(auth_information.is_logged_in){
            await commit('set_user_id', auth_information.pk);
            await commit('set_user_username', auth_information.username);
            await commit('set_user_email', auth_information.email);
        }
    },
    async get_learning_module_pages({ state, commit }){

        // --> 1. Make sure the user_id is correct
        if(state.user_id === null){
            console.log('--> USER ID NOT SET, CANT GET LEARNING MODULE INFO');
            return;
        }

        // --> 2. Query user learning module info
        let query = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: LearningModuleQuery,
            variables: {
                user_id: state.user_id,
            }
        });

        let modules = query.data.modules;
        await commit('set_learning_module_pages', modules);
    },
    async get_excel_exercises({ state, commit }){

        // --> 1. Make sure the user_id is correct
        if(state.user_id === null){
            console.log('--> USER ID NOT SET, CANT GET LEARNING MODULE INFO');
            return;
        }

        // --> 2. Query excel exercise progression
        let query = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: ExcelExerciseQuery,
            variables: {
                user_id: state.user_id,
            }
        });

        let exercises = query.data.exercises;
        await commit('set_excel_exercises', exercises);
    },
    async get_ability_levels({ state, commit }){

        // --> 1. Make sure the user_id is correct
        if(state.user_id === null){
            console.log('--> USER ID NOT SET, CANT GET LEARNING MODULE INFO');
            return;
        }

        // --> 2. Query excel exercise progression
        let query = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: AbilityLevelQuery,
            variables: {
                user_id: state.user_id,
            }
        });

        let topics = query.data.topics;
        await commit('set_ability_levels', topics);
    },
    async get_test_history({ state, commit }){

        // --> 1. Make sure the user_id is correct
        if(state.user_id === null){
            console.log('--> USER ID NOT SET, CANT GET LEARNING MODULE INFO');
            return;
        }

        // --> 2. Query excel exercise progression
        let query = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: TestHistoryQuery,
            variables: {
                user_id: state.user_id,
            }
        });

        let tests = query.data.tests;
        await commit('set_test_history', tests);
    }
};

const mutations = {
    async set_user_id(state, user_id){
        state.user_id = user_id;
    },
    async set_user_username(state, username){
        state.username = username;
    },
    async set_user_email(state, email){
        state.email = email
    },
    async set_learning_module_pages(state, modules){

        // --> 1. Set learning module total info
        state.learning_module_pages = [];

        // --> 2. Set learning module pages from total info
        for(let x = 0; x < modules.length; x++){
            let module = modules[x];

            // --> 1. Set module link
            module.link = ('/' + module.name)

            // --> 2. Find module progress + insert slide images
            let progress = 0;
            let slide_questions = 0
            let slide_questions_completed = 0;
            for(let y = 0; y < module.slides.length; y++){
                let slide = module.slides[y];
                if(slide.type === 'question'){
                    slide_questions++;
                    if(slide.answered === true){
                        slide_questions_completed++;
                    }
                    slide.question.choices = JSON.parse(slide.question.choices);
                }
                else if(slide.type === 'info'){
                    slide.src = get_slide_src(slide.src)
                }
            }
            if(slide_questions === 0){
                progress = 0
            }
            else{
                progress = (slide_questions_completed / slide_questions);
            }
            module.progress = progress;
            module.slide_idx = module.join_info[0].slide_idx

            // --> 3. Push learning module page
            state.learning_module_pages.push(module);
        }
    },
    async set_excel_exercises(state, exercises){
        state.excel_exercises = [];
        for(let x = 0; x < exercises.length; x++){
            let exercise = exercises[0];
            state.excel_exercises.push({
                file: exercise.name,
                completed: exercise.completion[0].is_completed,
                reason: exercise.completion[0].reason
            })
        }
    },
    async set_ability_levels(state, topics){
        state.ability_parameters = [];
        for(let x = 0; x < topics.length; x++){
            let topic = topics[x];
            let value = topic.ability_level[0].value;
            if(value === null){
                value = 0.0;
            }
            state.ability_parameters.push({
                name: topic.name,
                value: value,
            })
        }
    },
    async set_test_history(state, tests){
        state.test_history = [];
        for(let x = 0; x < tests.length; x++){
            let test = tests[x];

            let date = test.date;
            let icon = 'mdi-brain';
            if(test.type === 'Targeted'){
                icon = 'mdi-bullseye-arrow'
            }

            state.test_history.push({
                type: test.type,
                score: test.score,
                date: date,
                icon: icon,
                time: test.duration,
                active:false
            });
        }
    },



    async update_slide_idx(state, module, idx){
        console.log('--> UPDATING SLIDE IDX BACKEND')
        let module_idx = 0;
        for(let x = 0; x < state.learning_module_pages.length; x++){
            let page = state.learning_module_pages[x];
            if(page.name === module){
                module_idx = x;
            }
        }
        Vue.set(state.learning_module_pages[module_idx], 'slide_idx', idx);

        // Mutation to change DB slide index

    },

    update_slide(state, obj){
        console.log('--> UPDATING SLIDE BACKEND', obj);
        let module = obj.module;
        let slide = obj.slide;
        let slide_idx = obj.slide_idx

        let module_idx = 0;
        for(let x = 0; x < state.learning_module_pages.length; x++){
            let page = state.learning_module_pages[x];
            if(page.name === module){
                module_idx = x;
            }
        }
        Vue.set(state.learning_module_pages[module_idx].slides, slide_idx, _.cloneDeep(slide));

        // Mutation to change DB slide

    },

    async update_module(state, module){
        let module_idx = 0;
        for(let x = 0; x < state.learning_module_pages.length; x++){
            let page = state.learning_module_pages[x];
            if(page.name === module.name){
                module_idx = x;
            }
        }
        Vue.set(state.learning_module_pages, module_idx, _.cloneDeep(module));
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
