<template>
    <div class="panel-block functionality">
        <div id="arch-info-display" v-if="isPointSelected">
            <p id="output-info">
                <span><b>Design ID</b>: D{{ pointID }}; </span>
                <span v-for="(output, index) in outputList" v-bind:key="index">
                    <b>{{ output }}</b>: {{ outputVal(index) }};
                </span>
                <a class="button" v-on:click.prevent="evaluateArch">
                    <img src="assets/img/loader.svg" style="margin-right: 5px;" height="20" width="20" v-if="isComputing">
                    Evaluate Architecture
                </a>
                <a class="button" target="_blank" :href="'details.html?archID=' + pointID + '&problem=' + problemName" v-if="detailsExperimentCondition">
                    Details
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
    import { GlobalInstrumentQuery, LocalInstrumentQuery, LocalOrbitQuery } from '../scripts/apollo-queries';



    export default {
        name: 'design-builder',
        data() {
            return {
                isComputing: false,
                Join__Instrument_Characteristic: [],
                Join__Problem_Instrument: [],
                Join__Problem_Orbit: [],


                problem_id: 5,
                local_instruments: [],
                global_instruments: [],
                local_orbits: [],

            }
        },
        computed: {
            ...mapState({
                hoveredArch: state => state.tradespacePlot.hoveredArch,
                clickedArch: state => state.tradespacePlot.clickedArch,
                problemData: state => state.problem.problemData,
                problemName: state => state.problem.problemName,
                outputList: state => state.problem.outputList,
                displayComponent: state => state.problem.displayComponent,
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
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
        },
        components: {
            EOSSBuilder, PartitionBuilder
        },
        apollo: {
            Join__Instrument_Characteristic: {
                query: GlobalInstrumentQuery,
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
            Join__Problem_Instrument: {
                query: LocalInstrumentQuery,
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
            Join__Problem_Orbit: {
                query: LocalOrbitQuery,
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            }
        },
        methods: {
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
                let newInputs = this.$store.state.tradespacePlot.clickedArchInputs;
                let oldInputs = this.problemData.find((point) => point.id === this.pointID).inputs;

                // ARCHITECTURE ALREADY EVALUATED
                let arraysAreEq = (newInputs.length === oldInputs.length) && newInputs.every((element, index) => {
                    return element === oldInputs[index];
                });

                if (!arraysAreEq) {
                    

                    // INSERT 0s FOR GLOBAL INSTRUMENTS NOT USED (CLOUD_MASK / SMAP_ANT)


                    let reqData = new FormData();
                    reqData.append('inputs', JSON.stringify(newInputs));
                    try {
                        let dataResponse = await fetchPost(API_URL + 'eoss/engineer/evaluate-architecture', reqData);
                        if (dataResponse.ok) {
                            let newArch = await dataResponse.json();
                            this.$store.dispatch('addNewData', newArch);
                        }
                        else {
                            console.error('Error evaluating the architecture');
                        }
                    }
                    catch(e) {
                        console.error('Networking error:', e);
                    }
                }
                this.isComputing = false;
            }
        },
        watch: {
            Join__Instrument_Characteristic() {
                let global_instruments = [];
                for (let i = 0; i < this.Join__Instrument_Characteristic.length; i++) {
                    global_instruments.push(this.Join__Instrument_Characteristic[i].Instrument.name);
                }
                this.global_instruments = global_instruments;
                console.log("-----> Global Instruments", global_instruments);
            },
            Join__Problem_Instrument() {
                let local_instruments = [];
                for (let i = 0; i < this.Join__Problem_Instrument.length; i++) {
                    local_instruments.push(this.Join__Problem_Instrument[i].Instrument.name);
                }
                this.local_instruments = local_instruments;
                console.log("-----> Local Instruments", local_instruments);
            },

            // DDDD
            Join__Problem_Orbit() {
                let local_orbits = [];
                for (let i = 0; i < this.Join__Problem_Orbit.length; i++) {
                    local_orbits.push(this.Join__Problem_Orbit[i].Orbit.name);
                }
                this.local_orbits = local_orbits;
                console.log("-----> Local Orbits", local_orbits);
            },
            problem_id(){
                console.log("-----> CURRENT PROBLEM ID", this.problem_id);
            }
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