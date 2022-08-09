<template>
    <div class="message-body">
        <p>The formulation for the current problem has changed. Please reload the problem when the new formulation is ready (the button will be enabled).</p>
        <br>
        <button class="button is-danger" v-on:click.prevent="reloadProblem" :disabled="problem_reload">reload</button>
    </div>
</template>

<script>

    import { ProblemReload } from "../scripts/apollo-queries";

    export default {
        name: 'reload-modal',
        data() {
            return {
                problem_reload: true,
                problem_status: {},
            }
        },
        methods: {
            reloadProblem() {
                // 1. run query to set reload_problem to true for this problem
                console.log("--> Reload Modal");
                this.$emit('close-modal');
            },
        },
        apollo: {
            $subscribe: {
                problem_status: {
                    deep: true,
                    query: ProblemReload,
                    variables() {
                        return {
                            problem_id: parseInt(PROBLEM__ID)
                        }
                    },
                    result(data) {
                        let status = data['data']['problem_status']['reload_problem'];
                        this.problem_reload = status;
                    },
                },
            },
        }
    }
</script>

<style scoped>

</style>