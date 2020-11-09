<template>
    <div class="design-plot-container">
        <Plotly :data="data"
                :layout="layout" :display-mode-bar="true"
                v-on:plotly-click="select_datapoint()"
        ></Plotly>
    </div>
</template>

<script>
import { Plotly } from 'vue-plotly'
import { mapState, mapGetters } from 'vuex';


export default {
    name: "design-plot",
    data: function () {
        return {
            data:[{
                x: [],
                y: [],
                z: [],
                type:"scatter3d",
                mode: "markers",
                marker: {
                    size: 3,
                },
                text: [],
            }],
            layout:{
                scene: {
                    xaxis:{
                        title: 'Data Continuity',
                        autorange: 'reversed',
                    },
                    yaxis:{
                        title: 'Science',
                    },
                    zaxis:{
                        title: 'Cost',
                    },
                },
                margin:{
                    t: 20,
                    l: 20,
                    r: 20,
                    b: 40,
                },
            },

            designs: null,
        }
    },
    computed: {
        ...mapState({
            root_node: state => state.graph.root_node,
            decision_nodes: state => state.graph.decision_nodes,
            design_node: state => state.graph.design_node,
        }),
    },
    methods: {
        initialize(){
            this.data[0].x = [];
            this.data[0].y = [];
            this.data[0].z = [];
            this.data[0].text = [];

            console.log("--> Initializing Design Plot");
            this.designs = this.design_node.designs;
            console.log(this.designs);
            for(let x=0;x<this.designs.length;x++){
                let design = this.designs[x];
                if(!("scores" in design)){
                    continue;
                }
                this.data[0].x.push(design.scores.data_continuity);
                this.data[0].y.push(design.scores.science);
                this.data[0].z.push(design.scores.cost);
                this.data[0].text.push("Design " + design.id);
            }
        },
        select_datapoint(){
            console.log("data point selected");
        }
    },
    components: {
        Plotly
    },
    watch: {
        design_node(){
            this.initialize();
        }
    },
    beforeMount() {
        this.initialize();
    },



    }
</script>

<style scoped>

</style>

<style lang="scss">

.design-plot-container{
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-content: center;
}

</style>