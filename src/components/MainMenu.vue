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

    export default {
        name: 'main-menu',
        computed: {
            ...mapState({
                inExperiment: state => state.experiment.inExperiment,
                stageInformation: state => state.experiment.stageInformation,
                experimentStage: state => state.experiment.experimentStage,
                allAvailableFunctionalities: state => state.functionalityList.availableFunctionalities
            }),
            availableFunctionalities() {
                if (this.inExperiment) {
                    let functionalities = [];
                    for (let functionality of this.allAvailableFunctionalities) {
                        if (this.stageInformation[this.experimentStage].availableFunctionalities.includes(functionality.name)) {
                            functionalities.push(functionality);
                        }
                    }
                    return functionalities;
                }
                else {
                    return this.allAvailableFunctionalities;
                }
            }
        },
        methods: {
        },
        components: { MainMenuItem }
    }
</script>

<style scoped>

</style>