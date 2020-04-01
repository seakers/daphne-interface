<template>
    <div class="instruments-container">

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
    align-content: center;
    justify-content: center;
}
</style>