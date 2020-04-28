<template>
    <div class="global-selection">

        <!-- TITLE -->
        <div class="global-selection-header">
            {{ title }}
        </div>

        <!-- global -->
        <div class="global-selection-items">
            <div v-for="(row, index) in rows" :key="index">
                <div class="global-selection-item" v-bind:class="{ 'global-selection-item-selected': row.selected }" v-on:click="select_global(index)">
                    <div class="global-selection-item-edit">
                        <i class="fas fa-edit fa-xs" style="height: 15px;"></i>
                    </div>
                    <div class="global-selection-item-label">{{ row.name }}</div>
                    <div><i class="fas fa-chevron-right fa-sm"></i></div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import gql from 'graphql-tag';
    import SwitchButton from '../SwitchButton';
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../../scripts/fetch-helpers';

    export default {
        name: 'select-global',

        props: {
            table: String,
            title: String,
            query: Array,

        },

        data: function () {
            return {
                rows: [],
            }
        },

        computed: {
            ...mapState({
            }),
            ...mapGetters({
                selected_group_id: 'get_group_id',
            }),
        },

        methods: {
            deselect_all() {
                for(let x=0;x<this.rows.length;x++){
                    Vue.set(this.rows[x], 'selected', false);
                }
            },
            select_global(index) {
                console.log("Selecting Orbit", this.rows[index]);
                this.$store.commit('set_global_id', [this.table, this.rows[index].id, this.rows[index].name]);
                this.deselect_all();
                Vue.set(this.rows[index], 'selected', true);
            }
        },

        components: {

        },

        async mounted() {

        },

        async beforeDestroy() {
            this.$store.commit('set_global_id', [this.table, null, null]);
        },

        watch: {
            query() {
                for(let x=0;x<this.query.length;x++){
                    let row = _.cloneDeep(this.query[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.rows.push(row);
                }
            }
        },
        
    }
</script>



<style lang="scss">

.global-selection{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-width: 0px 8px 0px 0px;
    border-color: #f2f2f2;
    border-style: solid;
}
.global-selection-header{
    text-align: center;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.6em 0em;
    border-width: 0px 0px 2px 0px;
    border-color: #f2f2f2;
    border-style: solid;
}
.global-selection-items{
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    overflow-y: auto;
    scrollbar-color: #fff #fff;
    scrollbar-width: none;
}
.global-selection-item{
    display: flex;
    flex-direction: row;
    padding: 0.5em 1em;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
}
.global-selection-item:hover{
    background-color: #f0f2f5;
}
.global-selection-item-selected{
    display: flex;
    background-color: #354052 !important;
    color: #f2f2f2;
}
.global-selection-item-edit{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: .3em;
}
.global-selection-item-label{
    flex-grow: 1;
    padding-right: 1em;
}

</style>