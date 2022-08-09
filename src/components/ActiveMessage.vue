<template>
    <div>
        <p>{{ response.message }}</p>
        <div class="field is-grouped">
            <div class="control">
                <button class="button is-link" v-on:click="activateSetting">Yes</button>
            </div>
            <div class="control">
                <button class="button is-link">No</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActiveMessage",
        data() {
            return {
            }
        },
        props: ['response'],
        methods: {
            activateSetting() {
                console.log(this.response.setting);
                if (this.response.setting === "show_background_search_feedback") {
                    this.$store.commit('setShowFoundArchitectures', true);
                }
                else if (this.response.setting === "check_for_diversity") {
                    this.$store.commit('setRunDiversifier', true);
                }
                else if (this.response.setting === "show_arch_suggestions") {
                    this.$store.commit('setShowSuggestions', true);
                }
                else if (this.response.setting === "modification") {
                    if (this.response.modification["type"] === "set_diversifier_id") {
                         this.$store.commit("updateClickedArch_DB", this.response.modification["arch_id"])
                    }
                }

                if (this.response.setting !== "") {
                    this.$store.dispatch("updateActiveSettings");
                }

            }
        }
    }
</script>

<style scoped>

</style>