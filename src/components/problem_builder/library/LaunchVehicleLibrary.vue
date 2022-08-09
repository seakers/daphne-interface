<template>
    <div class="lvs-panel">

        <!-- HEADER -->
        <div class="launch-vehicle-library-title">
            <p>Launch Vehicle Library</p>
        </div>

        <!-- LAUNCH VEHICLES -->
        <div class="launch-vehicle-library-select">
            <table class="table" style="width: 43vw; background-color: #f6f6f9;">

                <tbody>
                <tr v-for="(row, index_row) in launch_vehicle_rows" :key="index_row" v-on:click="select_launch_vehicle(index_row)">
                    <td class="launch-vehicle-library-item" v-bind:class="{ 'launch-vehicle-selected': row.selected }">{{row.name}} </td>
                </tr>
                </tbody>

            </table>
        </div>

        <!-- EDIT LAUNCH VEHICLE -->
        <div class="launch-vehicle-edit-btns">
            <button class="button is-warning" v-on:click="edit_attributes()" :disabled="!launch_vehicle_selected">
                Edit Attributes
            </button>
        </div>

        <!-- LAUNCH VEHICLE OPERATIONS -->
        <div class="launch-vehicle-operations">
            <button class="button is-primary" style="margin: 5px;" v-on:click="assign_problem()" :disabled="!launch_vehicle_selected">
                Assign Launch Vehicle
            </button>
            <button class="button is-info" style="margin: 5px;" v-on:click="clone_launch_vehicle()" :disabled="!launch_vehicle_selected">
                Clone Launch Vehicle
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_launch_vehicle()" :disabled="!launch_vehicle_selected">
                Delete Launch Vehicle
            </button>
            <button class="button is-success" style="margin: 5px;" v-on:click="new_launch_vehicle()">
                New Launch Vehicle
            </button>
        </div>

        <!-- MODALS -->
        <add-launch-vehicle :isActive="add_modal" v-on:close-modal="close_add_modal()"></add-launch-vehicle>
        <div v-if="launch_vehicle_selected">
            <clone-launch-vehicle :isActive="clone_modal" :selected_launch_vehicle="selection" v-on:close-modal="close_clone_modal()"></clone-launch-vehicle>
            <assign-launch-vehicle :isActive="assign_modal" :selected_launch_vehicle="selection" v-on:close-modal="close_assign_modal()"></assign-launch-vehicle>
        </div>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import gql from 'graphql-tag';

    import CloneLaunchVehicle from './modals/lv/CloneLaunchVehicle';
    import AssignLaunchVehicle from './modals/lv/AssignLaunchVehicle';
    import AddLaunchVehicle from './modals/lv/AddLaunchVehicle';

    import { DeleteLaunchVehicle, DeleteLaunchVehicleAttribute, DeleteLaunchVehicleAssignation } from '../../../scripts/launch-vehicle-queries';

    export default {

        name: 'launch-vehicle-library',
        data: function () {
            return {
                launch_vehicle_selected: false,
                selection: false,

                // MODALS
                clone_modal: false,
                assign_modal: false,
                add_modal: false,

            }
        },
        props: ['launch_vehicle_rows'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            select_launch_vehicle(index){
                console.log("---> LAUNCH VEHICLE SELECTED", index);
                let toggle = this.launch_vehicle_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT");
                    this.$emit('launch-vehicle-selected', {});
                    this.unselect_launch_vehicles();
                    this.launch_vehicle_selected = false;
                    this.selection = false;
                }
                else{  // SELECT
                    console.log("SELECT");
                    this.$emit('launch-vehicle-selected', this.launch_vehicle_rows[index]);
                    this.unselect_launch_vehicles();
                    Vue.set(this.launch_vehicle_rows[index], 'selected', true);
                    this.launch_vehicle_selected = true;
                    this.selection = this.launch_vehicle_rows[index];
                }
            },

            unselect_launch_vehicles(){
                console.log("---> LAUNCH VEHICLES UNSELECTED");
                for(let x=0;x<this.launch_vehicle_rows.length; x++){
                    Vue.set(this.launch_vehicle_rows[x], 'selected', false);
                }
            },

            refresh_buttons(){
                for(let x=0;x<this.launch_vehicle_rows.length; x++){
                    if(this.launch_vehicle_rows[x].selected){
                        this.launch_vehicle_selected = true;
                        return;
                    }
                }
                this.launch_vehicle_selected = false;
            },

            refresh_component(){
                for(let x=0;x<this.launch_vehicle_rows.length; x++){
                    if(this.launch_vehicle_rows[x].selected){
                        this.selection = this.launch_vehicle_rows[x];
                        this.launch_vehicle_selected = true;
                        return;
                    }
                }
                this.launch_vehicle_selected = false;
            },

            assign_problem(){
                this.assign_modal = true;
            },


            clone_launch_vehicle(){
                this.clone_modal = true;
            },
            new_launch_vehicle(){
                this.add_modal = true;
            },


            close_assign_modal(){
                this.assign_modal = false;
            },
            close_clone_modal(){
                this.clone_modal = false;
                this.$emit('refresh-launch-vehicle-query');
            },

            close_add_modal(){
                this.add_modal = false;
                this.$emit('refresh-launch-vehicle-query');
            },



            async delete_launch_vehicle(){
                console.log("---> Deleting launch_vehicle", this.selection);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteLaunchVehicleAttribute,

                    variables: {
                        launch_vehicle_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_launch_vehicle_att } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_launch_vehicle_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute);

                let del_orb_asg = await this.$apollo.mutate({
                    mutation: DeleteLaunchVehicleAssignation,

                    variables: {
                        launch_vehicle_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_launch_vehicle_asg } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_launch_vehicle_asg);
                    },
                });
                console.log("---> DEL ASG", del_orb_asg);



                let del_orb = await this.$apollo.mutate({
                    mutation: DeleteLaunchVehicle,

                    variables: {
                        launch_vehicle_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_launch_vehicle } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_launch_vehicle);
                    },
                });
                console.log("---> DEL ORB", del_orb);

                this.$emit('refresh-launch-vehicle-query');
                this.selection = false;
                this.launch_vehicle_selected = false;
            },

            // OPENS LAUNCH VEHICLE ATTRIBUTE LIBRARY
            edit_attributes(){
                this.$emit('display-attribute-library', {});
            }
        },
        components: {
            CloneLaunchVehicle,
            AssignLaunchVehicle,
            AddLaunchVehicle,
        },
        mounted() {
            console.log("---> Mounting LaunchVehicleLibrary");
            this.refresh_component();
        }

    }



</script>



<style lang="scss">

    .lvs-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: flex-start;
        height: 80vh;
        background-color: #fff;
        border-radius: 6px;
    }


    .launch-vehicle-library-title{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: bold;
    }

    .launch-vehicle-library-select{
        display: flex;
        max-height: 43vh;
        overflow-y: auto;
        margin-top: 3vh;
        margin-left: 2vw;
    }

    .launch-vehicle-edit-btns{
        display: flex;
        margin-left: 2vw;
        margin-top: 1vw;
    }

    .launch-vehicle-operations{
        display: flex;
        align-self: flex-end;
        align-items: flex-end;
        flex-grow: 1;
        margin-right: 2vw;
        margin-bottom: 3vw;
    }

    .launch-vehicle-library-item{
        padding: 0.3em 0.75em !important;
        cursor: pointer;
    }

    .launch-vehicle-selected{
        background-color: #606B7D;
        color: #fff;
    }


</style>