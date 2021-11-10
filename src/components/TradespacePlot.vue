<template>
    <div class="column" id="main-plot-block-2">
        <section class="panel">
            <p class="panel-heading">
                Tradespace exploration |
                Number of designs: {{ numPoints }} | Number of targeted designs: {{ numSelectedPoints }} <br>
                Designs requiring re-evaluation: {{ arch_to_eval }}
                <button class="button is-info is-small" v-on:click="eval_designs()">
                    evaluate all
                </button>
                <br>
                x-axis <select v-model="xObjective">
                    <option v-for="(objective, idx) in objective_objs" v-if="objective.active" v-bind:value="objective.obj_id" v-bind:key="idx">{{ objective.name }}</option>
                </select>
                <br>
                y-axis <select v-model="yObjective">
                    <option v-for="(objective, idx) in objective_objs" v-if="objective.active" v-bind:value="idx" v-bind:key="idx">{{ objective.name }}</option>
                </select>

            </p>
            <div class="panel-block" id="main-plot-block">
                <div id="main-plot"></div>
                <div id="selections-block">
                    <div class="card" id="interaction_modes">
                        <header class="card-header">
                            <p class="card-header-title">
                                Mouse Selection
                            </p>
                        </header>
                        <div class="card-content control is-small">
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Zoom/Pan: This option allows zooming/panning on the scatter plot</span>-->
                                <label class="radio">
                                    Zoom/Pan:
                                    <input type="radio" name="mouse-selection" value="zoom-pan" v-model="selectionMode" />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Drag-select: This option allows selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Drag-select:
                                    <input type="radio" name="mouse-selection" value="drag-select" v-model="selectionMode" />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Deselect: This option allows de-selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Deselect:
                                    <input type="radio" name="mouse-selection" value="de-select" v-model="selectionMode" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content is-small">
                            <div class="field">
                                <p class="control">
                                    <button class="button" id="cancel-selection" v-on:click="cancelSelection">Cancel all selections</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

    import { mapGetters, mapMutations, mapState } from 'vuex';
    import * as _ from 'lodash-es';
    import * as d3 from 'd3';
    import 'd3-selection-multi';
    import {fetchGet, fetchPost} from "../scripts/fetch-helpers";
    import { ArchitectureEvalCount, UserArchitectureQuery, UserArchitectureSubscription, GaArchitectureQuery, GaArchitectureSubscription } from "../scripts/apollo-queries";

    class Architecture {
        constructor(id, inputs, outputs, db_id) {
            this.id = id;
            this.inputs = inputs;
            this.outputs = outputs;
            this.db_id = db_id;
        }
    }


    export default {
        name: 'tradespace-plot',
        data() {
            return {
                mainPlotParams: {
                    margin: {top: 20, right: 20, bottom: 30, left: 90},
                    width: 960,
                    height: 450,
                    scale: 1
                },
                transform: d3.zoomIdentity,
                zoom: {},
                xMap: {},
                yMap: {},
                context: {},
                hiddenContext: {},
                Architecture: [],
                arch_placeholder: 0,
                Architecture_aggregate: {},
                arch_to_eval: 0,
                arch_loaded: 0,
                updateTargetSelection_debounce: 0,

                // --> Dynamically choose axis objectives
                // - 0 science
                // - 1 cost
                // - 2 programmatic cost
                xObjective: 0,
                yObjective: 1,
                objective_list: ['Cost', 'Data Continuity', 'Fairness', 'Programmatic Risk', 'Atmospheric Panel Satisfaction', 'Oceanic Panel Satisfaction', 'Terrestrial Panel Satisfaction']
            }
        },
        computed: {
            ...mapState({
                objective_objs: state => state.problem.objective_objs,
                problemData: state => state.problem.problemData,
                plotData: state => state.tradespacePlot.plotData,
                colorMap: state => state.tradespacePlot.colorMap,
                hoveredArch: state => state.tradespacePlot.hoveredArch,
                clickedArch: state => state.tradespacePlot.clickedArch,
                selectedArchs: state => state.tradespacePlot.selectedArchs,
                highlightedArchs: state => state.tradespacePlot.highlightedArchs,
                gaArchs: state => state.tradespacePlot.gaArchs,
                hiddenArchs: state => state.tradespacePlot.hiddenArchs,
                status: state => state.problem.status,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
                groupId: state => state.problem.groupId,
            }),
            ...mapGetters({
                numPoints: 'getNumPoints',
                currentExpression: 'getCurrentExpression'
            }),

            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },

            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            },

            numSelectedPoints() {
                return this.selectedArchs.length;
            },

            selectionMode: {
                get() {
                    return this.$store.state.tradespacePlot.selectionMode;
                },
                set(newSelectionMode) {
                    this.$store.commit('updateSelectionMode', newSelectionMode);
                }
            }
        },

        methods: {
            ...mapMutations([
                'updateClickedArch',
                'updateHoveredArch',
            ]),
            async eval_designs(){
                console.log("---> re-evaluating designs");
                let reqData = new FormData();
                let dataResponse = await fetchPost(API_URL + 'eoss/engineer/evaluate-false-architectures', reqData);

                if (dataResponse.ok) {
                    console.log('Target selection updated');
                }
                else {
                    console.error('Error obtaining the driving features.');
                }
            },


            resetMainPlot() {
                //Resets the main plot
                d3.select('#main-plot').select('svg').remove();
                d3.select('#main-plot').selectAll('canvas').remove();
                d3.select('#main-plot').style('width', 0 + 'px');
            },
            updatePlot(xIndex, yIndex) {
                this.resetMainPlot();

                // Update width
                this.mainPlotParams.width = document.getElementById('main-plot-block').clientWidth
                    - document.getElementById('selections-block').offsetWidth - 30;
                let margin = this.mainPlotParams.margin;

                // Experiment lines
                let minCost = 800;
                let maxCost = 4000;

                // setup x
                let xValue = d => d.outputs[xIndex]; // data -> value
                let xScale = d3.scaleLinear().range([0, this.plotWidth]); // value -> display
                // don't want dots overlapping axis, so add in buffer to data domain
                let xBuffer = Math.max((d3.max(this.plotData, xValue) - d3.min(this.plotData, xValue)) * 0.05, 0.05);
                xScale.domain([d3.min(this.plotData, xValue) - xBuffer, d3.max(this.plotData, xValue) + xBuffer]);
                this.xMap = d => xScale(xValue(d)); // data -> display
                let xAxis = d3.axisBottom(xScale);

                // setup y
                let yValue = d => d.outputs[yIndex]; // data -> value
                let yScale = d3.scaleLinear().range([this.plotHeight, 0]); // value -> display
                let yBuffer = Math.max((d3.max(this.plotData, yValue) - d3.min(this.plotData, yValue)) * 0.05, 0.05);
                yScale.domain([d3.min(this.plotData, yValue) - yBuffer, d3.max(this.plotData, yValue) + yBuffer]);
                this.yMap = d => yScale(yValue(d)); // data -> display
                let yAxis = d3.axisLeft(yScale);

                d3.select('#main-plot')
                    .style('width', this.mainPlotParams.width + 'px')
                    .style('height', this.mainPlotParams.height + 'px');

                this.zoom = d3.zoom()
                    .scaleExtent([0.4, 25])
                    .on('zoom', (event, d) => {
                        this.transform = event.transform;
                        gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                        gY.call(yAxis.scale(this.transform.rescaleY(yScale)));
                        this.drawPoints(this.context, false);
                    });

                let svg = d3.select('#main-plot')
                    .append('svg')
                    .style('position', 'absolute')
                    .attr('width', this.plotWidth + margin.left + margin.right)
                    .attr('height', this.plotHeight + margin.top + margin.bottom)
                    .call(this.zoom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                let canvas = d3.select('#main-plot')
                    .append('canvas')
                    .style('position', 'absolute')
                    .style('top', margin.top + 'px')
                    .style('left', margin.left + 'px')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight)
                    .call(this.zoom);

                this.context = canvas.node().getContext('2d');

                let hiddenCanvas = d3.select('#main-plot')
                    .append('canvas')
                    .style('position', 'absolute')
                    .style('top', margin.top + 'px')
                    .style('left', margin.left + 'px')
                    .style('display', 'none')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight);

                this.hiddenContext = hiddenCanvas.node().getContext('2d');

                // x-axis
                let gX = svg.append('g')
                    .attr('class', 'axis axis-x')
                    .attr('transform', 'translate(0, ' + this.plotHeight + ')')
                    .style('font-size', '16px')
                    .call(xAxis);

                svg.append('text')
                    .attr('transform', 'translate(' + this.plotWidth + ', ' + this.plotHeight + ')')
                    .attr('class', 'label')
                    .attr('y', -6)
                    .style('text-anchor', 'end')
                    .style('font-size', '18px')
                    .text(this.$store.state.problem.outputList[xIndex]);

                // y-axis
                let gY = svg.append('g')
                    .attr('class', 'axis axis-y')
                    .style('font-size', '16px')
                    .call(yAxis);

                svg.append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .style('font-size', '18px')
                    .text(this.$store.state.problem.outputList[yIndex]);

                // Canvas related functions
                this.drawPoints(this.context, false);

                // Restore old zoom values if they are there
                gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                gY.call(yAxis.scale(this.transform.rescaleY(yScale)));

                // Canvas interaction
                let self = this;

                canvas.on('mousemove.inspection', function(event, d) { self.canvasMousemove(event); });
                canvas.on('click.inspection', function(event, d) { self.canvasClick(event); });
            },

            drawPoints(context, hidden) {
                context.clearRect(0, 0, this.plotWidth, this.plotHeight);
                context.save();

                // Generate sets for optimization
                let selectedArchsSet = new Set(this.selectedArchs);
                let highlightedArchsSet = new Set(this.highlightedArchs);
                let gaArchsSet = new Set(this.gaArchs);

                this.plotData.forEach(point => {
                    let pointColor;
                    if (hidden) {
                        pointColor = point.interactColor;
                    }
                    else {
                        pointColor = this.$store.getters.getPointColor(point.id,
                                                                       selectedArchsSet,
                                                                       highlightedArchsSet,
                                                                       gaArchsSet);
                    }
                    let pointShape = this.$store.getters.getPointShape(point.id);
                    let tx = this.transform.applyX(this.xMap(point));
                    let ty = this.transform.applyY(this.yMap(point));
                    context.fillStyle = pointColor;
                    if (hidden || pointShape === 'circle') {
                        context.beginPath();
                        context.arc(tx, ty, 3.3, 0, 2 * Math.PI);
                        context.fill();
                    }
                    else if (pointShape === 'cross') {
                        context.fillRect(tx - 8, ty - 2, 16, 4);
                        context.fillRect(tx - 2, ty - 8, 4, 16);
                    }
                });

                context.restore();
            },

            getPointUnderMouse(event) {
                // Draw the hidden canvas.
                this.drawPoints(this.hiddenContext, true);

                // Get mouse positions from the main canvas.
                let mousePos = d3.pointer(event, d3.select('#main-plot').select('canvas').node());
                let mouseX = mousePos[0];
                let mouseY = mousePos[1];

                // Pick the colour from the mouse position and max-pool it.
                let color = this.hiddenContext.getImageData(mouseX-3, mouseY-3, 6, 6).data;
                let colorList = {};
                for (let i = 0; i < color.length; i += 4) {
                    let colorRgb = 'rgb(' + color[i] + ',' + color[i+1] + ',' + color[i+2] + ')';
                    if (colorRgb in colorList) {
                        colorList[colorRgb] += 1;
                    }
                    else {
                        colorList[colorRgb] = 1;
                    }
                }
                let maxcolor = -1;
                let maxcolor_num = 0;
                for (let key in colorList) {
                    if (maxcolor_num < colorList[key]) {
                        maxcolor_num = colorList[key];
                        maxcolor = key;
                    }
                }
                if (maxcolor === 0) {
                    maxcolor = -1;
                }
                return maxcolor;
            },

            canvasMousemove(event) {
                let pointColor = this.getPointUnderMouse(event);

                // Get the data from our map!
                if (pointColor in this.colorMap) {
                    let point = this.colorMap[pointColor];
                    // Only update if there is a change in the selection
                    if (this.hoveredArch !== point) {
                        this.updateHoveredArch(point);
                    }
                }
                else {
                    // In case nothing is selected just revert everything back to normal
                    if (this.hoveredArch !== -1) {
                        this.updateHoveredArch(-1);
                    }
                }
            },

            canvasClick(event) {
                let pointColor = this.getPointUnderMouse(event);

                // Get the data from our map!
                if (pointColor in this.colorMap) {
                    let point = this.colorMap[pointColor];
                    // Only update if there is a change in the selection
                    if (this.clickedArch !== point) {
                        this.updateClickedArch(point);
                    }
                }
            },

            /*
               Removes selections and/or highlights in the scatter plot
               @param option: option to remove all selections and highlights or remove only highlights
            */
            cancelSelection() {
                // Remove both highlights and selections
                this.$store.commit('clearSelectedArchs');
                this.$store.commit('clearHighlightedArchs');
            },

            async updateTargetSelection() {
                let selectedArchsSet = new Set(this.selectedArchs);
                let selectedIds = [];
                let nonSelectedIds = [];
                let selectedIds_db = [];
                let nonSelectedIds_db = [];
                this.plotData.forEach(point => {
                    if (selectedArchsSet.has(point.id)) {
                        selectedIds.push(point.id);
                        selectedIds_db.push(point.db_id);
                    }
                    else {
                        nonSelectedIds.push(point.id);
                        nonSelectedIds_db.push(point.db_id);
                    }
                });

                try {
                    let reqData = new FormData();
                    reqData.append('selected', JSON.stringify(selectedIds));
                    reqData.append('non_selected', JSON.stringify(nonSelectedIds));
                    reqData.append('selected_db', JSON.stringify(selectedIds_db));
                    reqData.append('non_selected_db', JSON.stringify(nonSelectedIds_db));
                    // let dataResponse = await fetchPost(API_URL + 'ifeed/set-target', reqData);
                    //
                    // if (dataResponse.ok) {
                    //     console.log('Target selection updated');
                    // }
                    // else {
                    //     console.error('Error obtaining the driving features.');
                    // }
                }
                catch(e) {
                    console.error('Networking error:', e);
                }
            }
        },

        apollo: {
            $subscribe: {
                //--> Number of designs requiring re-evaluation
                Architecture_aggregate: {
                    query: ArchitectureEvalCount,
                    variables() {
                        return {
                            problem_id: this.problemId,
                            dataset_id: this.datasetId,
                        }
                    },
                    skip() {
                        if(this.problemId == null || this.datasetId == null){
                            return true;
                        }
                        return false;
                    },
                    result ({ data }) {
                        this.arch_to_eval = data.Architecture_aggregate.aggregate.count;
                    },
                },
            },
        },

        watch: {
            xObjective: function(val, oldVal){
                this.updatePlot(this.xObjective, this.yObjective);
            },
            yObjective: function(val, oldVal){
                this.updatePlot(this.xObjective, this.yObjective);
            },

            status: function(val, oldVal){
                if(this.status === true){
                    console.log("--> Resetting banned inputs");
                    this.inputs_list = [];
                }
            },

            plotData: function(val, oldVal) {
                this.updatePlot(this.xObjective, this.yObjective);
                this.arch_loaded = this.plotData.length;

                if(this.plotData.length == 0){
                    return;
                }


                if(this.skip_sub === true) {
                    this.inputs_list = [];
                    for (let x = 0; x < this.plotData.length; x++) {
                        let bool_ary = this.plotData[x].inputs;
                        let input_str = '';
                        for (let y = 0; y < bool_ary.length; y++) {
                            let single_bool = bool_ary[y];
                            if (single_bool) {
                                input_str = input_str + '1';
                            } else {
                                input_str = input_str + '0';
                            }
                        }
                        this.inputs_list.push(input_str);
                    }
                }
                this.skip_sub = false;
            },

            hoveredArch: function(val, oldVal) {
                this.drawPoints(this.context, false);
            },

            clickedArch: function(val, oldVal) {
                this.drawPoints(this.context, false);
            },

            selectionMode: function(val, oldVal) {
                let margin = this.mainPlotParams.margin;
                let width  = this.mainPlotParams.width;
                let height = this.mainPlotParams.height;

                if (this.selectionMode === 'zoom-pan') { // Zoom
                    d3.select('#main-plot').select('svg')
                        .on('mousedown.modes', null)
                        .on('mousemove.modes', null)
                        .on('mouseup.modes', null)
                        .call(this.zoom);

                    d3.select('#main-plot').selectAll('canvas')
                        .on('mousedown.modes', null)
                        .on('mousemove.modes', null)
                        .on('mouseup.modes.modes', null)
                        .call(this.zoom);
                }
                else {
                    let svg = d3.select('#main-plot').select('svg')
                        .on('.zoom', null);

                    let canvases = d3.select('#main-plot').selectAll('canvas')
                        .on('.zoom', null);

                    let self = this;
                    let justSelectedArchs = new Set();

                    function selectMousedown(event) {
                        let mousePos = d3.pointer(event);
                        svg.append('rect')
                            .attr("rx", 0)
                            .attr("ry", 0)
                            .attr("class", 'selection')
                            .attr("x", mousePos[0])
                            .attr("y", mousePos[1])
                            .attr("width", 0)
                            .attr("height", 0)
                            .attr("x0", mousePos[0])
                            .attr("y0", mousePos[1])
                            .style('background-color', '#EEEEEE')
                            .style('opacity', 0.18)
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                        justSelectedArchs = new Set();
                    }

                    function selectMousemove(event) {
                        let selection = svg.select('rect.selection');
                        if (!selection.empty()) {
                            let selectionUpdated = false;
                            let mousePos = d3.pointer(event);

                            let box = {
                                x      : parseInt(selection.attr('x'), 10),
                                y      : parseInt(selection.attr('y'), 10),
                                x0     : parseInt(selection.attr('x0'), 10),
                                y0     : parseInt(selection.attr('y0'), 10),
                                width  : parseInt(selection.attr('width'), 10),
                                height : parseInt(selection.attr('height'), 10)
                            };

                            let move = {
                                x : mousePos[0] - box.x0,
                                y : mousePos[1] - box.y0
                            };

                            if (move.x < 0) {
                                box.x = box.x0 + move.x;
                            }
                            else {
                                box.x = box.x0;
                            }

                            if (move.y < 0) {
                                box.y = box.y0 + move.y;
                            }
                            else {
                                box.y = box.y0;
                            }

                            box.width = Math.abs(move.x);
                            box.height = Math.abs(move.y);

                            selection.attr("x", box.x)
                                     .attr("y", box.y)
                                     .attr("x0", box.x0)
                                     .attr("y0", box.y0)
                                     .attr("width", box.width)
                                     .attr("height", box.height);

                            let hiddenArchsSet = new Set(self.hiddenArchs);
                            let selectedArchsSet = new Set(self.selectedArchs);
                            let newSelectedArchs = new Set(self.selectedArchs);

                            if (self.selectionMode === 'drag-select') { // Make selection
                                self.plotData.forEach((point, index) => {
                                    let tx = self.transform.applyX(self.xMap(point));
                                    let ty = self.transform.applyY(self.yMap(point));

                                    if( tx >= box.x && tx <= box.x + box.width &&
                                        ty >= box.y && ty <= box.y + box.height)
                                    {
                                        if (!hiddenArchsSet.has(point.id) && !selectedArchsSet.has(point.id)) {
                                            // Select
                                            newSelectedArchs.add(point.id);
                                            justSelectedArchs.add(point.id);
                                            selectionUpdated = true;
                                        }
                                    }
                                    else {
                                        if (!hiddenArchsSet.has(point.id) && justSelectedArchs.has(point.id)) {
                                            // Deselect already selected points
                                            newSelectedArchs.delete(point.id);
                                            justSelectedArchs.delete(point.id);
                                            selectionUpdated = true;
                                        }
                                    }
                                });
                            }
                            else {  // De-select
                                self.plotData.forEach((point, index) => {
                                    let tx = self.transform.applyX(self.xMap(point));
                                    let ty = self.transform.applyY(self.yMap(point));

                                    if( tx >= box.x && tx <= box.x + box.width &&
                                        ty >= box.y && ty <= box.y + box.height)
                                    {
                                        if (!hiddenArchsSet.has(point.id) && selectedArchsSet.has(point.id)) {
                                            newSelectedArchs.delete(point.id);
                                            justSelectedArchs.add(point.id);
                                            selectionUpdated = true;
                                        }
                                    }
                                    else {
                                        if (!hiddenArchsSet.has(point.id) && justSelectedArchs.has(point.id)) {
                                            newSelectedArchs.add(point.id);
                                            justSelectedArchs.delete(point.id);
                                            selectionUpdated = true;
                                        }
                                    }
                                });
                            }

                            if (selectionUpdated) {
                                self.$store.commit('updateSelectedArchs', Array.from(newSelectedArchs));
                            }
                        }
                    }

                    function selectMouseup(event) {
                        // remove selection frame
                        svg.selectAll('rect.selection').remove();
                        justSelectedArchs.clear();
                    }

                    svg.on('mousedown.modes', (event) => selectMousedown(event))
                        .on('mousemove.modes', (event) => selectMousemove(event))
                        .on('mouseup.modes', (event) => selectMouseup(event));

                    canvases.on('mousedown.modes', (event) => selectMousedown(event))
                        .on('mousemove.modes', (event) => selectMousemove(event))
                        .on('mouseup.modes', (event) => selectMouseup(event));
                }
            },

            selectedArchs: function(val, oldVal) {
                this.drawPoints(this.context, false);
                this.updateTargetSelection_debounce();
            },

            highlightedArchs: function(val, oldVal) {
                this.drawPoints(this.context, false);
            },

            currentExpression: function(val, oldVal) {
                let featureExpression = val;
                this.$store.commit('clearHighlightedArchs');

                // If filter expression is not empty, do something
                let highlightedArchsSet = new Set();
                if (featureExpression !== '' || featureExpression) {
                    this.plotData.forEach((point, index) => {
                        if (this.$store.state.filter.processFilterExpression(point, featureExpression, '&&')) {
                            highlightedArchsSet.add(point.id);
                        }
                    });
                }
                this.$store.commit('updateHighlightedArchs', Array.from(highlightedArchsSet));
            }
        },

        mounted() {
            window.addEventListener('resize', () => {
                this.updatePlot(this.xObjective, this.yObjective);
            });

            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setDataUpdateFrom') {
                    let updateFrom = state.problem.dataUpdateFrom;
                    if (updateFrom === 'loadNewData' || updateFrom === 'reloadOldData') {
                        this.$store.commit('updatePlotData', this.problemData);
                        // Mark the last point added as the selected one
                        if (this.plotData.length > 0) {
                            this.$store.commit('updateClickedArch', this.plotData.length - 1);
                        }
                    }
                }
            });

            console.log('--> CREATING DEBOUNCE FUNC');
            this.updateTargetSelection_debounce = _.debounce(this.updateTargetSelection, 1000);
        }
    }
</script>

<style scoped>

</style>
