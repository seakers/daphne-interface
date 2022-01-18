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
                    <v-card-title>{{ module_name }}</v-card-title>
                    <v-card-subtitle>
                        Lifecycle Cost
                        <br>
                        Cost Estimation Methods
                    </v-card-subtitle>
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
                                                <template v-if="slide.answered === false">
                                                    <v-radio-group v-model="slide.choice_id">
                                                        <v-radio
                                                            v-for="(option, idx) in slide.question.choices"
                                                            :key="idx"
                                                            :label="option.text"
                                                            :value="idx"
                                                        ></v-radio>
                                                    </v-radio-group>
                                                </template>

<!--                                            CHOICES - QUESTION COMPLETED-->
                                                <template v-if="slide.answered === true">
                                                    <v-radio-group v-model="slide.choice_id">
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
                                                <template v-if="slide.answered === false">
                                                    <v-btn color="primary" v-on:click="check_answer(slide)" :disabled="slide.question.answer === -1">Check</v-btn>
                                                </template>
                                                <template v-if="slide.answered === true">
                                                    <v-btn color="primary" disabled>Check</v-btn>
                                                </template>
                                            </v-row>

                                            <v-divider></v-divider>

<!--                                        EXPLANATION-->
                                            <v-row no-gutters>
                                                <v-expansion-panels>
                                                    <v-expansion-panel :disabled="!slide.answered">
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
import {mapGetters, mapState} from 'vuex';
import Vue from 'vue';
import * as _ from 'lodash-es';



export default {
    name: "abstract-module",
    components: {

    },
    data: function () {
        return {
            // --> Disable slideshow buttons
            disable_back: true,
            disable_next: false,

            // --> Correct / Incorrect answer notifications
            correct_noti: false,
            wrong_noti: false,

            module: {},
        }
    },
    computed: {
        ...mapState({
            learning_module_pages: state => state.user.learning_module_pages,
        }),
        ...mapGetters({
            get_learning_module_info: 'get_learning_module_info'
        }),
        module_name(){
            console.log('--> LOADING LEARNING MODULE:', this.$route.params.name);
            return this.$route.params.name
        },
        // module(){
        //     let module = _.cloneDeep(this.get_learning_module_info(this.module_name));
        //     console.log('--> DEEP COPY LEARNING MODULE', module)
        //     return module
        // },
        content(){
            return this.module.slides;
        },
        slide_idx: {
            get() {
                return this.module.slide_idx;
            },
            set(idx) {
                this.$store.commit('update_slide_idx', this.module_name, idx);
                this.carousel_button_logic(idx)
                this.module.slide_idx = idx;
            }
        },
    },
    methods: {
        reset_module(){
            this.disable_back = true;
            this.disable_next = false;
            this.correct_noti = false;
            this.wrong_noti = false;
        },
        carousel_button_logic(slide_idx){
            let current_slide = this.module.slides[slide_idx];
            console.log('--> CAROUSEL LOGIC:', current_slide, slide_idx, this.content.length);

            // --> Set: disable_back
            if(slide_idx === 0){
                this.disable_back = true
            }
            else{
                this.disable_back = false;
            }

            // --> Set: disable_next
            if((slide_idx + 1) === this.content.length){
                this.disable_next = true;
            }
            else if(current_slide.type === 'question'){
                if(current_slide.answered === false){
                    this.disable_next = true;
                }
                else{
                    this.disable_next = false;
                }
            }
            else{
                this.disable_next = false;
            }
        },
        get_question_choice_color(value){
            if(value === true){
                return 'success';
            }
            return 'error'
        },
        check_answer(slide){
            console.log('--> CHECKING ANSWER:', slide);

            this.correct_noti = false;
            this.wrong_noti = false;

            // --> 1. Determine if question is correct
            let correct = slide.question.choices[slide.choice_id].correct;
            Vue.set(slide, 'attempts', (slide.attempts + 1));

            if(correct === true){
                this.correct_noti = true;
                this.disable_next = false;

                Vue.set(slide, 'correct', true);
                Vue.set(slide, 'answered', true);
            }
            else{
                this.wrong_noti = true;
                if(slide.attempts === 2){
                    this.disable_next = false;


                    Vue.set(slide, 'correct', false);
                    Vue.set(slide, 'answered', true);


                    // Set choice to correct answer
                    for(let x = 0; x < slide.question.choices.length; x++){
                        if(slide.question.choices[x].correct === true){
                            slide.choice_id = x;
                            break;
                        }
                    }
                }
            }
            this.carousel_button_logic(this.slide_idx);
            this.$store.commit('update_slide', {
                module: this.module_name,
                slide: slide,
                slide_idx: this.slide_idx
            });
        },
    },
    watch: {
        module_name() {
            this.reset_module();
            this.module = _.cloneDeep(this.get_learning_module_info(this.module_name));
            console.log('--> DEEP COPY LEARNING MODULE', module);
        },
    },
    mounted(){
        this.reset_module();
        this.module = _.cloneDeep(this.get_learning_module_info(this.module_name));
        console.log('--> DEEP COPY LEARNING MODULE MOUNTED', module)
    }
}
</script>

<style scoped>


</style>