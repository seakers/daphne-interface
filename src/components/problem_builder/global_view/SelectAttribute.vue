<template>
    <div class="attribute-selection">

        <div class="attribute-selection" style="max-height: 80vh;">

            <!-- TITLE -->
            <div class="attribute-selection-header">
                Attributes
            </div>

            <!-- ATTRIBUTES -->
            <div class="attribute-selection-items">

                <draggable>

                    <div v-for="(row, index) in rows" :key="index">
                        <div class="attribute-selection-item" v-bind:class="{ 'attribute-selection-item-selected': row.selected }">
                            <div class="attribute-selection-item-label">{{ row.name }}</div>
                        </div>
                    </div>

                </draggable>

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
    import draggable from 'vuedraggable';

    export default {
        name: 'select-attribute',

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
            }),
        },

        methods: {

        },

        components: {
            draggable
        },

        apollo: {

        },

        async mounted() {

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




</style>