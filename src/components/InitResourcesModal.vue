<template>
    <div class="message-body">
        <div style="font-weight: bold; font-size: larger">
            Initializing Cloud Services
        </div>

        <div style="padding-top: 15px;">
            <div>Design Evaluator</div>
            <progress v-if="is_initializing === true" class="progress is-small is-warning" max="100">50%</progress>
            <progress v-if="is_initializing === false" class="progress is-small is-success" value="100" max="100"></progress>

            <div>Genetic Algorithm</div>
            <progress v-if="is_initializing === true" class="progress is-small is-warning" max="100">50%</progress>
            <progress v-if="is_initializing === false" class="progress is-small is-success" value="100" max="100"></progress>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";
    import {fetchPost} from "../scripts/fetch-helpers";
    export default {
        name: "InitResourcesModal",
        data: function () {
            return {
            }
        },
        computed: {
            ...mapState({
                is_initializing: state => state.auth.is_initializing,
            })
        },
        methods: {
            async delay(time){
                return new Promise(resolve => setTimeout(resolve, time));
            }
        },
        async mounted() {

        }
    }
</script>

<style scoped>

</style>