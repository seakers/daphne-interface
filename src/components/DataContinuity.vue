<template>
    <div class="content">
        <p>data continuity</p>
        <a v-on:click.prevent="loadMissions()">Load Missions</a>
        <p>Mission list: {{ missions }}</p>
        <a v-on:click.prevent="loadMissionMeasurements()">Load Mission Measurements</a>
        <p>Mission measurement list: {{ mission_measurements }}</p>
        <a v-on:click.prevent="loadDataContinuity()">Load Data Continuity</a>
        <p>DC measurement list: {{ DC_meas }}</p>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: 'data-continuity',
        computed: {
            ...mapState({
                missions: state => state.missions,
                mission_measurements: state => state.mission_measurements,
                DC_meas: state => state.DC_meas
            })
        },
        methods: {
            loadMissions() {
                this.$store.dispatch('setMissions');
            },
            loadMissionMeasurements() {
                this.$store.dispatch('setMissionMeasurements');
            },
            loadDataContinuity() {
                this.$store.dispatch('setDataContinuity');
            }
        },
        data(){
            return {
                items: [
                    {age: 40, first_name: 'ben'}
                ]
            }
        }
    }
</script>

<style scoped>
</style>