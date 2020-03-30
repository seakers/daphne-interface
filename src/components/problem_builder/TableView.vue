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
            <table class="table custom-table">
                <thead>
                    <tr>
                        <th v-for="header in table_headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, row_index) in table_view_rows_data" :key="row.id">

                        <template v-if="!row.editing_state">
                            <td v-for="entry in row.items" :key="entry" class="table-cell-text">{{ entry }}</td>
                        </template>
                        
                        <template v-if="row.editing_state">
                            <td v-for="(entry, col_index) in row.items" :key="entry" class="table-cell-text">

                                <input class="input" type="text" v-model="table_view_rows_data_copy[row_index].items[col_index]" v-if="entry !== row.objects.id">

                                <button class="button is-small table-view-close-edit" v-if="entry === row.objects.id" v-on:click="cancel_edit(row)">
                                    <span class="icon is-small">
                                        <i class="fas fa-times" style="color: #354052;"></i>
                                    </span>
                                </button>
                            </td>
                        </template>


                        <td class="table-cell-button" v-if="selectable"><a class="button is-small" v-bind:class="[ row.selected_state ? 'is-success' : 'is-link' ]" v-on:click="!row.editing_state && select_row(row)" :disabled="row.editing_state">select</a></td>
                        
                        <td class="table-cell-button" v-if="editable_row && !row.editing_state"><a class="button is-warning is-small" v-on:click="!row.selected_state && edit_row(row)" :disabled="row.selected_state">edit</a></td>
                        <td class="table-cell-button" v-if="editable_row && row.editing_state"><a class="button is-danger is-small" v-on:click="commit_row(table_view_rows_data_copy[row_index])">commit</a></td>
                    </tr>


                    <tr v-if="insertable_row">
                        <template v-if="insert_state === true">
                            <td class="table-cell-button">
                                <button class="button is-small table-insert-close-button" v-on:click="toggle_insert_state(false)">
                                    <span class="icon is-small"><i class="fas fa-times" style="color: #354052;"></i></span>
                                </button>    
                            </td>  <!-- this will always be the row ID -->
                            <td v-for="row_item in insert_new_row_items" :key="row_item"><input class="input table-input" type="text" :placeholder="row_item"></td>
                            <td class="table-cell-button"><a class="button is-danger is-small" v-on:click="new_row()">insert</a></td>
                        </template> 
                    </tr>
                </tbody>
            </table>
            <a v-if="insert_state === false && insertable_row" class="button is-primary is-fullwidth" v-on:click="toggle_insert_state(true)" style="border-radius: 0;">new row</a>
        </div>
        


    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import * as _ from 'lodash-es';
    
    export default {
        name: 'table-view',
        props: {
            table_view_rows_data: Array,
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
                insert_state: false,
                edit_state: false,
                table_view_rows_data_copy: [],
            }
        },
        computed: {
            ...mapState({
                groups: state => state.groups.groups,
                problems: state => state.groups.problems
            }),
            insert_new_row_items() {
                let to_return = [];
                let num_keys = this.row_keys.length;
                for(let x=1;x<num_keys;x++){
                    to_return.push(this.row_keys[x]);
                }
                return to_return;
            },
        },
        methods: {
            select_row(row_object){
                console.log("Select Row:", row_object);
                let row = row_object.items;

                if(this.table_name === 'Groups'){
                    this.$store.dispatch('groups__toggle_select', row_object);
                }

                // When a problem is selected, all the tables for that problem are loaded!!!
                if(this.table_name === 'Problems'){
                    this.$store.dispatch('problems__toggle_select', row_object);

                    // Load the rest of the problem's tables in the editor
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
            edit_row(row_object){
                console.log("Edit Row:", row_object);
                if(this.table_name === 'Groups'){
                    this.$store.dispatch('groups__toggle_edit', row_object);
                }

                if(this.table_name === 'Problems'){
                    this.$store.dispatch('problems__toggle_edit', row_object);
                }
            },
            commit_row(row_object){
                console.log("COMMIT", row_object);
                if(this.table_name === 'Problems'){
                    this.$store.dispatch('problems__commit_edit', row_object);
                }
            },
            cancel_edit(row){
                if(this.table_name === 'Groups'){
                    this.$store.dispatch('groups__toggle_edit', row);
                }

                if(this.table_name === 'Problems'){
                    this.$store.dispatch('problems__toggle_edit', row);
                }
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
            },
            toggle_insert_state(val) {
                this.insert_state = val;
            },
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
        },
        async created() {
            //this.table_view_rows_data_copy = this.table_view_rows_data;
            this.table_view_rows_data_copy = _.cloneDeep(this.table_view_rows_data);
            console.log("SETTING COPY DATA", this.table_name, this.table_view_rows_data_copy);
        },
        // async beforeUpdate() {
        //     // this.table_view_rows_data_copy = this.table_view_rows_data;
        //     this.table_view_rows_data_copy = _.cloneDeep(this.table_view_rows_data);
        //     console.log("UPDATE COPY DATA", this.table_name, this.table_view_rows_data_copy);
        // },
        watch: {   
            table_view_rows_data() {
                this.table_view_rows_data_copy = _.cloneDeep(this.table_view_rows_data);
                console.log("UPDATE COPY DATA", this.table_name, this.table_view_rows_data_copy);
            }
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

.table-view-close-edit{
    background-color: white !important;
    border-color: white !important;
    color: #354052;
}

.table-insert-close-button{
    background-color: white !important;
    border-color: white !important;
    color: #354052;
}


.table-container{
    padding: 0em .8em .8em .8em;
}


.table-cell-text{
    vertical-align: middle !important;
}

.table-cell-button{
    text-align: right;
    vertical-align: middle !important;
    padding: .5em .25em !important;
}

.custom-table{
    margin-bottom: 0% !important;
}


.table-input{
}

</style>