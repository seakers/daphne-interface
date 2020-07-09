<template>
    <div style="display: flex; flex-direction: row;">

        <!-- JOIN SELECTION -->
        <div class="global-editor" v-if="selected_orbit_id !== null">


            <div class="orbit-title">
                {{ selected_orbit_name }} Attributes
            </div>

            <div class="orbit-attribute-editor">
                <table class="table">
                    <thead>


                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Slot Type</th>
                            <th>Type</th>
                            <th>Value</th>
                        </tr>

                    </thead>

                    <draggable 
                    class='attribute-list'
                    :list="editor_rows" 
                    :group="orbit_group"
                    tag="tbody"
                    @add="addAttribute"   
                    >
                
                        <tr v-for="(row, index_row) in editor_rows" :key="index_row">

                            <td>
                                <button class="button is-small remove-attribute-button" v-on:click="remove_attribute(index_row)">
                                    <span class="icon is-small">
                                        <i class="fas fa-times" style=""></i>
                                    </span>
                                </button>
                            </td>
                            <td scope="row">{{ row.name }}</td>


                            <td v-for="(value, index) in row.values" :key="index">
                                <div v-if="row.type === 'NL' || row.type === 'OL'">
                                    <div class="control" style="max-width: 125px;">
                                        <div class="select">
                                            <select v-model="editor_rows[index_row].values[index]">
                                                <option v-for="val in accepted_values[row.name]" :key="val">{{ val }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="row.type === 'FR'">
                                    <input v-model="editor_rows[index_row].values[index]" class="input" type="text" style="max-width: 125px">
                                </div>
                            </td>
                        </tr>


                    </draggable>


                </table>
            </div>
        </div>






        <!-- ATTRIBUTES -->
        <div class="attribute-selection">
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
    import { ProblemQuery, OrbitAttributeQuery, OrbitAttributeJoinQuery, OrbitAttributeAcceptedValuesQuery } from '../../../scripts/apollo-queries';


    export default {
        name: 'orbit-editor',

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
            addAttribute(event) {
                let attribute = event.item.textContent.trim();
                console.log("DD", attribute);
                Vue.set(this.orbit_attribute_selection, this.orbit_attribute_names.indexOf(attribute), true);
            },

            remove_attribute(index){
                this.orbit_attribute_selection[this.orbit_attribute_names.indexOf(this.editor_rows[index].name)] = false;
                this.editor_rows.splice(index, 1);
            },

            apply_to_problem(problem){
                
            }
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
                }
            },
        },

        async mounted() {

        },

        watch: {
            Problem() {
                this.problem_names = [];
                this.problem_names    = this.Problem.map(x => x.name);
                this.problem_ids      = this.Problem.map(x => x.id); 
                this.problem_applied  = new Array(this.Problem.length).fill(false);
            },

            Orbit_Attribute() {
                this.orbit_attribute_names      = this.Orbit_Attribute.map(x => x.name);
                this.orbit_attribute_ids        = this.Orbit_Attribute.map(x => x.id);
                this.orbit_attribute_slot_types = this.Orbit_Attribute.map(x => x.slot_type);
                this.orbit_attribute_types      = this.Orbit_Attribute.map(x => x.type);
                this.orbit_attribute_selection  = new Array(this.Orbit_Attribute.length).fill(false);
            },

            Join__Orbit_Attribute() {
                console.log("Join Table");
                if(this.Join__Orbit_Attribute === undefined){return;}
                this.editor_rows = [];
                this.problem_names.sort();

                // APPLIED PROBLEMS
                for(let x=0;x<this.problem_names.length;x++){
                    let problem = this.problem_names[x];
                    if(this.Join__Orbit_Attribute.filter(row => row.Problem.name === problem).length > 0){
                        this.problem_applied[this.problem_names.indexOf(problem)] = true;
                    }
                }

                // EDITOR ROWS
                for(let x=0;x<this.orbit_attribute_names.length;x++){
                    let attribute = this.orbit_attribute_names[x];
                    let row_info = this.Join__Orbit_Attribute.filter(row => row.Orbit_Attribute.name === attribute);
                    if(row_info.length === 0){continue;}
                    this.orbit_attribute_selection[this.orbit_attribute_names.indexOf(attribute)] = true;

                    row_info.sort(function(a, b){ 
                        var x = a.Problem.name.toLowerCase();
                        var y = b.Problem.name.toLowerCase();
                        if (x < y) {return -1;}
                        if (x > y) {return 1;}
                        return 0;
                    });
                    let row = {
                        name:      attribute,
                        type:      this.orbit_attribute_types[this.orbit_attribute_names.indexOf(attribute)],
                        slot_type: this.orbit_attribute_slot_types[this.orbit_attribute_names.indexOf(attribute)],
                        problems:  row_info.map(x => x.Problem.name),
                        values:    row_info.map(x => x.value)
                    };
                    this.editor_rows.push(row);
                }
            },

            Orbit_Attribute_Values() {
                for(let x=0;x<this.Orbit_Attribute_Values.length;x++){
                    let attribute = this.Orbit_Attribute_Values[x];
                    if(attribute.type === 'FR'){
                        this.accepted_values[attribute.name] = null;
                        continue;
                    }

                    let values = [];
                    for(let y=0;y<attribute.Join__Orbit_Attribute_Values.length;y++){
                        let value = attribute.Join__Orbit_Attribute_Values[y].Accepted_Value.value;
                        values.push(value);
                    }
                    Vue.set(this.accepted_values, attribute.name, values);
                }
            },
        },
    }
</script>



<style lang="scss">

.global-editor{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-width: 0px 8px 0px 0px;
    border-color: #f2f2f2;
    border-style: solid;
    max-height: 90vh;
    overflow-y: auto;
}

.orbit-title{
    display: flex;
    padding-top: 15%;
    padding-left: 5%;
    text-align: center;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 17px;
}


.list-complete-item {
  transition: all 1s;
}

.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}





.attribute-selection{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-width: 0px 8px 0px 0px;
    border-color: #f2f2f2;
    border-style: solid;
}
.attribute-selection-header{
    text-align: center;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.6em 0em;
    border-width: 0px 0px 2px 0px;
    border-color: #f2f2f2;
    border-style: solid;
}
.attribute-selection-items{
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    overflow-y: auto;
    scrollbar-color: #fff #fff;
    scrollbar-width: none;
}
.attribute-selection-item:hover{
    background-color: #f0f2f5;
}
.attribute-selection-item{
    display: flex;
    flex-direction: row;
    padding: 0.5em 1em;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
}
.attribute-selection-item-selected{
    display: flex;
    color: #a6a6a6;
    cursor: default !important;
}
.attribute-selection-item-selected:hover{
    background-color: #fff !important;
}
.attribute-selection-item-label{
    flex-grow: 1;
    padding-right: 1em;
}


.remove-attribute-button{
    border-width: 0 !important;
}

</style>