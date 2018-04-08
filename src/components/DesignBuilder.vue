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
            </p>
            <component v-bind:is="displayComponent"></component>
        </div>
        <p v-else>If you hover the mouse over or click a design, relevant information will be displayed here.</p>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import EOSSBuilder from './EOSSBuilder';

    export default {
        name: 'design-builder',
        data() {
            return {
                isComputing: false
            }
        },
        computed: {
            ...mapGetters({
                hoveredArch: 'getHoveredArch',
                clickedArch: 'getClickedArch',
                problemData: 'getProblemData',
                inExperiment: 'getInExperiment'
            }),
            isPointSelected() {
                return this.hoveredArch !== -1 || this.clickedArch !== -1;
            },
            pointID() {
                return this.hoveredArch === -1 ? this.clickedArch : this.hoveredArch;
            },
            outputList() {
                return this.$store.state.problem.outputList;
            },
            displayComponent() {
                return this.$store.state.problem.displayComponent;
            }
        },
        components: {
            EOSSBuilder
        },
        methods: {
            outputVal(index) {
                let rawValue = this.problemData[this.pointID].outputs[index];
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
                let oldInputs = this.problemData[this.pointID].inputs;
                let arraysAreEq = (newInputs.length === oldInputs.length) && newInputs.every((element, index) => {
                    return element === oldInputs[index];
                });
                if (!arraysAreEq) {
                    let reqData = new FormData();
                    reqData.append('inputs', JSON.stringify(newInputs));
                    reqData.append('special', this.inExperiment ? 'True' : 'False');
                    try {
                        let dataResponse = await fetch('/api/vassar/evaluate-architecture',
                            {
                                method: 'POST',
                                body: reqData,
                                credentials: 'same-origin'
                            });
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