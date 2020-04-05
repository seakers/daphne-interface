// initial state
import * as _ from "lodash-es";
import {fetchGet} from "../../scripts/fetch-helpers";
import ClimateCentric from "../../scripts/climate-centric";
import SMAP from "../../scripts/smap";
import Decadal2017Aerosols from "../../scripts/decadal";
import EOSSFilter from "../../scripts/eoss-filter";
import DecadalFilter from "../../scripts/decadal-filter";
import store from '../../store';
import {wsTools} from "../../scripts/websocket-tools";

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
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'Details',
                'BackgroundSearch',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
            ],
            restrictedQuestions: {
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: [],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: ['3000', '3005'],
            },
            nextStage: '',
            steps: [
                {
                    text: `<p>Thank you for participating in this experiment! You will be using Daphne, a virtual
assistant and design tool for earth observation satellite system design. The experiment task
is to explore and expand a dataset of designs for a new soil moisture mission. You will consider missions ranging from
small (a few hundred millions) to large (several billion $).</p>
<p>You will solve this task twice, and each time you will use a different "version" of Daphne.
One version will have a "Teacher" functionality (aimed at fostering learning about the design problem) and one will not.
Which one you get to use first is randomized. In both tasks, you will be given a set of
satellite instruments (e.g., BIOMASS) and a set of satellite orbits (e.g.,LEO-600-polar-NA).
However, the emphasis is different in the two tasks. In the first task, the priority is to study surface water processes
, whereas in the second task the emphasis is on societal benefits and applications
(such as heat stress and drought)</p>
<p>We have models that estimate the science benefit of different combinations of
instruments and orbits (e.g., calculation of revisit time of a constellation and comparison to a requirement from the
World Meteorological Organization). <b>Your focus</b> should be on trying to get the best possible architectures given these models, where best means those that
maximize the science/societal benefit while minimizing lifecycle cost.</p>`
                },
                {
                    text: `Specifically, the task consists creating different mission designs for
Earth observation. This means you will be assigning different sets of instruments (from a predefined pool)
to different orbits and then evaluating your design to see how well it performs for each of the two tasks. Note that a
design that performs well for one of the two problems will most likely not for the other problem, so simply
 copying designs from one stage to the next will not work.`
                },
                {
                    text: `Again, to reiterate: for each task, you have <b>two main
objectives</b>: <b>FIRST</b>: You need to come up with a set of constellation designs (not just one constellation)
that spans a wide range of costs (e.g., from $800M to $4,000M) with the best science score you can come up with
(later we will describe how to get those designs). <b>SECOND</b> After each 15 minute task, you will do a short 21 question test that has 4
sections (SUS survey, Design Prediction, Feature Prediction, and Sensitivity Prediction). We are trying to find out how much you learned about the design
problem from the tool, so keep this in mind! With this out of the way, let's learn
how to create new mission designs! <b>It's important to try out the functions you are being shown now,
as this will help you perform better during the experiment.</b>`
                },

                {
                    attachTo: {
                        element: '#arch-info-display-table',
                        on: 'right'
                    },
                    text: `Each mission design is represented by a table as shown here. Each row
represents one spacecraft in the design. At the left side of each row in bold we have the orbit in which
spacecraft will fly. Each of the small boxes on the right part of the row represent a
single instrument that spacecraft has onboard. If one orbit has no instruments, it means
there is no spacecraft flying in that orbit for this design.`
                },
                {
                    attachTo: {
                        element: '.panel.orbit-instr-info',
                        on: 'right'
                    },
                    text: `Detailed information about these orbits and instruments can be found here in the Orbits and
Instruments Information panel. <b>You should read about them now by clicking on the elements of the dropdown list.</b>`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `Remember, each task in the experiment is to come up with a wide range of mission
designs that have the highest possible science score for a range of costs. To make things specific, we have set up lower and upper
cost bounds at $800M and $4,000M. You can see some initial mission designs here. You will be able to build off of these initial designs!`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `This plot that shows all the designs you come up with.
This set of designs will change for each of the two tasks, so don't worry if you see something different when
the tasks begins. Each dot represents single design, and each design has an associated
science score and a cost. Remember, the science score is a measure (ranging from 0 to 1) of how
well a design satisfies the requirements of the mission. <b>The higher the science score, the better!</b>`
                },
                {
                    attachTo: {
                        element: '#admin-panel',
                        on: 'top right'
                    },
                    text: `Try hovering over a dot on the design plot. You can see the corresponding information
being changed in the Design Builder window. If you click on a dot, it is replaced by a cross. The cross means you have
selected that design. <b>Try selecting a design which has the highest science benefit for a certain cost
(so the one the furthest right for any cost).</b>`
                },
                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `Once you have selected a design, you can edit that design in the Design Builder window.
You can add or remove instruments from any orbit by dragging and dropping. After modifying a design, you can evaluate it by clicking the
<b>"Evaluate Architecture"</b> button in this window. After the evaluation is finished, a new red cross will
appear on the scatter plot with its location determined by the new science score and cost of your design!
It is very important to evaluate new designs you make! Otherwise, they won't get saved and you won't know how
your changes effected the design's score! Remember, create as many designs as you can! <b>Try coming up with some new designs before continuing
with the tutorial.</b>`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `Additionally, there will be a "Background Search" service running while you are completing either task.
                    This search will try to find optimal designs.. If it finds one, it will be plotted as a blue dot (you might notice some already plotted).
                    You can build off of these (blue dot) designs just as you can for the initial (grey dot) designs!`
                },
                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `You will also notice how there is a Details button in this window. If you click on it,
                    a new tab with more information on this architecture will open. This tab contains a detailed breakdown of the science score and the lifecycle cost.
 Note that this might be too much information to process adequately in the duration of the experiment, so we highly
 advise you only use it if you are very experienced.`
                },

                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'left'
                    },
                    text: `While this is the basic functionality for trade-space analysis, you have more tools available
to you in this experiment. Lets move on to learning about the Chat Window.`
                },
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `Here we have Daphne's Chat Window. This window will serve two purposes in this experiment: 1) Allow you to <b>ask</b> Daphne
                    useful questions, 2) Allow Daphne to <b>teach</b> you about the current design problem. Lets try asking Daphne a question first. Continue to the next step.`,
                },
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `One useful question Daphne can answer is what she thinks about the current design selected in the design plot. After some thinking,
Daphne will give her opinion and make some suggestions.
Try copying the following question into the Question Bar: <b>What do you think of this design?</b>`
                },
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `Daphne will communicate to you through this chat window. You can see
there is advice from different roles: the <b>Expert</b> will suggest design modifications based on a knowledge-base;
the <b>Explorer</b> will suggest design modifications by search the local design area; the
<b>Historian</b> will compare and contrast your design to past missions; and the <b>Analyst</b> will suggest
changes based on what the best designs in the current dataset have in common. Take Daphne's advice with
caution - as you would with any peer's advice. While it is likely to help you, it may in some cases not help you
achieve your current goal. "What do you think of this design" is just one question Daphne can answer, but there are a
few more. Try clearing the Chat Window when you are done by hitting the Clear button where you send daphne messages.`
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

                {
                    attachTo: {
                        element: '.chat-container',
                    },
                    text: `Now, lets learn how Daphne will try to teach you about the current design problem. Daphne has an on-board <b>Teacher</b>
                    that will teach you about four areas of the design problem: Sensitivities, Design Space, Objective Space, and Features.
                    By now, you should see some new messages in the chat window. These messages are from the Daphne Teacher! In the next few steps, you will learn about all the messages
                    Daphne Teacher will send you.`,
                    when: {
                        show: function() {
                            store.dispatch('requestTeacherTutorialMessages');
                        }
                    }
                },
                {
                    attachTo: {
                        element: '#sensitivity-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `The first type of message the Daphne Teacher will send you is about design decision sensitivities. Design decision sensitivity is a measure of how much objective value variance
                     adding or removing a design decision causes. This message contains a bar graph showing the most sensitive design decisions for your current task! You can use the dropdown to view
                     sensitivities for either the cost or science objective.`,
                },
                {
                    attachTo: {
                        element: '#sensitivity-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `You can also interact with the bar graph! If you hover over a bar in the bar graph you will get a description about that design decision's sensitivity. If you click on a bar,
                    you will add/remove that design decision from the current design loaded in the Design Builder window. Try clicking on a few bars in the graph to see how it changes the current design in the
                    Design Build window.`,
                },
                {
                    attachTo: {
                        element: '#sensitivity-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `<b>TIP:</b> A good strategy is to: 1) select the rightmost point in the design plot for a specific cost 2) add or remove some sensitive design decisions using this plot
                    3) evaluate the design in the design builder by hitting the <b>Evaluate Architecture</b> button in the Design Builder.`,
                },
                {
                    attachTo: {
                        element: '#sensitivity-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `Remember sensitivity information could show on the exam! So it might be a good idea to write it down any useful plot information`,
                },
                {
                    attachTo: {
                        element: '#design-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `The next message the Daphne Teacher might send is about the Design Space. The Design Space is an area containing all the possible
                    designs for this problem. This message has a bar graph showing the least used design decisions in the current design space.`,
                },
                {
                    attachTo: {
                        element: '#design-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `You can hover over each bar in this graph go get more information about that specific design decision. You can also click on each bar to add that design decision
                    to the current design in the Design Builder (as long as that design decision isn't already added). Try adding a few of these to the current design in the Design Builder`,
                },
                {
                    attachTo: {
                        element: '#design-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `<b>TIP:</b> A good strategy is to: 1) select the rightmost point in the design plot for a specific cost 2) add or remove some uncommon design decisions using this plot
                    3) evaluate the design in the design builder by hitting the <b>Evaluate Architecture</b> button in the Design Builder. Lets continue on to the next message type`,
                },
                {
                    attachTo: {
                        element: '#question-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `The Daphne Teacher can also ask you questions to try to gauge how much you know about the design task at hand. Here, Daphne is asking a Design Space question.
                    These two architecture will be very similar in cost, but will produce a different science value. Click on whichever choice you think might have a higher science value then hit next.`,
                },
                {
                    attachTo: {
                        element: '#question-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `Did you get it right? If you did, the answer you selected will be highlighted in green. If not, then in red! Don't try to create these
                     designs in the Design Builder, because these designs are already somewhere in the design plot. For now, just use your intuition. Remember, questions like these will be on the exam,
                     so don't be afraid to guess right now if you don't know and learn from the answer!`,
                },
                {
                    attachTo: {
                        element: '#question-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `There will be two other types of Daphne Teacher questions (sensitivities and features) that we won't go over in this tutorial. However, you will see them during the experiment, so be
                    on the lookout for them`,
                },
                {
                    attachTo: {
                        element: '#features-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `The next Teacher message type is about Design Space Features. A "feature" is nothing more than a set of one or more design decisions (ex. orbit SSO-800-SSO-AM doesn't contain instrument BIOMASS).
                    When a group of designs has a common feature, this feature might explain why that group of designs scored how they did (in cost and science).
                    Continue to learn more about this message`,
                },
                {
                    attachTo: {
                        element: '#features-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `Here, the Daphne Teacher has provided you a feature that was found in the Pareto Front. If you hover over the bordered feature in the message, the designs that contain this feature
                    will be highlighted in the design plot! It can be useful to add this feature to the current design in the Design Builder and then evaluate to see how the feature
                    changes the performance of that design.`,
                },
                {
                    attachTo: {
                        element: '#objective-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `The last message type Daphne Teacher can send is about the objective space of the task. The Objective Space is nothing more than the total area spanned on the
                    design plot. Lets learn more about this message`,
                },
                {
                    attachTo: {
                        element: '#objective-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `This message shows a plot containing the objective space and all the designs in the Pareto Front. It also shows an area in the Pareto Front that is unexplored.
                    It is beneficial to create designs that land in this region, as this increases your score on the design task! You can hit the Load Suggestion button
                    to load the closest design to this region into the Design Builder window. This loaded design will be replaced with a red cross in the plot. From here you can
                    try to add or remove instruments then evaluate to try to get a design in the unexplored region! Try hitting Load Suggestion`,
                },
                {
                    attachTo: {
                        element: '#objective-space-teacher-message',
                    },
                    scrollTo: {
                        behavior: 'smooth',
                        block: 'center'
                    },
                    text: `Finally, any architectures you evaluate will appear in this plot as a blue dot. Try to get these blue dots as close to the unexplored region as possible!`,
                },
                {
                    attachTo: {
                        element: '.chat-container',
                    },
                    text: `Remember, the Daphne Teacher is proactive and will only send messages every so often. When it does send messages, try to make use of them!`,
                },


                {
                    text: `Now you know every tool available to you! Remember, the experiment will have two stages (aka tasks).
                    Apart from the different tasks, the only difference between them will be what Daphne functions
are available to you. In one task, you will have the "Teacher" functionality and in the other you will not! `
                },
                {
                    text: `As a final reminder, each stage of the experiment will last for <b>15 minutes</b>.
Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between $800M
and $4,000M</b> and <b>2. Try to learn any useful design patterns to discern between designs with HIGH and LOW science benefit
with similar costs, so you can do the short tests afterwards</b>. For example, you may try to find which
instrument-orbit pairings appear most often in the best architectures you can find. <b>Whether you start with or without the "Teacher" functionality is randomized</b>.
  You are also highly encouraged to take notes during each task, as this will definitely be helpful to do well on the test.
  The first stage will be to design the <b>surface water processes</b> focused mission and the second one will be for the <b>societal benefits / applications</b>
  focused mission. And once again, <b>trying to reuse good designs from the first task for the second task will likely
  not work!</b>. With all this being said, click on done to start the experiment!`,
                    when: {
                        show: function() {
                            store.dispatch('clearHistory');
                        }
                    }
                },
            ],
        },
        // no_daphne: {
        //     availableFunctionalities: [
        //         'DesignBuilder',
        //         'DataMining',
        //         'FeatureApplication',
        //         'EOSSFilter'
        //     ],
        //     shownFunctionalities: [
        //         'DesignBuilder',
        //         'DataMining',
        //         'FeatureApplication',
        //         'EOSSFilter'
        //     ],
        //     restrictedQuestions: null,
        //     nextStage: '',
        //     startTime: 0,
        //     stageDuration: 60*20
        // },
        daphne_assistant: { // Teacher
            availableFunctionalities: [
                'DesignBuilder',
                // 'Teacher',    // Users will now only be able to use the proactive teacher
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'Details',
                'BackgroundSearch',
                'ProactiveTeacher',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
            ],
            restrictedQuestions: null,
            nextStage: '',
            startTime: 0,
            stageDuration: 60*20
        },
        daphne_peer: { // Non-Teacher
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'Details',
                'BackgroundSearch'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
            ],
            restrictedQuestions: null,
            nextStage: '',
            startTime: 0,
            stageDuration: 60*20
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
            console.log("---------------> Start Experiment!");
            let response = await fetchGet(API_URL + 'experiment/start-experiment');
            if (response.ok) {
                let experimentStages = await response.json();
                console.log(experimentStages);
                // Start the experiment: set the order of the conditions after the tutorial
                commit('setNextStage', { experimentStage: 'tutorial', nextStage: experimentStages[0] });
                for (let i = 0; i < experimentStages.length - 1; ++i) {
                    commit('setNextStage', { experimentStage: experimentStages[i], nextStage: experimentStages[i+1] });
                }
                // Start the websockets after completing the request so the session cookie is already set
                await wsTools.experimentWsConnect();
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
            console.log("---------------> Start Stage!");
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
            console.log("--------> Turning Proactive Teacher Off");
            store.dispatch('turnProactiveTeacherOff');
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
                    await wsTools.experimentWsConnect();
                    // Start the Websocket
                    await wsTools.wsConnect(this);
                    await dispatch('stopBackgroundTasks');
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
};

export default {
    state,
    getters,
    actions,
    mutations
}
