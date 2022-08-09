<template>
    <div class="stakeholders-container">

        <template v-if="problem_id !== null">
            <table-view
                :table_object="panel_table"
                :foreign_key="problem_id"
                new_row_text="new panel"
            ></table-view>
        </template>


        <template v-if="panel_id !== null">
            <table-view
                :table_object="objective_table"
                :foreign_key="panel_id"
                :foreign_key_2="problem_id"
                new_row_text="new objective"
            ></table-view>
        </template>


        <template v-if="objective_id !== null && panel_id !== null">
            <table-view
                :table_object="subobjective_table"
                :foreign_key="objective_id"
                :foreign_key_2="problem_id"
                new_row_text="new subobjective"
            ></table-view>
        </template>
        

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './table/TableView';
    
    export default {
        name: 'stakeholders',
        data: function () {
            return {
                
            }
        },
        computed: {
            ...mapState({
            }),
            ...mapGetters({
                problem_id: 'problems__problem_selection',
                panel_id: 'stakeholders__panel_selection',
                objective_id: 'stakeholders__objective_selection',

                panel_table: 'stakeholders__panel_table',
                objective_table: 'stakeholders__objective_table',
                subobjective_table: 'stakeholders__subobjective_table',
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
.stakeholders-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
</style>