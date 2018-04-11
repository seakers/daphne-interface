<template>
    <div style="display: flex; flex-direction: column; flex-grow: 1; overflow: auto;">
        <div class="panel-block">
            <div class="select is-fullwidth">
                <select v-on:change="updateList" v-model="selectedList">
                    <option v-for="option in filteredList" v-bind:value="option.value" v-bind:key="option.value">{{ option.name }}</option>
                </select>
            </div>
        </div>
        <div class="panel-block functionality">
            <div class="content">
                <ul v-if="cheatList.length">
                    <li v-for="cheat in cheatList" v-html="cheat"></li>
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
        props: ['name'],
        computed: {
            filteredList() {
                if (this.$store.getters.getInExperiment) {
                    let stageInformation = this.$store.getters.getStageInformation;
                    let currStageInfo = stageInformation[this.$store.getters.getExperimentStage];
                    let newList = [];
                    this.optionsList.forEach((option) => {
                        if (currStageInfo['restrictedQuestions'] !== null && option.value in currStageInfo.restrictedQuestions) {
                            if (currStageInfo.restrictedQuestions[option.value].length !== 0) {
                                newList.push(option);
                            }
                        }
                        else {
                            newList.push(option);
                        }
                    });
                    return newList;
                }
                else {
                    return this.optionsList;
                }
            },
            optionsList() {
                return this.$store.getters.getOptionsList(this.name);
            }
        },
        methods: {
            async updateList() {
                try {
                    let reqData = new FormData();
                    reqData.append('command_list', this.selectedList);
                    // Limit number of cheatsheet answers

                    if (this.$store.getters.getInExperiment) {
                        let stageInformation = this.$store.getters.getStageInformation;
                        let currStageInfo = stageInformation[this.$store.getters.getExperimentStage];
                        if (currStageInfo['restrictedQuestions'] !== null && this.selectedList in currStageInfo.restrictedQuestions) {
                            reqData.append('restricted_list', currStageInfo.restrictedQuestions[this.selectedList])
                        }
                    }

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