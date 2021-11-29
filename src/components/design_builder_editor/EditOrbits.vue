<template>

        <div style="max-height: 500px; overflow-y: scroll; overflow-x: hidden">
            <div class="columns is-multiline">
                <div v-for="(row, idx) in orbit_list" :key="idx">
                    <div class="card" style="margin: 5px">
                        <div class="card-content"  style="padding: 1rem;">
                            <div>{{row.name}}</div>
                        </div>
                        <div class="card-footer">
                            <div class="card-footer-item" style="background-color: #FF7F7F; padding: 0.5rem;" v-if="row.is_assigned">
                                <span><a v-on:click.prevent="remove_orbit(idx, row)" style="text-decoration: none">Remove</a></span>
                            </div>

                            <div class="card-footer-item" style="background-color: #7FFFBF; padding: 0.5rem;" v-if="!row.is_assigned">
                                <span><a v-on:click.prevent="assign_orbit(idx, row)" style="text-decoration: none">Assign</a></span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

</template>

<script>
    import {mapState} from "vuex";
    import {OrbitFilterQuery, OrbitByName} from "../../scripts/orbit-queries";
    import {InstrumentByName} from "../../scripts/instrument-queries";

    export default {
        name: "edit-orbits",
        data() {
            return {
                all_orbits: [
                    'GEO-36000-equat-NA', 'LEO-275-polar-NA', 'LEO-400-polar-NA', 'LEO-600-polar-NA',
                    'LEO-800-polar-NA', 'SSO-400-SSO-DD', 'SSO-400-SSO-AM', 'SSO-400-SSO-noon',
                    'SSO-400-SSO-PM', 'SSO-600-SSO-DD', 'SSO-600-SSO-AM', 'SSO-600-SSO-noon',
                    'SSO-600-SSO-PM', 'SSO-800-SSO-DD', 'SSO-800-SSO-AM', 'SSO-800-SSO-noon',
                    'SSO-800-SSO-PM', 'LEO-275-equat-NA', 'SSO-1000-SSO-AM', 'LEO-600-equat-NA'
                ],
                orbit_list: [],

                // --> QUERY OBJECTS
                Orbit_Filter: [],
                Orbit: [],

                changes: false,
            }
        },
        computed: {
            ...mapState({
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
            })
        },
        components: {
        },
        methods: {
            update_orbit_list() {
                console.log(this.Orbit_Filter);
                let computed_list = [];
                for(let x = 0; x < this.Orbit.length; x++){
                    let obj = {};
                    obj.name = this.Orbit[x].name;
                    obj.id = this.Orbit[x].id;
                    obj.is_assigned = this.check_assignation(obj.name);
                    obj.initial_val = this.check_assignation(obj.name);
                    computed_list.push(obj);
                }
                this.orbit_list = computed_list;
            },
            check_assignation(instrument){
                for(let x = 0; x < this.Orbit_Filter.length; x++){
                    if(this.Orbit_Filter[x].name === instrument){
                        return true;
                    }
                }
                return false;
            },
            reload_module(){
                this.$apollo.queries.Orbit_Filter.refetch();
                this.update_orbit_list();
            },
            assign_orbit(idx, obj){
                console.log('--> ASSIGNING ORBIT', idx);
                obj.is_assigned = true;
            },
            remove_orbit(idx, obj){
                console.log('--> REMOVING ORBIT', idx);
                obj.is_assigned = false;
            },
            items_to_add(){
                let to_add = [];
                for(let x = 0; x < this.orbit_list.length; x++){
                    if(this.orbit_list[x].initial_val === false && this.orbit_list[x].is_assigned === true){
                        to_add.push(this.orbit_list[x]);
                        this.changes = true;
                    }
                }
                console.log("--> INSTRUMENTS TO ADD", to_add);
                return to_add;
            },
            items_to_remove(){
                let to_remove = [];
                for(let x = 0; x < this.orbit_list.length; x++){
                    if(this.orbit_list[x].initial_val === true && this.orbit_list[x].is_assigned === false){
                        to_remove.push(this.orbit_list[x]);
                        this.changes = true;
                    }
                }
                console.log("--> INSTRUMENTS TO REMOVE", to_remove);
                return to_remove;
            },
            commit_changes(){
                // 1. Determine which instruments need to be added / removed from problem definition
                let to_add = this.items_to_add();
                let to_remove = this.items_to_remove();
                let obj = {};
                obj.to_add = to_add;
                obj.to_remove = to_remove;
                return obj;

                // 2. Create a new dataset for the commit
                // - Copy all architectures to new dataset
                // - If adding instrument: change bit-string of each arch to reflect added inst, no re-evaluation needed
                // - If removing instrument: change bit-string, re-evaluate archs as needed

                // 3. Reload problem after new dataset created, load problem again with new dataset
                // - if needed re-evaluate archs at this stage
            },
        },
        watch: {
            Orbit_Filter() {
                this.update_orbit_list()
            }
        },
        apollo: {
            Orbit_Filter: {
                query: OrbitFilterQuery,
                variables() {
                    return {
                        selected_group_id: this.groupId,
                        filter_problem_id: this.problemId,
                    }
                },
                skip(){
                    if(this.groupId === null){
                        return true;
                    }
                    return false;
                }
            },
            Orbit: {
                query: OrbitByName,
                variables() {
                    return {
                        selected_group_id: this.groupId,
                        orb_names: this.all_orbits,
                    }
                },
                skip(){
                    if(this.groupId === null){
                        return true;
                    }
                    return false;
                }
            }

        },
    }
</script>

<style scoped>

</style>