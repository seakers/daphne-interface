<template>
    <v-container>


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
                                class="secondary lighten-7"
                    />
                    <v-container style="margin-top: 18px;">
                        <v-slider
                            v-model="node_size"
                            step="1"
                            thumb-label
                            ticks
                            dense
                            min="10"
                            max="40"
                            label="Node Size"
                            dark
                        ></v-slider>
                        <v-slider
                            v-model="force"
                            step="100"
                            thumb-label
                            ticks
                            dense
                            min="6000"
                            max="11000"
                            label="Edge Force"
                            dark
                        ></v-slider>
                    </v-container>
                </v-card>
            </v-col>


            <!--COMPONENT SELECTOR-->
            <v-col cols="6">
                <v-slide-y-reverse-transition mode="out-in">
                    <v-card class="d-flex flex-column secondary lighten-7" elevation="0" min-height="100%" :key="selected_component.unique_idx" dark>



                        <!--INFO CARD TITLE-->
                        <v-card-title v-if="('is_info' in selected_component)" class="secondary lighten-2">{{ selected_component.name }}</v-card-title>
                        <v-card-subtitle v-if="('is_info' in selected_component)" class="secondary lighten-2">{{ selected_component.type }}</v-card-subtitle>


                        <!--COMPONENT CARD TITLES-->
                        <v-card-title v-if="selected_component.obj_type === 'Node'" class="secondary lighten-2">{{ selected_component.name }}</v-card-title>
                        <v-card-subtitle v-if="selected_component.obj_type === 'Node'" class="secondary lighten-2">{{ selected_component.type }} Node</v-card-subtitle>

                        <v-card-title v-if="selected_component.obj_type === 'Edge'" class="secondary lighten-2">Edge</v-card-title>
                        <v-card-subtitle v-if="selected_component.obj_type === 'Edge'" class="secondary lighten-2">parents | children info</v-card-subtitle>


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
                force: 7000,
                node_size: 20,

                // --> Component Selector
                component_selector_tab: 0,
                component_selector_tabs: [ 'View', 'Edit', 'Adjacency Matrix' ],
                selected_component: {
                    name: 'Decision Tool',
                    type: 'no component selected',
                    unique_idx: 0,
                    is_info: true,
                },
                info_component: {
                    name: 'Component Selection Tool',
                    type: 'no component selected',
                    unique_idx: 0,
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
                    nodeSize: this.node_size,
                    fontSize: 15,
                    nodeLabels: true,
                    canvas: false,
                    linkWidth:3
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
                await this.reset_colors();
                await this.reset_node_size();
                if(this.selected_component === object){
                    await this.clear_selection();
                }
                else{
                    Vue.set(object, '_color', '#383552');
                    if(object.obj_type === 'Node'){
                        Vue.set(object, '_size', 30);
                    }

                    this.selected_component = object;
                }
            },
            async clear_selection(){
                this.selected_component = _.cloneDeep(this.info_component);
            },
            async reset_colors(){
                for(let x = 0; x < this.nodes.length; x++){
                    this.nodes[x]._color = '#877b67';
                }
                for(let x = 0; x < this.edges.length; x++){
                    this.edges[x]._color = '#877b67';
                }
            },
            async reset_node_size(){
                for(let x = 0; x < this.nodes.length; x++){
                    Vue.set(this.nodes[x], '_size', this.node_size);
                }
            }
        },
        watch: {
            db_nodes: function(val, oldVal) {
                this.nodes = _.cloneDeep(this.db_nodes);
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
.node-label{
    font-size: 10em !important;
}
</style>