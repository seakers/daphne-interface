<template>
    <v-container style="padding: 0px 12px 0px 12px;">

<!--    EXAM HEADER-->
        <v-row justify="center" style="padding-top: 12px;">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Exam</v-card-title>
                    <v-container>
                        <v-row justify="center">
                            <v-col>
                                <v-slider
                                    v-model="exam_length"
                                    min="3"
                                    max="50"
                                    label="Questions"
                                    thumb-color="primary"
                                    thumb-label="always"
                                    :disabled="in_progress"
                                ></v-slider>
                            </v-col>
                        </v-row>
                        <v-row justify="start">
                            <v-col>
                                <v-btn color="primary" v-on:click="begin_exam()" :disabled="in_progress">Begin exam</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>


<!--    EXAM QUESTIONS-->
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
                                        <v-btn color="primary" v-on:click="next_question()" v-if="exam_length !== current_question">Continue</v-btn>
                                        <v-btn color="primary" v-on:click="submit_exam()" v-if="exam_length === current_question">Submit</v-btn>
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
import {mapState} from "vuex";
import {fetchPost} from "../../../scripts/fetch-helpers";
import {ExamQuery, InsertExam, InsertExamQuestion, SubmitExamQuery} from "../../../testing_store/queries";
import {GetArchitectures} from "../../../scripts/instrument-queries";

export default {
    name: "take-exam",
    data: function () {
        return {
            exam: [
                { answer: -1, step: 1, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 2, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 3, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 4, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 5, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 6, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 7, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 8, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 9, text: '', choices: [], topic_ids: [], question_id: null },
                { answer: -1, step: 10, text: '', choices: [], topic_ids: [], question_id: null },
            ],
            exam_id: null,


            exam_length: 10,
            current_question: 0,
            in_progress: false,
        }
    },
    computed: {
        ...mapState({
            user_id: state => state.user.user_id,
        }),
    },
    methods: {
        async load_exam(){
            console.log('--> LOADING EXAM');

            // --> 1. Query for user exams
            let results = await this.$apollo.query({
                deep: true,
                fetchPolicy: 'no-cache',
                query: ExamQuery,
                variables: {
                    user_id: this.user_id,
                }
            });
            console.log('--> QUERY:', results);

            // --> 2. Validate query results
            let exams = results['data']['test']
            if(exams.length === 0){
                return;
            }
            else if(exams.length > 1){
                console.log('--> ERROR: MULTIPLE EXAMS IN PROGRESS', exams);
                return;
            }

            // --> 3. Import exam
            this.in_progress = true;
            let import_exam = exams[0];
            this.exam_id = import_exam['id'];
            this.exam_length = import_exam['num_questions'];
            await this.refresh_length();
            this.current_question = import_exam['questions'].length;

            // --> 4. Get next question
            await this.next_question();
        },
        async refresh_length(){
            this.exam = [];
            for(let x = 1; x <= this.exam_length; x++){
                this.exam.push({
                    answer: -1,
                    step: x,
                    text: '',
                    choices: [],
                    topic_ids: [],
                    question_id: null,
                })
            }
        },
        async insert_exam(){
            let mutation = await this.$apollo.mutate({
                mutation: InsertExam,
                variables: {
                    user_id: this.user_id,
                    type: 'Adaptive',
                    num_questions: this.exam_length,
                },
                update: (cache, { data: { result } }) => {},
            });
            this.exam_id = mutation.data.insert_Test_one.id;
            console.log('--> NEW EXAM ID:', this.exam_id);
        },
        async insert_question(question){
            console.log('--> INSERTING QUESTION', question);

            // --> 1. Validate the question has been answered
            if(question.answer === -1){
                return;
            }
            // --> 2. Insert the question
            let mutation = await this.$apollo.mutate({
                mutation: InsertExamQuestion,
                variables: {
                    choice_id: question.answer,
                    correct: question.choices[question.answer].correct,
                    question_id: question.question_id,
                    test_id: this.exam_id
                },
                update: (cache, { data: { result } }) => {},
            });
        },
        async begin_exam(){

            // --> 1. Mark the exam as started
            this.in_progress = true;

            // --> 2. Index new exam in database
            await this.insert_exam();

            // --> 3. Get the next exam question
            await this.next_question();
        },
        async update_model(question){
            let reqUpdate = new FormData();
            reqUpdate.append('topic_ids', JSON.stringify(question.topic_ids));
            let updateResponse = await fetchPost(API_URL + 'ca/stats/updatemodeltid', reqUpdate);
        },
        async next_question(){

            // --> 1. First, handle the previously answered question
            if(this.current_question > 0){
                let question = this.exam[this.current_question-1];
                if(question.answer !== -1){

                    // --> Insert question
                    await this.insert_question(question);

                    // --> Update model
                    await this.update_model(question);
                }
            }

            // --> 2. Next, get next question from backend
            let reqData = new FormData();
            reqData.append('topics', JSON.stringify([]));
            let dataResponse = await fetchPost(API_URL + 'ca/stats/adaptivequestion',reqData);
            if (dataResponse.ok) {
                let data = await dataResponse.json();
                this.exam[this.current_question].text = data['text']
                this.exam[this.current_question].choices = JSON.parse(data['choices'])
                this.exam[this.current_question].topic_ids = JSON.parse(data['topic_ids'])
                this.exam[this.current_question].question_id = data['question_id']
            }

            // --> 3. Move current question
            this.current_question += 1;
        },
        async submit_exam(){

            // --> 1. First, handle the previously answered question
            if(this.current_question > 0){
                let question = this.exam[this.current_question-1];
                if(question.answer !== -1){

                    // --> Insert question
                    await this.insert_question(question);

                    // --> Update model
                    await this.update_model(question);
                }
            }

            // --> 2. Calculate exam score
            let score = await this.exam_score();
            console.log('--> SCORE:', score);

            // --> 3. Update exam in database
            let mutation = await this.$apollo.mutate({
                mutation: SubmitExamQuery,
                variables: {
                    exam_id: this.exam_id,
                    score: score
                },
                update: (cache, { data: { result } }) => {},
            });

            // --> 4. Reset module to prepare for next exam
            await this.reset_module();

        },
        async exam_score(){
            if(this.user_id === null){
                return "0/0";
            }

            // --> 1. Query exam
            let results = await this.$apollo.query({
                deep: true,
                fetchPolicy: 'no-cache',
                query: ExamQuery,
                variables: {
                    user_id: this.user_id,
                }
            });
            let current_exam = results['data']['test'][0];

            // --> 2. Calculate score
            let num_questions = current_exam['num_questions'];
            let correct = 0;
            for(let x = 0; x < current_exam['questions'].length; x++){
                if(current_exam['questions'][x]['correct'] === true){
                    correct += 1;
                }
            }
            let score = '' + correct + '/' + num_questions;
            return score;
        },
        async reset_module(){
            this.in_progress = false;
            this.exam_id = null;
            this.current_question = 0;
            this.exam_length = 10;
        },
    },
    watch: {
        exam_length(){
            this.refresh_length();
        },
        user_id(){
            if(this.user_id !== null){
                this.load_exam();
            }
        },
    },
    async mounted(){

        if(this.user_id !== null){
            await this.load_exam();
        }
    }
}
</script>

<style scoped>

</style>