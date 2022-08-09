<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">

                <div class="modal-assign-title">Problem Assignment: {{ selected_launch_vehicle.name }}</div>

                <div class="modal-assign-body">
                    <div v-for="(problem, index_row) in problem_selections" :key="index_row" style="padding: 5px;">
                        <input type="checkbox" id="checkbox" v-model="problem.assigned">
                        <label for="checkbox">{{ problem.name }}</label>
                    </div>
                </div>

                <div class="modal-assign-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="assign_launch_vehicle()" :disabled="disable_commit">
                        Commit
                    </button>
                </div>

            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { LaunchVehicleAssignation, AssignLaunchVehicle, DeassignLaunchVehicle } from '../../../../../scripts/launch-vehicle-queries';

    export default {
        name: 'assign-launch-vehicle',
        props: ['isActive', 'selected_launch_vehicle'],
        data() {
            return {
                Problem: [],
                problem_selections: [],
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
            async assign_launch_vehicle(){
                console.log("---> ASSIGNING ORBIT");
                this.disable_cancel = true;
                this.disable_commit = true;

                // ASSIGN ORBIT FUNCTIONALITY HERE
                for(let x=0;x<this.problem_selections.length;x++){

                    if(this.problem_selections[x].assigned){ // try to add it

                        let add_assignation = await this.$apollo.mutate({
                            mutation: AssignLaunchVehicle,
                            variables: {
                                problem_id: this.problem_selections[x].id,
                                launch_vehicle_id: this.selected_launch_vehicle.id,
                            },
                            update: (cache, { data: { insert_launch_vehicle_assignation } }) => {
                                // Read the data from our cache for this query.
                                // eslint-disable-next-line
                                console.log(insert_launch_vehicle_assignation);
                            },
                        });

                        console.log("---> ASSIGNING", add_assignation);

                    }
                    else{ // try to remove it

                        let remove_assignation = await this.$apollo.mutate({
                            mutation: DeassignLaunchVehicle,
                            variables: {
                                problem_id: this.problem_selections[x].id,
                                launch_vehicle_id: this.selected_launch_vehicle.id,
                            },
                            update: (cache, { data: { insert_launch_vehicle_assignation } }) => {
                                // Read the data from our cache for this query.
                                // eslint-disable-next-line
                                console.log(insert_launch_vehicle_assignation);
                            },
                        });

                        console.log("---> ASSIGNING", remove_assignation);

                    }

                }

                this.disable_cancel = false;
                this.disable_commit = false;
                this.$emit('close-modal');
            },





        },
        apollo: {
            Problem: {
                query: LaunchVehicleAssignation,
                variables() {
                    return {
                        launch_vehicle_id: this.selected_launch_vehicle.id,
                        group_id: this.group_id,
                    }
                }
            }
        },
        watch: {
            Problem(){
                this.problem_selections = [];
                for(let x=0;x<this.Problem.length;x++){
                    let obj = {};
                    obj.id = this.Problem[x].id;
                    obj.name = this.Problem[x].name;
                    if(this.Problem[x].Join__Problem_Launch_Vehicles_aggregate.aggregate.count > 0){
                        obj.assigned = true;
                    }
                    else{
                        obj.assigned = false;
                    }
                    this.problem_selections.push(obj);
                }
                console.log("---> PROBLEM OBJECTS", this.problem_selections);
            }
        },
        mounted() {
            this.$apollo.queries.Problem.refetch();
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