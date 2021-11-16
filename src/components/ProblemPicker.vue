<template>
    <div class="problem-picker">
        <form>
            <!-- GROUP -->
            <div class="problem">
                <div class="field">
                    <label class="label">Group:</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="selectedGroupId">
                                <option v-for="(group, idx) in userGroups" v-bind:value="group.id" v-bind:key="idx">{{ group.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PROBLEM -->
            <div class="problem">
                <div class="field">
                    <label class="label">Problem:</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="selectedProblemId">
                                <option v-for="(problem, idx) in userProblems" v-bind:value="problem.id" v-bind:key="idx">{{ problem.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DATASET -->
            <div class="problem">
                <div class="field">
                    <label class="label">Dataset:</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="selectedDatasetId">
                                <option v-for="(dataset, idx) in userDatasets" v-bind:value="dataset.id" v-bind:key="idx">{{ fullDatasetName(dataset) }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="changeProblem" v-bind:disabled="!changedSelection">Load</button>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="cloneDataset">Copy</button>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="uploadDataset">Upload</button>
                </div>
            </div>

            <hr>

            <div class="field" v-if="isLoggedIn">
                <div class="control">
                    <a class="button is-link" target="_blank" href="vassar.html">Problem Builder</a>
                </div>
            </div>

            <div class="field" v-if="isLoggedIn">
                <div class="control">
                    <a class="button is-link" target="_blank" href="adds.html">Decision Graph</a>
                </div>
            </div>

            

        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {wsTools} from "../scripts/websocket-tools";
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import { DaphneGroupQuery, DaphneProblemQuery, DaphneDatasetQuery } from '../scripts/apollo-queries';


    export default {
        name: 'ProblemPicker',
        data: function () {
            return {
                selectedGroupId: null,
                selectedProblemId: null,
                selectedDatasetId: null,
                userGroups: [],
                userProblems: [],
                userDatasets: [],
            }
        },
        computed: {
            ...mapState({
                isLoggedIn: state => state.auth.isLoggedIn,
                username: state => state.auth.username,
                userPk: state => state.auth.user_pk,
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
            }),
            downloadUrl() {
                let params = {
                    filename: this.datasetInformation.filename
                };
                let queryString = Object.keys(params).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                }).join('&');
                return API_URL + 'eoss/data/download-data?' + queryString;
            },
            changedSelection() {
                return this.groupId !== this.selectedGroupId || this.problemId !== this.selectedProblemId || this.datasetId !== this.selectedDatasetId;
            }
        },
        methods: {
            async changeProblem() {
                // Flush the Daphne session if we are changing problems
                try {
                    let dataResponse = await fetchPost(API_URL + 'eoss/settings/clear-session', new FormData());
                    if (dataResponse.ok) {
                        // 1. Stop all running background tasks
                        console.log("--> STOPPING BACKGROUND TASKS")
                        await this.$store.dispatch('stopBackgroundTasks');

                        // 2. Init the new problem
                        this.$store.commit('setProblemId', this.selectedProblemId);
                        await this.$store.dispatch('initProblem', this.selectedProblemId);

                        // 3. Rebuild the VASSAR service
                        wsTools.websocket.send(JSON.stringify({
                            msg_type: "rebuild_vassar",
                            group_id: this.selectedGroupId,
                            problem_id: this.selectedProblemId,
                            dataset_id: this.selectedDatasetId
                        }));

                        // 4. Load the new dataset
                        this.$store.commit("setIgnoreQuery", true);
                        let parameters = {
                            'problem_id': this.selectedProblemId,
                            'group_id': this.selectedGroupId,
                            'dataset_id': this.selectedDatasetId
                        };
                        await this.$store.dispatch('loadData', parameters);

                        // 5. Start the background search algorithm
                        if (this.$store.state.auth.isLoggedIn) {
                            this.$store.dispatch("startBackgroundSearch");
                        }
                        // Set data mining settings
                        this.$store.dispatch('setProblemParameters');
                    }
                    else {
                        console.error('Error changing the problem.');
                    }
                }
                catch(e) {
                    console.error('Networking error:', e);
                }
            },
            cloneDataset() {
                this.$store.commit('activateModal', 'CopyDatasetModal');
            },
            async uploadDataset() {
                let formData = new FormData();

                // Clone the dataset
                try {
                    formData.append("filename", "experiment_tutorial")
                    let response = await fetchPost(API_URL + 'eoss/data/upload-data', formData);
                    if (response.ok) {
                        let data = await response.json();
                    }
                    else {
                        console.error('Error upload data.');
                    }
                }
                catch(e) {
                    console.error('Networking error:', e);
                }
            },
            openSaveModal() {
                this.$store.commit('activateModal', 'SaveDatasetModal');
            },
            fullDatasetName(dataset) {
                let fullName = dataset.name;
                if (dataset.user_id === null) {
                    if (dataset.Group === null) {
                        fullName += " - Global (read only)";
                    }
                    else {
                        fullName += " - Owner: " + dataset.Group.name;
                    }
                }
                else {
                    fullName += " - Owner: User";
                }
                return fullName
            }
        },
        apollo: {
            $subscribe: {
                userGroups: {
                    query: DaphneGroupQuery,
                    variables() {
                        return {
                            user_pk: this.userPk,
                        }
                    },
                    result ({ data }) {
                        this.userGroups = data.user_groups;
                        if (this.selectedGroupId === null) {
                            if (this.userGroups.length > 0) {
                                this.selectedGroupId = this.userGroups[0].id;
                            }
                            else {
                                this.selectedGroupId = 1;
                            }
                        }
                    },
                    skip() {
                        return this.userPk === null;
                    }
                },
                userProblems: {
                    query: DaphneProblemQuery,
                    variables() {
                        return {
                            group_id: this.selectedGroupId,
                        }
                    },
                    result ({ data }) {
                        this.userProblems = data.user_problems;
                        if (this.selectedProblemId === null) {
                            if (this.userProblems.length > 0) {
                                this.selectedProblemId = this.userProblems[0].id;
                            }
                            else {
                                this.selectedProblemId = 1;
                            }
                        }
                    },
                    skip() {
                        return this.selectedGroupId === null;
                    }
                },
                userDatasets: {
                    query: DaphneDatasetQuery,
                    variables() {
                        return {
                            user_pk: this.userPk,
                            group_id: this.selectedGroupId,
                            problem_id: this.selectedProblemId,
                        }
                    },
                    result ({ data }) {
                        this.userDatasets = data.user_datasets;
                        if (this.selectedDatasetId === null) {
                            this.selectedDatasetId = 1;
                            if (this.userDatasets.length > 0) {
                                this.selectedDatasetId = this.userDatasets[0].id;
                                for (let dataset of this.userDatasets) {
                                    if (dataset.user_id === this.userPk) {
                                        this.selectedDatasetId = dataset.id;
                                    }
                                }
                            }
                        }
                    },
                    skip() {
                        return this.userPk === null || this.selectedGroupId === null || this.selectedProblemId === null;
                    }
                }
            }
        },
        watch: {
            groupId: function(newGroupId, _) {
                this.selectedGroupId = newGroupId;
            },
            problemId: function(newProblemId, _) {
                this.selectedProblemId = newProblemId;
            },
            datasetId: function(newDatasetId, _) {
                this.selectedDatasetId = newDatasetId;
                this.$apollo.subscriptions.userDatasets.refresh();
            },
        },
    }
</script>

<style scoped>
    .problem-picker {
        padding: 30px;
    }

    .problem-picker .label {
        color: whitesmoke;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
    }

    .problem-picker .card {
        border-radius: 4px;
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 7px;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
    }

    .problem-picker .problem {
        margin-bottom: 15px;
    }

    .problem-picker .dataset {
        margin-top: 15px;
    }


</style>