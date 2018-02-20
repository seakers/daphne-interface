<template>
    <div class="panel-block functionality">
        <div id="feature-plot" v-show="features.length !== 0"></div>
        <template v-if="features.length === 0">
            <div class="content">
                <p>To run data mining, select target solutions on the scatter plot. Then click the button below.</p>
                <div class="field">
                    <div class="control">
                        <a class="button is-info" id="run_data_mining" v-on:click="run">
                            Run data mining
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as d3 from 'd3';
    import { roundNum } from '../scripts/utils';
    import * as _ from 'lodash-es';

    export default {
        name: 'data-mining',
        data() {
            return {
                margin: { top: 20, right: 20, bottom: 30, left: 40 },
                width: 770,
                height: 300,
                xMap: {},
                yMap: {},
                svg: {},
                currentFeature: {},
                currentFeatureBlinkInterval: null
            }
        },
        beforeMount() {
            this.width =  770 - 35 - this.margin.left - this.margin.right;
            this.height = 310 - this.margin.top - this.margin.bottom;
        },
        computed: {
            ...mapGetters({
                plotData: 'getPlotData',
                selectedArchs: 'getSelectedArchs',
                features: 'getFeatures',
                scores: 'getScores'
            }),
            numSelectedPoints() {
                return this.selectedArchs.filter(point => point).length;
            }
        },
        methods: {
            run() {
                // Remove all highlights in the scatter plot (retain target solutions)
                this.$store.commit('clearHighlightedArchs');

                if (this.numSelectedPoints === 0) {
                    alert('First select target solutions!');
                }
                else {
                    this.$store.dispatch('getDrivingFeatures');
                }
            },

            featureMouseover(d) {
                let id = d.id;
                let expression = d.expression;
                let metrics = d.metrics;

                // Set variables
                let mousePos = d3.mouse(this.svg.node());
                let mouseLocX = mousePos[0];
                let mouseLocY = mousePos[1];

                let tooltipLocation = { x: 0, y: 0 };
                let tooltipWidth = 360;
                let tooltipHeight = 170;

                let hThreshold = (this.width + this.margin.left + this.margin.right)*0.5;
                let vThreshold = (this.height + this.margin.top + this.margin.bottom)*0.55;


                if (mouseLocX >= hThreshold) {
                    tooltipLocation.x = -10 - tooltipWidth;
                }
                else {
                    tooltipLocation.x = 10;
                }
                if (mouseLocY < vThreshold) {
                    tooltipLocation.y = 10;
                }
                else {
                    tooltipLocation.y = -10 - tooltipHeight;
                }

                let tooltipGroup = this.svg.append('g')
                    .attr('id', 'tooltip-g');

                tooltipGroup.append('rect')
                    .attr('id', 'tooltip-rect')
                    .attr('transform', () => {
                        let x = mouseLocX + tooltipLocation.x;
                        let y = mouseLocY + tooltipLocation.y;
                        return 'translate(' + x + ',' + y + ')';
                    })
                    .attr('width', tooltipWidth)
                    .attr('height', tooltipHeight)
                    .style('fill', '#4B4B4B')
                    .style('opacity', 0.92);

                let fo = tooltipGroup
                    .append('foreignObject')
                    .attr('id', 'tooltip-foreignObject')
                    .attr('x', () => mouseLocX + tooltipLocation.x)
                    .attr('y', () => mouseLocY + tooltipLocation.y)
                    .attr('width', tooltipWidth)
                    .attr('height', tooltipHeight)
                    .data([ { id: id, expression: expression, metrics: metrics } ])
                    .html(d => {
                        return "lift: " + roundNum(d.metrics[1]) +
                            "<br> Support: " + roundNum(d.metrics[0]) +
                            "<br> Confidence(F->S): " + roundNum(d.metrics[2]) +
                            "<br> Confidence(S->F): " + roundNum(d.metrics[3]) +"";
                    })
                    .style('padding', '8px')
                    .style('color', '#F7FF55')
                    .style('word-wrap', 'break-word');


                // Update the placeholder with the driving feature and stash the expression
                this.$store.commit('setCurrentExpression', expression);
                this.$store.commit('setHoveredExpression', expression);
            },

            featureClick(d, i, nodes) {
                // Replaces the current feature expression with the stashed expression
                this.$store.commit('setClickedExpression', this.$store.state.featureApplication.hoveredExpression);
                this.currentFeature = nodes[i];
            },

            featureMouseout(d) {
                // Remove the tooltip
                d3.selectAll('#tooltip-g').remove();

                // Remove all the features created temporarily and bring back the previously stored feature expression
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setHoveredExpression', '');
            }

        },
        watch: {
            selectedArchs: function(val, oldVal) {
                this.$store.commit('clearFeatures');
            },

            features: function(val, oldVal) {
                if (this.features.length > 0) {
                    function getUtopiaPoint() {
                        // Utopia point
                        return objects.filter(d => d.name === 'utopiaPoint');
                    }

                    // Set updated width
                    this.width = document.getElementById('feature-plot').parentNode.clientWidth -
                        this.margin.left - this.margin.right - 25;

                    // Set the axis to be Conf(F->S) and Conf(S->F)
                    let x = 2;
                    let y = 3;

                    // setup x
                    // data -> value
                    let xValue = d => d.metrics[x];
                    // value -> display
                    let xScale = d3.scaleLinear().range([0, this.width]);
                    // don't want dots overlapping axis, so add in buffer to data domain
                    let xBuffer = (d3.max(this.features, xValue) - d3.min(this.features, xValue)) * 0.05;
                    xScale.domain([d3.min(this.features, xValue) - xBuffer, d3.max(this.features, xValue) + xBuffer]);
                    // data -> display
                    this.xMap = d => xScale(xValue(d));
                    let xAxis = d3.axisBottom(xScale);

                    // setup y
                    // data -> value
                    let yValue = d => d.metrics[y];
                    // value -> display
                    let yScale = d3.scaleLinear().range([this.height, 0]);
                    // don't want dots overlapping axis, so add in buffer to data domain
                    let yBuffer = (d3.max(this.features, yValue) - d3.min(this.features, yValue)) * 0.05;
                    yScale.domain([d3.min(this.features, yValue) - yBuffer, d3.max(this.features, yValue) + yBuffer]);
                    // data -> display
                    this.yMap = d => yScale(yValue(d));
                    let yAxis = d3.axisLeft(yScale);

                    // Colors for the plot
                    let colorsRainbow = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
                    let colorRangeRainbow = d3.range(0, 1, 1.0 / (colorsRainbow.length - 1));
                    colorRangeRainbow.push(1);

                    //Needed to map the values of the dataset to the color scale
                    let colorInterpolateRainbow = d3.scaleLinear()
                        .domain(d3.extent(this.scores))
                        .range([0, 1]);

                    // Create color gradient
                    let colorScaleRainbow = d3.scaleLinear()
                        .domain(colorRangeRainbow)
                        .range(colorsRainbow)
                        .interpolate(d3.interpolateHcl);

                    // Set zoom
                    let zoom = d3.zoom()
                        .scaleExtent([0.2, 50])
                        .on('zoom', d => {
                            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
                            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

                            objects.attr('transform', d => {
                                let xCoord = d3.event.transform.applyX(this.xMap(d));
                                let yCoord = d3.event.transform.applyY(this.yMap(d));
                                return 'translate(' + xCoord + ',' + yCoord + ')';
                            });
                        });

                    // Reset plot
                    d3.select('#feature-plot').select('svg').remove();

                    this.svg = d3.select('#feature-plot').append('svg')
                        .attr('width', this.width + this.margin.left + this.margin.right)
                        .attr('height', this.height + this.margin.top + this.margin.bottom)
                        .call(zoom)
                        .append('g')
                        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

                    // Clipping area
                    let clip = this.svg.append('defs').append('svg:clipPath')
                        .attr('id', 'feature-clip')
                        .append('svg:rect')
                        .attr('width', this.width)
                        .attr('height', this.height)
                        .attr('x', 0)
                        .attr('y', 0);

                    // Actual points and clipping
                    let triangleplot = this.svg.append('g')
                        .attr('id', 'triangleplot')
                        .attr('clip-path', 'url(#feature-clip)');

                    let objects = triangleplot.selectAll('.object')
                        .data(this.features)
                        .enter().append('path')
                        .attr('class', 'object')
                        .attr('d', d3.symbol().type(d3.symbolTriangle).size(120))
                        .attr('transform', d => 'translate(' + 0 + ',' + 0 + ')')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 1);

                    // Utopia point: modify the shape to a star
                    getUtopiaPoint().attr('d', d3.symbol().type(d3.symbolStar).size(120));

                    // Add interaction to the features on the plot
                    objects.filter(d => d.name !== 'utopiaPoint')
                        .on('mouseover', d => { this.featureMouseover(d); })
                        .on('mouseout', d => { this.featureMouseout(d); })
                        .on('click', (d, i, nodes) => { this.featureClick(d, i, nodes); });

                    //Transition the colors to a rainbow
                    objects.style('fill', (d, i) => colorScaleRainbow(colorInterpolateRainbow(this.scores[i])));

                    // x-axis
                    let gX = this.svg.append('g')
                        .attr('class', 'axis axis-x')
                        .attr('transform', 'translate(0, ' + this.height + ')')
                        .call(xAxis);

                    this.svg.append('text')
                        .attr('transform', 'translate(' + this.width + ', ' + this.height + ')')
                        .attr('class', 'label')
                        .attr('y', -6)
                        .style('text-anchor', 'end')
                        .text('Confidence(F->S)');

                    // y-axis
                    let gY = this.svg.append('g')
                        .attr('class', 'axis axis-y')
                        .call(yAxis);

                    this.svg.append('text')
                        .attr('class', 'label')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', 6)
                        .attr('dy', '.71em')
                        .style('text-anchor', 'end')
                        .text('Confidence(S->F)');

                    // Animate creation of graph
                    let duration = 500;
                    objects.transition()
                        .duration(duration)
                        .attr('transform', d => {
                            return 'translate(' + this.xMap(d) + ',' + this.yMap(d) + ')';
                        });
                }
            },

            currentFeature: function(val, oldVal) {
                if (!_.isEmpty(oldVal)) {
                    let oldElem = d3.select(oldVal);

                    oldElem.attr('d', d3.symbol().type(d3.symbolTriangle).size(120))
                        .attr('stroke', 'black')
                        .attr('stroke-width', 1)
                        .style('fill', oldVal.oldColor)
                        .style('opacity', 1.0);
                }

                let newElem = d3.select(val);

                // The current feature: modify the shape to a cross
                newElem.attr('d', d3.symbol().type(d3.symbolCross).size(120));
                // The current feature
                val.oldColor = newElem.style('fill');
                newElem.style('fill', 'black');

                newElem.shown = true;

                function blink() {
                    if (newElem.shown) {
                        newElem.style('opacity', 0);
                        newElem.shown = false;
                    }
                    else {
                        newElem.style('opacity', 1);
                        newElem.shown = true;
                    }
                }

                if (this.currentFeatureBlinkInterval != null) {
                    clearInterval(this.currentFeatureBlinkInterval);
                }
                this.currentFeatureBlinkInterval = setInterval(blink, 350);
            }
        }
    }
</script>

<style scoped>
    #feature-plot {
        width: 100%;
        height: 100%;
    }
</style>