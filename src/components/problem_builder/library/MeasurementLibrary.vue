<template>
    <div class="measurements-panel">

        <!-- HEADER -->
        <div class="measurement-library-title">
            <p>Measurement Library</p>
        </div>

        <!-- ORBITS -->
        <div class="measurement-library-select">
            <table class="table" style="width: 43vw; background-color: #f6f6f9;">

                <tbody>
                <tr v-for="(row, index_row) in measurement_rows" :key="index_row" v-on:click="select_measurement(index_row)">
                    <td class="measurement-library-item" v-bind:class="{ 'measurement-selected': row.selected }">{{row.name}} </td>
                </tr>
                </tbody>

            </table>
        </div>

        <!-- EDIT ORBIT -->
        <div class="measurement-edit-btns">
            <button class="button is-warning" v-on:click="edit_attributes()" :disabled="!measurement_selected">
                Edit Attributes
            </button>
        </div>

        <!-- ORBIT OPERATIONS -->
        <div class="measurement-operations">
<!--            <button class="button is-info" style="margin: 5px;" v-on:click="clone_measurement()" :disabled="!measurement_selected">-->
<!--                Clone Measurement-->
<!--            </button>-->
            <button class="button is-info" style="margin: 5px;" v-on:click="assign_measurement()" :disabled="!measurement_selected">
                Assign to Instrument
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_measurement()" :disabled="!measurement_selected">
                Delete Measurement
            </button>
            <button class="button is-success" style="margin: 5px;" v-on:click="new_measurement()">
                New Measurement
            </button>
        </div>

        <!-- MODALS -->
        <add-measurement :isActive="add_modal" v-on:close-modal="close_add_modal()"></add-measurement>
        <div v-if="measurement_selected">
            <assign-measurement :isActive="assign_modal" :selected_measurement="selection" v-on:close-modal="close_assign_measurement()"></assign-measurement>
        </div>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import Vue from 'vue';

    import AssignMeasurement from './modals/measurement/AssignMeasurement';
    import AddMeasurement from './modals/measurement/AddMeasurement';

    import { DeleteMeasurement, DeleteMeasurementAttribute, DeleteMeasurementAssignation } from '../../../scripts/measurement-queries';

    export default {

        name: 'measurement-library',
        data: function () {
            return {

                measurement_selected: false,
                selection: false,

                // MODALS
                clone_modal: false,
                assign_modal: false,
                add_modal: false,

            }
        },
        props: ['measurement_rows'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            assign_measurement(){
                this.assign_modal = true;
            },
            close_assign_measurement(){
                this.assign_modal = false;
            },

            select_measurement(index){
                console.log("---> ORBIT SELECTED", index);
                let toggle = this.measurement_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT");
                    this.$emit('measurement-selected', {});
                    this.unselect_measurements();
                    this.measurement_selected = false;
                    this.selection = false;
                }
                else{  // SELECT
                    console.log("SELECT");
                    this.$emit('measurement-selected', this.measurement_rows[index]);
                    this.unselect_measurements();
                    Vue.set(this.measurement_rows[index], 'selected', true);
                    this.measurement_selected = true;
                    this.selection = this.measurement_rows[index];
                }
            },

            unselect_measurements(){
                console.log("---> ORBITS UNSELECTED");
                for(let x=0;x<this.measurement_rows.length; x++){
                    Vue.set(this.measurement_rows[x], 'selected', false);
                }
            },

            refresh_buttons(){
                for(let x=0;x<this.measurement_rows.length; x++){
                    if(this.measurement_rows[x].selected){
                        this.measurement_selected = true;
                        return;
                    }
                }
                this.measurement_selected = false;
            },

            refresh_component(){
                for(let x=0;x<this.measurement_rows.length; x++){
                    if(this.measurement_rows[x].selected){
                        this.selection = this.measurement_rows[x];
                        this.measurement_selected = true;
                        return;
                    }
                }
                this.measurement_selected = false;
            },

            assign_problem(){
                // this.assign_modal = true;
            },


            clone_measurement(){
                this.clone_modal = true;
            },
            new_measurement(){
                this.add_modal = true;
            },


            close_assign_modal(){
                this.assign_modal = false;
            },
            close_clone_modal(){
                this.clone_modal = false;
                this.$emit('refresh-measurement-query');
            },

            close_add_modal(){
                this.add_modal = false;
                this.$emit('refresh-measurement-query');
            },



            async delete_measurement(){
                console.log("---> Deleting measurement", this.selection);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteMeasurementAttribute,

                    variables: {
                        measurement_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_measurement_att } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_measurement_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute);

                let del_orb_asg = await this.$apollo.mutate({
                    mutation: DeleteMeasurementAssignation,

                    variables: {
                        measurement_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_measurement_asg } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_measurement_asg);
                    },
                });
                console.log("---> DEL ASG", del_orb_asg);



                let del_orb = await this.$apollo.mutate({
                    mutation: DeleteMeasurement,

                    variables: {
                        measurement_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_measurement } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_measurement);
                    },
                });
                console.log("---> DEL ORB", del_orb);

                this.$emit('refresh-measurement-query');
                this.selection = false;
                this.measurement_selected = false;
            },

            // OPENS ORBIT ATTRIBUTE LIBRARY
            edit_attributes(){
                this.$emit('display-attribute-library', {});
            }
        },
        components: {
            AddMeasurement,
            AssignMeasurement,
        },
        mounted() {
            console.log("---> Mounting MeasurementLibrary");
            this.refresh_component();
        }

    }



</script>



<style lang="scss">

    .measurements-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: flex-start;
        height: 80vh;
        background-color: #fff;
        border-radius: 6px;
    }


    .measurement-library-title{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: bold;
    }

    .measurement-library-select{
        display: flex;
        max-height: 43vh;
        overflow-y: auto;
        margin-top: 3vh;
        margin-left: 2vw;
    }

    .measurement-edit-btns{
        display: flex;
        margin-left: 2vw;
        margin-top: 1vw;
    }

    .measurement-operations{
        display: flex;
        align-self: flex-end;
        align-items: flex-end;
        flex-grow: 1;
        margin-right: 2vw;
        margin-bottom: 3vw;
    }

    .measurement-library-item{
        padding: 0.3em 0.75em !important;
        cursor: pointer;
    }

    .measurement-selected{
        background-color: #606B7D;
        color: #fff;
    }


</style>