<template>
    <div class="stakeholders-container">

        <table-view :table_name="panel_table_name" 
                    :table_headers="panel_table_headers"
                    :row_keys="panel_row_keys"
                    :row_objects="panel_row_objects"
                    selectable
        >
        </table-view>


        <template v-if="objective_row_objects !== false">
            <table-view :table_name="objective_table_name" 
                        :table_headers="objective_table_headers"
                        :row_keys="objective_row_keys"
                        :row_objects="objective_row_objects"
                        selectable
                        closeable
            >
            </table-view>
        </template>



        <template v-if="subobjective_row_objects !== false">
            <table-view :table_name="subobjective_table_name" 
                        :table_headers="subobjective_table_headers"
                        :row_keys="subobjective_row_keys"
                        :row_objects="subobjective_row_objects"
                        selectable
                        closeable
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
                panel_table_name: state => state.stakeholders.panel_table_name,
                panel_table_headers: state => state.stakeholders.panel_table_headers,
                panel_row_keys: state => state.stakeholders.panel_row_keys,

                objective_table_name: state => state.stakeholders.objective_table_name,
                objective_table_headers: state => state.stakeholders.objective_table_headers,
                objective_row_keys: state => state.stakeholders.objective_row_keys,

                subobjective_table_name: state => state.stakeholders.subobjective_table_name,
                subobjective_table_headers: state => state.stakeholders.subobjective_table_headers,
                subobjective_row_keys: state => state.stakeholders.subobjective_row_keys,
            }),
            ...mapGetters({
                panel_row_objects: 'get_panel_rows',
                objective_row_objects: 'get_objective_rows',
                subobjective_row_objects: 'get_subobjective_rows',
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