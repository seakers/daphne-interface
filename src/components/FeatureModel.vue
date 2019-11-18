<template>
    <div>

        <div v-bind:id="comp_id" style="max-width: 100%"></div>

    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from '../scripts/utils';
    import * as d3 from 'd3';
    import smap from '../scripts/smap';
    export default {
        name: "FeatureModel",

        //--> ({emptyOrbit[2;;]}&&{inOrbit[4;2;]}&&{emptyOrbit[1;;]})
        props: ['featureDetails'],

        //--> Other Vue components it uses
        components: {},

        //--> Variables this vue object contains
        data() {
            return {
                comp_id: "dddd",
                comp_id_d3: "#dddd",
                last_id: "feature-details-view",
                temp_data: "({emptyOrbit[2;;]}&&{inOrbit[4;2;]}&&{emptyOrbit[1;;]})",
                feature_details: '',
                expressionTree: '',
                width: 300,
                height: 200,
                nextIndex: 0,
                selectedNode: null,
                color: {
                    'default': '#616161',
                    'logic': '#2383FF',
                    'add': '#FF7979',
                    'deactivated': '#E3E3E3',
                    'temp': '#C6F3B6'
                },
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
                orbit_list: 'get_orbit_list',
                instrument_list: 'get_instrument_list',
            }),

        },

        methods: {
            toggleDetails(){
                this.tree = d3.tree().size([200, 300]);
                d3.select(this.comp_id_d3).select('svg').remove();
                let svg = d3.select(this.comp_id_d3)
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
                let svg = d3.select(this.comp_id_d3).select('svg').select('g');

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
            diagonal(s, d) {
                return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
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

            uuidv4() {
                return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            },
        },



        created() {
            this.comp_id = "a" + Math.random().toString(36).replace('0.', '');
            this.comp_id_d3 = '#' + this.comp_id;

            this.feature_details = this.featureDetails;
            console.log("-------------------------------------------------");
            console.log(this.feature_details);
            this.expressionTree = this.constructTree(this.feature_details);
        },
        mounted(){
            this.toggleDetails();
        },



    }
</script>

<style scoped>

</style>