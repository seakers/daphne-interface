<template>

    <div>
        <div style="padding-bottom: 10px;">
            <ul>
                <li>
                    Changing design decisions with high sensitivities will cause a larger change in objective value.
                    Click on a design decision in the plot to add or remove it from the current design.
                </li>
            </ul>
        </div>

        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Objective</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select v-on:change="changeObjective" v-model="objective">
                                <option>Science</option>
                                <option>Cost</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <vue-plotly :data="plotData" :layout="plotLayout" :options="{displayModeBar: false, responsive: true}" v-on:click="toggleDesignDecision" v-on:hover="highlightData" v-on:unhover="unhighlightData"/>
    </div>

</template>

<!-- SHOWING FIRST ORDER SENSITIVITIES ONLY -->

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { mapState } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    import { getDesignIndex } from '../scripts/utils'
    export default {
        name: "SensitivityPlot",

        components: {
            VuePlotly
        },

        data() {
            return {
                objective_cost: false,
                objective: 'Science',
                hoveredX: [],
                resize: 0,
            }
        },

        computed: {
            ...mapGetters({
                all_sensitivities: 'get_all_sensitivities',
            }),
            ...mapState({
                clickedArchInputs: state => state.tradespacePlot.clickedArchInputs,
            }),
            plotData(){
                let sensitivity_data = [];
                let objective = '';
                if(this.objective_cost){
                    sensitivity_data = this.all_sensitivities['cost']['S1_mins'];
                    objective = 'cost';
                }
                else{
                    sensitivity_data = this.all_sensitivities['science']['S1_mins'];
                    objective = 'science';
                }

                let xValues = [];
                let yValues = [];
                let hover_text = [];
                let colors = [];
                for(var x = 0; x < 5; x++) {
                    let orbit = sensitivity_data[x][0];
                    let instrument = sensitivity_data[x][1];
                    let value = sensitivity_data[x][2];
                    let xVal = orbit + ' | ' + instrument + " ";
                    let yVal = Math.abs(parseFloat(value));
                    xValues.push(xVal);
                    yValues.push(yVal);
                    value = (Math.abs(value * 100)).toFixed(1);
                    let text = '<b>Design Decision</b><br>' + 'Assinging ' + instrument + ' to orbit ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                    hover_text.push(text);
                    if(this.hoveredX.includes(xVal)){colors.push('#13356d');}
                    else{colors.push('#3273dc');}
                }

                let plot_data = [{
                    x: xValues,
                    y: yValues,
                    type: 'bar',
                    marker: {'color': colors},
                    hoverinfo: "text",
                    hovertext: hover_text,
                    text: xValues,
                    textposition: 'auto',
                }];

                return plot_data;
            },
            plotLayout(){
                let refresh = this.hoveredX;
                let resize = this.resize;
                let plot_layout = {
                    yaxis: {automargin: true, nticks: 10, tickformat: '%.00'},
                    xaxis: {automargin: true, tickmode: "linear", showticklabels: false},
                    height: 350,
                    autosize: true,
                    hoverlabel: { bgcolor: "#FFF" },
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                    margin: {l: 55, r: 45, t:20},
                };
                return plot_layout;
            },
        },

        methods: {
            changeObjective() {
                if(this.objective === "Science"){
                    this.objective_cost = false;
                }
                else if(this.objective === "Cost"){
                    this.objective_cost = true;
                }
            },
            highlightData(data) {
                //--> Clear hovered data (only one can be hovered over at a time)
                this.hoveredX = [];
                //--> Store x data as the identifier
                this.hoveredX.push(data['points'][0]['x'])
            },
            unhighlightData(data) {
                let x = data['points'][0]['x'];
                let index = this.hoveredX.indexOf(x);
                if(index !== -1){
                    this.hoveredX.splice(index,1);
                }
            },
            resizeRefresh() {
                this.resize += 1;
            },
            async toggleDesignDecision(data) {
                let expression = data['points'][0]['x'];
                let orbit = expression.split('|')[0];
                let instrument = expression.split('|')[1];
                orbit = orbit.trim();
                instrument = instrument.trim();
                let index = await getDesignIndex(orbit, instrument, "SMAP");
                let current_design = [...this.clickedArchInputs];
                if(current_design[index] === true){
                    current_design[index] = false;
                }
                else{
                    current_design[index] = true;
                }
                this.$store.commit('updateClickedArchInputs', current_design);
            },
        },

        mounted() {
            window.addEventListener("resize", this.resizeRefresh);
        },


    }
</script>

<style scoped>

</style>