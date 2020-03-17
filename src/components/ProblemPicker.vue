<template>
    <div class="problem-picker">
        <form>

            <div class="problem">
                <div  id="locate" class="card top-card">
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
                        <div class="control">
                            <button class="button is-link" v-on:click.prevent="changeProblem">New</button>
                            <button class="button is-link" v-on:click.prevent="changeProblem">Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dataset">
                <div class="card" >
                    <div class="field">
                        <label class="label">Dataset:</label>
                        <div class="control">
                            <div class="select">
                                <select v-model="datasetInformation">
                                    <option v-for="dataset in datasetList" v-bind:value="{ filename: dataset.value, user: dataset.user }">{{ dataset.name }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button class="button is-link" v-on:click.prevent="changeProblem">Load</button>
                        </div>
                    </div>
                    <div class="field" v-if="isLoggedIn">
                        <div class="control">
                            <button class="button is-link" v-on:click.prevent="openSaveModal">Save</button>
                        </div>
                    </div>
                    <div class="field" v-if="isLoggedIn">
                        <div class="control">
                            <a class="button is-link" v-bind:href="downloadUrl">Download</a>
                        </div>
                    </div>
                </div>
            </div>


        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';

    export default {
        name: 'ProblemPicker',
        computed: {
            ...mapState({
                problemList: state => state.problem.problemList,
                datasetList: state => state.problem.datasetList,
                isLoggedIn: state => state.auth.isLoggedIn
            }),
            problemName: {
                get() {
                    return this.$store.state.problem.problemName;
                },
                set(newProblem) {
                    this.$store.dispatch('setProblemName', newProblem);
                }
            },
            datasetInformation: {
                get() {
                    return this.$store.state.problem.datasetInformation;
                },
                set(newDatasetInformation) {
                    this.$store.commit('setDatasetInformation', newDatasetInformation);
                }
            },
            downloadUrl() {
                let params = {
                    filename: this.datasetInformation.filename
                };
                let queryString = Object.keys(params).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                }).join('&');
                return API_URL + 'eoss/data/download-data?' + queryString;
            }
        },
        methods: {
            async changeProblem() {
                // Flush the Daphne session if we are changing problems
                try {
                    let dataResponse = await fetchPost(API_URL + 'eoss/settings/clear-session', new FormData());
                    if (dataResponse.ok) {
                        // Stop all running background tasks
                        await this.$store.dispatch('stopBackgroundTasks');
                        // Init the new problem
                        await this.$store.dispatch('initProblem');
                        // Load the new dataset
                        await this.$store.dispatch('loadNewData', this.datasetInformation);
                        // Start the background search algorithm
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
            openSaveModal() {
                this.$store.commit('activateModal', 'SaveDatasetModal');
            }
        }
    }
</script>

<style scoped>
    .problem-picker {
        padding: 30px;
    }

    .problem-picker .label {
        color: black;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
    }

    .problem-picker .card {
        background-color: whitesmoke;
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