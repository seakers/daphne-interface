<template>
    <v-container>



        <v-row justify="center">
            <v-col>
                <v-card elevation="0">

                    <v-card-title>{{ formulation_name }} Formulation</v-card-title>

                    <v-divider style="margin-top: 0;"></v-divider>


                    <d3-network ref='net'
                                :net-nodes="nodes"
                                :net-links="edges"
                                :options="graph_options"
                                :link-cb="lcb"
                                @node-click="select_node"
                                @link-click="select_edge"
                    />


                </v-card>
            </v-col>
        </v-row>





    </v-container>
</template>

<script>
    import D3Network from 'vue-d3-network';
    import { mapState } from 'vuex';
    import * as _ from "lodash-es";
    import {parse_child_nodes} from "../../add_store/utils";
    export default {
        name: "add-graph",
        components: {
            D3Network
        },
        data: function () {
            return {

                // --> Graph options
                graph_options: {
                    force: 3000,
                    nodeSize: 20,
                    nodeLabels: true,
                    canvas: false,
                    linkWidth:2
                }




            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,

                // --> Graph objects from Neo4j
                root_node: state => state.graph.root_node,
                decision_nodes: state => state.graph.decision_nodes,
                design_node: state => state.graph.design_node,
            }),

            // --> FORMULATION
            formulation_name(){
                return this.$route.params.name;
            },

            // --> NEO4J OBJECTS
            driver(){
                return this.$neo4j.getDriver();
            },

            // --> Neo4j objects to vue-d3-network conversion
            nodes() {
                console.log('--> vue-d3-network conversion - nodes');
                let nodes = []
                if(this.root_node === null || this.decision_nodes === null || this.design_node === null){
                    console.log('--> COULD NOT BUILD NODES');
                    return nodes;
                }




                nodes.push(this.root_node);
                for(let x=0;x<this.decision_nodes.length;x++){
                    nodes.push(this.decision_nodes[x]);
                }
                let design_node = _.cloneDeep(this.design_node);
                design_node.id = (nodes.length + 1);
                nodes.push(design_node);
                return nodes;
            },
            edges() {
                console.log('--> vue-d3-network conversion - edges');
                let edges = [];
                if(this.root_node === null || this.decision_nodes === null || this.design_node === null){
                    console.log('--> COULD NOT BUILD EDGES');
                    return edges;
                }

                // 1. Iterate over nodes
                for(let x=0;x<this.nodes.length;x++){
                    let node = this.nodes[x];

                    // This should set this.child_data
                    let child_data = null;
                    this.$neo4j.run(`
                    MATCH (m:${this.formulation_name}:${node.type})-->(dec)
                    WHERE m.name = "${node.name}"
                    RETURN dec.name, dec.type`,
                        {}
                    ).then(res => {
                        child_data = parse_child_nodes(res);
                    });

                    for(let y=0;y<child_data.length;y++){
                        let child = child_data[y];
                        let link = {
                            sid: node.id,
                            tid: this.nodes.find(item => item.name === child.name && item.type === child.type).id,
                            _color: 'gray'
                        }
                        edges.push(link);
                    }
                }
                return edges;
            }
        },
        methods: {
            lcb (link) {
                link._svgAttrs = { 'marker-end': 'url(#m-end)'}
                return link
            },
            async select_node(event, node){
                await this.$store.commit('set_selected_node', _.cloneDeep(node));
            },
            async select_edge(event, node){
                await this.$store.commit('set_selected_edge', _.cloneDeep(node));
            },
        },
        async mounted(){

            // --> 1. Queries ran locally in this component
            await this.$store.dispatch('query_formulation', this.formulation_name);
        }
    }
</script>

<style scoped>

</style>