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
                    <draggable class="instruments-list" :element="'td'" v-bind:options="instrumentListOptions" @end="onEndInstrList">
                        <div v-for="(instrument, childIndex) in row.children" class="arch-box" v-bind:key="instrument + index" v-bind:name="instrDisplayName(instrument)">
                            {{ instrDisplayName(instrument) }}
                        </div>
                    </draggable>
                </tr>
            </tbody>
        </table>
        <draggable id="instrument-adder-list" v-bind:options="instrumentAdderOptions" @end="onEndInstrAdder">
            <div v-for="instrument in getExtraInfo.instrumentList" class="arch-box" v-bind:key="instrument" v-bind:name="instrDisplayName(instrument)">
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
            ...mapGetters([
                'getHoveredArch',
                'getClickedArch',
                'getProblemData',
                'getExtraInfo'
            ]),
            pointID() {
                return this.getHoveredArch === -1 ? this.getClickedArch : this.getHoveredArch;
            },
            jsonArch() {
                // Pick information depending on whether we are showing clicked or hovered arch
                let architectureInputs = [];
                if (this.getHoveredArch !== -1) {
                    architectureInputs = this.getProblemData[this.pointID].inputs;
                }
                else {
                    architectureInputs = this.$store.state.tradespacePlot.clickedArchInputs;
                }
                let extraInfo = this.getExtraInfo;
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
                return this.getExtraInfo.orbitAlias.get(orbit);
            },

            instrDisplayName(instrument) {
                return this.getExtraInfo.instrumentAlias.get(instrument);
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
                            let position = child.textContent.trim().charCodeAt() - 'A'.charCodeAt();
                            bitString[12*i + position] = true;
                        }
                    }
                }
                return bitString;
            },

            onEndInstrAdder(event) {
                if (event.from !== event.to) {
                    event.item.remove();
                    this.$store.commit('updateClickedArchInputs', this.boolArch());
                }
            },

            onEndInstrList(event) {
                if (event.from !== event.to) {
                    let draggedInstr = event.item.textContent.trim();
                    let list = event.to;
                    let count = 0;
                    for (let i = 0; i < list.children.length; ++i) {
                        let child = list.children[i];
                        if (child.classList.contains('arch-box')) {
                            if (draggedInstr === child.textContent.trim()) {
                                count++;
                            }
                        }
                    }
                    if (count > 1) {
                        list.removeChild(event.item);
                    }
                    else {
                        this.$store.commit('updateClickedArchInputs', this.boolArch());
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
        width: 30px;
        height: 30px;
        margin-right: 5px;
        text-align: center;
        border: 1px solid $grey-lighter;
    }

    #instrument-adder-list {
        margin-left: 40px;
        max-width: 70px;
    }
</style>