<template>
    <div class="wrapper">
        <div class="score-column">
            <score-tree class="score-explanation"></score-tree>
            <div class="score-details">Details</div>
        </div>
        <div class="cost-column">
            <launch-vehicles-plots class="launch-cost-details"></launch-vehicles-plots>
            <div class="lifecycle-cost-details">Lifecycle Cost</div>
        </div>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet} from '../scripts/fetch-helpers';
    import ScoreTree from './ScoreTree';
    import LaunchVehiclesPlots from './LaunchVehiclesPlots';

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
        name: 'details-panel',
        data: function () {
            return {
                tutorial: {},
                isStartup: true
            }
        },
        computed: {
        },
        methods: {
        },
        components: {
            ScoreTree, LaunchVehiclesPlots
        },
        mounted() {
            let archID = +getParameterByName('archID');
            this.$store.commit('setArchID', archID);
            this.$store.dispatch('getArchitectureDetails');
        },
        watch: {
        }
    }
</script>

<style scoped>
    .wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 100vh;
        padding: 10px;
    }
    .score-column {
        display: flex;
        flex-direction: column;
    }
    .cost-column {
        display: flex;
        flex-direction: column;
    }
    .score-explanation {
        flex-grow: 1;
    }
    .launch-cost-details {
        flex-grow: 1;
    }
    .lifecycle-cost-details {
        flex-grow: 1;
    }
</style>
