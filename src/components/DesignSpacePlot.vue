<template>
    <div>
        <div style="">
            <ul>
                <li>Creating designs with uncommon design decisions fosters diversity.
                    Click on one of the design decisions in the plot to add it to your current design</li>
            </ul>
        </div>
        <vue-plotly :data="computeDesignSpacePlotData" :layout="computeDesignSpacePlotLayout" :options="{displayModeBar: false, responsive: true}" v-on:click="addDesignDecision" v-on:hover="highlightData" v-on:unhover="unhighlightData"/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { mapState } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    import { getDesignIndex } from '../scripts/utils'
    export default {
        name: "DesignSpacePlot",

        data() {
            return {
                height: 350,
                hoveredX: [],
                resize: 0,
            }
        },

        components: {
            VuePlotly
        },
        computed: {

            ...mapGetters({
                all_design_space_info: 'get_all_design_space_info',
            }),
            ...mapState({
                clickedArchInputs: state => state.tradespacePlot.clickedArchInputs,
            }),


            computeDesignSpacePlotData() {
                //--> Get list of orb / inst names
                let data = this.all_design_space_info["level_one_analysis"];


                let xValues = [];
                let yValues = [];
                let hover_text = [];
                let colors = [];
                for(let x = 0; x < 5; x++) {
                    let percent_text = (parseFloat(data[x]['percent'])).toFixed(1);
                    let percent_data = (parseFloat(data[x]['percent']) / 100.0).toFixed(5);
                    let orbit = data[x]['orbit'];
                    let instrument = data[x]['instrument'];
                    let xVal = orbit + " | " + instrument + " ";
                    let yVal = percent_data;
                    xValues.push(xVal);
                    yValues.push(yVal);
                    let text = '<b>Design Decision</b><br>' + instrument + ' is assigned to ' + orbit + ' <br>in ' + percent_text + '% of designs';
                    hover_text.push(text);
                    if(this.hoveredX.includes(xVal)){
                        colors.push('#13356d');
                    }
                    else{
                        colors.push('#3273dc');
                    }
                }
                //--> Plot Data
                let histogram_data = [{
                    x: xValues,
                    y: yValues,
                    type: 'bar',
                    marker: {'color': colors},
                    hoverinfo: "text",
                    hovertext: hover_text,
                    text: xValues,
                    textposition: 'auto',
                }];
                return histogram_data;
            },

            computeDesignSpacePlotLayout() {
                let data = this.all_design_space_info["level_one_analysis"];
                let refresh = this.hoveredX;
                let resize = this.resize;

                let max_percent = 0;
                for(let x = 0; x < 5; x++) {
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
                upper_bound = max_percent * 1.40;

                let histogram_layout = {
                    yaxis: {automargin: true, nticks: 10, tickformat: '%.00', range: [0,upper_bound], zeroline: true, showgrid: true, title: 'decision rate'},
                    xaxis: {automargin: true, tickmode: "linear", zeroline: true, showticklabels: false},
                    height: 350,
                    autosize: true,
                    hoverlabel: { bgcolor: "#FFF" },
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                    margin: {l: 55, r: 45, t:20},
                };
                return histogram_layout
            },
        },

        methods: {
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
            async addDesignDecision(data) {
                let expression = data['points'][0]['x'];
                let orbit = expression.split('|')[0];
                let instrument = expression.split('|')[1];
                orbit = orbit.trim();
                instrument = instrument.trim();
                let index = await getDesignIndex(orbit, instrument, "SMAP");
                let current_design = [...this.clickedArchInputs];
                if(current_design[index] === false){
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