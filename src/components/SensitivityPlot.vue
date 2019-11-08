<template>

    <div>
        <div style="margin-bottom: 7px; text-align: center; border-bottom: 1px solid #dbdbdb;"><b>Teacher</b></div>
        <div style="padding-bottom: 10px;">
            I have found information on first order design sensitivities! Use the dropdown to select your objective..
        </div>
        <div class="control">
            <div class="select is-fullwidth">
                <select v-on:change="changeObjective" v-model="objective">
                    <option>Science Sensitivities</option>
                    <option>Cost Sensitivities</option>
                </select>
            </div>
        </div>
        <vue-plotly :data="computeSensitivityPlotData" :layout="computeSensitivityPlotLayout" :options="{displayModeBar: false}"/>
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
                objective: 'Science Sensitivities',
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
                    "type": 'bar',
                    "marker": {'color': '#209cee'},
                }];
                let science_data = [{
                    x: xValuesScience,
                    y: yValuesScience,
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
                let cost_layout = {
                    title: 'First Order Sensitivities - Cost',
                    yaxis: {automargin: true, nticks: 10},
                    xaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                    autosize: true,
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
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

        methods: {
            changeObjective() {
                console.log(this.objective);
                if(this.objective === "Science Sensitivities"){
                    this.objective_cost = false;
                }
                else if(this.objective === "Cost Sensitivities"){
                    this.objective_cost = true;
                }
            },


        }


    }
</script>

<style scoped>

</style>