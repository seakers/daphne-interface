<template>
    <div class="design-node-container">

        <h2 style="font-weight: bold;">Designs</h2>
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
                    :deep="1"
                >
                </vue-json-pretty>
            </div>
        </div>

    </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
    name: "design",
    props: ['node'],
    data: function () {
        return {
            node_name: null,
            node_type: null,
            designs: null,
            selected_design_id: null,

            elements: null,


        }
    },
    methods: {
        initialize(){
            console.log("--> Initializing Design View", this.node.name, this.node.type, this.node.designs);
            this.node_name = this.node.name;
            this.node_type = this.node.type;

            // JSON
            this.designs = this.node.designs;

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
        node(){
            this.initialize();
        },
    },
    beforeMount() {
        this.initialize();
    },
    components: {
        VueJsonPretty
    }




}
</script>

<style scoped>

</style>


<style lang="scss">


.design-node-container{
    display: flex;
    flex-direction: column;
}

.design-elements{
    display: flex;
    flex-direction: column;
}

</style>