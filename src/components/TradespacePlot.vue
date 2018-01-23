<template>
    <div class="column">
        <section class="panel">
            <p class="panel-heading">
                Tradespace exploration |
                Number of designs:
                <span id="num_architectures"></span> |
                Number of targeted designs:
                <span id="num_selected_architectures"></span>
            </p>
            <div class="panel-block" id="main_plot_block">
                <div id="main_plot"></div>
                <div id="selections_block">
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
                                    <input type="radio" name="mouse-selection" value="zoom-pan" checked />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Drag-select: This option allows selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Drag-select:
                                    <input type="radio" name="mouse-selection" value="drag-select" />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Deselect: This option allows de-selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Deselect:
                                    <input type="radio" name="mouse-selection" value="de-select" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content is-small">
                            <div class="field">
                                <p class="control">
                                    <button class="button" id="cancel_selection">Cancel all selections</button>
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
    import { mapGetters, mapMutations } from 'vuex';
    import * as d3 from 'd3';

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
                hiddenContext: {}
            }
        },
        computed: {
            ...mapGetters({
                problemData: 'getProblemData',
                plotData: 'getPlotData',
                colorMap: 'getColorMap',
                hoveredArch: 'getHoveredArch',
                clickedArch: 'getClickedArch'
            }),
            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },
            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            }
            
        },
        methods: {
            ...mapMutations([
                'updateClickedArch',
                'updateHoveredArch',
            ]),
            resetMainPlot() {
                //Resets the main plot
                d3.select('#main_plot').select('svg').remove();
                d3.select('#main_plot').selectAll('canvas').remove();
            },
            
            updatePlot(xIndex, yIndex) {
                this.resetMainPlot();

                // Update width
                this.mainPlotParams.width = document.getElementById('main_plot_block').clientWidth
                    - document.getElementById('selections_block').offsetWidth - 30;
                let margin = this.mainPlotParams.margin;

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

                d3.select('#main_plot')
                    .style('width', this.mainPlotParams.width + 'px')
                    .style('height', this.mainPlotParams.height + 'px');

                this.zoom = d3.zoom()
                    .scaleExtent([0.4, 25])
                    .on('zoom', d => {
                        this.transform = d3.event.transform;
                        gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                        gY.call(yAxis.scale(this.transform.rescaleY(yScale)));

                        this.drawPoints(this.context, false);
                    });

                let svg = d3.select('#main_plot')
                    .append('svg')
                    .style('position', 'absolute')
                    .attr('width', this.plotWidth + margin.left + margin.right)
                    .attr('height', this.plotHeight + margin.top + margin.bottom)
                    .call(this.zoom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                let canvas = d3.select('#main_plot')
                    .append('canvas')
                    .style('position', 'absolute')
                    .style('top', margin.top + 'px')
                    .style('left', margin.left + 'px')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight)
                    .call(this.zoom);

                this.context = canvas.node().getContext('2d');

                let hiddenCanvas = d3.select('#main_plot')
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

                // Canvas interaction
                let that = this;

                // TODO: Add functions
                canvas.on('mousemove.inspection', function() { that.canvasMousemove(); });
                canvas.on('click.inspection', function() { that.canvasClick(); });

                // Set button click operations TODO: Add functions
                //d3.select('button#cancel_selection').on('click', () => { that.cancel_selection(); });
                //d3.select('#interaction_modes').selectAll('label').on('click', () => { that.toggle_selection_mode(); });

                // TODO: Change into Vue computed properties
                //d3.select('#num_architectures').text(''+this.get_num_of_archs());
                //d3.select('#num_selected_architectures').text(''+this.get_num_of_selected_archs());
            },

            drawPoints(context, hidden) {
                context.clearRect(0, 0, this.plotWidth, this.plotHeight);
                context.save();

                this.plotData.forEach((point, index) => {
                    let pointColor = this.$store.getters.getPointColor(index);
                    let pointShape = this.$store.getters.getPointShape(index);
                    let tx = this.transform.applyX(this.xMap(point));
                    let ty = this.transform.applyY(this.yMap(point));
                    context.fillStyle = hidden ? point.interactColor : pointColor;
                    if (hidden || pointShape === 'circle') {
                        context.beginPath();
                        context.arc(tx, ty, 3.3, 0, 2 * Math.PI);
                        context.fill();
                    }
                    else if (pointShape === 'cross') {
                        context.fillRect(tx - 4, ty - 1, 8, 2);
                        context.fillRect(tx - 1, ty - 4, 2, 8);
                    }
                });

                context.restore();
            },

            getPointUnderMouse() {
                // Draw the hidden canvas.
                this.drawPoints(this.hiddenContext, true);

                // Get mouse positions from the main canvas.
                let mousePos = d3.mouse(d3.select("#main_plot").select("canvas").node());
                let mouseX = mousePos[0];
                let mouseY = mousePos[1];

                // Pick the colour from the mouse position and max-pool it.
                let color = this.hiddenContext.getImageData(mouseX-3, mouseY-3, 6, 6).data;
                let colorList = {};
                for (let i = 0; i < color.length; i += 4) {
                    let colorRgb = "rgb(" + color[i] + "," + color[i+1] + "," + color[i+2] + ")";
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

            canvasMousemove() {
                let pointColor = this.getPointUnderMouse();

                // Get the data from our map!
                if (pointColor in this.colorMap) {
                    let point = this.colorMap[pointColor];
                    // Only update if there is a change in the selection
                    if (this.hoveredArch !== point) {
                        this.updateHoveredArch(point);
                        // TODO: Turn into Vue reactive
                        //this.show_info(arch, true);
                    }
                }
                else {
                    // In case nothing is selected just revert everything back to normal
                    // TODO: Turn into Vue reactive component
                    /*if (this.lastHoveredArch !== -1) {
                        if (this.selectedArch != null) {
                            this.show_info(this.selectedArch, false);
                        }
                        changesHappened = true;
                    }*/
                    if (this.hoveredArch !== -1) {
                        this.updateHoveredArch(-1);
                    }
                }
            },

            canvasClick() {
                let pointColor = this.getPointUnderMouse();

                // Get the data from our map!
                if (pointColor in this.colorMap) {
                    let point = this.colorMap[pointColor];
                    // Only update if there is a change in the selection
                    if (this.clickedArch !== point) {
                        this.updateClickedArch(point);
                    }
                }
            }

        },
        watch: {
            problemData: function(val, oldVal) {
                this.$store.commit('updatePlotData', val);
            },
            plotData: function(val, oldVal) {
                this.updatePlot(0, 1);
            },
            hoveredArch: function(val, oldVal) {
                this.drawPoints(this.context, false);
            },
            clickedArch: function(val, oldVal) {
                this.drawPoints(this.context, false);
            }
        }
    }
</script>

<style scoped>

</style>