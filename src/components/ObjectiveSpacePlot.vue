<template>
    <div id="objective-space-teacher-message">
        <div style="">
            <ul>
                <li>
                    Populating empty regions of the pareto front creates a diverse set of designs.
                    Try creating/evaluating designs that are in this region.
                </li>
                <li style="padding-top: 5px;">
                    <button class="button is-link is-small" title="Click me to load the nearest architecture into the Design Builder!" v-on:click="loadSuggestion">Load Suggestion</button>
                </li>
            </ul>
        </div>
        <vue-plotly :data="plot_data" :layout="plot_layout" :options="{displayModeBar: false, responsive: true}"/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    import DesignModel from "./DesignModel";
    export default {
        name: "ObjectiveSpacePlot",

        data() {
            return {
                plot_info: [],
                plot_data: {},
                plot_layout:{},
                plot_height: 300,
                low_science:'',
                high_science:'',
                low_cost:'',
                high_cost:'',
                show_suggestion: false,
                suggested_design: {},
                mark_suggested_design: false,
                objective_completed: false,
            }
        },

        components: {
            VuePlotly,
            'design-model': DesignModel,
        },

        computed: {
            ...mapGetters({
                objective_chat_plot_info: 'get_objective_chat_plot_info',
                evaluated_architectures: 'get_evaluated_architectures',
                orbit_list: 'get_orbit_list',
                instrument_list: 'get_instrument_list',
            }),

        },

        methods: {
            loadSuggestion(){
                if(this.suggested_design !== {}){
                    this.$store.commit("updateClickedArch", this.suggested_design['id']);
                    this.mark_suggested_design = true;
                    this.computePlot();
                }
            },

            computePlot(){
                //--> Remove empty groups
                let groups = [];
                for(let x = 0; x < this.plot_info.length; x++) {
                    if(this.plot_info[x].length === 0) {
                        continue;
                    }
                    groups.push(this.plot_info[x]);
                }


                let plot_data = [];          //--> Dict for each group
                let shapes = [];             //--> Dict for each group
                let group_data_compute = []; //--> Data about each group
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
                        marker: {color: '#708090'},
                        name: 'Given',
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
                        fillcolor: '#708090',
                        line: {
                            color: '#708090'
                        },
                    });
                    compute_data = {'low_x': Math.min(...xValues),
                                    'high_x': Math.max(...xValues),
                                    'low_y': Math.min(...yValues),
                                    'high_y': Math.max(...yValues)};
                    group_data_compute.push(compute_data);
                }

                //--> Compute the unexplored objective region
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
                    xref: 'x', yref: 'y',
                    x0: this.low_science, y0: this.low_cost,
                    x1: this.high_science, y1: this.high_cost,
                    line: {color: 'hsl(141, 53%, 53%)'}, fillcolor: 'hsl(141, 53%, 53%)', opacity: 0.4,
                };
                shapes.push(unexplored_shape);

                //--> Suggested Design
                let target_design = {};
                let low_group = groups[gap_index[0]];
                let high_value = 0;
                for(let x = 0; x < low_group.length; x++){
                    let design = low_group[x];
                    let current_val = design['outputs'][0];
                    if(x === 0){high_value = design['outputs'][0]; target_design = design;}
                    else{
                        if(current_val > high_value){
                            high_value = current_val;
                            target_design = design;
                        }
                    }
                }
                this.suggested_design = target_design;


                if(this.mark_suggested_design === true){
                    let xSuggested = [];
                    let ySuggested = [];
                    xSuggested.push(this.suggested_design['outputs'][0]);
                    ySuggested.push(this.suggested_design['outputs'][1]);
                    plot_data.push({
                        x: xSuggested,
                        y: ySuggested,
                        mode: 'markers',
                        marker: {color: 'red', opacity: 0.99, size: 9, symbol: 'cross-dot'},
                        name: 'Suggested',
                    });
                }


                //--> Evaluated Architectures
                let xEvaluated_in_region = [];
                let yEvaluated_in_region = [];
                let xEvaluated_out_region = [];
                let yEvaluated_out_region = [];
                for(let x = 0; x < this.evaluated_architectures.length; x++){
                    let x_val = this.evaluated_architectures[x]['outputs'][0];
                    let y_val = this.evaluated_architectures[x]['outputs'][1];
                    if(x_val >= this.low_science && x_val <= this.high_science && y_val >= this.low_cost && y_val <= this.high_cost){
                        xEvaluated_in_region.push(x_val);
                        yEvaluated_in_region.push(y_val);
                        this.objective_completed = true;
                    }
                    else{
                        xEvaluated_out_region.push(x_val);
                        yEvaluated_out_region.push(y_val);
                    }
                }
                plot_data.push({
                    x: xEvaluated_out_region,
                    y: yEvaluated_out_region,
                    mode: 'markers',
                    marker: {color: '#3273dc', size: 7},
                    name: 'Evaluated',
                });
                plot_data.push({
                    x: xEvaluated_in_region,
                    y: yEvaluated_in_region,
                    mode: 'markers',
                    marker: {color: 'hsl(141, 53%, 53%)', size: 7},
                    name: 'Evaluated',
                });




                //--> Annotations for unexplored region
                let annotation_x_position = this.low_science;
                let annotation_y_position = this.high_cost;
                let annotation_text = '<b>Region</b>';
                let plot_annotations = [
                    {
                        x: annotation_x_position, y: annotation_y_position,
                        xref: 'x', yref: 'y',
                        text: annotation_text,
                        align:"center",
                        showarrow: true,
                        arrowhead:2, arrowsize:1, arrowwidth:2, arrowcolor:"#636363",
                        font: {family : "Courier New, monospace", size : 10, color : "#1a1717"},
                        ax: -45, ay: -60,
                        bordercolor:"#c7c7c7", borderwidth:2, borderpad:4, bgcolor:"#fff",
                        clicktoshow: 'onoff',
                        visible: true,
                    }
                ];

                //--> Plot Layout
                let layout = {
                    shapes: shapes,
                    xaxis: {title: 'Science'}, yaxis: {range: [0, 6000], title: 'Cost ($M)'},
                    margin: {t: 25, l: 55, r: 20,},
                    annotations: plot_annotations,
                    showlegend: false,
                    height: this.plot_height,
                    plot_bgcolor:"whitesmoke", paper_bgcolor:"whitesmoke",
                };


                this.plot_data = plot_data;
                this.plot_layout = layout;
            },
        },

        created() {
            this.plot_info = this.objective_chat_plot_info;
            this.computePlot();
        },

        watch: {
            evaluated_architectures() {
                this.computePlot();
            }
        }




    }
</script>

<style scoped>

</style>