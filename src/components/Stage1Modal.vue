<template>
    <div class="message-body">
        <p v-if="firstButton">That's it for the first stage of the experiment! Click the button to answer a survey and a test on what you just did. When you're done click on Continue to go to the second stage.</p>
        <p v-if="!firstButton">{{nextStageText}}</p>
        <a class="button" href="https://tamu.qualtrics.com/jfe/form/SV_9poC5fltLOIn8Jo" target="_blank" rel="noopener noreferrer" v-on:click="changeButtons" v-show="firstButton">Take test</a>
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
                    case 'daphne_classic':
                        nextStageText = `For the second stage, you have been assigned the Daphne with 
                        design capabilities. You can design architectures, study their details, ask questions 
                        about your designs to Daphne, and the background search will find good architectures 
                        for you. On the other hand, neither the data mining nor the hypothesis tester are available to you. 
                        As a reminder, you may have to scroll down to see some of the features. 
                        Press Next to start the second stage.`;
                        break;
                    case 'daphne_dm':
                        nextStageText = `For the second stage, you have been assigned the Daphne with 
                        data mining capabilities. You can design architectures, study their details, ask questions 
                        about your designs to Daphne, use the Data Mining capabilities, and the background search will 
                        find good architectures for you. The hypothesis tester is not available to you. 
                        As a reminder, you may have to scroll down to see some of the features. 
                        Press Next to start the second stage.`;
                        break;
                    case 'daphne_hypothesis':
                        nextStageText = `For the second stage, you have been assigned the Daphne with 
                        hypothesis testing capabilities. You can design architectures, study their details, ask questions 
                        about your designs to Daphne, use the Data Mining capabilities, test hypotheses about the design set, 
                        and the background search will find good architectures for you, including ones that help prove or 
                        disprove your hypotheses. Additionally, Daphne may suggest features to be tested as hypotheses to you. 
                        As a reminder, you may have to scroll down to see some of the features. 
                        Press Next to start the second stage.`;
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