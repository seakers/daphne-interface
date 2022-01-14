<template>
    <v-container>

<!--    USER INFO-------------------------------------------------->
        <v-row justify="center">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>{{ username }}</v-card-title>
                    <v-card-subtitle>{{ email }}</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>



        <v-row justify="center">
<!--        EXCEL EXERCISE PROGRESSION-------------------------------------------------->
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Excel Exercise Progression</v-card-title>
                    <v-divider style="margin-top: 0px; margin-bottom: 15px;"></v-divider>
                    <v-simple-table height="236px">
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th style="height: 32px; font-size: 1rem;">File</th>
                                <th style="height: 32px; font-size: 1rem;">Completion</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, idx) in excel_exercises" :key="idx">
                                <td style="vertical-align: middle">{{ item.file }}</td>
                                <td style="vertical-align: middle" v-if="item.completed === true">
                                    <v-icon color="success" style="margin-left: 28px;">mdi-check</v-icon>
                                </td>
                                <td style="vertical-align: middle" v-if="item.completed === false">
                                    <v-icon color="error" style="margin-left: 28px;">mdi-cancel</v-icon>
                                </td>
                            </tr>
                            </tbody>

                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
<!--        LEARNING MODULE PROGRESSION-------------------------------------------------->
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Learning Module Progression</v-card-title>
                    <v-divider style="margin-top: 0px; margin-bottom: 15px;"></v-divider>
                    <v-simple-table height="236px">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th style="height: 32px; font-size: 1rem;">Name</th>
                                    <th style="height: 32px; font-size: 1rem;">Completion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, idx) in learning_modules" :key="idx">
                                    <td style="vertical-align: middle">{{ item.title }}</td>
                                    <td style="vertical-align: middle">
<!--                                        <v-progress-circular :rotate="270" :size="45" width="5" :value="item.progress * 100" color="primary lighten-3" style="margin-left: 20px;">-->
<!--                                            {{item.progress * 100}}%-->
<!--                                        </v-progress-circular>-->
                                        {{item.progress * 100}}%
                                        <div v-if="item.progress === 0">
                                            <v-progress-linear v-model="item.progress * 100" color="primary lighten-1" rounded style="margin-top: 2px" height="8"></v-progress-linear>
                                        </div>
                                        <div v-if="item.progress > 0 && item.progress < 1">
                                            <v-progress-linear v-model="item.progress * 100" color="warning" rounded style="margin-top: 2px" height="8"></v-progress-linear>
                                        </div>
                                        <div v-if="item.progress === 1">
                                            <v-progress-linear v-model="item.progress * 100" color="success" rounded style="margin-top: 2px" height="8"></v-progress-linear>
                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
<!--        TEST HISTORY-------------------------------------------------->
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Test History</v-card-title>
                    <v-divider style="margin-top: 0px; margin-bottom: 15px;"></v-divider>

                    <v-container>
                        <v-row>
                            <v-col>
                                <v-timeline dense style="overflow-x: hidden; overflow-y: auto;">
                                    <v-timeline-item v-for="(item, idx) in test_history" :key="idx" :icon="item.icon" small fill-dot>
                                        <v-row class="pt-1" v-on:click="load_test_results(item)" style="cursor: pointer">
                                            <v-col style="border-radius: 20px" v-bind:class="{'primary lighten-5': item.active}">
                                                <strong>{{ item.type }}</strong>
                                                <div class="text-caption">
                                                    {{ item.date }}
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col>
                                <div v-if="loaded_exam !== null">
                                    <v-card elevation="0" color="primary lighten-1">
                                        <v-card-title class="white--text">{{ loaded_exam.type }} Test</v-card-title>
                                        <v-card-subtitle class="white--text">{{loaded_exam.date}}</v-card-subtitle>

                                        <v-container>
                                            <v-row justify="center">
                                                <v-col style="text-align: center">
                                                    <v-progress-circular :rotate="270" :size="65" width="8" :value="calculate_percent(loaded_exam.score)" color="white">
                                                        {{loaded_exam.score}}
                                                    </v-progress-circular>
                                                    <div style="text-align: center; padding-top: 5px;" class="white--text">
                                                        Score
                                                    </div>
                                                </v-col>
                                                <v-divider vertical></v-divider>
                                                <v-col>
                                                    <div class="white--text" style="height: 65px; text-align: center; font-size: xxx-large">
                                                        {{loaded_exam.time}}s
                                                    </div>
                                                    <div style="text-align: center; padding-top: 5px;" class="white--text">
                                                        Time
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
<!--        ABILITY LEVELS-------------------------------------------------->
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Ability Levels</v-card-title>
                    <v-divider style="margin-top: 0px; margin-bottom: 15px;"></v-divider>
                    <v-container fluid>
                        <v-row dense>
                            <v-col v-for="item in ability_parameters" :key="item.name" cols="4">
                                <v-card  elevation="8" color="primary lighten-1">
                                    <v-card-subtitle class="white--text" style="padding-bottom: 2px">{{ item.name }}</v-card-subtitle>
                                    <v-card-title class="white--text" style="padding-top: 2px; padding-bottom: 4px">{{ item.value }} / 1</v-card-title>
                                    <v-container style="padding-top: 4px;">
                                        <v-row justify="center">
                                            <v-col>
                                                <div class="text-center">
                                                    <v-progress-linear v-model="item.value * 100" color="secondary lighten-4" rounded height="8"></v-progress-linear>
                                                </div>

                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>




        </v-row>


    </v-container>
</template>



<!--<v-card>-->
<!--<v-card-title>Something</v-card-title>-->
<!--<v-card-text>Text</v-card-text>-->
<!--<v-timeline>-->
<!--    <v-timeline-item color="green" :key="n" small v-for="n in 5"></v-timeline-item>-->
<!--</v-timeline>-->
<!--</v-card>-->

<script>
import { mapState } from 'vuex';

export default {
    name: "mastery",
    components: {

    },
    data: function () {
        return {
            loaded_exam: null,
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
            excel_exercises: state => state.adaptiveTestingPages.excel_exercises
        }),
    },
    methods: {
        load_test_results(exam){
            if(this.loaded_exam === null){
                exam.active = true;
                this.loaded_exam = exam;
            }
            else{
                if(JSON.stringify(exam) === JSON.stringify(this.loaded_exam)){
                    exam.active = false;
                    this.loaded_exam = null;
                }
                else{
                    this.loaded_exam.active = false;
                    this.loaded_exam = exam;
                    exam.active = true;
                }
            }
        },
        calculate_percent(score){
            let substrings = score.split('/');
            let result = parseInt(substrings[0]) / parseInt(substrings[1])
            result = result * 100
            console.log(result)
            return result
        }
    },

    watch: {

    },
    async mounted(){

    }
}
</script>

<style scoped>

</style>