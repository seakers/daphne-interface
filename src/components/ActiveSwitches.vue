<template>
    <div class="active-menu" v-if="logged_in">
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
        <label class="checkbox" v-if="teacherExperimentCondition">
            <input type="checkbox" v-model="runProactiveTeacher">
            Enable Teacher
        </label>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "ActiveSwitches",
        computed: {
            ...mapState({
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
            }),
            runProactiveTeacher: {
                get () {
                    return this.$store.state.active.runProactiveTeacher;
                },
                set (value) {
                    this.$store.dispatch('toggleProactiveTeacher', value);
                }
            },
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
            teacherExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('ProactiveTeacher');
                }
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
        }
    }
</script>

<style scoped>
    .active-menu {
        padding: 30px;
        color: white;
    }

    .checkbox:hover {
        color: white;
    }
</style>