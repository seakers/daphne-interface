<template>

    <!--
        Purpose: alert users of design variables with low main effect indices for the currently considered objectives
            - Recommend users remove design variables with low main effect indices for the current objectives
            - Recommend users add design variables with high main effect indices for the current objectives (precomputed from the list)

    -->



    <div>

    </div>

</template>






<script>
import { mapGetters, mapMutations } from 'vuex';
import { mapState } from 'vuex';


    export default {
        name: "FormulationMainEffectMsg",
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
                mainEffects: state => state.problem.mainEffects,
            }),
        },
        methods: {

        },
        watch: {
            mainEffects() {
                console.log('--> MAIN EFFECT UPDATE:', this.mainEffects);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>