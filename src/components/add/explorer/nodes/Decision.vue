<template>
    <div class="decision-container">

        <h2 style="font-weight: bold;">Decisions</h2>
        <select v-model="selected_decision_id">
            <option v-for="(decision, idx) in decisions" v-bind:value="decision.id" :key="idx">
                Decision {{ decision.id }}
            </option>
        </select>
        <hr>

        <div class="decision-elements">
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
    name: "decision",
    props: ['node'],
    data: function () {
        return {
            node_name: null,
            node_type: null,
            decisions: null,
            selected_decision_id: null,

            elements: null,


        }
    },
    methods: {
        initialize(){
            console.log("--> Initializing Decision View", this.node.name, this.node.type, this.node.decisions);
            this.node_name = this.node.name;
            this.node_type = this.node.type;

            // JSON
            this.decisions = this.node.decisions;

            if(this.decisions.length > 0){
                this.selected_decision_id = this.decisions[0].id;
                this.elements = this.decisions.find(x => x.id === this.selected_decision_id).elements;
            }
        }
    },
    watch: {
        selected_decision_id() {
            this.elements = this.decisions.find(x => x.id === this.selected_decision_id).elements;
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


.decision-container{
    display: flex;
    flex-direction: column;
}

.decision-elements{
    display: flex;
    flex-direction: column;
}

</style>