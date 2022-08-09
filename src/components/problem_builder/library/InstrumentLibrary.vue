<template>
    <div class="instruments-panel">

        <!-- HEADER -->
        <div class="instrument-library-title">
            <p>Instrument Library</p>
        </div>

        <!-- ORBITS -->
        <div class="instrument-library-select">
            <table class="table" style="width: 43vw; background-color: #f6f6f9;">

                <tbody>
                <tr v-for="(row, index_row) in instrument_rows" :key="index_row" v-on:click="select_instrument(index_row)">
                    <td class="instrument-library-item" v-bind:class="{ 'instrument-selected': row.selected }">{{row.name}} </td>
                </tr>
                </tbody>

            </table>
        </div>

        <!-- EDIT ORBIT -->
        <div class="instrument-edit-btns">
            <button class="button is-warning" v-on:click="edit_attributes()" :disabled="!instrument_selected">
                Edit Attributes
            </button>
        </div>

        <!-- ORBIT OPERATIONS -->
        <div class="instrument-operations">
            <button class="button is-primary" style="margin: 5px;" v-on:click="assign_problem()" :disabled="!instrument_selected">
                Assign Problem
            </button>
            <button class="button is-info" style="margin: 5px;" v-on:click="clone_instrument()" :disabled="!instrument_selected">
                Clone Instrument
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_instrument()" :disabled="!instrument_selected">
                Delete Instrument
            </button>
            <button class="button is-success" style="margin: 5px;" v-on:click="new_instrument()">
                New Instrument
            </button>
        </div>

        <!-- MODALS -->
        <add-instrument :isActive="add_modal" v-on:close-modal="close_add_modal()"></add-instrument>
        <div v-if="instrument_selected">
            <clone-instrument :isActive="clone_modal" :selected_instrument="selection" v-on:close-modal="close_clone_modal()"></clone-instrument>
            <assign-instrument :isActive="assign_modal" :selected_instrument="selection" v-on:close-modal="close_assign_modal()"></assign-instrument>
        </div>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import Vue from 'vue';

    import CloneInstrument from './modals/instrument/CloneInstrument';
    import AssignInstrument from './modals/instrument/AssignInstrument';
    import AddInstrument from './modals/instrument/AddInstrument';

    import { DeleteInstrument, DeleteInstrumentAttribute, DeleteInstrumentAssignation, DeleteInstrumentMeasurementValues, DeleteInstrumentMeasurement } from '../../../scripts/instrument-queries';

    export default {

        name: 'instrument-library',
        data: function () {
            return {
                instrument_selected: false,
                selection: false,

                // MODALS
                clone_modal: false,
                assign_modal: false,
                add_modal: false,

            }
        },
        props: ['instrument_rows'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            select_instrument(index){
                console.log("---> ORBIT SELECTED", index);
                let toggle = this.instrument_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT");
                    this.$emit('instrument-selected', {});
                    this.unselect_instruments();
                    this.instrument_selected = false;
                    this.selection = false;
                }
                else{  // SELECT
                    console.log("SELECT");
                    this.$emit('instrument-selected', this.instrument_rows[index]);
                    this.unselect_instruments();
                    Vue.set(this.instrument_rows[index], 'selected', true);
                    this.instrument_selected = true;
                    this.selection = this.instrument_rows[index];
                }
            },

            unselect_instruments(){
                console.log("---> ORBITS UNSELECTED");
                for(let x=0;x<this.instrument_rows.length; x++){
                    Vue.set(this.instrument_rows[x], 'selected', false);
                }
            },

            refresh_buttons(){
                for(let x=0;x<this.instrument_rows.length; x++){
                    if(this.instrument_rows[x].selected){
                        this.instrument_selected = true;
                        return;
                    }
                }
                this.instrument_selected = false;
            },

            refresh_component(){
                for(let x=0;x<this.instrument_rows.length; x++){
                    if(this.instrument_rows[x].selected){
                        this.selection = this.instrument_rows[x];
                        this.instrument_selected = true;
                        return;
                    }
                }
                this.instrument_selected = false;
            },

            assign_problem(){
                this.assign_modal = true;
            },


            clone_instrument(){
                this.clone_modal = true;
            },
            new_instrument(){
                this.add_modal = true;
            },


            close_assign_modal(){
                this.assign_modal = false;
            },
            close_clone_modal(){
                this.clone_modal = false;
                this.$emit('refresh-instrument-query');
            },

            close_add_modal(){
                this.add_modal = false;
                this.$emit('refresh-instrument-query');
            },



            async delete_instrument(){
                console.log("---> Deleting instrument", this.selection);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteInstrumentAttribute,
                    variables: {instrument_id: this.selection.id},
                    update: (cache, { data: { delete_instrument_att } }) => {
                        console.log(delete_instrument_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute);

                let del_orb_attribute2 = await this.$apollo.mutate({
                    mutation: DeleteInstrumentMeasurement,
                    variables: {instrument_id: this.selection.id},
                    update: (cache, { data: { delete_instrument_att } }) => {
                        console.log(delete_instrument_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute2);

                let del_orb_attribute3 = await this.$apollo.mutate({
                    mutation: DeleteInstrumentMeasurementValues,
                    variables: {instrument_id: this.selection.id},
                    update: (cache, { data: { delete_instrument_att } }) => {
                        console.log(delete_instrument_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute3);

                let del_orb_asg = await this.$apollo.mutate({
                    mutation: DeleteInstrumentAssignation,
                    variables: {instrument_id: this.selection.id},
                    update: (cache, { data: { delete_instrument_asg } }) => {
                        console.log(delete_instrument_asg);
                    },
                });
                console.log("---> DEL ASG", del_orb_asg);

                let del_orb = await this.$apollo.mutate({
                    mutation: DeleteInstrument,
                    variables: {instrument_id: this.selection.id},
                    update: (cache, { data: { delete_instrument } }) => {
                        console.log(delete_instrument);
                    },
                });
                console.log("---> DEL ORB", del_orb);

                this.$emit('refresh-instrument-query');
                this.selection = false;
                this.instrument_selected = false;
            },

            // OPENS ORBIT ATTRIBUTE LIBRARY
            edit_attributes(){
                this.$emit('display-attribute-library', {});
            }
        },
        components: {
            CloneInstrument,
            AssignInstrument,
            AddInstrument,
        },
        mounted() {
            console.log("---> Mounting InstrumentLibrary");
            this.refresh_component();
        }

    }



</script>



<style lang="scss">

    .instruments-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: flex-start;
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

    .instrument-library-select{
        display: flex;
        max-height: 43vh;
        overflow-y: auto;
        margin-top: 3vh;
        margin-left: 2vw;
    }

    .instrument-edit-btns{
        display: flex;
        margin-left: 2vw;
        margin-top: 1vw;
    }

    .instrument-operations{
        display: flex;
        align-self: flex-end;
        align-items: flex-end;
        flex-grow: 1;
        margin-right: 2vw;
        margin-bottom: 3vw;
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