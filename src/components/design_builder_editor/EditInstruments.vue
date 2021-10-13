<template>

    <div style="max-height: 600px; overflow-y: auto; overflow-x: hidden">
        <div class="columns is-multiline">
            <div v-for="(row, idx) in instrument_list" :key="idx">
                <div class="card" style="margin: 5px">
                    <div class="card-content" style="padding: 1rem;">
                        <div>{{row.name}}</div>
                    </div>
                    <div class="card-footer">
                        <div class="card-footer-item" style="background-color: #FF7F7F; padding: 0.5rem;" v-if="row.is_assigned">
                            <span><a v-on:click.prevent="remove_instrument(idx, row)" style="text-decoration: none">Remove</a></span>
                        </div>

                        <div class="card-footer-item" style="background-color: #7FFFBF; padding: 0.5rem;" v-if="!row.is_assigned">
                            <span><a v-on:click.prevent="assign_instrument(idx, row)" style="text-decoration: none">Assign</a></span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {mapState} from "vuex";
    import {InstrumentFilterQuery, InstrumentByName} from "../../scripts/instrument-queries";

    export default {
        name: "edit-instruments",
        data() {
            return {
                all_instruments: [
                    'ACE_CPR', 'ACE_ORCA', 'ACE_POL', 'ACE_LID',
                    'DESD_SAR', 'DESD_LID',
                    'GACM_SWIR', 'GACM_VIS',
                    'CLAR_ERB', 'HYSP_TIR', 'CNES_KaRIN', 'POSTEPS_IRS'
                ],
                instrument_list: [],

                // --> QUERY OBJECTS
                Instrument_Filter: [],
                Instrument: [],

                changes: false,
            }
        },
        computed: {
            ...mapState({
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
            }),
        },
        components: {
        },
        methods: {
            update_instrument_list() {
                let computed_list = [];
                for(let x = 0; x < this.Instrument.length; x++){
                    let obj = {};
                    obj.name = this.Instrument[x].name;
                    obj.id = this.Instrument[x].id;
                    obj.is_assigned = this.check_assignation(obj.name);
                    obj.initial_val = this.check_assignation(obj.name);
                    computed_list.push(obj);
                }
                this.instrument_list = computed_list;
            },
            check_assignation(instrument){
                for(let x = 0; x < this.Instrument_Filter.length; x++){
                    if(this.Instrument_Filter[x].name === instrument){
                        return true;
                    }
                }
                return false;
            },
            reload_module(){
                this.$apollo.queries.Instrument_Filter.refetch();
                this.update_instrument_list();
            },
            assign_instrument(idx, obj){
                console.log('--> ASSIGNING INSTRUMENT', idx);
                obj.is_assigned = true;
            },
            remove_instrument(idx, obj){
                console.log('--> REMOVING INSTRUMENT', idx);
                obj.is_assigned = false;
            },
            items_to_add(){
                let to_add = [];
                for(let x = 0; x < this.instrument_list.length; x++){
                    if(this.instrument_list[x].initial_val === false && this.instrument_list[x].is_assigned === true){
                        to_add.push(this.instrument_list[x]);
                        this.changes = true;
                    }
                }
                console.log("--> INSTRUMENTS TO ADD", to_add);
                return to_add;
            },
            items_to_remove(){
                let to_remove = [];
                for(let x = 0; x < this.instrument_list.length; x++){
                    if(this.instrument_list[x].initial_val === true && this.instrument_list[x].is_assigned === false){
                        to_remove.push(this.instrument_list[x]);
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
            Instrument_Filter() {
                this.update_instrument_list()
            }
        },
        apollo: {
            Instrument_Filter: {
                query: InstrumentFilterQuery,
                variables() {
                    return {
                        selected_group_id: this.groupId,
                        filter_problem_id: this.problemId,
                    }
                }
            },
            Instrument: {
                query: InstrumentByName,
                variables() {
                    return {
                        selected_group_id: this.groupId,
                        inst_names: this.all_instruments,
                    }
                }
            }

        },
    }
</script>

<style scoped>

</style>