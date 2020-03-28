<template>
    <div class="table-view-container" v-bind:class="{ 'table-view-hidden': hidden === true }">


        <div class="table-view-header">
            <div class="table-view-header-title">{{ table_name }}</div>

            <div class="table-view-header-search">
                
            </div>

            <template v-if="closeable">
                <div class="table-view-header-close">
                    <button class="button is-small table-view-close-button" v-on:click="close_view()">
                        <span class="icon is-small">
                            <i class="fas fa-times" style="color: whitesmoke;"></i>
                        </span>
                    </button>
                </div>
            </template>
        </div>





        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th v-for="header in table_headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in table_rows" :key="row.id">
                        <td v-for="entry in row" :key="entry" class="table-cell-text">{{ entry }}</td>
                        <td class="text-cell-button" v-if="selectable"><a class="button is-link is-small" v-on:click="select_row(row)">select</a></td>
                        <td class="text-cell-button" v-if="editable_row"><a class="button is-warning is-small" v-on:click="edit_row(row)">edit</a></td>
                    </tr>

                    <tr v-if="insertable_row">
                        <td></td>
                        <td><input class="input" type="text" placeholder="Problem Name"></td>
                        <td class="text-cell-button"><a class="button is-primary is-small" v-on:click="new_row()">New Problem</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        


    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    
    export default {
        name: 'table-view',
        props: {
            table_name: String,   // 'Groups'
            table_headers: Array, // ['ID', 'Group']
            row_keys: Array,      // ['id', 'name']
            row_objects: Array,   // [ {'id': '1', 'name': 'seakers'}, {'id': '2', 'name': 'jpl'} ]
            selectable: Boolean,
            editable_row: Boolean,
            insertable_row: Boolean,
            hidden: Boolean,
            closeable: Boolean

        },
        data: function () {
            return {
                headers: [],
                rows: [],
            }
        },
        computed: {
            ...mapState({
                groups: state => state.groups.groups,
                problems: state => state.groups.problems
            }),
            table_rows() {
                let num_rows = this.row_objects.length;
                let num_keys = this.row_keys.length;
                let rows = [];
                for(let x=0;x<num_rows;x++){
                    let row_obj = this.row_objects[x];
                    let row = [];
                    for(let y=0;y<num_keys;y++){
                        let key = this.row_keys[y];
                        row.push(row_obj[key]);
                    }
                    rows.push(row);
                }
                return rows;
            }
        },
        methods: {
            select_row(row){
                console.log(row);
                if(this.table_name === 'Groups'){
                    this.$store.commit('set_group_id', row[0]);
                    this.$store.commit('set_group_name', row[1]);
                }

                // When a problem is selected, all the tables for that problem are loaded!!!
                if(this.table_name === 'Problems'){
                    this.$store.commit('set_problem_id', row[0]);
                    this.$store.commit('set_problem_name', row[1]);
                    this.$store.dispatch('query_stakeholder_info');
                    this.$store.commit('reset_panel_selection');
                    this.$store.commit('reset_objective_selection');
                    this.$store.commit('reset_subobjective_selection');
                }

                if(this.table_name === 'Panels'){
                    this.$store.commit('set_selected_panel_id', row[0]);
                    this.$store.commit('set_selected_panel_name', row[1]);
                    this.$store.commit('reset_objective_selection');
                    this.$store.commit('reset_subobjective_selection');
                }

                if(this.table_name === 'Objectives'){
                    this.$store.commit('set_selected_objective_id', row[0]);
                    this.$store.commit('set_selected_objective_name', row[1]);
                }
            },
            edit_row(){
                
            },
            close_view(){
                console.log("Closing View");
                if(this.table_name === 'Objectives'){
                    this.$store.commit('reset_panel_selection');
                    this.$store.commit('reset_objective_selection');
                }
                if(this.table_name === 'Subobjectives'){
                    this.$store.commit('reset_objective_selection');
                }
            }
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
        },
        async mounted() {
            console.log(this.table_name);
            console.log(this.table_headers);
        },
        watch: {
        }
    }
</script>



<style lang="scss">


// Hidden Properties
div.table-view-hidden{
    // color: #28313e;
    // background-color: #28313e;
}
.table-view-hidden{
    box-shadow: 0px 0px 0px 0px #14191f !important;
    left: 50%;
}



.table-view-container{
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 19px 4px #14191f;
    align-self: center;
    background-color: #354052;
    transition: box-shadow .35s;
    transition-timing-function: cubic-bezier(.6,.04,.98,.34);
    margin: 8px;
}


.table-view-header{
    align-self: center;
    padding: 0em .8em;
    width: 100%;
    
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    flex-direction: row;
}

.table-view-header-title{
    padding: .6em 0em;
    text-align: center;
    color: whitesmoke;
}
.table-view-header-search{
    flex-grow: 1;
    color: whitesmoke;
}
.table-view-header-close{
    padding: .6em 0em;
}


.table-view-close-button{
    background-color: #354052 !important;
    border-color: #354052 !important;
    color: whitesmoke;
}


.table-container{
    padding: 0em .8em .8em .8em;
}


.table-cell-text{
    vertical-align: middle;
}

.table-cell-button{
    text-align: right;
    vertical-align: middle;
}

</style>