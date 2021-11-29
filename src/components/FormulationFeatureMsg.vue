<template>


    <!--
        Two types of messages:
            1. Recommend removing instrument from the problem formulation
            2. Recommend removing orbit for the problem formulation

            - Text: A driving feature of good designs is the absence of instrument/orbit x. Click _here_ to remove it from the current problem formulation
    -->

    <div>

    </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { mapState } from 'vuex';


    export default {
        name: "FormulationFeatureMsg",
        components: {

        },
        data() {
            return {
                test: 'test'
            }
        },
        computed: {
            ...mapGetters({

            }),
            ...mapState({
                formulationFeatures: state => state.problem.formulationFeatures,
            }),
        },
        methods: {

        },
        watch: {
            formulationFeatures() {
                console.log('--> FEATURE UPDATE:', this.formulationFeatures);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>