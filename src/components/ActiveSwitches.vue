<template>
    <div class="active-menu">
        <label class="checkbox">
            <input type="checkbox" v-model="runBackgroundSearch">
            Run Background Search
        </label>
        <label class="checkbox">
            <input type="checkbox" v-model="showFoundArchitectures">
            Show New Architectures
        </label>
        <label class="checkbox">
            <input type="checkbox" v-model="runDiversifier">
            Enable Diversifier
        </label>
        <label class="checkbox">
            <input type="checkbox" v-model="showSuggestions">
            Enable Suggestions
        </label>
    </div>
</template>

<script>
    export default {
        name: "ActiveSwitches",
        computed: {
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
                }
            },
            runDiversifier: {
                get () {
                    return this.$store.state.active.runDiversifier;
                },
                set (value) {
                    this.$store.commit('setRunDiversifier', value);
                }
            },
            showSuggestions: {
                get () {
                    return this.$store.state.active.showSuggestions;
                },
                set (value) {
                    this.$store.commit('setShowSuggestions', value);
                }
            }
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