<template>
    <v-container>

        <svg style="height: 0; width: 0;">
            <defs>
                <marker id="m-end" markerWidth="10" markerHeight="10" refX="7" refY="2" orient="auto" markerUnits="strokeWidth" >
                    <path d="M0,0 L0,4 L4,2 z"></path>
                </marker>
            </defs>
        </svg>


        <!--HEADER-->
        <v-row justify="center">
            <v-col>
                <v-card elevation="0" dark color="secondary lighten-2">
                    <v-card-title>{{ formulation_name }}</v-card-title>
                </v-card>
            </v-col>
        </v-row>


        <!--GRAPH-->
        <v-row justify="center">
            <v-col cols="6">
                <v-card elevation="0" color="secondary lighten-2" dark>
                    <v-card-title>Decision Graph</v-card-title>
                    <v-card-subtitle>select a node or edge</v-card-subtitle>

                    <d3-network ref='net'
                                :net-nodes="nodes"
                                :net-links="edges"
                                :options="graph_options"
                                :link-cb="lcb"
                                @node-click="select_component"
                                @link-click="select_component"
                                class="white"
                                id="add-graph"
                    />
                    <v-container style="margin-top: 18px;">
                        <v-slider
                            v-model="force"
                            step="100"
                            thumb-label
                            ticks
                            dense
                            min="1000"
                            max="10000"
                            label="Edge Force"
                            thumb-color="secondary"
                        ></v-slider>
                        <v-btn color="secondary" v-on:click="reset_graph">Reset Graph</v-btn>
                    </v-container>
                </v-card>
            </v-col>


            <!--COMPONENT SELECTOR-->
            <v-col cols="6">
                <v-slide-y-reverse-transition mode="out-in">
                    <v-card class="d-flex flex-column white" elevation="0" min-height="100%" :key="selected_component.id" dark>



                        <!--INFO CARD TITLE-->
                        <v-card-title v-if="('is_info' in selected_component)" class="secondary lighten-2">{{ selected_component.name }}</v-card-title>
                        <v-card-subtitle v-if="('is_info' in selected_component)" class="secondary lighten-2">{{ selected_component.type }}</v-card-subtitle>


                        <!--COMPONENT CARD TITLES-->
                        <v-card-title v-if="selected_component.obj_type === 'Node'" class="secondary lighten-2">{{ selected_component.name }}</v-card-title>
                        <v-card-subtitle v-if="selected_component.obj_type === 'Node'" class="secondary lighten-2">{{ selected_component.type }}</v-card-subtitle>

                        <v-card-title v-if="selected_component.obj_type === 'Edge'" class="secondary lighten-2">Edge</v-card-title>
                        <v-card-subtitle v-if="selected_component.obj_type === 'Edge'" class="secondary lighten-2">parent info | child info</v-card-subtitle>


                        <!--INFO CARD CONTENT-->




                        <!--COMPONENT CARD CONTENT-->







                        <v-spacer></v-spacer>
                        <v-bottom-navigation
                            :value="component_selector_tab"
                            color="white"
                            background-color="secondary lighten-2"
                            class="elevation-0"
                            grow
                            mandatory
                        >
                            <v-btn>
                                <span class="text-h6">Details</span>
                            </v-btn>
                            <v-btn>
                                <span class="text-h6">Edit</span>
                            </v-btn>
                            <v-btn>
                                <span class="text-h6">Connections</span>
                            </v-btn>
                        </v-bottom-navigation>
                    </v-card>
                </v-slide-y-reverse-transition>
            </v-col>
        </v-row>




    </v-container>
</template>

<script>
    import D3Network from 'vue-d3-network';
    import { mapState } from 'vuex';
    import * as _ from "lodash-es";
    import {parse_child_nodes} from "../../add_store/utils";
    import Vue from "vue";
    export default {
        name: "add-graph",
        components: {
            D3Network
        },
        data: function () {
            return {

                // --> Graph
                nodes: [],
                edges: [],
                force: 6000,
                nodeSize: 20,

                // --> Component Selector
                component_selector_tab: 0,
                component_selector_tabs: [ 'View', 'Edit', 'Adjacency Matrix' ],
                selected_component: {
                    name: 'Decision Tool',
                    type: 'no component selected',
                    id: 0,
                    is_info: true,
                },
                info_component: {
                    name: 'Component Selection Tool',
                    type: 'no component selected',
                    id: 0,
                    is_info: true,
                },



            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,

                // --> Graph objects from Neo4j
                db_nodes: state => state.graph.nodes,
                db_edges: state => state.graph.edges,
            }),

            // --> FORMULATION
            formulation_name(){
                return this.$route.params.name;
            },

            // --> NEO4J OBJECTS
            driver(){
                return this.$neo4j.getDriver();
            },
            graph_options() {
                return {
                    force: this.force,
                    nodeSize: this.nodeSize,
                    fontSize: 15,
                    nodeLabels: true,
                    canvas: false,
                    linkWidth: 3
                }
            },
        },
        methods: {
            lcb (link) {
                link._svgAttrs = { 'marker-end': 'url(#m-end)'}
                return link
            },
            async select_component(event, object){
                console.log('--> OBJECT SELECTED', object);
                await this.reset_node_size();
                await this.reset_node_color();
                if(this.selected_component === object){
                    await this.clear_selection();
                }
                else{
                    Vue.set(object, '_color', '#EF6C00');
                    if(object.obj_type === 'Node'){
                        Vue.set(object, '_size', 25);
                    }

                    this.selected_component = object;
                }
            },
            async reset_graph(){
                await this.reset_node_size();
                await this.reset_node_color();
                await this.reset_node_position();
                await this.clear_selection();
            },
            async clear_selection(){
                this.selected_component = _.cloneDeep(this.info_component);
            },
            async reset_node_size(){
                for(let x = 0; x < this.nodes.length; x++){
                    Vue.set(this.nodes[x], '_size', this.nodeSize);
                }
            },
            async reset_node_color(){
                for(let x = 0; x < this.nodes.length; x++){
                    let node = this.nodes[x];
                    if(node.type === 'Root'){
                        Vue.set(node, '_color', '#4CAF50');
                    }
                    else if(node.type === 'Design'){
                        Vue.set(node, '_color', '#F44336');
                    }
                    else{
                        Vue.set(node, '_color', '#877b67');
                    }
                }
                for(let x = 0; x < this.edges.length; x++){
                    let edge = this.edges[x];
                    Vue.set(edge, '_color', '#877b67');
                }
            },
            async reset_node_position(){
                let height = document.getElementById('add-graph').clientHeight;
                let width = document.getElementById('add-graph').clientWidth;
                let y_displacement = 40;

                let x_pos = width / 2;
                let y_pos_root = y_displacement;
                let y_pos_design = height - y_displacement;

                for(let x = 0; x < this.nodes.length; x++){
                    let node = this.nodes[x];
                    if(node.type === 'Root'){
                        node.fx = x_pos;
                        node.fy = y_pos_root;
                    }
                    if(node.type === 'Design'){
                        node.fx = x_pos;
                        node.fy = y_pos_design;
                    }
                }
            },
        },
        watch: {
            db_nodes: function(val, oldVal) {
                this.nodes = _.cloneDeep(this.db_nodes);
                this.reset_node_position();
            },
            db_edges: function(val, oldVal) {
                this.edges = _.cloneDeep(this.db_edges);
            },
        },
        async mounted(){

            // --> 1. Queries ran locally in this component
            await this.$store.dispatch('query_formulation', this.formulation_name);
        }
    }
</script>

<style scoped>
    #m-end path {
        fill: #000000;
    }

    .node:hover{
        cursor: pointer !important;
    }

</style>