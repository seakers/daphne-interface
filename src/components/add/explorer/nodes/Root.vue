<template>
    <div class="root-container">

        <h2 style="font-weight: bold;">Child Dependencies</h2>
        <select v-model="selected_parameter">
            <option v-for="(param, idx) in initial_params" v-bind:value="param.child_name" :key="idx">
                {{ param.child_name }}
            </option>
        </select>
        <hr>

        <div class="root-elements">
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
    name: "root",
    props: ['node'],
    data: function () {
        return {
            initial_params: null,
            node_name: null,
            node_type: null,

            selected_parameter: null,
            elements: null,
        }
    },
    methods: {

    },
    watch: {
        selected_parameter() {
            this.elements = this.initial_params.find(x => x.child_name === this.selected_parameter).elements;
        }
    },
    beforeMount() {
        console.log("--> Initializing Root View");
        this.node_name = this.node.name;
        this.node_type = this.node.type;

        // JSON
        this.initial_params = this.node.initial_params;

        if(this.initial_params.length > 0){
            this.selected_parameter = this.initial_params[0].child_name;
        }
    },
    components: {
        VueJsonPretty
    }


}
</script>

<style scoped>

</style>

<style lang="scss">


.root-container{
    display: flex;
    flex-direction: column;
}

.root-elements{
    display: flex;
    flex-direction: column;
}

</style>