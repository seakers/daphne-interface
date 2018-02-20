<template>
    <div class="panel-block functionality">
        <div id="feature_expression_panel" class="container is-fluid">
            <div class="buttons has-addons is-centered">
                <a id="conjunctive_local_search" class="button">Improve Specificity</a>
                <a id="disjunctive_local_search" class="button">Improve Coverage</a>
                <a id="clear_all_features" class="button">Clear</a>
            </div>
        </div>
        <div id="feature-application-panel" class="container is-fluid"></div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as d3 from 'd3';
    import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from '../scripts/utils';
    import * as _ from 'lodash-es';
    
    export default {
        name: 'feature-application',
        data() {
            return  {
                color: {
                    'default': '#616161',
                    'logic': '#2383FF',
                    'add': '#FF7979',
                    'deactivated': '#E3E3E3',
                    'temp': '#C6F3B6'
                },
                margin: {
                    left: 70,
                    right: 20,
                    top: 10,
                    bottom: 20
                },
                width: 1500,
                height: 320,
                tree: {},
                nextIndex: 0,
                selectedNode: null
            }
        },
        beforeMount() {
            this.width =  1500 - this.margin.left - this.margin.right;
            this.height = 310 - this.margin.top - this.margin.bottom;
        },
        computed: {
            ...mapGetters({
                hoveredExpression: 'getHoveredExpression',
                clickedExpression: 'getClickedExpression'
            }),
            shownExpression() {
                if (this.hoveredExpression !== '') {
                    return this.hoveredExpression;
                }
                else {
                    return this.clickedExpression;
                }
            },
            expressionTree() {
                this.nextIndex = 0;
                return this.constructTree(this.shownExpression);
            }
        },
        methods: {
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
                let childrenExpressions = _newExpression.split(logic);
                childrenExpressions.forEach(childExpression => {
                    let child = this.constructTree(childExpression, newDepth + 1);
                    thisNode.children.push(child);
                });

                return thisNode;
            },
            
            visitNodes(source, func, reverse) {
                let re;
                if (typeof func !== 'undefined') {
                    re = func(source);
                    // If func is a function that returns something, stop traversing tree and return. Otherwise, apply func and keep traversing the tree
                    if (re) {
                        return re;
                    }
                }
                if (reverse) {
                    if (source.parent) {
                        re = this.visitNodes(source.parent, func, true);
                        if (re) {
                            return re;
                        }
                    }
                }
                else {
                    if (source) {
                        if (source.children) {
                            for (let i = 0; i < source.children.length; i++) {
                                re = this.visitNodes(source.children[i], func);
                                if (re) {
                                    return re;
                                }
                            }
                        }
                    }
                }
                return null;
            },
            
            drawTree() {
                if (_.isEmpty(this.expressionTree)) {
                    d3.selectAll('.node').remove();
                    d3.selectAll('.link').remove();
                    return;
                }

                let duration = d3.event && d3.event.altKey ? 5000 : 500;

                let root = d3.hierarchy(this.expressionTree, d => d.children);
                root.x0 = this.height / 2;
                root.y0 = 0;

                let treeStructure = this.tree(root);

                // Compute the new tree layout.
                let nodes = treeStructure.descendants();
                let links = treeStructure.descendants().slice(1);

                // Normalize for fixed-depth.
                nodes.forEach(d => { d.y = d.depth * 180; });

                let svg = d3.select('#feature-application-panel').select('svg').select('g');

                let diagonal = this.diagonal;

                // Update the nodes…
                let node = svg.selectAll('g.node')
                    .data(nodes, d => d.id || (d.id = d.data.id));

                // Enter any new nodes at the parent's previous position.
                let nodeEnter = node.enter().append('g')
                    .attr('class', 'node')
                    .attr('transform', d => {
                        if (d.depth === 0) {
                            return 'translate(' + d.y0 + ',' + d.x0 + ')';
                        }
                        else {
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
                    .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')');

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
                    .text(d => this.$store.state.problem.ppFeatureSingle(d.data.name))
                    .style('fill', d => {
                        if (d.data.type === 'logic' && d.data.add) {
                            return this.color.add;
                        }
                        else {
                            return 'black';
                        }
                    })
                    .style('font-size', 23)
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
            }
        },
        watch: {
            expressionTree: function(val, oldVal) {
                let margin = this.margin;
                let width = this.width;
                let height = this.height;

                this.tree = d3.tree().size([height, width]);

                d3.select('#feature-application-panel').select('svg').remove();

                let svg = d3.select('#feature-application-panel')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.bottom + margin.top)
                    .append('g')
                    .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')');

                this.drawTree();
            }
        }
    }
</script>

<style scoped>

</style>