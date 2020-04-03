<template>
    <div class="attributes-container">

        <template v-if="problem_id !== null">
            <table-view :table_object="measurement_table" :foreign_key="problem_id"></table-view>
        </template>


        <template v-if="problem_id !== null">
            <table-view :table_object="instrument_table" :foreign_key="problem_id"></table-view>
        </template>


        <template v-if="problem_id !== null">
            <table-view :table_object="orbit_table" :foreign_key="problem_id"></table-view>
        </template>


        <template v-if="problem_id !== null">
            <table-view :table_object="mission_table" :foreign_key="problem_id"></table-view>
        </template>


        <template v-if="problem_id !== null">
            <table-view :table_object="launch_vehicle_table" :foreign_key="problem_id"></table-view>
        </template>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    export default {
        name: 'attributes',
        data: function () {
            return {
                example: ''
            }
        },
        computed: {
            ...mapGetters({
                problem_id: 'problems__problem_selection',

                measurement_table: 'attributes__measurement_table',
                instrument_table: 'attributes__instrument_table',
                orbit_table: 'attributes__mission_table',
                mission_table: 'attributes__orbit_table',
                launch_vehicle_table: 'attributes__launch_vehicle_table',
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
.attributes-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
</style>