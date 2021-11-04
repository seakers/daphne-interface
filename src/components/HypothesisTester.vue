<template>
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
        <button v-on:click="testHypothesis" class="button is-primary">Test hypothesis</button>
    </div>
</template>

<script>
    import { mapGetters, mapState, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';

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
                selectedInstruments: [""],
                selectedOrbits: [""],
                selectedNumber: 1,
            }
        },
        computed: {
            ...mapState({
                extraInfo: state => state.problem.extra,
            }),
            selectedHypothesis: {
                get() {
                    return this.$store.state.hypothesis.currentHypothesis;
                },
                set(selectedHypothesis) {
                    this.$store.commit('setCurrentHypothesis', selectedHypothesis);
                    this.selectedInstruments = [0];
                    this.selectedOrbits = [0];
                    this.selectedNumber = 1;
                }
            },
            selectedFilterInfo() {
                return _.find(this.presetOptions, (opt) => opt.value === this.selectedFilter);
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
                let featureString = `{${this.selectedHypothesis}[${this.selectedOrbits.join()};${this.selectedInstruments.join()};${this.selectedNumber}]}`;
                console.log(featureString);
                // Then, set it to vuex and submit to server
                this.$store.commit('setFeatureExpression', featureString);
                this.$store.dispatch('startHypothesisTesting');
            },
        }
    }
</script>

<style scoped>

</style>