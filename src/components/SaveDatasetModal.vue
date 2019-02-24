<template>
    <div class="message-body">
        <p>Please enter a name for the dataset. If the name is already in use the file will be overwritten.</p>
        <form id="save-dataset-form">
            <div class="field">
                <label class="label">Filename</label>
                <div class="control has-icons-left">
                    <input class="input" type="text" placeholder="The filename" name="filename">
                    <span class="icon is-small is-left"><i class="fas fa-file"></i></span>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="saveData">Save</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {fetchPost} from '../scripts/fetch-helpers';

    export default {
        name: 'save-dataset-modal',
        computed: {
            ...mapState({
            })
        },
        methods: {
            async saveData() {
                // Flush the Daphne session if we are changing problems
                try {
                    let form = document.getElementById('save-dataset-form');
                    let reqData = new FormData(form);
                    let dataResponse = await fetchPost(API_URL + 'daphne/save-data', reqData);
                    if (dataResponse.ok) {
                        this.$store.dispatch('setProblemName', this.$store.problem.problemName);
                        this.$emit('close-modal');
                    }
                    else {
                        console.error('Error saving the file!');
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

</style>