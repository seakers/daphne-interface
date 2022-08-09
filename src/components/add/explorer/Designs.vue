<template>
    <div class="design-container">

        <h1 style="font-weight: bold; font-size: x-large">Designs</h1>
        <select v-model="selected_design_id">
            <option v-for="(design, idx) in designs" v-bind:value="design.id" :key="idx">
                Design {{ design.id }}
            </option>
        </select>
        <hr>

        <div class="design-elements">
            <div v-for="(element, idx) in elements" :key="idx">
                <vue-json-pretty
                    :path="'res'"
                    :data="element"
                    :deep="3"
                >
                </vue-json-pretty>
            </div>
        </div>



    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VueJsonPretty from 'vue-json-pretty'

export default {
    name: "designs",
    data: function () {
        return {
            // selected_tab: 'designs',
            designs: null,
            // selected_design_id: null,
            elements: null,
        }
    },
    computed: {
        ...mapState({
            root_node: state => state.graph.root_node,
            decision_nodes: state => state.graph.decision_nodes,
            design_node: state => state.graph.design_node,
        }),
        selected_design_id: {
            get() {
                return this.$store.state.graph.selected_design_id;
            },
            set(selected_id) {
                this.$store.commit('set_selected_design_id', selected_id);
            }
        },
    },
    methods: {
        initialize(){
            console.log("--> Initializing All Designs View");
            this.designs = this.design_node.designs;
            if(this.designs.length > 0){
                this.selected_design_id = this.designs[0].id;
                this.elements = this.designs.find(x => x.id === this.selected_design_id).elements;
            }
        }
    },
    watch: {
        selected_design_id() {
            this.elements = this.designs.find(x => x.id === this.selected_design_id).elements;
        },
        design_node(){
            this.initialize();
        },
    },
    beforeMount() {
        this.initialize();
    },
    components: {
        VueJsonPretty
    },
}
</script>

<style scoped>

</style>



<style lang="scss">


.design-container{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
}

.design-controls{
    display: flex;
}

.design-list{
    display: flex;
}

</style>