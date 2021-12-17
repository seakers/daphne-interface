<template>

    <div class="message-body">
        <div class="tabs" style="min-height: 41px;">
            <ul>
                <li :class="{ 'is-active': selected_tab === 'instruments'}" v-on:click="show_instruments"><a style="text-decoration: none">Instruments</a></li>
                <li :class="{ 'is-active': selected_tab === 'orbits'}" v-on:click="show_orbits"><a style="text-decoration: none">Orbits</a></li>
                <li :class="{ 'is-active': selected_tab === 'stakeholders'}" v-on:click="show_stakeholders"><a style="text-decoration: none">Stakeholders</a></li>
                <li :class="{ 'is-active': selected_tab === 'objectives'}" v-on:click="show_objectives"><a style="text-decoration: none">Objectives</a></li>
            </ul>
        </div>

        <div v-show="selected_tab === 'instruments'">
            <edit-instruments ref="instmod"></edit-instruments>
        </div>

        <div v-show="selected_tab === 'orbits'">
            <edit-orbits ref="orbmod"></edit-orbits>
        </div>

        <div v-show="selected_tab === 'stakeholders'">
            <edit-stakeholders ref="stakemod"></edit-stakeholders>
        </div>

        <div v-show="selected_tab === 'objectives'">
            <edit-objectives ref="objmod"></edit-objectives>
        </div>


        <div>
            <button class="button is-link" :disabled="processing" v-on:click.prevent="commit_changes" style="margin-top: 15px;">Commit</button>
            <button class="button is-link" :disabled="processing" v-on:click.prevent="reload_module" style="margin-top: 15px;">Reload</button>
            <button class="button is-link" :disabled="processing" v-on:click.prevent="close" style="margin-top: 15px;">Close</button>
        </div>

    </div>

</template>

<script>
    import { mapState } from 'vuex';
    import EditInstruments from "./design_builder_editor/EditInstruments";
    import EditOrbits from "./design_builder_editor/EditOrbits";
    import EditStakeholders from "./design_builder_editor/EditStakeholders";
    import EditObjectives from "./design_builder_editor/EditObjectives";
    import {LocalOrbitQuery, LocalInstrumentQuery, ArchitectureDatasetQuery, ArchitectureDatasetGAQuery} from "../scripts/apollo-queries";
    import {client} from "../index";
    import {consolidate_architecture, index_new_dataset, index_instrument_changes, index_orbit_changes, generate_dataset_name, index_single_dataset} from "../scripts/arch_operations";
    import * as _ from 'lodash-es';
    import {fetchPost} from "../scripts/fetch-helpers";
    import {wsTools} from "../scripts/websocket-tools";


    export default {
        name: "edit-problem-modal",
        data() {
            return {
                selected_tab: 'instruments',
                processing: false,
            }
        },
        computed: {
            ...mapState({
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
                userPk: state => state.auth.user_pk,
            }),
        },
        components: {
            EditInstruments,
            EditOrbits,
            EditStakeholders,
            EditObjectives
        },
        methods: {
            show_instruments(){
                this.selected_tab = 'instruments';
            },
            show_orbits(){
                this.selected_tab = 'orbits';
            },
            show_stakeholders(){
                this.selected_tab = 'stakeholders';
            },
            show_objectives(){
                this.selected_tab = 'objectives';
            },
            async getOrbitList(){
                let response = await client.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: LocalOrbitQuery,
                    variables: {
                        problem_id: this.problemId,
                    }
                });
                let orbits = response['data']['Join__Problem_Orbit'];
                let orb_list = [];
                for(let x=0;x<orbits.length;x++){
                    orb_list.push(orbits[x]['Orbit']['name'])
                }
                return orb_list;
            },
            async getInstrumentList(){
                let response = await client.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: LocalInstrumentQuery,
                    variables: {
                        problem_id: this.problemId,
                    }
                });
                let instruments = response['data']['Join__Problem_Instrument'];
                let inst_list = [];
                for(let x=0;x<instruments.length;x++){
                    inst_list.push(instruments[x]['Instrument']['name'])
                }
                return inst_list;
            },
            async getArchitectures(){
                // Get all user evaluated architectures
                let response = await client.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: ArchitectureDatasetQuery,
                    variables: {
                        problem_id: this.problemId,
                        dataset_id: this.datasetId
                    }
                });
                let architectures = response['data']['Architecture'];

                // Get all GA architectures that improve HV
                let response_ga = await client.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: ArchitectureDatasetGAQuery,
                    variables: {
                        problem_id: this.problemId,
                        dataset_id: this.datasetId
                    }
                });
                let architectures_ga = response_ga['data']['Architecture'];
                let combined = architectures.concat(architectures_ga);
                return combined;
            },
            async consolidate_inst_orb_changes(inst_changes, orb_changes){
                let insts = await this.getInstrumentList();
                let orbs  = await this.getOrbitList();
                let archs = await this.getArchitectures();

                // --> Define new architecture
                let new_archs = [];
                for(let x=0; x < archs.length; x++){
                    let arch = archs[x];
                    let new_arch = _.cloneDeep(arch)
                    let result = consolidate_architecture(insts, inst_changes, orbs, orb_changes, arch);
                    new_arch.input = result.input;
                    // new_arch.eval_status = result.eval_status;
                    new_arch.eval_status = false;
                    new_archs.push(new_arch);
                }

                return new_archs;
            },
            async clear_arch_eval_requests(){
                let reqData = new FormData();
                let url = API_URL + 'eoss/formulation/clear-eval-requests';
                let dataResponse = await fetchPost(url, reqData);
            },
            async re_evaluate_architectures(archs){
                let reqData = new FormData();
                reqData.append("archs", JSON.stringify(archs));
                let url = API_URL + 'eoss/engineer/evaluate-architecture-set';
                let dataResponse = await fetchPost(url, reqData);
            },
            async commit_changes() {
                this.processing = true;
                this.$refs.objmod.commit_changes();
                let inst_items = this.$refs.instmod.commit_changes();
                let orb_items = this.$refs.orbmod.commit_changes();
                await this.$refs.stakemod.commit_changes();
                if(this.$refs.instmod.changes === false && this.$refs.orbmod.changes === false && this.$refs.stakemod.changes === false){
                    // Close modal
                    console.log("--> NO RELOADABLE CHANGES");
                    this.processing = false;
                    await this.send_changes();
                    this.$emit('close-modal');
                    return;
                }

                // --> 1. Consolidate architectures with formulation changes
                let archs = await this.consolidate_inst_orb_changes(inst_items, orb_items);

                // --> 2. Create new dataset for new formulation
                let dataset_name = await generate_dataset_name(this.userPk, this.problemId);
                let new_dataset_id = await index_single_dataset(this.groupId, this.problemId, this.userPk, dataset_name);

                // --> 3. Stop all running background tasks (stop ga)
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "stop_ga_all"
                }));
                await this.$store.dispatch('stopBackgroundTasks');
                await new Promise(r => setTimeout(r, 1500));

                // --> 4. Clear any current eval requests
                await this.clear_arch_eval_requests();

                // --> 5. Index instrument changes
                await index_instrument_changes(inst_items, this.problemId);

                // --> 6. Index orbit changes
                await index_orbit_changes(orb_items, this.problemId);

                // --> 7. Rebuild containers
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "build"
                }));

                // --> 8. Load new problem
                this.$store.commit('setProblemId', this.problemId);
                await this.$store.dispatch('initProblem', this.problemId);

                // --> 9. Load new dataset
                this.$store.commit("setIgnoreQuery", true);
                let parameters = {
                    'problem_id': this.problemId,
                    'group_id': this.groupId,
                    'dataset_id': new_dataset_id
                };
                await this.$store.dispatch('loadData', parameters);

                // --> 10. Reset data-mining
                this.$store.dispatch('setProblemParameters');

                // --> 11. Re-evaluate architectures
                await this.re_evaluate_architectures(archs);

                // --> 12. Start GA
                // wsTools.websocket.send(JSON.stringify({
                //     msg_type: "start_ga"
                // }));
                this.$store.commit('setShowFoundArchitectures', true);

                // --> 13. Send formulation changes to agent
                await this.send_changes();

                // --> 14. Stop processing and close
                this.processing = false;
                this.$emit('close-modal');
            },
            async send_changes(){
                let reqData = new FormData();
                reqData.append("instrument", this.$refs.instmod.changes.toString());
                reqData.append("orbit", this.$refs.orbmod.changes.toString());
                reqData.append("stakeholder", this.$refs.stakemod.changes.toString());
                reqData.append("objective", this.$refs.objmod.changes.toString());
                let curr_objectives = [];
                for(let x = 0; x < this.$refs.objmod.objective_objs.length; x++){
                    let obj = this.$refs.objmod.objective_objs[x];
                    if(obj.initial === true){
                        curr_objectives.push(obj.key);
                    }
                }
                reqData.append("objective_list", JSON.stringify(curr_objectives));
                let dataResponse = await fetchPost(API_URL + 'eoss/formulation/formulation-change', reqData);
                this.$refs.instmod.changes = false;
                this.$refs.orbmod.changes = false;
                this.$refs.stakemod.changes = false;
                this.$refs.objmod.changes = false;

            },
            reload_module() {
                this.$refs.instmod.reload_module();
                this.$refs.orbmod.reload_module();
                this.$refs.stakemod.reload_module();
                this.$refs.objmod.reload_module();
            },
            close(){
                this.$emit('close-modal');
            }
        },
        watch: {},
        apollo: {},
        mounted(){
            this.reload_module();
        }
    }
</script>

<style scoped>

</style>