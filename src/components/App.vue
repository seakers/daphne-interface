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
                    <problem-picker v-if="!inExperiment"></problem-picker>
                    <services-menu></services-menu>
                    <user class="user-info" v-if="!inExperiment"></user>
                </div>
            </aside>
            <div class="column is-7" id="admin-panel">
                <div class="columns">
                    <tradespace-plot></tradespace-plot>
                </div>
                <functionality-list></functionality-list>
            </div>
            <div class="vertical-divider"></div>
            <chat-window class="column is-3" ref="chatWindow"></chat-window>
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
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import {wsTools} from "../scripts/websocket-tools";
    import Shepherd from 'shepherd.js';

    import MainMenu from './MainMenu';
    import Timer from './Timer';
    import QuestionBar from './QuestionBar';
    import TradespacePlot from './TradespacePlot';
    import FunctionalityList from './FunctionalityList';
    import Modal from './Modal';
    import User from './User';
    import ProblemPicker from './ProblemPicker';
    import ActiveMessage from "./ActiveMessage";
    import ServicesMenu from "./ServicesMenu";
    import ChatWindow from "./ChatWindow";

    import { ProblemReload, ProblemByNameQuery, DatasetByNameQuery } from "../scripts/apollo-queries";


    export default {
        name: 'app',
        data: function () {
            return {
                tutorial: {},
                isStartup: true,
                problemStatus: {},
                activeAnalystInterval: -1
            }
        },
        computed: {
            ...mapState({
                isModalActive: state => state.modal.isModalActive,
                modalContent: state => state.modal.modalContent,
                datasetInformations: state => state.experiment.datasetInformations,
                problems: state => state.experiment.problems,
                inExperiment: state => state.experiment.inExperiment,
                experimentStage: state => state.experiment.experimentStage,
                stageInformation: state => state.experiment.stageInformation,
                isRecovering: state => state.experiment.isRecovering,
                isRecoveringAsync: state => state.experiment.isRecoveringAsync,
                currentStageNum: state => state.experiment.currentStageNum,
                stageProblemName: state => state.experiment.stageProblemName,
                stageDatasetName: state => state.experiment.stageDatasetName,
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                user_pk: state => state.auth.user_pk,
                gaServiceStatus: state => state.services.gaServiceStatus,
                vassarRebuildStatus: state => state.services.vassarRebuildStatus,
                analystSuggestionsFrequency: state => state.active.analystSuggestionsFrequency,
            }),
            timerExperimentCondition() {
                if (!this.inExperiment) {
                    return false;
                }
                else {
                    return this.currentStageNum > 0;
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
                    fetchGet(API_URL + 'auth/check-status').then(async (response) => {
                        if (response.ok) {
                            let data = await response.json();

                            // LOGIN DATA
                            let problemId = data['problem_id'];
                            let groupId   = data['group_id'];
                            let datasetId = data['dataset_id'];

                            // Put problem id in store
                            this.$store.commit('setProblemId', problemId);
                            this.$store.commit('setGroupId', groupId);
                            this.$store.commit('setDatasetId', datasetId);
                            await this.init(data);
                            if (data["is_experiment_user"] === true) {
                                this.initExperiment(data);
                            }
                        }
                    });
                }
                else if (this.modalContent === 'ReloadModal') {
                    this.init();
                }
            },
            async init(startData) {
                console.log("--> INIT DATA", startData);

                // 0.1 Get problem_id for loading
                // let problem_id = parseInt(PROBLEM__ID);
                let groupId   = startData['group_id'];
                let problemId = startData['problem_id'];
                let datasetId = startData['dataset_id'];

                // 1. Stop all running background tasks
                await this.$store.dispatch('stopBackgroundTasks');

                // 2. Initialize the new problem
                await this.$store.dispatch('initProblem', problemId);
                if (startData["is_experiment_user"]) {
                    this.$store.commit("resetFunctionalityList");
                }

                // 3. Load architectures from back-end
                let parameters = {
                    'group_id'  : groupId,
                    'problem_id': problemId,
                    'dataset_id': datasetId
                };
                this.$store.dispatch('loadData', parameters);

                // 4. Connect to a VASSAR Evaluator/GA pair
                // Set up a watcher for the GA status to start GA as soon as it's ready
                if (this.$store.state.auth.isLoggedIn && !startData["is_experiment_user"]) {
                    const stopGaWatch = this.$watch(
                        function() {
                            return this.gaServiceStatus;
                        },
                        function(newStatus, _) {
                        if (newStatus === "ready") {
                            this.$store.dispatch('startBackgroundSearch');
                            stopGaWatch();
                        }
                    });
                }
                // Initialize services
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "connect_services"
                }));

                // 5. Load past dialogue - scroll chat window down
                this.$store.dispatch('loadDialogue').then(() => {
                    this.$refs.chatWindow.scrollToBottom();
                });
                
                // 6. Initialize user-only features
                if (this.$store.state.auth.isLoggedIn) {
                    await this.$store.dispatch('retrieveActiveSettings');
                }

                // 7. Call backend to initialize data-mining
                this.$store.dispatch('setProblemParameters');

                // 8. Init active Analyst
                if (!startData["is_experiment_user"]) {
                    window.clearInterval(this.activeAnalystInterval);
                    this.activeAnalystInterval = window.setInterval(function() {
                        wsTools.websocket.send(JSON.stringify({
                            msg_type: 'active_analyst'
                        }));
                    }, this.analystSuggestionsFrequency*1000);
                }

                // 9. Start-up has finished
                this.isStartup = false;
            },

            async initExperiment(startData) {
                // Experiment
                this.$store.dispatch('recoverExperiment').then(async () => {
                    console.log(this.isRecovering);
                    this.$store.commit('setIsRecovering', false);

                    // Only start experiment if it wasn't already running
                    if (!this.inExperiment) {
                        this.$store.dispatch('startExperiment').then(async () => {
                            // Connect the Experiment WS
                            await wsTools.experimentWsConnect();

                            // Set the tutorial
                            this.$store.commit('setExperimentStage', 'tutorial');
                            this.$store.commit('setInExperiment', true);
                        });
                    }
                });
            },
            async continueStageInit() {
                // Wait on the Vue apollo queries before proceeding!!!
                console.log("Stage Problem ID: ", this.stageProblemId, "Stage Dataset ID:", this.stageDatasetId);

                // 1. Initialize the problem
                await this.$store.dispatch('initProblem', this.stageProblemId);

                // 2. Rebuild the VASSAR service & set GA to start as soon as that is done (and not before!!!)
                this.$store.commit("setVassarRebuildStatus", "");
                this.$store.commit("setVassarServiceStatus", "uninitialized");
                const stopVassarRebuildWatch = this.$watch(
                function() {
                    return this.vassarRebuildStatus;
                },
                function(newStatus, _) {
                    if (newStatus === "success") {
                        this.$store.commit("setVassarServiceStatus", "ready");
                        // 6. GA initialization
                        if (this.stageInformation[this.experimentStage].availableFunctionalities.includes('BackgroundSearch')) {
                            this.$store.dispatch('startBackgroundSearch');
                        }
                        // 7. Data Mining initialization
                        this.$store.dispatch('setProblemParameters');
                        // 8. Active Analyst init (if supposed to)
                        if (this.stageInformation[this.experimentStage].availableFunctionalities.includes('HypothesisTester')) {
                            this.activeAnalystInterval = window.setInterval(function() {
                                wsTools.websocket.send(JSON.stringify({
                                    msg_type: 'active_analyst'
                                }));
                            }, 60*1000);
                        }
                        stopVassarRebuildWatch();
                    }
                    else {
                        console.log("Failure reinitializing VASSAR. Please abort experiment!");
                        stopVassarRebuildWatch();
                    }
                    // Set rebuild status back to empty
                    this.$store.commit("setVassarRebuildStatus", "");
                });

                wsTools.websocket.send(JSON.stringify({
                    msg_type: "rebuild_vassar",
                    group_id: this.groupId,
                    problem_id: this.stageProblemId,
                    dataset_id: this.stageDatasetId
                }));

                // 3. Load the new dataset
                this.$store.commit("setIgnoreQuery", true);
                let parameters = {
                    'group_id'  : this.groupId,
                    'problem_id': this.stageProblemId,
                    'dataset_id': this.stageDatasetId
                };
                this.$store.dispatch('loadData', parameters);

                // 4. Clear dialogue and reload
                this.$store.dispatch('clearHistory');

                // 5. Add stage-specific functionalities
                for (let shownFunc of this.stageInformation[this.experimentStage].shownFunctionalities) {
                    this.$store.commit('addFunctionality', { functionality: shownFunc, funcData: null });
                }

                // 6. Stage specific behaviour
                switch (this.experimentStage) {
                    case 'tutorial': {
                        this.$store.state.experiment.stageInformation.tutorial.steps.forEach(step => {
                            this.tutorial.addStep({
                                    ...step,
                                    buttons: [
                                        {
                                            text: 'Previous',
                                            action: this.tutorial.back
                                        },
                                        {
                                            text: 'Next',
                                            action: this.tutorial.next
                                        }
                                    ]
                                });
                        });
                        // Add specific last step based on what will be available in the next stage
                        // let lastStepText = "";
                        // switch (this.stageInformation.tutorial.nextStage) {
                        //     case 'daphne_classic':
                        //         lastStepText = `For the first stage, you have been assigned the Daphne with 
                        //         design capabilities. You can design architectures, study their details, ask questions 
                        //         about your designs to Daphne, and the background search will find good architectures 
                        //         for you. On the other hand, neither the data mining nor the hypothesis tester are available to you.
                        //         As a reminder, you may have to scroll down to see some of the features. 
                        //         Press Next to start the first stage.`;
                        //         break;
                        //     case 'daphne_dm':
                        //         lastStepText = `For the first stage, you have been assigned the Daphne with 
                        //         data mining capabilities. You can design architectures, study their details, ask questions 
                        //         about your designs to Daphne, use the Data Mining capabilities, and the background search will 
                        //         find good architectures for you. The hypothesis tester is not available to you. 
                        //         As a reminder, you may have to scroll down to see some of the features. 
                        //         Press Next to start the first stage.`;
                        //         break;
                        //     case 'daphne_hypothesis':
                        //         lastStepText = `For the first stage, you have been assigned the Daphne with 
                        //         hypothesis testing capabilities. You can design architectures, study their details, ask questions 
                        //         about your designs to Daphne, use the Data Mining capabilities, test hypotheses about the design set, 
                        //         and the background search will find good architectures for you, including ones that help prove or 
                        //         disprove your hypotheses. Additionally, Daphne may suggest features to be tested as hypotheses to you. 
                        //         As a reminder, you may have to scroll down to see some of the features. 
                        //         Press Next to start the first stage.`;
                        //         break;
                        // }
                        // this.tutorial.addStep({
                        //     text: lastStepText,
                        //     buttons: [
                        //                 {
                        //                     text: 'Previous',
                        //                     action: this.tutorial.back
                        //                 },
                        //                 {
                        //                     text: 'Next',
                        //                     action: this.tutorial.next
                        //                 }
                        //             ]
                        // })
                        this.tutorial.on("complete", () => {
                            this.$store.commit('activateModal', this.$store.state.experiment.modalContent[this.$store.state.experiment.currentStageNum]);
                        });
                        // TODO: Hijack next button action on tutorial
                        console.log("Started tutorial!");
                        this.tutorial.start();
                        
                        break;
                    }
                    case 'no_daphne': {
                        break;
                    }
                    case 'daphne_novice': {
                        this.$store.dispatch('updateExpertiseLevel', "novice");
                        this.$store.commit('setHistorianSuggestionsFrequency', 3);
                        this.$store.commit('setExpertSuggestionsFrequency', 3);
                        this.$store.commit('setAnalystSuggestionsFrequency', 90);
                        this.$store.dispatch("updateActiveSettings");
                        break;
                    }
                    case 'daphne_expert': {
                        this.$store.dispatch('updateExpertiseLevel', "expert");
                        this.$store.commit('setHistorianSuggestionsFrequency', 6);
                        this.$store.commit('setExpertSuggestionsFrequency', 6);
                        this.$store.commit('setAnalystSuggestionsFrequency', 180);
                        this.$store.dispatch("updateActiveSettings");
                        break;
                    }
                    default: {
                        break;
                    }
                }

                // 7. Initialize user-only features
                await this.$store.dispatch("retrieveActiveSettings");
                this.$store.commit('setShowFoundArchitectures', false);

                if (this.stageInformation[this.experimentStage].availableFunctionalities.includes('Diversifier')) {
                    this.$store.commit('setRunDiversifier', true);
                }
                else {
                    this.$store.commit('setRunDiversifier', false);
                }

                if (this.stageInformation[this.experimentStage].availableFunctionalities.includes('LiveSuggestions')) {
                    this.$store.commit('setShowSuggestions', true);
                }
                else {
                    this.$store.commit('setShowSuggestions', false);
                }
                this.$store.dispatch("updateActiveSettings");

                // 8. Expertise settings
                this.$store.dispatch('updateExpertiseLevel', "novice");
                this.$store.commit('setHistorianSuggestionsFrequency', this.stageInformation[this.experimentStage].activeSettings["historianFrequency"]);
                this.$store.commit('setExpertSuggestionsFrequency', this.stageInformation[this.experimentStage].activeSettings["engineerFrequency"]);
                this.$store.commit('setAnalystSuggestionsFrequency', this.stageInformation[this.experimentStage].activeSettings["analystFrequency"]);
                this.$store.dispatch("updateActiveSettings");
            }
        },
        apollo: {
            stageProblemId: {
                query: ProblemByNameQuery,
                variables() {
                    return {
                        problem_name: this.stageProblemName
                    }
                },
                skip() {
                    return this.stageProblemName === "";
                },
                update: data => {
                    console.log(data);
                    return data.problem[0].id;
                }
            },
            stageDatasetId: {
                query: DatasetByNameQuery,
                variables() {
                    return {
                        dataset_name: this.stageDatasetName,
                        problem_id: this.stageProblemId,
                        user_id: this.user_pk
                    }
                },
                skip() {
                    return this.stageDatasetName === "";
                },
                update: data => {
                    console.log(data);
                    return data.dataset[0].id;
                },
                result({ data, loading, networkStatus }) {
                    if (!this.isRecoveringAsync) {
                        console.log("Experiment is not recovering. Starting stage!");
                        this.continueStageInit();
                    }
                    else {
                        console.log("Experiment is recovering! Not starting stage.");
                        this.$store.commit("setIsRecoveringAsync", false);
                    }
                },
            },
            $subscribe: {
                problemStatus: {
                    deep: true,
                    query: ProblemReload,
                    variables() {
                        return {
                            problem_id: this.problemId
                        }
                    },
                    skip() {
                        return this.problemId === null;
                    },
                    result({ data }) {
                        console.log(data)
                        if (data['problem_status'] !== null) {
                            let status = data['problem_status']['reload_problem'];
                            this.$store.commit('setProblemStatus', status);

                            // 1. Check to see if reload_problem is TRUE
                            if(status === true){
                                console.log("--> reload required");
                                // 2. Stop architecture subscription
                                // this.$apollo.subscriptions.Architecture.stop();
                                console.log(this.$apollo.subscriptions.toString());

                                // 3. Open modal alerting the user that the problem needs a reload
                                this.$store.commit('activateModal', 'ReloadModal');

                                // 4. After user has re-loaded the problem, start arch subscription again
                            }
                        }
                    },
                },
            },
        },
        components: {
            ChatWindow,
            ServicesMenu,
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
        async mounted() {
            // Tutorial
            this.tutorial = new Shepherd.Tour({
                defaultStepOptions: {
                    classes: 'shadow-md bg-purple-dark',
                    scrollTo: true
                },
                useModalOverlay: true,
                exitOnEsc: false
            });

            // Generate the session
            await fetchPost(API_URL + 'auth/generate-session', new FormData());

            // Start the Websocket
            await wsTools.wsConnect(this.$store);

            // Check if user is logged in before putting prompt
            try {
                fetchGet(API_URL + 'auth/check-status').then(async (response) => {
                    if (response.ok) {
                        let data = await response.json();

                        // LOGIN DATA
                        let groupId   = data['group_id'];
                        let problemId = data['problem_id'];
                        let datasetId = data['dataset_id'];

                        // Put problem id in store
                        this.$store.commit('setGroupId', groupId);
                        this.$store.commit('setProblemId', problemId);
                        this.$store.commit('setDatasetId', datasetId);

                        // If the user is already logged in, just proceed with loading as usual; if not, show login screen
                        if (data['is_logged_in'] === true) {
                            this.$store.commit('logUserIn', data);
                            await this.init(data);
                            if (data["is_experiment_user"] === true) {
                                this.initExperiment(data);
                            }
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
            experimentStage: async function (val, oldVal) {
                if (this.inExperiment && !this.isRecovering) {
                    // Set problem for this stage and load the corresponding dataset
                    // Stop all running background tasks
                    await this.$store.dispatch('stopBackgroundTasks');
                    window.clearInterval(this.activeAnalystInterval);

                    // 1. Find problem and dataset ids from names (might change from computer to computer)
                    this.$store.commit("setStageProblemName", this.problems[this.currentStageNum]);
                    this.$store.commit("setStageDatasetName", this.datasetInformations[this.currentStageNum]["name"]);

                    // Continued after Vue Apollo queries are finished in continueStageInit()
                }
            },
            analystSuggestionsFrequency: async function (val, oldVal) {
                window.clearInterval(this.activeAnalystInterval);
                this.activeAnalystInterval = window.setInterval(
                    function() {
                        wsTools.websocket.send(JSON.stringify({
                            msg_type: 'active_analyst'
                        }));
                    },
                    val*1000);
            },
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

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

    .vertical-divider {
        background: $grey-light;
        width: 1px;
    }
</style>
