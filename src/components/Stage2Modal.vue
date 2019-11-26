<template>
    <div class="message-body">
        <p>That's it for the experiment! Click Finish to go to the end exam.</p>
        <a class="button" href="https://tamu.qualtrics.com/jfe/form/SV_01hCywfqa8XzcHz" target="_blank" v-on:click="finishExperiment">Finish</a>
    </div>
</template>

<script>
    export default {
        name: 'stage2-modal',
        methods: {
            finishExperiment() {
                this.$store.dispatch('finishExperiment');
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>