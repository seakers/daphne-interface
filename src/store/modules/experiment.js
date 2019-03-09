// initial state
import * as _ from "lodash-es";
import {fetchGet} from "../../scripts/fetch-helpers";
import ClimateCentric from "../../scripts/climate-centric";
import SMAP from "../../scripts/smap";
import Decadal2017Aerosols from "../../scripts/decadal";
import EOSSFilter from "../../scripts/eoss-filter";
import DecadalFilter from "../../scripts/decadal-filter";

function chooseProblem(problemName) {
    let problem = null;
    let filter = null;
    switch (problemName) {
    case 'ClimateCentric':
        problem = ClimateCentric;
        filter = EOSSFilter;
        break;
    case 'SMAP':
        problem = SMAP;
        problem.problemName = 'SMAP';
        filter = EOSSFilter;
        break;
    case 'SMAP_JPL1':
        problem = SMAP;
        problem.problemName = 'SMAP_JPL1';
        filter = EOSSFilter;
        break;
    case 'SMAP_JPL2':
        problem = SMAP;
        problem.problemName = 'SMAP_JPL2';
        filter = EOSSFilter;
        break;
    case 'Decadal2017Aerosols':
        problem = Decadal2017Aerosols;
        filter = DecadalFilter;
    }
    return {
        problem: problem,
        filter: filter
    }
}

const state = {
    inExperiment: false,
    isRecovering: false,
    experimentWebsocket: {},
    experimentStage: '',
    currentStageNum: -1,
    modalContent: ['', 'Stage1Modal', 'Stage2Modal'],
    datasetInformations: [
        { filename: 'jpl_tutorial.csv', user: false },
        { filename: 'start.csv', user: false },
        { filename: 'start.csv', user: false }
    ],
    problems: ["SMAP", "SMAP_JPL1", "SMAP_JPL2"],
    stageInformation: {
        tutorial: {
            availableFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'ActiveFeatures',
                'QuestionBar'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                analyst: ['2000', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                critic: ['3000', '3005'],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
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
                    text: `<p>Thank you for participating in this experiment! You will be using Daphne, a virtual 
assistant and design tool for earth observation satellite system design. The task you will complete in the experiment
is to explore and expand a dataset of designs for a new Soil Moisture mission. This mission will fly in about 10 years. 
The requirement is that <b>the designs have to be in a range of possible budgets from $800M to $4,000M</b>. You will use 
two different versions of Daphne, one that is more similar to traditional tradespace exploration tools, and one with 
a virtual assistant behind it. Which one you get to use first is randomized, but the problem you will be solving is not.
On the first case, the priority is to have better information on surface water, and on the second case the most relevant 
data is that related to applications.</p>
<p><b>The internal models and datasets have already been reworked for you, so you should only focus on getting the best 
designs, meaning those that maximize the science benefit with a cost between $800M and $4,000M.</b></p>`
                },
                {
                    text: `Specifically, the task consists on designing different constellations of satellites for 
Earth observation. This means you will assign a set of instruments from a predefined pool of instruments into several 
orbits and then evaluate your constellation design (e.g, the set of satellites with specific instruments assigned to 
specific orbits) to see which constellations are the best for each of the two of priorities and budget limits. A design 
that works well for one of the two problems might not work well at all for the next one, so do not copy designs from 
one stage to the next.`
                },
                {
                    text: `Again, to reiterate: for each focus (e.g, Water or Applications), you have <b>two main 
objectives</b>: <b>FIRST</b>: You need to come up with a range of constellation designs with a cost between $800M 
and $4,000M with the best science score you can come up with (later we will describe how to get those designs). 
The science score is a measure (a number that ranges from 0 to 1) of how well you are satisfying a set of requirements 
which are decided by different stakeholders. The same constellation design can have different scores if different 
stakeholders are given more prominence, which is what happens in this experiment. Then, the <b>SECOND</b> objective: 
After 20 minutes designing with either focus in mind, you will be asked to choose the best constellation design out of 
a pair of designs with the same cost, 10 times. This is done to see if you have been able to learn something. 
With this out of the way, let's learn how to actually design new satellite constellations! It's important to try out 
the functions you are being shown, as this will help you perform better during the experiment.`
                },
                {
                    attachTo: '#arch-info-display-table right',
                    text: `Each satellite constellation design is represented by a table as shown here. Each row 
represents one spacecraft in the constellation. At the left side of each row in bold we have the orbit in which 
spacecraft will fly, which is defined by various parameters, such as altitude, inclination and local sun time for those 
which are sun-synchronous. Each of the small boxes in the right part of the row represent a single instrument present 
in that spacecraft. If one orbit has no small boxes corresponding to any instrument, it means there is no spacecraft 
flying in that orbit for this constellation.`
                },
                {
                    attachTo:  '.panel.orbit-instr-info right',
                    text: `Detailed information on what these orbits and instruments are is given in the Orbits and 
Instruments Information panel. <b>You should read about them now by clicking on the elements of the dropdown list.</b>`
                },
                {
                    attachTo: '#main-plot-block bottom',
                    text: `Your first task in the experiment is, again, to come up with a range of constellation 
designs with the highest science benefit for a range of costs between $800M and $4,000M. You can see some initial 
constellation designs here, but you will learn how to create new ones in a moment.`
                },
                {
                    attachTo: '#main-plot-block bottom',
                    text: `This is the plot that shows the trade-space of the constellation designs you come up with. 
This set of constellation designs comes from a different problem, so don't worry if you see something different when 
the actual focused task begins. Each dot here is a single constellation design, and each design has an associated 
science score and a cost. The science score, just as a reminder, is a measure (ranging from 0 to 1) of how 
well you are satisfying a set of requirements which are decided by different stakeholders.`
                },
                {
                    attachTo: '#admin-panel left',
                    text: `As you hover over each dot on the scatter plot, you can see the corresponding information 
being changed in the Design Builder space. If you click on a dot, it is replaced by a cross. The cross means you have 
selected that constellation design. <b>Try selecting a design which has the highest science benefit for a certain cost 
(so the one the furthest right for any cost).</b>`
                },
                {
                    attachTo: '.design-builder right',
                    text: `You can move the instruments from one orbit to another, add new instruments, or remove them 
using drag-and-drop. After modifying the constellation design, you can evaluate it using the 
<b>"Evaluate Architecture"</b> button on the top-right side. After the evaluation is finished, a new red cross will 
appear on the scatter plot with its location determined by the new science score and cost of your constellation design. 
It is very important to evaluate the new designs you make, as otherwise they won't get saved and you won't know how 
much you improved (or how worse you got :()! <b>Try coming up with a new constellation design before going forward 
with the tutorial.</b>`
                },
                {
                    attachTo: '.design-builder right',
                    text: `You will also notice how there is a Show Details button in this window. If you click on it 
will open a new window with more information on this architecture. There you can check how Daphne computes the science 
score and the cost, so you can optimize based on that. This being said, this might be too much information to process 
adequately in the duration of the experiment, so use with caution.`
                },
                {
                    attachTo: '.data-mining left',
                    text: `While this is the basic functionality for tradespace analysis, you have more tools available 
to you int his experiment. The first of them, and the one you will have available in the more traditional Daphne, is 
Data Mining. What you can do here is select a set of points in the dataset either by drawing squares in the dataset or 
using filters, press Run Data Mining, and obtain a set of features. A feature is a set of characteristics shared by 
a group of designs. Let's see how it works step by step.`
                },
                {
                    attachTo: '#main-plot-block bottom',
                    text: `First of all, choose Drag-select in the Mouse Selection panel. This allows you to select a 
subset of points from which you want to obtain relevant features. <b>Try making a selection.</b>`
                },
                {
                    attachTo: '.data-mining right',
                    text: `With that done, ,<b>click on Run data mining</b> to see the features. They are represented 
as triangles in this plot, where two important metrics for them are represented: Coverage and Specificity. Coverage 
measures how many points in your selection are covered by this feature, while Specificity measures which percentage of 
the points with the feature are inside your selection. An ideal feature would be the one with perfect Coverage (all your 
selected points are inside it) and Specificity (no points outside your selection have this feature). To learn more about 
a feature, we have the Feature Application. <b>Before clicking on Next, click on one Feature</b>`
                },
                {
                    attachTo: '.feature-application left',
                    text: `In this window you can see how a feature is described. The tree you see is how the feature 
explains itself. Thus, if you have found a feature you want your designs to have, this window here will tell you how to 
ensure that. Now on to the last feature of the Data Mining functionality.`
                },
                {
                    attachTo: '.filter left',
                    text: `This last window is the Filters window. Instead of selecting a group of features manually in 
                    the dataset, you can use this window to select a set of designs that have something in common. You 
                    can try using any of those, as they're pretty self explanatory.`
                },
                {
                    attachTo: '#admin-panel left',
                    text: `The next feature you need to know about is how to communicate with the Virtual Assistant. 
                    Let's learn how you can ask questions.`
                },
                {
                    attachTo: '#question-bar bottom',
                    text: `To ask a question, you can write it down here, and then either click Do It! or press Enter
on your keyboard.`
                },
                {
                    attachTo: '#question-bar bottom',
                    text: `For example, you can ask what Daphne thinks about the currently design. After thinking for 
a while, Daphne will give her thoughts on the design along with some hints on how you might want to improve it. 
<b>Try writing or copying the following question into the Question Bar: "What do you think of this design?"</b> 
If you want to hear the output instead of just reading it, you can unmute Daphne by clicking on the speaker.`
                },
                {
                    attachTo: '.answers left',
                    text: `You can read all the suggestions Daphne has for you about your design in here. You can see 
there are different kinds of advice when you ask a Critic question: the Expert Critic will give advice based on a set 
of well-known facts about how spacecraft operates; the Explorer Critic will try a few changes and give you some 
suggestions on how to improve your constellation if it finds something; the Historian Critic will compare your 
constellation design to past missions and tell you if it finds any similarity; and the Analyst Critic will try to find 
out if your constellation design shares anything with the best ones you have found. There are a few more questions you 
can ask Daphne, so you should know a little more about it.`
                },
                {
                    text: `Daphne is a virtual assistant, and it can take on three different roles: Analyst, Historian 
or Critic. All three roles can answer different kinds of questions, with the Analyst focusing on telling you WHY a 
constellation design has a certain score, the Historian giving you information on past missions that have already been 
launched, and the Critic explaining HOW you can improve a constellation design with advice.`
                },
                {
                    attachTo: '#admin-panel',
                    text: `You can now try choosing a question from those available at the Available Commands lists. 
If you look at the Analyst list, you will see that there are strange looking words such as $\{analyst_stakeholder}. 
You can look at the lists in Commands Information such as Analyst Stakeholders or Historical Technologies to know valid 
values for these fields. If a part of a question is inside brackets it means it is optional. <b>One very common way to 
use the Analyst is to first ask "Why does this design have this science benefit?" and then ask "Which instruments 
improve the science score for stakeholder $\{analyst_stakeholder}?" with the stakeholder which has the lowest score. 
Another example question (which you can try!) would be: "Which orbit is the most common for ocean colour instruments?"</b>`
                },
                {
                    attachTo: '#admin-panel',
                    text: `You might have seen a blue panel appear talking about Background Searches. If you accept its 
suggestion you'll see a lot of blue points appear on your dataset. In case you have been seeing these blue points 
appear around this applies as well. On one of the conditions you will have a Background Search finding new architectures 
for you while you analyze the dataset. The designs it finds will be shown in blue to differentiate them from the rest.`
                },
                {
                    attachTo: '.active-menu right',
                    text: `You can activate or deactivate this background search here, as well as choose whether you want 
to see the new results it finds or not. You will also notice how there are two other options in this same menu.`
                },
                {
                    attachTo: '.active-menu right',
                    text: `The Diversifier will track in real time which architectures you have been adding and will 
suggest areas of the datasets that you have left unexplored in case you want to change the area you're exploring.`
                },
                {
                    attachTo: '.active-menu right',
                    text: `The Suggestions will keep track of the changes you make in the Design Builder, and will give 
you real time advice on how that design can be improved without having to Evaluate it or ask the Critic what it thinks 
about it.`
                },
                {
                    text: `Now you know every tool available to you! The experiment, just as a reminder, will have two 
stages. Apart from the different focuses, which again don't affect you in any way other than not allowing you to reuse 
constellation designs, the main difference between them will be what functions are available to you. On the one hand,
you will have the Tradespace Plot and the Data Mining capabilities, while on the other one the Background Search and 
Virtual Assistant will be available to you, as well as all of the active features.`
                },
                {
                    text: `As a final reminder, <b>each stage of the experiment will last for 20 minutes</b>. 
Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between $800M 
and $4,000M</b> and <b>2. Learn how to discern between designs with high and low science benefit with similar costs 
so you can do a test in which you choose the best out of 2 architectures with similar costs</b>. One helpful trick 
for this second task is try to find which instruments appear on which orbits for the best architectures you can find. 
<b>Whether you start with or without the Virtual Assistant is randomized</b>. You are also encouraged to take notes 
during each task, as this will be really helpful in completing the test with an outstanding performance. The first 
stage will be to design the Surface Water focused mission and the second one will be for the Applications focused 
mission, but once again, <b>this doesn't affect you in any way other than not being able to reuse designs!</b>. 
With this being said, click on done to start the experiment!`
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
            stageDuration: 60*20
        },
        daphne_traditional: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
            ],
            restrictedQuestions: {
                analyst: [],
                critic: [],
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
            stageDuration: 60*20
        },
        daphne_new: {
            availableFunctionalities: [
                'DesignBuilder',
                'DaphneAnswer',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'ActiveFeatures',
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
                analyst: ['2000', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                critic: ['3000', '3005'],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                ifeed: []
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*20
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
    }
};

// actions
const actions = {
    async startExperiment({ state, commit }) {
        // Call server to start experiment
        try {
            let response = await fetchGet(API_URL + 'experiment/start-experiment');
            if (response.ok) {
                let experimentStages = await response.json();
                // Start the experiment: set the order of the conditions after the tutorial
                commit('setNextStage', { experimentStage: 'tutorial', nextStage: experimentStages[0] });
                for (let i = 0; i < experimentStages.length - 1; ++i) {
                    commit('setNextStage', { experimentStage: experimentStages[i], nextStage: experimentStages[i+1] });
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
            let response = await fetchGet(API_URL + 'experiment/start-stage/' + nextStage);
            if (response.ok) {
                let startDateData = await response.json();
                // Start the stage: get the starting time from the server information
                console.log(startDateData);
                let startTime = startDateData.start_date + '+00:00';
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
            let response = await fetchGet(API_URL + 'experiment/finish-stage/' + currentStage);
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
            let response = await fetchGet(API_URL + 'experiment/finish-experiment');
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

    async recoverExperiment({ state, commit, rootState, dispatch }) {
        // Call server to see if there is an experiment already running
        try {
            let response = await fetchGet(API_URL + 'experiment/reload-experiment');
            if (response.ok) {
                let experimentInformation = await response.json();
                if (experimentInformation.is_running) {
                    // If experiment was already running restore the last known state
                    commit('setIsRecovering', true);
                    commit('restoreAuth', experimentInformation.experiment_data.auth);
                    // Functions inside the problem don't survive the recovery, so they need to be reloaded from scratch
                    commit('restoreProblem', experimentInformation.experiment_data.problem);
                    let problemInfo = chooseProblem(rootState.problem.problemName);
                    commit('setProblemFunctions', problemInfo.problem);
                    commit('restoreFilter', experimentInformation.experiment_data.filter);
                    commit('setFilterFunctions', problemInfo.filter);
                    commit('restoreTradespacePlot', experimentInformation.experiment_data.tradespacePlot);
                    commit('restoreDaphne', experimentInformation.experiment_data.daphne);
                    commit('restoreFunctionalityList', experimentInformation.experiment_data.functionalityList);
                    commit('restoreDataMining', experimentInformation.experiment_data.dataMining);
                    commit('restoreFeatureApplication', experimentInformation.experiment_data.featureApplication);
                    commit('restoreActive', experimentInformation.experiment_data.active);
                    commit('restoreExperiment', experimentInformation.experiment_data.experiment);
                    // Start the websockets after completing the request so the session cookie is already set
                    commit('startExperimentWebsocket');
                    // Start the Websocket
                    await dispatch('startWebsocket');
                    await dispatch('stopBackgroundTasks');
                    if (state.stageInformation[state.experimentStage].availableFunctionalities.includes('ActiveFeatures')) {
                        dispatch("startBackgroundSearch");
                    }
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
        state.experimentWebsocket = new WebSocket(WS_URL + 'experiment');
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
