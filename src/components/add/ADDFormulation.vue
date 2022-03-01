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


        <!--CONTENT-->
        <v-row justify="center">



            <!-- FORMULATION BUILDER -->
            <v-col cols="7">
                <v-card class="d-flex flex-column white" elevation="0" min-height="100%" dark>

                    <!--TITLE-->
                    <v-card-title class="secondary lighten-2">Formulation Builder</v-card-title>
                    <v-card-subtitle class="secondary lighten-2">{{ formulation_name }}</v-card-subtitle>

                    <!--DATA TABLE-->
                    <v-container>
                        <v-data-table :headers="headers" :items="matrix" light hide-default-footer hide-default-header class="elevation-0">

                            <!--MODALS-->
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Adjacency Matrix</v-toolbar-title>
                                    <v-spacer></v-spacer>

                                    <!--NEW DECISION-->
                                    <v-dialog v-model="new_dialogue" max-width="500px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="secondary lighten-1" dark class="mb-2" v-bind="attrs" v-on="on">
                                                Add Decision
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <span class="text-h5">Add Decision</span>
                                            </v-card-title>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" text @click="add_decision">
                                                    Add
                                                </v-btn>
                                                <v-btn color="blue darken-1" text @click="close_new_modal">
                                                    Cancel
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <!--DELETE DECISION-->
                                    <v-dialog v-model="delete_dialogue" max-width="500px">
                                        <v-card>
                                            <v-card-title class="text-h5">Warning</v-card-title>
                                            <v-card-text>Deleting this decision may break problems that have been created for this formulation. Select delete below if you wish to continue.</v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="secondary" text @click="delete_decision">delete</v-btn>
                                                <v-btn color="secondary" text @click="close_delete_modal">cancel</v-btn>
                                                <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-toolbar>
                            </template>

                            <!--TABLE HEADER-->
                            <template v-slot:header="{ props: { headers } }">
                                <thead>
                                    <tr>
                                        <th v-for="header in headers"
                                            class="text-center"
                                            :class="[(header.text === 'Node') ? 'table-node-header-top' : 'table-node-header']"
                                            style="vertical-align: middle;"
                                        >
                                            <span v-if="header.text === 'Node'" class="text-h5" style="color: black">{{ header.text }}</span>
                                            <span v-if="header.text !== 'Node'" class="text-subtitle-2" style="color: black">{{ header.text }}</span>
                                        </th>
                                    </tr>
                                </thead>
                            </template>

                            <!--TABLE CONTENT-->
                            <template v-slot:body="{ items }">
                                <tbody>
                                    <tr v-for="(row, r_idx) in items">
                                        <td v-for="(col, c_idx) in headers"
                                            class="text-center"
                                            :class="[(col.value === 'name' || col.value === 'actions') ? 'table-node-header' : 'table-node-cell']"
                                            style="vertical-align: middle;"
                                        >
                                            <span v-if="col.value === 'name'" class="text-subtitle-2" style="color: black">
                                                {{ row[col.value] }}
                                            </span>

                                            <v-simple-checkbox v-if="col.value !== 'name' && col.value !== 'actions' && r_idx !== (c_idx-1)"
                                                               v-model="row[col.value]" v-on:click="toggle_edge(row, col)"
                                            ></v-simple-checkbox>

                                            <v-icon v-if="col.value !== 'name' && col.value !== 'actions' && r_idx === (c_idx-1)">mdi-window-close</v-icon>

                                            <v-icon v-if="col.value === 'actions'" v-on:click="open_delete_modal(row)">mdi-delete</v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                        </v-data-table>
                    </v-container>
                </v-card>
            </v-col>

            <!-- DECISION GRAPH -->
            <v-col cols="5">
                <v-card elevation="0" dark width="500">
                    <v-card-title class="secondary lighten-2">Decision Graph</v-card-title>
                    <v-card-subtitle class="secondary lighten-2">{{ formulation_name }}</v-card-subtitle>

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
                    <v-container class="white">
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
                            light
                        ></v-slider>
                        <v-btn color="secondary" v-on:click="reset_graph">Reset Graph</v-btn>
                    </v-container>
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
import Vue from "vue";
export default {
    name: "add-formulation",
    components: {
        D3Network
    },
    data: function () {
        return {

            // --> Graph
            nodes: [],
            edges: [],
            force: 1500,
            nodeSize: 20,

            // --> Matrix
            matrix: [],
            headers: [],
            new_dialogue: false,
            delete_dialogue: false,
            to_delete: null,

            // --> Component Selector
            selected_component: {
                name: 'Decision Tool',
                type: 'no component selected',
                is_info: true,
            },
            info_component: {
                name: 'Component Selection Tool',
                type: 'no component selected',
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
            db_matrix: state => state.graph.matrix,
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

        // --> Graph functions
        async select_component(event, object){
            console.log('--> OBJECT SELECTED', object);
            await this.reset_node_size();
            await this.reset_node_color();
            if(this.selected_component === object || object.type === 'Root' || object.type === 'Design'){
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

        // --> Toggle edge
        async toggle_edge(row, header){
            let parent_name = row.name;
            let child_name = header.value;
            let value = row[child_name];
            let dependency_name = '';
            if(parent_name === 'Root'){
                dependency_name = 'ROOT_DEPENDENCY';
            }
            else if(child_name === 'Design'){
                dependency_name = 'FINAL_DEPENDENCY';
            }
            else{
                dependency_name = 'DEPENDENCY';
            }

            let edge_info = {
                parent: parent_name,
                child: child_name,
                dependency: dependency_name,
                formulation: this.formulation_name
            }
            console.log('--> TOGGLING EDGE:', edge_info, value);

            if(value === true){
                await this.$store.dispatch('add_edge', edge_info);
            }
            else{
                await this.$store.dispatch('remove_edge', edge_info);
            }

            await this.$store.dispatch('query_formulation', this.formulation_name);
        },


        // --> Delete decision
        async open_delete_modal(decision){
            this.to_delete = decision;
            this.delete_dialogue = true;
        },
        async close_delete_modal(){
            this.to_delete = null;
            this.delete_dialogue = false;
        },
        async delete_decision(){
            console.log('--> DELETING DECISION:', this.to_delete);
            await this.close_delete_modal();
        },

        // --> Add decision
        async close_new_modal(){
            this.new_dialogue = false;
        },
        async add_decision(){
            console.log('--> ADDING NEW DECISION');
            await this.close_new_modal();
        }

    },
    watch: {
        db_nodes: function(val, oldVal) {
            this.nodes = _.cloneDeep(this.db_nodes);
            this.reset_node_position();
        },
        db_edges: function(val, oldVal) {
            this.edges = _.cloneDeep(this.db_edges);
        },
        db_matrix: function(val, oldVal) {

            // --> 1. Set matrix elements
            this.matrix = _.cloneDeep(this.db_matrix);

            // --> 2. Compute headers
            let headers = [
                { text: 'Node', value: 'name'}
            ]
            for(let x = 0; x < this.nodes.length; x++){
                headers.push({
                    text: this.nodes[x].name,
                    value: this.nodes[x].name,
                    sortable: false,
                })
            }
            headers.push({ text: 'Actions', value: 'actions', sortable: false })

            this.headers = headers;
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

.table-node-header-top {
    background-color: #E0E0E0;
}
.table-node-header {
    background-color: #F5F5F5;
}
.table-node-cell {

}



table th + th { border-left:1px solid #dddddd; }
table td + td { border-left:1px solid #dddddd; }

</style>