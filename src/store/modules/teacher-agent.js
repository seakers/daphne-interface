import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";
import store from "../../store"


const state = {
    // -----------------------------------
    // ------------- GENERAL -------------
    // -----------------------------------
    selectedSubject:             '',
    orbitList:                   [],
    instrumentList:              [],
    plotData:                    [],
    current_teacher_question:    'Question not set',
    current_question_type:       '',
    teacher_choice_one:          'Choice 1 not set',
    teacher_choice_two:          'Choice 2 not set',
    teacher_choice_one_revealed: 'Reveal 1 not set',
    teacher_choice_two_revealed: 'Reveal 2 not set',
    correct_choice:              1,
    lastEvaluatedArchitecture:   {},
    selectedArchData:            {},
    updatedArchData:             {},
    features:                    [],

    // -----------------------------------
    // ------------ FEATURES -------------
    // -----------------------------------
    all_features: [],

    // -----------------------------------
    // ---------- SENSITIVITIES ----------
    // -----------------------------------
    all_sensitivities:      {},
    secondOrderOrbit:       '',
    secondOrderInstrument:  '',
    sensitivityOrder:       'First Order',
    numSensitivitiesToShow: '10',
    sensitivitiesObjective: 'science',

    // ----------------------------------
    // ---------- DESIGN SPACE ----------
    // ----------------------------------
    all_design_space_info: {},
    designSpaceOrbit:      '',
    designSpaceInstrument: '',
    designSpaceLevel:      'Level One',
    numDesignSpaceToShow:  '7',

    // -------------------------------------
    // ---------- OBJECTIVE SPACE ----------
    // -------------------------------------
    all_objective_space_info: {},
    objective_chat_plot_info: [],
    evaluated_architectures:  [],

};
const initialState = _.cloneDeep(state);



const getters = {
    //--> Getter: SensitivityPlot.vue
    get_all_sensitivities(state){
        return state.all_sensitivities;
    },
    //--> Getter: DesignSpacePlot.vue
    get_all_design_space_info(state){
        return state.all_design_space_info;
    },
    get_evaluated_architectures(state){
        return state.evaluated_architectures;
    },
    get_features(state){
        return state.features;
    },
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
    get_orbit_list(state){
        return state.orbitList;
    },
    get_instrument_list(state){
        return state.instrumentList;
    },
};

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

    async getInformation({ state, dispatch, commit, rootState }){
        console.log("Getting all information for the Teacher Agent");

        let sensitivityReqData = new FormData();
        sensitivityReqData.append('plotData', JSON.stringify(state.plotData));
        sensitivityReqData.append('orbits', JSON.stringify(state.orbitList));
        sensitivityReqData.append('instruments', JSON.stringify(state.instrumentList));
        let sensitivityResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-sensitivities', sensitivityReqData);
        let sensitivityInformation = await sensitivityResponse.json();
        commit('set_all_sensitivities', sensitivityInformation);
        console.log("Sensitivity Info");console.log(sensitivityInformation);

        let designSpaceReqData = new FormData();
        designSpaceReqData.append('plotData', JSON.stringify(state.plotData));
        designSpaceReqData.append('problem', rootState.problem.problemName);
        designSpaceReqData.append('orbits', JSON.stringify(state.orbitList));
        designSpaceReqData.append('instruments', JSON.stringify(state.instrumentList));
        let designSpaceResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-design-space', designSpaceReqData);
        let designSpaceInformation = await designSpaceResponse.json();
        commit('setDesignSpaceInformation', designSpaceInformation);
        console.log("Design Space Info");console.log(designSpaceInformation);

        let objectiveSpaceReqData = new FormData();
        objectiveSpaceReqData.append('plotData', JSON.stringify(state.plotData));
        objectiveSpaceReqData.append('problem', rootState.problem.problemName);
        objectiveSpaceReqData.append('orbits', JSON.stringify(state.orbitList));
        objectiveSpaceReqData.append('instruments', JSON.stringify(state.instrumentList));
        let objectiveSpaceResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-objective-space', sensitivityReqData);
        let objectiveSpaceInformation = await objectiveSpaceResponse.json();
        commit('setObjectiveSpaceInformation', JSON.parse(objectiveSpaceInformation));
        console.log("Objective Space Info");console.log(objectiveSpaceInformation);

        let featureReqData = new FormData();
        featureReqData.append('plotData', JSON.stringify(state.plotData));
        featureReqData.append('input_type', rootState.problem.inputType);
        featureReqData.append('orbits', JSON.stringify(state.orbitList));
        featureReqData.append('instruments', JSON.stringify(state.instrumentList));
        let featureResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-features', featureReqData);
        let featureInformation = await featureResponse.json();
        commit('set_all_features', featureInformation);
        console.log("Feature Info");console.log(featureInformation);
    },

    async getSubjectInformation({ commit, dispatch }) {
        if (state.selectedSubject === 'Features'){
            dispatch('getFeaturesInformation');
        }
    },

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

    async recordEvaluatedArchitecture({ commit }, evaluatedArchData) {
        commit('setLastEvaluatedArchitecture', evaluatedArchData);
    },

    async recordSelectedArchitecture({ commit }, selectedArchData) {
        commit('setSelectedArchitecture', selectedArchData);
    },

    async recordArchitectureUpdate({ commit }, updatedArchData) {
        commit('setUpdatedArchitecture', updatedArchData);
    },

    async clearTeacherContext() {
        //--> Request Data
        let reqData = new FormData();
        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/clear-teacher-user-data', reqData);
        if (dataResponse.ok) {
            console.log("Teacher Context Database Cleared");
        }
    },

    turnProactiveTeacherOn({ commit, state, rootState }) {

        //--> Request Data
        let reqData = new FormData();
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('orbits', JSON.stringify(state.orbitList));
        reqData.append('instruments', JSON.stringify(state.instrumentList));
        reqData.append('proactiveMode', 'enabled');
        reqData.append('plotData', JSON.stringify(state.plotData));
        reqData.append('input_type', rootState.problem.inputType);

        //--> Receive Response
        let dataResponse = fetchPost(API_URL + 'eoss/teacher/set-proactive-mode', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let jsonResponse = dataResponse.json();
            console.log(jsonResponse);
        }
    },

    turnProactiveTeacherOff({ rootState }) {

        //--> Request Data
        let reqData = new FormData();
        reqData.append('problem', rootState.problem.problemName);
        reqData.append('proactiveMode', 'disabled');

        //--> Receive Response
        let dataResponse = fetchPost(API_URL + 'eoss/teacher/set-proactive-mode', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let jsonResponse = dataResponse.json();
            console.log(jsonResponse);
        }
    },

};

const mutations = {
    // -----------------------------
    // ---------- GENERAL ----------
    // -----------------------------
    setOrbitList(state, orbitList) {
        state.orbitList = orbitList;
    },
    setInstrumentList(state, instrumentList) {
        state.instrumentList = instrumentList;
    },
    set_evaluated_architectures(state, architecture){
        state.evaluated_architectures.push(architecture);
    },
    set_features(state, features){
        state.features = features;
    },
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
    setLastEvaluatedArchitecture(state, lastEvaluatedArchitecture) {
        state.lastEvaluatedArchitecture = lastEvaluatedArchitecture;
    },
    setSelectedArchitecture(state, selectedArchData) {
        state.selectedArchData = selectedArchData;
    },
    setUpdatedArchitecture(state, updatedArchData) {
        state.updatedArchData = updatedArchData;
    },

    // -------------------------------------
    // ---------- OBJECTIVE SPACE ----------
    // -------------------------------------
    setObjectiveSpaceInformation(state, objectiveSpaceInformation) {
        state.all_objective_space_info = objectiveSpaceInformation;
    },

    // ----------------------------------
    // ------------ FEATURES ------------
    // ----------------------------------
    set_all_features(state, all_features){
        state.all_features = all_features;
    },

    // ----------------------------------
    // ---------- DESIGN SPACE ----------
    // ----------------------------------
    setDesignSpaceLevel(state, designSpaceLevel) {
        state.designSpaceLevel = designSpaceLevel;
    },
    setDesignSpaceInformation(state, designSpaceInformation) {
        state.all_design_space_info = designSpaceInformation;
    },
    setNumDesignSpaceToShow(state, numDesignSpaceToShow) {
        state.numDesignSpaceToShow = numDesignSpaceToShow;
    },
    setDesignSpaceOrbit(state, designSpaceOrbit) {
        state.designSpaceOrbit = designSpaceOrbit;
    },
    setDesignSpaceInstrument(state, designSpaceInstrument) {
        state.designSpaceInstrument = designSpaceInstrument;
    },

    // -----------------------------------
    // ---------- SENSITIVITIES ----------
    // -----------------------------------
    set_all_sensitivities(state, sensitivities) {
        state.all_sensitivities = sensitivities;
    },
    setSensitivityOrder(state, sensitivityOrder) {
        state.sensitivityOrder = sensitivityOrder;
    },
    setNumSensitivitiesToShow(state, numSensitivitiesToShow) {
        state.numSensitivitiesToShow = numSensitivitiesToShow;
    },
    setSecondOrderOrbit(state, secondOrderOrbit) {
        state.secondOrderOrbit = secondOrderOrbit;
    },
    setSecondOrderInstrument(state, secondOrderInstrument) {
        state.secondOrderInstrument = secondOrderInstrument;
    },
    setSensitivitiesObjective(state, sensitivitiesObjective) {
        state.sensitivitiesObjective = sensitivitiesObjective;
    },

    resetTeacherAgent(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
};

export function indexValueToTriple(obj, orbitList, instrumentList) {
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
