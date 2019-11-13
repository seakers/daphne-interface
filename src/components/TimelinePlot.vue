<template>
    <div class="panel-block functionality">
        <div class="content plot-container">
            <p>{{ funcData.title }}</p>
            <div class="timeline-plot"></div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: 'timeline-plot',
        data() {
            return {
                mainPlotParams: {
                    margin: {top: 10, right: 20, bottom: 30, left: 10},
                    width: 960,
                    height: 450,
                    scale: 1
                },
                transform: d3.zoomIdentity,
                zoom: {}
            }
        },
        props: ["name", "size", "funcData", "funcId"],
        computed: {
            plotWidth() {
                return this.mainPlotParams.width - this.mainPlotParams.margin.right - this.mainPlotParams.margin.left;
            },
            plotHeight() {
                return this.mainPlotParams.height - this.mainPlotParams.margin.top - this.mainPlotParams.margin.bottom;
            },
            funcIdString() {
                return "#" + this.funcId;
            }
        },
        methods: {
            resetMainPlot() {
                //Resets the main plot
                let plotSelector = this.funcIdString + " " + ".timeline-plot";
                d3.select(plotSelector).select('svg').remove();
                d3.select(plotSelector).style('width', 0 + 'px');
            },

            drawTimeline() {
                this.resetMainPlot();

                let plotData = this.funcData['plot_data'];
                console.log(this.funcData, plotData);

                // Update sizes
                this.mainPlotParams.width = document.querySelector(this.funcIdString + " " + '.plot-container').clientWidth;
                let margin = this.mainPlotParams.margin;
                this.mainPlotParams.height = plotData.length * 26 + margin.top + margin.bottom;

                // parse the date / time
                let parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

                // setup x
                let xScale = d3.scaleTime().range([0, this.plotWidth]); // value -> display
                xScale.domain([d3.min(plotData, d => parseTime(d.start)), d3.max(plotData, d => parseTime(d.end))]);
                let xAxis = d3.axisBottom(xScale);

                // setup y
                let yScale = d3.scaleLinear().range([this.plotHeight, 0]); // value -> display
                yScale.domain([0, plotData.length]);
                let yAxis = d3.axisLeft(yScale);

                let plotSelector = this.funcIdString + " " + ".timeline-plot";
                d3.select(plotSelector)
                    .style('width', this.mainPlotParams.width + 'px')
                    .style('height', this.mainPlotParams.height + 'px');

                this.zoom = d3.zoom()
                    .scaleExtent([0.4, 25])
                    .on('zoom', d => {
                        this.transform = d3.event.transform;
                        gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                        let newXScale = this.transform.rescaleX(xScale);
                        missionLines
                            .attr('x', d => newXScale(parseTime(d.start)))
                            .attr('width', d => newXScale(parseTime(d.end)) - newXScale(parseTime(d.start)));
                        labels
                            .attr('x', d => newXScale(parseTime(d.start)));
                        //this.drawPoints(this.context, false);
                    });

                let svg = d3.select(plotSelector)
                    .append('svg')
                    .attr('width', this.mainPlotParams.width)
                    .attr('height', this.mainPlotParams.height)
                    .call(this.zoom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                svg.append('defs').append('clipPath')
                    .attr('id', 'timeline-clip')
                    .append('rect')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight);

                let timeline = svg.append('g')
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
                    .attr('width', this.plotWidth)
                    .attr('height', this.plotHeight - 30)
                    .attr('class', 'timeline');

                // lanes
                timeline.append('g').selectAll('.lane-lines')
                    .data(plotData)
                    .enter().append('line')
                    .attr('x1', 0)
                    .attr('y1', (d, i) => yScale(i))
                    .attr('x2', this.plotWidth)
                    .attr('y2', (d, i) => yScale(i))
                    .attr('stroke', 'lightgray');

                let itemRects = svg.append('g')
                    .attr('clip-path', 'url(' + this.funcIdString + ' #timeline-clip)');

                // item rects
                let statusMap = new Map();
                statusMap.set('Considered', 'considered');
                statusMap.set('Planned', 'planned');
                statusMap.set('Approved', 'approved');
                statusMap.set('Currently being flown', 'current');
                statusMap.set('Mission complete', 'complete');

                let missionLines = timeline.append('g').selectAll('missions')
                    .data(plotData)
                    .enter().append('rect')
                    .attr('class', d => 'status-' + statusMap.get(d.category))
                    .attr('x', d => xScale(parseTime(d.start)))
                    .attr('y', (d, i) => yScale(i + .5) - 11)
                    .attr('width', d => xScale(parseTime(d.end)) - xScale(parseTime(d.start)))
                    .attr('height', 22);

                // labels
                let labels = timeline.append('g').selectAll('.mission-labels')
                    .data(plotData)
                    .enter().append('text')
                    .text(d => d.id)
                    .attr('x', d => xScale(parseTime(d.start)))
                    .attr('y', (d, i) => yScale(i + .5) + 5);

                // legend
                let legendData = [
                    { text: 'Considered', class: 'status-considered' },
                    { text: 'Planned', class: 'status-planned' },
                    { text: 'Approved', class: 'status-approved' },
                    { text: 'Current', class: 'status-current' },
                    { text: 'Completed', class: 'status-complete' }
                ];

                svg.append('rect')
                    .style('fill', 'white')
                    .style('stroke-width', '1')
                    .style('stroke', 'lightgray')
                    .attr('x', 0)
                    .attr('y', (d, i) => 0)
                    .attr('width', 125)
                    .attr('height', 125);

                let legend = svg.selectAll('.legend')
                    .data(legendData)
                    .enter().append('g')
                    .attr('transform', (d, i) => 'translate(5,' + (8 + i*25) + ')');

                legend.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('class', d => d.class);

                legend.append('text')
                    .attr('x', 20)
                    .attr('y', 10)
                    .text((d, i) => d.text)
                    .style('text-anchor', 'start')
                    .style('font-size', 15);

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
                    .text('Year');

                // Restore old zoom values if they are there
                gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
            }
        },
        watch: {
            size: function(val, oldVal) {
                console.log("Size changed");
                this.drawTimeline();
            }
        },
        mounted() {
            this.drawTimeline();
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .plot-container {
        width: 100%;
    }
    .status-considered {
        fill: lighten($green, 5%);
        stroke-width: 6px;
    }

    .status-planned {
        fill: darken($green, 20%);
        fill-opacity: .7;
        stroke-width: 6px;
    }

    .status-approved {
        fill: $turquoise;
        fill-opacity: .7;
        stroke-width: 6px;
    }

    .status-current {
        fill: $blue;
        stroke-width: 6px;
    }

    .status-complete {
        fill: $grey-light;
        stroke-width: 6px;
    }
</style>