<template>
    <div class="message-body">
        <p>That's it for the experiment! Click Finish to go to the end survey, which consists of another test and some general questions.</p>
        <a class="button" href="https://cornell.qualtrics.com/jfe/form/SV_cGbRBDGT6kx3Q1v" target="_blank" v-on:click="finishExperiment">Finish</a>
    </div>
</template>

<script>
    export default {
        name: 'stage2-modal',
        methods: {
            finishExperiment() {
                this.$store.dispatch('finishExperiment');
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>

</style>