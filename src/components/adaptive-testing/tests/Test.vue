<template>
    <v-container>

        <v-row justify="center">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>{{ num_questions }} Questions</v-card-title>
                    <v-card-subtitle>{{ exam_length }} minutes</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col>
                <v-stepper vertical v-model="current_question">

                    <div v-for="(question, idx) in exam">
                        <v-stepper-step :complete="current_question > question.step" :step="question.step">Question {{question.step}}</v-stepper-step>
                        <v-stepper-content :step="question.step">

                            <v-card class="mb-12" elevation="0">
                                <v-card-title style="padding-bottom: 0">{{ question.text }}</v-card-title>
                                <v-container>
                                    <v-row no-gutters>
                                        <v-radio-group v-model="question.answer">
                                            <v-radio
                                                v-for="(option, idx) in question.choices"
                                                :key="idx"
                                                :label="option.text"
                                                :value="idx"
                                            ></v-radio>
                                        </v-radio-group>
                                    </v-row>
                                    <v-row no-gutters>
                                        <v-btn color="primary" @click="current_question = (question.step + 1)">Continue</v-btn>
                                    </v-row>
                                </v-container>
                            </v-card>

                        </v-stepper-content>
                    </div>

                </v-stepper>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "test",
    components: {

    },
    data: function () {
        return {
            current_question: 1,
        }
    },
    computed: {
        ...mapState({
            exam: state => state.testing.exam,
            exam_length: state => state.testing.exam_length
        }),
        num_questions(){
            return this.exam.length;
        }
    },
    methods: {

    },

    watch: {

    },
    async mounted(){

    }
}
</script>

<style scoped>

</style>