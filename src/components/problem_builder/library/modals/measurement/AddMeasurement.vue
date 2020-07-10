<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">{{ new_name }}</div>

                <div class="modal-clone-body">

                    <div>Measurement Name</div>
                    <input v-model="new_name" placeholder="new measurement name...">

                    <div>Assign to Instrument</div>
                    <select v-model="instrument_id">
                        <option v-for="option in Instrument" v-bind:value="option.id" :key="option.id">
                            {{ option.name }}
                        </option>
                    </select>

                    <div>Assign to Problem</div>
                    <select v-model="problem_id">
                        <option v-for="option in Join__Problem_Instrument" v-bind:value="option.Problem.id" :key="option.Problem.name">
                            {{ option.Problem.name }}
                        </option>
                    </select>
                </div>

                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="add_measurement()" :disabled="new_name === '' || disable_create == true">
                        Create
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { AddMeasurement, GlobalInstruments, InstrumentQueryProblem, InsertMeasurement } from '../../../../../scripts/measurement-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'add-measurement',
        props: ['isActive'],
        data() {
            return {
                problem_id: 1,
                instrument_id: 1,

                new_name: '',
                Measurement: [],
                clone_attributes: [],
                disable_cancel: false,
                disable_create: false,
                Instrument: [],
                Join__Problem_Instrument: [],


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
            Instrument: {
                query: GlobalInstruments,
                variables() {
                    return {
                        group_id: this.selected_group_id,
                    }
                }
            },
            Join__Problem_Instrument: {
                query: InstrumentQueryProblem,
                variables() {
                    return {
                        instrument_id: this.instrument_id,
                    }
                }
            },
        },
        watch: {
            Instrument(){
                // this.instrument_id = this.Instrument.id
            },
            Join__Problem_Instrument(){
                console.log("=---> ", this.Join__Problem_Instrument);
                this.problem_id = this.Join__Problem_Instrument[0].Problem.id;
            }
        },


        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },

            async add_measurement() {
                this.disable_create = true;
                this.disable_cancel = true;

                let create_measurement = await this.$apollo.mutate({
                    mutation: AddMeasurement,

                    variables: {
                        group_id: this.selected_group_id,
                        name: this.new_name,
                    },

                    update: (cache, { data: { create_measurement } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(create_measurement);
                    },
                });

                const new_measurement_id = create_measurement.data.insert_Measurement_one.id;
                console.log("---> NEW MEASUREMENT ID", new_measurement_id);


                let insert_measurement = await this.$apollo.mutate({
                    mutation: InsertMeasurement,

                    variables: {
                        instrument_id: this.instrument_id,
                        measurement_id: new_measurement_id,
                        problem_id: this.problem_id,
                    },

                    update: (cache, { data: { insert_measurement } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(insert_measurement);
                    },
                });





                console.log("---> NEW MEASUREMENT", insert_measurement);

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
        flex-direction: column;
    }

    .modal-clone-actions{
        display: flex;
        padding: 5px 10px;
    }

</style>