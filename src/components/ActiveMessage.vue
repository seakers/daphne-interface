<template>
    <section v-if="show">
        <article class="message is-info">
            <div class="message-header">
                <p>{{ title }}</p>
                <button class="delete" aria-label="delete" v-on:click="closeNotification"></button>
            </div>
            <div class="message-body">
                <p>{{ body }}</p>
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" v-on:click="activateSetting">Yes</button>
                    </div>
                    <div class="control">
                        <button class="button is-link" v-on:click="closeNotification">No</button>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ActiveMessage",
        data() {
            return {
            }
        },
        computed: {
            ...mapState({
                title: state => state.active.notificationTitle,
                body: state => state.active.notificationBody,
                show: state => state.active.showNotification,
                setting: state => state.active.notificationSetting,
                modification: state => state.active.modification,
            }),
        },
        methods: {
            closeNotification() {
                this.$store.commit("setShowNotification", false);
            },
            activateSetting() {
                console.log(this.setting);
                if (this.setting === "show_background_search_feedback") {
                    this.$store.commit('setShowFoundArchitectures', true);
                }
                else if (this.setting === "check_for_diversity") {
                    this.$store.commit('setRunDiversifier', true);
                }
                else if (this.setting === "show_arch_suggestions") {
                    this.$store.commit('setShowSuggestions', true);
                }
                else if (this.setting === "modification") {
                    if (this.modification["type"] === "set_diversifier_id") {
                         this.$store.commit("updateClickedArch", this.modification["arch_id"])
                    }
                }

                if (this.setting !== "") {
                    this.$store.dispatch("updateActiveSettings");
                    this.$store.commit("setShowNotification", false);
                }

            }
        }
    }
</script>

<style scoped>

</style>