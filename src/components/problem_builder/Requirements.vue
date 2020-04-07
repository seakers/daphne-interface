<template>
    <div class="requirements-container">

        <!-- By Attribute -->
        <template v-if="problem_id !== null">
            <table-view :table_object="requirements__attr_table" :foreign_key="problem_id"></table-view>
        </template>

        <!-- By Case -->
        <template v-if="problem_id !== null">
            <table-view :table_object="requirements__case_table" :foreign_key="problem_id"></table-view>
        </template>
        
    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './table/TableView';
    export default {
        name: 'requirements',
        data: function () {
            return {
                example: ''
            }
        },
        computed: {
            ...mapState({
            }),
            ...mapGetters({
                problem_id: 'problems__problem_selection',

                requirements__case_table: 'requirements__case_table',
                requirements__attr_table: 'requirements__attribute_table',
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
.requirements-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
</style>