<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">

                <div class="modal-assign-title">Instrument Assignment: {{ selected_measurement.name }}</div>

                <div class="modal-assign-body">
                    <div>Problem</div>
                    <select v-model="problem_id">
                        <option v-for="option in Problem" v-bind:value="option.id" :key="option.id">
                            {{ option.name }}
                        </option>
                    </select>

                    <div v-for="(problem, index_row) in instrument_selections" :key="index_row" style="padding: 5px;">
                        <input type="checkbox" id="checkbox" v-model="problem.assigned">
                        <label for="checkbox">{{ problem.name }}</label>
                    </div>
                </div>

                <div class="modal-assign-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="assign_measurement()" :disabled="disable_commit">
                        Commit
                    </button>
                </div>

            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>

    // MEASUREMENTS ARE NOT ASSIGNED TO PROBLEMS!!!!

    import { mapState, mapGetters } from 'vuex';
    import { MeasurementAssignation, AssignMeasurement, DeassignMeasurement, DeassignMeasurementAttribute, GroupProblems } from '../../../../../scripts/measurement-queries';

    export default {
        name: 'assign-measurement',
        props: ['isActive', 'selected_measurement'],
        data() {
            return {
                Instrument: [],
                Problem: [],
                problem_id: 0,
                instrument_selections: [],
                disable_cancel: false,
                disable_commit: false,
            }
        },
        computed: {
            ...mapGetters({
                group_id: 'groups__group_selection',
            }),
        },
        components: {
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },
            async assign_measurement(){
                console.log("---> ASSIGNING MEASUREMENT");
                this.disable_cancel = true;
                this.disable_commit = true;

                // ASSIGN MEASUREMENT FUNCTIONALITY HERE
                for(let x=0;x<this.instrument_selections.length;x++){

                    // Only perform mutation if state has changed
                    if(this.instrument_selections[x].original_val != this.instrument_selections[x].assigned){
                        console.log("---> STATE HAS CHANGED");
                        if(this.instrument_selections[x].assigned){ // try to add it

                            let add_assignation = await this.$apollo.mutate({
                                mutation: AssignMeasurement,
                                variables: {
                                    instrument_id: this.instrument_selections[x].id,
                                    measurement_id: this.selected_measurement.id,
                                    problem_id: this.problem_id,
                                },
                                update: (cache, { data: { insert_measurement_assignation } }) => {
                                    // Read the data from our cache for this query.
                                    // eslint-disable-next-line
                                    console.log(insert_measurement_assignation);
                                },
                            });

                            console.log("---> ASSIGNING", add_assignation);

                        }
                        else{ // try to remove it

                            let remove_assignation = await this.$apollo.mutate({
                                mutation: DeassignMeasurement,
                                variables: {
                                    instrument_id: this.instrument_selections[x].id,
                                    measurement_id: this.selected_measurement.id,
                                    problem_id: this.problem_id,
                                },
                                update: (cache, { data: { insert_measurement_assignation } }) => {
                                    // Read the data from our cache for this query.
                                    // eslint-disable-next-line
                                    console.log(insert_measurement_assignation);
                                },
                            });
                            console.log("---> REMOVE MEAS INST JOIN TABLE", remove_assignation);

                            let remove_assignation2 = await this.$apollo.mutate({
                                mutation: DeassignMeasurementAttribute,
                                variables: {
                                    instrument_id: this.instrument_selections[x].id,
                                    measurement_id: this.selected_measurement.id,
                                },
                                update: (cache, { data: { insert_measurement_assignation } }) => {
                                    // Read the data from our cache for this query.
                                    // eslint-disable-next-line
                                    console.log(insert_measurement_assignation);
                                },
                            });
                            console.log("---> REMOVE MEAS ATTR VALUE JOIN TABLE ON INST ID AND MEAS ID", remove_assignation2);

                        }
                    }
                    else{
                        console.log("---> no state change", this.instrument_selections[x].name);
                    }
                }

                this.disable_cancel = false;
                this.disable_commit = false;
                this.instrument_selections = [];
                this.Problem = [];
                this.Instrument = [];
                this.$apollo.queries.Instrument.refetch();
                this.$apollo.queries.Problem.refetch();
                this.$emit('close-modal');
            },
        },
        apollo: {
            Instrument: {
                query: MeasurementAssignation,
                variables() {
                    return {
                        measurement_id: this.selected_measurement.id,
                        group_id: this.group_id,
                        problem_id: this.problem_id,
                    }
                }
            },
            Problem: {
                query: GroupProblems,
                variables() {
                    return {
                        group_id: this.group_id,
                    }
                }
            },
        },
        watch: {
            Problem(){
                // this.problem_id = this.Problem[0].id;
            },
            Instrument(){
                this.instrument_selections = [];
                for(let x=0;x<this.Instrument.length;x++){
                    let obj = {};
                    obj.id = this.Instrument[x].id;
                    obj.name = this.Instrument[x].name;
                    if(this.Instrument[x].Join__Instrument_Measurements_aggregate.aggregate.count > 0){
                        obj.assigned = true;
                        obj.original_val = true;
                    }
                    else{
                        obj.assigned = false;
                        obj.original_val = false;
                    }
                    this.instrument_selections.push(obj);
                }
                console.log("---> PROBLEM OBJECTS", this.instrument_selections);
            }
        },
        mounted() {
            this.$apollo.queries.Instrument.refetch();
        }
    }
</script>

<style lang="scss">

    .modal-assign-title{
        display: flex;
        padding: 5px 15px;
        font-size: 1.2em;
        font-weight: bold;
    }

    .modal-assign-body{
        display: flex;
        padding: 5px 15px;
        flex-wrap: wrap;
        flex-direction: column;
    }

    .modal-assign-actions{
        display: flex;
        padding: 5px 10px;
    }

</style>