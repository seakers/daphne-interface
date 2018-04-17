// initial state
import * as _ from "lodash-es";

const state = {
    inExperiment: false,
    isRecovering: false,
    experimentWebsocket: {},
    experimentStage: '',
    currentStageNum: -1,
    modalContent: ['', 'Stage1Modal', 'Stage2Modal'],
    datasets: ['EOSS_data_recalculated.csv', 'stage1.csv', 'stage2.csv'],
    aggregationXls: ['/xls/Climate-centric/Climate-centric Aggregation Rules.xls',
        '/xls/Climate-centric/Climate-centric Aggregation Rules-Climate.xls',
        '/xls/Climate-centric/Climate-centric Aggregation Rules-Weather.xls'],
    stageInformation: {
        tutorial: {
            availableFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                analyst: ['2012', '2016'],
                critic: ['3005'],
                historian: ['4006'],
                ifeed: [],
                analyst_instruments: [],
                analyst_instrument_parameters: [],
                analyst_measurements: [],
                measurements: [],
                missions: [],
                objectives: [],
                space_agencies: []
            },
            nextStage: '',
            steps: [
                {
                    intro: 'As a Systems Engineer at "The EasySpace Corporation" (ESC) you have been tasked with exploring some designs for a new Earth Observation mission. This mission will fly in about 10 years. Your bosses at ESC have asked you to <b>find designs in a range of possible budgets from $1,000K to $10,000K</b>, as NASA does not yet know how much money it will be able to allocate to it. What\'s more, as science priorities change depending on who is in the White House, you have been asked to do this study twice, first making climate science the biggest priority and then making weather studies the most important research factor. <b>Your partners have been really helpful and have encoded the different priorities in a black-box model for you, so you don\'t need to think about the differences. You should only focus on getting the best designs you can in each case.</b>'
                },
                {
                    intro: 'But that is not all. As a member of the R&D department in the corporation, your teammates are always trying to improve the tools you all use to design new missions. They have been building a virtual assistant called Daphne which will help you by either answering questions or giving you advice on your satellite designs. <b>They want you to test it and see if it helps you work better or not.</b>'
                },
                {
                    intro: 'Your job consists of designing different constellations of satellites for Earth observation. This means you will assign instruments from a predefined set into different orbits and then evaluate your designs to see which ones are the best for each set of priorities and budget limits. You will have to this <b>TWICE</b>, with two different datasets, one for Climate focused missions and one for Weather focused missions. You do not have to do come up with good designs for both focuses at the same time!!!'
                },
                {
                    intro: 'For each focus, you have <b>two main objectives</b>: <b>FIRST</b>: You need to come up with a range of designs with a cost between $1,000K and $10,000K with the best science score you can come up with (later we will explain how to get those designs) and <b>SECOND</b>: After 20 minutes designing with this focus in mind, you will be asked to choose the best architecture out of a pair of architectures with the same cost, 10 times. This is done to see if you have been able to learn something. With this out of the way, let\'s learn how to actually design new satellite architectures! It\'s important to try out the functions you are being shown, as this will help you perform better during the experiment.'
                },
                {
                    element: '#arch-info-display-table',
                    intro: 'Each design is represented by a table as shown here. Each row represents one spacecraft flying in a specified orbit, so the instruments in each row represent the ones in that spacecraft. If one orbit has no instruments, it means there will be no spacecraft flying there. Orbits are defined by various parameters, such as altitude, inclination and local sun time for those which are sun-synchronous.'
                },
                {
                    element:  '.panel.orbit-instr-info',
                    intro: 'Detailed information on what these orbits and instruments are is given in the Orbits and Instruments Information panel. <b>You should read about them now by clicking on the elements of the dropdown list.</b>'
                },
                {
                    element: '#main-plot-block',
                    intro: 'Your first task in the experiment is, again, to come up with a range of designs with the highest science benefit for a range of costs between $1,000K and $10,000K. You can see some initial designs here, but you still need to know how to come up with new, better ones!'
                },
                {
                    element: '#main-plot-block',
                    intro: 'This is the plot that shows the trade-space of the designs you come up with. This set of designs comes from a different problem, so don\'t worry if you see something different when the actual focused task begins. Each dot here is a single design, and each design has an associated science score and a cost. The science score represents how much value each design brings to the scientific community you\'re appealing to (either climate or weather), and the cost is a measure of how much it is going to cost to launch and operate this design (in thousands of dollars).'
                },
                {
                    element: '#admin-panel',
                    intro: 'As you hover over each dot on the scatter plot, you can see the corresponding information being changed in the Design Builder space. If you click on a dot, it is replaced by a cross. The cross means you have selected that design. <b>Try selecting a design which has the highest science benefit for a certain cost (so the one the furthest right for any cost).</b> Just in case you want to know, the set of all the points with the best science for a certain cost is also known as the Pareto Front, and this is an important concept in Systems Engineering.'
                },
                {
                    element: '.design-builder',
                    intro: 'You can move the instruments from one orbit to another, add new instruments, or remove them using drag-and-drop. After modifying the design, you can evaluate it using the <b>"Evaluate Architecture"</b> button on the top-right side. After the evaluation is finished, a new cross will appear on the scatter plot with its location determined by the new science score and cost. It is very important to evaluate the new designs you make, as otherwise they won\'t get saved and you won\'t know how much you improved (or how worse you got :()! <b>Try coming up with a new design before going forward with the tutorial.</b>',
                    position: 'right'
                },
                {
                    element: '#admin-panel',
                    intro: 'You must have noticed how the interface also has a few other windows and text inputs. Those are the different ways you can use to communicate with Daphne, which, if you don\'t remember, is the assistant your partners have been working on. Let\'s learn how you can ask questions first.'
                },
                {
                    element: '#question-bar',
                    intro: 'To ask a question, you can write it down here, and then either click Do It! or press Enter on your keyboard.'
                },
                {
                    element: '#question-bar',
                    intro: 'For example, you can ask what Daphne thinks about the currently design. After thinking for a while, Daphne will give her thoughts on the design along with some hints on how you might want to improve it. <b>Try writing or copying the following question into the Question Bar: "What do you think of this design?"</b> If you want to hear the output instead of just reading it, you can unmute Daphne by clicking on the speaker.'
                },
                {
                    element: '.answers',
                    intro: 'You can read all the suggestions Daphne has for you about your design in here. There are a few more questions you can ask Daphne, so you should know a little more about it.'
                },
                {
                    intro: 'Daphne is a virtual assistant, and it can take on three different roles: Analyst, Historian or Critic. All three roles can answer different kinds of questions, with the Analyst focusing on telling you WHY a design has a certain score, the Historian giving you information on past missions which have been launched, and the Critic explaining HOW you can improve a design with advice.'
                },
                {
                    element: '#admin-panel',
                    intro: 'You can now try choosing a question from those available at the Available Commands lists. If you look at the Analyst list, you will see that there are strange looking words such as ${analyst_stakeholder}. You can look at the lists in Commands Information such as Analyst Stakeholders or Historical Technologies to know valid values for these fields. If a part of a question is inside brackets it means it is optional. <b>One very common way to use the Analyst is to first ask "Why does this design have this science benefit?" and then ask "Which instruments improve the science score for stakeholder ${analyst_stakeholder}?" with the stakeholder which has the lowest score. Another example question (which you can try!) would be: "Which orbit is the most common for ocean colour instruments?"</b>'
                },
                {
                    intro: 'Now you know every tool available to you! The experiment, as you already probably remember ;), will have two stages. Apart from the different focuses, which again don\'t affect you in any way, the main difference between them will be the questions you can ask Daphne: on one case you will only be able to use the Critic questions, while in the other case you will have both the Historian and the Analyst available (but no Critic). Which one you get first is totally randomized.'
                },
                {
                    intro: 'To make the most out of the Analyst and the Historian assistant, you should know how the science score is computed and what information can Daphne provide you. The science score measures how many and how well a set of requirements from different stakeholders (Weather scientists, Climate scientists, etc.) are being satisfied, and the Daphne Analyst can help you by telling you how well these requirements are being satisfied in your designs and what instruments can be used to improve on them. You can also ask the historian about which is the most common orbit for certain instruments, so you can put them in the best orbit for them, in case that exists.'
                },
                {
                    intro: 'As a final reminder, <b>each stage of the experiment will last for 20 minutes</b>. Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between $1,000K and $10,000K</b> and <b>2. Learn how to discern between designs with high and low science benefit with similar costs so you can do a test in which you choose the best out of 2 architectures with similar costs</b>. One helpful trick for this second task is try to find which instruments appear on which orbits for the best architectures you can find. <b>Whether you start with the Critic or the Analyst is randomized</b>, so check what you have available in the Available Commands panel! You are also encouraged to take notes during each task, as this will be really helpful in completing the test with an outstanding performance. The first stage will be to design the Climate focused mission and the second one will be for the Weather focused mission, but once again, <b>this doesn\'t affect you in any way other than not being able to reuse designs!</b>. With this being said, click on done to start the experiment!'
                }
            ],
            conditions: [
                true,
                true,
                true,
            ]
        },
        no_daphne: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter'
            ],
            restrictedQuestions: null,
            nextStage: '',
            startTime: 0,
            stageDuration: 60*1
        },
        daphne_peer: {
            availableFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands'
            ],
            restrictedQuestions: {
                analyst: [],
                critic: ['3005'],
                historian: [],
                ifeed: [],
                analyst_instruments: [],
                analyst_instrument_parameters: [],
                analyst_measurements: [],
                analyst_stakeholders: [],
                measurements: [],
                missions: [],
                technologies: [],
                objectives: [],
                space_agencies: []
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*5
        },
        daphne_assistant: {
            availableFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                analyst: ['2012', '2016'],
                critic: [],
                historian: ['4006', '4007'],
                ifeed: [],
                analyst_instruments: [],
                analyst_instrument_parameters: [],
                analyst_measurements: [],
                measurements: [],
                missions: [],
                objectives: [],
                space_agencies: []
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*5
        }
    }
};

// getters
const getters = {
    getInExperiment(state) {
        return state.inExperiment;
    },
    getExperimentStage(state) {
        return state.experimentStage;
    },
    getStageInformation(state) {
        return state.stageInformation;
    },
    getIsRecovering(state) {
        return state.isRecovering;
    },
    getCurrentStageNum(state) {
        return state.currentStageNum;
    },
    getDatasets(state) {
        return state.datasets;
    },
    getAggregationXls(state) {
        return state.aggregationXls;
    }
};

// actions
const actions = {
    async startExperiment({ state, commit }) {
        // Call server to start experiment
        try {
            let response = await fetch('/api/experiment/start-experiment', {credentials: 'same-origin'});
            if (response.ok) {
                let experimentInformation = await response.json();
                // Start the experiment: set the order of the conditions after the tutorial
                console.log(experimentInformation);
                commit('setNextStage', { experimentStage: 'tutorial', nextStage: experimentInformation.stages[0].type });
                for (let i = 0; i < experimentInformation.stages.length - 1; ++i) {
                    commit('setNextStage', { experimentStage: experimentInformation.stages[i].type, nextStage: experimentInformation.stages[i+1].type });
                }
                // Start the websockets after completing the request so the session cookie is already set
                commit('startExperimentWebsocket');
            }
            else {
                console.error('Error starting the experiment.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async startStage({ state, commit }, stage) {
        // Call server to start stage
        try {
            let nextStage = state.currentStageNum;
            let response = await fetch('/api/experiment/start-stage/' + nextStage, {credentials: 'same-origin'});
            if (response.ok) {
                let experimentInformation = await response.json();
                // Start the stage: get the starting time from the server information
                console.log(experimentInformation);
                let startTime = experimentInformation.stages[nextStage].start_date + '+00:00';
                startTime = Date.parse(startTime);
                commit('setStartTime', { experimentStage: stage, startTime: startTime });
            }
            else {
                console.error('Error starting the stage.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async finishStage({ state, commit }) {
        // Call server to finish stage
        try {
            let currentStage = state.currentStageNum - 1;
            let response = await fetch('/api/experiment/finish-stage/' + currentStage, {credentials: 'same-origin'});
            if (response.ok) {
                let experimentInformation = await response.json();
                // Stage is finished!
                console.log(experimentInformation);
            }
            else {
                console.error('Error finishing the stage.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async finishExperiment({ state, commit }) {
        // Call server to finish experiment
        try {
            let response = await fetch('/api/experiment/finish-experiment', {credentials: 'same-origin'});
            if (response.ok) {
                let experimentInformation = await response.json();
                // Finish the experiment: set inExperiment to false
                console.log(experimentInformation);
                commit('setInExperiment', false);
            }
            else {
                console.error('Error finishing the experiment.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    },

    async recoverExperiment({ state, commit }) {
        // Call server to see if there is an experiment already running
        try {
            let response = await fetch('/api/experiment/reload-experiment', {credentials: 'same-origin'});
            if (response.ok) {
                let experimentInformation = await response.json();
                if (experimentInformation.is_running) {
                    // If experiment was already running restore the last known state
                    commit('setIsRecovering', true);
                    commit('restoreProblem', experimentInformation.experiment_data.state.problem);
                    commit('restoreFilter', experimentInformation.experiment_data.state.filter);
                    commit('restoreTradespacePlot', experimentInformation.experiment_data.state.tradespacePlot);
                    commit('restoreDaphne', experimentInformation.experiment_data.state.daphne);
                    commit('restoreFunctionalityList', experimentInformation.experiment_data.state.functionalityList);
                    commit('restoreDataMining', experimentInformation.experiment_data.state.dataMining);
                    commit('restoreFeatureApplication', experimentInformation.experiment_data.state.featureApplication);
                    commit('restoreExperiment', experimentInformation.experiment_data.state.experiment);
                    // Start the websockets after completing the request so the session cookie is already set
                    commit('startExperimentWebsocket');
                }
            }
            else {
                console.error('Error recovering the experiment.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setInExperiment(state, inExperiment) {
        state.inExperiment = inExperiment;
    },
    setExperimentStage(state, experimentStage) {
        state.experimentStage = experimentStage;
        state.currentStageNum++;
    },
    setNextStage(state, { experimentStage, nextStage }) {
        state.stageInformation[experimentStage].nextStage = nextStage;
    },
    setStartTime(state, { experimentStage, startTime }) {
        state.stageInformation[experimentStage].startTime = startTime;
    },
    restoreExperiment(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            if (key !== 'isRecovering') {
                state[key] = recoveredState[key];
            }
        });
    },
    setIsRecovering(state, isRecovering) {
        state.isRecovering = isRecovering;
    },
    startExperimentWebsocket(state) {
        state.experimentWebsocket = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/api/experiment');
        state.experimentWebsocket.onopen = function() {
            console.log('Experiment Web Socket Conenction Made');
        };
        state.experimentWebsocket.onmessage = function (data) {};
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
