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
    outputList: ['Science', 'Cost'],
    outputObj: [1, -1],
    displayComponent: 'EOSSBuilder',
    importCallback: async (data) => {
        let extra = {};
        [extra.orbitList, extra.instrumentList] = await Promise.all([getOrbitList(), getInstrumentList()]);
        extra.orbitNum = extra.orbitList.length;
        extra.instrumentNum = extra.instrumentList.length;

        // Add alias for instruments and orbits
        let orbitAliasArray = [['LEO-600-polar-NA', '1'], ['SSO-600-SSO-AM', '2'], ['SSO-600-SSO-DD', '3'], ['SSO-800-SSO-DD', '4'], ['SSO-800-SSO-PM', '5']];
        extra.orbitAlias = new Map(orbitAliasArray);
        let instrumentAliasArray = [['ACE_ORCA', 'A'], ['ACE_POL', 'B'], ['ACE_LID', 'C'], ['CLAR_ERB', 'D'], ['ACE_CPR', 'E'], ['DESD_SAR', 'F'], ['DESD_LID', 'G'], ['GACM_VIS', 'H'], ['GACM_SWIR', 'I'], ['HYSP_TIR', 'J'], ['POSTEPS_IRS', 'K'],['CNES_KaRIN', 'L']];
        extra.instrumentAlias = new Map(instrumentAliasArray);

        let problemData = preprocessing(data);
        return {
            problemData: problemData,
            extra: extra
        }
    },
    extra: {}
};

/*
    Returns the list of orbits
    @return orbitList: a string list containing the names of orbits
    */
async function getOrbitList() {
    try {
        let dataResponse = await fetch('/api/vassar/get-orbit-list/', {credentials: 'same-origin'});
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
        let dataResponse = await fetch('/api/vassar/get-instrument-list/', {credentials: 'same-origin'});
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
