import store from '../store';
import { client } from '../index';
import { LocalOrbitQuery, LocalInstrumentQuery } from "./apollo-queries";


class Architecture {
    constructor(id, inputs, outputs, db_id) {
        this.id = id;
        this.inputs = inputs;
        this.outputs = outputs;
        this.db_id = db_id;
    }
}

export default {
    problemName: 'SMAP',
    inputNum: 1,
    outputNum: 2,
    inputList: [],
    // outputList: ['Science', 'Cost ($M)'],
    outputList: ['Cost ($M)', 'Programmatic Risk', 'Atmospheric Panel Satisfaction', 'Oceanic Panel Satisfaction', 'Terrestrial Panel Satisfaction'],
    outputObj: [1, -1],
    inputType: 'binary',
    displayComponent: 'EOSSBuilder',
    problemFunctionalities: [
        'DesignBuilder',
        'DataMining',
        'EOSSFilter',
        'FeatureApplication',
        'OrbitInstrInfo',
        'AvailableCommands',
        'CommandsInformation',
        'Mycroft',
    ],
    shownFunctionalities: [
        'DesignBuilder',
        'OrbitInstrInfo',
        'AvailableCommands',
        'CommandsInformation'
    ],

    async initFunction(problem_id) {
        let extra = {};

        // Orbit / Instrument info
        extra.orbitList      = await getOrbitList(problem_id);
        extra.orbitNum       = extra.orbitList.length;
        extra.instrumentList = await getInstrumentList(problem_id);
        extra.instrumentNum  = extra.instrumentList.length;

        // Add alias for instruments and orbits
        extra.labelingEnabled = true;


        // --> ORBIT ALIAS
        let orbitAliasArray = [];
        for (let i = 0; i < extra.orbitList.length; i++){
            orbitAliasArray.push([extra.orbitList[i], extra.orbitList[i]]);
        }
        extra.orbitAlias = {};
        extra.orbitInvAlias = {};
        orbitAliasArray.forEach((element) => {
            extra.orbitAlias[element[0]] = element[1];
            extra.orbitInvAlias[element[1]] = element[0];
        });

        // --> INSTRUMENT ALIAS
        let instrumentAliasArray = [];
        for (let i = 0; i < extra.instrumentList.length; i++){
            instrumentAliasArray.push([extra.instrumentList[i], extra.instrumentList[i]]);
        }
        extra.instrumentAlias = {};
        extra.instrumentInvAlias = {};
        instrumentAliasArray.forEach((element) => {
            extra.instrumentAlias[element[0]] = element[1];
            extra.instrumentInvAlias[element[1]] = element[0];
        });

        return extra;
    },
    importCallback(data, extra) {
        return preprocessing(data, extra);
    },
    extra: {},
    actualName2Index: (name, type) => {
        const eossInfo = store.state.problem.extra;
        name = name.trim();
        if (name.indexOf(',') !== -1) {
            let names = name.split(',');
            let newName = '';
            for (let i = 0; i < names.length; i++) {
                let comma = ',';
                if (i === 0) {
                    comma = '';
                }
                if (type === 'orbit') {
                    newName += comma + eossInfo.orbitList.indexOf(names[i]);
                }
                else if (type === 'instrument') {
                    newName += comma + eossInfo.instrumentList.indexOf(names[i]);
                }
                else {
                    newName += comma + 'NamingError';
                }
            }
            return newName;
        }
        else {
            if (type === 'orbit') {
                return eossInfo.orbitList.indexOf(name);
            }
            else if (type === 'instrument') {
                return eossInfo.instrumentList.indexOf(name);
            }
            else {
                return 'NamingError';
            }
        }
    },
    /*
     * @param {int} index: Number indicating either an oribt or an instrument
     * @param {String} type: Type of the input name. Could be either "orbit" or "instrument"
     * @returns The actual name of an instrument or an orbit
     */
    index2ActualName(index, type) {
        const eossInfo = store.state.problem.extra;
        if (type === 'orbit') {
            return eossInfo.orbitList[index];
        }
        else if (type === 'instrument') {
            return eossInfo.instrumentList[index];
        }
        else {
            return 'NamingError';
        }
    },
    displayName2Index: (input, type) => {
        const eossInfo = store.state.problem.extra;
        if (!eossInfo.labelingEnabled) {
            return store.state.problem.actualName2Index(input, type);
        }

        input = input.trim();
        let split = input.split(',');
        let output = '';
        for (let i = 0; i < split.length; i++) {
            let name = split[i];

            if (i > 0) {
                output += ',';
            }

            if (type === 'orbit') {
                output += eossInfo.orbitList.indexOf(eossInfo.orbitInvAlias[name]);
            }
            else if (type === 'instrument') {
                output += eossInfo.instrumentList.indexOf(eossInfo.instrumentInvAlias[name]);
            }
            else {
                return 'NamingError';
            }
        }
        return output;
    },
    /*
     * @param {int} index: Number indicating either an orbit or an instrument
     * @param {String} type: Type of the variable. Could be either "orbit" or "instrument"
     */
    index2DisplayName(index, type) {
        const eossInfo = store.state.problem.extra;
        if (!eossInfo.labelingEnabled) {
            return store.state.problem.index2ActualName(index, type);
        }

        if (type === 'orbit') {
            return eossInfo.orbitAlias[eossInfo.orbitList[index]];
        }
        else if (type === 'instrument') {
            return eossInfo.instrumentAlias[eossInfo.instrumentList[index]];
        }
        else {
            return 'NamingError';
        }
    },
    ppFeatureSingle(expression) {
        let exp = expression;
        if (exp[0] === '{') {
            exp = exp.substring(1, exp.length-1);
        }
        let featureName = exp.split('[')[0];

        if (featureName === 'paretoFront' || featureName === 'FeatureToBeAdded' ||
            featureName === 'AND' || featureName === 'OR') {
            return exp;
        }

        if (featureName[0] === '~') {
            featureName = 'NOT '+ featureName.substring(1);
        }

        let featureArg = exp.split('[')[1];
        featureArg = featureArg.substring(0, featureArg.length-1);

        let orbits = featureArg.split(';')[0].split(',');
        let instruments = featureArg.split(';')[1].split(',');
        let numbers = featureArg.split(';')[2];

        let pporbits = '';
        let ppinstruments = '';
        for (let i = 0; i < orbits.length; i++) {
            if (orbits[i].length === 0) {
                continue;
            }
            if (i > 0) {
                pporbits += ',';
            }
            pporbits += this.index2DisplayName(orbits[i], 'orbit');
        }
        for (let i = 0; i < instruments.length; i++) {
            if (instruments[i].length === 0) {
                continue;
            }
            if (i > 0) {
                ppinstruments += ',';
            }
            ppinstruments += this.index2DisplayName(instruments[i], 'instrument');
        }
        return featureName + '[' + pporbits + ';' + ppinstruments + ';' + numbers + ']';
    }
};

/*
    Returns the list of orbits
    @return orbitList: a string list containing the names of orbits
    */
async function getOrbitList(problemName) {
    try {
        // 1. Get orbit list from direct query

        let response = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: LocalOrbitQuery,
            variables: {
                problem_id: problemName,
            }
        });

        let orbits = response['data']['Join__Problem_Orbit'];

        let orb_list = [];
        for(let x=0;x<orbits.length;x++){
            orb_list.push(orbits[x]['Orbit']['name'])
        }
        return orb_list;
    }
    catch(e) {
        console.error('Networking error:', e);
    }
}

/*
    Returns the list of instruments
    @return instrumentList: a string list containing the names of instruments
    */
async function getInstrumentList(problemName) {
    try {


        let response = await client.query({
            deep: true,
            fetchPolicy: 'no-cache',
            query: LocalInstrumentQuery,
            variables: {
                problem_id: problemName,
            }
        });
        let instruments = response['data']['Join__Problem_Instrument'];

        let inst_list = [];
        for(let x=0;x<instruments.length;x++){
            inst_list.push(instruments[x]['Instrument']['name'])
        }
        return inst_list;
    }
    catch(e) {
        console.error('Networking error:', e);
    }
}

function preprocessing(data, extra) {
    let output = [];
    if (data.length === 0) {
        let inputs = new Array(extra.orbitNum*extra.instrumentNum).fill(0);
        let arch = new Architecture(0, inputs, [0, 0, 0, 0, 0, 0, 0]);
        output.push(arch);
    }
    else if (data[0].inputs.length !== extra.orbitNum*extra.instrumentNum){

        //---> Change is num instruments or orbits??
        let inputs = new Array(extra.orbitNum*extra.instrumentNum).fill(0);
        let arch = new Architecture(0, inputs, [0, 0, 0, 0, 0, 0, 0]);
        output.push(arch);

    }
    else {
        data.forEach(d => {
            // convert string to numbers
            d.science = Number(d.science);
            d.cost = Number(d.cost);
            if (d.cost === 100000) {
                d.cost = 0;
                d.science = 0;
            }
            let outputs = d.outputs;
            let inputs = d.inputs;
            let id = +d.id;

            let arch = new Architecture(id, inputs, outputs, d.db_id);

            output.push(arch);
        });
    }

    return output;
}
