<template>
    <div class="wrapper">
        <div class="score-column">
            <score-tree class="score-explanation"></score-tree>
            <details-table v-if="subobjectiveDetails !== null" class="score-details"></details-table>
            <hr>
        </div>
        <div class="cost-column">
            <cost-column class="launch-cost-details"></cost-column>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet} from '../scripts/fetch-helpers';
    import ScoreTree from './ScoreTree';
    import CostColumn from './CostColumn';
    import DetailsTable from './DetailsTable';

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
            ...mapState({
                subobjectiveDetails: state => state.score.subobjectiveDetails
            }),
        },
        methods: {
        },
        components: {
            ScoreTree, CostColumn, DetailsTable
        },
        mounted() {
            let archID = +getParameterByName('archID');
            let problem = getParameterByName('problem');
            this.$store.commit('setArchID', archID);
            this.$store.commit('setProblem', problem);
            this.$store.dispatch('getArchitectureDetails');
        },
        watch: {
        }
    }
</script>

<style scoped>
    .wrapper {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        min-height: 100vh;
        max-width: 100vw;
        padding: 10px;
        width: 100vw;
        height: 100vh;
    }
    .score-column {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }
    .score-explanation {
        flex-grow: 1;
    }
    .score-details {
        min-width: 0;
    }
</style>
