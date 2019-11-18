<template>
    <div>
        <div style="">
            <ul>
                <li>
                    When multiple designs have common performance measures, it is likely they share a common feature.
                    Here are some features mined from the pareto front. Hover over a feature to highlight the designs containing it and
                    click a feature to get feature information.
                </li>
            </ul>
        </div>

        <div style="padding: 5px;" @mouseover="mouseOverOne" @mouseleave="mouseGone">
            <button class="button is-link is-small" title="Show feature 1 info" style="margin-left: 10px;" v-on:click="toggle_feature_one">Feature 1</button>
            <template v-if="show_one === true"><feature-model v-bind:featureDetails="plot_features[0]['expression']"></feature-model></template>
        </div>

        <div style="padding: 5px;" @mouseover="mouseOverTwo" @mouseleave="mouseGone">
            <button class="button is-link is-small" title="Show feature 2 info" style="margin-left: 10px;" v-on:click="toggle_feature_two">Feature 2</button>
            <template v-if="show_two === true"><feature-model v-bind:featureDetails="plot_features[1]['expression']"></feature-model></template>
        </div>

        <div style="padding: 5px;" @mouseover="mouseOverThree" @mouseleave="mouseGone">
            <button class="button is-link is-small" title="Show feature 3 info" style="margin-left: 10px;" v-on:click="toggle_feature_three">Feature 3</button>
            <template v-if="show_three === true"><feature-model v-bind:featureDetails="plot_features[2]['expression']"></feature-model></template>
        </div>

        <div style="padding: 5px;" @mouseover="mouseOverFour" @mouseleave="mouseGone">
            <button class="button is-link is-small" title="Show feature 4 info" style="margin-left: 10px;" v-on:click="toggle_feature_four">Feature 4</button>
            <template v-if="show_four === true"><feature-model v-bind:featureDetails="plot_features[3]['expression']"></feature-model></template>
        </div>

        <div style="padding: 5px;" @mouseover="mouseOverFive" @mouseleave="mouseGone">
            <button class="button is-link is-small" title="Show feature 5 info" style="margin-left: 10px;" v-on:click="toggle_feature_five">Feature 5</button>
            <template v-if="show_five === true"><feature-model v-bind:featureDetails="plot_features[4]['expression']"></feature-model></template>
        </div>
<!--        <vue-plotly :data="plotData" :layout="plotLayout" :options="{displayModeBar: false}" v-on:click="createSubPlot"/>-->

    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import FeatureModel from "./FeatureModel";
    import VuePlotly from '@statnett/vue-plotly'
    import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from '../scripts/utils';
    import * as d3 from 'd3';
    import smap from '../scripts/smap';
    export default {
        name: "FeaturePlot",

        components: {
            VuePlotly,
            "feature-model": FeatureModel,
        },

        data() {
            return {
                show_one: false,
                show_two: false,
                show_three: false,
                show_four: false,
                show_five: false,

                plot_features: [],
                plotData: [],
                plotLayout: {},
                showFeatureInfo: false,

                tree: {},
                nextIndex: 0,
                selectedNode: null,
                color: {
                    'default': '#616161',
                    'logic': '#2383FF',
                    'add': '#FF7979',
                    'deactivated': '#E3E3E3',
                    'temp': '#C6F3B6'
                },
                expressionTree: [],
                width: 300,
                height: 200,
                margin: {
                    left: 35,
                    right: 20,
                    top: 10,
                    bottom: 20
                },
            }
        },

        computed: {
            ...mapGetters({
                features_teacher: 'get_features',
            }),
        },

        methods: {
            mouseOverOne(){
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.plot_features[0]['expression']);
            },
            mouseOverTwo(){
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.plot_features[1]['expression']);
            },
            mouseOverThree(){
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.plot_features[2]['expression']);
            },
            mouseOverFour(){
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.plot_features[3]['expression']);
            },
            mouseOverFive(){
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.plot_features[4]['expression']);
            },
            mouseGone(){
                this.$store.commit('setCurrentExpression', '');
            },

            toggle_feature_one(){
                this.show_one = !this.show_one;
                this.$store.commit('setCurrentExpression', '');
                if(this.show_one === true){
                    this.$store.commit('setCurrentExpression', this.plot_features[0]['expression']);
                }
            },
            toggle_feature_two(){
                this.show_two = !this.show_two;
                this.$store.commit('setCurrentExpression', '');
                if(this.show_two === true){
                    this.$store.commit('setCurrentExpression', this.plot_features[1]['expression']);
                }
            },
            toggle_feature_three(){
                this.show_three = !this.show_three;
                this.$store.commit('setCurrentExpression', '');
                if(this.show_three === true){
                    this.$store.commit('setCurrentExpression', this.plot_features[2]['expression']);
                }
            },
            toggle_feature_four(){
                this.show_four = !this.show_four;
                this.$store.commit('setCurrentExpression', '');
                if(this.show_four === true){
                    this.$store.commit('setCurrentExpression', this.plot_features[3]['expression']);
                }
            },
            toggle_feature_five(){
                this.show_five = !this.show_five;
                this.$store.commit('setCurrentExpression', '');
                if(this.show_five === true){
                    this.$store.commit('setCurrentExpression', this.plot_features[4]['expression']);
                }
            },



            //--> Set plotData and plotLayout
            computePlot() {
                let features = this.plot_features;


                let plot_data = [];
                let xValues = [];
                let yValues = [];
                let marker_symbol = [];
                let marker_text = [];
                let custom_data = [];
                for(let x = 0; x < features.length; x++){
                    let point_data = [];
                    let feature = features[x];

                    let expression = feature.expression;
                    let treeElements = this.constructTree(expression);
                    point_data.push(treeElements);
                    point_data.push(expression);
                    custom_data.push(point_data);
                    let id = feature.id;
                    let name = feature.name;
                    let metrics = feature.metrics;
                    let supps = metrics[0];
                    let lifts = metrics[1];
                    let conf1s = metrics[2];
                    let conf2s = metrics[3];

                    xValues.push(conf1s);
                    yValues.push(conf2s);
                    marker_symbol.push("diamond");

                    let text = '<b>Support:</b> ' + (supps.toFixed(2)).toString() + '<br>';
                    text = text + '<b>Lifts:</b> ' + (lifts.toFixed(2)).toString() + '<br>';
                    text = text + '<b>Specifity:</b> ' + (conf1s.toFixed(2)).toString() + '<br>';
                    text = text + '<b>Coverage:</b> ' + (conf2s.toFixed(2)).toString() + '<br>';
                    marker_text.push(text);
                }

                //--> Normalize x value
                let x_norms = [];
                let xMin = Math.min(...xValues);
                let xMax = Math.max(...xValues);
                for(let z = 0; z < xValues.length; z++){
                    let value = xValues[z];
                    let normalized = (value - xMin) / (xMax - xMin);
                    x_norms.push(normalized);
                }

                plot_data.push({
                    x: xValues,
                    y: yValues,
                    mode: 'markers',
                    hoverinfo: "text",
                    text: marker_text,
                    customdata: custom_data,
                    marker: {
                        symbol: marker_symbol,
                        size: 10,
                        color: x_norms,
                        colorscale: [[0, 'hsl(141, 53%, 53%)'], [1, 'hsl(348, 86%, 61%)']],
                    }
                });

                this.plotData = plot_data;

                let plot_layout = {
                    xaxis: {title: 'Specifity', nticks: 10, zeroline: true, showgrid: true},
                    yaxis: {title: 'Coverage', nticks: 10, zeroline: true, showgrid: true, range: [0,1.1]},
                    margin: {t: 25, l: 55, r: 20, b: 45},
                    hovermode: 'closest',
                    plot_bgcolor:"whitesmoke",
                    paper_bgcolor:"whitesmoke",
                };

                this.plotLayout = plot_layout;

            },

            constructTree(expression, depth) {

                // Initial checks
                if (depth == null) {
                    depth = 0;
                }
                if (!expression) {
                    return {};
                }

                let newDepth = depth;
                let newExpression = expression;
                let _newExpression = '';

                // Remove outer parenthesis
                let parenthesesRemoved = removeOuterParentheses(newExpression, newDepth);
                newExpression = parenthesesRemoved.expression;
                newDepth = +parenthesesRemoved.level;
                if (getNestedParenthesisDepth(newExpression) === 0) { // Given expression does not have a nested structure
                    if (newExpression.indexOf('&&') === -1 && newExpression.indexOf('||') === -1) {
                        // There is no logical connective: return single feature (leaf node)
                        return {
                            depth: newDepth,
                            type: 'leaf',
                            name: newExpression,
                            children: null,
                            id: this.nextIndex++
                        };
                    }
                    else {
                        // There are logical connectives
                        _newExpression = newExpression;
                    }
                }
                else {
                    // Hide the nested structure by replacing whatever's inside parentheses with special characters (currently using X's).
                    _newExpression = collapseParenIntoSymbol(newExpression);
                }

                let logic = '';
                let name = '';
                if (_newExpression.indexOf('&&') !== -1){
                    logic = '&&';
                    name = 'AND';
                }
                else {
                    logic = '||';
                    name = 'OR';
                }
                let thisNode = {
                    depth: newDepth,
                    type: 'logic',
                    name: name,
                    children: [],
                    id: this.nextIndex++
                };
                let _childrenExpressions = _newExpression.split(logic);
                let childrenExpressions = newExpression;
                for(let i = 0; i < _childrenExpressions.length; i++){

                    // Get the length of each outermost level feature expression from _childExpression
                    let _childExpression = _childrenExpressions[i];
                    if(childrenExpressions.startsWith('&&') || childrenExpressions.startsWith('||')){
                        childrenExpressions = childrenExpressions.slice(2);
                    }

                    // Use the length obtained to slice the actual expression
                    let childExpression = childrenExpressions.slice(0,_childExpression.length);

                    // Update the rest of the feature expression to the next iteration
                    childrenExpressions = childrenExpressions.slice(_childExpression.length);

                    // Construct the tree for an individual outermost level feature
                    let child = this.constructTree(childExpression, newDepth + 1);
                    thisNode.children.push(child);
                }

                return thisNode;
            },

            createSubPlot(data){
                this.showFeatureInfo = true;
                let margin = this.margin;
                let width = this.width;
                let height = this.height;
                let expressionTree = data['points'][0]['customdata'][0];
                let expression = data['points'][0]['customdata'][1];
                this.expressionTree = expressionTree;
                console.log('_____________________________________');
                console.log(expression);
                this.$store.commit('setCurrentExpression', expression);

                //--> Set the size of the plot
                this.tree = d3.tree().size([this.height, this.width]);

                d3.select('#feature-details-view').select('svg').remove();
                let svg = d3.select('#feature-details-view')
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '200px')
                    .style('width', '100%')
                    .style('height', '200px')
                    .append('g')
                    .attr('transform', 'translate('+ 35 + ',' + 0 + ')');


                this.drawTree();


            },

            drawTree() {
                let duration = d3.event && d3.event.altKey ? 5000 : 500;

                let root = d3.hierarchy(this.expressionTree, d => d.children);
                root.x0 = this.height / 2;
                root.y0 = 0;

                let treeStructure = this.tree(root);

                // Compute the new tree layout.
                let nodes = treeStructure.descendants();
                let links = treeStructure.descendants().slice(1);

                // Normalize for fixed-depth

                //--> How far each node is spread apart vertically!
                nodes.forEach(d => { d.y = d.depth * 30; });
                let svg = d3.select('#feature-details-view').select('svg').select('g');

                let diagonal = this.diagonal;

                // Update the nodes…
                let node = svg.selectAll('g.node')
                    .data(nodes, d => d.id || (d.id = d.data.id));

                // Enter any new nodes at the parent's previous position.
                let nodeEnter = node.enter().append('g')
                    .attr('class', 'node')
                    .attr('transform', d => {
                        if (d.depth === 0) {
                            // return 'translate(' + d.x0 + ',' + d.y0 + ')';
                            return 'translate(' + d.y0 + ',' + d.x0 + ')';
                        }
                        else {
                            // return 'translate(' + d.parent.x0 + ',' + d.parent.y0 + ')';
                            return 'translate(' + d.parent.y0 + ',' + d.parent.x0 + ')';
                        }
                    });

                nodeEnter.append('circle')
                    .attr('r', 1e-6);

                nodeEnter.append('svg:text')
                    .attr('x', d => d.children || d._children ? -10 : 10)
                    .attr('dy', '.40em')
                    .style('font-size', '14px')
                    .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
                    .style('fill-opacity', 1e-6);

                nodeEnter.filter(d => d.data.type !== 'leaf')
                    .append('circle')
                    .attr('class', 'nodeRange')
                    .attr('r', 40)
                    .attr('opacity', 0)
                    .style('fill', 'red')
                    .attr('pointer-events', 'mouseover')
                    .on('mouseover', d => {
                        this.selectedNode = d;
                    })
                    .on('mouseout', d => {
                        this.selectedNode = null;
                    });

                // Transition nodes to their new position.
                let nodeUpdate = nodeEnter.merge(node);

                nodeUpdate.transition()
                    .duration(duration)
                    //.attr('transform', d => 'translate(' + d.y + ',' + d.x + ')');
                    .attr("transform", (d) => {
                        if(d.parent){
                            if(d.verticalOffset){
                                // pass

                            }else{
                                // Adjust the vertical location of each node so that it doesn't overlap with other nodes
                                let offset = 28;
                                let sibling = d.parent.children;
                                let depth = d.depth;

                                if(sibling.length % 2 === 1 && depth % 2 === 0){
                                    // When the number of children is odd, add offset to the vertical position
                                    let index = sibling.indexOf(d);
                                    let mid = (sibling.length - 1) / 2;
                                    if(index === mid){
                                        // Do nothing, as this one is in the middle
                                    }else if(index < mid){
                                        d.x = d.x - offset;
                                    }else{
                                        d.x = d.x + offset;
                                    }

                                    d.verticalOffset = true;
                                }
                            }
                        }
                        // return "translate(" + d.x + "," + d.y + ")";
                        return "translate(" + d.y+ "," + d.x + ")";
                    });

                nodeUpdate.select('circle')
                    .attr('r', 9.5)
                    .style('fill', d => {
                        if (d.data.deactivated) {
                            return this.color.deactivated;
                        }
                        else if(d.data.temp) {
                            return this.color.temp;
                        }
                        else {
                            if (d.data.type === 'logic') {
                                if(d.data.add){
                                    return this.color.add;
                                }
                                else {
                                    return this.color.logic;
                                }
                            }
                            else {
                                return this.color.default;
                            }
                        }
                    });
                nodeUpdate.select('text')
                    .attr('x', d => {
                        if (d.children) {
                            return -10;
                        }
                        else {
                            return 10;
                        }
                    })
                    .attr('text-anchor', d => {
                        if (d.children) {
                            return 'end';
                        }
                        else {
                            return 'start';
                        }
                    })
                    .text(d => this.baseFeatureTextConverter(d.data.name))
                    .style('fill', d => {
                        if (d.data.type === 'logic' && d.data.add) {
                            return this.color.add;
                        }
                        else {
                            return 'black';
                        }
                    })
                    .style('font-size', 10)
                    .style('fill-opacity', 1);

                // Transition exiting nodes to the parent's new position.
                let nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr('transform', d => {
                        if (d.depth === 0) {
                            return 'translate(' + d.y + ',' + d.x + ')';
                        }
                        else {
                            return 'translate(' + d.parent.y + ',' + d.parent.x + ')';
                        }
                    })
                    .remove();

                nodeExit.select('circle')
                    .attr('r', 1e-6);

                nodeExit.select('text')
                    .style('fill-opacity', 1e-6);


                // Update the links...
                let link = svg.selectAll('path.link')
                    .data(links, d => d.id);

                // Enter any new links at the parent's previous position.
                let linkEnter = link.enter().insert('path', 'g')
                    .attr('class', 'link')
                    .attr('d', d => {
                        let o = {
                            x: root.x0,
                            y: root.y0
                        };
                        return diagonal(o, o);
                    })
                    .style('stroke-width', d => 8)
                    .style('fill-opacity', 0.94)
                    .style('fill','none');

                let linkUpdate = linkEnter.merge(link);

                linkUpdate.transition()
                    .duration(duration)
                    .attr('d', d => {
                        return diagonal(d, d.parent);
                    })
                    .style('stroke', d => {
                        if (d.data.deactivated) {
                            return this.color.deactivated;
                        }
                        else if (d.data.temp) {
                            return this.color.temp;
                        }
                        else {
                            return this.color.default;
                        }
                    });

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr('d', d => {
                        let o = {
                            x: d.parent.x,
                            y: d.parent.y
                        };
                        return diagonal(o, o);
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(d => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                // TODO: Implement drag listener
                //        d3.selectAll('.treeNode')
                //            .call(that.dragListener);

                // TODO: Implement context menu
                //        d3.selectAll('.treeNode')
                //            .on('contextmenu', function(d){
                //
                //                d3.event.preventDefault();
                //                let coord = d3.mouse($('#feature_application_panel > svg > g').get(0));
                //                let context = d.type;
                //
                //                if(!that.contextMenu){
                //                    that.contextMenu = new ContextMenu();
                //                }
                //
                //                self.contextMenu.showMenu(d, coord);
                //
                //            });
            },


            baseFeatureTextConverter(expression) {
                let exp = expression;
                if (exp[0] === '{') {
                    exp = exp.substring(1, exp.length-1);
                }
                let featureName = exp.split('[')[0];

                if (featureName === 'paretoFront' || featureName === 'FeatureToBeAdded' ||
                    featureName === 'AND' || featureName === 'OR') {
                    return exp;
                }

                if (featureName[0] === '~') {
                    featureName = 'NOT '+ featureName.substring(1);
                }

                let featureArg = exp.split('[')[1];
                featureArg = featureArg.substring(0, featureArg.length-1);

                //--> Get our orbits
                let orbits = featureArg.split(';')[0].split(',');

                //--> Get our instruments
                let instruments = featureArg.split(';')[1].split(',');

                let numbers = featureArg.split(';')[2];

                let pporbits = '';
                let ppinstruments = '';
                for (let i = 0; i < orbits.length; i++) {
                    if (orbits[i].length === 0) {
                        continue;
                    }
                    if (i > 0) {
                        pporbits += ',';
                    }
                    pporbits += smap.index2DisplayName(orbits[i], 'orbit');
                }
                for (let i = 0; i < instruments.length; i++) {
                    if (instruments[i].length === 0) {
                        continue;
                    }
                    if (i > 0) {
                        ppinstruments += ',';
                    }
                    ppinstruments += smap.index2DisplayName(instruments[i], 'instrument');
                }
                return featureName + '[' + pporbits + ';' + ppinstruments + ';' + numbers + ']';
            },

            // Horizontal
            diagonal(s, d) {
                return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
            }




        },

        created() {
            this.plot_features = this.features_teacher;
            this.computePlot();
        },

        watch: {

        },



    }
</script>

<style scoped>

</style>