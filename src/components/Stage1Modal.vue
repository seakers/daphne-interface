<template>
    <div class="message-body">
        <p>That's it for the first stage of the experiment! Click continue to start the second stage.</p>
        <a class="button" v-on:click.prevent="goToNextStage">Continue</a>
    </div>
</template>

<script>
    export default {
        name: 'stage1-modal',
        methods: {
            goToNextStage() {
                let currentStage = this.$store.state.experiment.experimentStage;
                let nextStage = this.$store.state.experiment.stageInformation[currentStage].nextStage;
                console.log(currentStage, nextStage);
                this.$store.dispatch('startStage', nextStage).then(() => {
                    this.$store.commit('setExperimentStage', nextStage);
                    this.$emit('close-modal');
                });
            }
        }
    }
</script>

<style scoped>

</style>