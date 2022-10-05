<template>
    <div class="active-menu" style="padding-top: 0px;" v-if="logged_in">
        <hr>


<!--        SERVICE INTERFACE-->


        <div class="box" style="margin-top: 24px; padding: 10px;">
            <p class="has-text-weight-bold">Design Evaluators</p>
            <p>Available: {{available_design_evaluators}}</p>
        </div>

        <div class="box" style="padding: 10px;">
            <p class="has-text-weight-bold">Genetic Algorithms</p>
            <p>Running: {{running_genetic_algorithms}}</p>
        </div>

        <div class="field has-addons">
            <div class="control">
                <button class="button is-link" v-on:click="activateControlPanel">Service Panel</button>
            </div>
            <div class="control">
                <button class="button is-link" v-on:click="send_ping" :disabled="!canPing">
                    <span class="icon is-small" v-if="canPing">
                        <i class="fas fa-redo-alt"></i>
                    </span>
                    <span class="icon is-small" v-if="!canPing">
                        <i class="fas fa-hourglass" style="color: white"></i>
                    </span>
                </button>
            </div>
        </div>




<!--        <p class="has-text-weight-bold">VASSAR connection status: <a v-on:click="connectVassar">Reconnect</a></p>-->
<!--        <p :class="connectionStatusToColor(vassarStatus)">{{connectionStatusToExplanation(vassarStatus)}}</p>-->

<!--        <p class="has-text-weight-bold" v-if="backgroundSearchExperimentCondition">GA connection status: <a v-on:click="connectGa">Reconnect</a></p>-->
<!--        <p :class="connectionStatusToColor(gaServiceStatus)" v-if="backgroundSearchExperimentCondition">{{connectionStatusToExplanation(gaServiceStatus)}}</p>-->

<!--        <p class="has-text-weight-bold" v-if="backgroundSearchExperimentCondition">GA search status: <a v-on:click="startGa">Restart</a></p>-->
<!--        <p :class="gaStatusToColor(gaRunningStatus)" v-if="backgroundSearchExperimentCondition">{{gaStatusToExplanation(gaRunningStatus)}}</p>-->






<!--        ACTIVE OPTIONS-->
        <hr>
        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="runDiversifier">
            Enable Diversifier
        </label>

        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showEngineerSuggestions">
            Enable Engineer Suggestions
        </label>
        <div class="control" v-if="showEngineerSuggestions && !inExperiment">
            Every <input class="input" type="number" v-model="engineerSuggestionsFrequency" min="1"> changes
        </div>

        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showHistorianSuggestions">
            Enable Historian Suggestions
        </label>
        <div class="control" v-if="showHistorianSuggestions && !inExperiment">
            Every <input class="input" type="number" v-model="historianSuggestionsFrequency" min="1"> changes
        </div>
        
        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showAnalystSuggestions">
            Enable Analyst Suggestions
        </label>
        <div class="control" v-if="showAnalystSuggestions && !inExperiment">
            Every <input class="input" type="number" v-model="analystSuggestionsFrequency" min="15"> seconds
        </div>
        
        <button v-if="inExperiment" class="button" v-on:click="finishExperiment">Finish Experiment</button>

        <hr>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";
import * as _ from "lodash-es";

    export default {
        name: "ServicesMenu",
        data: function() {
            return {
                analystFreqTimeout: null,
                engineerFreqTimeout: null,
                historianFreqTimeout: null,
                lastPingId: null,
                canPing: true,
            }
        },
        computed: {
            ...mapState({
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
                vassarStatus: state => state.services.vassarServiceStatus,
                gaServiceStatus: state => state.services.gaServiceStatus,
                gaRunningStatus: state => state.services.gaRunningStatus,
                problemId: state => state.problem.problemId,
            }),
            ...mapGetters({
                serviceStatus: 'getServiceStatus',
                pingId: 'getPingId'
            }),
            available_design_evaluators(){
                let count = 0;
                let vassar_containers = this.serviceStatus['vassar_containers'];
                for(let x = 0; x < vassar_containers.length; x++){
                    let container = vassar_containers[x];
                    let vassar_status = container['container']['VassarStatus'];
                    let problem_id = container['container']['PROBLEM_ID'];
                    if(vassar_status === 'RUNNING' && parseInt(problem_id) === this.problemId){
                        count += 1;
                    }
                }
                return count;
            },
            running_genetic_algorithms(){
                return 0
            },

            runDiversifier: {
                get() {
                    return this.$store.state.active.runDiversifier;
                },
                set (value) {
                    this.$store.commit('setRunDiversifier', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            showEngineerSuggestions: {
                get() {
                    return this.$store.state.active.showEngineerSuggestions;
                },
                set (value) {
                    this.$store.commit('setShowEngineerSuggestions', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            engineerSuggestionsFrequency: {
                get() {
                    return this.$store.state.active.engineerSuggestionsFrequency;
                },
                set (value) {
                    if (this.engineerFreqTimeout) {
                        clearTimeout(this.engineerFreqTimeout);
                    }
                    this.engineerFreqTimeout = setTimeout(() => {
                        this.$store.commit('setEngineerSuggestionsFrequency', value);
                        this.$store.dispatch("updateActiveSettings");
                    }, 500);
                }
            },
            showHistorianSuggestions: {
                get() {
                    return this.$store.state.active.showHistorianSuggestions;
                },
                set (value) {
                    this.$store.commit('setShowHistorianSuggestions', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            historianSuggestionsFrequency: {
                get() {
                    return this.$store.state.active.historianSuggestionsFrequency;
                },
                set (value) {
                    if (this.historianFreqTimeout) {
                        clearTimeout(this.historianFreqTimeout);
                    }
                    this.historianFreqTimeout = setTimeout(() => {
                        this.$store.commit('setHistorianSuggestionsFrequency', value);
                        this.$store.dispatch("updateActiveSettings");
                    }, 500);
                }
            },
            showAnalystSuggestions: {
                get() {
                    return this.$store.state.active.showAnalystSuggestions;
                },
                set (value) {
                    this.$store.commit('setShowAnalystSuggestions', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            analystSuggestionsFrequency: {
                get() {
                    return this.$store.state.active.analystSuggestionsFrequency;
                },
                set (value) {
                    if (this.analystFreqTimeout) {
                        clearTimeout(this.analystFreqTimeout);
                    }
                    this.analystFreqTimeout = setTimeout(() => {
                        this.$store.commit('setAnalystSuggestionsFrequency', value);
                        this.$store.dispatch("updateActiveSettings");
                    }, 500);
                }
            },
            logged_in() {
                return this.$store.state.auth.isLoggedIn;
            },
            backgroundSearchExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('BackgroundSearch');
                }
            },
            diversifierExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('Diversifier');
                }
            },
            liveSuggestionsExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('LiveSuggestions');
                }
            },
        },
        methods: {
            activateControlPanel() {
                this.$store.commit('activateModal', 'ControlPanelModal');
            },
            send_ping(){
                this.canPing = false;
                this.lastPingId = this.generate_msg_id();
                wsTools.websocket.send(JSON.stringify({msg_type: "ping_services", ping_id: this.lastPingId}));
                setTimeout(() => {this.canPing = true;}, 30000);
            },
            generate_msg_id(){
                let length = 15;
                let result           = '';
                let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },

            async connectVassar() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_vassar',
                }));
            },
            async finishExperiment() {
                this.$store.dispatch('finishExperiment');
            }
        },
        watch: {
            pingId() {
                if(this.pingId === null){
                    this.canPing = true;
                }
                if(this.pingId === this.lastPingId){
                    this.canPing = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/_all";

    .active-menu {
        padding: 30px;
        color: white;
    }

    .checkbox:hover {
        color: white;
    }

    .conn-start {
        color: $grey-light;
    }

    .conn-connecting {
        color: $yellow;
    }

    .conn-success {
        color: $green;
    }

    .conn-error {
        color: $red;
    }
</style>