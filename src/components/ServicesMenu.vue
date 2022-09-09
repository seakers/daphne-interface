<template>
    <div class="active-menu" v-if="logged_in">



<!--        SERVICE INTERFACE-->
        <div class="control">
            <button class="button is-link" v-on:click="activateControlPanel">Service Panel</button>
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
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";

    export default {
        name: "ServicesMenu",
        data: function() {
            return {
                analystFreqTimeout: null,
                engineerFreqTimeout: null,
                historianFreqTimeout: null,
            }
        },
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
            async connectVassar() {
                wsTools.websocket.send(JSON.stringify({
                    msg_type: 'connect_vassar',
                }));
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