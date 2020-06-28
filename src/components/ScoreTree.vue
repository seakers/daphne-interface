<template>
    <div class="content">
        <h2>Science Score</h2>
        <ul class="no-list-type">
            <li v-for="(panel, pIndex) in scoreInfo">
                <span class="icon" v-on:click="toggleShow(pIndex)"><i class="fas" v-bind:class="{ 'fa-angle-down': !showScore[pIndex]['show'], 'fa-angle-up': showScore[pIndex]['show']}"></i></span>
                {{ panel.name }} ({{ panel.description }}) | Score: {{ panel.value | round(2) }}/1 | Weight: {{ panel.weight | round(2) }}/1
                <ul class="no-list-type" v-if="showScore[pIndex]['show']">
                    <li v-for="(objective, oIndex) in panel.subscores">
                        <span class="icon" v-on:click="toggleShow(pIndex, oIndex)"><i class="fas" v-bind:class="{ 'fa-angle-down': !showScore[pIndex]['objectives'][oIndex]['show'], 'fa-angle-up': showScore[pIndex]['objectives'][oIndex]['show']}"></i></span>
                        {{ objective.name }} ({{ objective.description }}) | Score: {{ objective.value | round(2) }}/1 | Weight: {{ objective.weight | round(2) }}/1
                        <ul class="no-list-type" v-if="showScore[pIndex]['objectives'][oIndex]['show']">
                            <li v-for="subobjective in objective.subscores">
                                {{ subobjective.name }} ({{ subobjective.description }}) | Score: {{ subobjective.value | round(2) }}/1 | Weight: {{ subobjective.weight | round(2) }}/1 | <a v-on:click.prevent="loadDetailsTable(subobjective.name)">Details</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'score-tree',
        data() {
            return {
                showScore: []
            }
        },
        computed: {
            ...mapState({
                scoreInfo: state => state.score.scoreInfo
            })
        },
        filters: {
            round: function(value, decimals) {
                if(!value) {
                    value = 0;
                }

                if(!decimals) {
                    decimals = 0;
                }

                value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
                return value;
            }
        },
        methods: {
            toggleShow(panelIndex, objectIndex) {
                if (objectIndex === undefined) {
                    this.showScore[panelIndex]['show'] = !this.showScore[panelIndex]['show'];
                }
                else {
                    this.showScore[panelIndex]['objectives'][objectIndex]['show'] = !this.showScore[panelIndex]['objectives'][objectIndex]['show'];
                }
            },
            loadDetailsTable(subobjective) {
                this.$store.dispatch('setSubobjectiveDetails', subobjective);
            }
        },
        watch: {
            scoreInfo: function(val, oldVal) {
                this.showScore = [];
                for (let panelScore of this.scoreInfo) {
                    let objectiveShow = [];
                    for (let objectiveScore of panelScore.subscores) {
                        objectiveShow.push({
                            show: false
                        });
                    }
                    this.showScore.push({
                        show: false,
                        objectives: objectiveShow
                    });
                }
            }
        }
    }
</script>

<style scoped>
.no-list-type {
    list-style-type: none;
}
</style>