<template>
<div style="display: flex; flex-direction: column; flex-grow: 1; overflow: auto;">
    <div class="panel-block functionality">
        <p>Select a hypothesis to test.</p>
        <p>Architectures <span class="select is-small" style="max-width: 40px;">
            <select id="hypothesis-menu" v-model="selectedHypothesis" style="color: white;">
                <option v-for="option in hypothesisOptions" :value="option.value" :key="option.value">{{ option.text }}</option>
            </select>
        </span>
        <span v-if="selectedHypothesis == 'present'">
            with 
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 1" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
        </span>
        <span v-else-if="selectedHypothesis == 'absent'">
            without 
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 1" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
        </span>
        <span v-else-if="selectedHypothesis == 'inOrbit'">
            with 
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 3" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
            in 
            <span class="select is-small">
                <select v-model="selectedOrbits[0]">
                    <option v-for="(option, index) in extraInfo.orbitList" :value="index" :key="option">{{ option }}</option>
                </select>
            </span>
        </span>
        <span v-else-if="selectedHypothesis == 'notInOrbit'">
             without
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 3" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
            in 
            <span class="select is-small">
                <select v-model="selectedOrbits[0]">
                    <option v-for="(option, index) in extraInfo.orbitList" :value="index" :key="option">{{ option }}</option>
                </select>
            </span>
        </span>
        <span v-else-if="selectedHypothesis == 'together'">
            with 
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 3" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
            in the same orbit
        </span>
        <span v-else-if="selectedHypothesis == 'separate'">
            where 
            <span v-for="(selectedInstrument, selectIndex) in selectedInstruments" :key="selectIndex">
                <span class="select is-small">
                    <select v-model="selectedInstruments[selectIndex]">
                        <option v-for="(option, index) in extraInfo.instrumentList" :value="index" :key="option">{{ option }}</option>
                    </select>
                </span>
            </span>
            <button v-if="selectedInstruments.length < 3" v-on:click="addInstrument" class="button is-small">+</button>
            <button v-if="selectedInstruments.length > 1" v-on:click="removeInstrument" class="button is-small">-</button>
            are never in the same orbit
        </span>
        <span v-else-if="selectedHypothesis == 'emptyOrbit'">
            where 
            <span class="select is-small">
                <select v-model="selectedOrbits[0]">
                    <option v-for="(option, index) in extraInfo.orbitList" :value="index" :key="option">{{ option }}</option>
                </select>
            </span>
            is empty
        </span>
        <span v-else-if="selectedHypothesis == 'numOrbits'">
            where
            <input class="input is-small" style="max-width: 60px;" type="number" placeholder="1" v-model="selectedNumber" v-bind:min="1" v-bind:max="extraInfo.orbitList.length">
            orbit(s) have instruments
        </span>
        <span v-else-if="selectedHypothesis == 'numOfInstruments'">
            with
            <input class="input is-small" style="max-width: 60px;" type="number" placeholder="1" v-model="selectedNumber" v-bind:min="1" v-bind:max="extraInfo.orbitList.length*extraInfo.instrumentList.length">
            instrument(s)
        </span>
         perform better on average.</p>
        <button v-on:click="testHypothesis" v-bind:disabled="!checkHypothesisInputs()" class="button is-primary">Test hypothesis</button>
    </div>
    <div class="panel-block functionality" v-if="featureExpression !== ''">
        <ul>
            <li>{{ parseFloat(precision*100).toFixed(2) }}% of architectures close to the Pareto front have the tested feature.</li>
            <li>{{ parseFloat(recall*100).toFixed(2) }}% of architectures with the tested feature are close to the Pareto front.</li>
            <li>Test score for better cost in architectures with the tested feature (a smaller value is better): {{parseFloat(costHypothesis).toFixed(4)}}/1 </li>
            <li>Test score for better science in architectures with the tested feature (a smaller value is better): {{parseFloat(scienceHypothesis).toFixed(4)}}/1 </li>
            <li>Test score for architectures with the tested feature being closer to Pareto front (a smaller value is better): {{parseFloat(paretoHypothesis).toFixed(4)}}/1 </li>
        </ul>
    </div>
</div>
</template>

<script>
    import { mapGetters, mapState, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';
    let ttest2 = require('@stdlib/stats-ttest2');
    let mean = require('@stdlib/stats-base-mean');

    export default {
        name: 'hypothesis-tester',
        data: function() {
            return {
                hypothesisOptions: [
                    {value:'present',text:'with <Instrument>'},
                    {value:'absent',text:'without <Instrument>'},
                    {value:'inOrbit',text:'with <Instruments> in <Orbit>'},
                    {value:'notInOrbit',text:'without <Instruments> in <Orbit>'},
                    {value:'together',text:'with <Instruments> in the same orbit'},
                    {value:'separate',text:'where <Instruments> are never in the same orbit'},
                    {value:'emptyOrbit',text:'where <Orbit> is empty'},
                    {value:'numOrbits',text:'where <N> orbits have instruments'},
                    {value:'numOfInstruments',text:'with <N> instruments'},
                ],
                selectedInstruments: [-1],
                selectedOrbits: [-1],
                selectedNumber: -1,
            }
        },
        computed: {
            ...mapState({
                extraInfo: state => state.problem.extra,
                featureExpression: state => state.hypothesis.featureExpression,
                plotData: state => state.tradespacePlot.plotData,
            }),
            selectedHypothesis: {
                get() {
                    return this.$store.state.hypothesis.currentHypothesis;
                },
                set(selectedHypothesis) {
                    this.$store.commit('setCurrentHypothesis', selectedHypothesis);
                    this.selectedInstruments = [-1];
                    this.selectedOrbits = [-1];
                    this.selectedNumber = -1;
                }
            },
            behavioralArchs() {
                // If hypothesis expression is not empty, do something
                let behavioralArchs = new Set();
                if (this.featureExpression !== '' || this.featureExpression) {
                    this.plotData.forEach((point, index) => {
                        if (this.$store.state.filter.processFilterExpression(point, this.featureExpression, '&&')) {
                            behavioralArchs.add(point);
                        }
                    });
                }
                return behavioralArchs;
            },
            nonbehavioralArchs() {
                // If hypothesis expression is not empty, do something
                let nonbehavioralArchs = new Set();
                if (this.featureExpression !== '' || this.featureExpression) {
                    this.plotData.forEach((point, index) => {
                        if (!this.behavioralArchs.has(point)) {
                            nonbehavioralArchs.add(point);
                        }
                    });
                }
                return nonbehavioralArchs;
            },
            paretoArchs() {
                // If hypothesis expression is not empty, do something
                let paretoArchs = new Set();
                if (this.featureExpression !== '' || this.featureExpression) {
                    this.plotData.forEach((point, index) => {
                        if (point.paretoRanking <= 3) {
                            paretoArchs.add(point);
                        }
                    });
                }
                return paretoArchs;
            },
            paretoAndBehavioralArchs() {
                let intersection = new Set();
                for (let elem of this.behavioralArchs) {
                    if (this.paretoArchs.has(elem)) {
                        intersection.add(elem);
                    }
                }
                return intersection;
            },
            precision() {
                return this.paretoAndBehavioralArchs.size/this.paretoArchs.size;
            },
            recall() {
                return this.paretoAndBehavioralArchs.size/this.behavioralArchs.size;
            },
            costHypothesis() {
                let costBehavioral = [];
                let costNonbehavioral = [];
                for (let elem of this.behavioralArchs) {
                    costBehavioral.push(elem.outputs[1]);
                }
                for (let elem of this.nonbehavioralArchs) {
                    costNonbehavioral.push(elem.outputs[1]);
                }
                let stat = ttest2(costBehavioral, costNonbehavioral, {alternative: 'less'});
                return stat.pValue;
            },
            scienceHypothesis() {
                let scienceBehavioral = [];
                let scienceNonbehavioral = [];
                for (let elem of this.behavioralArchs) {
                    scienceBehavioral.push(elem.outputs[0]);
                }
                for (let elem of this.nonbehavioralArchs) {
                    scienceNonbehavioral.push(elem.outputs[0]);
                }
                let stat = ttest2(scienceBehavioral, scienceNonbehavioral, {alternative: 'greater'});
                return stat.pValue;
            },
            paretoHypothesis() {
                let paretoBehavioral = [];
                let paretoNonbehavioral = [];
                for (let elem of this.behavioralArchs) {
                    paretoBehavioral.push(elem.paretoRanking);
                }
                for (let elem of this.nonbehavioralArchs) {
                    paretoNonbehavioral.push(elem.paretoRanking);
                }
                let stat = ttest2(paretoBehavioral, paretoNonbehavioral, {alternative: 'less'});
                return stat.pValue;
            },
        },
        methods: {
            addInstrument() {
                this.selectedInstruments.push(0);

            },
            removeInstrument() {
                this.selectedInstruments.pop();
            },
            testHypothesis() {
                // First, construct feature expression
                let orbitString = (this.selectedOrbits[0] != -1) ? this.selectedOrbits.join() : "";
                let instrumentString = (this.selectedInstruments[0] != -1) ? this.selectedInstruments.join() : "";
                let numberString = (this.selectedNumber != -1) ? this.selectedNumber : "";
                let featureString = `{${this.selectedHypothesis}[${orbitString};${instrumentString};${numberString}]}`;
                console.log(featureString);
                // Then, set it to vuex and submit to server
                this.$store.commit('setFeatureExpression', featureString);
                this.$store.dispatch('startHypothesisTesting');
            },
            checkHypothesisInputs() {
                switch(this.selectedHypothesis) {
                    case "present": {
                        return this.selectedInstruments[0] != -1;
                    }
                    case "absent": {
                        return this.selectedInstruments[0] != -1;
                    }
                    case "inOrbit": {
                        return this.selectedInstruments[0] != -1 && this.selectedOrbits[0] != -1;
                    }
                    case "notInOrbit": {
                        return this.selectedInstruments[0] != -1 && this.selectedOrbits[0] != -1;
                    }
                    case "together": {
                        return this.selectedInstruments[0] != -1;
                    }
                    case "separate": {
                        return this.selectedInstruments[0] != -1;
                    }
                    case "emptyOrbit": {
                        return this.selectedOrbits[0] != -1;
                    }
                    case "numOrbits": {
                        return this.selectedNumber != -1;
                    }
                    case "numOfInstruments": {
                        return this.selectedNumber != -1;
                    }
                }
                return false;
            }
        }
    }
</script>

<style scoped>

</style>