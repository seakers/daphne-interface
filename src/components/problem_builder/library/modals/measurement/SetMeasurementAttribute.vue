<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">Set value: {{ local_attribute.name }}</div>

                <!-- CONTINUOUS -->
                <div class="modal-clone-body" v-if="!local_attribute.has_accepted">
                    Value: <input v-model="new_name" placeholder="attribute value...">
                </div>

                <!-- DISCRETE -->
                <div class="modal-clone-body" v-if="local_attribute.has_accepted">
                    <!-- LOCAL ATTRIBUTE -->
                    <select v-model="new_name" v-if="update">
                        <option v-for="option in local_attribute.accepted_values" v-bind:value="option.Accepted_Value.value" :key="option.Accepted_Value.value">
                            {{ option.Accepted_Value.value }}
                        </option>
                    </select>
                    <!-- GLOBAL ATTRIBUTE -->
                    <select v-model="new_name" v-if="!update">
                        <option v-for="option in local_attribute.Join__Measurement_Attribute_Values" v-bind:value="option.Accepted_Value.value" :key="option.Accepted_Value.value">
                            {{ option.Accepted_Value.value }}
                        </option>
                    </select>
                </div>

                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="set_value()" :disabled="new_name === '' || disable_create == true">
                        Set
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { SetMeasurementAttributeValue, InsertMeasurementAttributeValue } from '../../../../../scripts/measurement-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'set-measurement-attribute',
        props: ['isActive', 'local_attribute', 'update', 'measurement_id', 'instrument_id'],
        data() {
            return {
                new_name: '',
                Measurement: [],
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
        watch: {
            local_attribute(){
                this.new_name = this.local_attribute.value;
            }
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },

            async set_value(){
                console.log("----> LOCAL ATTRIBUTE", this.local_attribute);

                // GLOBAL ATTRIBUTE ADDITION
                if(!this.update){ // update == false
                    let insert_orb_attribute = await this.$apollo.mutate({
                        mutation: InsertMeasurementAttributeValue,

                        variables: {
                            measurement_id: this.measurement_id,
                            group_id: this.selected_group_id,
                            measurement_attribute_id: this.local_attribute.id,
                            instrument_id: this.instrument_id,
                            value: this.new_name,
                        },

                        update: (cache, { data: { insert_measurement_attr } }) => {
                            // Read the data from our cache for this query.
                            // eslint-disable-next-line
                            console.log(insert_measurement_attr);
                        },
                    });
                    console.log("---> ATTRIBUTE ADD OPS", insert_orb_attribute);
                } // LOCAL ATTRIBUTE UPDATE
                else{
                    let update_orb_attribute = await this.$apollo.mutate({
                        mutation: SetMeasurementAttributeValue,

                        variables: {
                            measurement_attribute_id: this.local_attribute.join_id,
                            value: this.new_name,
                        },

                        update: (cache, { data: { set_measurement_attr } }) => {
                            // Read the data from our cache for this query.
                            // eslint-disable-next-line
                            console.log(set_measurement_attr);
                        },
                    });
                    console.log("---> ATTRIBUTE UPDATE OPS", update_orb_attribute);
                }





                this.$emit('close-modal');
            }

        },
        mount() {
            console.log("----> LOCAL ATTRIBUTE", this.local_attribute);
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