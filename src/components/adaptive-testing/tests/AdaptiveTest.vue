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
                                    v-model="exam_length"
                                    min="10"
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
                                    v-model="exam_duration"
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
import adaptiveExam from "../../../testing_store/modules/testing";

export default {
    name: "adaptive-test",
    components: {

    },
    data: function () {
        return {

        }
    },
    computed: {
        ...mapState({

        }),
        exam_length: {
            get() {
                return this.$store.state.testing.exam_length;
            },
            set(exam_length){
                this.$store.commit('set_exam_length', exam_length);
            }
        },
        exam_duration: {
            get() {
                return this.$store.state.testing.exam_duration;
            },
            set(exam_duration){
                this.$store.commit('set_exam_duration', exam_duration);
            }
        }
    },
    methods: {
        async begin_exam(){
            let exam_parameters = {
                duration: this.exam_duration,
                num_questions: this.num_questions
            }
            await this.$store.dispatch('create_adaptive_exam');
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