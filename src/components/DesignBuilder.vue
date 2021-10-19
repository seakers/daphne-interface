<template>
    <div class="panel-block functionality">
        <div id="arch-info-display" v-if="isPointSelected">
            <p id="output-info">
                <span><b>Design ID</b>: D{{ pointID }}; </span>
                <span v-for="(output, index) in objective_objs" v-if="output.active" v-bind:key="index">
                    <b>{{ output.name }}</b>: {{ outputVal(output.obj_id) }};
                </span>
                <a class="button" v-on:click.prevent="evaluateArch" :disabled="!canEvaluate">
                    <img src="assets/img/loader.svg" style="margin-right: 5px;" height="20" width="20" v-if="isComputing">
                    Evaluate Architecture
                </a>
                <a class="button" target="_blank" :href="'details.html?archID=' + pointID + '&problemId=' + problemId + '&datasetId=' + datasetId" v-if="detailsExperimentCondition">
                    Details
                </a>
                <a class="button" v-on:click.prevent="editProblem">
                    Edit Problem
                </a>
            </p>
            <component v-bind:is="displayComponent"></component>
        </div>
        <p v-else>If you hover the mouse over or click a design, relevant information will be displayed here.</p>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import EOSSBuilder from './EOSSBuilder';
    import PartitionBuilder from './PartitionBuilder';
    import {fetchPost} from "../scripts/fetch-helpers";
    import { ArchitectureQuery, GlobalInstrumentQuery, LocalInstrumentQuery, LocalOrbitQuery, DaphneDatasetIdQuery } from '../scripts/apollo-queries';



    export default {
        name: 'design-builder',
        data() {
            return {
                isComputing: false,
                eval_request_inputs: null,
                Join__Instrument_Characteristic: [],
                Join__Problem_Instrument: [],
                Join__Problem_Orbit: [],

                local_instruments: [],
                global_instruments: [],
                local_orbits: [],

                subCount: 0,
                idList: [],
                skipSub: false,

                currentDatasetInfo: null
            }
        },
        computed: {
            ...mapState({
                hoveredArch: state => state.tradespacePlot.hoveredArch,
                clickedArch: state => state.tradespacePlot.clickedArch,
                clickedArchInputs: state => state.tradespacePlot.clickedArchInputs,
                problemData: state => state.problem.problemData,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
                groupId: state => state.problem.groupId,
                ignoreQuery: state => state.problem.ignoreQuery,
                objective_objs: state => state.problem.objective_objs,
                extraData: state => state.problem.extra,
                displayComponent: state => state.problem.displayComponent,
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
                isLoggedIn: state => state.auth.isLoggedIn,
                vassarStatus: state => state.services.vassarStatus,
            }),
            // ...mapGetters({
            //     problem_id: 'getProblemModuleId'
            // }),
            isPointSelected() {
                return this.hoveredArch !== -1 || this.clickedArch !== -1;
            },
            pointID() {
                return this.hoveredArch === -1 ? this.clickedArch : this.hoveredArch;
            },
            detailsExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('Details');
                }
            },
            canEvaluate() {
                return this.isLoggedIn && this.vassarStatus == "ready" && !this.readOnlyDataset;
            },
            readOnlyDataset() {
                if (this.currentDatasetInfo) {
                    if (this.currentDatasetInfo[0].user_id === null && this.currentDatasetInfo[0].Group === null) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
        },
        components: {
            EOSSBuilder, PartitionBuilder
        },
        apollo: {
            Join__Instrument_Characteristic: {
                query: GlobalInstrumentQuery,
                variables() {
                    return {
                        problem_id: this.problemId,
                    }
                }
            },
            Join__Problem_Instrument: {
                query: LocalInstrumentQuery,
                variables() {
                    return {
                        problem_id: this.problemId,
                    }
                }
            },
            Join__Problem_Orbit: {
                query: LocalOrbitQuery,
                variables() {
                    return {
                        problem_id: this.problemId,
                    }
                }
            },
            $subscribe: {
                Architecture: {
                    query: ArchitectureQuery,
                    variables() {
                        return {
                            problem_id: this.problemId,
                            dataset_id: this.datasetId,
                            id_list: this.idList
                        }
                    },
                    skip() {
                        return this.skipSub;
                    },
                    result ({ data }) {
                        // Ignore the first query results but save ids to ignore later, as they are not an update but the original query
                        let arches = data.Architecture;
                        if (this.ignoreQuery) {
                            for (let x = 0; x < arches.length; x++) {
                                let arch = arches[x];
                                this.idList.push(arch.id);
                            }
                            this.$store.commit("setIgnoreQuery", false);
                            return;
                        }
                        if (arches.length === 0) {
                            return;
                        }
                        let t0 = performance.now();

                        let requiredLen  = this.extraData.orbitNum * this.extraData.instrumentNum;
                        let blocked_archs = [];
                        console.log("-------> SUBSCRIPTION UPDATE \nnum designs", arches.length, "\nobject ", data, "\nchromosome length", requiredLen);


                        for (let x = 0; x < arches.length; x++) {
                            let arch = arches[x];
                            if (arch.eval_status && (arch.input.length == requiredLen)) {
                                let bool_ary = [];

                                blocked_archs.push(arch.id);
                                for (let y = 0; y < arch.input.length; y++) {
                                    if(arch.input[y] == '1') {
                                        bool_ary.push(true);
                                    }
                                    else {
                                        bool_ary.push(false);
                                    }
                                }
                                console.log("\n----------- SUBSCRIPTION DESIGN --", "\n ------- id", this.problemData.length, "\n --- inputs", arch.input, "\n -- science", arch.science, "\n ----- cost", arch.cost);
                                if(this.compareInputsBoolBit(this.eval_request_inputs, arch.input)){
                                    this.isComputing = false
                                }

                                // let new_obj = {
                                //     id: this.problemData.length,
                                //     inputs: bool_ary,
                                //     outputs: [arch.science, arch.cost],
                                // };
                                let new_obj = {
                                    id: this.problemData.length,
                                    inputs: bool_ary,
                                    outputs: [arch.cost, arch.data_continuity, arch.fairness, arch.programmatic_risk, arch.ArchitectureScoreExplanations[0].satisfaction, arch.ArchitectureScoreExplanations[1].satisfaction, arch.ArchitectureScoreExplanations[2].satisfaction],
                                };
                                if (arch.ga === false) {
                                    this.$store.dispatch('addNewData', new_obj);
                                }
                                else {
                                    this.$store.dispatch('addNewDataFromGA', new_obj);
                                }
                                
                                console.log("--> new data point", new_obj);
                            }
                        }

                        console.log("---> SUBSCRIPTION END\n");
                        console.log("--> BLOCKED ARCHS:", blocked_archs);
                        this.idList = this.idList.concat(blocked_archs);

                        let t1 = performance.now();
                        console.log("SUBSCRIPTION NUM", this.subCount, "took " + (t1 - t0) + " milliseconds for ", arches.length, "designs");
                        this.subCount = this.subCount + 1;
                    },
                },
                selectedDataset: {
                    query: DaphneDatasetIdQuery,
                    variables() {
                        return {
                            dataset_id: this.datasetId
                        }
                    },
                    result ({ data }) {
                        this.currentDatasetInfo = data.current_dataset;
                    }
                }
            }
        },
        methods: {
            editProblem(){
                this.$store.commit('activateModal', 'EditProblemModal');
            },
            compareInputsBoolBit(bool_ary, bit_str){
                if(bool_ary === null){
                    return false;
                }
                for(let x = 0; x < bool_ary.length; x++){
                    let bit = bit_str.charAt(x);
                    let bit_bool = false;
                    if(bit === '1'){
                        bit_bool = true;
                    }
                    if(bit_bool !== bool_ary[x]){
                        console.log('--> INPUTS DO NOT MATCH')
                        return false;
                    }
                }
                console.log('--> INPUTS MATCH')
                return true;
            },
            outputVal(index) {
                let rawValue = this.problemData.find((point) => point.id === this.pointID).outputs[index];
                if (typeof rawValue === "number") {
                    if (rawValue > 100) {
                        return rawValue.toFixed(2);
                    }
                    else {
                        return rawValue.toFixed(4);
                    }
                }
            },
            async evaluateArch(event) {
                this.isComputing = true;
                let newInputs = this.clickedArchInputs;
                let oldInputs = this.problemData.find((point) => point.id === this.pointID).inputs;

                // ARCHITECTURE ALREADY EVALUATED
                let arraysAreEq = (newInputs.length === oldInputs.length) && newInputs.every((element, index) => {
                    return element === oldInputs[index];
                });

                // EVALUATE ARCHITECTURE
                if (!arraysAreEq) {
                    let reqData = new FormData();
                    reqData.append('inputs', JSON.stringify(newInputs));
                    console.log("---> EVAL INPUTS:", newInputs);
                    this.eval_request_inputs = newInputs;
                    try {
                        let dataResponse = await fetchPost(API_URL + 'eoss/engineer/evaluate-architecture', reqData);
                        if (dataResponse.ok) {
                            let eval_status = await dataResponse.json();
                            if (eval_status["code"] == "arch_repeated") {
                                let newIndex = -1;
                                this.problemData.forEach((d, i) => {
                                    if (d.db_id == eval_status["arch_id"]) {
                                        newIndex = i;
                                    }
                                });
                                this.$store.commit('updateClickedArch', newIndex);
                            }
                        }
                        else {
                            console.error('Error evaluating the architecture');
                        }
                    }
                    catch(e) {
                        console.error('Networking error:', e);
                    }
                }
                // this.isComputing = false;
            }
        },
        watch: {
            Join__Instrument_Characteristic() {
                let global_instruments = [];
                for (let i = 0; i < this.Join__Instrument_Characteristic.length; i++) {
                    global_instruments.push(this.Join__Instrument_Characteristic[i].Instrument.name);
                }
                this.global_instruments = global_instruments;
            },
            Join__Problem_Instrument() {
                let local_instruments = [];
                for (let i = 0; i < this.Join__Problem_Instrument.length; i++) {
                    local_instruments.push(this.Join__Problem_Instrument[i].Instrument.name);
                }
                this.local_instruments = local_instruments;
            },

            // DDDD
            Join__Problem_Orbit() {
                let local_orbits = [];
                for (let i = 0; i < this.Join__Problem_Orbit.length; i++) {
                    local_orbits.push(this.Join__Problem_Orbit[i].Orbit.name);
                }
                this.local_orbits = local_orbits;
            },
        }
    }
</script>

<style scoped>
#output-info {
    vertical-align: middle;
    display: table-cell;
    line-height: 36px;
}
</style>