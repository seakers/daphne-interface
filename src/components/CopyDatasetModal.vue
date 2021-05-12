<template>
    <div class="message-body">
        <p>Please introduce a name for the new dataset.</p>
        <form id="name-form">
            <div class="field">
                <label class="label">Name</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Dataset name" name="dst_dataset_name">
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="login">Submit</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchPost} from '../scripts/fetch-helpers';

    export default {
        name: 'copy-dataset-modal',
        computed: {
            ...mapState({
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
            }),
        },
        methods: {
            async login() {
                let formData = new FormData(document.getElementById('name-form'));

                // Clone the dataset
                try {
                    formData.append("src_dataset_id", this.datasetId)
                    let response = await fetchPost(API_URL + 'eoss/data/copy-data', formData);
                    if (response.ok) {
                        let data = await response.json();
                        let newDatasetId = data["dst_dataset_id"];

                        // 1. Stop all running background tasks
                        await this.$store.dispatch('stopBackgroundTasks');

                        // 2. Load the new dataset
                        this.$store.commit("setIgnoreQuery", true);
                        let parameters = {
                            'problem_id': this.problemId,
                            'group_id': this.groupId,
                            'dataset_id': newDatasetId
                        };
                        await this.$store.dispatch('loadData', parameters);

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

                this.$emit('close-modal');
            },
        },
        watch: {
            isLoggedIn: function (val, oldVal) {
                if (this.isLoggedIn) {
                    this.$emit('close-modal');
                }
            }
        }
    }
</script>

<style scoped>

</style>