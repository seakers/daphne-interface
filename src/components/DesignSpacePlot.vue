<template>
    <div>
        <div style="margin-bottom: 7px; text-align: center; border-bottom: 1px solid #dbdbdb;"><b>Teacher</b></div>
        <div style="">
            I have found information on the design space! Here is a plot of the least seen design decisions by percent
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
                all_level_one_design_space_info: 'get_all_level_one_design_space_info',

                level_one_design_space_plot: 'get_level_one_design_space_plot',
                level_one_design_space_plot_layout: 'get_level_one_design_space_plot_layout',
            }),


            computeDesignSpacePlotData() {
                //--> Get list of orb / inst names
                let xValues = [];
                let yValues = [];
                for(let x = 0; x < 10; x++) {
                    xValues.push( (this.all_level_one_design_space_info[x]['orbit'] + " - " + this.all_level_one_design_space_info[x]['instrument'] + " ") );
                    yValues.push( parseFloat(this.all_level_one_design_space_info[x]['percent']) / 100.0)
                }

                //--> Create the level one histogram
                let histogram_data = [{
                    "x": xValues,
                    "y": yValues,
                    "type": 'bar',
                    "marker": {'color': '#209cee'},
                }];
                return histogram_data;
            },


            computeDesignSpacePlotLayout() {
                let histogram_layout = {
                    title: 'Least Seen Design Decisions',
                    yaxis: {automargin: true, nticks: 10, title: {text: 'Seen'}, tickformat: '%', range: [0,1]},
                    xaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                    autosize: true,
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                };
                return histogram_layout
            },



        },
    }
</script>

<style scoped>

</style>