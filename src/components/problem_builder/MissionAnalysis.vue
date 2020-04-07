<template>
    <div class="mission-analysis-container">

        <template v-if="problem_id !== null">
            <table-view :table_object="walker_table" :foreign_key="problem_id"></table-view>
        </template>

        <template v-if="problem_id !== null">
            <table-view :table_object="power_table" :foreign_key="problem_id"></table-view>
        </template>

        <template v-if="problem_id !== null">
            <table-view :table_object="launch_vehicle_table" :foreign_key="problem_id"></table-view>
        </template>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './table/TableView';
    export default {
        name: 'MissionAnalysis',
        data: function () {
            return {
                example: ''
            }
        },
        computed: {
            ...mapGetters({
                problem_id: 'problems__problem_selection',

                walker_table: 'analysis__walker_table',
                power_table: 'analysis__power_table',
                launch_vehicle_table: 'analysis__launch_vehicle_table',
            }),
        },
        methods: {

        },
        components: {
            TableView
        },
        async mounted() {

        },
        watch: {

        }
    }
</script>



<style lang="scss">
.mission-analysis-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
</style>