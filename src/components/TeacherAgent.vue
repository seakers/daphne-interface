<template>
    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto;">

        <!-- Left Column: Topic interface -->
        <div class="panel-block" style="align-items: flex-start; flex-direction: column;">

            <!-- Topic Picker -->
            <div class="field is-horizontal" style="padding-bottom: 8px; border-bottom: 1px solid #dbdbdb;">
                <div class="field-label is-normal">
                    <label class="label">Topic</label>
                </div>
                <div class="field-body">
                    <div class="field is-narrow">
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-on:change="teachSubject" v-model="selectedSubject">
                                    <option>Features</option>
                                    <option>Sensitivities</option>
                                    <option>Design Space</option>
                                    <option>Objective Space</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Topic Interface -->
            <div style="padding-top: 8px; flex-direction: column;">

                <!-- Features -->
                <template v-if="selectedSubject === 'Features'">
                    Features
                </template>
                <!-- Features -->

                <!-- Sensitivities -->
                <template v-if="selectedSubject === 'Sensitivities'">
                    <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                        <div class="field-label is-normal">
                            <label class="label">Analysis</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="sensitivityOrder">
                                            <option>First Order</option>
                                            <option>Second Order</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="sensitivityOrder === 'Second Order'">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Orbit</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="sensitivityOrbit">
                                                <option v-for="orbit in orbitList" v-html="orbit"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                            <div class="field-label is-normal">
                                <label class="label">Instrument</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="sensitivityInstrument">
                                                <option v-for="instrument in instrumentList" v-html="instrument"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Objective</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="sensitivitiesObjective">
                                            <option>science</option><option>cost</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Results</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="numSensitivitiesToShow">
                                            <option>5</option><option>7</option><option>10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
                <!-- Sensitivities -->

                <!-- Design Space -->
                <template v-if="selectedSubject === 'Design Space'">
                    <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                        <div class="field-label is-normal">
                            <label class="label">Analysis</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="designSpaceLevel">
                                            <option>Level One</option>
                                            <option>Level Two</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="designSpaceLevel === 'Level Two'">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Orbit</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="designSpaceOrbit">
                                                <option v-for="orbit in orbitList" v-html="orbit"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                            <div class="field-label is-normal">
                                <label class="label">Instrument</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="designSpaceInstrument">
                                                <option v-for="instrument in instrumentList" v-html="instrument"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Results</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="numDesignSpaceToShow">
                                            <option>5</option><option>7</option><option>10</option><option>15</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Design Space -->

                <!-- Objective Space -->
                <template v-if="selectedSubject === 'Objective Space'">
                </template>
                <!-- Objective Space -->

            </div>
        </div>

        <!-- Right Column: This view will depend on the subject selected -->
        <div class="panel-block functionality" style="padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;">

            <!-- Features -->
            <template v-if="selectedSubject === 'Features'">
                Features
            </template>
            <!-- Features -->

            <!-- Sensitivities -->
            <template v-if="selectedSubject === 'Sensitivities'">
                <div style="padding: 5px; width: 100%; align-items: flex-start; overflow-y: auto;" ref="sensitivitiesChartArea">
                    <vue-plotly :data="sensitivityPlotData" :layout="sensitivityPlotLayout" :options="{displayModeBar: false}"/>
                </div>
            </template>
            <!-- Sensitivities -->

            <!-- Design Space -->
            <template v-if="selectedSubject === 'Design Space'">
                <div style="padding: 5px; width: 100%; align-items: flex-start; overflow-y: auto;" ref="designSpaceChartArea">
                    <vue-plotly :data="designSpacePlotData" :layout="designSpacePlotLayout" :options="{displayModeBar: false}"/>
                </div>
            </template>
            <!-- Design Space -->

            <!-- Objective Space -->
            <template v-if="selectedSubject === 'Objective Space'">
                <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 100%;">
                    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 70%;" ref="objectiveSpacePlotDiv">
                        <vue-plotly :data="objectiveSpacePlotData" :layout="objectiveSpacePlotLayout" :options="{displayModeBar: false}"/>
                    </div>
                </div>
            </template>
            <!-- Objective Space -->


        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';
    import {fetchPost} from "../scripts/fetch-helpers";
    import { indexValueToTriple } from '../store/modules/teacher-agent'
    import VuePlotly from '@statnett/vue-plotly'

    export default {
        name: "teacher-agent",

        data() {
            return {
                objective_plot_layout: {},
            }
        },

        components: {
            VuePlotly
        },

        computed: {

            ...mapGetters({
                plotData: 'getPlotData',
                selectedArchs: 'getSelectedArchs',
                features: 'getFeatures',
                scores: 'getScores'
            }),

            selectedSubject: {
                get() {
                    return this.$store.state.teacherAgent.selectedSubject;
                },
                set(newSubject) {
                    this.$store.commit('setSubject', newSubject);
                }
            },

            orbitList: {
                get() {
                    return this.$store.state.teacherAgent.orbitList;
                }
            },

            instrumentList: {
                get() {
                    return this.$store.state.teacherAgent.instrumentList;
                }
            },

            // ---------------------------------------------------------
            // -------------------- OBJECTIVE SPACE --------------------
            // ---------------------------------------------------------
            objectiveSpacePlotData: {
                get() {
                    let data = this.allObjectiveSpaceInfo['0']['1'];
                    let groups = [];
                    for(let x = 0; x < data.length; x++) {
                        if(data[x].length === 0) {
                            continue;
                        }
                        groups.push(data[x]);
                    }
                    let plot_data = [];          //--> Dict for each group
                    let shapes = [];             //--> Dict for each group
                    let group_data_compute = []; //--> Data about each group
                    for(let y = 0; y < groups.length; y++) {
                        let arches = groups[y];
                        let compute_data = {};

                        let xValues = [];
                        let yValues = [];
                        for (let z = 0; z < arches.length; z++) { //--> Iterate over each architecture in a group
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
                        compute_data = {
                            'low_x': Math.min(...xValues),
                            'high_x': Math.max(...xValues),
                            'low_y': Math.min(...yValues),
                            'high_y': Math.max(...yValues)
                        };
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
                    let low_science =  parseFloat((group_data_compute[gap_index[0]]['high_x'] + (max_difference*0.1)).toFixed(2));
                    let high_science = parseFloat((group_data_compute[gap_index[1]]['low_x'] - (max_difference*0.1)).toFixed(2));
                    let low_cost = parseFloat((group_data_compute[gap_index[0]]['low_y']).toFixed(0));
                    let high_cost = parseFloat((group_data_compute[gap_index[1]]['high_y']).toFixed(0));
                    let unexplored_shape = {
                        type: 'square',
                        xref: 'x', yref: 'y',
                        x0: low_science, y0: low_cost,
                        x1: high_science, y1: high_cost,
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
                    let suggested_design = target_design; //--> SUGGESTED DESIGN
                    //--> Evaluated Architectures
                    let xEvaluated_in_region = [];
                    let yEvaluated_in_region = [];
                    let xEvaluated_out_region = [];
                    let yEvaluated_out_region = [];
                    for(let x = 0; x < this.evaluated_architectures.length; x++){
                        let x_val = this.evaluated_architectures[x]['outputs'][0];
                        let y_val = this.evaluated_architectures[x]['outputs'][1];
                        if(x_val >= low_science && x_val <= high_science && y_val >= low_cost && y_val <= high_cost){
                            xEvaluated_in_region.push(x_val);
                            yEvaluated_in_region.push(y_val);
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
                    let annotation_x_position = (((high_science - low_science) / 2) + low_science);
                    let annotation_y_position = this.high_cost;
                    let annotation_text = '<b>Unexplored Region</b><br>Science: ' + low_science.toString() + ' - ' + high_science.toString();
                    let plot_annotations = [
                        {
                            x: annotation_x_position, y: annotation_y_position,
                            xref: 'x', yref: 'y',
                            text: annotation_text,
                            align:"center",
                            showarrow: true,
                            arrowhead:2, arrowsize:1, arrowwidth:2, arrowcolor:"#636363",
                            font: {family : "Courier New, monospace", size : 12, color : "#ffffff"},
                            ax: 0, ay: -60,
                            bordercolor:"#c7c7c7", borderwidth:2, borderpad:4, bgcolor:"#ff7f0e",
                            clicktoshow: 'onoff',
                            visible: false,
                        }
                    ];

                    //--> Plot Layout
                    let layout = {
                        shapes: shapes,
                        xaxis: {title: 'Science'}, yaxis: {range: [0, 6000], title: 'Cost'},
                        margin: {t: 25, l: 55, r: 20,},
                        annotations: plot_annotations,
                        showlegend: false,
                        width:450,
                        plot_bgcolor:"whitesmoke", paper_bgcolor:"whitesmoke",
                    };

                    this.objective_plot_layout = layout;
                    return plot_data;
                }
            },

            objectiveSpacePlotLayout: {
                get() {
                    return this.objective_plot_layout;
                },
            },

            evaluated_architectures: {
                get() {
                    return this.$store.state.teacherAgent.evaluated_architectures;
                },
            },

            allObjectiveSpaceInfo: {
                get() {
                    return this.$store.state.teacherAgent.all_objective_space_info;
                },
            },

            // -------------------------------------------------------
            // -------------------- SENSITIVITIES --------------------
            // -------------------------------------------------------
            sensitivityPlotData: {
                get() {
                    let order = this.sensitivityOrder;
                    let num_to_show = this.numSensitivitiesToShow;
                    let objective = this.sensitivitiesObjective;

                    let data = {};
                    let plotData = [];
                    let hover_text = [];

                    if(order === 'First Order'){
                        data = this.all_sensitivities[objective]['S1_mins'].slice(0, num_to_show);
                        let xValues = [];
                        let yValues = [];
                        for(var x = 0; x < data.length; x++){
                            let orbit = data[x][0];
                            let instrument = data[x][1];
                            let value = data[x][2];
                            xValues.push(orbit + ' | ' + instrument + " ");
                            yValues.push(parseFloat(value));
                            value = (Math.abs(value * 100)).toFixed(1);
                            let text = '<b>Design Decision</b><br>' + 'Assinging ' + instrument + ' to orbit ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                            hover_text.push(text);
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            "type": 'bar',
                            "marker": {'color': '#3273dc'},
                            "hoverinfo": "text",
                            "hovertext": hover_text,
                        }];
                    }
                    else if(order === 'Second Order'){   //--> Second Order
                        data = this.all_sensitivities[objective]['S2'];
                        console.log(data);
                        let orbitIndex = this.orbitList.indexOf(this.sensitivityOrbit);
                        let instrumentIndex = this.instrumentList.indexOf(this.sensitivityInstrument);
                        if(orbitIndex === -1 || instrumentIndex === -1) {return;}
                        let numOrbits = this.orbitList.length;
                        let numInstruments = this.instrumentList.length;
                        let position = (orbitIndex * numInstruments) + instrumentIndex;
                        let totalElements = numInstruments * numOrbits;
                        let compareArray = [];
                        for(let i = 0; i < totalElements; i++) {
                            if(i === position){continue;}
                            compareArray.push({index: i, value: Number(data[position][i])});
                        }
                        compareArray.sort(function (a, b) {return Math.abs(b.value) - Math.abs(a.value);});
                        let triples = [];
                        for(let x = 0; x < 10; x++) {
                            let indexValuePair = compareArray[x];
                            triples.push(indexValueToTriple(indexValuePair, this.orbitList, this.instrumentList));
                        }
                        let sliced_triples = triples.slice(0, num_to_show);
                        let xValues = [];
                        let yValues = [];
                        for(let y = 0; y < sliced_triples.length; y++){
                            let orbit = sliced_triples[y][0];
                            let instrument = sliced_triples[y][1];
                            let value = sliced_triples[y][2];
                            xValues.push(orbit + ' | ' + instrument + " ");
                            yValues.push(parseFloat(value));
                            value = (Math.abs(value * 100)).toFixed(1);
                            let text = '<b>Design Decision</b><br>' + 'Assinging ' + instrument + ' to orbit ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                            hover_text.push(text);
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            "type": 'bar',
                            "marker": {'color': '#3273dc'},
                            "hoverinfo": "text",
                            "hovertext": hover_text,
                        }];

                    }


                    return plotData;
                },
            },   //--> Plotly Data

            sensitivityPlotLayout: {
                get() {
                    let order = this.sensitivityOrder;
                    let num_to_show = this.numSensitivitiesToShow;
                    let objective = this.sensitivitiesObjective;
                    let plotLayout = {};
                    if(order === 'First Order'){}
                    else if(order === 'Second Order'){}
                    plotLayout = {
                        title: 'Sensitivity Analysis',
                        yaxis: {automargin: true, nticks: 10, tickformat: '%.00'},
                        xaxis: {automargin: true, tickmode: "linear"},
                        margin: {t: 25, l: 55, r: 20,},
                        autosize: true,
                        hoverlabel: { bgcolor: "#FFF" },
                    };
                    return plotLayout;
                },
            }, //--> Plotly Layout

            sensitivityOrder: {
                get() {
                    return this.$store.state.teacherAgent.sensitivityOrder;
                },
                set(sensitivityOrder) {
                    this.$store.commit('setSensitivityOrder', sensitivityOrder);
                }
            },      //--> First Order : Second Order

            all_sensitivities: {
                get() {
                    return this.$store.state.teacherAgent.all_sensitivities;
                },
            },     //--> All data required for plots

            sensitivityOrbit: {
                get() {
                    return this.$store.state.teacherAgent.secondOrderOrbit;
                },
                set(secondOrderOrbit) {
                    this.$store.commit('setSecondOrderOrbit', secondOrderOrbit);
                }
            },      //--> Second order orbit

            sensitivityInstrument: {
                get() {
                    return this.$store.state.teacherAgent.secondOrderInstrument;
                },
                set(secondOrderInstrument) {
                    this.$store.commit('setSecondOrderInstrument', secondOrderInstrument);
                }
            }, //--> Second order instrument

            sensitivitiesObjective: {
                get() {
                    return this.$store.state.teacherAgent.sensitivitiesObjective;
                },
                set(sensitivitiesObjective) {
                    this.$store.commit('setSensitivitiesObjective', sensitivitiesObjective);
                }
            },   //--> science : cost

            numSensitivitiesToShow: {
                get() {
                    return this.$store.state.teacherAgent.numSensitivitiesToShow;
                },
                set(numSensitivitiesToShow) {
                    this.$store.commit('setNumSensitivitiesToShow', numSensitivitiesToShow);
                }
            },   //--> 5 : 7 : 10

            // ------------------------------------------------------
            // -------------------- DESIGN SPACE --------------------
            // ------------------------------------------------------
            designSpacePlotData: {
                get() {
                    let xValues = [];
                    let yValues = [];
                    let num_to_show = this.numDesignSpaceToShow;
                    let data = {};

                    let plotData = [];
                    let hover_text = [];

                    if(this.designSpaceLevel === 'Level One'){
                        //--> state.level_one_design_space_info
                        data = this.designSpaceInfo['level_one_analysis'].slice(0, num_to_show);
                        for(let x = 0; x < num_to_show; x++){
                            let percent_text = (parseFloat(data[x]['percent'])).toFixed(1);
                            let percent_data = (parseFloat(data[x]['percent']) / 100.0).toFixed(5);
                            let orbit = data[x]['orbit'];
                            let instrument = data[x]['instrument'];
                            xValues.push( (orbit + " | " + instrument + " ") );
                            yValues.push(percent_data);
                            let text = '<b>Design Decision</b><br>' + instrument + ' is assigned to ' + orbit + ' <br>in ' + percent_text + '% of designs';
                            hover_text.push(text);
                        }
                        plotData = [{
                            "x": xValues,
                            "y": yValues,
                            "type": 'bar',
                            "marker": {'color': '#3273dc'},
                            "hoverinfo": "text",
                            "hovertext": hover_text,
                        }];
                    }
                    else if(this.designSpaceLevel === 'Level Two'){
                        let orbitIndex = this.orbitList.indexOf(this.designSpaceOrbit);
                        let instrumentIndex = this.instrumentList.indexOf(this.designSpaceInstrument);
                        if(orbitIndex === -1 || instrumentIndex === -1) {
                            return;
                        }
                        //--> state.level_two_design_space_info
                        data = this.designSpaceInfo['level_two_analysis'][this.designSpaceOrbit][this.designSpaceInstrument].slice(0, num_to_show);
                        for(let x = 0; x < num_to_show; x++) {
                            let percent_text = (parseFloat(data[x]['percent'])).toFixed(1);
                            let percent_data = (parseFloat(data[x]['percent']) / 100.0).toFixed(5);
                            let orbit = data[x]['orbit'];
                            let instrument = data[x]['instrument'];
                            xValues.push( (orbit + " | " + instrument + " ") );
                            yValues.push(percent_data);
                            let text = '<b>Design Decision</b><br>' + instrument + ' is assigned to ' + orbit + ' <br>in ' + percent_text + '% of designs';
                            hover_text.push(text);
                        }
                        plotData = [{
                            "x": xValues,
                            "y": yValues,
                            "type": 'bar',
                            "marker": {'color': '#3273dc'},
                            "hoverinfo": "text",
                            "hovertext": hover_text,
                        }];
                    }



                    return plotData;
                },
            },

            designSpacePlotLayout: {
                get() {
                    let plotLayout = {};
                    let data = {};
                    if(this.designSpaceLevel === 'Level One'){
                        data = this.designSpaceInfo['level_one_analysis'];
                    }
                    else if(this.designSpaceLevel === 'Level Two'){
                        data = this.designSpaceInfo['level_one_analysis'];
                    }
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
                    plotLayout = {
                        title: 'Design Space Analysis',
                        yaxis: {automargin: true, nticks: 10, tickformat: '%.00', range: [0,upper_bound], zeroline: true, showgrid: true},
                        xaxis: {automargin: true, tickmode: "linear", zeroline: true},
                        autosize: true,
                        hoverlabel: { bgcolor: "#FFF" },
                        margin: {t: 25, l: 55, r: 20,},
                    };

                    return plotLayout;
                },
            },

            designSpaceInfo: {
                get() {
                    return this.$store.state.teacherAgent.all_design_space_info;
                },
            },

            designSpaceLevel: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceLevel;
                },
                set(designSpaceLevel) {
                    this.$store.commit('setDesignSpaceLevel', designSpaceLevel);
                }
            },            //--> Level One : Level Two

            designSpaceOrbit: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceOrbit;
                },
                set(designSpaceOrbit) {
                    this.$store.commit('setDesignSpaceOrbit', designSpaceOrbit);
                }
            },            //--> Orbit

            designSpaceInstrument: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceInstrument;
                },
                set(designSpaceInstrument) {
                    this.$store.commit('setDesignSpaceInstrument', designSpaceInstrument);
                }
            },       //--> Instrument

            numDesignSpaceToShow: {
                get() {
                    return this.$store.state.teacherAgent.numDesignSpaceToShow;
                },
                set(numDesignSpaceToShow) {
                    this.$store.commit('setNumDesignSpaceToShow', numDesignSpaceToShow);
                }
            },        //--> 5 : 7 : 15
        },

        methods: {
            teachSubject(){

                console.log("In TeacherAgent.vue --> method: teachSubject");

                //--> Set all the plot data - this includes all the data for all the architectures
                this.$store.commit('setPlotData', this.plotData);

                //--> Get the appropriate information for each subject
                this.$store.dispatch('getSubjectInformation');
            },

            stopProactiveTeacherOnReload() {
                this.$store.dispatch('turnProactiveTeacherOff');
            },
        },

        watch: {

        },

        created() {
            this.$store.dispatch('computeOrbitList');         //--> All Orbits
            this.$store.dispatch('computeInstrumentList');    //--> All Instruments
            this.$store.commit('setPlotData', this.plotData); //--> All architectures plotted
            this.$store.dispatch('getInformation');
        },
        mounted() {
            //--> We turn off the proactive teacher when the page is closed
            window.addEventListener('beforeunload', this.stopProactiveTeacherOnReload);
            window.addEventListener('unload', this.stopProactiveTeacherOnReload);

            console.log("Teacher Agent mounted, enabling proactive");
            this.$store.dispatch('turnProactiveTeacherOn');
        },
        destroyed() {
            console.log("Teacher Agent destroyed, disabling proactive");
            this.$store.dispatch('turnProactiveTeacherOff');
        },

    }
</script>










<style scoped>

</style>