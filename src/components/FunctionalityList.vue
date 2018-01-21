<template>
    <div class="columns is-mobile is-multiline" id="functionalities_list">
        <functionality
            v-for="functionality in functionalities"
            v-bind:name="functionality.name"
            v-bind:title="functionality.title"
            v-bind:initial-size="functionality.initialSize"
            v-bind:key="functionality.id"
            v-on:close-elem="closeFunctionality(functionality.id)">
        </functionality>
    </div>
</template>

<script>
    import Functionality from "./Functionality";
    import EventBus from '../scripts/event-bus';

    let functionalityTypes = new Map();
    functionalityTypes.set("DaphneAnswer", { title: "Answers", minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("DesignInspector", { title: "Design Inspector", minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("DataMining", { title: "Data Mining", minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("Cheatsheet", { title: "Cheatsheet", minSize: "one-third", maxRepeat: 1000});
    functionalityTypes.set("Filter", { title: "Filter", minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("FeatureApplication", { title: "Feature Application", minSize: "one-third", maxRepeat: 1});

    let newFunctionalityId = 0;

    export default {
        components: {Functionality},
        name: "functionality-list",
        data () {
            return {
                functionalities: [],
                functionalityCount: {
                    "DaphneAnswer": 0,
                    "DesignInspector": 0,
                    "DataMining": 0,
                    "Cheatsheet": 0,
                    "Filter": 0,
                    "FeatureApplication": 0
                }
            };
        },
        created: function() {
            EventBus.$on('add-functionality', (functionality) => {
                this.addFunctionality(functionality);
            });
        },
        methods: {
            addFunctionality(functionality) {
                let funcInfo = functionalityTypes.get(functionality);

                if (this.functionalityCount[functionality] < funcInfo.maxRepeat) {
                    // Add to columns and to the array
                    this.functionalities.push({
                        name: functionality,
                        title: funcInfo.title,
                        initialSize: funcInfo.minSize,
                        id: newFunctionalityId++
                    });
                    this.functionalityCount[functionality]++;

                    // Consider it added
                    // PubSub.publish(functionality + "_added", newFunctionalityId-1);
                    this.$emit('count-change', this.functionalityCount);
                }
            },
            closeFunctionality(funcId) {
                let funcIndex = this.functionalities.findIndex((elem) => elem.id === funcId);
                let funcName = this.functionalities[funcIndex].name;
                this.functionalities.splice(funcIndex, 1);
                this.functionalityCount[funcName]--;
                this.$emit('count-change', this.functionalityCount);
            }
        }
    }
</script>

<style scoped>

</style>