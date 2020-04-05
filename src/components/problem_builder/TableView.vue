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
                    <tr>
                        <th v-for="title in table_object.col_titles" :key="title">{{ title }}</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="(row, row_index) in table_rows" :key="row.id">

                            <template v-if="!row.editing_state">
                                <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">{{ entry }}</td>
                            </template>
                            <template v-if="row.editing_state">
                                <td v-for="(entry, col_index) in row.items" :key="col_index" class="table-cell-text">

                                    <input class="input" type="text" v-model="table_rows_copy[row_index].items[col_index]" v-if="col_index !== 0">

                                    <button class="button is-small table-view-close-edit" v-if="col_index === 0" v-on:click="edit_row(row)">
                                        <span class="icon is-small">
                                            <i class="fas fa-times" style="color: #354052;"></i>
                                        </span>
                                    </button>

                                </td>
                            </template>

                            <td class="table-cell-button" v-if="table_selectable"><a class="button is-small" v-bind:class="[ row.selected_state ? 'is-success' : 'is-link' ]" v-on:click="!row.editing_state && select_row(row)" :disabled="row.editing_state">select</a></td>
        
                            <td class="table-cell-button" v-if="table_mutable && !row.editing_state"><a class="button is-warning is-small" v-on:click="!row.selected_state && edit_row(row)" :disabled="row.selected_state">edit</a></td>
                            <td class="table-cell-button" v-if="table_mutable && row.editing_state"><a class="button is-danger is-small" v-on:click="commit_row(table_rows_copy[row_index])">commit</a></td>

                    </tr>

                     <!-- INSERT ROW -->
                    <tr v-if="table_appendable">
                        <template v-if="insert_state === true">
                            <td class="table-cell-button">
                                <button class="button is-small table-insert-close-button" v-on:click="toggle_insert_state(false)">
                                    <span class="icon is-small"><i class="fas fa-times" style="color: #354052;"></i></span>
                                </button>    
                            </td> 

                            <td v-for="row_item in new_row_object.items" :key="row_item.key"><input class="input table-input" type="text" v-model="row_item.value" :placeholder="row_item.key"></td>

                            <td class="table-cell-button"><a class="button is-danger is-small" v-on:click="insert_row()">insert</a></td>
                        </template> 
                    </tr>
                </tbody>
            </table>
            <a v-if="insert_state === false && table_appendable" class="button is-primary is-fullwidth" v-on:click="toggle_insert_state(true)" style="border-radius: 0;">new row</a>
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
                let to_return = {};
                to_return['index'] = this.table_rows.length;
                to_return['items'] = [];
                to_return['table_name'] = this.table_object.table_name;
                to_return['foreign_key'] = this.foreign_key;
                let num_keys = this.table_object.col_keys.length;
                for(let x=1;x<num_keys;x++){
                    let item_object = {};
                    item_object['key'] = this.table_object.col_keys[x];
                    item_object['value'] = '';
                    to_return['items'].push(item_object);
                }
                return to_return;
            },
        },
        methods: {
            async select_row(row_object){
                this.$store.commit('tables__set_selected_row', row_object);
                if(this.table_object.table_name === 'Problem' && row_object.selected_state === true){
                    this.$store.dispatch('query__problem_info');                    
                }
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



</style>