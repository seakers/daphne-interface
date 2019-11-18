<template>
    <div>
        <div style="">
            <ul>
                <li>Creating designs with uncommon design decisions promotes diversity and can lead to new discoveries.
                    Hover over the plot to see the least common design decisions</li>
            </ul>
        </div>
        <vue-plotly :data="computeDesignSpacePlotData" :layout="computeDesignSpacePlotLayout" :options="{displayModeBar: false}"/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from '../scripts/utils';
    export default {
        name: "DesignSpacePlot",
        components: {
            VuePlotly
        },
        computed: {

            ...mapGetters({
                all_design_space_info: 'get_all_design_space_info',
            }),


            computeDesignSpacePlotData() {
                //--> Get list of orb / inst names
                let data = this.all_design_space_info["level_one_analysis"];


                let xValues = [];
                let yValues = [];
                let hover_text = [];
                for(let x = 0; x < 10; x++) {
                    let percent_text = (parseFloat(data[x]['percent'])).toFixed(1);
                    let percent_data = (parseFloat(data[x]['percent']) / 100.0).toFixed(5);
                    let orbit = data[x]['orbit'];
                    let instrument = data[x]['instrument'];
                    xValues.push( (orbit + " | " + instrument + " ") );
                    yValues.push(percent_data);
                    let text = '<b>Design Decision</b><br>' + instrument + ' is assigned to ' + orbit + ' <br>in ' + percent_text + '% of designs';
                    hover_text.push(text);
                }
                //--> Plot Data
                let histogram_data = [{
                    "x": xValues,
                    "y": yValues,
                    "type": 'bar',
                    "marker": {'color': '#3273dc'},
                    "hoverinfo": "text",
                    "hovertext": hover_text,
                }];
                return histogram_data;
            },




            computeDesignSpacePlotLayout() {
                let data = this.all_design_space_info["level_one_analysis"];

                let max_percent = 0;
                for(let x = 0; x < 10; x++) {
                    let percent = (parseFloat(data[x]['percent']) / 100.0).toFixed(2);
                    if(percent > max_percent){
                        max_percent = percent;
                    }
                }

                let upper_bound = 0;
                if((max_percent + 0.1) > 1){
                    upper_bound = 1;
                }
                else{
                    upper_bound = max_percent + 0.1;
                }

                let histogram_layout = {
                    yaxis: {automargin: true, nticks: 10, tickformat: '%.00', range: [0,upper_bound], zeroline: true, showgrid: true},
                    xaxis: {automargin: true, tickmode: "linear", zeroline: true},
                    autosize: true,
                    hoverlabel: { bgcolor: "#FFF" },
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                    margin: {t: 25, l: 55, r: 20,},
                };
                return histogram_layout
            },



        },
    }
</script>

<style scoped>

</style>