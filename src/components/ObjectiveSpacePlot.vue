<template>
    <div>
        <div style="margin-bottom: 7px; text-align: center; border-bottom: 1px solid #dbdbdb;"><b>Teacher</b></div>
        <div style="">
            I have found information on the objective space! I recommend exploring designs whose objective values fall in these ranges
        </div>
        <div class="columns" style="margin-top: 5px;">
            <div class="column is-half" style="text-align: center">
                <div style="border-bottom: 1px solid #dbdbdb;"><b>Science</b></div>
                <div>{{ low_science }} - {{ high_science }}</div>
            </div>
            <div class="column is-half" style="text-align: center">
                <div style="border-bottom: 1px solid #dbdbdb;"><b>Cost ($M)</b></div>
                <div>{{ low_cost }} - {{ high_cost }}</div>
            </div>
        </div>
        <vue-plotly :data="plot_data" :layout="plot_layout" :options="{displayModeBar: false}"/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    export default {
        name: "ObjectiveSpacePlot",

        data() {
            return {
                plot_info: [],
                plot_data: {},
                plot_layout:{},
                low_science:'',
                high_science:'',
                low_cost:'',
                high_cost:'',
            }
        },

        components: {
            VuePlotly
        },

        computed: {
            ...mapGetters({
                objective_chat_plot_info: 'get_objective_chat_plot_info',
            }),
        },

        methods: {
            computePlot(){
                let plot_colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#7F00FF', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

                let groups = [];
                for(let x = 0; x < this.plot_info.length; x++) {
                    if(this.plot_info[x].length === 0) {
                        continue;
                    }
                    groups.push(this.plot_info[x]);
                }




                let plot_data = [];
                let shapes = [];
                let group_data_compute = [];
                for(let y = 0; y < groups.length; y++){
                    let group_name = "Group " + y.toString();
                    let arches = groups[y];
                    let compute_data = {};

                    let xValues = [];
                    let yValues = [];
                    for(var z = 0; z < arches.length; z++) { //--> Iterate over each architecture in a group
                        xValues.push(arches[z]['outputs'][0]);
                        yValues.push(arches[z]['outputs'][1]);
                    }
                    plot_data.push({
                        x: xValues,
                        y: yValues,
                        mode: 'markers',
                        marker: {color: '#209cee'},
                        name: group_name,
                    });

                    shapes.push({
                        type: 'square',
                        xref: 'x',
                        yref: 'y',
                        x0: Math.min(...xValues),
                        y0: Math.min(...yValues),
                        x1: Math.max(...xValues),
                        y1: Math.max(...yValues),
                        opacity: 0.3,
                        fillcolor: '#209cee',
                        line: {
                            color: '#209cee'
                        },
                    });
                    compute_data = {'low_x': Math.min(...xValues),
                                    'high_x': Math.max(...xValues),
                                    'low_y': Math.min(...yValues),
                                    'high_y': Math.max(...yValues)};
                    group_data_compute.push(compute_data);
                }


                let max_difference = 0;
                let gap_index = [0,1];
                for(let x = 0; x < (group_data_compute.length-1); x++){
                    let group_one = group_data_compute[x];
                    let group_two = group_data_compute[x+1];
                    let difference = group_two['low_x'] - group_one['high_x'];
                    if(difference > max_difference){
                        max_difference = difference;
                        gap_index[0] = x;
                        gap_index[1] = x+1;
                    }
                }


                this.low_science =  parseFloat((group_data_compute[gap_index[0]]['high_x'] + (max_difference*0.1)).toFixed(2));
                this.high_science = parseFloat((group_data_compute[gap_index[1]]['low_x'] - (max_difference*0.1)).toFixed(2));
                this.low_cost = parseFloat((group_data_compute[gap_index[0]]['low_y']).toFixed(0));
                this.high_cost = parseFloat((group_data_compute[gap_index[1]]['high_y']).toFixed(0));
                let unexplored_shape = {
                    type: 'square',
                    xref: 'x',
                    yref: 'y',
                    x0: this.low_science,
                    y0: this.low_cost,
                    x1: this.high_science,
                    y1: this.high_cost,
                    opacity: 0.6,
                    fillcolor: '#ee6820',
                    line: {
                        color: '#ee6820'
                    },
                };
                shapes.push(unexplored_shape);


                let layout = {
                    shapes: shapes,
                    xaxis: {title: 'Science'},
                    yaxis: {range: [0, 6000], title: 'Cost'},
                    margin: {
                        t: 25, //top margin
                        l: 55, //left margin
                        r: 20, //right margin
                        // b: 50 //bottom margin
                    },
                    showlegend: false,
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                };
                this.plot_data = plot_data;
                this.plot_layout = layout;
            },
        },

        created() {
            this.plot_info = this.objective_chat_plot_info;
            this.computePlot();
        },




    }
</script>

<style scoped>

</style>