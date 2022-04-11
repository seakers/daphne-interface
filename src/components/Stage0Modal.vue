<template>
    <div class="message-body">
        <p v-if="firstButton">Before you begin the first experiment task, we will test your knowledge on some topics. When you're done click on Continue to go to the first experiment stage.</p>
        <p v-if="!firstButton">Write down the number we tell you here, and then click on continue to start the experiment task.</p>
        <input class="input" v-if="!firstButton" v-model="expertiseGroup" type="number" placeholder="Introduce number here">
        <a class="button" href="https://tamu.qualtrics.com/jfe/form/SV_1FgspbZsfP7AwJg" target="_blank" rel="noopener noreferrer" v-on:click="changeButtons" v-show="firstButton">Take test</a>
        <a class="button" v-on:click.prevent="goToNextStage" v-if="!firstButton && expertiseGroup !== null">Continue</a>
    </div>
</template>

<script>
    import * as _ from 'lodash-es';

    export default {
        name: 'stage0-modal',
        data() {
            return {
                firstButton: true,
                expertiseGroup: null
            }
        },
        computed: {
        },
        methods: {
            setNextStages() {
                let realStages = {
                    "daphne_baseline": "daphne_total_novice",
                    "daphne_group": ""
                };
                switch(this.expertiseGroup) {
                    case 1: // Total novice
                        realStages["daphne_group"] = "daphne_total_novice";
                        break;
                    case 2: // Expert designer
                        realStages["daphne_group"] = "daphne_expert_designer";
                        break;
                    case 3: // Expert designer w/ Daphne experience
                        realStages["daphne_group"] = "daphne_expert_designer_daphne";
                        break;
                    case 4: // Aerospace Engineer
                        realStages["daphne_group"] = "daphne_aerospace_engineer";
                        break;
                    case 5: // Aerospace Systems Engineer
                        realStages["daphne_group"] = "daphne_aerospace_systems_engineer";
                        break;
                    case 6: // Total expert
                        realStages["daphne_group"] = "daphne_total_expert";
                        break;
                }
                this.$store.commit('setNextStage', { experimentStage: 'tutorial', nextStage: realStages[this.$store.state.experiment.stageOrder[0]] });
                for (let i = 0; i < experimentStages.length - 1; ++i) {
                    this.$store.commit('setNextStage', { experimentStage: realStages[this.$store.state.experiment.stageOrder[i]], nextStage: realStages[this.$store.state.experiment.stageOrder[i+1]] });
                }
            },
            goToNextStage() {
                this.setNextStages();
                let currentStage = this.$store.state.experiment.experimentStage;
                let nextStage = this.$store.state.experiment.stageInformation[currentStage].nextStage;
                console.log(currentStage, nextStage);
                this.$store.dispatch('startStage', nextStage).then(() => {
                    this.$store.commit('setExperimentStage', nextStage);
                    this.$emit('close-modal');
                });
            },
            changeButtons() {
                _.delay(() => { this.firstButton = false; }, 2000);
            }
        }
    }
</script>

<style scoped>

</style>