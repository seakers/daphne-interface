<template>
    <div class="groups-container">

        <template v-if="user_id !== null">
            <table-view :table_object="group_table" 
                        :foreign_key="user_id"
            >
            </table-view>
        </template>

        <!-- <switch-button v-model="switch2" color="#F5BF21"></switch-button> -->
        
        
    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import SwitchButton from './SwitchButton';
    import TableView from './table/TableView';
    
    export default {
        name: 'groups',
        data: function () {
            return {
                switch2: false,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.table.user_id,
            }),
            ...mapGetters({
                group_table: 'groups__group_table',
            }),
        },
        methods: {
        },
        components: {
            TableView,
            SwitchButton
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