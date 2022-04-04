<template>
    <div class="active-menu" v-if="logged_in">
        <p class="has-text-weight-bold">VASSAR connection status: <a v-on:click="connectVassar">Reconnect</a></p>
        <p :class="connectionStatusToColor(vassarStatus)">{{connectionStatusToExplanation(vassarStatus)}}</p>
        <p class="has-text-weight-bold" v-if="backgroundSearchExperimentCondition">GA connection status: <a v-on:click="connectGa">Reconnect</a></p>
        <p :class="connectionStatusToColor(gaServiceStatus)" v-if="backgroundSearchExperimentCondition">{{connectionStatusToExplanation(gaServiceStatus)}}</p>
        <p class="has-text-weight-bold" v-if="backgroundSearchExperimentCondition">GA search status: <a v-on:click="startGa">Restart</a></p>
        <p :class="gaStatusToColor(gaRunningStatus)" v-if="backgroundSearchExperimentCondition">{{gaStatusToExplanation(gaRunningStatus)}}</p>

        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="runDiversifier">
            Enable Diversifier
        </label>

        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showEngineerSuggestions">
            Enable Engineer Suggestions
        </label>
        <div class="control" v-if="showEngineerSuggestions">
            Every <input class="input" type="number" v-model="engineerSuggestionsFrequency" min="1"> changes
        </div>

        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showHistorianSuggestions">
            Enable Historian Suggestions
        </label>
        <div class="control" v-if="showHistorianSuggestions">
            Every <input class="input" type="number" v-model="historianSuggestionsFrequency" min="1"> changes
        </div>
        
        <label class="checkbox" v-if="!inExperiment">
            <input type="checkbox" v-model="showAnalystSuggestions">
            Enable Analyst Suggestions
        </label>
        <div class="control" v-if="showAnalystSuggestions">
            Every <input class="input" type="number" v-model="analystSuggestionsFrequency" min="15"> seconds
        </div>
        
        <button class="button" v-on:click="finishExperiment">Finish Experiment</button>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";

    export default {
        name: "ServicesMenu",
        computed: {
            ...mapState({
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
                vassarStatus: state => state.services.vassarServiceStatus,
                gaServiceStatus: state => state.services.gaServiceStatus,
                gaRunningStatus: state => state.services.gaRunningStatus
            }),
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
                    this.$store.commit('setEngineerSuggestionsFrequency', value);
                    this.$store.dispatch("updateActiveSettings");
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
                    this.$store.commit('setHistorianSuggestionsFrequency', value);
                    this.$store.dispatch("updateActiveSettings");
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
                    this.$store.commit('setAnalystSuggestionsFrequency', value);
                    this.$store.dispatch("updateActiveSettings");
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
            connectionStatusToExplanation(connectionStatus) {
                switch (connectionStatus) {
                    case "waiting_for_user":
                        return "Starting connection...";
                    case "waiting_for_ack":
                        return "Waiting for a response...";
                    case "uninitialized":
                        return "Initializing service...";
                    case "ready":
                        return "Connected";
                    case "ack_error":
                        return "Error during connection";
                    case "build_error":
                        return "Error during initialization";
                    case "missed_ping":
                        return "Missed a ping...";
                    default:
                        return "Unknown status";
                }
            },
            connectionStatusToColor(connectionStatus) {
                switch (connectionStatus) {
                    case "waiting_for_user":
                        return "conn-start";
                    case "waiting_for_ack":
                        return "conn-connecting";
                    case "uninitialized":
                        return "conn-connecting";
                    case "ready":
                        return "conn-success";
                    case "ack_error":
                        return "conn-error";
                    case "build_error":
                        return "conn-error";
                    case "missed_ping":
                        return "conn-connecting";
                    default:
                        return "conn-error";
                }
            },
            gaStatusToExplanation(gaStatus) {
                switch (gaStatus) {
                    case "started":
                        return "Running";
                    case "stopped":
                        return "Stopped";
                    case "start_requested":
                        return "Run requested";
                    case "stop_requested":
                        return "Stop requested";
                    case "start_error":
                        return "Error starting";
                    case "stop_error":
                        return "Error stopping";
                    case "dataset_error":
                        return "Read only";
                    case "auth_error":
                        return "Not logged in";
                    case "missed_ping":
                        return "Missed a ping...";
                    default:
                        return "Unknown status";
                }
            },
            gaStatusToColor(gaStatus) {
                switch (gaStatus) {
                    case "started":
                        return "conn-success";
                    case "stopped":
                        return "conn-error";
                    case "start_requested":
                        return "conn-connecting";
                    case "stop_requested":
                        return "conn-connecting";
                    case "missed_ping":
                        return "conn-connecting";
                    case "start_error":
                    case "stop_error":
                    case "dataset_error":
                    case "auth_error":
                        return "conn-error";
                    default:
                        return "conn-error";
                }
            },
            async connectVassar() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_vassar',
                }));
            },
            async connectGa() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_ga',
                }));
            },
            async startGa() {
                this.$store.dispatch('startBackgroundSearch');
            },
            async finishExperiment() {
                this.$store.dispatch('finishExperiment');
            }
        },
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