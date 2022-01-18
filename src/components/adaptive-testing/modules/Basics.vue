<template>
    <v-container>

        <v-snackbar v-model="correct_noti" timeout="5000" color="success" elevation="24">
            Nice job!
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="correct_noti = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar v-model="wrong_noti" timeout="5000" color="error" elevation="24">
            Incorrect
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="wrong_noti = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <v-row justify="center">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Basics</v-card-title>
                    <v-card-subtitle>Lifecycle Cost<br>Cost Estimation Methods</v-card-subtitle>
                    <v-divider style="margin-top: 0;"></v-divider>
                    <v-container>

                        <v-carousel v-model="slide_idx"
                            hide-delimiter-background
                        >

<!--                        PREV / NEXT SLIDE-->
                            <template v-slot:prev="{ on, attrs }">
                                <v-btn color="primary" v-bind="attrs" v-on="on" icon :disabled="disable_back">
                                    <v-icon>mdi-arrow-left-bold</v-icon>
                                </v-btn>
                            </template>
                            <template v-slot:next="{ on, attrs }">
                                <v-btn color="primary" v-bind="attrs" v-on="on" icon :disabled="disable_next">
                                    <v-icon>mdi-arrow-right-bold</v-icon>
                                </v-btn>
                            </template>

<!--                        SLIDE-->
                            <v-carousel-item v-for="(slide, idx) in content" :key="idx">

<!--                            CONTENT SLIDE-->
                                <v-img
                                    v-if="slide.type === 'info'"
                                    max-height="500"
                                    :src="slide.src"
                                    contain
                                ></v-img>

<!--                            QUESTION SLIDE-->
                                <v-container v-if="slide.type === 'question'">
                                    <v-card elevation="0" style="padding-left: 70px; padding-right: 70px; padding-top: 20px">
                                        <v-card-title style="padding-bottom: 0">{{ slide.question.text }}</v-card-title>
                                        <v-container>
                                            <v-row no-gutters>

<!--                                            CHOICES - QUESTION NOT COMPLETED-->
                                                <template v-if="slide.question.completed === false">
                                                    <v-radio-group v-model="slide.question.answer">
                                                        <v-radio
                                                            v-for="(option, idx) in slide.question.choices"
                                                            :key="idx"
                                                            :label="option.text"
                                                            :value="idx"
                                                        ></v-radio>
                                                    </v-radio-group>
                                                </template>

<!--                                            CHOICES - QUESTION COMPLETED-->
                                                <template v-if="slide.question.completed === true">
                                                    <v-radio-group v-model="slide.question.answer">
                                                        <v-radio
                                                            v-for="(option, idx) in slide.question.choices"
                                                            :key="idx"
                                                            :label="option.text"
                                                            :value="idx"
                                                            :color="get_question_choice_color(option.correct)"
                                                            :disabled="!option.correct"
                                                        ></v-radio>
                                                    </v-radio-group>
                                                </template>

                                            </v-row>

<!--                                        CHECK ANSWER-->
                                            <v-row no-gutters>
                                                <template v-if="slide.question.completed === false">
                                                    <v-btn color="primary" v-on:click="check_answer(slide)" :disabled="slide.question.answer === -1">Check</v-btn>
                                                </template>
                                                <template v-if="slide.question.completed === true">
                                                    <v-btn color="primary" disabled>Check</v-btn>
                                                </template>
                                            </v-row>

                                            <v-divider></v-divider>

<!--                                        EXPLANATION-->
                                            <v-row no-gutters>
                                                <v-expansion-panels>
                                                    <v-expansion-panel :disabled="!slide.question.completed">
                                                        <v-expansion-panel-header>Why?</v-expansion-panel-header>
                                                        <v-expansion-panel-content>
                                                            {{ slide.question.explanation }}
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>
                                            </v-row>

                                        </v-container>
                                    </v-card>
                                </v-container>

                            </v-carousel-item>
                        </v-carousel>

                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    import Vue from 'vue';
    import LifecycleCost from './AERO401/Slide4.png'
    import NASAModel from './AERO401/Slide3.png'
    import Approaches from './AERO401/Slide5.png'

    export default {
        name: "basics",
        components: {

        },
        data: function () {
            return {

                // --> Disable buttons state
                disable_back: true,
                disable_next: false,

                // --> Answer notifications
                correct_noti: false,
                wrong_noti: false,

                // --> Current slide state
                slide_idx: 0,

                // --> Learning module slides state
                content: [
                    { type: 'info', src: LifecycleCost },
                    {
                        type: 'question',
                        question: {
                            text: 'Q1. Which of these is considered to be a recurring cost element?',
                            explanation: 'Because only once satellite has to be fabricated in A, this would be considered a non-recurring cost element. Operations costs is the correct answer.',
                            answer: -1,
                            tries: 0,
                            max_tries: 2,
                            completed: false,
                            pass: false,
                            choices: [
                                {text: 'A. Satellite fabrication for a single sat mission', correct: false},
                                {text: 'B. Operations', correct: true},
                                {text: 'C. Development', correct: false},
                                {text: 'D. None of the above', correct: false}
                            ]
                        }
                    },
                    { type: 'info', src: Approaches },
                    {
                        type: 'question',
                        question: {
                            text: 'Q2. Which cost estimation approach uses Cost Estimation Relationships (CERs)?',
                            explanation: 'Lorem ipsum',
                            answer: -1,
                            tries: 0,
                            max_tries: 2,
                            completed: false,
                            pass: false,
                            choices: [
                                {text: 'Top-down', correct: true},
                                {text: 'Bottom-up', correct: false},
                                {text: 'Analogy', correct: false},
                                {text: 'All of the above', correct: false},
                            ]
                        }
                    },
                    { type: 'info', src: NASAModel },
                ],
            }
        },
        computed: {
            ...mapState({
                learning_module_pages: state => state.user.learning_module_pages,
            }),
        },
        methods: {
            check_answer(slide){
                this.correct_noti = false;
                this.wrong_noti = false;

                // --> 1. Determine if the answer is correct + increment the number of tries
                let correct = slide.question.choices[slide.question.answer].correct;
                slide.question.tries++;
                console.log("Checking answer:", slide.question.answer, slide.question.choices, correct)

                if(correct === true){
                    slide.question.pass = true;
                    this.correct_noti = true;
                    slide.question.completed = true;
                    Vue.set(slide.question, 'completed', true);
                    this.disable_next = false;
                }
                else{
                    this.wrong_noti = true;
                    if(slide.question.tries === slide.question.max_tries){
                        slide.question.completed = true;
                        Vue.set(slide.question, 'completed', true);
                        this.disable_next = false;

                        // Set choices to correct answer
                        for(let x = 0; x < slide.question.choices.length; x++){
                            if(slide.question.choices[x].correct === true){
                                slide.question.answer = x;
                                break;
                            }
                        }
                    }
                }
                this.carousel_button_logic(slide);
            },
            get_question_choice_color(value){
                if(value === true){
                    return 'success';
                }
                return 'error'
            },
            carousel_button_logic(current_slide){
                let val = this.slide_idx;

                // --> Set: disable_back
                if(val === 0){
                    this.disable_back = true
                }
                else{
                    this.disable_back = false;
                }

                // --> Set: disable_next
                if((val + 1) === this.content.length){
                    this.disable_next = true;
                }
                else if(current_slide.type === 'question'){
                    if(current_slide.question.completed === false){
                        this.disable_next = true;
                    }
                }
                else{
                    this.disable_next = false;
                }
            }
        },

        watch: {
            slide_idx: function(val, oldVal) {
                console.log('--> SLIDE IDX', oldVal, val)
                let current_slide = this.content[val];
                this.carousel_button_logic(current_slide)
            }
        },
        async mounted(){


            let current_slide = this.content[this.slide_idx];
            this.carousel_button_logic(current_slide)
        }
    }
</script>

<style scoped>


</style>