<template>
    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto;" id="teacher-window">

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
                                <select v-model="selectedSubject" v-on:change="printPlotData">
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
                    <div>
                        <div class="field is-horizontal">
                            <button class="button is-link" title="" v-bind:class="{selectedButton: feature_one_selected}" v-on:click="changeFeature(0)">Feature 1</button>
                        </div>
                        <div class="field is-horizontal">
                            <button class="button is-link" title="" v-bind:class="{selectedButton: feature_two_selected}" v-on:click="changeFeature(1)">Feature 2</button>
                        </div>
                        <div class="field is-horizontal">
                            <button class="button is-link" title="" v-bind:class="{selectedButton: feature_three_selected}" v-on:click="changeFeature(2)">Feature 3</button>
                        </div>
                        <div class="field is-horizontal">
                            <button class="button is-link" title="" v-bind:class="{selectedButton: feature_four_selected}" v-on:click="changeFeature(3)">Feature 4</button>
                        </div>
                        <div class="field is-horizontal">
                            <button class="button is-link" title="" v-bind:class="{selectedButton: feature_five_selected}" v-on:click="changeFeature(4)">Feature 5</button>
                        </div>
                    </div>
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
                    <div>
                        <button class="button is-link" title="Click me to load the nearest architecture into the Design Builder!" v-on:click="loadSuggestion">Load Suggestion</button>
                    </div>
                </template>
                <!-- Objective Space -->

            </div>
        </div>

        <!-- Right Column: This view will depend on the subject selected -->
        <div class="panel-block functionality" style="padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;"  ref="teacherContentWindow">

            <!-- Features -->
            <template v-if="selectedSubject === 'Features' && teacherFeatures !== null && feature_selected === true">
                <div>
                    <feature-model v-bind:isClickable="false" v-bind:featureDetails="currentFeature"></feature-model>
                </div>
            </template>
            <!-- Features -->

            <!-- Sensitivities -->
            <template v-if="selectedSubject === 'Sensitivities'">
                <div style="width: 100%; align-items: flex-start; overflow-x: hidden;" ref="sensitivitiesChartArea">
                    <vue-plotly :data="sensitivityPlotData" :layout="sensitivityPlotLayout" :options="{displayModeBar: false}" v-on:hover="highlightSensitivityData" v-on:unhover="unhighlightSensitivityData"  v-on:click="toggleSensitivityDesignDecision"/>
                </div>
            </template>
            <!-- Sensitivities -->

            <!-- Design Space -->
            <template v-if="selectedSubject === 'Design Space'">
                <div style="width: 100%; align-items: flex-start; overflow-x: hidden;" ref="designSpaceChartArea">
                    <vue-plotly :data="designSpacePlotData" :layout="designSpacePlotLayout" :options="{displayModeBar: false}" v-on:hover="highlightDesignSpaceData" v-on:unhover="unhighlightDesignSpaceData"  v-on:click="toggleDesignSpaceDesignDecision"/>
                </div>
            </template>
            <!-- Design Space -->

            <!-- Objective Space -->
            <template v-if="selectedSubject === 'Objective Space'">
                <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 100%;">
                    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow-x: hidden; width: 100%;">
                        <vue-plotly :data="objectiveSpacePlotData" :layout="objectiveSpacePlotLayout" :options="{displayModeBar: false}"/>
                    </div>
                </div>
            </template>
            <!-- Objective Space -->


        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { indexValueToTriple } from '../store/modules/teacher-agent'
    import { getDesignIndex } from '../scripts/utils'
    import VuePlotly from '@statnett/vue-plotly'
    import FeatureModel from "./FeatureModel";
    import isEmpty from "lodash-es/isEmpty";
    export default {
        name: "teacher-agent",

        data() {
            return {
                feature_one_selected: false,
                feature_two_selected: false,
                feature_three_selected: false,
                feature_four_selected: false,
                feature_five_selected: false,
                feature_selected: false,
                feature_index: 0,

                objective_plot_layout: {},
                suggested_design: {},
                mark_suggested_design: false,
                recompute_objective_region: false,

                resizeDesignSpacePlot: 0,
                resizeSensitivityPlot: 0,
                resizeObjectiveSpacePlot: 0,

                hoveredSensitivityX: [],
                hoveredDesignSpaceX: [],

                data_is_set: false,
            }
        },

        components: {
            VuePlotly,
            'feature-model': FeatureModel,
        },

        computed: {

            ...mapState({
                plotData: state => state.tradespacePlot.plotData,
                selectedArchs: state => state.tradespacePlot.selectedArchs, // getSelectedArchs
                features: state => state.dataMining.features,
                teacherFeatures: state => state.teacherAgent.all_features,
                plotWidth: state => state.teacherAgent.plotWidth,
                plotHeight: state => state.teacherAgent.plotHeight,
                scores: state => state.dataMining.scores,
                clickedArchInputs: state => state.tradespacePlot.clickedArchInputs,
            }),

            // ---------------------------------------------------------
            // ------------------------ GENERAL ------------------------
            // ---------------------------------------------------------
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

            contentWindowRef: {
                get() {
                    return this.$refs.teacherContentWindow;
                }
            },

            // -------------------------------------------------------
            // ----------------------- FEATURES ----------------------
            // -------------------------------------------------------
            currentFeature() {
                return this.teacherFeatures[this.feature_index]['expression'];
            },

            // ---------------------------------------------------------
            // -------------------- OBJECTIVE SPACE --------------------
            // ---------------------------------------------------------
            objectiveSpacePlotData: {
                get() {
                    let resize = this.resizeObjectiveSpacePlot;
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
                            this.recompute_objective_region = true;
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
                    let annotation_x_position = low_science;
                    let annotation_y_position = high_cost;
                    let annotation_text = '<b>Unexplored Region</b>';
                    let plot_annotations = [
                        {
                            x: annotation_x_position, y: annotation_y_position,
                            xref: 'x', yref: 'y',
                            text: annotation_text,
                            align:"center",
                            showarrow: true,
                            arrowhead:2, arrowsize:1, arrowwidth:2, arrowcolor:"#636363",
                            font: {family : "Courier New, monospace", size : 12, color : "#1a1717"},
                            ax: -45, ay: -60,
                            bordercolor:"#c7c7c7", borderwidth:2, borderpad:4, bgcolor:"#fff",
                            clicktoshow: 'onoff',
                            visible: true,
                        }
                    ];

                    //--> LAYOUT
                    let width = this.plotWidth;
                    let height = this.plotHeight;
                    if(this.contentWindowRef !== undefined){
                        width = this.contentWindowRef.clientWidth;
                        height = this.contentWindowRef.clientHeight;
                    }
                    let layout = {
                        title: "Objective Space",
                        shapes: shapes,
                        xaxis: {title: 'Science'}, yaxis: {range: [0, 6000], title: 'Cost'},
                        margin: {l: 60, t: 45, r: 20, b: 45},
                        autosize: true,
                        width: width,
                        height: height,
                        annotations: plot_annotations,
                        showlegend: false,
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
                    let colors = [];

                    if(order === 'First Order'){
                        data = this.all_sensitivities[objective]['S1_mins'].slice(0, num_to_show);
                        let xValues = [];
                        let yValues = [];
                        for(var x = 0; x < data.length; x++){
                            let orbit = data[x][0];
                            let instrument = data[x][1];
                            let value = data[x][2];
                            let xVal = orbit + ' | ' + instrument + " ";
                            let yVal = (Math.abs(parseFloat(value)));
                            xValues.push(xVal);
                            yValues.push(yVal);
                            value = (Math.abs(value * 100)).toFixed(1);
                            let text = '<b>Design Decision</b><br>' + 'Assinging ' + instrument + ' to orbit ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                            hover_text.push(text);
                            if(this.hoveredSensitivityX.includes(xVal)){
                                colors.push('#13356d');
                            }
                            else{
                                colors.push('#3273dc');
                            }
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            type: 'bar',
                            marker: {'color': colors},
                            hoverinfo: "text",
                            hovertext: hover_text,
                            text: xValues,
                            textposition: 'auto',
                        }];
                    }
                    else if(order === 'Second Order'){   //--> Second Order
                        data = this.all_sensitivities[objective]['S2'];
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
                            let xVal = orbit + ' | ' + instrument + " ";
                            let yVal = (Math.abs(parseFloat(value)));
                            xValues.push(xVal);
                            yValues.push(yVal);
                            value = (Math.abs(value * 100)).toFixed(1);
                            let text = '<b>Design Decision</b><br>' + 'When ' + this.sensitivityInstrument + ' is assigned to ' + this.sensitivityOrbit + ',<br>' + 'assinging ' + instrument + ' to ' + orbit + '<br> is responsible for ' + value + '% of ' + objective + ' variance';
                            hover_text.push(text);
                            if(this.hoveredSensitivityX.includes(xVal)){
                                colors.push('#13356d');
                            }
                            else{
                                colors.push('#3273dc');
                            }
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            type: 'bar',
                            marker: {'color': colors},
                            hoverinfo: "text",
                            hovertext: hover_text,
                            text: xValues,
                            textposition: 'auto',
                        }];

                    }


                    return plotData;
                },
            },   //--> Plotly Data

            sensitivityPlotLayout: {
                get() {
                    let resize = this.resizeSensitivityPlot;
                    let hover = this.hoveredSensitivityX;
                    let order = this.sensitivityOrder;
                    let num_to_show = this.numSensitivitiesToShow;
                    let objective = this.sensitivitiesObjective;
                    let plotLayout = {};
                    if(order === 'First Order'){}
                    else if(order === 'Second Order'){}
                    let width = this.plotWidth;
                    let height = this.plotHeight;
                    if(this.contentWindowRef !== undefined){
                        width = this.contentWindowRef.clientWidth;
                        height = this.contentWindowRef.clientHeight;
                    }
                    plotLayout = {
                        title: 'Sensitivity Analysis',
                        yaxis: {automargin: true, nticks: 10, tickformat: '%.00'},
                        xaxis: {automargin: true, tickmode: "linear", showticklabels: false},
                        margin: {l: 60, t: 45, r: 20, b: 45},
                        autosize: true,
                        width: width,
                        height: height,
                        hoverlabel: { bgcolor: "#FFF" },
                        plot_bgcolor:"whitesmoke", paper_bgcolor:"whitesmoke",
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
                    let colors = [];

                    if(this.designSpaceLevel === 'Level One'){
                        //--> state.level_one_design_space_info
                        data = this.designSpaceInfo['level_one_analysis'].slice(0, num_to_show);
                        for(let x = 0; x < num_to_show; x++){
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
                            if(this.hoveredDesignSpaceX.includes(xVal)){
                                colors.push('#13356d');
                            }
                            else{
                                colors.push('#3273dc');
                            }
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            type: 'bar',
                            marker: {'color': colors},
                            hoverinfo: "text",
                            hovertext: hover_text,
                            text: xValues,
                            textposition: 'auto',
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
                            let xVal = orbit + " | " + instrument + " ";
                            let yVal = percent_data;
                            xValues.push(xVal);
                            yValues.push(yVal);
                            let text = '<b>Design Decision</b><br>' + percent_text + '% of designs contain<br>' + instrument + ' assigned to ' + orbit + '<br>when<br>' + this.designSpaceInstrument + ' is assigned to ' + this.designSpaceOrbit;
                            hover_text.push(text);
                            if(this.hoveredDesignSpaceX.includes(xVal)){
                                colors.push('#13356d');
                            }
                            else{
                                colors.push('#3273dc');
                            }
                        }
                        plotData = [{
                            x: xValues,
                            y: yValues,
                            type: 'bar',
                            marker: {'color': colors},
                            hoverinfo: "text",
                            hovertext: hover_text,
                            text: xValues,
                            textposition: 'auto',
                        }];
                    }



                    return plotData;
                },
            },

            designSpacePlotLayout: {
                get() {
                    let resize = this.resizeDesignSpacePlot;
                    let hover = this.hoveredDesignSpaceX;
                    let plotLayout = {};
                    let data = {};
                    if(this.designSpaceLevel === 'Level One'){
                        data = this.designSpaceInfo['level_one_analysis'];
                    }
                    else if(this.designSpaceLevel === 'Level Two'){
                        if(this.designSpaceOrbit === '' || this.designSpaceInstrument === ''){
                            return plotLayout;
                        }
                        data = this.designSpaceInfo['level_two_analysis'][this.designSpaceOrbit][this.designSpaceInstrument];
                    }
                    let max_percent = 0;
                    for(let x = 0; x < 10; x++) {
                        let percent = (parseFloat(data[x]['percent']) / 100.0).toFixed(2);
                        if(percent > max_percent){
                            max_percent = percent;
                        }
                    }
                    let upper_bound = 0;
                    if((max_percent + 0.2) > 1){
                        upper_bound = 1;
                    }
                    else{
                        upper_bound = max_percent * 1.2;
                    }
                    let width = this.plotWidth;
                    let height = this.plotHeight;
                    if(this.contentWindowRef !== undefined){
                        width = this.contentWindowRef.clientWidth;
                        height = this.contentWindowRef.clientHeight;
                    }
                    plotLayout = {
                        title: 'Design Space Analysis',
                        yaxis: {automargin: true, nticks: 10, tickformat: '%.00', range: [0,upper_bound], zeroline: true, showgrid: true},
                        xaxis: {automargin: true, tickmode: "linear", zeroline: true, showticklabels: false},
                        hoverlabel: { bgcolor: "#FFF" },
                        autosize: true,
                        width: width,
                        height: height,
                        margin: {l: 60, t: 45, r: 20, b: 45},
                        plot_bgcolor:"whitesmoke", paper_bgcolor:"whitesmoke",
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
            printPlotData(){
                // console.log(this.plotData);
                // console.log(typeof this.plotData);
            },

            changeFeature(index) {
                let feature_selected = [false, false, false, false, false];
                feature_selected[index] = true;
                this.feature_one_selected = feature_selected[0];
                this.feature_two_selected = feature_selected[1];
                this.feature_three_selected = feature_selected[2];
                this.feature_four_selected = feature_selected[3];
                this.feature_five_selected = feature_selected[4];
                this.feature_index = index;
                this.feature_selected = true;
            },

            resizeRefresh() {
                if(this.contentWindowRef !== undefined){
                    this.$store.commit('setPlotWidth', this.contentWindowRef.clientWidth);
                    this.$store.commit('setPlotHeight', this.contentWindowRef.clientHeight);
                }
                this.resizeDesignSpacePlot += 1;
                this.resizeObjectiveSpacePlot += 1;
                this.resizeSensitivityPlot += 1;
            },

            stopProactiveTeacherOnReload() {
                this.$store.dispatch('turnProactiveTeacherOff');
            },

            highlightSensitivityData(data) {
                //--> Clear hovered data (only one can be hovered over at a time)
                this.hoveredSensitivityX = [];
                //--> Store x data as the identifier
                this.hoveredSensitivityX.push(data['points'][0]['x'])
            },

            unhighlightSensitivityData(data) {
                let x = data['points'][0]['x'];
                let index = this.hoveredSensitivityX.indexOf(x);
                if(index !== -1){
                    this.hoveredSensitivityX.splice(index,1);
                }
            },

            highlightDesignSpaceData(data) {
                //--> Clear hovered data (only one can be hovered over at a time)
                this.hoveredDesignSpaceX = [];
                //--> Store x data as the identifier
                this.hoveredDesignSpaceX.push(data['points'][0]['x'])
            },

            unhighlightDesignSpaceData(data) {
                let x = data['points'][0]['x'];
                let index = this.hoveredDesignSpaceX.indexOf(x);
                if(index !== -1){
                    this.hoveredDesignSpaceX.splice(index,1);
                }
            },

            loadSuggestion(){
                if(this.suggested_design !== {}){
                    this.mark_suggested_design = true;
                    this.resizeObjectiveSpacePlot += 1;
                    this.$store.commit("updateClickedArch", this.suggested_design['id']);
                }
            },

            async toggleSensitivityDesignDecision(data) {
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

            async toggleDesignSpaceDesignDecision(data) {
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

        watch: {
            plotData() {
                if(isEmpty(this.plotData) === false && this.data_is_set === false){
                    console.log("Loading Teacher Data");
                    this.$store.commit('setPlotData', this.plotData);
                    this.$store.dispatch('getInformation');
                    // this.$store.dispatch('turnProactiveTeacherOn');
                    this.data_is_set = true;
                }
            },
        },

        created() {

        },

        mounted() {
            this.$store.dispatch('computeOrbitList');         //--> All Orbits
            this.$store.dispatch('computeInstrumentList');    //--> All Instruments
            if(isEmpty(this.plotData) === false){
                console.log("Loading Teacher Data");
                this.$store.commit('setPlotData', this.plotData);
                this.$store.dispatch('getInformation');
                // this.$store.dispatch('turnProactiveTeacherOn');
                this.data_is_set = true;
            }
            window.addEventListener('beforeunload', this.stopProactiveTeacherOnReload);
            window.addEventListener('unload', this.stopProactiveTeacherOnReload);
            window.addEventListener("resize", this.resizeRefresh);
            if(this.contentWindowRef !== undefined){
                this.$store.commit('setPlotWidth', this.contentWindowRef.clientWidth);
                this.$store.commit('setPlotHeight', this.contentWindowRef.clientHeight);
            }
        },

    }
</script>










<style scoped>
    .selectedButton{
        background-color: #13356d !important;
    }

</style>