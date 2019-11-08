<template>
    <!-- Container for question -->
    <div>
        <div style="margin-bottom: 7px; text-align: center; border-bottom: 1px solid #dbdbdb;"><b>Teacher</b></div>
        <div class="content">
            {{ current_question_display }}
        </div>

        <template v-if="answered === false">
            <template v-if="question_type === 'sensitivity'">
                <div class="buttons">
                    <button class="button" v-on:click="evaluateAnswerOne">{{ choice_one_display }}</button>
                    <button class="button" v-on:click="evaluateAnswerTwo">{{ choice_two_display }}</button>
                </div>
            </template>

            <template v-if="question_type === 'design'">
                <div class="buttons">
                    <button style="margin: 10px; padding: 10px; border-radius: 10px; border: solid grey 2px;" v-on:click="evaluateAnswerOne">
                        <div style="padding-bottom: 3px; font-weight: 500;">Design 1</div>
                        <design-model v-bind:designDetails="choice_one_display"></design-model>
                    </button>
                    <button style="margin: 10px; padding: 10px; border-radius: 10px; border: solid grey 2px;" v-on:click="evaluateAnswerTwo">
                        <div style="padding-bottom: 3px; font-weight: 500;">Design 2</div>
                        <design-model v-bind:designDetails="choice_two_display"></design-model>
                    </button>
                </div>
            </template>
        </template>

        <template v-if="answered === true">
            <template v-if="question_type === 'sensitivity'">
                <div class="buttons">
                    <button class="button" v-bind:class="{ 'is-success': first_is_correct, 'is-danger': first_is_incorrect }">{{ choice_one_revealed_display }}</button>
                    <button class="button" v-bind:class="{ 'is-success': second_is_correct, 'is-danger': second_is_incorrect }">{{ choice_two_revealed_display }}</button>
                </div>
            </template>

            <template v-if="question_type === 'design'">
                <div class="buttons">
                    <button v-bind:class="{ 'correct-answer': first_is_correct, 'wrong-answer': first_is_incorrect }" style="margin: 10px; padding: 10px; border-radius: 10px; border: solid grey 2px;">
                        <div style="padding-bottom: 3px; font-weight: 500;">Design 1</div>
                        <design-model v-bind:designDetails="choice_one_display"></design-model>
                    </button>
                    <button v-bind:class="{ 'correct-answer': second_is_correct, 'wrong-answer': second_is_incorrect }" style="margin: 10px; padding: 10px; border-radius: 10px; border: solid grey 2px;">
                        <div style="padding-bottom: 3px; font-weight: 500;">Design 2</div>
                        <design-model v-bind:designDetails="choice_two_display"></design-model>
                    </button>
                </div>
            </template>
        </template>

    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import DesignModel from "./DesignModel";
    export default {
        name: "QuestionTemplate",



        data() {
            return {
                answered: false,
                first_is_correct: false,
                first_is_incorrect: false,

                second_is_correct: false,
                second_is_incorrect: false,

                question_type: '',
                choice_one_display: '',
                choice_two_display: '',
                choice_one_revealed_display: '',
                choice_two_revealed_display: '',
                correct_choice_display: '',
                current_question_display: '',
            }
        },

        components: {
            'design-model': DesignModel,
        },


        computed: {
            ...mapGetters({
                current_question_type: 'get_current_question_type',
                current_question: 'get_current_teacher_question',
                choice_one: 'get_teacher_choice_one',
                choice_two: 'get_teacher_choice_two',
                choice_one_revealed: 'get_teacher_choice_one_revealed',
                choice_two_revealed: 'get_teacher_choice_two_revealed',
                correct_choice: 'get_correct_choice',
            }),
        },


        methods: {
            evaluateAnswerOne(){
                if(this.correct_choice_display === 0){       //--> First choice picked, correct
                    console.log("Correct Answer");
                    this.first_is_correct = true;
                    this.second_is_incorrect = true;


                }
                else{
                    console.log("Wrong Answer");     //--> First choice picked, incorrect
                    this.first_is_incorrect = true;
                    this.second_is_correct = true;


                }
                this.answered = true;
            },
            evaluateAnswerTwo(){
                if(this.correct_choice_display === 1){       //--> Second choice picked, correct
                    console.log("Correct Answer");
                    this.first_is_incorrect = true;
                    this.second_is_correct = true;


                }
                else{
                    console.log("Wrong Answer");     //--> Second choice picked, incorrect
                    this.first_is_correct = true;
                    this.second_is_incorrect = true;


                }
                this.answered = true;
            },





        },

        //--> Here we will compute the question / choices
        created() {
            this.question_type = this.current_question_type;
            this.choice_one_display = this.choice_one;
            this.choice_two_display = this.choice_two;
            this.current_question_display = this.current_question;
            this.correct_choice_display = this.correct_choice;
            this.choice_one_revealed_display = this.choice_one_revealed;
            this.choice_two_revealed_display = this.choice_two_revealed;
        },





    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .correct-answer{
        background-color: hsl(141, 53%, 53%);
        border-color: hsl(141, 53%, 53%) !important;
    }
    .wrong-answer{
        background-color: hsl(348, 86%, 61%);
        border-color: hsl(348, 86%, 61%) !important;
    }



</style>