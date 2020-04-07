<template>
    <div class="table-view-container" v-bind:class="[ light_theme ? 'table-view-container-light' : 'table-view-container-dark' ]">


        <div class="table-view-header">
            <div class="table-view-header-title"  v-bind:class="[ light_theme ? 'table-view-header-title-light' : 'table-view-header-title-dark' ]"    >{{ this.table_object.display_name }}</div>

            <div class="table-view-header-search">
                <!-- <input class="input is-small is-rounded" type="text" placeholder="search..." style="max-width: 190px;" v-model="this.search_term"> -->
            </div>

            <template v-if="table_closeable">
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
            <table class="table custom-table is-hoverable is-fullwidth">
                <thead>

                    <!-- TABLE HEADER -->
                    <tr>
                        <th v-for="title in table_object.col_titles" :key="title">{{ title }}</th>
                    </tr>

                    
                </thead>

                <tbody>

                    <!----- TABLE ROW ----->
                    <tr v-for="(row, row_index) in table_rows" :key="row.id">

                            <!-- DISPLAY ITEM -->
                            <template v-if="!row.editing_state">
                                <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">

                                    <!-- INPUT TYPES -->
                                    <div v-if="row.col_types[col_index] === 'pk'" v-html="entry">    </div>
                                    <div v-if="row.col_types[col_index] === 'string'" v-html="format_string(entry)">    </div>
                                    <div v-if="row.col_types[col_index] === 'int'"    v-html="format_int(entry)"   >    </div>
                                    <div v-if="row.col_types[col_index] === 'double'" v-html="format_double(entry)">    </div>
                                    <div v-if="row.col_types[col_index] === 'list'"   v-html="format_list(entry)"  >    </div>
                                </td>
                            </template>

                            <!-- EDIT ITEM -->
                            <template v-if="row.editing_state">
                                <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">

                                    <!-- INPUT TYPES -->
                                    <div      v-if="row.col_types[col_index] === 'pk'"><a class="button is-small is-primary" v-on:click="edit_row(row)">undo</a>           </div>
                                    <template v-if="row.col_types[col_index] === 'string'"><input class="input" type="text" v-model="table_rows_copy[row_index].items[col_index]">        </template>
                                    <template v-if="row.col_types[col_index] === 'int'"   ><input class="input" type="text" v-model="table_rows_copy[row_index].items[col_index]">        </template>
                                    <template v-if="row.col_types[col_index] === 'double'"><input class="input" type="text" v-model="table_rows_copy[row_index].items[col_index]">        </template>

                                    <!-- LIST TYPE -->
                                    <template v-if="row.col_types[col_index] === 'list'"  >
                                        <!-- LIST ITEM -->
                                        <div v-for="(array_entry, array_index) in table_rows_copy[row_index].items[col_index]" :key="array_index">
                                            <input class="input" type="text" v-model="table_rows_copy[row_index].items[col_index][array_index]">
                                        </div>
                                        <!-- ADD | DELETE LIST ITEM -->
                                        <div class="add-remove-list-item-buttons">
                                            <a class="button is-small is-success"  v-on:click="add_list_item(table_rows_copy[row_index].items[col_index])"  ><i class="fas fa-plus"></i></a>
                                            <a class="button is-small is-danger"   v-on:click="remove_list_item(table_rows_copy[row_index].items[col_index])"  ><i class="fas fa-minus"></i></a>
                                        </div>
                                    </template>

                                </td>
                            </template>
                            
                            <!-- SELECT | DESELECT -->
                            <td class="table-cell-button" v-if="table_selectable">
                                <a class="button is-small is-link" v-if="!row.selected_state" v-on:click="!row.editing_state && select_row(row)" :disabled="row.editing_state">select</a>
                                <a class="button is-small is-danger" v-if="row.selected_state" v-on:click="!row.editing_state && deselect_row(row)" :disabled="row.editing_state">deselect</a>
                            </td>
        
                            <!-- EDIT | COMMIT -->
                            <td class="table-cell-button" v-if="table_mutable">
                                <a class="button is-warning is-small" v-if="!row.editing_state" v-on:click="!row.selected_state && edit_row(row)" :disabled="row.selected_state">edit</a>
                                <a class="button is-danger is-small" v-if="row.editing_state" v-on:click="commit_row(table_rows_copy[row_index])" >commit</a>
                            </td>
                    </tr>


                    <!----- INSERT ROW ----->
                    <table-row-insert v-if="insert_state === true" 
                            :table_object="table_object"
                            :table_rows="table_rows"
                            :foreign_key="foreign_key"
                    >

                    </table-row-insert>

                </tbody>
            </table>

            <a v-if="insert_state === false && table_appendable" class="button is-primary is-fullwidth" v-on:click="toggle_insert_state(true)" style="border-radius: 0;">new row</a>
            <a v-if="insert_state === true && table_appendable" class="button is-warning is-fullwidth" v-on:click="toggle_insert_state(false)" style="border-radius: 0;">cancel insert</a>

        </div>
        


    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableRowInsert from './TableRowInsert';
    import * as _ from 'lodash-es';
    
    export default {
        name: 'table-view',
        props: {
            table_object: Object,
            foreign_key: Number,
        },
        data: function () {
            return {
                insert_state: false,
                table_rows_copy: [],
                search_term: '',
            }
        },
        computed: {
            ...mapState({
                light_theme: state => state.vassarPages.light_theme,
            }),
            // TABLE ROWS
            table_rows() {
                return this.table_object.row_object_mapper[this.foreign_key];
            },

            // TABLE STATE
            table_closeable() {
                return this.table_object.state.closeable;
            },
            table_mutable() {
                return this.table_object.state.mutable;
            },
            table_selectable() {
                return this.table_object.state.selectable;
            },
            table_appendable() {
                return this.table_object.state.mutable;
            },
            table_hidden() {
                return this.table_object.state.hidden;
            },

            // NEW ROW
            new_row_object() {
                let row_object = {};
                row_object['index'] = this.table_rows.length;
                row_object['col_types'] = this.table_object.col_types;
                row_object['table_name'] = this.table_object.table_name;
                row_object['foreign_key'] = this.foreign_key;

                let items = [];
                for(let x=0;x<row_object['col_types'].length;x++){
                    let col_type = row_object['col_types'][x];
                    if(col_type === 'list'){
                        items.push([]);
                    }
                    else{
                        items.push('');
                    }
                }
                row_object['items'] = items;
                return row_object;
            },
        },
        methods: {
            // LIST ITEM OPERATIONS
            async add_list_item(list){
                console.log("ADDING LIST ITEM", list);
                list.push('');
            },
            async remove_list_item(list){
                console.log("REMOVING LIST ITEM", list);
                list.pop();
            },


            // FORMATTERS
            format_string(col_string){
                return col_string;
            },
            format_int(col_int){
                return col_int;
            },
            format_double(col_double){
                return col_double;
            },
            format_list(col_list){
                if(col_list === null){return 'null';}
                return col_list.join(" <br> ");
            },


            // ROW OPERATIONS
            async select_row(row_object){
                await this.$store.dispatch('tables__select_tables', row_object);
                if(this.table_object.table_name === 'Group' && row_object.selected_state === true){
                    this.$store.dispatch('query_instruments');                 
                }
                if(this.table_object.table_name === 'Problem' && row_object.selected_state === true){
                    this.$store.dispatch('query__problem_info');
                }
            },
            async deselect_row(row_object){
                console.log("DESELECT", row_object);
                this.$store.dispatch('tables__unselect_tables', row_object.table_name);
            },
            async edit_row(row_object){
                console.log("EDIT", row_object);
                this.$store.commit('tables__set_edit_state', row_object);
            },
            async commit_row(row_object){
                console.log("COMMIT", row_object);
                this.$store.dispatch('tables__commit_edit', row_object);
            },
            async insert_row(){
                console.log("INSERT", this.new_row_object);
                this.$store.dispatch('tables__insert_row', this.new_row_object);
            },
            async close_view(){
                console.log("CLOSE VIEW");
            },
            toggle_insert_state(val) {
                this.insert_state = val;
            },
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
            TableRowInsert,
        },


        // COPY TABLES
        async created() {
            this.table_rows_copy = _.cloneDeep(this.table_rows);
            console.log("SETTING COPY DATA", this.table_object.table_name, this.table_rows_copy);
        },
        watch: {   
            table_rows() {
                this.table_rows_copy = _.cloneDeep(this.table_rows);
                console.log("UPDATE COPY DATA", this.table_object.table_name, this.table_rows_copy);
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
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-self: center;
    margin: 8px;
}
.table-view-container-light{
    background-color: #fff;

    transition: background-color ease-out, box-shadow ease-out;
    -webkit-transition: background-color 700ms linear, box-shadow 700ms linear;
    -ms-transition: background-color 700ms linear, box-shadow 700ms linear;
    transition: background-color 700ms linear, box-shadow 700ms linear;
}
.table-view-container-dark{
    box-shadow: 0px 0px 19px 4px #14191f;
    background-color: #354052;

    transition: background-color ease-out, box-shadow ease-out;
    -webkit-transition: background-color 700ms linear, box-shadow 700ms linear;
    -ms-transition: background-color 700ms linear, box-shadow 700ms linear;
    transition: background-color 700ms linear, box-shadow 700ms linear;
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
    padding-left: 0.6em;
    padding-bottom: 0.6em;
    padding-top: 0.6em;
    padding-right:1.8em;
    text-align: center;
    font-weight: bold;
}

.table-view-header-title-light{
    color: #363636;
}
.table-view-header-title-dark{
    color: whitesmoke;
}









.table-view-header-search{
    flex-grow: 1;
    display: flex;
    flex-direction: row-reverse;
    color: whitesmoke;
    padding-left: 0.6em;
    padding-bottom: 0.6em;
    padding-top: 0.6em;
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
    max-height: 60vh;
    overflow-y: auto !important;
}


.table-cell-text{
    vertical-align: middle !important;
}

.table-cell-button{
    text-align: right;
    vertical-align: middle !important;
    padding: .5em .6em .5em 0em !important;
}

.custom-table{
    margin-bottom: 0% !important;
}


.table-input{
}

.add-remove-list-item-buttons{
    padding-top: 3px;
}



</style>