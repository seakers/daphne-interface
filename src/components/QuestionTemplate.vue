<template>
    <div id="question-teacher-message">
        <div class="content">
            <ul>
                <li>
                    {{ current_question_display }}
                </li>
            </ul>
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
                    <div v-on:click="evaluateAnswerOne">
                        <design-model v-bind:designDetails="choice_one_display"></design-model>
                    </div>

                    <div v-on:click="evaluateAnswerTwo">
                        <design-model v-bind:designDetails="choice_two_display"></design-model>
                    </div>
                </div>
            </template>
            <template v-if="question_type === 'feature'">
                <div class="buttons">
                    <div v-on:click="evaluateAnswerOne" @mouseover="mouseOverChoiceOne" @mouseleave="mouseLeaveChoiceOne">
                        <feature-model v-bind:isClickable="true" v-bind:featureDetails="choice_one_display['expression']" v-bind:class="{shadow: choice_one_shadow}" style="transition-duration: 0.4s; -webkit-transition-duration: 0.4s;"></feature-model>
                    </div>

                    <div v-on:click="evaluateAnswerTwo" @mouseover="mouseOverChoiceTwo" @mouseleave="mouseLeaveChoiceTwo">
                        <feature-model v-bind:isClickable="true" v-bind:featureDetails="choice_two_display['expression']" v-bind:class="{shadow: choice_two_shadow}" style="transition-duration: 0.4s; -webkit-transition-duration: 0.4s;"></feature-model>
                    </div>
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
                    <div>
                        <design-model v-bind:designDetails="choice_one_display" v-bind:class="{ 'correct-answer': first_is_correct, 'wrong-answer': first_is_incorrect }"></design-model>
                    </div>

                    <div>
                        <design-model v-bind:designDetails="choice_two_display" v-bind:class="{ 'correct-answer': second_is_correct, 'wrong-answer': second_is_incorrect }"></design-model>
                    </div>
                </div>
            </template>
            <template v-if="question_type === 'feature'">
                <div class="buttons">
                    <div>
                        <feature-model v-bind:isClickable="false" v-bind:featureDetails="choice_one_display['expression']" v-bind:class="{ 'correct-answer': first_is_correct, 'wrong-answer': first_is_incorrect}"></feature-model>
                    </div>

                    <div>
                        <feature-model v-bind:isClickable="false" v-bind:featureDetails="choice_two_display['expression']" v-bind:class="{ 'correct-answer': second_is_correct, 'wrong-answer': second_is_incorrect}"></feature-model>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import DesignModel from "./DesignModel";
    import FeatureModel from "./FeatureModel";
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

                choice_one_shadow: false,
                choice_two_shadow: false,
            }
        },

        components: {
            'design-model': DesignModel,
            'feature-model': FeatureModel,
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

            mouseOverChoiceOne(){
                this.choice_one_shadow = true;
            },
            mouseOverChoiceTwo(){
                this.choice_two_shadow = true;
            },
            mouseLeaveChoiceOne(){
                this.choice_one_shadow = false;
            },
            mouseLeaveChoiceTwo(){
                this.choice_two_shadow = false;
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
        background-color: hsl(141, 53%, 53%) !important;
        border-color: hsl(141, 53%, 53%) !important;
    }
    .wrong-answer{
        background-color: hsl(348, 86%, 61%) !important;
        border-color: hsl(348, 86%, 61%) !important;
    }
    .shadow{
        box-shadow: 0 6px 12px 0 rgba(0,0,0,0.2), 0 4.5px 15px 0 rgba(0,0,0,0.19);
    }
</style>