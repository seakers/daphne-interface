<template>
    <div class="wrapper">
        <div class="scheduling-architectures">
            <p>Scheduling Architectures</p>
            <scheduling-architectures class="scheduling-architectures"></scheduling-architectures>
        </div>
        <div class="data-continuity">
            <p>Data Continuity</p>
            <data-continuity class="data-continuity"></data-continuity>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet} from '../scripts/fetch-helpers';
    import SchedulingArchitectures from './SchedulingArchitectures';
    import DataContinuity from './DataContinuity';

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    export default {
        name: 'scheduler',
        data: function () {
        },
        computed: {
        },
        methods: {
        },
        components: {
            SchedulingArchitectures, DataContinuity
        },
        mounted() {
            let archIDs = getParameterByName('archIDs');
            //let archID = +getParameterByName('archID');
            let problem = getParameterByName('problem');
            this.$store.commit('setArchIDs', archIDs);
            this.$store.commit('setProblem', problem);
        },
        watch: {
        }
    }
</script>

<style scoped>
</style>
