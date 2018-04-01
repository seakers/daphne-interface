<template>
    <div class="design-space">
        <table class="table" id="arch-info-display-table">
            <thead>
            <tr>
                <th>Orbit</th>
                <th>Instruments</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in jsonArch" v-bind:key="index" v-bind:name="row.orbit">
                    <th class="arch-cell" v-bind:name="orbitDisplayName(row.orbit)">{{ orbitDisplayName(row.orbit) }}</th>
                    <draggable class="instruments-list" :element="'td'" v-bind:options="instrumentListOptions" @add="onAddInstrList">
                        <div v-for="(instrument, childIndex) in row.children" class="arch-box" v-bind:key="instrument + index" v-bind:name="instrDisplayName(instrument)">
                            {{ instrDisplayName(instrument) }}
                        </div>
                    </draggable>
                </tr>
            </tbody>
        </table>
        <draggable id="instrument-adder-list" v-bind:options="instrumentAdderOptions" @add="onAddInstrAdder">
            <div v-for="instrument in extraInfo.instrumentList" class="arch-box" v-bind:key="instrument" v-bind:name="instrDisplayName(instrument)">
                {{ instrDisplayName(instrument) }}
            </div>
        </draggable>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import draggable from 'vuedraggable';

    export default {
        name: 'eoss-builder',
        data() {
            return {
                instrumentAdderOptions: {
                    group: {
                        name: 'instrument_adders',
                        pull: 'clone',
                        put: 'instrument_lists'
                    },
                    sort: false,
                    animation: 150
                },
                instrumentListOptions: {
                    group: {
                        name: 'instrument_lists',
                        pull: true,
                        put: ['instrument_lists', 'instrument_adders']
                    },
                    animation: 150
                }
            }
        },
        computed: {
            ...mapGetters({
                hoveredArch: 'getHoveredArch',
                clickedArch: 'getClickedArch',
                problemData: 'getProblemData',
                extraInfo: 'getExtraInfo'
            }),
            pointID() {
                return this.hoveredArch === -1 ? this.clickedArch : this.hoveredArch;
            },
            jsonArch() {
                // Pick information depending on whether we are showing clicked or hovered arch
                let architectureInputs = [];
                if (this.hoveredArch !== -1) {
                    architectureInputs = this.problemData[this.pointID].inputs;
                }
                else {
                    architectureInputs = this.$store.state.tradespacePlot.clickedArchInputs;
                }
                let extraInfo = this.extraInfo;
                let jsonArchitecture = [];

                for (let i = 0; i < extraInfo.orbitNum; i++) {
                    let orbit = extraInfo.orbitList[i];
                    let assigned = [];

                    for (let j = 0; j < extraInfo.instrumentNum; j++) {
                        if (architectureInputs[i*extraInfo.instrumentNum + j] === true) {
                            let instrument = extraInfo.instrumentList[j];
                            //Store the instrument names assigned to jth orbit
                            assigned.push(instrument);
                        }
                    }
                    // Store the name of the orbit and the assigned instruments
                    jsonArchitecture.push({ 'orbit': orbit, 'children': assigned });
                }
                return jsonArchitecture;
            }
        },
        components: {
            draggable
        },
        methods: {
            orbitDisplayName(orbit) {
                return this.extraInfo.orbitAlias[orbit];
            },

            instrDisplayName(instrument) {
                return this.extraInfo.instrumentAlias[instrument];
            },

            boolArch() {
                let bitString = [];
                for (let i = 0; i < 60; i++) {
                    bitString.push(false);
                }

                let tableInstrumentRows = document.getElementsByClassName('instruments-list');
                for (let i = 0; i < tableInstrumentRows.length; ++i) {
                    for (let j = 0; j < tableInstrumentRows[i].children.length; ++j) {
                        let child = tableInstrumentRows[i].children[j];
                        if (child.classList.contains('arch-box')) {
                            let position = this.$store.state.problem.displayName2Index(child.textContent.trim(), 'instrument');
                            bitString[12*i + +position] = true;
                        }
                    }
                }
                return bitString;
            },

            getBoolArrayIndex(list, element) {
                let tableInstrumentRows = document.getElementsByClassName('instruments-list');
                for (let i = 0; i < tableInstrumentRows.length; ++i) {
                    if (tableInstrumentRows[i] === list) {
                        let position = this.$store.state.problem.displayName2Index(element.textContent.trim(), 'instrument');
                        return 12*i + +position;
                    }
                }
            },

            onAddInstrAdder(event) {
                if (event.from !== event.to) {
                    let newIndex = this.getBoolArrayIndex(event.from, event.item);
                    event.item.remove();
                    let boolArch = this.boolArch();
                    boolArch[newIndex] = false;
                    this.$store.commit('updateClickedArchInputs', boolArch);
                }
            },

            onAddInstrList(event) {
                if (event.from !== event.to) {
                    let newIndex = this.getBoolArrayIndex(event.to, event.item);
                    event.item.remove();
                    let boolArch = this.boolArch();
                    if (!boolArch[newIndex]) {
                        boolArch[newIndex] = true;
                        this.$store.commit('updateClickedArchInputs', boolArch);
                    }
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .instruments-list {
        height: 30px;
    }

    .arch-cell {
        vertical-align: middle !important;
    }

    .design-space {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .arch-box {
        display: inline-block;
        min-width: 30px;
        height: 30px;
        padding: 0 5px 0 5px;
        margin-right: 5px;
        text-align: center;
        border: 1px solid $grey-lighter;
    }

    #instrument-adder-list {
        margin-left: 40px;
        max-width: 25%;
    }
</style>