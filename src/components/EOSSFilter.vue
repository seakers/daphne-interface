<template>
    <div class="panel-block functionality">
        <div class="select">
            <select id="filter-select-menu" v-model="selectedFilter">
                <option v-for="option in presetOptions" :value="option.value" :key="option.value">{{ option.text }}</option>
            </select>
        </div>
        <article id="filter-message-input" class="message is-dark" v-if="selectedFilter !== 'not_selected'">
            <div id="filter-inputs" class="message-body">
                <div class="field" v-for="input in filterInputs">
                    <label class="label">{{ input.text }}</label>
                    <div class="control">
                        <input class="input filter-input" :type="input.type" :value="input.value">
                    </div>
                </div>
            </div>
        </article>
        <div class="field">
            <p class="control">
                <button class="button" id="apply-filter-button" @click="applyFilter">Apply Filter</button>
            </p>
        </div>
        <article id="filter-message-hint" class="message is-info" v-if="selectedFilter !== 'not_selected'">
            <div class="message-header">
                <p>Valid Inputs</p>
                <button class="delete" aria-label="delete"></button>
            </div>
            <div id="filter-hints" class="message-body">
                <p>Valid orbit names: {{ printOrbitList }}</p>
                <p>Valid instrument names: {{ printInstrumentList }}</p>
            </div>
        </article>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';

    export default {
        name: 'eoss-filter',
        computed: {
            ...mapGetters({
                presetOptions: 'getPresetOptions'
            }),
            selectedFilter: {
                get() {
                    return this.$store.state.filter.selectedFilter;
                },
                set(selectedFilter) {
                    this.$store.commit('setSelectedFilter', selectedFilter);
                }
            },
            selectedFilterInfo() {
                return _.find(this.presetOptions, (opt) => opt.value === this.selectedFilter);
            },
            filterInputs() {
                if (this.selectedFilter === 'paretoFront') {
                    return [
                        {
                            text: 'Input Pareto Ranking (Integer number between 0-15): ',
                            type: 'text',
                            value: ''
                        }
                    ]
                }
                else {
                    let inputType = this.selectedFilterInfo.input;

                    switch(inputType) {

                        case 'singleInst':
                            return [
                                {
                                    text: 'Input single instrument name: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        case 'orbitAndMultipleInstInput':
                            return [
                                {
                                    text: 'Input orbit name: ',
                                    type: 'text',
                                    value: ''
                                },
                                {
                                    text: 'Input instrument names (minimum 1, and maximum 3) separated by comma: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        case 'orbitInput':
                            return [
                                {
                                    text: 'Input orbit name: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        case 'numOrbit':
                            return [
                                {
                                    text: 'Input number of orbits: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        case 'numOfInstruments':
                            return [
                                {
                                    text: 'Input an orbit name (Could be N/A): ',
                                    type: 'text',
                                    value: 'N/A'
                                },
                                {
                                    text: 'Input instrument name (Could be N/A): ',
                                    type: 'text',
                                    value: 'N/A'
                                },
                                {
                                    text: 'Input a number of instrument used (should be greater than or equal to 0): ',
                                    type: 'text',
                                    value: 'N/A'
                                }
                            ];

                        case 'subsetOfInstruments':
                            return [
                                {
                                    text: 'Input orbit name: ',
                                    type: 'text',
                                    value: ''
                                },
                                {
                                    text: 'Input the min and the max (optional) number of instruments in the subset, separated by comma: ',
                                    type: 'text',
                                    value: ''
                                },
                                {
                                    text: 'Input a set of instrument names, separated by comma: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        case 'multipleInstInput':
                            return [
                                {
                                    text: 'Input instrument names (2 or 3) separated by comma: ',
                                    type: 'text',
                                    value: ''
                                }
                            ];

                        default:
                            return [];
                    }
                }
            },
            printOrbitList() {
                const eossInfo = this.$store.state.problem.extra;
                return eossInfo.orbitList.map(orbit => eossInfo.orbitAlias[orbit]).join(', ');
            },
            printInstrumentList() {
                const eossInfo = this.$store.state.problem.extra;
                return eossInfo.instrumentList.map(orbit => eossInfo.instrumentAlias[orbit]).join(', ');
            }
        },
        methods: {
            applyFilter() {
                const problem = this.$store.state.problem;
                let invalidInput = false;
                let filterExpression;

                let inputText = [];

                let filterInputs = document.getElementsByClassName('filter-input');
                for (let i = 0; i < filterInputs.length; ++i) {
                    if (filterInputs[i].value !== null || filterInputs[i].value !== '') {
                        // Remove all white spaces
                        inputText.push(filterInputs[i].value.replace(/\s+/g, ''));
                    }
                    else {
                        // If textbox is empty, push null
                        inputText.push(null);
                    }
                }

                // Example of a filter expression: {presetName[orbits;instruments;numbers]}
                if (this.selectedFilter === 'present' || this.selectedFilter === 'absent' ||
                    this.selectedFilter === 'together' || this.selectedFilter === 'separate') {
                    let instrument = inputText[0];
                    let instRelabel = problem.displayName2Index(instrument.toUpperCase(), 'instrument');
                    if (instRelabel === null) {
                        invalidInput = true;
                    }
                    filterExpression = this.selectedFilter + '[;' + instRelabel + ';]';
                }
                else if (this.selectedFilter === 'inOrbit' || this.selectedFilter === 'notInOrbit') {
                    let orbit = inputText[0].trim();
                    let instrument = inputText[1];

                    let orbRelabel = problem.displayName2Index(orbit, 'orbit');
                    let instRelabel = problem.displayName2Index(instrument.toUpperCase(), 'instrument');
                    if (instRelabel === null || orbRelabel === null) {
                        invalidInput = true;
                    }
                    filterExpression = this.selectedFilter + '['+ orbRelabel + ';' + instRelabel + ';]';
                }
                else if (this.selectedFilter === 'emptyOrbit') {
                    let orbit = inputText[0].trim();
                    let orbRelabel = problem.displayName2Index(orbit, 'orbit');
                    if (orbRelabel === null) {
                        invalidInput = true;
                    }
                    filterExpression = this.selectedFilter + '[' + orbRelabel + ';;]';

                }
                else if (this.selectedFilter === 'numOrbits') {
                    let number = inputText[0].trim();
                    filterExpression = this.selectedFilter + '[;;' + number + ']';
                }
                else if (this.selectedFilter === 'subsetOfInstruments') {
                    let orbit = inputText[0].trim();
                    let instrument = inputText[2];
                    let orbRelabel = problem.displayName2Index(orbit, 'orbit');
                    let instRelabel = problem.displayName2Index(instrument.toUpperCase(), 'instrument');
                    if (instRelabel === null || orbRelabel === null) {
                        invalidInput = true;
                    }
                    let numbers = inputText[1].trim().replace(/\s+/g, '');
                    filterExpression = this.selectedFilter + '['+ orbRelabel + ';' + instRelabel + ';'+ numbers+']';
                }
                else if (this.selectedFilter === 'numOfInstruments') {
                    let orbit = inputText[0];
                    let instrument = inputText[1];
                    let number = inputText[2];

                    // There are 3 possibilities
                    let orbitEmpty = false;
                    let instrumentEmpty = false;

                    if (orbit === 'N/A' || orbit.length === 0) {
                        orbitEmpty = true;
                    }
                    if (instrument === 'N/A' || instrument.length === 0) {
                        instrumentEmpty = true;
                    }
                    if (orbitEmpty && instrumentEmpty) {
                        // Count all instruments across all orbits
                        filterExpression = this.selectedFilter + '[;;' + number + ']';
                    }
                    else if (orbitEmpty) {
                        // Count the number of specified instrument
                        let instRelabel = problem.displayName2Index(instrument.toUpperCase(), 'instrument');
                        if (instRelabel == null) {
                            invalidInput = true;
                        }
                        filterExpression = this.selectedFilter + '[;' + instRelabel + ';' + number + ']';
                    }
                    else if (instrumentEmpty) {
                        // Count the number of instruments in an orbit
                        orbit = orbit.trim();

                        let orbRelabel = problem.displayName2Index(orbit,'orbit');
                        if (orbRelabel === null) {
                            invalidInput = true;
                        }
                        filterExpression = this.selectedFilter + '[' + orbRelabel + ';;' + number + ']';
                    }
                }
                else if (this.selectedFilter === 'paretoFront') {
                    // To be implemented
                    filterExpression = 'paretoFront['+inputText[0]+']';
                }
                else { // not selected
                    return;
                }

                filterExpression = '{' + filterExpression + '}';

                if (invalidInput) {
                    alert('Invalid input argument');
                    return false;
                }

                if (filterExpression.indexOf('paretoFront') === -1) {
                    // TODO: Port to Vue
                    //PubSub.publish(UPDATE_FEATURE_APPLICATION, {'option':'direct-update','expression':filterExpression});
                }
                this.$store.commit('setCurrentExpression', filterExpression);
            }
        }
    }
</script>

<style scoped>

</style>