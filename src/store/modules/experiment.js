// initial state
import * as _ from "lodash-es";
import {fetchGet} from "../../scripts/fetch-helpers";
import EOSS_assignment from "../../scripts/eoss_assignment";
import EOSSFilter from "../../scripts/eoss-filter";
import Decadal2017Aerosols from "../../scripts/decadal";
import DecadalFilter from "../../scripts/decadal-filter";
import {wsTools} from "../../scripts/websocket-tools";

const state = {
    inExperiment: false,
    isRecovering: false,
    isRecoveringAsync: false,
    experimentStage: '',
    currentStageNum: -1,
    modalContent: ['Stage0Modal', 'Stage1Modal', 'Stage2Modal'],
    datasetInformations: [
        { name: 'experiment_tutorial' },
        { name: 'experiment' },
        { name: 'experiment' }
    ],
    problems: ["ClimateCentric-Experiment", "ClimateCentric-Experiment", "ClimateCentric-Experiment2"],
    stageProblemName: "",
    stageDatasetName: "",
    stageOrder: [],
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
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 3,
                "engineerFrequency": 3,
                "analystFrequency": 90,
            },
            expertiseSettings: {
                "domain": false,
                "design": false,
                "daphne": false
            },
            nextStage: '',
            steps: [
                {
                    text:'Before we begin, please answer the following <a href="https://tamu.qualtrics.com/jfe/form/SV_8HaBa3B0JaMiHoW" target="_blank" rel="noopener noreferrer">survey</a>.'
                },
                {
                    text: `<p>Thank you for participating in this experiment! You will be using Daphne, an AI tool for designing Earth Observation 
                    Satellite Systems (EOSS from now on) for climate monitoring. During the experiment, you will
                    help design a space mission with multiple satellites, instruments, and orbits involved. You will consider missions ranging from 
                    small (a few hundred million $) to large (several billion $).</p>
                    <p>Your role during the experiment is that of a <b>Systems Engineer</b> analyzing the trade-offs between different design alternatives. 
                    Your job is two sided: on the one hand, you are expected to produce designs for EOSS that are as good as possible 
                    (lowest possible cost for a given science score). At the same time, and equally important, we want you to discover some 
                    insights about the main drivers of science score and cost in this problem, to inform future missions and designs. 
                    An example of a science score driver would be "Designs with L-band radars produce better science on average".</p>`
                },
                {
                    text: `<p>You will be working on two similar design problems with the help of Daphne. In both tasks, you will be 
                    considering a set of instruments (e.g., radars, lidars) and a set of orbits (e.g., SSO dawn-dusk at 600km). 
                    Different instruments are capable of measuring different climate variables (e.g., atmospheric temperature, CO2 concentration) </p>
                    <p>Daphne uses models and simulations to estimate the capabilities of different combinations of instruments 
                    and orbits (e.g., in terms of spatial resolution, accuracy, revisit time) and compares those to a set of requirements 
                    from existing databases that represent scientific/societal needs to produce a science score between 0 and 1. 
                    The more requirements are fully satisfied by the capabilities of a given design, the higher the science score. 
                    The cost of a design is calculated as a sum of the costs of building, launching and operating the instruments and 
                    satellites in that particular design. The cost of a spacecraft depends strongly on the instruments and orbit of the spacecraft. 
                    More sophisticated instruments (e.g., high power, high resolution) often require larger satellite platforms. 
                    More massive satellites are more expensive to build and launch. While these models are not perfect, they are
                     assumed good enough for these purposes, so your focus should be on trying to get the best possible architectures given
                     these models, where best means those that maximize the science/societal benefit while minimizing lifecycle cost. 
                     You also want to find good designs across the entire range of mission sizes, from smallest to largest.</p>`
                },
                {
                    text: `<p>More specifically, an EOSS design is created by assigning different sets of instruments from a 
                    predefined pool of instruments to different orbits. You can calculate the science score and cost of a new
                     design by clicking on the Evaluate button.</p>`
                },
                {
                    text: `<p>To help you with the task, Daphne comes with a set of features and skills to help you find good 
                    designs and extract some insights from the designs found so far. You will be presented with two different 
                    versions of Daphne during the experiment. The two versions have some differences in the functionality available to you. </p>`
                },
                {
                    text: `<p>Again, to reiterate: for each half of the experiment, you have <b>two main objectives</b>: 
                    <b>FIRST</b>: You need to come up with a range of constellation designs (not just one constellation) 
                    that spans a wide range of costs (e.g., from $800M to $4,000M) with the best science score you can 
                    come up with for each level of cost (later we will describe how to get those designs). Then, the 
                    <b>SECOND</b> objective: learning about the drivers of science score/cost-effectiveness in each task, 
                    e.g., looking for design features that are common among the best designs you found. We call these 
                    features that help us distinguish good from poor designs “driving features”. After 15 minutes working, 
                    you will answer a test and a survey to evaluate this second objective. The test will contain questions
                    on whether a certain feature is a driving feature, whether a design optimally trades cost and science 
                    score (aka is close to the Pareto frontier if you are familiar with the term), and also comparisons 
                    between pairs of features and pairs of designs. In case you are not familiar with the definition of a 
                    Pareto frontier, it is defined as the set of all designs with the best tradeoff between cost and science 
                    in the dataset (and therefore are the points in the lower right of the tradespace plot). You are encouraged 
                    to <b>take notes on the best driving features you find</b>. You will be asked about these notes at the end 
                    of the experiment. </p>
                    <p>With this out of the way, let's learn how to actually design new satellite constellations! It's important 
                    to try out the functions you are being shown now, as this will help you perform better during the experiment.</p>`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `First, let's do a quick tour of Daphne. This is the plot that shows the trade-space of 
                    the constellation designs you come up with. This set of designs comes from a different 
                    problem, so don't worry if you see something different when the experiment task begins. Each dot here 
                    is a single constellation design, and each design has an associated science/societal score and a cost. 
                    The science score, just as a reminder, is a measure (ranging from 0 to 1) of how well you are satisfying 
                    a set of requirements from different stakeholders representing different scientific disciplines and 
                    applications. Your first task in the experiment is, again, to come up with a range of constellation 
                    designs with the highest science benefit for a range of costs. You will learn how to create new ones in a moment.`
                },
                {
                    attachTo: {
                        element: '#arch-info-display-table',
                        on: 'right'
                    },
                    text: `Each satellite constellation design is represented by a table as shown here. Each row 
                    represents one spacecraft in the constellation. At the left side of each row in bold we have 
                    the orbit in which the spacecraft will fly, which is defined by 2 or 3 parameters: altitude 
                    (400-800km), inclination (polar, equatorial, or SSO) and for sun-synchronous orbits 
                    (SSO, a type of inclination), local time of the ascending node (Dawn-Dusk or DD, morning or AM, 
                    afternoon or PM). Each of the small boxes in the right part of the row represent a single 
                    instrument present in that spacecraft. If one orbit has no small boxes corresponding to any 
                    instrument, it means there is no spacecraft flying in that orbit for this constellation.`
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
                        element: '#admin-panel',
                        on: 'top right'
                    },
                    text: `As you hover over each dot on the scatter plot, you can see the corresponding information 
                    being changed in the Design Builder space. If you click on a dot, it is replaced by a cross. 
                    The cross indicates the currently selected design. <b>Try selecting a design which has the 
                    highest science benefit for a certain cost (so the one the furthest right for that level of cost). 
                    This point is on the Pareto front. Other examples of designs on the Pareto front include the design 
                    with the highest science score, and the design with the lowest cost. Note that if a new design is 
                    discovered, that may change whether other designs are on the Pareto front or not.</b>`
                },
                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `To modify a design, you can move the instruments from one orbit to another, add new instruments, or remove them 
                    using drag-and-drop. To remove an instrument from an orbit, drag it and drop it onto the list of available instruments.
                    After modifying a design, you can evaluate it by clicking the <b>"Evaluate Architecture"</b> button on the 
                    top-right side. After the evaluation is finished, the red cross will move to the location in the scatter plot determined 
                    by the science score and cost of your new design. It is very important to evaluate the new 
                    designs you make, as otherwise they won't get saved and you won't know how much you improved or worsened the design! 
                    <b>Try coming up with a new constellation design before going forward with the tutorial.</b> You should see a notification
                    as soon as it is evaluated`
                },
                {
                    attachTo: {
                        element: '.design-builder',
                        on: 'right'
                    },
                    text: `You will also notice how there is a Details button in this window. If you click on it 
                    will open a new window with more information on this architecture. There you can see a detailed breakdown of the 
                    science score and the lifecycle cost. The breakdown of the science score can help you understand which 
                    requirements are not being satisfied by a design and why - i.e., what is/are the missing attribute(s) in the 
                    capabilities of the architecture (e.g., insufficient spatial resolution). The breakdown of the cost can also 
                    help you understand what the cost drivers are for the design (e.g., high spacecraft mass). Note that this might 
                    be too much information to process adequately in the duration of the experiment, so we would advise to use it 
                    sparingly (perhaps a few times at the beginning and then only when needed).`
                },
                {
                    attachTo: {
                        element: '.main',
                        on: 'right'
                    },
                    text: `What we have covered so far is the basic functionality for tradespace analysis, that will be available 
                    to you in all versions of Daphne. In addition to this, Daphne has more functionalities available to you in 
                    this experiment. This menu shows all the available ones.`
                },
                {
                    attachTo: {
                        element: '#functionalities-list',
                        on: 'top'
                    },
                    text: `All of Daphne's functions will appear in this area. You have already seen the Design Builder, and we'll
                    go through the rest in a second. You can rearrange the functions to suit your workflow by dragging and dropping 
                    them on the area you want them to be. Some of them can also be made bigger or smaller with the icons on top, 
                    and all of them can be closed to free up space if you don't need them. To open an unopened (grayed out) 
                    functionality, you can always click on its name. The functionalities that are available to you may change in the two tasks.`
                },
                {
                    attachTo: {
                        element: '.data-mining',
                        on: 'left'
                    },
                    text: `Moving on to the functions, let's talk about Data Mining. The Data Mining functionality 
                    allows you to select a set of points in the dataset either by drawing squares in the dataset or using filters. Then, 
                    by pressing Run Data Mining, you obtain a set of driving "features". A feature is a set of characteristics shared by a 
                    group of designs, such as having an L-band radar and an L-band radiometer in the same orbit. Let's see how it works step by step.`                    
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `First of all, choose Drag-select in the Mouse Selection panel. This allows you to select a 
                    subset of designs from which you want to obtain the common “Driving” features. <b>Try making a selection.</b>`                    
                },
                {
                    attachTo: {
                        element: '.data-mining',
                        on: 'right'
                    },
                    text: `With that done, <b>click on Run data mining</b> to see the driving features. They are represented 
                    as triangles in this plot, where two important metrics for them are represented: Coverage and Specificity. Coverage 
                    measures the fraction of points from your selection that are covered by this feature, while Specificity measures the fraction of 
                    points with the feature that are inside your selection. An ideal feature would be the one with perfect Coverage (all your 
                    selected points have the feature) and Specificity (no points outside your selection have this feature), 
                    but there is typically a trade-off between coverage and specificity so no real feature will satisfy that. To visualize a given
                    feature, we use the Feature Application window. <b>Before clicking on Next, click on one Feature</b>`
                },
                {
                    attachTo: {
                        element: '.feature-application',
                        on: 'left'
                    },
                    text: `In this window you can see the description of the feature in terms of instruments and orbits. 
                    The tree you see represents the conditions that are satisfied by designs that share this feature
                    (e.g., instrument i not assigned to orbit j, and orbit k is empty). Now on to the last feature of 
                    the Data Mining functionality.`                   
                },
                {
                    attachTo: {
                        element: '.filter',
                        on: 'left'
                    },
                    text: `This last window is the Filters window. This window allows you to visualize where designs 
                    that share a certain feature defined by the user (e.g., designs where a certain instrument is absent) 
                    lie in the scatter plot. You can try using a filter now, they're pretty self-explanatory.`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'right'
                    },
                    text: `If you want to run data mining on a different selection, click on Cancel
                    All Selections and the Data Mining plot will reset to its default state, allowing you to rerun the 
                    algorithm with a different selection of points.`
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
                    text: `In this experiment, you can only ask Daphne what she thinks about the current design. 
After thinking for a few seconds, Daphne will give her thoughts on the design along with some suggestions on how to improve it. 
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
changes based on what the best constellation designs in the current dataset have in common. <b>Take Daphne's advice with 
caution - as you would with any peer's advice.</b> While it is likely to help you, it may in some cases not help you 
achieve your current goal. "What do you think of this design" is just one question Daphne can answer, and we will go through 
some others in the next steps.`
                },
                {
                    text: `Generally speaking, Daphne can answer WHY questions (e.g., about why a constellation design 
has a certain score), WHAT questions (e.g., information on past and planned Earth observing mission), and HOW questions 
(e.g., suggestions on HOW you can improve a constellation design).`
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
                        on: 'left'
                    },
                    text: `You might have already seen some messages from Daphne that appear without you asking a question.
Daphne (and more specifically the Analyst role) will explicitely give you features that drive performance and bring designs 
closer to the Pareto front. When you are designing a new constellation you might also see Daphne give suggestions related to 
that. Finally, you might also see Daphne recommending new spots to explore in the tradespace after evaluating a few architectures.`
                },
                {
                    attachTo: {
                        element: '#main-plot-block',
                        on: 'bottom'
                    },
                    text: `You might also have already seen some blue dots appearing here. There is a search algorithm that is running 
behind the scenes, helping you find better designs. While all Daphne versions have this, a different version of this algorithm will run 
if you with the Hypothesis Tester to help with the testing of hypotheses. All the designs found by the background search will be 
marked in navy blue to differentiate them from the ones that you find.`
                },
                {
                    attachTo: {
                        element: '.hypothesis-tester',
                        on: 'left'
                    },
                    text: `Last but not least, the Hypothesis Tester. This feature helps you test simple hypothesis on whether a feature 
                    is driving the performance of designs both in science, cost, and distance to the Pareto front. The way it works is 
                    simple: you select a type of hypothesis, fill the blanks, and press Test. This will modify the Background search to 
                    look for designs with this feature close to the Pareto front, and a set of metrics will be computed for you about the 
                    feature. These metrics include statistical tests performed on all designs that have the feature vs not, as well 
                    as coverage and specificity, similar to the Data Mining module.`
                },
                {
                    attachTo: {
                        element: '.active-menu',
                        on: 'left'
                    },
                    text: `If everything is green here, you have nothing to worry about. If anything is yellow or red, please let me (Antoni)
                    know immediately, and I'll try to sort it out before you begin the experiment to ensure a smooth ride. Do not press any of the 
                    reconnect/restart links unless I tell you to. If I'm not available at all, feel free to press them at your own risk. These are
                    meant as manual overrides to things that should (and mostly do) work by themselves. Again <b>if all is green you are fine, if 
                    something is not, contact me immediately!</b> If I'm not there in person, you will have my contact information.`
                },
                {
                    text: `Now you know every tool available to you! The experiment, just as a reminder, will have two 
stages. The main difference between them will be what functions are available to you, and taht will depend on your levels of expertise. In each of 
the tasks, you will get assigned either a baseline condition or a special Daphne catered to your expertise.`
                },
                {
                    text: `As a final reminder, <b>each stage of the experiment will last for 15 minutes</b>. 
Remember, you have two objectives: <b>1. Find a range of designs with good science scores with a cost between $800M 
and $4,000M</b> and <b>2. Learn what features are driving the performance of the designs for metrics such as cost, performance,
and distance to the Pareto front.</b>. For example, you may try to find which instrument-orbits pairings appear most often 
in the best architectures you can find. You will be automatically evaluated for objective 1 and you will answer a test and survey for objective 2.
<b>The Daphne versions you get are completely randomized</b>. You are also <b>HIGHLY encouraged</b> to take notes during each task, preferrably on
a text editor so it's easy to copy and paste later. <b>You will be asked about them in the surveys and tests.</b> With all this being said, before 
starting the experiment, you will answer a knowledge test to assess your expertise in different fields related to the experiment. The answers you give 
determine what condition you get, and you will be tested on these after the experiment as well. You are encouraged to copy the questions and use Daphne 
to find all the answers you can!`
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
        daphne_total_novice: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions',
                'HypothesisTester',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                engineer: ['2000', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4006', '4007', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 3,
                "engineerFrequency": 3,
                "analystFrequency": 90,
            },
            expertiseSettings: {
                "domain": false,
                "design": false,
                "daphne": false
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_expert_designer: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions',
                'HypothesisTester',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                engineer: ['2000', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4006', '4007', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 3,
                "engineerFrequency": 3,
                "analystFrequency": 90,
            },
            expertiseSettings: {
                "domain": false,
                "design": true,
                "daphne": false
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_expert_designer_daphne: {
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
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 3,
                "engineerFrequency": 3,
                "analystFrequency": 90,
            },
            expertiseSettings: {
                "domain": false,
                "design": true,
                "daphne": true
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_aerospace_engineer: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions',
                'HypothesisTester',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                engineer: ['2000', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4006', '4007', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 6,
                "engineerFrequency": 6,
                "analystFrequency": 180,
            },
            expertiseSettings: {
                "domain": true,
                "design": false,
                "daphne": false
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_aerospace_systems_engineer: {
            availableFunctionalities: [
                'DesignBuilder',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation',
                'BackgroundSearch',
                'Diversifier',
                'LiveSuggestions',
                'HypothesisTester',
            ],
            shownFunctionalities: [
                'DesignBuilder',
                'HypothesisTester',
                'OrbitInstrInfo',
                'AvailableCommands',
                'CommandsInformation'
            ],
            restrictedQuestions: {
                engineer: ['2000', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4006', '4007', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 6,
                "engineerFrequency": 6,
                "analystFrequency": 180,
            },
            expertiseSettings: {
                "domain": true,
                "design": true,
                "daphne": false
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
        daphne_total_expert: {
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
                engineer: ['2000', '2001', '2002', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                analyst: ['1000'],
                explorer: [],
                historian: ['4000', '4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
                critic: ['3000', '3005'],
            },
            activeSettings: {
                "historianFrequency": 6,
                "engineerFrequency": 6,
                "analystFrequency": 180,
            },
            expertiseSettings: {
                "domain": true,
                "design": true,
                "daphne": true
            },
            nextStage: '',
            startTime: 0,
            stageDuration: 60*15
        },
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
                commit('setStageOrder', experimentStages[0]);
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
    setStageOrder(state, stageOrder) {
        state.stageOrder = stageOrder;
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
