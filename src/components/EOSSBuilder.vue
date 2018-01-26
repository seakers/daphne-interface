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
                    <td class="instruments-list">
                        <div v-for="(instrument, index) in row.children" class="arch-box" v-bind:key="index" v-bind:name="instrDisplayName(instrument)">
                            {{ instrDisplayName(instrument) }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="instrument-adder-list">
            <div v-for="(instrument, index) in getExtraInfo.instrumentList" class="arch-box" v-bind:key="index" v-bind:name="instrDisplayName(instrument)">
                {{ instrDisplayName(instrument) }}
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'eoss-builder',
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
                let architecture = this.getProblemData[this.pointID];
                let extraInfo = this.getExtraInfo;
                let bitString = this.booleanArray2String(architecture.inputs);
                let jsonArchitecture = [];

                for (let i = 0; i < extraInfo.orbitNum; i++) {
                    let orbit = extraInfo.orbitList[i];
                    let assigned = [];

                    for (let j = 0; j < extraInfo.instrumentNum; j++) {
                        if (bitString[i*extraInfo.instrumentNum + j] === '1') {
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
        methods: {
            booleanArray2String(boolArray) {
                let bitString = '';
                for (let i = 0; i < boolArray.length; i++) {
                    let bool;
                    if (boolArray[i] === true) {
                        bool = 1;
                    } else {
                        bool = 0;
                    }
                    bitString = bitString + bool;
                }
                return bitString;
            },

            orbitDisplayName(orbit) {
                return this.getExtraInfo.orbitAlias.get(orbit);
            },

            instrDisplayName(instrument) {
                return this.getExtraInfo.instrumentAlias.get(instrument);
            },

            display_arch_info(data) {
                let json_arch = this.jsonArch;

                let norb = json_arch.length;
                let maxNInst = 0;
                let totalNInst = 0;

                for (let i = 0; i < this.orbit_num; i++) {
                    let nInst = json_arch[i].children.length;
                    totalNInst = totalNInst + nInst;
                    if (nInst > maxNInst) {
                        maxNInst = nInst;
                    }
                }

                // Add list of instruments

                let instrument_adder_list = document.getElementById('instrument_adder_list');
                Sortable.create(instrument_adder_list, {
                    group: {
                        name: 'instrument_adders',
                        pull: 'clone',
                        put: 'instrument_lists'
                    },
                    sort: false,
                    animation: 150,
                    onAdd: e => {
                        e.item.parentNode.removeChild(e.item);
                    }
                });

                let table_instrument_rows = document.getElementsByClassName('instruments_list');
                Array.prototype.forEach.call(table_instrument_rows, (elem, idx) => {
                    Sortable.create(elem, {
                        group: {
                            name: 'instrument_lists',
                            pull: true,
                            put: ["instrument_lists", "instrument_adders"]
                        },
                        onAdd: e => {
                            let dragged_instr = $(e.item).text();
                            let count = 0;
                            $(e.item.parentNode).children(".arch_box").each((index, element) => {
                                if (dragged_instr === $(element).text()) {
                                    count++;
                                }
                            });
                            if (count > 1) {
                                e.item.parentNode.removeChild(e.item);
                            }
                        },
                        animation: 150,
                    });
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../node_modules/bulma/bulma";

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