<template>
    <div class="requirements-container">

        <!-- By Attribute -->
        <table-view :table_name="attr_requirements__table_name" 
                    :table_headers="table_headers"
                    :row_keys="row_keys"
                    :table_view_rows_data="attr_requirements__rows"
                    :display_name="attr_requirements__display_name"
                    selectable
                    editable_row
                    insertable_row
        >
        </table-view>

        <!-- By Case -->
        <table-view :table_name="case_requirements__table_name" 
                    :table_headers="table_headers"
                    :row_keys="row_keys"
                    :table_view_rows_data="case_requirements__rows"
                    :display_name="case_requirements__display_name"
                    selectable
                    editable_row
                    insertable_row
        >
        </table-view>
        
    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    export default {
        name: 'requirements',
        data: function () {
            return {
                example: ''
            }
        },
        computed: {
            ...mapState({
                case_requirements__display_name: state => state.requirements.case_requirements__display_name,
                case_requirements__table_name: state => state.requirements.case_requirements__table_name,

                attr_requirements__display_name: state => state.requirements.attr_requirements__display_name,
                attr_requirements__table_name: state => state.requirements.attr_requirements__table_name,

                table_headers: state => state.requirements.table_headers,
                row_keys: state => state.requirements.row_keys,

                case_requirements__display_name: state => state.requirements.case_requirements__display_name,
                case_requirements__display_name: state => state.requirements.case_requirements__display_name,

            }),
            ...mapGetters({
                case_requirements__rows: 'case_requirements__get_rows',
                attr_requirements__rows: 'attr_requirements__get_rows',
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