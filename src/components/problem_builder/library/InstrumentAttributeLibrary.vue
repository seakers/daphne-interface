<template>
    <div class="instruments-library-panel">

        <!-- HEADER -->
        <div class="instrument-library-title">
            <p>Instrument Attribute Library</p>
        </div>

        <div class="instrument-library-instrument">
            <p>{{ instrument_object.name }}</p>
        </div>

        <div class="instrument-library-body">
            <div style="padding-right: 5px;">Select Problem</div>
            <select v-model="problem_id">
                <option v-for="option in Join__Problem_Instrument" v-bind:value="option.Problem.id" :key="option.Problem.id">
                    {{ option.Problem.name }}
                </option>
            </select>
        </div>

        <!-- BODY -->
        <div class="instrument-library-body">

            <!-- LOCAL ATTRIBUTES -->
            <div class="instrument-local-attributes">
                <div v-for="(row, index_row) in local_attribute_rows" :key="index_row">
                    <div class="single-local-attribute" v-bind:class="{ 'instrument-selected': row.selected }" v-on:click="select_local_attribute(index_row)">
                        <div>{{ row.name }}</div>

                        <div>{{ row.value }}</div>
                        <!-- <div v-if="row.has_accepted">
                            <select v-model="row.value">
                                <option v-for="option in row.accepted_values" v-bind:value="option.Accepted_Value.value" :key="option.Accepted_Value.value">
                                    {{ option.Accepted_Value.value }}
                                </option>
                            </select>
                        </div>
                        <div v-if="!row.has_accepted"><input v-model="row.value" placeholder="value..."></div> -->
                    </div>
                </div>
            </div>

            <!-- ADD / REMOVE ATTRIBUTES -->
            <div class="instrument-attribute-operations">
                <button class="button" v-on:click="add_attribute()" style="margin: 3px;" :disabled="!global_attribute_selected">
                    <span class="icon">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
                </button>
                <button class="button" v-on:click="remove_attribute()" style="margin: 3px;" :disabled="!local_attribute_selected">
                    <span class="icon">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    </span>
                </button>
            </div>

            <!-- GLOBAL ATTRIBUTES -->
            <div class="instrument-global-attributes">
                <div v-for="(row, index_row) in global_attribute_rows" :key="index_row">
                    <div class="single-local-attribute" v-bind:class="{ 'instrument-selected': row.selected }" v-on:click="select_global_attribute(index_row)">
                        <div>{{ row.name }}</div>
                        <div>{{ row.slot_type }}</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- EDIT ATTRIBUTE -->
        <div class="instrument-edit-btns">
            <button class="button is-warning" v-on:click="set_attribute_value()" :disabled="!local_attribute_selected">
                Edit Attribute
            </button>
        </div>

        <!-- ORBIT OPERATIONS -->
        <div class="instrument-operations">
            <button class="button is-info" style="margin: 5px;" v-on:click="display_instrument_library()">
                Return to Instrument Library
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_instrument_attribute()">
                Delete Attribute
            </button>
            <button class="button is-primary" style="margin: 5px;" v-on:click="new_instrument_attribute()">
                New Attribute
            </button>
        </div>



        <!-- AND NEW ORBIT ATTRIBUTE -->
        <set-instrument-attribute
                :isActive="add_attribute_modal"
                :update="false"
                :local_attribute="global_attribute_selected_obj"
                :instrument_id="this.instrument_object.id"
                :problem_id="this.problem_id"
                v-on:close-modal="close_add_attribute_modal()"
        ></set-instrument-attribute>

        <!-- UPDATE ORBIT ATTRIBUTE VALUE -->
        <set-instrument-attribute
                :isActive="set_attribute_modal"
                :update="true"
                :local_attribute="local_attribute_selected_obj"
                v-on:close-modal="close_set_attribute_modal()"
        ></set-instrument-attribute>

        <!--        <instrument-attribute-->
        <!--                :isActive="new_attribute_modal"-->
        <!--                v-on:close-modal="close_new_attribute_modal()"-->
        <!--        ></instrument-attribute>-->

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import { InstrumentSpecificAttributeQuery, DeleteLocalInstrumentAttribute, DeleteGlobalInstrumentAttribute, ProblemInstrumentQuery, DeleteGlobalInstrumentAttributeChildren } from '../../../scripts/instrument-queries';

    // COMPONENTS
    import InstrumentAttribute from './modals/instrument/InstrumentAttribute';
    import SetInstrumentAttribute from './modals/instrument/SetInstrumentAttribute';

    export default {

        name: 'instrument-attribute-library',
        data: function () {
            return {
                problem_id: 0,
                instrument_id: false,
                instrument_name: '',

                // MODALS
                new_attribute_modal: false,
                set_attribute_modal: false,
                add_attribute_modal: false,

                Join__Instrument_Attribute: [],
                Join__Problem_Instrument: [],
                Instrument: [],
                local_attribute_rows: [],
                global_attribute_rows: [],

                local_attribute_selected: false,
                local_attribute_selected_obj: false,

                global_attribute_selected: false,
                global_attribute_selected_obj: false,



            }
        },
        props: ['instrument_object', 'all_instrument_attributes'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            // ---> ADD ATTRIBUTE
            add_attribute(){
                console.log("---> ADDING ATTRIBUTE");
                this.add_attribute_modal = true;
            },
            close_add_attribute_modal(){
                this.add_attribute_modal = false;
                this.$apollo.queries.Instrument.refetch();
            },


            // ---> NEW ATTRIBUTE
            new_instrument_attribute(){
                this.new_attribute_modal = true;
            },
            close_new_attribute_modal(){
                this.new_attribute_modal = false;
                this.$emit("refresh-attribute-query");
                this.$apollo.queries.Instrument.refetch();
            },


            // ---> SET ATTRIBUTE VALUE
            set_attribute_value() {
                console.log("--> open set vlaue modal");
                this.set_attribute_modal = true;
            },
            close_set_attribute_modal(){
                this.set_attribute_modal = false;
                this.$apollo.queries.Instrument.refetch();
            },

            // ---> REMOVE ATTRIBUTE
            async remove_attribute(){
                console.log("---> REMOVING ATTRIBUTE", this.local_attribute_selected_obj);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteLocalInstrumentAttribute,

                    variables: {
                        instrument_attribute_join_id: this.local_attribute_selected_obj.join_id,
                    },

                    update: (cache, { data: { delete_instrument_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_instrument_attr);
                    },
                });
                console.log("---> ATTRIBUTE DEL OPS", del_orb_attribute);
                this.$apollo.queries.Instrument.refetch();
            },

            // --> DELETE ORBIT ATTRIBUTE
            async delete_instrument_attribute() {
                console.log("---> DELETING MEASUREMENT ATTRIBUTE", this.global_attribute_selected_obj);

                let del_global_attribute = await this.$apollo.mutate({
                    mutation: DeleteGlobalInstrumentAttribute,

                    variables: {
                        instrument_attribute_id: this.global_attribute_selected_obj.id,
                    },

                    update: (cache, { data: { delete_instrument_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_instrument_attr);
                    },
                });
                console.log("---> DELETING GLOBAL ATTRIBUTE", del_global_attribute);

                let del_global_attribute_child = await this.$apollo.mutate({
                    mutation: DeleteGlobalInstrumentAttributeChildren,

                    variables: {
                        instrument_attribute_id: this.global_attribute_selected_obj.id,
                    },

                    update: (cache, { data: { delete_instrument_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_instrument_attr);
                    },
                });
                console.log("---> DELETING GLOBAL ATTRIBUTE", del_global_attribute_child);




                this.$emit("refresh-attribute-query");
            },


            // LOCAL ATTRIBUTES
            select_local_attribute(index){
                let toggle = this.local_attribute_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT LOCAL");
                    this.unselect_local_attributes();
                    this.local_attribute_selected = false;
                    this.local_attribute_selected_obj = false;
                }
                else{  // SELECT
                    console.log("SELECT LOCAL");
                    this.unselect_local_attributes();
                    Vue.set(this.local_attribute_rows[index], 'selected', true);
                    this.local_attribute_selected = true;
                    this.local_attribute_selected_obj = this.local_attribute_rows[index];
                }

            },

            unselect_local_attributes(){
                console.log("---> LOCAL ATTRIBUTES UNSELECTED");
                for(let x=0;x<this.local_attribute_rows.length; x++){
                    Vue.set(this.local_attribute_rows[x], 'selected', false);
                }
            },


            // GLOBAL ATTRIBUTES
            select_global_attribute(index){
                let toggle = this.global_attribute_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT GLOBAL");
                    this.unselect_global_attributes();
                    this.global_attribute_selected = false;
                    this.global_attribute_selected_obj = false;
                }
                else{  // SELECT
                    console.log("SELECT GLOBAL", this.global_attribute_rows[index]);
                    this.unselect_global_attributes();
                    Vue.set(this.global_attribute_rows[index], 'selected', true);
                    this.global_attribute_selected = true;
                    this.global_attribute_selected_obj = this.global_attribute_rows[index];
                }

            },
            unselect_global_attributes(){
                console.log("---> GLOBAL ATTRIBUTES UNSELECTED");
                for(let x=0;x<this.global_attribute_rows.length; x++){
                    Vue.set(this.global_attribute_rows[x], 'selected', false);
                }
            },


            display_instrument_library() {
                this.$emit('display-instrument-library', {});
            }
        },
        components: {
            InstrumentAttribute,
            SetInstrumentAttribute,
        },
        apollo: {
            Instrument: {
                query: InstrumentSpecificAttributeQuery,
                variables() {
                    return {
                        instrument_id: this.instrument_object.id,
                        problem_id: this.problem_id,
                    }
                }
            },
            Join__Problem_Instrument: {
                query: ProblemInstrumentQuery,
                variables() {
                    return {
                        instrument_id: this.instrument_object.id,
                    }
                }
            },
        },
        watch: {
            Join__Problem_Instrument(){
                this.problem_id = this.Join__Problem_Instrument[0].Problem.id;
            },
            instrument_object() {
                this.instrument_id = this.instrument_object.id;
                this.instrument_name = this.instrument_object.name;
            },
            all_instrument_attributes(){
                console.log("---> GLOBAL ORBIT ATTRIBUTES", this.all_instrument_attributes);
                this.global_attribute_rows = [];
                for(let x=0;x<this.all_instrument_attributes.length;x++){
                    this.global_attribute_rows.push(_.cloneDeep(this.all_instrument_attributes[x]));
                }
            },
            Instrument(){
                this.local_attribute_rows = [];
                for(let x=0;x<this.Instrument[0].Join__Instrument_Characteristics.length;x++){
                    let row = {};

                    row.instrument_id = this.Instrument[0].id;
                    row.join_id = this.Instrument[0].Join__Instrument_Characteristics[x].id;
                    row.id = this.Instrument[0].Join__Instrument_Characteristics[x].Instrument_Attribute.id;
                    row.name = this.Instrument[0].Join__Instrument_Characteristics[x].Instrument_Attribute.name;
                    row.type = this.Instrument[0].Join__Instrument_Characteristics[x].Instrument_Attribute.type;
                    row.slot_type = this.Instrument[0].Join__Instrument_Characteristics[x].Instrument_Attribute.slot_type;

                    row.value = this.Instrument[0].Join__Instrument_Characteristics[x].value;

                    row.accepted_values = this.Instrument[0].Join__Instrument_Characteristics[x].Instrument_Attribute.Join__Instrument_Attribute_Values;
                    if(row.accepted_values.length == 0){
                        row.has_accepted = false;
                    }
                    else {
                        row.has_accepted = true;
                    }
                    row.selected = false;
                    row.hidden = false;
                    this.local_attribute_rows.push(row);
                }
                console.log("---> LOCAL ORBIT ATTRIBUTES", this.local_attribute_rows);
            }
        },
        mounted() {
            this.global_attribute_rows = [];
            this.$apollo.queries.Join__Problem_Instrument.refetch();
            this.$apollo.queries.Instrument.refetch();
            for(let x=0;x<this.all_instrument_attributes.length;x++){
                this.global_attribute_rows.push(_.cloneDeep(this.all_instrument_attributes[x]));
            }
        }
    }



</script>



<style lang="scss">

    .instruments-library-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: stretch;
        height: 80vh;
        background-color: #fff;
        border-radius: 6px;
    }


    .instrument-library-title{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: bold;
    }

    .instrument-library-instrument{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        font-size: 1.2em;
        font-weight: bold;
    }

    .instrument-library-body{
        display: flex;
        max-height: 45vh;
        overflow-y: auto;
        margin-left: 2vw;
    }






    .single-global-attribute{
        display: flex;
        padding: 2px 10px;
        cursor: pointer;
    }

    .single-local-attribute{
        display: flex;
        padding: 2px 10px;
        cursor: pointer;
        justify-content: space-between;
    }

    .single-attribute-selected{
        background-color: #606B7D;
        color: #fff;
    }




    .instrument-local-attributes{
        display: flex;
        margin-top: 1vh;
        flex-grow: 1;
        background-color: #f4f4f4;
        border-radius: 5px;
        flex-direction: column;
        overflow-y: auto;
    }

    .instrument-attribute-operations{
        display: flex;
        align-self: stretch;
        align-items: center;
        margin-top: 1vh;
        width: 8vw;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
    }

    .instrument-global-attributes{
        display: flex;
        margin-top: 1vh;
        flex-grow: 1;
        background-color: #f4f4f4;
        border-radius: 5px;
        margin-right: 2vw;
        flex-direction: column;
        overflow-y: auto;
    }


    .instrument-library-item{
        padding: 0.3em 0.75em !important;
        cursor: pointer;
    }

    .instrument-selected{
        background-color: #606B7D;
        color: #fff;
    }


</style>