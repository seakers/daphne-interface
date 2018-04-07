import store from '../store';
import * as _ from 'lodash-es';

class Architecture {
    constructor(id, inputs, outputs) {
        this.id = id;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}

export default {
    inputNum: 60,
    outputNum: 2,
    inputList: [],
    outputList: ['Science', 'Cost ($K)'],
    outputObj: [1, -1],
    displayComponent: 'EOSSBuilder',
    importCallback: async (data) => {
        let extra = {};
        [extra.orbitList, extra.instrumentList] = await Promise.all([getOrbitList(), getInstrumentList()]);
        extra.orbitNum = extra.orbitList.length;
        extra.instrumentNum = extra.instrumentList.length;

        // Add alias for instruments and orbits
        extra.labelingEnabled = true;
        //let orbitAliasArray = [['LEO-600-polar-NA', '1'], ['SSO-600-SSO-AM', '2'], ['SSO-600-SSO-DD', '3'], ['SSO-800-SSO-DD', '4'], ['SSO-800-SSO-PM', '5']];
        let orbitAliasArray = [['LEO-600-polar-NA', 'LEO-600-polar-NA'], ['SSO-600-SSO-AM', 'SSO-600-SSO-AM'],
            ['SSO-600-SSO-DD', 'SSO-600-SSO-DD'], ['SSO-800-SSO-DD', 'SSO-800-SSO-DD'],
            ['SSO-800-SSO-PM', 'SSO-800-SSO-PM']];
        extra.orbitAlias = {};
        extra.orbitInvAlias = {};
        orbitAliasArray.forEach((element) => {
            extra.orbitAlias[element[0]] = element[1];
            extra.orbitInvAlias[element[1]] = element[0];
        });

        //let instrumentAliasArray = [['ACE_ORCA', 'A'], ['ACE_POL', 'B'], ['ACE_LID', 'C'], ['CLAR_ERB', 'D'], ['ACE_CPR', 'E'], ['DESD_SAR', 'F'], ['DESD_LID', 'G'], ['GACM_VIS', 'H'], ['GACM_SWIR', 'I'], ['HYSP_TIR', 'J'], ['POSTEPS_IRS', 'K'],['CNES_KaRIN', 'L']];
        let instrumentAliasArray = [['ACE_ORCA', 'ACE_ORCA'], ['ACE_POL', 'ACE_POL'], ['ACE_LID', 'ACE_LID'],
            ['CLAR_ERB', 'CLAR_ERB'], ['ACE_CPR', 'ACE_CPR'], ['DESD_SAR', 'DESD_SAR'], ['DESD_LID', 'DESD_LID'],
            ['GACM_VIS', 'GACM_VIS'], ['GACM_SWIR', 'GACM_SWIR'], ['HYSP_TIR', 'HYSP_TIR'],
            ['POSTEPS_IRS', 'POSTEPS_IRS'], ['CNES_KaRIN', 'CNES_KaRIN']];
        extra.instrumentAlias = {};
        extra.instrumentInvAlias = {};
        instrumentAliasArray.forEach((element) => {
            extra.instrumentAlias[element[0]] = element[1];
            extra.instrumentInvAlias[element[1]] = element[0];
        });

        let problemData = preprocessing(data);
        return {
            problemData: problemData,
            extra: extra
        }
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
async function getOrbitList() {
    try {
        let dataResponse = await fetch('/api/vassar/get-orbit-list', {credentials: 'same-origin'});
        if (dataResponse.ok) {
            return dataResponse.json();
        }
        else {
            console.error('Error getting the orbit list');
        }
    }
    catch(e) {
        console.error('Networking error:', e);
    }
}

/*
    Returns the list of instruments
    @return instrumentList: a string list containing the names of instruments
    */
async function getInstrumentList() {
    try {
        let dataResponse = await fetch('/api/vassar/get-instrument-list', {credentials: 'same-origin'});
        if (dataResponse.ok) {
            return dataResponse.json();
        }
        else {
            console.error('Error getting the instrument list');
        }
    }
    catch(e) {
        console.error('Networking error:', e);
    }
}

function preprocessing(data) {
    let output = [];
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

        let arch = new Architecture(id, inputs, outputs);

        output.push(arch);
    });

    return output;
}
