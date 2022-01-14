<template>
    <v-container>

        <v-row justify="center">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Adaptive Testing</v-card-title>
                    <v-card-subtitle>Configuration</v-card-subtitle>
                    <v-divider style="margin-top: 0; margin-bottom: 36px;"></v-divider>
                    <v-container>
                        <v-row justify="center">
                            <v-col>
                                <v-slider
                                    v-model="num_questions"
                                    min="1"
                                    max="50"
                                    label="Questions"
                                    thumb-color="primary"
                                    thumb-label="always"
                                ></v-slider>
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col>
                                <v-slider
                                    v-model="exam_length"
                                    min="1"
                                    max="30"
                                    label="Duration (min)"
                                    thumb-color="primary"
                                    thumb-label="always"
                                ></v-slider>
                            </v-col>
                        </v-row>
                        <v-row justify="start">
                            <v-col>
                                <v-btn color="primary" v-on:click="begin_exam()">Begin</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import adaptiveExam from "../../../testing_store/modules/adaptive-test";

export default {
    name: "adaptive-test",
    components: {

    },
    data: function () {
        return {
            current_question: 1,

            exam_length: 5,
            num_questions: 10,
        }
    },
    computed: {
        ...mapState({
            user_id: state => state.adaptiveTestingPages.user_id,
            username: state => state.adaptiveTestingPages.username,
            email: state => state.adaptiveTestingPages.email,
            ability_parameters: state => state.adaptiveTestingPages.ability_parameters,
            test_history: state => state.adaptiveTestingPages.test_history,
            learning_modules: state => state.adaptiveTestingPages.learning_modules,
            excel_exercises: state => state.adaptiveTestingPages.excel_exercises,
            questions: state => state.adaptiveTest.questions
        }),
    },
    methods: {
        async begin_exam(){
            await this.$store.commit('set_exam_length', this.exam_length);
            await this.$store.dispatch('build_adaptive_exam', this.num_questions);
            await this.$router.push('test');
        },
    },

    watch: {

    },
    async mounted(){

    }
}
</script>

<style scoped>

</style>