<template>
    <div class="columns is-mobile is-multiline" id="functionalities_list">
        <functionality
            v-for="functionality in functionalities"
            v-bind:name="functionality.name"
            v-bind:initial-size="functionality.initialSize"
            v-bind:key="functionality.id">
        </functionality>
    </div>
</template>

<script>
    import Functionality from "./Functionality";
    import EventBus from '../scripts/event-bus';

    let functionalityTypes = new Map();
    functionalityTypes.set("DaphneAnswer", { minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("DesignInspector", { minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("DataMining", { minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("Cheatsheet", { minSize: "one-third", maxRepeat: 1000});
    functionalityTypes.set("Filter", { minSize: "one-third", maxRepeat: 1});
    functionalityTypes.set("FeatureApplication", { minSize: "one-third", maxRepeat: 1});

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
                        initialSize: funcInfo.minSize,
                        id: newFunctionalityId++
                    });
                    this.functionalityCount[functionality]++;

                    // Consider it added
                    PubSub.publish(functionality + "_added", newFunctionalityId-1);
                    /*try {

                            // Write the correct values and add interactions
                            newFunc.find("." + functionality).first().attr("id", funcId);
                            $("#" + functionality + "_menu").addClass("active");

                            // Add all the interactions for the functionality
                            // Remove
                            newFunc.find("." + functionality + " .close-panel").on("click", event => {
                                funcInfo.instances.delete(funcId);
                                $("#" + funcId).parent().remove();
                                if (funcInfo.instances.size == 0) {
                                    $("#" + functionality + "_menu").removeClass("active");
                                }
                                PubSub.publish(functionality + "_removed", funcId);
                                event.preventDefault();
                            });

                            // Reduce
                            newFunc.find("." + functionality + " .reduce-panel").on("click", event => {
                                if (!$("#" + funcId).parent().hasClass("is-" + minSize + "-desktop")) {
                                    // Make column smaller
                                    let storedSize = funcInfo.instances.get(funcId);
                                    let funcSize = "is-" + storedSize + "-desktop";
                                    let smallerSizeInfo = this.sizeScale[this.sizeScale.indexOf(storedSize)-1];
                                    let smallerSize = "is-" + smallerSizeInfo + "-desktop";
                                    $("#" + funcId).parent().removeClass(funcSize);
                                    $("#" + funcId).parent().addClass(smallerSize);
                                    funcInfo.instances.set(funcId, smallerSizeInfo);

                                    // Change icon to grey if needed and ensure maximize is changed back to normal
                                    if (smallerSizeInfo === minSize) {
                                        $("#" + funcId + " .reduce-panel").addClass("has-text-grey");
                                    }
                                    $("#" + funcId + " .grow-panel").removeClass("has-text-grey");
                                }
                                event.preventDefault();
                            });

                            // Grow
                            newFunc.find("." + functionality + " .grow-panel").on("click", event => {
                                let scalesLength = this.sizeScale.length;
                                if (!$("#" + funcId).parent().hasClass("is-" + this.sizeScale[scalesLength-1] + "-desktop")) {
                                    // Make column bigger
                                    let storedSize = funcInfo.instances.get(funcId);
                                    let funcSize = "is-" + storedSize + "-desktop";
                                    let biggerSizeInfo = this.sizeScale[this.sizeScale.indexOf(storedSize)+1];
                                    let biggerSize = "is-" + biggerSizeInfo + "-desktop";
                                    $("#" + funcId).parent().removeClass(funcSize);
                                    $("#" + funcId).parent().addClass(biggerSize);
                                    funcInfo.instances.set(funcId, biggerSizeInfo);

                                    // Change icon to grey if needed and ensure minimze is changed back to normal
                                    if (biggerSizeInfo === this.sizeScale[scalesLength-1]) {
                                        $("#" + funcId + " .grow-panel").addClass("has-text-grey");
                                    }
                                    $("#" + funcId + " .reduce-panel").removeClass("has-text-grey");
                                }
                                event.preventDefault();
                            });*/
                }
            }
        }
    }
</script>

<style scoped>

</style>