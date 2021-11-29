<template>
    <div style="display: flex; flex-direction: row;">




        <div style="flex-grow: 2;">

        </div>

        <div style="flex-grow: 1;">

        </div>



        <!-- ATTRIBUTES -->
        <!-- <div class="attribute-selection">
            <div class="attribute-selection" style="max-height: 90vh;">

                <div class="attribute-selection-header">Attributes</div>

                <div class="attribute-selection-items">
                    <draggable
                        class=""
                        :list="orbit_attribute_names"
                        :group="attribute_group"
                        :clone="cloneAttribute"
                        draggable=".draggable-attribute"
                        @change="log"
                    >
                        <div v-for="(name, index) in orbit_attribute_names" :key="index" v-bind:class="{ 'draggable-attribute': !orbit_attribute_selection[index] }">

                            <div class="attribute-selection-item" v-bind:class="{ 'attribute-selection-item-selected': orbit_attribute_selection[index] }">
                                <div class="attribute-selection-item-label" id="attribute-name">{{ name }}</div>
                            </div>

                        </div>
                    </draggable>
                </div>
            </div>
        </div> -->
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
    import { ProblemQuery, OrbitAttributeQuery, OrbitAttributeJoinQuery, OrbitAttributeAcceptedValuesQuery } from '../../../scripts/apollo-queries';


    export default {
        name: 'single-attribute-builder',

        props: {
            table: String,
            title: String,
            query: Array,
        },

        data: function () {
            return {
                Problem: [],
                Orbit_Attribute: [],
                Orbit_Attribute_Values: [],
                Join__Orbit_Attribute: [],

                problems: {},
                attributes: {},

                problem_names: [],
                problem_ids: [],
                problem_applied: [],

                orbit_attribute_names: [],
                orbit_attribute_ids: [],
                orbit_attribute_types: [],
                orbit_attribute_slot_types: [],
                orbit_attribute_selection: [],  //Attributes seen in the selected orbit (bool array)

                editor_rows: [],
                accepted_values: {},

                attribute_group: {
                    name: 'attributes', 
                    pull: 'clone',
                    put: false 
                },
                orbit_group: {
                    name: 'attributes', 
                    pull: false,
                    put: true
                },

            }
        },

        computed: {
            ...mapState({
            }),
            ...mapGetters({
                selected_group_id: 'get_group_id',
                selected_orbit_id: 'get_orbit_id',
                selected_orbit_name: 'get_orbit_name',
            }),
        },

        methods: {
            log: function(evt) {
                console.log(evt);
            },
            cloneAttribute(event) {
                let insertion = {
                    name:     event,
                    type:      this.orbit_attribute_types[this.orbit_attribute_names.indexOf(event)],
                    slot_type: this.orbit_attribute_slot_types[this.orbit_attribute_names.indexOf(event)],
                    problems: this.problem_names,
                    values:   new Array(this.problem_names.length).fill('')
                };
                console.log("insertion", insertion);
                return insertion;
            },
        },

        components: {
            SwitchButton,
            draggable
        },

        apollo: {
            Problem: {
                query: ProblemQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Orbit_Attribute: {
                query: OrbitAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Orbit_Attribute_Values: {
                query: OrbitAttributeAcceptedValuesQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                },
                update(data) {
                    Object.defineProperty(data, 'Orbit_Attribute_Values', Object.getOwnPropertyDescriptor(data, 'Orbit_Attribute'));
                    delete data['Orbit_Attribute'];
                },
                result(data){
                    this.Orbit_Attribute_Values = data.data.Orbit_Attribute_Values;
                    console.log(this.Orbit_Attribute_Values);
                },
            },
            Join__Orbit_Attribute: {
                query: OrbitAttributeJoinQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                        selected_orbit_id: this.selected_orbit_id
                    }
                },
                skip(){
                    if(this.selected_group_id === null){
                        return true;
                    }
                    return false
                },
            },
        },

        async mounted() {

        },

        watch: {
            
        },
    }
</script>



<style lang="scss">

.global-editor{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-width: 0px 8px 0px 0px;
    border-color: #f2f2f2;
    border-style: solid;
    max-height: 90vh;
    overflow-y: auto;
}



</style>