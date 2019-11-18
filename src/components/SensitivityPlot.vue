<template>

    <div>
        <div style="padding-bottom: 10px;">
            <ul>
                <li>Every design decision is responsible for a percentage of the variance seen in objective values.
                Hover over the plot to see which design decisions cause the highest variance for the selected objective.</li>
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

        <vue-plotly :data="plotData" :layout="plotLayout" :options="{displayModeBar: false}"/>
    </div>

</template>

<!-- SHOWING FIRST ORDER SENSITIVITIES ONLY -->

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    export default {
        name: "SensitivityPlot",

        components: {
            VuePlotly
        },

        data() {
            return {
                objective_cost: false,
                objective: 'Science',
            }
        },

        computed: {

            ...mapGetters({
                all_sensitivities: 'get_all_sensitivities',
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
                for(var x = 0; x < sensitivity_data.length; x++) {
                    let orbit = sensitivity_data[x][0];
                    let instrument = sensitivity_data[x][1];
                    let value = sensitivity_data[x][2];
                    xValues.push(orbit + ' | ' + instrument + " ");
                    yValues.push(parseFloat(value));
                    value = (Math.abs(value * 100)).toFixed(1);
                    let text = '<b>Design Decision</b><br>' + 'Assinging ' + instrument + ' to orbit ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                    hover_text.push(text);
                }

                let plot_data = [{
                    x: xValues,
                    y: yValues,
                    "type": 'bar',
                    "marker": {'color': '#3273dc'},
                    "hoverinfo": "text",
                    "hovertext": hover_text,
                }];

                return plot_data;
            },

            plotLayout(){
                let plot_layout = {
                    yaxis: {automargin: true, nticks: 10, tickformat: '%.00'},
                    xaxis: {automargin: true, tickmode: "linear"},
                    margin: {t: 25, l: 55, r: 20,},
                    autosize: true,
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                    hoverlabel: { bgcolor: "#FFF" },
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


        }


    }
</script>

<style scoped>

</style>