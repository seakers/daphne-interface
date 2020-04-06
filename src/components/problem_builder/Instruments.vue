<template>
    <div class="instruments-container">
        <template v-if="groups__selected_id !== null">
            <table-view :table_object="instrument_table" :foreign_key="groups__selected_id"></table-view>
        </template>

        <template v-if="instruments__selected_id !== null">
            <div class="instruments-details">
                <table-view :table_object="instrument_capability_table" :foreign_key="instruments__selected_id"></table-view>
                <table-view :table_object="instrument_characteristic_table" :foreign_key="instruments__selected_id"></table-view>
            </div>
        </template>



    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    export default {
        name: 'instruments',
        data: function () {
            return {
                example: ''
            }
        },
        computed: {
            ...mapState({
            }),
            ...mapGetters({
                instrument_table: 'instruments__instrument_table',
                instrument_capability_table: 'instruments__capability_table',
                instrument_characteristic_table: 'instruments__characteristic_table',

                groups__selected_id: 'groups__group_selection',
                instruments__selected_id: 'instruments__instrument_selection',
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
.instruments-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: row;
}

.instruments-details{
    display: flex;
}
</style>