<template>
    <div>
        <div class="columns">
            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
                <div class="aside-container">
                    <main-menu></main-menu>
                    <timer
                            v-if="timerExperimentCondition"
                            v-bind:duration="stageDuration"
                            v-bind:start-time="stageStartTime"
                            v-on:countdown-end="onCountdownEnd">
                    </timer>
                    <problem-picker></problem-picker>
                    <active-switches></active-switches>
                    <user class="user-info"></user>
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
                    <active-message></active-message>
                </section>
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
    import User from './User';
    import ProblemPicker from './ProblemPicker';
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import ActiveMessage from "./ActiveMessage";
    import ActiveSwitches from "./ActiveSwitches";

    let introJs = require('intro.js');

    export default {
        name: 'app',
        data: function () {
            return {
                tutorial: {},
                isStartup: true
            }
        },
        computed: {
            ...mapState({
                isModalActive: state => state.modal.isModalActive,
                modalContent: state => state.modal.modalContent,
                dataset: state => state.problem.datasetFilename
            }),
            ...mapGetters({
                inExperiment: 'getInExperiment',
                experimentStage: 'getExperimentStage',
                stageInformation: 'getStageInformation',
                websocket: 'getWebsocket',
                isRecovering: 'getIsRecovering',
                currentStageNum: 'getCurrentStageNum',
                datasets: 'getDatasets',
                vassarPort: 'getVassarPort'
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
            }
        },
        methods: {
            onCountdownEnd() {
                console.log('Countdown ended!');
                // First stop the current stage
                this.$store.dispatch('finishStage').then(() => {
                    // Activate the modal with end of stage information
                    this.$store.commit('activateModal', this.$store.state.experiment.modalContent[this.$store.state.experiment.currentStageNum]);
                });
            },
            onCloseModal() {
                this.$store.commit('closeModal');
                if (this.modalContent === 'LoginModal' && this.isStartup) {
                    this.init();
                }
            },
            async init(startData) {
                // Stop all running background tasks
                await this.$store.dispatch('stopBackgroundTasks');

                // Start the Websocket
                await this.$store.dispatch('startWebsocket');

                // Initialize the new problem
                await this.$store.dispatch('initProblem');
                if (startData !== undefined && startData['modified_dataset']) {
                    await this.$store.dispatch('reloadOldData', startData['data']);
                }
                else {
                    await this.$store.dispatch('loadNewData', this.dataset);
                }

                // Initialize user-only features
                if (this.$store.state.auth.isLoggedIn) {
                    await this.$store.dispatch("retrieveActiveSettings");
                    this.$store.dispatch("startBackgroundSearch");
                }

                this.isStartup = false;
            }
        },
        components: {
            ActiveSwitches,
            ActiveMessage,
            MainMenu,
            Timer,
            QuestionBar,
            TradespacePlot,
            FunctionalityList,
            Modal,
            User,
            ProblemPicker
        },
        mounted() {
            // Tutorial
            this.tutorial = introJs();

            // Check if user is logged in before putting prompt
            try {
                fetchGet('/api/auth/check-status').then(async (response) => {
                    if (response.ok) {
                        let data = await response.json();
                        // Start by setting problem name and current dataset
                        let problemName = data['problem'];
                        let dataset = data['dataset'];
                        if (problemName === '') {
                            problemName = 'SMAP';
                        }
                        if (dataset === '') {
                            dataset = 'test_smap.csv';
                        }

                        // Put the name and dataset back into the store
                        await this.$store.dispatch('setProblemName', problemName);
                        this.$store.commit('setDatasetFilename', dataset);

                        // If the user is already logged in, just proceed with loading as usual; if not, show login screen
                        if (data['is_logged_in'] === true) {
                            this.$store.commit('logUserIn', data);
                            this.init(data);
                        }
                        else {
                            this.$store.commit('activateModal', 'LoginModal');
                        }
                    }
                });
            }
            catch (e) {
                console.error('Networking error:', e);
            }
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
                        await this.$store.dispatch('changeVassarPort', this.vassarPort[this.currentStageNum]);
                        // Stage specific behaviour
                        switch (this.experimentStage) {
                            case 'tutorial': {
                                this.tutorial.addSteps(this.$store.state.experiment.stageInformation.tutorial.steps);
                                this.tutorial.setOption('exitOnOverlayClick', false);
                                this.tutorial.setOption('exitOnEsc', false);
                                this.tutorial.setOption('showProgress', true);
                                this.tutorial.setOption('showBullets', false);
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
    .aside-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .user-info {
        padding: 30px;
        width: 100%;
        flex-grow: 1;
        color: #F6F7F7;
        font-size: 16px;
        font-weight: bold;
    }
</style>
