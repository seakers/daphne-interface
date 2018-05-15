<template>
    <div class="content">
        <h2>Launch Vehicles</h2>
        <div class="select">
            <select v-model="selectedOrbit">
                <option v-for="mission in launchCosts" v-bind:value="mission.orbit_name" v-bind:key="mission.orbit_name">{{ mission.orbit_name }}</option>
            </select>
        </div>
        <div v-show="currentMission !== undefined">
            <svg width="960" height="500" id="mass-budget"></svg>
            <svg width="960" height="500" id="power-budget"></svg>
            <p v-if="currentMission !== undefined">Launch vehicle: {{ currentMission.launch_vehicle }}</p>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import * as d3 from 'd3';

    export default {
        name: 'launch-vehicles-plots',
        data() {
            return {
                selectedOrbit: ''
            }
        },
        computed: {
            ...mapState({
                launchCosts: state => state.launchCost.launchCosts
            }),
            currentMission() {
                return this.launchCosts.find((mission) => mission.orbit_name === this.selectedOrbit);
            },
            massBudgetArray() {
                let massBudget = [];
                if (this.currentMission !== undefined) {
                    for (let property in this.currentMission.mass_budget) {
                        if (this.currentMission.mass_budget.hasOwnProperty(property)) {
                            massBudget.push({
                                property: property,
                                value: this.currentMission.mass_budget[property]
                            })
                        }
                    }
                }
                return massBudget;
            }
        },
        watch: {
            launchCosts: function(val, oldVal) {
                this.selectedOrbit = this.launchCosts[0].orbit_name;
            },
            massBudgetArray: function(val, oldVal) {
                if (this.massBudgetArray.length === 0) {
                    return;
                }

                let svg = d3.select('#mass-budget'),
                    width = +svg.attr('width'),
                    height = +svg.attr('height'),
                    radius = Math.min(width, height) / 2,
                    g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

                let color = d3.scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00', '#ff8c00', '#ff8c00' ,'#ff8c00']);

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
                    .data(pie(this.massBudgetArray))
                    .enter().append('g')
                    .attr('class', 'arc');

                arc.append('path')
                    .attr('d', path)
                    .attr('fill', d => color(d.data.property));

                arc.append('text')
                    .attr('transform', function(d) { return 'translate(' + label.centroid(d) + ')'; })
                    .attr('dy', '0.35em')
                    .text(d => d.data.property);
            }
        }
    }
</script>

<style scoped>

</style>