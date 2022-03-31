<template>
    <v-container style="padding: 0px 12px 0px 12px;">

<!--    USER INFO-------------------------------------------------->
        <v-row justify="center" style="padding-top: 16px;">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>{{ username }}</v-card-title>
                    <v-card-subtitle>{{ email }}</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>


        <v-row justify="center">

<!--        TEST HISTORY-------------------------------------------------->
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Test History</v-card-title>
                    <v-container v-if="test_history.length > 0">
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
        </v-row>


        <v-row justify="center">

<!--        LEARNING MODULE PROGRESSION-------------------------------------------------->
            <v-col>
                <v-card elevation="0" min-height="350">
                    <v-card-title>Learning Module Progression</v-card-title>


                    <v-expand-transition>
                        <div v-if="data_table_modules.length !== 0">
                            <v-data-table :headers="data_table_modules_headers" :items="data_table_modules" hide-default-footer hide-default-header>

                                <!--TABLE HEADER-->
                                <template v-slot:header="{ props: { headers } }">
                                    <thead>
                                    <tr>
                                        <th v-for="header in headers"
                                            class="text-left"
                                            style="vertical-align: middle;"
                                        >
                                            <span class="text-subtitle-2" style="color: black">{{ header.text }}</span>
                                        </th>
                                    </tr>
                                    </thead>
                                </template>

                                <!--TABLE CONTENT-->
                                <template v-slot:body="{ items }">
                                    <tbody name="fade" is="transition-group">
                                    <tr v-for="(row, r_idx) in items" :key="r_idx">
                                        <td v-for="(col, c_idx) in data_table_modules_headers" class="text-left" style="vertical-align: middle;">

                                            <span v-if="col.value === 'module'" class="text-subtitle-3" style="color: black">
                                                {{ row[col.value] }}
                                            </span>
                                            <span v-if="col.value === 'completion'" class="text-subtitle-3" style="color: black">
                                                {{ (row[col.value] * 100).toFixed(0) }}%
                                                <v-progress-linear :value="row[col.value] * 100" :color="get_progress_color(row[col.value])" rounded style="margin-top: 2px" height="8" ></v-progress-linear>
                                            </span>

                                        </td>
                                    </tr>
                                    </tbody>
                                </template>

                            </v-data-table>
                        </div>
                    </v-expand-transition>


                </v-card>
            </v-col>
<!--        ABILITY LEVELS-------------------------------------------------->
            <v-col>
                <v-card elevation="0" min-height="350">
                    <v-card-title>Ability Levels</v-card-title>

                        <v-data-table :headers="data_table_parameters_headers" :items="data_table_parameters" hide-default-footer hide-default-header>

                            <!--TABLE HEADER-->
                            <template v-slot:header="{ props: { headers } }">
                                <thead>
                                    <tr>
                                        <th v-for="header in headers"
                                            class="text-left"
                                            style="vertical-align: middle;"
                                        >
                                            <span class="text-subtitle-2" style="color: black">{{ header.text }}</span>
                                        </th>
                                    </tr>
                                </thead>
                            </template>

                            <!--TABLE CONTENT-->
                            <template v-slot:body="{ items }">
                                <tbody name="fade" is="transition-group">
                                    <tr v-for="(row, r_idx) in items" :key="r_idx">
                                        <td v-for="(col, c_idx) in data_table_parameters_headers"
                                            class="text-left"
                                            style="vertical-align: middle;"
                                        >
                                            <span v-if="col.value === 'topic'" class="text-subtitle-3" style="color: black">
                                                {{ row[col.value] }}
                                            </span>
                                            <span v-if="col.value === 'proficiency'" class="text-subtitle-3" style="color: black">
                                                {{ (row[col.value] * 100).toFixed(0) }} / 100
                                                <v-progress-linear :value="row[col.value] * 100" :color="get_progress_color_2(row[col.value])" rounded style="margin-top: 2px" height="8" ></v-progress-linear>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-data-table>

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
                data_table_excel: [],
                data_table_excel_headers: [
                    { text: 'File', value: 'file' },
                    { text: 'Completion', value: 'completion' }
                ],



                learning_modules_db: [],
                data_table_modules: [],
                data_table_modules_headers: [
                    { text: 'Module', value: 'module' },
                    { text: 'Completion', value: 'completion' }
                ],




                test_history_db: [],
                test_history: [],


                ability_parameters_db: [],
                data_table_parameters: [],
                data_table_parameters_headers: [
                    { text: 'Topic', value: 'topic' },
                    { text: 'Proficiency', value: 'proficiency' }
                ],
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




                        this.data_table_modules = [];
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
                            this.data_table_modules.push({
                                module: module.name,
                                completion: progress
                            })
                        }
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
                        return (this.user_id === null);
                    },
                    result(result) {
                        let tests = result.data.tests;
                        let test_list = [];
                        for(let x = 0; x < tests.length; x++){
                            let test = tests[x];

                            // --> 1. Get icon
                            let icon = 'mdi-brain';
                            if(test.type === 'Targeted'){
                                icon = 'mdi-bullseye-arrow'
                            }

                            // --> 2. Get date
                            let test_date = test.date.split('T')[0];


                            test_list.push({
                                type: test.type,
                                date: test_date,
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

                        this.data_table_parameters = [];
                        for(let x = 0; x < parameters.length; x++){
                            let parameter = parameters[x];
                            this.data_table_parameters.push({
                                topic: parameter.topic.name,
                                proficiency: parameter.value,
                            });
                        }
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

.fade-enter-active, .fade-leave-active {
    transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}


</style>