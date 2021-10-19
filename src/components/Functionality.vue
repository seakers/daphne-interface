<template>
    <div class="column is-full-mobile" :class="sizeClass">
        <section class="panel func-panel" :class="funcClass" :id="funcIdString">
            <p class="panel-heading">
                <span>{{title}}</span>
                <span v-if="chosenFunctionality == 'DesignBuilder' && agentRunning == false"><button class="button is-success is-small" v-on:click.prevent="toggle_agent" :disabled="agentWait">Start Agent</button></span>
                <span v-if="chosenFunctionality == 'DesignBuilder' && agentRunning == true"><button class="button is-danger is-small" v-on:click.prevent="toggle_agent" :disabled="agentWait">Stop Agent</button></span>
                <span v-if="chosenFunctionality == 'DesignBuilder'"><button class="button is-warning is-small" v-on:click.prevent="new_commit">Commit</button></span>
                <span style="float:right;">
                    <a href="#" class="reduce-panel" v-bind:class="{ 'has-text-grey': isMinSize }" v-on:click.prevent="reduce"><span class="icon"><span class="fas fa-window-minimize"></span></span></a>
                    <a href="#" class="grow-panel" v-bind:class="{ 'has-text-grey': isMaxSize }" v-on:click.prevent="grow"><span class="icon"><span class="fas fa-window-maximize"></span></span></a>
                    <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fas fa-times"></span></span></a>
                </span>
            </p>
            <component :is="chosenFunctionality" :name="name" :size="size" :func-data="funcData" :func-id="funcIdString"></component>
        </section>
    </div>
</template>

<script>
    import Cheatsheet from './Cheatsheet';
    import DesignBuilder from './DesignBuilder';
    import DaphneAnswer from './DaphneAnswer';
    import DataMining from './DataMining';
    import EOSSFilter from './EOSSFilter';
    import FeatureApplication from './FeatureApplication';
    import TimelinePlot from "./TimelinePlot";
    import Mycroft from "./Mycroft";
    import {fetchPost} from "../scripts/fetch-helpers";

    let sizeScale = [
        'half',
        'full'
    ];

    export default {
        name: 'functionality',
        props: ['name', 'component', 'title', 'funcClass', 'initialSize', 'funcData', 'funcId'],
        data () {
            return {
                size: this.initialSize,
                chosenFunctionality: this.component,
                agentRunning: false,
                agentWait:false,
            }
        },
        components: {
            Cheatsheet,
            DesignBuilder,
            DaphneAnswer,
            DataMining,
            EOSSFilter,
            FeatureApplication,
            TimelinePlot,
            Mycroft
        },
        computed: {
            sizeClass: function () {
                return 'is-' + this.size + '-desktop';
            },
            isMinSize: function () {
                return this.size === this.initialSize;
            },
            isMaxSize: function () {
                return this.size === sizeScale[sizeScale.length - 1];
            },
            funcIdString() {
                return "functionality" + this.funcId;
            }
        },
        methods: {
            remove: function() {
                this.$store.commit('closeFunctionality', this.$vnode.key);
                // PubSub.publish(functionality + '_removed', funcId);
            },
            reduce: function() {
                if (!this.isMinSize) {
                    // Make column smaller
                    this.size = sizeScale[sizeScale.indexOf(this.size) - 1];
                }
            },
            grow: function() {
                if (!this.isMaxSize) {
                    // Make column bigger
                    this.size = sizeScale[sizeScale.indexOf(this.size) + 1];
                }
            },
            async toggle_agent(){
                this.agentWait = true;
                let reqData = new FormData();
                if(this.agentRunning === true){
                    reqData.append("mode", "stop");
                }
                else{
                    reqData.append("mode", "start");
                }
                let dataResponse = await fetchPost(API_URL + 'eoss/formulation/toggle-agent', reqData);
                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    console.log('--> AGENT RESPONSE', data);
                    if (data['status'] === 'on') {
                        this.agentRunning = true;
                    }
                    else if(data['status'] === 'off'){
                        this.agentRunning = false;
                    }
                }
                this.agentWait = false;
            },
            async new_commit(){
                let reqData = new FormData();
                reqData.append("instrument", "true");
                reqData.append("orbit", "true");
                reqData.append("stakeholder", "true");
                reqData.append("objective", "true");
                let dataResponse = await fetchPost(API_URL + 'eoss/formulation/formulation-change', reqData);
            }
        }
    }
</script>

<style scoped>

</style>