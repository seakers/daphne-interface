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
                                <td style="vertical-align: middle">{{ item.name }}</td>
                                <td style="vertical-align: middle" v-if="item.is_completed === true">
                                    <v-icon color="success" style="margin-left: 28px;">mdi-check</v-icon>
                                </td>
                                <td style="vertical-align: middle" v-if="item.is_completed === false">
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
                                    <td style="vertical-align: middle">{{ item.name }}</td>
                                    <td style="vertical-align: middle">
                                        {{item.progress * 100}}%
                                        <v-progress-linear :value="item.progress * 100" :color="get_progress_color(item.progress)" rounded style="margin-top: 2px" height="8" ></v-progress-linear>
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
                                                        {{loaded_exam.duration}}s
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
                    <v-divider style="margin-top: 0; margin-bottom: 15px;"></v-divider>
                    <v-container fluid>
                        <v-row dense>
                            <v-col v-for="(item, idx) in ability_parameters" :key="idx" cols="4">
                                <v-card  elevation="8" color="primary lighten-1" v-if="item.value !== null">
                                    <v-card-subtitle class="white--text" style="padding-bottom: 2px">{{ item.name }}</v-card-subtitle>
                                    <v-card-title class="white--text" style="padding-top: 2px; padding-bottom: 4px">{{ (item.value).toFixed(2) }} / 1</v-card-title>
                                    <v-container style="padding-top: 4px;">
                                        <v-row justify="center">
                                            <v-col>
                                                <div class="text-center">
                                                    <v-progress-linear :value="item.value * 100" :color="get_progress_color_2(item.value)" rounded height="8"></v-progress-linear>
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



<script>
    import { mapState } from 'vuex';
    import {
        ExcelMasterySub,
        TestHistoryMasterySub,
        AbilityParameterMasterySub,
        ModuleLinkSubscription
    } from "../../testing_store/queries";

    export default {
        name: "mastery",
        components: {

        },
        data: function () {
            return {
                loaded_exam: null,


                excel_exercises_db: [],
                excel_exercises: [],


                learning_modules_db: [],
                learning_modules: [],


                test_history_db: [],
                // test_history: [],
                test_history: [
                    { type: 'Adaptive', score: '5/15', date: '1/4/2021', icon: 'mdi-brain', duration: 30, active:false},
                    { type: 'Adaptive', score: '12/20', date: '1/7/2021', icon: 'mdi-brain', duration: 60, active:false},
                    { type: 'Targeted', score: '20/22', date: '1/8/2021', icon: 'mdi-bullseye-arrow', duration: 120, active:false}
                ],


                ability_parameters_db: [],
                ability_parameters: [],
                // ability_parameters: [
                //     { name: 'Lifecycle Cost', value: 0.25 }
                // ],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
            }),
        },
        methods: {
            get_progress_color(progress){
                if(progress === 1){
                    return "success";
                }
                return "primary lighten-1";
            },
            get_progress_color_2(progress){
                if(progress < 0.2){
                    return "danger"
                }
                if(progress < 0.5){
                    return "warning"
                }
                return "success";
            },
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
        apollo: {
            $subscribe: {
                excel_exercises_db: {
                    deep: true,
                    query: ExcelMasterySub,
                    variables() {
                        return {
                            user_id: this.user_id
                        }
                    },
                    skip() {
                        return (this.user_id === null);
                    },
                    result(result) {
                        let excel_exercises = result.data.excel_exercises_db;
                        let exercise_list = []
                        for(let x = 0; x < excel_exercises.length; x++){
                            let exercise = excel_exercises[x];
                            exercise_list.push({
                                id: exercise.id,
                                is_completed: exercise.is_completed,
                                reason: exercise.reason,
                                name: exercise.exercise.name
                            });
                        }
                        this.excel_exercises = exercise_list;
                    },
                },
                learning_modules_db: {
                    deep: true,
                    query: ModuleLinkSubscription,
                    variables() {
                        return {
                            user_id: this.user_id
                        }
                    },
                    skip() {
                        return (this.user_id === null);
                    },
                    result(result) {
                        console.log(result);
                        let modules = result.data.modules_db;
                        let module_links = [];
                        for(let x = 0; x < modules.length; x++){
                            let module = modules[x];

                            // --> Find module progress
                            let progress = 0;
                            let slide_questions = 0;
                            let slide_questions_completed = 0;
                            for(let y = 0; y < module.slides.length; y++){
                                let slide = module.slides[y];
                                if(slide.type === 'question'){
                                    slide_questions++;
                                    if(slide.answered === true){
                                        slide_questions_completed++;
                                    }
                                }
                            }
                            if(slide_questions !== 0){
                                progress = (slide_questions_completed / slide_questions);
                            }

                            module_links.push({
                                name: module.name,
                                icon: module.icon,
                                link: ('/LearningModule/' + module.name + '/' + module.id),
                                progress: progress
                            });
                        }
                        this.learning_modules = module_links;
                    },
                },
                test_history_db: {
                    deep: true,
                    query: TestHistoryMasterySub,
                    variables() {
                        return {
                            user_id: this.user_id
                        }
                    },
                    skip() {
                        return (this.user_id === null || this.test_history !== []);
                    },
                    result(result) {
                        let tests = result.data.tests;
                        let test_list = [];
                        for(let x = 0; x < tests.length; x++){
                            let test = tests[x];
                            let icon = 'mdi-brain';
                            if(test.type === 'Targeted'){
                                icon = 'mdi-bullseye-arrow'
                            }
                            test_list.push({
                                type: test.type,
                                date: test.date,
                                score: test.score,
                                icon: icon,
                                duration: test.duration,
                                in_progress: test.in_progress,
                                num_questions: test.questions.aggregate.count,
                                active: false
                            });
                        }
                        this.test_history = test_list;
                    },
                },
                ability_parameters_db: {
                    deep: true,
                    query: AbilityParameterMasterySub,
                    variables() {
                        return {
                            user_id: this.user_id
                        }
                    },
                    skip() {
                        return (this.user_id === null);
                    },
                    result(result) {
                        let parameters = result.data.parameters;
                        let ability_list = [];
                        for(let x = 0; x < parameters.length; x++){
                            let parameter = parameters[x];
                            ability_list.push({
                                name: parameter.topic.name,
                                value: parameter.value,
                            });
                        }
                        this.ability_parameters = ability_list;
                    },
                },
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