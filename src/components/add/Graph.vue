<template>
    <div class="graph-container">



        <div class="graph-display">





            <div class="graph-display-pages">

                <div class="tabs" style="min-height: 41px;">
                    <ul>
                        <li :class="{ 'is-active': selected_tab === 'graph'}" v-on:click="show_graph"><a>Graph</a></li>
                        <li :class="{ 'is-active': selected_tab === 'plot'}" v-on:click="show_plot"><a>Design Plot</a></li>
                        <li :class="{ 'is-active': selected_tab === 'reload'}" v-on:click="reload_designs"><a>Reload Designs</a></li>
                    </ul>
                </div>


                <div v-if="selected_tab === 'graph'">

                    <div class="graph-heading">
                        <div class="title">
                            <h1> Control Panel </h1>
                            <!-- example control -->
                            <ul class="menu">
                                <li>
                                    <label> Node size  </label>
                                    <input type="range" min="1" max="100" v-model='nodeSize' /> {{ options.nodeSize }}
                                </li>
                                <li>
                                    <label> Edge Force  </label>
                                    <input type="range" min="100" max="12000" v-model='edgeForce' /> {{ options.force }}
                                </li>
                                <li>
                                    <label>Render as  </label>
                                    <input type="radio" :value='false' v-model='canvas' />
                                    <label>SVG</label>
                                    <input type="radio" :value='true' v-model='canvas' />
                                    <label>Canvas</label>
                                </li>
                                <li>
                                    <button v-on:click="buildGraph()">Build Graph</button>
                                </li>
                            </ul>
                        </div>

                        <svg style="height: 1px">
                            <defs>
                                <marker id="m-end" markerWidth="10" markerHeight="10" refX="12" refY="3" orient="auto" markerUnits="strokeWidth" >
                                    <path d="M0,0 L0,6 L9,3 z"></path>
                                </marker>
                            </defs>
                        </svg>
                    </div>

                    <div class="graph-frame">
                        <d3-network ref='net'
                                    :net-nodes="nodes"
                                    :net-links="links"
                                    :options="options"
                                    :link-cb="lcb"
                                    @node-click="select_node"
                                    @link-click="select_edge"
                        />
                    </div>
                </div>

                <div v-if="selected_tab === 'plot'" style="height: 100%; display: flex;">
                    <design-plot></design-plot>
                </div>
            </div>

        </div>



        <div class="graph-explorer">
            <graph-explorer></graph-explorer>
        </div>




    </div>
</template>

<script>
import D3Network from 'vue-d3-network';
import GraphExplorer from "./GraphExplorer";
import DesignPlot from "./DesignPlot";
import { parse_root_node, parse_decision_nodes, parse_design_node, parse_child_nodes } from '../../scripts/graph-helpers';
import * as _ from 'lodash-es';
import { mapState, mapGetters } from 'vuex';

export default {
    name: "graph",
    data: function () {
        return {
            // PROBLEM
            problem: 'ClimateCentric',

            // GRAPH
            // nodes: [
            //     { id: 1, name: 'ClimateCentric', _color: 'red' },
            //     { id: 2, name: 'DownSelecting',  _color: 'blue' },
            //     { id: 3, name:'Partitioning',    _color: 'blue'},
            //     { id: 4, name: 'Permuting',      _color: 'blue'},
            //     { id: 5, name: 'Design',         _color: 'green'}
            // ],
            nodes: [],
            // links: [
            //     { sid: 1, tid: 2, _color: 'gray' },
            //     { sid: 2, tid: 3, _color: 'gray' },
            //     { sid: 3, tid: 4, _color: 'gray' },
            //     { sid: 4, tid: 5, _color: 'gray' },
            // ],
            links: [],
            nodeSize:20,
            edgeForce: 3000,
            canvas:false,

            // NEO4J
            protocol: 'bolt',
            host: 'localhost',
            port: 7688,
            username: 'neo4j',
            password: 'test',

            root_node: null,
            decision_nodes: null,
            design_node: null,

            child_data: null,

            selected_tab: "graph",
        }
    },
    computed: {
        ...mapState({
            root_node_store: state => state.graph.root_node,
            decision_nodes_store: state => state.graph.decision_nodes,
            design_node_store: state => state.graph.design_node,

        }),

        options(){
            return{
                force: this.edgeForce,
                nodeSize: this.nodeSize,
                nodeLabels: true,
                canvas: this.canvas,
                linkWidth:2
            }
        },
        root_query(){
            return `MATCH (n:${this.problem}:Root) RETURN n.name, n.type, n.initial_params`
        },
        problem_query(){
            return `MATCH (n:${this.problem}) RETURN n.name, n.type`
        },
        decision_query(){
            return `MATCH (n:${this.problem}:Decision) RETURN n.name, n.type, n.decisions, n.dependencies`
        },
        design_query(){
            return `MATCH (n:${this.problem}:Design) RETURN n.name, n.type, n.designs`
        },
        topological_order_query(){
            let problem = 'ClimateCentric';
            return ``
        },
    },
    methods: {
        lcb (link) {
            link._svgAttrs = { 'marker-end': 'url(#m-end)'}
            return link
        },
        connect() {
            // return this.$neo4j.connect(this.protocol, this.host, this.port, this.username, this.password)
            //     .then(driver => {
            //         // Update Context
            //     })
        },
        driver() {
            return this.$neo4j.getDriver()
        },
        async rootQuery() {
            let params = {};
            // await this.$neo4j.run(this.root_query, params)
            //     .then(res => {
            //         this.root_node = parse_root_node(res);
            //         this.$store.commit('set_root_node', _.cloneDeep(this.root_node));
            //     });
        },
        async decisionQuery() {
            let params = {};
            // await this.$neo4j.run(this.decision_query, params)
            //     .then(res => {
            //         this.decision_nodes = parse_decision_nodes(res);
            //         this.$store.commit('set_decision_nodes', _.cloneDeep(this.decision_nodes));
            //     });
        },
        async designQuery() {
            let params = {};
            // await this.$neo4j.run(this.design_query, params)
            //     .then(res => {
            //         this.design_node = parse_design_node(res);
            //         this.$store.commit('set_design_node', _.cloneDeep(this.design_node));
            //     });
        },
        async buildGraph() {

            await this.rootQuery();
            await this.decisionQuery();
            await this.designQuery();

            // 1. Reset nodes and links
            this.nodes = [];
            this.links = [];

            await this.buildNodes();
            await this.buildEdges();
            console.log("--> BUILD GRAPH", this.nodes, this.links);

            this.write_nodes();

        },
        buildNodes(){
            // 1. Push Root
            this.nodes.push(this.root_node);

            // 2. Push Decisions
            for(let x=0;x<this.decision_nodes.length;x++){
                this.nodes.push(this.decision_nodes[x]);
            }

            // 3. Push Design
            this.design_node.id = this.nodes.length + 1;
            this.nodes.push(this.design_node);

        },
        async buildEdges() {

            // 1. Iterate over nodes
            for(let x=0;x<this.nodes.length;x++){
                let node = this.nodes[x];

                // This should set this.child_data
                let params = {};
                // await this.$neo4j.run(`
                //     MATCH (m:${this.problem}:${node.type})-->(dec)
                //     WHERE m.name = "${node.name}"
                //     RETURN dec.name, dec.type`,
                //     params
                // ).then(res => {
                //     this.child_data = parse_child_nodes(res);
                // });

                for(let y=0;y<this.child_data.length;y++){
                    let child = this.child_data[y];
                    let link = {
                        sid: node.id,
                        tid: this.nodes.find(item => item.name === child.name && item.type === child.type).id,
                        _color: 'gray'
                    }
                    this.links.push(link);
                }
            }
        },
        select_node(event, node){
            // node = Object.assign(node,{_color: 'white'})
            this.$store.commit('set_selected_node', _.cloneDeep(node));
        },
        select_edge(event, node){
            // node = Object.assign(node,{_color: 'white'})
            this.$store.commit('set_selected_edge', _.cloneDeep(node));
        },
        write_nodes(){
            this.$store.commit('set_nodes', _.cloneDeep(this.nodes));
        },
        show_graph(){
            this.selected_tab = "graph";
        },
        show_plot(){
            this.selected_tab = "plot";
        },
        reload_designs(){
            this.rootQuery();
            this.decisionQuery();
            this.designQuery();
        }
    },
    watch: {
    },
    components: {
        D3Network,
        GraphExplorer,
        DesignPlot
    },
    apollo:{

    },
    beforeMount() {
        this.connect();
        this.rootQuery();
        this.decisionQuery();
        this.designQuery();

    },
    async mounted(){
        await this.buildGraph();
    }
}
</script>

<style scoped>

</style>

<style lang="scss">

//@import url('https://fonts.googleapis.com/css?family=PT+Sans');


.graph-container{
    display: flex;
    flex-direction: row;
    height: 80vh;
}

.graph-display{
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

.graph-explorer{
    display: flex;
    max-width: 25vw;
    flex-grow: 1;
    margin: 5px;
}

.graph-display-pages{
    background-color: #fff;
    display: flex;
    flex-direction: column;
    margin: 5px;
    border-radius: 5px;
    flex-grow: 1;
}

.graph-frame{
    border-radius: 5px;
    overflow-y: auto;
    flex-grow: 1;
}

.graph-heading{
    display: flex;
    padding: 9px;
    margin: 5px;
    background-color: #fff;
    border-radius: 5px;
}



body{
    font-family: 'PT Sans', sans-serif;
    background-color: #eee;
}
.title{
    left: 2em;
    display: flex;
    flex-direction: column;
}
h1,a{
    color: #1aad8d;
    text-decoration: none;
}

ul.menu {
    list-style: none;
    z-index: 100;
    min-width: 20em;
    text-align: left;
}
ul.menu li{
    margin-top: 1em;
    position: relative;
}

.connection-panel{
    display: flex;
    flex-direction: column;
    width: 20%;
}

#m-end path, #m-start{
    //fill: rgba(18, 120, 98, 0.8);
    fill: black;
}

</style>