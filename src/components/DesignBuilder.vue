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
                <a class="button" target="_blank" :href="'details.html?archID=' + pointID + '&problem=' + problemName">
                    Details
                </a>
            </p>
            <component v-bind:is="displayComponent"></component>
        </div>
        <p v-else>If you hover the mouse over or click a design, relevant information will be displayed here.</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import EOSSBuilder from './EOSSBuilder';
    import PartitionBuilder from './PartitionBuilder';
    import {fetchPost} from "../scripts/fetch-helpers";


    export default {
        name: 'design-builder',
        data() {
            return {
                isComputing: false
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
            }),
            isPointSelected() {
                return this.hoveredArch !== -1 || this.clickedArch !== -1;
            },
            pointID() {
                return this.hoveredArch === -1 ? this.clickedArch : this.hoveredArch;
            },
        },
        components: {
            EOSSBuilder, PartitionBuilder
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
                let arraysAreEq = (newInputs.length === oldInputs.length) && newInputs.every((element, index) => {
                    return element === oldInputs[index];
                });
                if (!arraysAreEq) {
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