<template>
    <div class="problem-picker">
        <form>


            <!-- GROUP -->
            <div class="problem">
                <div class="field">
                    <label class="label">Group:</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="group_id">
                                <option v-for="(group, idx) in user_groups" v-bind:value="group.id" v-bind:key="idx">{{ group.name }}</option>
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
                            <select v-model="problem_id">
                                <option v-for="(problem, idx) in user_problems" v-bind:value="problem.id" v-bind:key="idx">{{ problem.name }}</option>
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
                        <a class="button is-link" target="_blank" href="vassar.html">Problem Builder</a>
                    </div>
                </div>

                <hr>

                <div class="field" v-if="isLoggedIn">
                    <div class="control">
                        <a class="button is-link" target="_blank" href="adds.html">Decision Graph</a>
                    </div>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import { DaphneGroupQuery, DaphneProblemQuery } from '../scripts/apollo-queries';


    export default {
        name: 'ProblemPicker',
        data: function () {
            return {
                user_groups: [],
                user_problems: [],
                group_id: 0,
                problem_id: 0,
            }
        },
        computed: {
            ...mapState({
                problemList: state => state.problem.problemList,
                datasetList: state => state.problem.datasetList,
                global_group_id: state => state.problem.group_id,
                global_problem_id: state => state.problem.problem_id,
                isLoggedIn: state => state.auth.isLoggedIn,
                username: state => state.auth.username,
                user_pk: state => state.auth.user_pk,
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
                        // 1. Stop all running background tasks
                        await this.$store.dispatch('stopBackgroundTasks');

                        // 2. Init the new problem
                        await this.$store.dispatch('initProblem', this.problem_id);

                        // 3. Load the new dataset
                        let parameters = {
                            'problem_id': this.problem_id,
                            'group_id': this.group_id
                        };
                        await this.$store.dispatch('loadNewData', parameters);

                        // 4. Start the background search algorithm
                        if (this.$store.state.auth.isLoggedIn) {
                            // this.$store.dispatch("startBackgroundSearch");
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
        },
        apollo: {
            // TODO: query groups
            // TODO: query problems
            user_groups: {
                query: DaphneGroupQuery,
                variables() {
                    return {
                        user_pk: this.user_pk,
                    }
                },
            },
            user_problems: {
                query: DaphneProblemQuery,
                variables() {
                    return {
                        group_id: this.group_id,
                    }
                }
            }
        },
        watch: {

            // --> User logs in
            user_groups() {
                if(this.user_groups.length > 0){
                    this.group_id = this.user_groups[0].id;
                }
                else{
                    this.group_id = 0;
                }
            },

            // --> New group selected
            user_problems() {
                if(this.user_problems.length > 0){
                    this.problem_id = this.user_problems[0].id;
                }
                else{
                    this.problem_id = 0;
                }
            },

            global_group_id() {
                this.group_id = this.global_group_id;
            },
            global_problem_id(){
                this.problem_id = this.global_problem_id;
            },
        },
      async mounted() {
        this.$apollo.queries.user_groups.refetch();
        this.$apollo.queries.user_problems.refetch();
      }
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