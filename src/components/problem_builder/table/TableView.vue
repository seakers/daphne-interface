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
                <!-- TABLE HEADER -->
                <thead>
                    <tr>
                        <th v-for="title in table_object.col_titles" :key="title">{{ title }}</th>
                    </tr>                    
                </thead>

                <!-- TABLE BODY -->
                <tbody>
                    <!-- ROWS -->
                    <table-row v-for="(row_object, row_index) in table_rows" :key="row_index" 
                               :row_object="row_object"
                               :row_index="row_index"
                               :table_selectable="table_selectable"
                               :table_mutable="table_mutable"
                               :table_cloneable="table_cloneable"
                    >
                    </table-row>

                    <!-- INSERT ROW -->
                    <table-row-insert v-if="insert_state === true" 
                            :table_object="table_object"
                            :table_rows="table_rows"
                            :foreign_key="foreign_key"
                            :foreign_key_2="foreign_key_2"
                    >
                    </table-row-insert>
                </tbody>
            </table>

            <!-- INSERT -->
            <a v-if="insert_state === false && table_appendable" class="button is-primary is-fullwidth" v-on:click="toggle_insert_state(true)" style="border-radius: 0;">{{ new_row_text }}</a>
            <a v-if="insert_state === true && table_appendable" class="button is-warning is-fullwidth" v-on:click="toggle_insert_state(false)" style="border-radius: 0;">cancel insert</a>

        </div>
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../../scripts/fetch-helpers';
    import TableRowInsert from './TableRowInsert';
    import TableRow from './TableRow';
    import * as _ from 'lodash-es';
    
    export default {
        name: 'table-view',
        props: {
            table_object: Object,
            foreign_key: Number,
            foreign_key_2: Number,
            new_row_text: {
                type: String,
                default: 'new row'
            }
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
                return this.table_object.state.appendable;
            },
            table_hidden() {
                return this.table_object.state.hidden;
            },
            table_cloneable(){
                return this.table_object.state.cloneable;
            }
        },
        methods: {
            async close_view(){
                console.log("CLOSE VIEW");
            },
            toggle_insert_state(val) {
                this.insert_state = val;
            },
        },
        components: {
            TableRowInsert,
            TableRow,
        },
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

.add-remove-list-item-buttons{
    padding-top: 3px;
}



</style>