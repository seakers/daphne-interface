<template>
    <div class="stakeholders-container">

        <table-view :table_name="panel_table_name" 
                    :table_headers="table_headers"
                    :row_keys="row_keys"
                    :table_view_rows_data="panel_row_objects"
                    :display_name="panel_display_name"
                    selectable
                    editable_row
                    insertable_row
        >
        </table-view>


        <template v-if="selected_panel_id !== null">
            <table-view :table_name="objective_table_name" 
                        :table_headers="table_headers"
                        :row_keys="row_keys"
                        :table_view_rows_data="objective_row_objects"
                        :display_name="objective_display_name"
                        selectable
                        closeable
                        editable_row
                        insertable_row
            >
            </table-view>
        </template>


        <template v-if="selected_objective_id !== null">
            <table-view :table_name="subobjective_table_name" 
                        :table_headers="table_headers"
                        :row_keys="row_keys"
                        :table_view_rows_data="subobjective_row_objects"
                        :display_name="subobjective_display_name"
                        selectable
                        closeable
                        editable_row
                        insertable_row
            >
            </table-view>
        </template>
        




    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    
    export default {
        name: 'stakeholders',
        data: function () {
            return {
                tables: ['Stakeholder_Needs_Panel', 'Stakeholder_Needs_Objective', 'Stakeholder_Needs_Subobjective']
            }
        },
        computed: {
            ...mapState({
                panel_display_name: state => state.stakeholders.panels__display_name,
                panel_table_name: state => state.stakeholders.panels__table_name,
                
                objective_display_name: state => state.stakeholders.objectives__display_name,
                objective_table_name: state => state.stakeholders.objectives__table_name,
                
                subobjective_display_name: state => state.stakeholders.subobjectives__display_name,
                subobjective_table_name: state => state.stakeholders.subobjectives__table_name,
                
                table_headers: state => state.stakeholders.table_headers,
                row_keys: state => state.stakeholders.row_keys,

                selected_panel_id: state => state.stakeholders.selected_panel_id,
                selected_objective_id: state => state.stakeholders.selected_objective_id,
                selected_subobjective_id: state => state.stakeholders.selected_subobjective_id,
            }),
            ...mapGetters({
                panel_row_objects: 'panels__get_rows',
                objective_row_objects: 'objectives__get_rows',
                subobjective_row_objects: 'subobjectives__get_rows',
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