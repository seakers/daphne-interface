// initial state
import * as _ from "lodash-es";
import {fetchGet} from "../../scripts/fetch-helpers";
import ClimateCentric from "../../scripts/climate-centric";
import SMAP from "../../scripts/smap";
import Decadal2017Aerosols from "../../scripts/decadal";
import EOSSFilter from "../../scripts/eoss-filter";
import DecadalFilter from "../../scripts/decadal-filter";
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
        { name: 'experiment_tutorial' },
        { name: 'experiment' },
        { name: 'experiment' }
    ],
    problems: ["SMAP", "SMAP_W", "SMAP_C"],
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
                'LiveSuggestions'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
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
assistant and design tool for Earth Observation Satellite Systems (EOSS from now on) design. During this experiment, you will
help shape a new soil moisture measuring mission with multiple satellites and sensors involved. You will consider missions ranging from 
small (a few hundred millions) to large (several billion $).</p> 
<p>Your role during the experiment is that of an <b>Engineering Designer</b>. In order to shape the mission design, You will solve two similar tasks related to this problem using two different versions of Daphne. One of Daphne's versions
is the currently released one, with some features disabled to help you focus on what we want you to try. The other version
includes a new function named "Hypothesis Tester", where you act more as a peer to your work, by suggesting changes in real time and giving its
 opinions on designs, while the other will be more of an assistant to you, by answering questions on how everything you 
 see on screen is computed and answering specific questions you might have. Which one you get to 
use first is randomized, but the problem you will be solving is not. In both tasks, you will be considering a set of 
instruments developed at JPL (e.g., an L band radar) and a set of orbits (e.g., SSO dawn-dusk at 600km). 
However, the emphasis is different in the two tasks. In the first task, the priority is to study surface water processes 
(runoff, evapotranspiration, etc), whereas in the second case the emphasis is on societal benefits and applications 
such as heat stress, drought, flood monitoring and wild fires prediction.</p>
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
assigned to specific orbits) to see which constellations are the best for each of the two tasks. Note that a 
constellation design that works well for one of the two problems might not work well at all for the next one, so simply
 copying designs from one stage to the next is unlikely to work well.`
                },
                {
                    text: `Again, to reiterate: for each focus (e.g, Water or Applications), you have <b>two main 
objectives</b>: <b>FIRST</b>: You need to come up with a range of constellation designs (not just one constellation) 
that spans a wide range of costs (e.g., from $800M to $4,000M) with the best science score you can come up with 
(later we will describe how to get those designs). The science score is a measure (a number that ranges from 0 to 1) 
of how well you are satisfying a set of requirements which are decided by different stakeholders. The same constellation 
design can have different scores if different stakeholders are given more prominence, which is what happens in this 
experiment. Then, the <b>SECOND</b> objective: After 15 minutes working on either task, you will do two short tests 
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
cost bounds at $800M and $4,000M. You can see some initial constellation designs here, but you will learn how to create 
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
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `You will also notice how there is a Details button in this window. If you click on it 
will open a new window with more information on this architecture. This is one of the features only available on the
 Assistant version of Daphne. There you can see a detailed breakdown of the science score and the lifecycle cost. 
 Note that this might be too much information to process adequately in the duration of the experiment, so we would 
 advice to use with caution (perhaps a few times at the beginning and then only when needed).`
                },
                {
                    attachTo: {
                        element: '.data-mining',
                        on: 'left'
                    },
                    text: `While this is the basic functionality for tradespace analysis, you have more tools available 
to you in this experiment. The first of them, and the one you will have available in the Assistant Daphne, is 
Data Mining. The Data Mining feature allows you to select a set of points in the dataset either by drawing squares in 
the dataset or using filters. Then, by pressing Run Data Mining, you obtain a set of "features". A feature is a set of 
characteristics shared by a group of designs, such as having an L-band radar and an L-band radiometer in the same orbit. 
Let's see how it works step by step.`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `First of all, choose Drag-select in the Mouse Selection panel. This allows you to select a 
subset of points from which you want to obtain relevant features. <b>Try making a selection.</b>`
                },
                {
                    attachTo: {
                        element: '.data-mining',
                        on: 'right'
                    },
                    text: `With that done, ,<b>click on Run data mining</b> to see the features. They are represented 
as triangles in this plot, where two important metrics for them are represented: Coverage and Specificity. Coverage 
measures how many points in your selection are covered by this feature, while Specificity measures which percentage of 
the points with the feature are inside your selection. An ideal feature would be the one with perfect Coverage (all your 
selected points are inside it) and Specificity (no points outside your selection have this feature). To learn more about 
a feature, we have the Feature Application. <b>Before clicking on Next, click on one Feature</b>`
                },
                {
                    attachTo: {
                        element: '.feature-application',
                        on: 'left'
                    },
                    text: `In this window you can see how a feature is described. The tree you see is how the feature 
explains itself. Thus, if you have found a feature you want your designs to have, this window here will tell you how to 
ensure that. Now on to the last feature of the Data Mining functionality.`
                },
                {
                    attachTo: {
                        element: '.filter',
                        on: 'left'
                    },
                    text: `This last window is the Filters window. Instead of selecting a group of features manually in 
                    the dataset, you can use this window to select a set of designs that have something in common. You 
                    can try using any of those, as they're pretty self explanatory.`
                },
                {
                    attachTo: {
                        element: '#admin-panel'
                    },
                    text: `The next feature you need to know about is how to communicate with the Virtual Assistant. 
                    Let's learn how you can ask questions.`
                },
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `To ask a question, you can write it down here, and then either click Send or press Enter
on your keyboard.`
                },
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `For example, you can ask Daphne what she thinks about the current design. After thinking for 
a while, Daphne will give her thoughts on the design along with some suggestions on how to improve it. 
<b>Try writing or copying the following question into the Question Bar: "What do you think of this design?"</b> 
If you want to hear the output instead of just reading it, you can unmute Daphne by clicking on the speaker.`
                },
                {
                    attachTo: {
                        element: '.chat-container'
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
(e.g., suggestions on HOW you can improve a constellation design). The first and second types will be the answered by 
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
                {
                    attachTo: {
                        element: '.chat-container'
                    },
                    text: `You might have seen some messages from Daphne that appear without you asking a question.
One of them will talk about a Background Search. This is a search algorithm that is running behind the scenes, trying to
 help you find better designs. If you accept its suggestion you may see a few blue points appear on your dataset. The 
 designs it finds will be shown in blue to differentiate them from the ones already there that you found. This feature 
 will always be active for you.`
                },
                {
                    attachTo: {
                        element: '.active-menu',
                        on: 'right'
                    },
                    text: `You can activate or deactivate this background search here, as well as choose whether you want 
to see the new results it finds or not. You will also notice how there are two other options in this same menu.`
                },
                {
                    attachTo: {
                        element: '.active-menu',
                        on: 'right'
                    },
                    text: `The Diversifier will track in real time which architectures you have been adding and will 
suggest areas of the datasets that you have left unexplored in case you want to change the area you're exploring. This 
will only be available for the Daphne Peer version.`
                },
                {
                    attachTo: {
                        element: '.active-menu',
                        on: 'right'
                    },
                    text: `The Suggestions will keep track of the changes you make in the Design Builder, and will give 
you real time advice on how that design can be improved without having to Evaluate it or ask the Critic what it thinks 
about it. Again, this will only be available on the Daphne Peer version.`
                },
                {
                    text: `Now you know every tool available to you! The experiment, just as a reminder, will have two 
stages. Apart from the different tasks with different focus, the main difference between them will be what functions 
are available to you. In one task, you will have Assistant Daphne with you, with the Details panel, the Data Mining 
functions, and the Engineer, Analyst, and Historian questions. The other one, Peer Daphne, will have the Critic 
available to you, as well as the the Diversifier and the Suggestions. The Tradespace Plot, the Design Builder, and the 
Background Search will always be available.`
                },
                {
                    text: `As a final reminder, <b>each stage of the experiment will last for 15 minutes</b>. 
Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between $800M 
and $4,000M</b> and <b>2. Try to learn any patterns useful to discern between designs with high and low science benefit 
with similar costs, so you can do the short tests afterwards</b>. For example, you may try to find which 
instrument-orbits pairings appear most often in the best architectures you can find. The Data Mining capability should
 be helpful for this. <b>Whether you start with Assistant Daphne or Peer Daphne is randomized</b>.
  You are also encouraged to take notes during each task, as this will probably be helpful to do well in the test. 
  The first stage will be to design the Surface Water focused mission and the second one will be for the Applications 
  focused mission. And once again, <b>trying to reuse good designs from the first task for the second task will likely 
  not work!</b>. With all this being said, click on done to start the experiment!`
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
        daphne_assistant: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'Details',
                'BackgroundSearch'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
            ],
            restrictedQuestions: {
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: [],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: [],
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_peer: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions'
            ],
            shownFunctionalities: [
                'DesignBuilder',
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
            stageDuration: 60*15
        },
        daphne_classic: {
            availableFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'Details',
                'BackgroundSearch'
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'DataMining',
                'EOSSFilter',
                'FeatureApplication',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
            ],
            restrictedQuestions: {
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: [],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: [],
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_hypothesis: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions'
            ],
            shownFunctionalities: [
                'DesignBuilder',
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
            stageDuration: 60*15
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
                let experimentStages = await response.json();
                // Start the experiment: set the order of the conditions after the tutorial
                commit('setNextStage', { experimentStage: 'tutorial', nextStage: experimentStages[0] });
                for (let i = 0; i < experimentStages.length - 1; ++i) {
                    commit('setNextStage', { experimentStage: experimentStages[i], nextStage: experimentStages[i+1] });
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
                    commit('restoreHypothesis', experimentInformation.experiment_data.hypothesis);
                    commit('restoreExperiment', experimentInformation.experiment_data.experiment);
                    // Start the websockets after completing the request so the session cookie is already set
                    await wsTools.experimentWsConnect();
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
