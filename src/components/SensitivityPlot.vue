<template>

    <div>
        <vue-plotly :data="computeSensitivityPlotData" :layout="computeSensitivityPlotLayout" :options="{modeBarButtonsToRemove: ['toImage',
                                                                                                                                   'sendDataToCloud',
                                                                                                                                   'editInChartStudio',
                                                                                                                                   'lasso2d',
                                                                                                                                   'hoverCompareCartesian',
                                                                                                                                   'hoverClosestCartesian',
                                                                                                                                   'toggleSpikelines']}"/>
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
            }
        },


        computed: {

            ...mapGetters({
                s1_cost_mins: 'get_s1_cost_mins',
                s1_science_mins: 'get_s1_science_mins',

            }),

            computeSensitivityPlotData(){

                let yValuesCost = [];
                let xValuesCost = [];
                let yValuesScience = [];
                let xValuesScience = [];
                for(var x = 0; x < this.s1_cost_mins.length; x++) {
                    xValuesCost.push(this.s1_cost_mins[x][0] + " - " + this.s1_cost_mins[x][1] + " ");
                    yValuesCost.push(parseFloat(this.s1_cost_mins[x][2]));

                    xValuesScience.push(this.s1_science_mins[x][0] + " - " + this.s1_science_mins[x][1] + " ");
                    yValuesScience.push(parseFloat(this.s1_science_mins[x][2]));
                }

                let cost_data = [{
                    x: xValuesCost,
                    y: yValuesCost,
                    // "orientation": 'h',
                    "type": 'bar',
                    "marker": {'color': '#209cee'},
                }];

                let science_data = [{
                    x: xValuesScience,
                    y: yValuesScience,
                    // "orientation": 'h',
                    "type": 'bar',
                    "marker": {'color': '#209cee'},
                }];


                //--> return: cost_data or science_data
                if(this.objective_cost){
                    return cost_data;
                }
                else{
                    return science_data
                }
            },


            computeSensitivityPlotLayout(){
                let yValuesCost = [];
                let xValuesCost = [];
                let yValuesScience = [];
                let xValuesScience = [];
                for(var x = 0; x < this.s1_cost_mins.length; x++) {
                    yValuesCost.push(this.s1_cost_mins[x][0] + " - " + this.s1_cost_mins[x][1] + " ");
                    xValuesCost.push(parseFloat(this.s1_cost_mins[x][2]));

                    yValuesScience.push(this.s1_science_mins[x][0] + " - " + this.s1_science_mins[x][1] + " ");
                    xValuesScience.push(parseFloat(this.s1_science_mins[x][2]));
                }
                let cost_layout = {
                    title: 'First Order Sensitivities - Cost',
                    yaxis: {automargin: true, nticks: 10},
                    xaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                    autosize: true,
                    plot_bgcolor:"black",
                };
                let science_layout = {
                    title: 'First Order Sensitivities - Science',
                    yaxis: {automargin: true, nticks: 10},
                    xaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                    autosize: true,
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                };
                //--> return: cost_layout or science_layout
                if(this.objective_cost){
                    return cost_layout;
                }
                else{
                    return science_layout
                }
            },







        },
    }
</script>

<style scoped>

</style>