<template>
    <v-container>

        <v-row justify="center">
            <v-col>
                <v-card elevation="0">
                    <v-card-title>Targeted Testing</v-card-title>
                    <v-card-subtitle>Configuration</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "targeted-test",
    components: {

    },
    data: function () {
        return {
            current_question: 1,
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

    },

    watch: {

    },
    async mounted(){

    }
}
</script>

<style scoped>

</style>