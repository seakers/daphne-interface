<template>
    <div>
        <div class="columns">
            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
                <div>
                    <main-menu></main-menu>
                    <timer
                            v-if="timerExperimentCondition"
                            v-bind:duration="stageDuration"
                            v-bind:start-time="stageStartTime"
                            v-on:countdown-end="onCountdownEnd">
                    </timer>
                </div>
            </aside>
            <div class="column is-10" id="admin-panel">
                <nav class="navbar">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="https://www.selva-research.com/daphne">Daphne</a>
                        <div class="navbar-burger burger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <div class="navbar-menu">
                        <div class="navbar-start is-fullwidth">
                            <div class="navbar-item is-fullwidth">
                                <question-bar v-if="questionBarExperimentCondition" id="question-bar"></question-bar>
                            </div>
                        </div>
                    </div>
                </nav>
                <section class="section is-small">
                    <div class="columns is-mobile">
                        <tradespace-plot></tradespace-plot>
                    </div>
                    <functionality-list></functionality-list>
                </section>
            </div>
        </div>
        <footer class="footer">
            <div class="container">
                <div class="has-text-centered">
                    <p>
                        <strong>Daphne</strong> by <a href="https://www.selva-research.com">SEAK Lab</a>. The source code is licensed
                        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
                    </p>
                </div>
            </div>
        </footer>
        <modal v-bind:modal-content="modalContent" v-bind:is-active="isModalActive" v-on:close-modal="onCloseModal"></modal>
    </div>
</template>

<script>
    import MainMenu from './MainMenu';
    import Timer from './Timer';
    import QuestionBar from './QuestionBar';
    import TradespacePlot from './TradespacePlot';
    import FunctionalityList from './FunctionalityList';
    import Modal from './Modal';

    import EOSS from '../scripts/eoss';
    import EOSSFilter from '../scripts/eoss-filter';

    import { mapGetters } from 'vuex';

    let introJs = require('intro.js').introJs;

    export default {
        name: 'app',
        data: function () {
            return {
                tutorial: {},
                isModalActive: false
            }
        },
        computed: {
            ...mapGetters({
                inExperiment: 'getInExperiment',
                experimentStage: 'getExperimentStage',
                stageInformation: 'getStageInformation',
                websocket: 'getWebsocket',
                isRecovering: 'getIsRecovering',
                currentStageNum: 'getCurrentStageNum',
                datasets: 'getDatasets',
                aggregationXls: 'getAggregationXls'
            }),
            questionBarExperimentCondition() {
                if (!this.inExperiment) {
                    return true;
                }
                else {
                    return this.stageInformation[this.experimentStage].availableFunctionalities.includes('QuestionBar');
                }
            },
            timerExperimentCondition() {
                if (!this.inExperiment) {
                    return false;
                }
                else {
                    return this.experimentStage === 'no_daphne' || this.experimentStage === 'daphne_peer' || this.experimentStage === 'daphne_assistant';
                }
            },
            stageDuration() {
                return this.stageInformation[this.experimentStage].stageDuration;
            },
            stageStartTime() {
                return this.stageInformation[this.experimentStage].startTime;
            },
            modalContent() {
                return this.$store.state.experiment.modalContent[this.$store.state.experiment.currentStageNum];
            }
        },
        methods: {
            onCountdownEnd() {
                console.log('Countdown ended!');
                // First stop the current stage
                this.$store.dispatch('finishStage').then(() => {
                    // Activate the modal with end of stage information
                    this.isModalActive = true;
                });
            },
            onCloseModal() {
                this.isModalActive = false;
            }
        },
        components: { MainMenu, Timer, QuestionBar, TradespacePlot, FunctionalityList, Modal },
        mounted() {
            // Websocket connection
            let websocket = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/api/daphne');
            websocket.onopen = function() {
                console.log('Web Socket Conenction Made');
            };
            websocket.onmessage = function (data) {
                //ws.send(JSON.stringify(data));
            };
            this.$store.commit('setWebsocket', websocket);

            // Tutorial
            this.tutorial = introJs();

            // Set up initial state
            this.$store.commit('setProblem', EOSS);
            this.$store.commit('setFilter', EOSSFilter);

            // Experiment
            this.$store.dispatch('recoverExperiment').then(() => {
                this.$store.commit('setIsRecovering', false);
                // Only start experiment if it wasn't already running
                if (!this.inExperiment) {
                    this.$store.dispatch('startExperiment').then(() => {
                        this.$store.commit('setInExperiment', true);
                        this.$store.commit('setExperimentStage', 'tutorial');
                    });
                }
            });

            /*this.$store.commit('addFunctionality', 'DesignBuilder');
            this.$store.commit('addFunctionality', 'DataMining');
            this.$store.commit('addFunctionality', 'FeatureApplication');
            this.$store.commit('addFunctionality', 'EOSSFilter');
            this.$store.commit('addFunctionality', 'DaphneAnswer');
            this.$store.commit('addFunctionality', 'OrbitInstrInfo');
            this.$store.commit('addFunctionality', 'AvailableCommands');
            this.$store.commit('addFunctionality', 'CommandsInformation');
            this.$store.dispatch('loadNewData', 'EOSS_data_recalculated.csv');*/
        },
        watch: {
            experimentStage: function (val, oldVal) {
                if (this.inExperiment && !this.isRecovering) {
                    // Reset state
                    this.$store.commit('resetDaphne');
                    this.$store.commit('resetTradespacePlot');
                    this.$store.commit('resetProblem');
                    this.$store.commit('resetFunctionalityList');
                    this.$store.commit('resetDataMining');
                    this.$store.commit('resetFilter');
                    this.$store.commit('resetFeatureApplication');

                    // Add functionalities
                    for (let shownFunc of this.stageInformation[this.experimentStage].shownFunctionalities) {
                        this.$store.commit('addFunctionality', shownFunc);
                    }

                    // Load stage dataset
                    this.$store.dispatch('loadNewData', this.datasets[this.currentStageNum]).then(async () => {
                        // Switch the VASSAR models for the new ones specific to this dataset
                        await this.$store.dispatch('changeProblemLoadedFiles', {
                            'aggregationXls': this.aggregationXls[this.currentStageNum]
                        });
                        // Stage specific behaviour
                        switch (this.experimentStage) {
                            case 'tutorial': {
                                this.tutorial.addSteps(this.$store.state.experiment.stageInformation.tutorial.steps);
                                this.tutorial.setOption('exitOnOverlayClick', false);
                                this.tutorial.setOption('exitOnEsc', false);
                                this.tutorial.oncomplete(() => {
                                    this.$store.dispatch('startStage', this.stageInformation.tutorial.nextStage).then(() => {
                                        this.$store.commit('setExperimentStage', this.stageInformation.tutorial.nextStage);
                                    });
                                });
                                // TODO: Hijack next button action on tutorial
                                this.tutorial.start();
                                break;
                            }
                            case 'no_daphne': {
                                break;
                            }
                            case 'daphne_peer': {
                                break;
                            }
                            case 'daphne_assistant': {
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>