<template>
    <div class="groups-container">
        <!-- <database-table :table_name=table_name :table_columns=table_columns></database-table> -->


        <div class="groups-top">
        </div>

        <div class="groups-panel-row">
            <div class="groups-panel-row-left"></div>
            <div class="groups-panel">
                <div class="groups-title">
                    Groups
                </div>

                <div class="groups-table-container">
                    <table class="table is-hoverable is-fullwidth is-striped" style="table-background-color: black;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Group</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="group in groups" :key="group.id">
                                <td style="vertical-align: middle;">{{ group.id }}</td>
                                <td style="vertical-align: middle;">{{ group.name }}</td>
                                <td style="text-align: right;"><a class="button is-link is-small" v-on:click="set_group(group.name, group.id)">select</a></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><input class="input" type="text" placeholder="Group Name"></td>
                                <td style="text-align: right;"><a class="button is-primary" v-on:click="new_group()">New Group</a></td>
                            </tr>
                        </tbody>
                    </table> 
                </div>


            </div>
            <div class="groups-panel-row-right"></div>
        </div>

        <div class="groups-bottom">
        </div>

        
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import DatabaseTable from './DatabaseTable';
    
    export default {
        name: 'groups',
        data: function () {
            return {
                table_name: 'Group',
                table_columns: 'id name'
            }
        },
        computed: {
            ...mapState({
                username: state => state.groups.username,
                groups: state => state.groups.groups,

            }),
        },
        methods: {
            async set_group(name, id) {
                console.log(id);
                this.$store.commit('set_group', name, id);
            },

            async new_group() {
                console.log("new group");
                // this.$store.commit('new_group', name, id);
            }
        },
        components: {
            DatabaseTable
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