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

    import { ProblemReload } from "../scripts/apollo-queries";
    import {ExperimentProblem} from "../scripts/experiment-queries";
    import { index_single_dataset, generate_dataset_name } from "../scripts/arch_operations";


    export default {
        name: 'app',
        data: function () {
            return {
                tutorial: {},
                isStartup: true,
                problemStatus: {},
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
                currentStageNum: state => state.experiment.currentStageNum,
                problemId: state => state.problem.problemId,
                user_pk: state => state.auth.user_pk,
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

                // 3. Load architectures from back-end
                let parameters = {
                    'group_id'  : groupId,
                    'problem_id': problemId,
                    'dataset_id': datasetId
                };
                this.$store.dispatch('loadData', parameters);

                // 4. Connect to a VASSAR Evaluator/GA pair
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "connect_services"
                }));

                // 5. Load past dialogue - scroll chat window down
                this.$store.dispatch('loadDialogue').then(() => {
                    this.$refs.chatWindow.scrollToBottom();
                });
                
                // 6. Initialize user-only features
                if (this.$store.state.auth.isLoggedIn) {
                    this.$store.dispatch('retrieveActiveSettings');
                    // this.$store.dispatch("startBackgroundSearch");
                }

                // 7. Call backend to initialize data-mining
                this.$store.dispatch('setProblemParameters');

                // 8. Start-up has finished
                this.isStartup = false;
            },
            async get_experiment_problem_id(problem_name){
                let result = await this.$apollo.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: ExperimentProblem,
                    variables: {
                        problem_name: problem_name,
                    }
                });
                console.log(result);
                return result.data.Problem[0].id;

            },
        },
        apollo: {
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



            // --> REGULAR DAPHNE FRONTEND
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




            /*

            // --> EXPERIMENT FRONTEND

            // 1. Generate the session
            await fetchPost(API_URL + 'auth/generate-session', new FormData());

            // 2. Start websocket
            await wsTools.wsConnect(this.$store);

            // 3. Recover experiment if needed
            this.$store.dispatch('recoverExperiment').then(async () => {
                this.$store.commit('setIsRecovering', false);

                // 4. Start new experiment if no recovery
                if (!this.inExperiment) {
                    this.$store.commit('activateModal', 'ExperimentRegisterModal');
                }
            });


             */

        },
        watch: {
            experimentStage: async function (val, oldVal) {
                if (this.inExperiment && !this.isRecovering) {

                    // 1. Set problem for this stage
                    // - Create new dataset for the beginning of each stage
                    let problem_name = this.problems[this.currentStageNum];
                    let problem_id = await this.get_experiment_problem_id(problem_name);

                    // 2. Index new dataset for problem
                    let dataset_name = await generate_dataset_name(this.user_pk, problem_id);
                    let dataset_id = await index_single_dataset(1, problem_id, this.user_pk, dataset_name);

                    // 3. Stop all running background tasks
                    await this.$store.dispatch('stopBackgroundTasks');

                    // 4. Initialize the new problem
                    await this.$store.dispatch('initProblem', problem_id);

                    // 5. Load architectures from back-end
                    let parameters = {
                        'group_id'  : 1,
                        'problem_id': problem_id,
                        'dataset_id': dataset_id
                    };
                    await this.$store.dispatch('loadData', parameters);

                    // 6. Connect to a VASSAR Evaluator/GA pair
                    wsTools.websocket.send(JSON.stringify({
                        msg_type: "connect_services"
                    }));

                    // 7. Load past dialogue - scroll chat window down
                    this.$store.dispatch('loadDialogue').then(() => {
                        this.$refs.chatWindow.scrollToBottom();
                    });


                    // 8. Initialize user-only features
                    // if (this.$store.state.auth.isLoggedIn) {
                    //     this.$store.dispatch('retrieveActiveSettings');
                    // }

                    // 9. Call backend to initialize data-mining
                    await this.$store.dispatch('setProblemParameters');


                    // Add functionalities
                    for (let shownFunc of this.stageInformation[this.experimentStage].shownFunctionalities) {
                        this.$store.commit('addFunctionality', { functionality: shownFunc, funcData: null });
                    }

                    // Stage specific behaviour
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
                            this.tutorial.on("complete", () => {
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

                    // Initialize user-only features
                    await this.$store.dispatch("retrieveActiveSettings");
                    if (this.stageInformation[this.experimentStage].availableFunctionalities.includes('BackgroundSearch')) {
                        // await this.$store.dispatch("startBackgroundSearch");
                    }
                    this.$store.commit('setShowFoundArchitectures', true);


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
                    await this.$store.dispatch("updateActiveSettings");

                    // Data Mining initialization
                    await this.$store.dispatch('setProblemParameters');
                }
            }
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
