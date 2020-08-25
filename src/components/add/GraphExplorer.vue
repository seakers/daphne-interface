<template>
    <div class="explorer-container">
        <div class="tabs">
            <ul>
                <li :class="{ 'is-active': selected_tab === 'decisions'}" v-on:click="show_decisions"><a>Decisions</a></li>
                <li :class="{ 'is-active': selected_tab === 'designs'}" v-on:click="show_designs"><a>Designs</a></li>
                <li :class="{ 'is-active': selected_tab === 'edit'}" v-on:click="show_edit"><a>Edit Graph</a></li>
                <li :class="{ 'is-active': selected_tab === 'node-viewer'}" v-on:click="show_node_viewer"><a>Node Viewer</a></li>
            </ul>
        </div>


        <div style="overflow-y: auto">
            <div v-if="selected_tab === 'designs'">
                <designs></designs>
            </div>
            <div v-if="selected_tab === 'decisions'">
                decisions
            </div>
            <div v-if="selected_tab === 'edit'">
                edit graph
            </div>
            <div v-if="selected_tab === 'node-viewer'">
                <node-viewer></node-viewer>
            </div>
        </div>

    </div>
</template>

<script>
import Designs from "./explorer/Designs";
import NodeViewer from "./explorer/NodeViewer";


export default {
    name: "graph-explorer",
    // :class="{ 'is-active': selected_tab === 'designs'}
    data: function () {
        return {
            selected_tab: 'designs',
        }
    },
    methods: {
        show_designs(){
            this.selected_tab = 'designs';
        },
        show_decisions(){
            this.selected_tab = 'decisions';
        },
        show_edit(){
            this.selected_tab = 'edit';
        },
        show_node_viewer(){
            this.selected_tab = 'node-viewer';
        }
    },
    components: {
        Designs,
        NodeViewer
    }

}
</script>

<style scoped>

</style>


<style lang="scss">

//@import url('https://fonts.googleapis.com/css?family=PT+Sans');

.explorer-container{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
    margin-right: 0.5vw;
}

</style>