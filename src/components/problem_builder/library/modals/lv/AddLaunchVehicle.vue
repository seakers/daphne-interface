<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">{{ new_name }}</div>

                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new launch_vehicle name...">
                </div>

                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="add_launch_vehicle()" :disabled="new_name === '' || disable_create == true">
                        Create
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { AddLaunchVehicle } from '../../../../../scripts/launch-vehicle-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'add-launch-vehicle',
        props: ['isActive'],
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


        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },

            async add_launch_vehicle() {
                this.disable_create = true;
                this.disable_cancel = true;

                let create_launch_vehicle = await this.$apollo.mutate({
                    mutation: AddLaunchVehicle,

                    variables: {
                        group_id: this.selected_group_id,
                        name: this.new_name,
                    },

                    update: (cache, { data: { create_launch_vehicle } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(create_launch_vehicle);
                    },
                });

                console.log("---> NEW ORBIT", create_launch_vehicle);

                this.disable_create = false;
                this.disable_cancel = false;
                this.$emit('close-modal');
            }
        },



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