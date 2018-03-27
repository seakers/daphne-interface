// initial state
import * as _ from "lodash-es";

const state = {
    inExperiment: false,
    experimentStage: '',
    currentStageNum: -1,
    modalContent: ['', 'Stage1Modal', 'Stage2Modal'],
    stageInformation: {
        tutorial: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet'
            ],
            dataset: 'EOSS_data_recalculated.csv',
            nextStage: '',
            steps: [
                {
                    intro: 'As a Systems Engineer at "The EasySpace Corporation" (ESC) you have been tasked with exploring some designs for a new Earth Observation mission. This mission will fly in about 10 years. Your bosses at ESC have asked you to find designs in a range of possible budgets from $1M to $10M, as NASA does not yet know how much money it will be able to allocate to it. What\'s more, as science priorities change depending on who is in the White House, you have been asked to do this study twice, first making weather studies the biggest priority and then making climate science the most important research factor.'
                },
                {
                    intro: 'But that is not all. As a member of the R&D department in the corporation, your teammates are always trying to improve the tools you all use to design new missions. They have been building a virtual assistant called Daphne which will help you by either answering questions or giving you advice on your design decisions and they want you to test it and see if it helps you work better or not.'
                },
                {
                    intro: 'Your task will be designing a constellation of satellites for Earth observation. This means you will assign instruments from a predefined set into different orbits and then evaluate your designs to see which ones are the best for each set of priorities and budget limits.'
                },
                {
                    element: '#arch-info-display-table',
                    intro: 'Each design is represented by a table as shown here. It shows which set of measurement instruments is assigned to fly in each orbit. Each row represents one spacecraft flying in a specified orbit. Orbits are defined by various parameters, such as altitude and inclination'
                },
                {
                    element: '#arch-info-display-table',
                    intro: 'Each column represents what measurement instruments (sensors) are onboard each of those spacecraft. The instruments include spectrometers, lidars, radars, imagers, etc.'
                },
                {
                    element: '#arch-info-display-table',
                    intro: 'The real names of orbits and instruments were changed to numbers and alphabetical letters repectively to make the task simpler. There are total 5 candidate orbits, and 6 available measurement instruments.'
                },           // 6 instead of 12?
                {
                    element:  '.cheatsheet',
                    intro: 'Detailed information on what these orbits and instruments are is given in the cheatsheet when checking the Orbits and Instruments alias. You don\'t have to pay attention to this information for now, but it may come in handy later in the design task.'
                },
                {
                    element: '#main-plot-block',
                    intro: 'This is the plot that shows the main trade-off of the designs. Each dot here is a single design, and each design has associated science score (a measure of performance) and cost. The science score represents how much value each design brings to the climate monitoring community, and the cost is a measure of how much it is going to cost (in million dollars).'
                },
                {
                    element: '#main-plot-block',
                    intro: 'Your task in the experiment will be to find designs that maximize the science score while minimizing the cost.'
                },
                {
                    element: '.columns > div > section',
                    intro: 'As you hover over each dot on the scatter plot, you can see the corresponding information being changed. If you click a dot, it is replaced by a cross. The cross means you have selected that design.'
                },
                {
                    element: '.panel.design_inspector',
                    intro: 'You can move the instruments from one orbit to another orbit, add new instruments, or remove them using drag-and-drop. After modifying the design, you can evaluate it using the <b>"Evaluate Architecture"</b> button on the top-right side. After the evaluation is finished, a cross will appear on the scatter plot with its location determined by the new science score and cost. It is very important to evaluate the new designs you make, as otherwise they won\'t get saved and you won\'t know how much you improved!'
                },
                {
                    element: '.panel.design_inspector',
                    intro: 'In one of the tasks, <b>you will be asked to try to find good designs (maximizing science and minimizing cost)</b>, just using this method.'
                },
                {
                    element: '.navbar-menu',
                    intro: 'In another task, a virtual assistant called Daphne will help you find good designs. You can communicate with Daphne through this text input field. You can ask various questions here.'
                },
                {
                    element: '.navbar-menu',
                    intro: 'For example, you can ask what Daphne thinks about a specific design. Then Daphne will give her thoughts on the design along with some hints on how you might want to improve it. An example question (<i>you can try it!</i>) would be: "What do you think of design D1000?"'
                },
                {
                    element: '.cheatsheet',
                    intro: 'You can also ask about missions that have already been flown. The available questions for you are available in the lists of the cheatsheet. For example, check the Critic and Historian lists.'
                },
                {
                    element: '.cheatsheet',
                    intro: 'If you look at the historian list, you will see that there are strange looking words such as ${measurement} or ${year}. You can look at other lists such as Measurements, Missions or Technologies to know valid values for these fields. If a part of a question is inside brackets it means it is optional. One example question would be: "What is the most common orbit for atmospheric lidars?"'
                },
                {
                    element: '.cheatsheet',
                    intro: 'If you want to know the technology for one instrument of the experiment or the real name of an orbit along with its characteristics you just need to check the Orbits and Instruments alias lists.'
                },
                {
                    element: '#clock_div',
                    intro: 'Each stage of the experiment will last for 10 minutes. It is <i>very important</i> for us that you talk about what is going through your mind during the experiment. If you don\'t we\'ll remind you about it!'
                },
                {
                    intro: 'Remember, your objective is always the same: <b>increase the science score (make it go to the right) while keeping the cost as low as possible</b>. Whether you have Daphne available or not is randomized, so don\'t worry if you don\'t see it as soon as the experiment begins. With this being said, click on done to start the experiment!'
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
            dataset: 'EOSS_data_recalculated.csv',
            nextStage: '',
            startTime: 0,
            stageDuration: 60*1
        },
        daphne_peer: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet'
            ],
            restrictedQuestions: {
                analyst: [],
                critic: ['3000', '3005'],
                historian: []
            },
            dataset: 'EOSS_data_recalculated.csv',
            nextStage: '',
            startTime: 0,
            stageDuration: 60*1
        },
        daphne_assistant: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'FeatureApplication',
                'EOSSFilter',
                'DaphneAnswer',
                'Cheatsheet'
            ],
            restrictedQuestions: {
                analyst: ['2000', '2008', '2010'],
                critic: [],
                historian: ['4000', '4006', '4007']
            },
            dataset: 'EOSS_data_recalculated.csv',
            nextStage: '',
            startTime: 0,
            stageDuration: 60*1
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
