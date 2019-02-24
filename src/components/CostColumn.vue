<template>
    <div class="content">
        <h2>Cost</h2>
        <div class="select">
            <select v-model="selectedOrbit">
                <option v-for="mission in budgets" v-bind:value="mission.orbit_name" v-bind:key="mission.orbit_name">{{ mission.orbit_name }}</option>
            </select>
        </div>
        <div>
            <h3 v-if="currentMission !== undefined">Payload: {{currentMission.payload.join(', ')}}</h3>
            <div id="pie-wrapper">
                <div id="mass-holder">
                    <h3 v-if="currentMission !== undefined">Mass Budget: {{currentMission.total_mass | round(2)}} kg</h3>
                    <svg height="300" id="mass-budget"></svg>
                </div>
                <div id="cost-holder">
                    <h3 v-if="currentMission !== undefined">Lifecycle Cost: {{currentMission.total_cost | round(2)}} $M</h3>
                    <svg height="300" id="cost-budget"></svg>
                </div>
            </div>
            <h3>Power</h3>
            <h4 v-if="currentMission !== undefined" v-for="powerInfo in powerBudgetArray">{{powerInfo.property}}: {{ powerInfo.value | round(2) }} W</h4>
            <h3 v-if="currentMission !== undefined">Launch vehicle: {{ currentMission.launch_vehicle }}</h3>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import * as d3 from 'd3';

    function round(value, decimals) {
        if(!value) {
            value = 0;
        }

        if(!decimals) {
            decimals = 0;
        }

        value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return value;
    }

    export default {
        name: 'cost-column',
        data() {
            return {
                selectedOrbit: ''
            }
        },
        computed: {
            ...mapState({
                budgets: state => state.cost.budgets
            }),
            currentMission() {
                return this.budgets.find((mission) => mission.orbit_name === this.selectedOrbit);
            },
            massBudgetArray() {
                let massBudget = [];
                if (this.currentMission !== undefined) {
                    for (let property in this.currentMission.mass_budget) {
                        if (this.currentMission.mass_budget.hasOwnProperty(property)) {
                            massBudget.push({
                                property: property,
                                value: +this.currentMission.mass_budget[property]
                            })
                        }
                    }
                }
                return massBudget;
            },
            powerBudgetArray() {
                let powerBudget = [];
                if (this.currentMission !== undefined) {
                    for (let property in this.currentMission.power_budget) {
                        if (this.currentMission.power_budget.hasOwnProperty(property)) {
                            powerBudget.push({
                                property: property,
                                value: +this.currentMission.power_budget[property]
                            })
                        }
                    }
                }
                return powerBudget;
            },
            costBudgetArray() {
                let costBudget = [];
                if (this.currentMission !== undefined) {
                    for (let property in this.currentMission.cost_budget) {
                        if (this.currentMission.cost_budget.hasOwnProperty(property)) {
                            costBudget.push({
                                property: property,
                                value: this.currentMission.cost_budget[property]
                            })
                        }
                    }
                }
                return costBudget;
            }
        },
        filters: {
            round: function(value, decimals) {
                return round(value,decimals);
            }
        },
        methods: {
            drawPieChart(dataArray, svgId, width) {
                let legendWidth = 175;
                let legendHeight = 5 + 17*dataArray.length;

                let svg = d3.select(svgId);

                // clean everything before continuing
                svg.html("");

                if (width === undefined) {
                    width = +svg.attr('width');
                }
                svg.attr('width', width);
                let height = +svg.attr('height'),
                    radius = Math.min(width - legendWidth, height) / 2,
                    g = svg.append('g').attr('transform', 'translate(' + (legendWidth + (width - legendWidth) / 2) + ',' + height / 2 + ')');

                let color = d3.scaleOrdinal(d3.schemeCategory10);

                let pie = d3.pie()
                    .sort(null)
                    .value(d => d.value);

                let path = d3.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

                let label = d3.arc()
                    .outerRadius(radius - 40)
                    .innerRadius(radius - 40);

                let arc = g.selectAll('.arc')
                    .data(pie(dataArray))
                    .enter().append('g')
                    .attr('class', 'arc');

                arc.append('path')
                    .attr('d', path)
                    .attr('fill', d => color(d.data.property));

                function pointIsInArc(pt, ptData, d3Arc) {
                    // Center of the arc is assumed to be 0,0
                    // (pt.x, pt.y) are assumed to be relative to the center
                    let r1 = d3Arc.innerRadius()(ptData), // Note: Using the innerRadius
                        r2 = d3Arc.outerRadius()(ptData),
                        theta1 = d3Arc.startAngle()(ptData),
                        theta2 = d3Arc.endAngle()(ptData);

                    let dist = pt.x * pt.x + pt.y * pt.y,
                        angle = Math.atan2(pt.x, -pt.y); // Note: different coordinate system.

                    angle = (angle < 0) ? (angle + Math.PI * 2) : angle;

                    return (r1 * r1 <= dist) && (dist <= r2 * r2) &&
                        (theta1 <= angle) && (angle <= theta2);
                }

                arc.append("text")
                    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "middle")
                    .style('font-size', 12 + 'px')
                    .text(function(d) { return round(d.data.value, 2); })
                    .each(function (d) {
                        let bb = this.getBBox(),
                            center = label.centroid(d);

                        let topLeft = {
                            x : center[0] + bb.x,
                            y : center[1] + bb.y
                        };

                        let topRight = {
                            x : topLeft.x + bb.width,
                            y : topLeft.y
                        };

                        let bottomLeft = {
                            x : topLeft.x,
                            y : topLeft.y + bb.height
                        };

                        let bottomRight = {
                            x : topLeft.x + bb.width,
                            y : topLeft.y + bb.height
                        };

                        d.visible = pointIsInArc(topLeft, d, path) &&
                            pointIsInArc(topRight, d, path) &&
                            pointIsInArc(bottomLeft, d, path) &&
                            pointIsInArc(bottomRight, d, path);
                    })
                    .style('display', function (d) { return d.visible ? null : "none"; });

                // legend
                svg.append('rect')
                    .style('fill', 'white')
                    .style('stroke-width', '1')
                    .style('stroke', 'lightgray')
                    .attr('x', 0)
                    .attr('y', 10)
                    .attr('width', legendWidth)
                    .attr('height', legendHeight);

                let legend = svg.selectAll('.legend')
                    .data(dataArray)
                    .enter().append('g')
                    .attr('transform', (d, i) => 'translate(5,' + (15 + i*17) + ')');

                legend.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 10)
                    .attr('height', 10)
                    .style('fill', d => color(d.property));

                legend.append('text')
                    .attr('x', 20)
                    .attr('y', 10)
                    .text(d => d.property)
                    .attr('dy', '-1')
                    .style('text-anchor', 'start')
                    .style('font-size', 12 + 'px');
            }
        },
        watch: {
            budgets: function(val, oldVal) {
                this.selectedOrbit = this.budgets[0].orbit_name;
            },
            massBudgetArray: function(val, oldVal) {
                if (this.massBudgetArray.length === 0) {
                    return;
                }

                this.drawPieChart(this.massBudgetArray, '#mass-budget', document.getElementById('mass-holder').clientWidth);
            },
            costBudgetArray: function(val, oldVal, ) {
                if (this.costBudgetArray.length === 0) {
                    return;
                }

                this.drawPieChart(this.costBudgetArray, '#cost-budget', document.getElementById('cost-holder').clientWidth);
            }
        }
    }
</script>

<style scoped>
    #pie-wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: 100vw;
    }
</style>