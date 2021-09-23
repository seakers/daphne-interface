<template>
    <div class="active-menu" v-if="logged_in">
        <p class="has-text-weight-bold">VASSAR status: <a v-on:click="connectVassar">Reconnect</a></p>
        <p :class="connectionStatusToColor(vassarStatus)">{{connectionStatusToExplanation(vassarStatus)}}</p>
        <p class="has-text-weight-bold">GA status: <a v-on:click="connectGa">Reconnect</a></p>
        <p :class="connectionStatusToColor(gaStatus)">{{connectionStatusToExplanation(gaStatus)}}</p>
        <label class="checkbox" v-if="backgroundSearchExperimentCondition">
            <input type="checkbox" v-model="runBackgroundSearch">
            Run Background Search
        </label>
        <label class="checkbox" v-if="backgroundSearchExperimentCondition">
            <input type="checkbox" v-model="showFoundArchitectures">
            Show New Architectures
        </label>
        <label class="checkbox" v-if="diversifierExperimentCondition">
            <input type="checkbox" v-model="runDiversifier">
            Enable Diversifier
        </label>
        <label class="checkbox" v-if="liveSuggestionsExperimentCondition">
            <input type="checkbox" v-model="showSuggestions">
            Enable Suggestions
        </label>
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
                vassarStatus: state => state.services.vassarStatus,
                gaStatus: state => state.services.gaStatus
            }),
            runBackgroundSearch: {
                get () {
                    return this.$store.state.active.runBackgroundSearch;
                },
                set (value) {
                    this.$store.dispatch('toggleRunBackgroundSearch', value);
                }
            },
            showFoundArchitectures: {
                get () {
                    return this.$store.state.active.showFoundArchitectures;
                },
                set (value) {
                    this.$store.commit('setShowFoundArchitectures', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            runDiversifier: {
                get () {
                    return this.$store.state.active.runDiversifier;
                },
                set (value) {
                    this.$store.commit('setRunDiversifier', value);
                    this.$store.dispatch("updateActiveSettings");
                }
            },
            showSuggestions: {
                get () {
                    return this.$store.state.active.showSuggestions;
                },
                set (value) {
                    this.$store.commit('setShowSuggestions', value);
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
            async connectVassar() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_vassar',
                }));
            },
            async connectGa() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_ga',
                }));
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