<template>
    <tr>

            <!-- DISPLAY ITEMS -->
            <template v-if="!row_object.editing_state">
                <td v-for="(entry, col_index) in row_object.items" :key="col_index" class="table-cell-text">

                    <!-- INPUT TYPES -->
                    <div v-if="row_object.col_types[col_index] === 'pk'"     v-html="entry"               >    </div>
                    <div v-if="row_object.col_types[col_index] === 'string'" v-html="format_string(entry)">    </div>
                    <div v-if="row_object.col_types[col_index] === 'int'"    v-html="format_int(entry)"   >    </div>
                    <div v-if="row_object.col_types[col_index] === 'double'" v-html="format_double(entry)">    </div>
                    <div v-if="row_object.col_types[col_index] === 'list'"   v-html="format_list(entry)"  >    </div>
                </td>
            </template>


            <!-- EDIT ITEMS -->
            <template v-if="row_object.editing_state">
                <td v-for="(entry, col_index) in row_object.items" :key="col_index" class="table-cell-text">

                    <!-- INPUT TYPES -->
                    <div      v-if="row_object.col_types[col_index] === 'pk'"    ><a class="button is-small is-primary" v-on:click="edit_row(row_object)">undo</a>    </div>
                    <template v-if="row_object.col_types[col_index] === 'string'"><input class="input" type="text" v-model="row_object_copy.items[col_index]">        </template>
                    <template v-if="row_object.col_types[col_index] === 'int'"   ><input class="input" type="text" v-model="row_object_copy.items[col_index]">        </template>
                    <template v-if="row_object.col_types[col_index] === 'double'"><input class="input" type="text" v-model="row_object_copy.items[col_index]">        </template>

                    <!-- LIST TYPE -->
                    <template v-if="row_object.col_types[col_index] === 'list'"  >
                        <!-- LIST ITEM -->
                        <div v-for="(array_entry, array_index) in row_object_copy.items[col_index]" :key="array_index">
                            <input class="input" type="text" v-model="row_object_copy.items[col_index][array_index]">
                        </div>
                        <!-- ADD | DELETE LIST ITEM -->
                        <div class="add-remove-list-item-buttons">
                            <a class="button is-small is-success"  v-on:click="add_list_item(row_object_copy.items[col_index])"  ><i class="fas fa-plus"></i></a>
                            <a class="button is-small is-danger"   v-on:click="remove_list_item(row_object_copy.items[col_index])"  ><i class="fas fa-minus"></i></a>
                        </div>
                    </template>

                </td>
            </template>
            
            <!-- SELECT | DESELECT -->
            <td class="table-cell-button" v-if="table_selectable">
                <a class="button is-small is-link" v-if="!row_object.selected_state" v-on:click="!row_object.editing_state && select_row(row_object)" :disabled="row_object.editing_state">select</a>
                <a class="button is-small is-danger" v-if="row_object.selected_state" v-on:click="!row_object.editing_state && deselect_row(row_object)" :disabled="row_object.editing_state">deselect</a>
            </td>

            <!-- EDIT | COMMIT -->
            <td class="table-cell-button" v-if="table_mutable">
                <a class="button is-warning is-small" v-if="!row_object.editing_state" v-on:click="!row_object.selected_state && edit_row(row_object)" :disabled="row_object.selected_state">edit</a>
                <a class="button is-danger is-small" v-if="row_object.editing_state" v-on:click="commit_row(row_object_copy)" >commit</a>
            </td>

    </tr>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../../scripts/fetch-helpers';
    import * as _ from 'lodash-es';

    export default {
        nane: 'table-row',
        props: {
            row_object: Object,
            row_index: Number,
            table_selectable: Boolean,
            table_mutable: Boolean,
        },
        data: function () {
            return {
                row_object_copy: ''
            }
        },
        computed: {
            ...mapState({
                light_theme: state => state.vassarPages.light_theme,
            }),
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

            // FUNCITONS
            async select_row(row_object){
                await this.$store.dispatch('tables__select_tables', row_object);
                if(this.row_object.table_name === 'Group' && row_object.selected_state === true){
                    // this.$store.dispatch('query_instruments');                 
                }
                if(this.row_object.table_name === 'Problem' && row_object.selected_state === true){
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




        },
        async created() {
            this.row_object_copy = _.cloneDeep(this.row_object);
        },
        watch: {
            row_object() {
                this.row_object_copy = _.cloneDeep(this.row_object);
            },
        },
    }
</script>