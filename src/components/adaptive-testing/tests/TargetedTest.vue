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