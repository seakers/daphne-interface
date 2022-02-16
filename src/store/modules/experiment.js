// initial state
import * as _ from "lodash-es";
import {fetchGet} from "../../scripts/fetch-helpers";
import EOSS_assignment from "../../scripts/eoss_assignment";
import EOSSFilter from "../../scripts/eoss-filter";
import {wsTools} from "../../scripts/websocket-tools";

const state = {
    inExperiment: false,
    isRecovering: false,
    isRecoveringAsync: false,
    experimentStage: '',
    experimentCondition: '',
    currentStageNum: -1,
    modalContent: {
        "reflection": ['', 'ReflectionModal', 'Stage2Modal'],
        "incubation": ['', 'IncubationModal', 'Stage2Modal'],
        "control": ['', 'Stage2Modal'],
    },
    datasetInformations: [
        { name: 'experiment_tutorial' },
        { name: 'experiment' },
        { name: 'experiment' }
    ],
    problems: ["SMAP", "SMAP", "SMAP"],
    stageProblemName: "",
    stageDatasetName: "",
    stageInformation: {
        tutorial: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'Details',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions',
                'HypothesisTester',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'HypothesisTester',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                engineer: [],
                analyst: [],
                explorer: [],
                historian: [],
                critic: ['3000', '3005'],
                engineer_instruments: [],
                engineer_instrument_parameters: [],
                engineer_measurements: [],
                engineer_stakeholders: [],
                engineer_objectives: [],
                engineer_subobjectives: [],
                historian_technologies: [],
                historian_measurements: [],
                historian_missions: [],
                historian_space_agencies: []
            },
            nextStage: '',
            steps: [
                {
                    text: `<p>Thank you for participating in this experiment! You will be using Daphne, a virtual
assistant and design tool for earth observation satellite system design. The task you will complete in the experiment
is to explore and expand a dataset of designs for a new [climate centric] mission. You will consider missions ranging from
small (a few hundred millions) to large (several billion $).</p>
<p>You will solve a task related to this problem using Daphne. You will be considering a set of
instruments developed at JPL (e.g., an L band radar) and a set of orbits (e.g., SSO dawn-dusk at 600km).
</p>
<p><b>We have models and datasets available to estimate the science/societal benefit of different combinations of
instruments and orbits (e.g., calculation of revisit time of a constellation and comparison to a requirement from the
World Meteorological Organization). While these models are not perfect, they are assumed good enough for these purposes,
so the focus should be on trying to get the best possible architectures given these models, where best means those that
maximize the science/societal benefit while minimizing lifecycle cost.</b></p>`
                },
                {
                    text: `Specifically, the task consists on designing different constellations of satellites for
Earth observation. This means you will be assigning different sets of instruments from a predefined pool of instruments
to different orbits and then evaluating your constellation design (e.g, the set of satellites with specific instruments
assigned to specific orbits) to see which constellations are the best for the task.`
                },
                {
                    text: `Again, to reiterate: you have <b>two main
objectives</b>: <b>FIRST</b>: You need to come up with a range of constellation designs (not just one constellation)
that spans a wide range of costs (e.g., from $800M to $4,000M) with the best science score you can come up with
(later we will describe how to get those designs). The science score is a measure (a number that ranges from 0 to 1)
of how well you are satisfying a set of requirements which are decided by different stakeholders. The same constellation
design can have different scores if different stakeholders are given more prominence, which is what happens in this
experiment. Then, the <b>SECOND</b> objective: After 20 minutes working on the task, you will do two short tests
consisting of 12 questions each asking you either say whether a design is on the set of best designs or not, or to
choose the best constellation design out of a pair of designs with the same cost. With this out of the way, let's learn
how to actually design new satellite constellations! It's important to try out the functions you are being shown now,
as this will help you perform better during the experiment.`
                },
                {
                    attachTo: {
                        element: '#arch-info-display-table',
                        on: 'right'
                    },
                    text: `Each satellite constellation design is represented by a table as shown here. Each row
represents one spacecraft in the constellation. At the left side of each row in bold we have the orbit in which
spacecraft will fly, which is defined by various parameters, such as altitude, inclination and local time of the
ascending node for those which are sun-synchronous. Each of the small boxes in the right part of the row represent a
single instrument present in that spacecraft. If one orbit has no small boxes corresponding to any instrument, it means
there is no spacecraft flying in that orbit for this constellation.`
                },
                {
                    attachTo: {
                        element: '.panel.orbit-instr-info',
                        on: 'right'
                    },
                    text: `Detailed information on what these orbits and instruments are is given in the Orbits and
Instruments Information panel. <b>You should read about them now by clicking on the elements of the dropdown list.</b>`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `Your first task in the experiment is, again, to come up with a range of constellation
designs with the highest science benefit for a range of costs. To make things specific, we have set up lower and upper
cost bounds at [$800M] and [$4,000M]. You can see some initial constellation designs here, but you will learn how to create
new ones in a moment.`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `This is the plot that shows the trade-space of the constellation designs you come up with.
This set of constellation designs comes from a different problem, so don't worry if you see something different when
the actual focused task begins. Each dot here is a single constellation design, and each design has an associated
science/societal score and a cost. The science score, just as a reminder, is a measure (ranging from 0 to 1) of how
well you are satisfying a set of requirements which are decided by different stakeholders.`
                },
                {
                    attachTo: {
                        element: '#admin-panel',
                        on: 'top right'
                    },
                    text: `As you hover over each dot on the scatter plot, you can see the corresponding information
being changed in the Design Builder space. If you click on a dot, it is replaced by a cross. The cross means you have
selected that constellation design. <b>Try selecting a design which has the highest science benefit for a certain cost
(so the one the furthest right for any cost).</b>`
                },
                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `You can move the instruments from one orbit to another, add new instruments, or remove them
using drag-and-drop. After modifying the constellation design, you can evaluate it using the
<b>"Evaluate Architecture"</b> button on the top-right side. After the evaluation is finished, a new red cross will
appear on the scatter plot with its location determined by the new science score and cost of your constellation design.
It is very important to evaluate the new designs you make, as otherwise they won't get saved and you won't know how
much you improved or worsened the design! <b>Try coming up with a new constellation design before going forward
with the tutorial.</b>`
                },

                {
                    attachTo: {
                        element: '#admin-panel',
                        on: 'left'
                    },
                    text: `The next feature you need to know about is how to communicate with the Virtual Assistant.
                    Let's learn how you can ask questions.`
                },
                {
                    attachTo: {
                        element: '.chat-container',
                        on: 'left'
                    },
                    text: `To ask a question, you can write it down here, and then either click Send or press Enter
on your keyboard.`
                },
                {
                    attachTo: {
                        element: '.chat-container',
                        on: 'left'
                    },
                    text: `For example, you can ask Daphne what she thinks about the current design. After thinking for
a while, Daphne will give her thoughts on the design along with some suggestions on how to improve it.
<b>Try writing or copying the following question into the Question Bar: "What do you think of this design?"</b>
If you want to hear the output instead of just reading it, you can unmute Daphne by clicking on the speaker.`
                },
                {
                    attachTo: {
                        element: '.chat-container',
                        on: 'left'
                    },
                    text: `You can read all the suggestions Daphne has for you about your design in here. You can see
there is advice from different roles: the Expert Critic will give advice based on a knowledge base with simple rules of
thumb about how to design Earth observing systems (e.g., don't put a visible light instrument in a dawn-dusk orbit);
the Explorer Critic will use brute force search around the current design to see if it finds a way to improve it; the
Historian Critic will compare your constellation design to past missions and tell you if it finds any similarity (which
is not inherently good or bad, but rather a trade-off between innovation and risk); and the Analyst Critic will suggest
changes based on what the best constellation designs in the current dataset have in common. Take Daphne's advice with
caution - as you would with any peer's advice. While it is likely to help you, it may in some cases not help you
achieve your current goal. "What do you think of this design" is just one question Daphne can answer, but there are a
few more. It is worth noting this will only be available on the Daphne Peer version.`
                },
                {
                    text: `Generally speaking, Daphne can answer WHY questions (e.g., about why a constellation design
has a certain score), WHAT questions (e.g., information on past and planned Earth observing mission), and HOW questions
(e.g., suggestions on HOW you can improve a constellation design). The first and second types will be answered by
 the Assistant Daphne, while the last one will be answered by Daphne Peer.`
                },
                {
                    attachTo: {
                        element: 'body'
                    },
                    text: `You can now try choosing a question from those available at the Available Commands lists.
There you will see the questions listed by role (Engineer, Analyst, Explorer, Historian, Critic). If you look at the
Engineer list, you will see that there are terms between curly brackets such as $\{engineer_stakeholder}. You can look
at the lists in Commands Information such as Stakeholders (Engineer) or Technologies (Historian) to know valid values
for these fields. If a part of a question is inside square brackets it means it is optional. <b>For example, one way to
 use the Engineer is to first ask "Why does this design have this science benefit?" and then ask "Which instruments
 improve the science score for stakeholder $\{engineer_stakeholder}?" with a stakeholder that has a low score. Another
 example question (which you can try!) would be: "Which orbit is most common for radar altimeters?"</b>`
                },
//                 {
//                     text: `Generally speaking, Daphne can answer WHY questions (e.g., about why a constellation design
// has a certain score), WHAT questions (e.g., information on past and planned Earth observing mission), and HOW questions
// (e.g., suggestions on HOW you can improve a constellation design). The first and second types will be the answered by
//  the Assistant Daphne, while the last one will be answered by Daphne Peer.`
//                 },
//                 {
//                     attachTo: {
//                         element: 'body'
//                     },
//                     text: `You can now try choosing a question from those available at the Available Commands lists.
// There you will see the questions listed by role (Engineer, Analyst, Explorer, Historian, Critic). If you look at the
// Engineer list, you will see that there are terms between curly brackets such as $\{engineer_stakeholder}. You can look
// at the lists in Commands Information such as Stakeholders (Engineer) or Technologies (Historian) to know valid values
// for these fields. If a part of a question is inside square brackets it means it is optional. <b>For example, one way to
//  use the Engineer is to first ask "Why does this design have this science benefit?" and then ask "Which instruments
//  improve the science score for stakeholder $\{engineer_stakeholder}?" with a stakeholder that has a low score. Another
//  example question (which you can try!) would be: "Which orbit is most common for radar altimeters?"</b>`
//                 },

//                 {
//                     attachTo: {
//                         element: '.active-menu',
//                         on: 'right'
//                     },
//                     text: `You can activate or deactivate this background search here, as well as choose whether you want
// to see the new results it finds or not. You will also notice how there are two other options in this same menu.`
//                 },

//                 {
//                     attachTo: {
//                         element: '.active-menu',
//                         on: 'right'
//                     },
//                     text: `The Diversifier will track in real time which architectures you have been adding and will
// suggest areas of the datasets that you have left unexplored in case you want to change the area you're exploring. This
// will only be available for the Daphne Peer version.`
//                 },
//                 {
//                     attachTo: {
//                         element: '.active-menu',
//                         on: 'right'
//                     },
//                     text: `The Suggestions will keep track of the changes you make in the Design Builder, and will give
// you real time advice on how that design can be improved without having to Evaluate it or ask the Critic what it thinks
// about it. Again, this will only be available on the Daphne Peer version.`
//                 },


                {
                    text: `Now you know every tool available to you! As a final reminder, <b>the experiment will last for 20 minutes</b>.
                    Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between [$800M]
and [$4,000M]</b> and <b>2. Try to learn any patterns useful to discern between designs with high and low science benefit
with similar costs, so you can do the short tests afterwards</b>. For example, you may try to find which
instrument-orbits pairings appear most often in the best architectures you can find.
  You are also encouraged to take notes during each task, as this will probably be helpful to do well in the test.
  The task will be to design climate centric focused mission. With all this being said, click on done to start the experiment!`
                }
            ],
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
        daphne_control: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'Details',
                'BackgroundSearch',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
            ],
            restrictedQuestions: {
                engineer: [],
                analyst: [],
                explorer: [],
                historian: [],
                critic: ['3000', '3005'],
                engineer_instruments: [],
                engineer_instrument_parameters: [],
                engineer_measurements: [],
                engineer_stakeholders: [],
                engineer_objectives: [],
                engineer_subobjectives: [],
                historian_technologies: [],
                historian_measurements: [],
                historian_missions: [],
                historian_space_agencies: []
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*20
        },
        daphne_refinc: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'Details',
                'BackgroundSearch',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
            ],
            restrictedQuestions: {
                engineer: [],
                analyst: [],
                explorer: [],
                historian: [],
                critic: ['3000', '3005'],
                engineer_instruments: [],
                engineer_instrument_parameters: [],
                engineer_measurements: [],
                engineer_stakeholders: [],
                engineer_objectives: [],
                engineer_subobjectives: [],
                historian_technologies: [],
                historian_measurements: [],
                historian_missions: [],
                historian_space_agencies: []
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*10
        }
    }
};

// getters
const getters = {
};

// actions
const actions = {
    async startExperiment({ state, commit }) {
        // Call server to start experiment
        try {
            let response = await fetchGet(API_URL + 'experiment/start-experiment');
            if (response.ok) {
                let experimentInformation = await response.json();
                commit('setExperimentCondition', experimentInformation["condition"]);
                // Start the experiment: set the order of the conditions after the tutorial
                commit('setNextStage', { experimentStage: 'tutorial', nextStage: experimentInformation["stages"][0] });
                for (let i = 0; i < experimentInformation["stages"].length - 1; ++i) {
                    commit('setNextStage', { experimentStage: experimentInformation["stages"][i], nextStage: experimentInformation["stages"][i+1] });
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
                    commit('setIsRecoveringAsync', true);
                    commit('restoreAuth', experimentInformation.experiment_data.auth);
                    // Functions inside the problem don't survive the recovery, so they need to be reloaded from scratch
                    commit('restoreProblem', experimentInformation.experiment_data.problem);
                    let problemInfo = {
                        problem: EOSS_assignment,
                        filter: EOSSFilter
                    };
                    commit('setProblemFunctions', problemInfo.problem);
                    commit('restoreFilter', experimentInformation.experiment_data.filter);
                    commit('setFilterFunctions', problemInfo.filter);
                    commit("setVassarRebuildStatus", "");
                    wsTools.websocket.send(JSON.stringify({
                        msg_type: "rebuild_vassar",
                        group_id: rootState.problem.groupId,
                        problem_id: rootState.problem.problemId,
                        dataset_id: rootState.problem.datasetId
                    }));
                    commit('restoreTradespacePlot', experimentInformation.experiment_data.tradespacePlot);
                    commit('restoreDaphne', experimentInformation.experiment_data.daphne);
                    commit('restoreFunctionalityList', experimentInformation.experiment_data.functionalityList);
                    commit('restoreDataMining', experimentInformation.experiment_data.dataMining);
                    commit('restoreFeatureApplication', experimentInformation.experiment_data.featureApplication);
                    commit('restoreActive', experimentInformation.experiment_data.active);
                    commit('restoreHypothesis', experimentInformation.experiment_data.hypothesis);
                    commit('restoreExperiment', experimentInformation.experiment_data.experiment);
                    // Start the websockets after completing the request so the session cookie is already set
                    await wsTools.experimentWsConnect();
                    if (state.stageInformation[state.experimentStage].availableFunctionalities.includes('BackgroundSearch')) {
                        dispatch("startBackgroundSearch");
                    }
                    dispatch('setProblemParameters');
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
    setExperimentCondition(state, experimentCondition) {
        state.experimentCondition = experimentCondition;
    },
    setExperimentStage(state, experimentStage) {
        state.experimentStage = experimentStage;
        state.currentStageNum++;
    },
    setStageProblemName(state, stageProblemName) {
        state.stageProblemName = stageProblemName;
    },
    setStageDatasetName(state, stageDatasetName) {
        state.stageDatasetName = stageDatasetName;
    },
    setNextStage(state, { experimentStage, nextStage }) {
        state.stageInformation[experimentStage].nextStage = nextStage;
    },
    setStartTime(state, { experimentStage, startTime }) {
        state.stageInformation[experimentStage].startTime = startTime;
    },
    restoreExperiment(state, recoveredState) {
        Object.keys(recoveredState).forEach((key) => {
            if (key !== 'isRecovering' && key !== 'isRecoveringAsync') {
                state[key] = recoveredState[key];
            }
        });
    },
    setIsRecovering(state, isRecovering) {
        state.isRecovering = isRecovering;
    },
    setIsRecoveringAsync(state, isRecoveringAsync) {
        state.isRecoveringAsync = isRecoveringAsync;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
