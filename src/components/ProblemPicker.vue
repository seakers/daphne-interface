<template>
    <div class="problem-picker">
        <form>
            <div class="field">
                <label class="label">Problem:</label>
                <div class="control">
                    <div class="select">
                        <select v-model="problemName">
                            <option v-for="problem in problemList" v-bind:value="problem">{{ problem }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="field">
                <label class="label">Dataset:</label>
                <div class="control">
                    <div class="select">
                        <select v-model="datasetFilename">
                            <option v-for="dataset in datasetList" v-bind:value="dataset.value">{{ dataset.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="changeProblem">Load</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchPost} from '../scripts/fetch-helpers';

    export default {
        name: 'ProblemPicker',
        computed: {
            ...mapState({
                problemList: state => state.problem.problemList,
                datasetList: state => state.problem.datasetList
            }),
            problemName: {
                get() {
                    return this.$store.state.problem.problemName;
                },
                set(newProblem) {
                    this.$store.dispatch('setProblemName', newProblem);
                }
            },
            datasetFilename: {
                get() {
                    return this.$store.state.problem.datasetFilename;
                },
                set(newDatasetFilename) {
                    this.$store.commit('setDatasetFilename', newDatasetFilename);
                }
            }
        },
        methods: {
            async changeProblem() {
                // Flush the Daphne session if we are changing problems
                try {
                    let dataResponse = await fetchPost('/api/daphne/clear-session', new FormData());
                    if (dataResponse.ok) {
                        // Init the new problem
                        await this.$store.dispatch('initProblem');
                        await this.$store.dispatch('changeVassarPort');
                        // Load the new dataset
                        this.$store.dispatch('loadNewData', this.datasetFilename);
                    }
                    else {
                        console.error('Error flushing the daphne session.');
                    }
                }
                catch(e) {
                    console.error('Networking error:', e);
                }

            }
        }
    }
</script>

<style scoped>
    .problem-picker {
        padding: 30px;
    }

    .problem-picker .label {
        color: #F6F7F7;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
    }
</style>