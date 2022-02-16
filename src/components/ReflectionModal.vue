<template>
    <div class="message-body">

        <p v-if="firstButton">That's it for the first stage of the experiment! Click the button to proceed to the next stage of the experiment.</p>
        <p v-if="!firstButton">{{nextStageText}}</p>
        <a class="button" href="https://tamu.qualtrics.com/jfe/form/SV_81wLmOFGze618j4" target="_blank" rel="noopener noreferrer" v-on:click="changeButtons" v-show="firstButton">Take survey</a>
        <a class="button" v-on:click.prevent="goToNextStage" v-if="!firstButton">Continue</a>
    </div>
</template>

<script>
    import * as _ from 'lodash-es';

    export default {
        name: 'stage1-modal',
        data() {
            return {
                firstButton: true
            }
        },
        computed: {
            nextStageText() {
                // Add specific last step based on what will be available in the next stage
                let currentStage = this.$store.state.experiment.experimentStage;
                let nextStage = this.$store.state.experiment.stageInformation[currentStage].nextStage;
                let nextStageText = "";
                switch (nextStage) {
                    case 'daphne_refinc':
                        nextStageText = `For the second stage, you will continue working on the same design problem. 
                        Press Next to continue.`;
                        break;
                }
                return nextStageText;
            }
        },
        methods: {
            goToNextStage() {
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