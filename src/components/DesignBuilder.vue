<template>
    <div class="panel-block functionality">
        <div id="arch-info-display" v-if="isPointSelected">
            <p id="output-info">
                <span><b>Design ID</b>: D{{ pointID }}; </span>
                <span v-for="(output, index) in outputList" v-bind:key="index">
                    <b>{{ output }}</b>: {{ outputVal(index) }};
                </span>
                <a class="button" v-on:click.prevent="evaluateArch">Evaluate Architecture</a>
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
        computed: {
            ...mapGetters([
                'getHoveredArch',
                'getClickedArch',
                'getProblemData'
            ]),
            isPointSelected() {
                return this.getHoveredArch !== -1 || this.getClickedArch !== -1;
            },
            pointID() {
                return this.getHoveredArch === -1 ? this.getClickedArch : this.getHoveredArch;
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
                let rawValue = this.getProblemData[this.pointID].outputs[index];
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
                let new_inputs = this.boolArch(this.instrument_num);
                let eq_arrays = (new_inputs.length === this.selectedArch.inputs.length) && new_inputs.every((element, index) => {
                    return element === this.selectedArch.inputs[index];
                });
                if (!eq_arrays) {
                    let req_data = new FormData();
                    req_data.append("inputs", JSON.stringify(this.boolArch(this.instrument_num)));
                    console.log(this.boolArch(this.instrument_num));
                    try {
                        let data_response = await fetch("/api/vassar/evaluate-architecture/",
                            {
                                method: "POST",
                                body: req_data,
                                credentials: "same-origin"
                            });
                        if (data_response.ok) {
                            let eval_response = await data_response.json();
                            PubSub.publish(ARCH_ADDED, eval_response);
                        }
                        else {
                            console.error("Error evaluating the architecture");
                        }
                    }
                    catch(e) {
                        console.error("Networking error:", e);
                    }
                }
            },
            show_info(arch, hovering) {
                // Remove the previous info (and save it if we are hovering!!!)
                if (hovering) {
                    let modified_arch = this.boolArch();
                    this.selectedArch.inputs = modified_arch;
                }
            },
            boolArch() {
                let table_instrument_rows = document.getElementsByClassName('instruments_list');
                let bitString = [];
                for (let i = 0; i < 60; i++) {
                    bitString.push(false);
                }

                for (let i = 0; i < table_instrument_rows.length; ++i) {
                    $(table_instrument_rows[i]).children(".arch_box").each((index, element) => {
                        let position = $(element).text().charCodeAt() - "A".charCodeAt();
                        bitString[12*i + position] = true;
                    });
                }

                return bitString;
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