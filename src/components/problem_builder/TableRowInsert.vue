<template>
    <tr>

        <!-- FOR col_type, index -->
        <td v-for="(col_type, index) in new_row_object.col_types" :key="index">


            <!-- PK -->
            <template v-if="col_type === 'pk'">
                    <div></div>        
            </template>

            <!-- STRING -->
            <template v-if="col_type === 'string'">
                    <input class="input" type="text" v-model="new_row_object.items[index]">        
            </template>

            <!-- INT -->
            <template v-if="col_type === 'int'"   >
                <input class="input" type="text" v-model="new_row_object.items[index]">        
            </template>

            <!-- DOUBLE -->
            <template v-if="col_type === 'double'">
                <input class="input" type="text" v-model="new_row_object.items[index]">        
            </template>

            <!-- LIST -->
            <template v-if="col_type === 'list'">
                <div v-for="(array_entry, array_index) in new_row_object.items[index]" :key="array_index">
                    <input class="input" type="text" v-model="new_row_object.items[index][array_index]">
                </div>
                <!-- ADD | DELETE LIST ITEM -->
                <div class="add-remove-list-item-buttons">
                    <a class="button is-small is-success"  v-on:click="add_list_item(new_row_object.items[index])"  ><i class="fas fa-plus"></i></a>
                    <a class="button is-small is-danger"   v-on:click="remove_list_item(new_row_object.items[index])"  ><i class="fas fa-minus"></i></a>
                </div>
            </template>

        </td>

        <td class="table-cell-button"><a class="button is-danger is-small" v-on:click="insert_row()">insert</a></td>

    </tr>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import { validate_row } from '../../scripts/query-helpers';
    import * as _ from 'lodash-es';

    export default {
        name: 'table-row-insert',
        props: {
            table_object: Object,
            table_rows: Array,
            foreign_key: Number,
        },
        data: function() {
            return {
                test: '',
                new_row_object: {},
            }
        },
        computed: {
            ...mapState({
                light_theme: state => state.vassarPages.light_theme,
            }),
        },
        methods: {
            async add_list_item(list){
                console.log("ADDING LIST ITEM", list);
                list.push('');
            },
            async remove_list_item(list){
                console.log("REMOVING LIST ITEM", list);
                list.pop();
            },
            async insert_row() {
                this.$store.dispatch('tables__insert_row', this.new_row_object);
            },
        },

        // INITIALIZE
        async created() {
            this.$set(this.new_row_object, 'index', this.table_rows.length);
            this.$set(this.new_row_object, 'col_types', this.table_object.col_types);
            this.$set(this.new_row_object, 'table_name', this.table_object.table_name);
            this.$set(this.new_row_object, 'foreign_key', this.foreign_key);

            let items = [];
            for(let x=0;x<this.new_row_object['col_types'].length;x++){
                let col_type = this.new_row_object['col_types'][x];
                if(col_type === 'list'){
                    items.push([]);
                }
                else{
                    items.push('');
                }
            }
            this.$set(this.new_row_object, 'items', items);
        },
    }
</script>