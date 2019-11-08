// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";
import store from "../../store"




// ---------------------------
// --> State
// selectedSubject: '' | 'Design Space' | 'Objective Space' | 'Features' | 'Sensitivities'
// ---------------------------
const state = {

    // -----------------------------------
    // ---------- GENERAL ----------------
    // -----------------------------------
    selectedSubject: '',
    orbitList: [],
    instrumentList: [],
    plotData: [],

    current_teacher_question: 'Question not set',
    current_question_type: '', //--> Either design or sensitivity
    teacher_choice_one: 'Choice 1 not set',
    teacher_choice_two: 'Choice 2 not set',
    teacher_choice_one_revealed: 'Reveal 1 not set',
    teacher_choice_two_revealed: 'Reveal 2 not set',
    correct_choice: 1,


    //--> Items that will be sent to the backend for proactive teacher
    lastEvaluatedArchitecture: {},
    selectedArchData: {},
    updatedArchData: {},


    // -----------------------------------
    // ---------- SENSITIVITIES ----------
    // -----------------------------------
    all_sensitivities: {},

    s1_cost_mins_full: [],
    s2_cost_mins_full: [],

    s1_science_mins_full: [],
    s2_science_mins_full: [],

    s1_cost_mins: [],
    s2_cost_mins: [],

    s1_science_mins: [],
    s2_science_mins: [],

    s1_cost_plot: [],
    s1_cost_plot_layout: {},

    s1_science_plot: [],
    s1_science_plot_layout: {},

    s2_cost_plot: [],
    s2_cost_plot_layout: {},

    s2_science_plot: [],
    s2_science_plot_layout: {},

    secondOrderOrbit: '',
    secondOrderInstrument: '',

    sensitivityOrder: 'First Order',
    numSensitivitiesToShow: '10',
    sensitivitiesObjective: 'Science',

    areFirstOrderSensitivitiesComputed: false,
    areSecondOrderSensitivitiesComputed: false,




    // ----------------------------------
    // ---------- DESIGN SPACE ----------
    // ----------------------------------
    all_design_space_info: {},

    all_level_one_design_space_info: [],
    all_level_two_design_space_info: [],

    level_one_design_space_info: [],
    level_two_design_space_info: [],

    level_one_design_space_plot: [],
    level_two_design_space_plot: [],

    level_one_design_space_plot_layout: {},
    level_two_design_space_plot_layout: {},

    design_space_plot_width: 560,
    design_space_plot_height: 450,

    designSpaceOrbit: '',
    designSpaceInstrument: '',

    designSpaceLevel: 'Level One',
    numDesignSpaceToShow: '7',



    // -------------------------------------
    // ---------- OBJECTIVE SPACE ----------
    // -------------------------------------
    all_objective_space_info: {},

    objectiveSpaceObjective: 'Science',

    objective_space_plot: [],

    objective_space_plot_layout: {},

    objectiveSpaceParetoRanking: '3',

    objectiveGroupSelected: false,

    objectiveSpacePlotWidth: 560,
    objectiveSpacePlotHeight: 450,


    objectiveGroupData: {},
    objectiveGroupName: 'None Selected',
    objectiveGroupNumDesigns: 0,
    objectiveGroupCostBounds: [],
    objectiveGroupScienceBounds: [],

    //--> For chat window plot
    objective_chat_plot_info: [],









};
const initialState = _.cloneDeep(state);



// ---------------------------
// Getters
// ---------------------------
const getters = {

    get_objective_chat_plot_info(state){
        return state.objective_chat_plot_info;
    },

    get_current_question_type(state){
        return state.current_question_type;
    },

    get_teacher_choice_one_revealed(state){
        return state.teacher_choice_one_revealed;
    },
    get_teacher_choice_two_revealed(state){
        return state.teacher_choice_two_revealed;
    },
    get_correct_choice(state){
        return state.correct_choice;
    },
    get_current_teacher_question(state){
        return state.current_teacher_question;
    },
    get_teacher_choice_one(state){
        return state.teacher_choice_one;
    },
    get_teacher_choice_two(state){
        return state.teacher_choice_two;
    },


    //--> Getters for SensitivityPlot.vue
    get_s1_cost_mins(state){
        return state.s1_cost_mins;
    },
    get_s1_science_mins(state){
        return state.s1_science_mins;
    },


    get_s1_cost_plot(state){
        return state.s1_cost_plot;
    },
    get_s1_cost_plot_layout(state){
        return state.s1_cost_plot_layout;
    },


    get_level_one_design_space_plot(state) {
        return state.level_one_design_space_plot;
    },
    get_level_one_design_space_plot_layout(state){
        return state.level_one_design_space_plot_layout;
    },

    get_all_level_one_design_space_info(state){
        return state.all_level_one_design_space_info;
    },


    get_orbit_list(state){
        return state.orbitList;
    },
    get_instrument_list(state){
        return state.instrumentList;
    },




};


// ---------------------------
// Actions
// ---------------------------
const actions = {

    async computeOrbitList({ commit }){
        //--> Get Problem Orbits
        let orbit_loop_break = false;
        let orbit_loop_counter = 0;
        let orbit_name = '';
        let orbit_names = [];
        while(orbit_loop_break === false){
            orbit_name = store.state.problem.index2ActualName(orbit_loop_counter,"orbit");
            if(typeof(orbit_name) === 'string'){
                orbit_names.push(orbit_name);
                orbit_loop_counter = orbit_loop_counter + 1;
            }
            else{
                orbit_loop_break = true;
                break;
            }
        }
        commit('setOrbitList', orbit_names);
    },
    async computeInstrumentList({ commit }){
        //--> Get Problem Instruments
        let instrument_loop_break = false;
        let instrument_loop_counter = 0;
        let instrument_name = '';
        let instrument_names = [];
        while(instrument_loop_break === false){
            instrument_name = store.state.problem.index2ActualName(instrument_loop_counter,"instrument");
            if(typeof(instrument_name) === 'string'){
                instrument_names.push(instrument_name)
                instrument_loop_counter = instrument_loop_counter + 1;
            }
            else{
                instrument_loop_break = true;
                break;
            }
        }
        commit('setInstrumentList', instrument_names);
    },


    //--> When the user changes the 'Subject' dropdown a new subject will be taught in the teacher panel
    async getSubjectInformation({ commit, dispatch }) {
        console.log(state.selectedSubject)
        console.log("In teacher-agent.js --> getSubjectInformation");
        commit('setObjectiveGroupSelected', false);


        //--> Call Post Request Functions
        if (state.selectedSubject === 'Design Space'){
            dispatch('getDesignSpaceInformation');
        }
        else if (state.selectedSubject === 'Objective Space'){
            dispatch('getObjectiveSpaceInformation');
        }
        else if (state.selectedSubject === 'Features'){
            dispatch('getFeaturesInformation');
        }
        else if (state.selectedSubject === 'Sensitivities'){
            dispatch('getSensitivitiesInformation');
        }

    },

    //--> Calls by getSubjectInformation
    async getFeaturesInformation({ commit }) {
        console.log("In teacher-agent.js --> getFeaturesInformation");

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-features', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let subjectInformation = await dataResponse.json();
        }

    },

    async getSensitivitiesInformation({ commit, rootState }) {
        console.log("In teacher-agent.js --> getSensitivitiesInformation");

        //--> Get Problem Orbits
        let orbit_loop_break = false;
        let orbit_loop_counter = 0;
        let orbit_name = '';
        let orbit_names = [];
        while(orbit_loop_break === false){
            orbit_name = store.state.problem.index2ActualName(orbit_loop_counter,"orbit");
            if(typeof(orbit_name) === 'string'){
                orbit_names.push(orbit_name);
                orbit_loop_counter = orbit_loop_counter + 1;
            }
            else{
                orbit_loop_break = true;
                break;
            }
        }
        commit('setOrbitList', orbit_names);

        //--> Get Problem Instruments
        let instrument_loop_break = false;
        let instrument_loop_counter = 0;
        let instrument_name = '';
        let instrument_names = [];
        while(instrument_loop_break === false){
            instrument_name = store.state.problem.index2ActualName(instrument_loop_counter,"instrument");
            if(typeof(instrument_name) === 'string'){
                instrument_names.push(instrument_name)
                instrument_loop_counter = instrument_loop_counter + 1;
            }
            else{
                instrument_loop_break = true;
                break;
            }
        }
        commit('setInstrumentList', instrument_names);

        //--> Verify Orbits / Instruments
        console.log(orbit_names);
        console.log(instrument_names);

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('orbits', JSON.stringify(orbit_names));
        reqData.append('instruments', JSON.stringify(instrument_names));

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-sensitivities', reqData);


        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let sensitivities = await dataResponse.json();
            console.log(sensitivities);
            commit('setSensitivities', sensitivities);
            commit('computeSecondOrderSensitivities');
            commit('setFirstOrderSensitivityPlot');
        }

    },

    async getDesignSpaceInformation({ commit, rootState }) {
        console.log("In teacher-agent.js --> getDesignSpaceInformation");

        //--> Get Problem Orbits
        let orbit_loop_break = false;
        let orbit_loop_counter = 0;
        let orbit_name = '';
        let orbit_names = [];
        while(orbit_loop_break === false){
            orbit_name = store.state.problem.index2ActualName(orbit_loop_counter,"orbit");
            if(typeof(orbit_name) === 'string'){
                orbit_names.push(orbit_name)
                orbit_loop_counter = orbit_loop_counter + 1;
            }
            else{
                orbit_loop_break = true;
                break;
            }
        }
        commit('setOrbitList', orbit_names);

        //--> Get Problem Instruments
        let instrument_loop_break = false;
        let instrument_loop_counter = 0;
        let instrument_name = '';
        let instrument_names = [];
        while(instrument_loop_break === false){
            instrument_name = store.state.problem.index2ActualName(instrument_loop_counter,"instrument");
            if(typeof(instrument_name) === 'string'){
                instrument_names.push(instrument_name)
                instrument_loop_counter = instrument_loop_counter + 1;
            }
            else{
                instrument_loop_break = true;
                break;
            }
        }
        commit('setInstrumentList', instrument_names);

        //--> Verify Orbits / Instruments
        console.log(orbit_names);
        console.log(instrument_names);

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('orbits', JSON.stringify(orbit_names));
        reqData.append('instruments', JSON.stringify(instrument_names));

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-design-space', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let designSpaceInformation = await dataResponse.json();
            console.log(designSpaceInformation);
            commit('setDesignSpaceInformation', designSpaceInformation);
            commit('setLevelOneDesignSpacePlot');
        }

    },

    async getObjectiveSpaceInformation({ commit, rootState }) {
        console.log("In teacher-agent.js --> getObjectiveSpaceInformation");

        //--> Get Problem Orbits
        let orbit_loop_break = false;
        let orbit_loop_counter = 0;
        let orbit_name = '';
        let orbit_names = [];
        while(orbit_loop_break === false){
            orbit_name = store.state.problem.index2ActualName(orbit_loop_counter,"orbit");
            if(typeof(orbit_name) === 'string'){
                orbit_names.push(orbit_name)
                orbit_loop_counter = orbit_loop_counter + 1;
            }
            else{
                orbit_loop_break = true;
                break;
            }
        }
        commit('setOrbitList', orbit_names);

        //--> Get Problem Instruments
        let instrument_loop_break = false;
        let instrument_loop_counter = 0;
        let instrument_name = '';
        let instrument_names = [];
        while(instrument_loop_break === false){
            instrument_name = store.state.problem.index2ActualName(instrument_loop_counter,"instrument");
            if(typeof(instrument_name) === 'string'){
                instrument_names.push(instrument_name)
                instrument_loop_counter = instrument_loop_counter + 1;
            }
            else{
                instrument_loop_break = true;
                break;
            }
        }
        commit('setInstrumentList', instrument_names);

        //--> Verify Orbits / Instruments
        console.log(orbit_names);
        console.log(instrument_names);

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('orbits', JSON.stringify(orbit_names));
        reqData.append('instruments', JSON.stringify(instrument_names));
        reqData.append('plotData', JSON.stringify(state.plotData));

        //--> Receive Response
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-objective-space', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let objectiveSpaceInformationString = await dataResponse.json();
            let objectiveSpaceInformation = JSON.parse(objectiveSpaceInformationString);
            console.log(objectiveSpaceInformation);
            commit('setObjectiveSpaceInformation', objectiveSpaceInformation);
            commit('setObjectiveSpacePlot');
        }

    },


    //--> To turn proactive teacher on or off
    async turnProactiveTeacherOn({ commit, rootState }) {

        //--> Get Problem Orbits
        let orbit_names = [];
        let orbit_loop_break = false;
        let orbit_loop_counter = 0;
        let orbit_name = '';
        while(orbit_loop_break === false){
            orbit_name = store.state.problem.index2ActualName(orbit_loop_counter,"orbit");
            if(typeof(orbit_name) === 'string'){
                orbit_names.push(orbit_name)
                orbit_loop_counter = orbit_loop_counter + 1;
            }
            else{
                orbit_loop_break = true;
                break;
            }
        }
        commit('setOrbitList', orbit_names);

        //--> Get Problem Instruments
        let instrument_names = [];
        let instrument_loop_break = false;
        let instrument_loop_counter = 0;
        let instrument_name = '';
        while(instrument_loop_break === false){
            instrument_name = store.state.problem.index2ActualName(instrument_loop_counter,"instrument");
            if(typeof(instrument_name) === 'string'){
                instrument_names.push(instrument_name)
                instrument_loop_counter = instrument_loop_counter + 1;
            }
            else{
                instrument_loop_break = true;
                break;
            }
        }
        commit('setInstrumentList', instrument_names);

        //--> Request Data
        let reqData = new FormData();
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('orbits', JSON.stringify(orbit_names));
        reqData.append('instruments', JSON.stringify(instrument_names));
        reqData.append('proactiveMode', 'enabled');
        reqData.append('plotData', JSON.stringify(state.plotData));

        //--> Receive Response
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/set-proactive-mode', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let jsonResponse = await dataResponse.json();
            console.log(jsonResponse);
        }
    },
    async turnProactiveTeacherOff({ commit, rootState }) {

        //--> Request Data
        let reqData = new FormData();
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('proactiveMode', 'disabled');

        //--> Receive Response
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/set-proactive-mode', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let jsonResponse = await dataResponse.json();
            console.log(jsonResponse);
        }
    },









    //--> We will pass the following in the post request
    //--> The group name being grabbed
    //--> The architectures in the group to be mated
    //--> Information in: state.objectiveGroupData
    async actionObjectiveGroupRequest({ state, commit, rootState }, groupSelected) {

        //--> Get the architectures in the group selected
        let groupData = state.objectiveGroupData[groupSelected];

        //--> Set the name of the group selected
        commit('setObjectiveGroupName', groupSelected);

        //--> Set the number of designs in the group
        commit('setObjectiveGroupNumDesigns', groupData.length);


        //--> Create our request
        let reqData = new FormData();
        reqData.append('groupData', JSON.stringify(groupData));
        reqData.append('problem', rootState.problem.problemName);

        //--> Receive Response
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-objective-group-information', reqData);





    },


    //--> Called when the orbit / instrument are set for sensitivity analysis
    actionComputeSecondOrderSensitivities({ commit }) {
        commit('computeSecondOrderSensitivities');
    },

    //--> Called when the orbit / instrument are set for design space analysis
    actionComputeSecondLevelDesignSpace({ commit }) {
        commit('computeSecondLevelDesignSpace');
        commit('setLevelTwoDesignSpacePlot');
    },




    //--> This function is called when the user has an architecture evaluated and gets results
    async recordEvaluatedArchitecture({ commit }, evaluatedArchData) {
        commit('setLastEvaluatedArchitecture', evaluatedArchData);
    },

    async recordSelectedArchitecture({ commit }, selectedArchData) {
        commit('setSelectedArchitecture', selectedArchData);
    },

    async recordArchitectureUpdate({ commit }, updatedArchData) {
        commit('setUpdatedArchitecture', updatedArchData);
    },

    //--> This will tell Django to clear the TeacherContextDatabase for this user
    async clearTeacherUserContext() {
        //--> Request Data
        let reqData = new FormData();
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/clear-teacher-user-data', reqData);
        if (dataResponse.ok) {
            console.log("Teacher Context Database Cleared");
        }
    },
};


// ---------------------------
// Mutations
// ---------------------------
const mutations = {
    // -----------------------------
    // ---------- GENERAL ----------
    // -----------------------------
    set_current_question_type(state, current_question_type){
        state.current_question_type = current_question_type; //--> Either design or sensitivity
    },

    set_teacher_choice_one(state, teacher_choice_one){
        state.teacher_choice_one = teacher_choice_one;
    },
    set_teacher_choice_two(state, teacher_choice_two){
        state.teacher_choice_two = teacher_choice_two;
    },
    set_teacher_choice_one_revealed(state, teacher_choice_one_revealed){
        state.teacher_choice_one_revealed = teacher_choice_one_revealed;
    },
    set_teacher_choice_two_revealed(state, teacher_choice_two_revealed){
        state.teacher_choice_two_revealed = teacher_choice_two_revealed;
    },
    set_correct_choice(state, correct_choice){
        state.correct_choice = correct_choice;
    },
    set_current_teacher_question(state, current_teacher_question){
        state.current_teacher_question = current_teacher_question;
    },

    set_objective_chat_plot_info(state, objective_chat_plot_info){
        state.objective_chat_plot_info = objective_chat_plot_info;
    },


    setSubject(state, selectedSubject) {
        state.selectedSubject = selectedSubject;
    },

    setPlotData(state, plotData) {
        state.plotData = plotData;
    },

    //--> Teacher Agent hooks for proactive teacher to receive data
    setLastEvaluatedArchitecture(state, lastEvaluatedArchitecture) {
        state.lastEvaluatedArchitecture = lastEvaluatedArchitecture;
    },
    setSelectedArchitecture(state, selectedArchData) {
        state.selectedArchData = selectedArchData;
    },
    setUpdatedArchitecture(state, updatedArchData) {
        state.updatedArchData = updatedArchData;
        console.log(state.updatedArchData);
    },



    // -------------------------------------
    // ---------- OBJECTIVE SPACE ----------
    // -------------------------------------
    setObjectiveSpaceInformation(state, objectiveSpaceInformation) {
        state.all_objective_space_info = objectiveSpaceInformation;
    },

    setObjectiveSpaceObjective(state, objectiveSpaceObjective) {
        state.objectiveSpaceObjective = objectiveSpaceObjective;
    },

    setObjectiveSpaceParetoRanking(state, objectiveSpaceParetoRanking) {
        state.objectiveSpaceParetoRanking = objectiveSpaceParetoRanking;
    },

    setObjectiveGroupSelected(state, objectiveGroupSelected) {
        state.objectiveGroupSelected = objectiveGroupSelected;
    },

    setObjectiveGroupName(state, objectiveGroupName){
        state.objectiveGroupName = objectiveGroupName;
    },

    setObjectiveGroupCostBounds(state, objectiveGroupCostBounds) {
        state.objectiveGroupCostBounds = objectiveGroupCostBounds;
    },

    setObjectiveGroupScienceBounds(state, objectiveGroupScienceBounds) {
        state.objectiveGroupScienceBounds = objectiveGroupScienceBounds;
    },

    setObjectiveGroupNumDesigns(state, objectiveGroupNumDesigns) {
        state.objectiveGroupNumDesigns = objectiveGroupNumDesigns;
    },

    setObjectiveSpacePlotWidth(state, objectiveSpacePlotWidth){
        state.objectiveSpacePlotWidth = objectiveSpacePlotWidth;
    },

    setObjectiveSpacePlotHeight(state, objectiveSpacePlotHeight){
        state.objectiveSpacePlotHeight = objectiveSpacePlotHeight;
    },

    setObjectiveSpacePlot(state) {
        let objective_data = {};
        if(state.objectiveSpaceObjective === "Science") {
            objective_data = state.all_objective_space_info['0'];
        }
        else {
            objective_data = state.all_objective_space_info['1'];
        }

        let group_data = objective_data[state.objectiveSpaceParetoRanking];

        let groups = [];
        for(var x = 0; x < group_data.length; x++) {
            if(group_data[x].length === 0) {
                continue;
            }
            groups.push(group_data[x]);
        }
        console.log(groups);

        //--> Reset the objective group data
        state.objectiveGroupData = {};

        //--> Create the plot data
        let plot_colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#7F00FF', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
        let plot_data = [];
        let shapes = [];
        for(var y = 0; y < groups.length; y++) {     //--> Iterate over each group
            let arches = groups[y];                  //--> List of architectrues - get data
            let group_name = "Group " + y.toString();
            state.objectiveGroupData[group_name] = arches;

            let xValues = [];
            let yValues = [];
            for(var z = 0; z < arches.length; z++) { //--> Iterate over each architecture in a group
                xValues.push(arches[z]['outputs'][0]);
                yValues.push(arches[z]['outputs'][1]);
            }


            plot_data.push({
                x: xValues,
                y: yValues,
                mode: 'markers',
                marker: {color: plot_colors[y]},
                name: group_name,
            });

            shapes.push({
                type: 'square',
                xref: 'x',
                yref: 'y',
                x0: Math.min(...xValues),
                y0: Math.min(...yValues),
                x1: Math.max(...xValues),
                y1: Math.max(...yValues),
                opacity: 0.3,
                fillcolor: plot_colors[y],
                line: {
                    color: plot_colors[y]
                }
            });

        }


        state.objective_space_plot = plot_data;

        //--> Create the plot layout (contains the shapes)
        console.log(shapes);
        state.objective_space_plot_layout = {
            shapes: shapes,
            xaxis: {title: 'Science'},
            yaxis: {range: [0, 6000], title: 'Cost'},
            margin: {
                t: 10, //top margin
                // l: 50, //left margin
                // r: 150, //right margin
                // b: 50 //bottom margin
            }
        };
    },




    // ----------------------------------
    // ---------- DESIGN SPACE ----------
    // ----------------------------------
    setLevelOneDesignSpacePlot(state) {
        //--> Get list of orb / inst names
        let xValues = [];
        let yValues = [];
        for(let x = 0; x < state.numDesignSpaceToShow; x++) {
            yValues.push( (state.all_level_one_design_space_info[x]['orbit'] + " - " + state.all_level_one_design_space_info[x]['instrument'] + " ") );
            xValues.push(parseFloat(state.all_level_one_design_space_info[x]['percent']))
        }

        //--> Create the level one histogram
        state.level_one_design_space_plot = [];
        let histogram_data = {
            "x": xValues,
            "y": yValues,
            "orientation": 'h',
            "type": 'bar'
        };
        state.level_one_design_space_plot.push(histogram_data);

        //--> Set Layout
        state.level_one_design_space_plot_layout = {
            title: 'Least Seen Design Decisions',
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };

    },

    setLevelTwoDesignSpacePlot(state) {
        if(state.all_level_two_design_space_info.length === 0) {
            return;
        }

        //--> Get list of orb / inst names
        let xValues = [];
        let yValues = [];
        for(let x = 0; x < state.numDesignSpaceToShow; x++) {
            yValues.push( (state.all_level_two_design_space_info[x]['orbit'] + " - " + state.all_level_two_design_space_info[x]['instrument'] + " ") );
            xValues.push(parseFloat(state.all_level_two_design_space_info[x]['percent']))
        }

        //--> Create the level one histogram
        state.level_two_design_space_plot = [];
        let histogram_data = {
            "x": xValues,
            "y": yValues,
            "orientation": 'h',
            "type": 'bar'
        };
        state.level_two_design_space_plot.push(histogram_data);

        //--> Set Layout
        let title = "Pairing Rate: " + state.designSpaceOrbit + " " + state.designSpaceInstrument;
        state.level_two_design_space_plot_layout = {
            title: title,
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };

    },

    setDesignSpaceInformation(state, designSpaceInformation) {
        console.log("All design space info set");
        state.all_design_space_info = designSpaceInformation;
        state.all_level_one_design_space_info = designSpaceInformation["level_one_analysis"];
        state.level_one_design_space_info = state.all_level_one_design_space_info.slice(0, state.numDesignSpaceToShow);

    },

    computeSecondLevelDesignSpace(state){
        let orbitIndex = state.orbitList.indexOf(state.designSpaceOrbit);
        let instrumentIndex = state.instrumentList.indexOf(state.designSpaceInstrument);
        if(orbitIndex === -1 || instrumentIndex === -1) {
            return;
        }

        let level_two_info = state.all_design_space_info["level_two_analysis"];
        state.all_level_two_design_space_info = level_two_info[state.designSpaceOrbit][state.designSpaceInstrument];
        state.level_two_design_space_info = state.all_level_two_design_space_info.slice(0, state.numDesignSpaceToShow);
    },

    setNumDesignSpaceToShow(state, numDesignSpaceToShow) {
        state.numDesignSpaceToShow = numDesignSpaceToShow;

        state.level_one_design_space_info = state.all_level_one_design_space_info.slice(0, state.numDesignSpaceToShow);
        state.level_two_design_space_info = state.all_level_two_design_space_info.slice(0, state.numDesignSpaceToShow);
    },

    setDesignSpaceOrbit(state, designSpaceOrbit) {
        state.designSpaceOrbit = designSpaceOrbit;
    },

    setDesignSpaceInstrument(state, designSpaceInstrument) {
        state.designSpaceInstrument = designSpaceInstrument;
    },

    setDesignSpacePlotWidth(state, designSpacePlotWidth){
        state.design_space_plot_width = designSpacePlotWidth
    },
    setDesignSpacePlotHeight(state, designSpacePlotHeight){
        state.design_space_plot_height = designSpacePlotHeight
    },




    // -----------------------------------
    // ---------- SENSITIVITIES ----------
    // -----------------------------------
    setFirstOrderSensitivityPlot(state) {
        let yValuesCost = [];
        let xValuesCost = [];
        let yValuesScience = [];
        let xValuesScience = [];
        for(var x = 0; x < state.s1_cost_mins.length; x++) {
            yValuesCost.push(state.s1_cost_mins[x][0] + " - " + state.s1_cost_mins[x][1] + " ");
            xValuesCost.push(parseFloat(state.s1_cost_mins[x][2]));

            yValuesScience.push(state.s1_science_mins[x][0] + " - " + state.s1_science_mins[x][1] + " ");
            xValuesScience.push(parseFloat(state.s1_science_mins[x][2]));
        }

        state.s1_cost_plot = [{
            x: xValuesCost,
            y: yValuesCost,
            "orientation": 'h',
            "type": 'bar'
        }];

        state.s1_cost_plot_layout = {
            title: 'First Order Sensitivities - Cost',
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };

        state.s1_science_plot = [{
            x: xValuesScience,
            y: yValuesScience,
            "orientation": 'h',
            "type": 'bar'
        }];

        state.s1_science_plot_layout = {
            title: 'First Order Sensitivities - Science',
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };

        console.log("-----------------------------");
        console.log(state.s1_science_plot);
        console.log(state.s1_science_plot_layout);

        console.log("-----------------------------");
    },

    setSensitivities(state, sensitivities) {
        state.all_sensitivities = sensitivities;
        state.s1_cost_mins_full = sensitivities["cost"]["S1_mins"];
        state.s1_science_mins_full = sensitivities["science"]["S1_mins"];

        state.s1_cost_mins = state.s1_cost_mins_full.slice(0, state.numSensitivitiesToShow);
        state.s1_science_mins = state.s1_science_mins_full.slice(0, state.numSensitivitiesToShow);
        state.areFirstOrderSensitivitiesComputed = true;
    },

    setSensitivityOrder(state, sensitivityOrder) {
        state.sensitivityOrder = sensitivityOrder;
    },

    setDesignSpaceLevel(state, designSpaceLevel) {
        state.designSpaceLevel = designSpaceLevel;
    },

    setNumSensitivitiesToShow(state, numSensitivitiesToShow) {
        state.numSensitivitiesToShow = numSensitivitiesToShow;
        if(state.areFirstOrderSensitivitiesComputed === true) {
            state.s1_cost_mins = state.s1_cost_mins_full.slice(0, state.numSensitivitiesToShow);
            state.s1_science_mins = state.s1_science_mins_full.slice(0, state.numSensitivitiesToShow);

            let yValuesCost = [];
            let xValuesCost = [];
            let yValuesScience = [];
            let xValuesScience = [];
            for(var x = 0; x < state.s1_cost_mins.length; x++) {
                yValuesCost.push(state.s1_cost_mins[x][0] + " - " + state.s1_cost_mins[x][1] + " ");
                xValuesCost.push(parseFloat(state.s1_cost_mins[x][2]));

                yValuesScience.push(state.s1_science_mins[x][0] + " - " + state.s1_science_mins[x][1] + " ");
                xValuesScience.push(parseFloat(state.s1_science_mins[x][2]));
            }

            state.s1_cost_plot = [{
                x: xValuesCost,
                y: yValuesCost,
                "orientation": 'h',
                "type": 'bar'
            }];

            state.s1_cost_plot_layout = {
                title: 'First Order Sensitivities - Cost',
                yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                xaxis: {automargin: true, side: "top", nticks: 10},
                autosize: true,
            };

            state.s1_science_plot = [{
                x: xValuesScience,
                y: yValuesScience,
                "orientation": 'h',
                "type": 'bar'
            }];

            state.s1_science_plot_layout = {
                title: 'First Order Sensitivities - Science',
                yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                xaxis: {automargin: true, side: "top", nticks: 10},
                autosize: true,
            };

        }
        if(state.areSecondOrderSensitivitiesComputed === true) {
            state.s2_cost_mins = state.s2_cost_mins_full.slice(0, state.numSensitivitiesToShow);
            state.s2_science_mins = state.s2_science_mins_full.slice(0, state.numSensitivitiesToShow);

            let yValuesCost2 = [];
            let xValuesCost2 = [];
            let yValuesScience2 = [];
            let xValuesScience2 = [];
            for(var y = 0; y < state.s2_cost_mins.length; y++) {
                yValuesCost2.push(state.s2_cost_mins[y][0] + " - " + state.s2_cost_mins[y][1] + " ");
                xValuesCost2.push(parseFloat(state.s2_cost_mins[y][2]));

                yValuesScience2.push(state.s2_science_mins[y][0] + " - " + state.s2_science_mins[y][1] + " ");
                xValuesScience2.push(parseFloat(state.s2_science_mins[y][2]));
            }



            state.s2_cost_plot = [{
                x: xValuesCost2,
                y: yValuesCost2,
                "orientation": 'h',
                "type": 'bar'
            }];

            state.s2_cost_plot_layout = {
                title: 'Second Order Sensitivities - Cost',
                yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                xaxis: {automargin: true, side: "top", nticks: 10},
                autosize: true,
            };

            state.s2_science_plot = [{
                x: xValuesScience2,
                y: yValuesScience2,
                "orientation": 'h',
                "type": 'bar'
            }];

            state.s2_science_plot_layout = {
                title: 'Second Order Sensitivities - Science',
                yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
                xaxis: {automargin: true, side: "top", nticks: 10},
                autosize: true,
            };
        }
    },

    setOrbitList(state, orbitList) {
        state.orbitList = orbitList;
    },

    setInstrumentList(state, instrumentList) {
        state.instrumentList = instrumentList;
    },

    setSecondOrderOrbit(state, secondOrderOrbit) {
        state.secondOrderOrbit = secondOrderOrbit;
    },

    setSecondOrderInstrument(state, secondOrderInstrument) {
        state.secondOrderInstrument = secondOrderInstrument;
    },

    computeSecondOrderSensitivities(state) {
        console.log("--------------- Computing second order sensitivities");
        //--> Get cost and science s2 arrays
        let scienceArray = state.all_sensitivities['science']['S2'];
        let costArray = state.all_sensitivities['cost']['S2'];

        //--> 0-UP
        let orbitIndex = state.orbitList.indexOf(state.secondOrderOrbit);
        let instrumentIndex = state.instrumentList.indexOf(state.secondOrderInstrument);
        if(orbitIndex === -1 || instrumentIndex === -1) {
            return;
        }

        //--> 1-UP
        let numOrbits = state.orbitList.length;
        let numInstruments = state.instrumentList.length;

        //--> 0-UP --> Index in whole array
        let position = (orbitIndex * numInstruments) + instrumentIndex;

        //--> 1-UP --> Number of comparisons - total elements
        let totalElements = numInstruments * numOrbits;

        //--> Create array of objects with index (excluding index with orb-inst we are checking)
        let compareArrayCost = [];
        let compareArrayScience = [];
        var i;
        for(i = 0; i < totalElements; i++) {
            if(i === position){continue;}
            compareArrayCost.push({index: i, value: Number(costArray[position][i])});
            compareArrayScience.push({index: i, value: Number(scienceArray[position][i])});
        }

        //--> Sort these objects
        compareArrayCost.sort(function (a, b) {return Math.abs(b.value) - Math.abs(a.value);});
        compareArrayScience.sort(function (a, b) {return Math.abs(b.value) - Math.abs(a.value);});

        //--> Create a list of 10 top triples [orbit, instrument, sensitivity] -- must convert index to (orbit, instrument) pair
        let costTriples = [];
        let scienceTriples = [];
        var x;
        for(x = 0; x < 10; x++) {
            let indexValuePairCost = compareArrayCost[x];
            let indexValuePairScience = compareArrayScience[x];
            costTriples.push(indexValueToTriple(indexValuePairCost, state.orbitList, state.instrumentList));
            scienceTriples.push(indexValueToTriple(indexValuePairScience, state.orbitList, state.instrumentList));
        }

        //--> Set the first 10 sensitivities for the instrument and orbit chosen
        state.s2_science_mins_full = scienceTriples;
        state.s2_cost_mins_full = costTriples;

        state.s2_cost_mins = costTriples.slice(0, state.numSensitivitiesToShow);
        state.s2_science_mins = scienceTriples.slice(0, state.numSensitivitiesToShow);



        let yValuesCost = [];
        let xValuesCost = [];
        let yValuesScience = [];
        let xValuesScience = [];
        for(var y = 0; y < state.s2_cost_mins.length; y++) {
            yValuesCost.push(state.s2_cost_mins[y][0] + " - " + state.s2_cost_mins[y][1] + " ");
            xValuesCost.push(parseFloat(state.s2_cost_mins[y][2]));

            yValuesScience.push(state.s2_science_mins[y][0] + " - " + state.s2_science_mins[y][1] + " ");
            xValuesScience.push(parseFloat(state.s2_science_mins[y][2]));
        }



        state.s2_cost_plot = [{
            x: xValuesCost,
            y: yValuesCost,
            "orientation": 'h',
            "type": 'bar'
        }];

        state.s2_cost_plot_layout = {
            title: 'Second Order Sensitivities - Cost',
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };

        state.s2_science_plot = [{
            x: xValuesScience,
            y: yValuesScience,
            "orientation": 'h',
            "type": 'bar'
        }];

        state.s2_science_plot_layout = {
            title: 'Second Order Sensitivities - Science',
            yaxis: {automargin: true, autorange: "reversed", tickmode: "linear"},
            xaxis: {automargin: true, side: "top", nticks: 10},
            autosize: true,
        };



        state.areSecondOrderSensitivitiesComputed = true;
    },

    setSensitivitiesObjective(state, sensitivitiesObjective) {
        state.sensitivitiesObjective = sensitivitiesObjective;
    },








    resetTeacherAgent(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
};


//--> Returns [orbit, instrument, String(value)]
function indexValueToTriple(obj, orbitList, instrumentList) {
    let triple = [];
    let index = (obj.index); //--> 0-UP
    let value = obj.value;

    let numOrbits = orbitList.length;
    let numInstruments = instrumentList.length;

    let orbitIndex = Math.floor(index / numOrbits);
    let instrumentIndex = (index % numInstruments);

    triple.push(orbitList[orbitIndex]);
    triple.push(instrumentList[instrumentIndex]);
    triple.push(String(value));

    return triple;
}


export default {
    state,
    getters,
    actions,
    mutations
}
