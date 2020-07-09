<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">Clone: {{ selected_launch_vehicle.name }}</div>

                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new launch_vehicle name...">
                </div>

                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="create_clone()" :disabled="new_name === '' || disable_create == true">
                        Create
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { CloneLaunchVehicle, CloneLaunchVehicleAttribute, LaunchVehicleSpecificAttributeQuery } from '../../../../../scripts/launch-vehicle-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'clone-launch-vehicle',
        props: ['isActive', 'selected_launch_vehicle'],
        data() {
            return {
                new_name: '',
                Launch_Vehicle: [],
                clone_attributes: [],
                disable_cancel: false,
                disable_create: false,

            }
        },
        computed: {
            ...mapGetters({
                selected_group_id: 'get_group_id',
            }),
        },
        components: {
        },
        apollo: {
            Launch_Vehicle: {
                query: LaunchVehicleSpecificAttributeQuery,
                variables() {
                    return {
                        launch_vehicle_id: this.selected_launch_vehicle.id
                    }
                }
            },
        },
        watch: {
            Launch_Vehicle() {
                this.clone_attributes = [];
                for(let x=0;x<this.Launch_Vehicle[0].Join__Launch_Vehicle_Attributes.length;x++){
                    let clone_atr = this.Launch_Vehicle[0].Join__Launch_Vehicle_Attributes[x];
                    let obj = {};
                    obj.attribute_id = clone_atr.launch_vehicle_attribute_id;
                    obj.launch_vehicle_id = clone_atr.launch_vehicle_id; // cloning everything except launch_vehicle_id
                    obj.group_id = clone_atr.group_id;
                    obj.value = clone_atr.value;
                    this.clone_attributes.push(obj);
                }
                console.log("---> CLONE ATTRIBUTES: ", this.clone_attributes);
            }
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },
            async create_clone(){
                this.disable_cancel = true;
                this.disable_create = true;


                console.log("---> CLONING ITEM", this.selected_launch_vehicle);
                console.log("---> NAME", this.new_name);
                let to_copy_id = this.selected_launch_vehicle.id;

                await this.cloneLaunch_Vehicle();


                this.disable_cancel = false;
                this.disable_create = false;
                this.$emit('close-modal');
            },


            // MUTATION
            async cloneLaunch_Vehicle() {
                // insert new todo into db

                const name = this.new_name
                const selected_launch_vehicle_id = this.selected_launch_vehicle.id
                const selected_group_id = this.selected_group_id

                const new_orb = await this.$apollo.mutate({
                    mutation: CloneLaunchVehicle,

                    variables: {
                        group_id: selected_group_id,
                        new_name: name
                    },

                    update: (cache, { data: { insert_launch_vehicle } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(insert_launch_vehicle);
                    },
                });

                const new_launch_vehicle_id = new_orb.data.insert_Launch_Vehicle_one.id;

                console.log("---- CLONING LAUNCH VEHICLE", new_orb);
                console.log("---- NEW LAUNCH VEHICLE ID", new_launch_vehicle_id);

                for (let x=0;x<this.clone_attributes.length;x++){
                    let clone_atr = this.clone_attributes[x];
                    let new_orb_attribute = await this.$apollo.mutate({
                        mutation: CloneLaunchVehicleAttribute,
                        variables: {
                            group_id: clone_atr.group_id,
                            launch_vehicle_attribute_id: clone_atr.attribute_id,
                            launch_vehicle_id: new_launch_vehicle_id,
                            value: clone_atr.value
                        },
                        update: (cache, { data: { insert_launch_vehicle_attribute } }) => {
                            // Read the data from our cache for this query.
                            // eslint-disable-next-line
                            console.log(insert_launch_vehicle_attribute);
                        },
                    });
                    console.log("---> CLONED ATTRIBUTE", new_orb_attribute);
                }

            },


        }
    }
</script>

<style lang="scss">

    .modal-clone-title{
        display: flex;
        padding: 5px 15px;
        font-size: 1.2em;
        font-weight: bold;
    }

    .modal-clone-body{
        display: flex;
        padding: 5px 15px;
    }

    .modal-clone-actions{
        display: flex;
        padding: 5px 10px;
    }

</style>