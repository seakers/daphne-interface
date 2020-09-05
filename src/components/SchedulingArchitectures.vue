<template>
    <div class="content">
        <p>scheduling architectures</p>
        <a v-on:click.prevent="loadMeasurements()">Load Measurements</a>
        <p>Common Measurements: {{ measurements.measurements }}</p>
        <div class="field">
                <label for="dates">Enter dates for evaluation, separated by commas:</label>
                <input type="text" id="dates" value="e.g. 2005,2007" v-on:change.prevent="getDates">
        </div>
        <a v-on:click.prevent="loadScores()">Get Score</a>
        <p>Scheduling Score: {{ measurements.score }}</p>
        <p>GA</p>
        <a v-on:click.prevent="startSchedulingGA()">Start GA</a>
        <p>Enumerator</p>
        <a v-on:click.prevent="startEnumeration()">Start Enumeration</a>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: 'scheduling-architectures',
        data() {
            return {
                showScore: []
            }
        },
        computed: {
            ...mapState({
                measurements: state => state.measurements,
                dates: state => state.dates,
                score: state => state.score,
                GAData: state => state.GAData,
                enumScore: state => state.enumScore
            })
        },
        methods: {
            loadMeasurements() {
                this.$store.dispatch('setMeasurements');
            },
            loadScores() {
                this.$store.dispatch('getSchedulingScore');
            },
            getDates () {
                this.$store.dispatch('getDates');
            },
            startSchedulingGA() {
                this.$store.dispatch('startSchedulingGA');
            },
            startEnumeration() {
                this.$store.dispatch('startEnumeration');
            }
        }
    }
</script>

<style scoped>
</style>