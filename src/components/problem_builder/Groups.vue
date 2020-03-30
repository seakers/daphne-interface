<template>
    <div class="groups-container">
        <table-view :table_name="groups_table_name" 
                    :table_headers="groups_table_headers"
                    :row_keys="groups_row_keys"
                    :table_view_rows_data="groups_table_view_rows_data"
                    selectable
                    insertable_row
        >
        </table-view>
        
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    
    export default {
        name: 'groups',
        data: function () {
            return {
            }
        },
        computed: {
            ...mapState({
                groups_table_name: state => state.groups.table_name,
                groups_table_headers: state => state.groups.table_headers,
                groups_row_keys: state => state.groups.row_keys,
                groups_table_view_rows_data: state => state.groups.table_view_rows_data,


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
.groups-title {
    align-self: center;
    padding: .8em 0em;
    background-color: #354052;
    width: 100%;
    text-align: center;
    color: whitesmoke;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.groups-container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-direction: column !important;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}

.groups-table-container{
    padding: 0em .8em .8em .8em;
    background-color: #354052;
}


.groups-panel-row {
    display: flex;
}
.groups-panel-row-left{
    width: 30%;
}
.groups-panel-row-right{
    width: 30%;
}

.groups-panel {
    width: 60%;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 14px 4px #14191f !important;
    border: none;
}


.groups-top {
    height: 40%;
}

.groups-bottom {
    height:20%;
}
</style>