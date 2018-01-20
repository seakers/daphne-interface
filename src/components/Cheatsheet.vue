<template>
    <div style="display: flex; flex-direction: column; flex-grow: 1; overflow: auto;">
        <div class="panel-block">
            <div class="select is-fullwidth">
                <select v-on:change="updateList" v-model="selectedList">
                    <option value=""></option>
                    <option value="general">General</option>
                    <option value="ifeed">iFEED</option>
                    <option value="vassar">VASSAR</option>
                    <option value="critic">Critic</option>
                    <option value="historian">Historian</option>
                    <option value="measurements">Measurements</option>
                    <option value="missions">Missions</option>
                    <option value="technologies">Technologies</option>
                    <option value="objectives">Objectives</option>
                </select>
            </div>
        </div>
        <div class="panel-block functionality">
            <div class="content">
                <ul v-if="cheatList.length">
                    <li v-for="cheat in cheatList">
                        {{ cheat }}
                    </li>
                </ul>
                <p v-else>Choose one of the different cheatsheets available for Daphne</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'cheatsheet',
        data () {
            return {
                selectedList: '',
                cheatList: []
            }
        },
        methods: {
            async updateList() {
                try {
                    let reqData = new FormData();
                    reqData.append('command_list', this.selectedList);
                    let dataResponse = await fetch(
                        '/api/daphne/commands',
                        {
                            method: 'POST',
                            body: reqData,
                            credentials: 'same-origin'
                        }
                    );

                    if (dataResponse.ok) {
                        // Add the new functionality
                        let commandList = await dataResponse.json();
                        this.cheatList = commandList.list;
                    }
                    else {
                        console.error('Error downloading the list.');
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