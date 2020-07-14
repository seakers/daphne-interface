<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">

                <div class="modal-assign-title">Problem Assignment: {{ selected_instrument.name }}</div>

                <div class="modal-assign-body">
                    <div v-for="(problem, index_row) in problem_selections" :key="index_row" style="padding: 5px;">
                        <input type="checkbox" id="checkbox" v-model="problem.assigned">
                        <label for="checkbox">{{ problem.name }}</label>
                    </div>
                </div>

                <div class="modal-assign-body" style="margin-top: 5px;">
                    <div style="padding: 5px;">
                        <input type="checkbox" id="checkbox2" v-model="modify_arch_inputs">
                        <label for="checkbox">Modify designs</label>
                    </div>
                    <div v-if="processing" style="padding: 5px;">
                        Designs updated: {{ arch_completed }} / {{ arch_total }}
                    </div>
                </div>

                <div class="modal-assign-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="assign_instrument()" :disabled="disable_commit">
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
    import { InstrumentAssignation, AssignInstrument, DeassignInstrument, GetArchitectures, UpdateArchitecture, GetNumOrbits, GetNumInstruments } from '../../../../../scripts/instrument-queries';

    export default {
        name: 'assign-instrument',
        props: ['isActive', 'selected_instrument'],
        data() {
            return {
                Problem: [],
                problem_id: parseInt(PROBLEM__ID),
                problem_selections: [],
                disable_cancel: false,
                disable_commit: false,

                Architecture: [],
                Join__Problem_Instrument: [],
                Join__Problem_Orbit: [],


                modify_arch_inputs: false,

                processing: false,

                arch_completed: 0,
                arch_total: 0,
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


            async update_architecture(new_input, eval_status, arch_id){
                let add_assignation = await this.$apollo.mutate({
                    mutation: UpdateArchitecture,
                    variables: {
                        new_input: new_input,
                        eval_status: eval_status,
                        arch_id: arch_id,
                    },
                    update: (cache, { data: { insert_instrument_assignation } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(insert_instrument_assignation);
                    },
                });
            },

            selected_instrument_position(){
                let inst_id = this.selected_instrument.id;
                for(let x=0;x<this.Join__Problem_Instrument.length;x++){
                    console.log(this.Join__Problem_Instrument[x].Instrument.id);
                    if(inst_id == this.Join__Problem_Instrument[x].Instrument.id){
                        return x;
                    }
                }
                return -1;
            },

            async assign_instrument(){
                console.log("---> ASSIGNING instrument");
                this.disable_cancel = true;
                this.disable_commit = true;
                this.processing = true;

                // ASSIGN INSTRUMENT FUNCTIONALITY HERE
                for(let x=0;x<this.problem_selections.length;x++){
                    if(this.problem_selections[x].assigned != this.problem_selections[x].original_val){

                        // 0.1 Fetch architectures: get num orbs and insts
                        this.problem_id = this.problem_selections[x].id;
                        console.log("---> fetching queries", this.problem_id);

                        let sure1 = await this.$apollo.query({
                            deep: true,
                            fetchPolicy: 'no-cache',
                            query: GetArchitectures,
                            variables: {
                                problem_id: this.problem_selections[x].id,
                            }
                        });
                        let sure2 = await this.$apollo.query({
                            deep: true,
                            fetchPolicy: 'no-cache',
                            query: GetNumInstruments,
                            variables: {
                                problem_id: this.problem_selections[x].id,
                            }
                        });
                        let sure3 = await this.$apollo.query({
                            deep: true,
                            fetchPolicy: 'no-cache',
                            query: GetNumOrbits,
                            variables: {
                                problem_id: this.problem_selections[x].id,
                            }
                        });

                        console.log(sure1);
                        console.log(sure2);
                        console.log(sure3);

                        let num_insts = this.Join__Problem_Instrument.length;
                        let num_orbs = this.Join__Problem_Orbit.length;
                        console.log("---> num insts", num_insts, "num orbs", num_orbs);



                        // A. add instrument to problem - no re-evaluation
                        if(this.problem_selections[x].assigned){

                            // 1. Iterate over problem architectures
                            this.arch_total = this.Architecture.length;
                            for(let y=0;y<this.Architecture.length;y++){
                                this.arch_completed = y;

                                let new_input = '';
                                let arch = this.Architecture[y];
                                let arch_input = arch.input;
                                let arch_id = arch.id;
                                let eval_status = arch.eval_status;

                                // 1.1 Iterate over architecture inputs
                                for(let z=0;z<arch_input.length;z++){
                                    new_input = new_input + arch_input[z];
                                    if( (z + 1) % num_insts == 0){
                                        new_input = new_input + '0';
                                    }
                                }
                                // console.log("--> old arch", arch_input);
                                // console.log("--> new arch", new_input);

                                // 1.2 Commit new architecture input
                                if(this.modify_arch_inputs){
                                    await this.update_architecture(new_input, true, arch_id);
                                }
                            }

                            let add_assignation = await this.$apollo.mutate({
                                mutation: AssignInstrument,
                                variables: {
                                    problem_id: this.problem_selections[x].id,
                                    instrument_id: this.selected_instrument.id,
                                },
                                update: (cache, { data: { insert_instrument_assignation } }) => {
                                    // Read the data from our cache for this query.
                                    // eslint-disable-next-line
                                    console.log(insert_instrument_assignation);
                                },
                            });
                            console.log("---> ASSIGNING", add_assignation);

                        } // B. remove instrument from problem
                        else{

                            // 1. Find 0-up position of inst to be removed in inst list
                            let inst_pos = this.selected_instrument_position();
                            if(inst_pos === -1){
                                console.log("---> INSTRUMENT NOT FOUND IN INST LIST");
                                console.log(this.Join__Problem_Instrument, this.selected_instrument.id);
                            }
                            else{
                                console.log("---> inst position", inst_pos);

                                // 2. Iterate over problem architectures
                                this.arch_total = this.Architecture.length;
                                for(let y=0;y<this.Architecture.length;y++){
                                    this.arch_completed = y;
                                    let new_input = '';
                                    let arch = this.Architecture[y];
                                    let arch_input = arch.input;
                                    let arch_id = arch.id;
                                    let eval_status = true;

                                    // 2.1 Build new inputs
                                    for(let z=0;z<arch_input.length;z++){
                                        if( (z - inst_pos) % num_insts != 0){
                                            new_input = new_input + arch_input[z];
                                        }
                                        else{
                                            // Check if we are removing a 1
                                            if(arch_input[z] == '1'){
                                                // Arch needs re-evaluation
                                                eval_status = false;
                                            }
                                        }
                                    }
                                    // console.log("--> old arch", arch_input);
                                    // console.log("--> new arch", new_input);

                                    if(this.modify_arch_inputs){
                                        await this.update_architecture(new_input, eval_status, arch_id);
                                    }
                                }

                                let remove_assignation = await this.$apollo.mutate({
                                    mutation: DeassignInstrument,
                                    variables: {
                                        problem_id: this.problem_selections[x].id,
                                        instrument_id: this.selected_instrument.id,
                                    },
                                    update: (cache, { data: { insert_instrument_assignation } }) => {
                                        // Read the data from our cache for this query.
                                        // eslint-disable-next-line
                                        console.log(insert_instrument_assignation);
                                    },
                                });
                                console.log("---> ASSIGNING", remove_assignation);
                            }
                        }
                    }
                }

                this.disable_cancel = false;
                this.disable_commit = false;
                this.processing = false;
                this.$apollo.queries.Problem.refetch();
                this.$emit('close-modal');
            },







        },
        apollo: {
            Problem: {
                query: InstrumentAssignation,
                fetchPolicy: 'no-cache',
                variables() {
                    return {
                        instrument_id: this.selected_instrument.id,
                        group_id: this.group_id,
                    }
                }
            },
            Architecture: {
                query: GetArchitectures,
                fetchPolicy: 'no-cache',
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
            Join__Problem_Instrument: {
                query: GetNumInstruments,
                fetchPolicy: 'no-cache',
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
            Join__Problem_Orbit: {
                query: GetNumOrbits,
                fetchPolicy: 'no-cache',
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
        },
        watch: {
            Join__Problem_Instrument(){
                console.log("----- JOIN PROBLEM INSTRUMENT QUERY CHANGED ----- ");
                console.log(this.Join__Problem_Instrument);
            },
            Problem(){
                this.problem_selections = [];
                for(let x=0;x<this.Problem.length;x++){
                    let obj = {};
                    obj.id = this.Problem[x].id;
                    obj.name = this.Problem[x].name;
                    if(this.Problem[x].Join__Problem_Instruments_aggregate.aggregate.count > 0){
                        obj.assigned = true;
                        obj.original_val = true;
                    }
                    else{
                        obj.assigned = false;
                        obj.original_val = false;
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