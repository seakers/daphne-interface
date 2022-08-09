<template>
    <div class="node-viewer-container">
        <div v-if="selected_node !== null">
            <h1 style="font-size: xx-large">{{ selected_node.name }}</h1>
            <h3 style="font-size: x-large">Type: {{ selected_node.type }}</h3>
            <hr>

<!--            ROOT-->
            <div v-if="selected_node.type === 'Root'">
                <root :node="selected_node"></root>
            </div>

<!--            DECISIONS-->
            <div v-if="isDecision(selected_node.type)">
                <decision :node="selected_node"></decision>
            </div>

<!--            DESIGN-->
            <div v-if="selected_node.type === 'Design'">
                <design :node="selected_node"></design>
            </div>
            
        </div>
        <div v-if="selected_node === null">
            No node selected
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VueJsonPretty from 'vue-json-pretty'
import Root from "./nodes/Root";
import Decision from "./nodes/Decision";
import Design from "./nodes/Design";

export default {
    name: "node-viewer",
    data: function () {
        return {
            // selected_tab: 'designs',
            decision_types: [
                'DownSelecting',
                'Partitioning',
                'Permuting',
                'Partitioning',
                'StandardForm',
                'Assigning'
            ],
        }
    },
    methods: {
        isDecision(dec){
            return this.decision_types.indexOf(dec) > -1;
        },
    },
    computed: {
        ...mapState({
            selected_node: state => state.graph.selected_node,
            selected_edge: state => state.graph.selected_edge,

            root_node: state => state.graph.root_node,
            decision_nodes: state => state.graph.decision_nodes,
            design_node: state => state.graph.design_node,

            nodes: state => state.graph.nodes,
        }),
    },
    components: {
        VueJsonPretty,
        Root,
        Decision,
        Design
    },
    beforeMount() {



    }
}
</script>

<style scoped>

</style>



<style lang="scss">


.node-viewer-container{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
}

</style>