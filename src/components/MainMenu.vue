<template>
    <div class="main">
        <h1 class="title is-size-4">Daphne</h1>
        <main-menu-item
                v-for="(functionality, index) in availableFunctionalities"
                v-bind:name="functionality.name"
                v-bind:text="functionality.title"
                v-bind:icon="functionality.icon"
                v-bind:key="index">
        </main-menu-item>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MainMenuItem from './MainMenuItem';
    import * as _ from 'lodash-es';

    export default {
        name: 'main-menu',
        computed: {
            ...mapState({
                inExperiment: state => state.experiment.inExperiment,
                stageInformation: state => state.experiment.stageInformation,
                experimentStage: state => state.experiment.experimentStage,
                allAvailableFunctionalities: state => state.functionalityList.availableFunctionalities,
                problemFunctionalities: state => state.problem.problemFunctionalities,
            }),
            availableFunctionalities() {
                let allAvailableFuncs = [];
                for (let functionality of this.allAvailableFunctionalities) {
                    allAvailableFuncs.push(functionality.name);
                }

                // Filter by the problem
                let funcFilter = _.difference(allAvailableFuncs, this.problemFunctionalities);

                //If in experiment, create a second filter and merge the two by union
                if (this.inExperiment) {
                    let experimentFuncFilter = [];
                    experimentFuncFilter = _.difference(allAvailableFuncs, this.stageInformation[this.experimentStage].availableFunctionalities);
                    funcFilter = _.union(funcFilter, experimentFuncFilter);
                }

                // Create the list of avaliable functionalities
                let functionalities = [];
                for (let functionality of this.allAvailableFunctionalities) {
                    if (!funcFilter.includes(functionality.name)) {
                        functionalities.push(functionality);
                    }
                }

                return functionalities;
            }
        },
        methods: {
        },
        components: { MainMenuItem }
    }
</script>

<style scoped>

</style>