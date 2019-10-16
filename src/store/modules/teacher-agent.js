// initial state
import * as _ from 'lodash-es';
import {fetchPost} from "../../scripts/fetch-helpers";
import store from "../../store"




// ---------------------------
// --> State
// selectedSubject: '' | 'Design Space' | 'Objective Space' | 'Features' | 'Sensitivities'
// ---------------------------
const state = {
    selectedSubject: '',
    sensitivityOrder: 'First',
    numSensitivitiesToShow: '3',
    s1_cost_mins: [],
    s2_cost_mins: [],
    s1_science_mins: [],
    s2_science_mins: [],
    s1_cost_mins_full: [],
    s2_cost_mins_full: [],
    s1_science_mins_full: [],
    s2_science_mins_full: [],
    all_sensitivities: {},
    areFirstOrderSensitivitiesComputed: false,
    areSecondOrderSensitivitiesComputed: false,
    orbitList: [],
    instrumentList: [],
    secondOrderOrbit: '',
    secondOrderInstrument: '',
};
const initialState = _.cloneDeep(state);






// ---------------------------
// Getters
// ---------------------------
const getters = {};









// ---------------------------
// Actions
// ---------------------------
const actions = {

    //--> When the user changes the 'Subject' dropdown a new subject will be taught in the teacher panel
    async getSubjectInformation({ dispatch }) {
        console.log(state.selectedSubject)
        console.log("In teacher-agent.js --> getSubjectInformation");


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

        commit('renderFeaturesSubject')
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

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-sensitivities', reqData);


        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let sensitivities = await dataResponse.json();
            console.log(sensitivities);
            commit('setSensitivities', sensitivities);
            commit('computeSecondOrderSensitivities');
        }

    },














    async getDesignSpaceInformation({ commit }) {
        console.log("In teacher-agent.js --> getDesignSpaceInformation");

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-design-space', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let subjectInformation = await dataResponse.json();
        }

        commit('renderDesignSpaceSubject')
    },

    async getObjectiveSpaceInformation({ commit }) {
        console.log("In teacher-agent.js --> getObjectiveSpaceInformation");

        //--> Request Data
        let reqData = new FormData();
        reqData.append('subject', state.selectedSubject);

        let dataResponse = await fetchPost(API_URL + 'eoss/teacher/get-subject-objective-space', reqData);
        console.log(dataResponse);

        //--> Retrieve Response
        if (dataResponse.ok)
        {
            let subjectInformation = await dataResponse.json();
        }

        commit('renderObjectiveSpaceSubject');
    },


    actionComputeSecondOrderSensitivities({ commit }) {
        commit('computeSecondOrderSensitivities');
    }



};










// ---------------------------
// Mutations
// ---------------------------
const mutations = {

    setSensitivities(state, sensitivities) {
        state.all_sensitivities = sensitivities;
        state.s1_cost_mins_full = sensitivities["cost"]["S1_mins"];
        state.s1_science_mins_full = sensitivities["science"]["S1_mins"];

        state.s1_cost_mins = state.s1_cost_mins_full.slice(0, state.numSensitivitiesToShow);
        state.s1_science_mins = state.s1_science_mins_full.slice(0, state.numSensitivitiesToShow);
        state.areFirstOrderSensitivitiesComputed = true;
    },


    //--> Set the store selectedSubject object
    setSubject(state, selectedSubject) {
        state.selectedSubject = selectedSubject;
    },
    setSensitivityOrder(state, sensitivityOrder) {
        state.sensitivityOrder = sensitivityOrder;
    },
    setNumSensitivitiesToShow(state, numSensitivitiesToShow) {
        state.numSensitivitiesToShow = numSensitivitiesToShow;
        if(state.areFirstOrderSensitivitiesComputed === true) {
            state.s1_cost_mins = state.s1_cost_mins_full.slice(0, state.numSensitivitiesToShow);
            state.s1_science_mins = state.s1_science_mins_full.slice(0, state.numSensitivitiesToShow);
        }
        if(state.areSecondOrderSensitivitiesComputed === true) {
            state.s2_cost_mins = state.s2_cost_mins_full.slice(0, state.numSensitivitiesToShow);
            state.s2_science_mins = state.s2_science_mins_full.slice(0, state.numSensitivitiesToShow);
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






    //--> Compute
    // state.s2_science_mins_full (10 values)
    // state.s2_cost_mins_full (10 values)
    // state.s2_cost_mins
    // state.s2_science_mins
    //--> Using
    // state.secondOrderOrbit
    // state.secondOrderInstrument
    // state.numSensitivitiesToShow
    // state.all_sensitivities
    // state.orbitList
    // state.instrumentList
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
        compareArrayCost.sort(function (a, b) {return a.value - b.value;});
        compareArrayScience.sort(function (a, b) {return a.value - b.value;});

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
        console.log(scienceTriples);
        console.log(costTriples);

        state.s2_cost_mins = costTriples.slice(0, state.numSensitivitiesToShow);
        state.s2_science_mins = scienceTriples.slice(0, state.numSensitivitiesToShow);

        console.log(state.s2_science_mins);
        console.log(state.s2_cost_mins);

        state.areSecondOrderSensitivitiesComputed = true;
    },



    resetTeacherAgent(state) {
        state = Object.assign(state, _.cloneDeep(initialState));
    },
    //--> Subject Functions
    renderFeaturesSubject(state, info) {

    },
    renderSensitivitiesSubject(state, info) {

    },
    renderDesignSpaceSubject(state, info) {

    },
    renderObjectiveSpaceSubject(state, info) {

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
