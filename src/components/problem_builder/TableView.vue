<template>
    <div class="table-view-container" v-bind:class="{ 'table-view-hidden': hidden === true }">


        <div class="table-view-header">
            <div class="table-view-header-title">{{ display_name }}</div>

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
                            <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">{{ entry }}</td>
                        </template>
                        <template v-if="row.editing_state">
                            <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">
                                <input class="input" type="text" v-model="table_view_rows_data_copy[row_index].items[col_index]" v-if="entry !== row.objects.id">
                                <button class="button is-small table-view-close-edit" v-if="entry === row.objects.id" v-on:click="edit_row(row)">
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

                            <td v-for="row_item in new_row_object.items" :key="row_item.key"><input class="input table-input" type="text" v-model="row_item.value" :placeholder="row_item.key"></td>

                            <td class="table-cell-button"><a class="button is-danger is-small" v-on:click="insert_row()">insert</a></td>
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
            display_name: String,
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
            new_row_object() {
                let to_return = {};
                to_return['index'] = this.table_view_rows_data.length;
                to_return['items'] = [];
                to_return['table_name'] = this.table_name;

                let num_keys = this.row_keys.length;
                for(let x=1;x<num_keys;x++){
                    let item_object = {};
                    item_object['key'] = this.row_keys[x];
                    item_object['value'] = '';
                    to_return['items'].push(item_object);
                }
                return to_return;
            },
        },
        methods: {
            async select_row(row_object){
                console.log("SELECT", row_object);
                let row = row_object.items;

                if(this.table_name === 'Group'){
                    this.$store.dispatch('groups__toggle_select', row_object);
                }

                if(this.table_name === 'Problem'){
                    this.$store.dispatch('problems__toggle_select', row_object);

                    // Load Data
                    await this.$store.dispatch('panels__get_rows');
                    await this.$store.dispatch('objectives__get_rows');
                    await this.$store.dispatch('subobjectives__get_rows');
                    await this.$store.dispatch('attr_requirements__get_rows');
                    await this.$store.dispatch('case_requirements__get_rows');

                    // Reset Selections
                    this.$store.commit('stakeholders__reset_selections');
                    
                    
                }

                if(this.table_name === 'Stakeholder_Needs_Panel'){
                    this.$store.dispatch('panels__toggle_select', row_object);
                }
                if(this.table_name === 'Stakeholder_Needs_Objective'){
                    this.$store.dispatch('objectives__toggle_select', row_object);
                }
                if(this.table_name === 'Stakeholder_Needs_Subobjective'){
                    this.$store.dispatch('subobjectives__toggle_select', row_object);
                }

                if(['Requirement_Rule_Attribute', 'Requirement_Rule_Case'].indexOf(this.table_name) >= 0){
                    this.$store.dispatch('requirements__toggle_select', row_object);
                }


            },

            edit_row(row_object){
                console.log("EDIT", row_object);
                if(this.table_name === 'Group'){
                    this.$store.dispatch('groups__toggle_edit', row_object);
                }
                if(this.table_name === 'Problem'){
                    this.$store.dispatch('problems__toggle_edit', row_object);
                }
                if(['Stakeholder_Needs_Panel', 'Stakeholder_Needs_Objective', 'Stakeholder_Needs_Subobjective'].indexOf(this.table_name) >= 0){
                    this.$store.commit('stakeholders__set_edit_state', row_object);
                }
                if(['Requirement_Rule_Attribute', 'Requirement_Rule_Case'].indexOf(this.table_name) >= 0){
                    this.$store.commit('requirements__set_edit_state', row_object);
                }
            },

            commit_row(row_object){
                console.log("COMMIT", row_object);
                if(this.table_name === 'Problem'){
                    this.$store.dispatch('problems__commit_edit', row_object);
                }
                if(this.table_name === 'Stakeholder_Needs_Panel'){
                    this.$store.dispatch('stakeholders__commit_edit', row_object);
                }
                if(this.table_name === 'Stakeholder_Needs_Objective'){
                    this.$store.dispatch('stakeholders__commit_edit', row_object);
                }
                if(this.table_name === 'Stakeholder_Needs_Subobjective'){
                    this.$store.dispatch('stakeholders__commit_edit', row_object);
                }
                if(['Requirement_Rule_Attribute', 'Requirement_Rule_Case'].indexOf(this.table_name) >= 0){
                    this.$store.dispatch('requirements__commit_edit', row_object);
                }

            },

            insert_row(){
                console.log("INSERT", this.new_row_object);
                if(this.table_name === 'Problem'){
                    this.$store.dispatch('problems__insert_row', this.new_row_object);
                }
                if(['Stakeholder_Needs_Panel', 'Stakeholder_Needs_Objective', 'Stakeholder_Needs_Subobjective'].indexOf(this.table_name) >= 0){
                    this.$store.dispatch('stakeholders__insert_row', this.new_row_object);
                }
                if(['Requirement_Rule_Attribute', 'Requirement_Rule_Case'].indexOf(this.table_name) >= 0){
                    this.$store.dispatch('requirements__insert_row', this.new_row_object);
                }
            },

            close_view(){
                console.log("Closing View");
                if(this.table_name === 'Stakeholder_Needs_Objective'){
                    this.$store.commit('panels__reset_selections');
                    this.$store.commit('objectives__reset_selections');
                    this.$store.commit('subobjectives__reset_selections');
                }
                if(this.table_name === 'Stakeholder_Needs_Subobjective'){
                    this.$store.commit('objectives__reset_selections');
                    this.$store.commit('subobjectives__reset_selections');
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
    max-height: 500px;
    overflow-y: auto !important;
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