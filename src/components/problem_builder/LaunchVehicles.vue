<template>
    <div class="lv-container">


        <launch-vehicle-library
                :launch_vehicle_rows="launch_vehicle_rows"
                v-on:launch-vehicle-selected="set_selected_launch_vehicle"
                v-on:display-attribute-library="display_attribute_library"
                v-on:refresh-launch-vehicle-query="refresh_launch_vehicle_query"
                v-if="!display_attribute_lib"
        >
        </launch-vehicle-library>

        <launch-vehicle-attribute-library
                :launch_vehicle_object="selected_launch_vehicle"
                :all_launch_vehicle_attributes="launch_vehicle_attribute_rows"
                v-on:display-launch-vehicle-library="display_launch_vehicle_library"
                v-on:refresh-attribute-query="refresh_attribute_query"
                v-if="display_attribute_lib"
        >
        </launch-vehicle-attribute-library>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import { LaunchVehicleQuery, LaunchVehicleAttributeQuery} from '../../scripts/launch-vehicle-queries';
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import gql from 'graphql-tag';


    import LaunchVehicleLibrary from './library/LaunchVehicleLibrary';
    import LaunchVehicleAttributeLibrary from './library/LaunchVehicleAttributeLibrary';

    export default {
        name: 'launch-vehicles',
        data: function () {
            return {
                LaunchVehicle: [],
                Launch_Vehicle_Attribute: [],

                launch_vehicle_rows: [],
                launch_vehicle_attribute_rows: [],

                selected_launch_vehicle: {},
                has_selection: false,

                display_attribute_lib: false,
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
            set_selected_launch_vehicle(launch_vehicle_selection){
                console.log("---> LV SELECT PARENT!!!!", launch_vehicle_selection);
                if(_.isEmpty(launch_vehicle_selection)){
                    this.has_selection = false;
                }
                else{
                    this.has_selection = true;
                }
                this.selected_launch_vehicle = launch_vehicle_selection;
            },
            display_attribute_library(){
                this.display_attribute_lib = true;
            },
            display_launch_vehicle_library(){
                this.display_attribute_lib = false;
            },

            refresh_launch_vehicle_query(){
                console.log("---> LV REFETCH QUERIES");
                this.$apollo.queries.Launch_Vehicle.refetch();
                this.$apollo.queries.Launch_Vehicle_Attribute.refetch();
            },

            refresh_attribute_query(){
                console.log("---> LV ATTRIBUTE REFETCH QUERIES");
                this.$apollo.queries.Launch_Vehicle_Attribute.refetch();
                this.$apollo.queries.Launch_Vehicle.refetch();
            }


        },
        components: {
            LaunchVehicleLibrary,
            LaunchVehicleAttributeLibrary
        },
        apollo: {
            Launch_Vehicle: {
                query: LaunchVehicleQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Launch_Vehicle_Attribute: {
                query: LaunchVehicleAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
        },
        async mounted() {
            this.$apollo.queries.Launch_Vehicle.refetch();
        },
        watch: {
            Launch_Vehicle() {
                this.launch_vehicle_rows = [];
                console.log("---> LaunchVehicle Query", this.Launch_Vehicle);
                for(let x=0;x<this.Launch_Vehicle.length;x++){
                    let row = _.cloneDeep(this.Launch_Vehicle[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.launch_vehicle_rows.push(row);
                }
            },
            Launch_Vehicle_Attribute() {
                this.launch_vehicle_attribute_rows = [];
                for(let x=0;x<this.Launch_Vehicle_Attribute.length;x++){
                    let row = _.cloneDeep(this.Launch_Vehicle_Attribute[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    row['has_accepted'] = (this.Launch_Vehicle_Attribute[x].Join__Launch_Vehicle_Attribute_Values.length > 0);
                    this.launch_vehicle_attribute_rows.push(row);
                }
            }
        }
    }




    // SET_LANGUAGES (state, { languages }) {
    // const ids = languages.map(x => x.id)
    // for (let id in ids) {
    //   if (!state.languageIds.includes(ids[id])) {
    //     state.languageIds.push(ids[id])
    //   }
    // }
</script>



<style lang="scss">

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