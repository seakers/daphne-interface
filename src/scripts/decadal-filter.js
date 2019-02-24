import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from './utils';
import store from '../store';

export default {
    presetOptions: [
        {value:'not_selected',text:'Preset Filters'},
        {value:'paretoFront',text:'Pareto front'},
        {value:'inOrbit',text:'In orbit',input:'orbitAndMultipleInstInput',hints:'Designs that have the specified instruments inside the chosen orbit are selected'},
        {value:'notInOrbit',text:'Not in orbit',input:'orbitAndMultipleInstInput',hints:'Designs that do not have the specified instruments inside the chosen orbit are selected',},
        {value:'together',text:'Together',input:'multipleInstInput',hints:'Designs that have the specified instruments in any one orbit are chose'},
        {value:'separate',text:'Separate',input:'multipleInstInput',hints:'Designs that do not have the specified instruments in the same orbit are chosen'},
        {value:'emptyOrbit',text:'Empty orbit',input:'orbitInput',hints:'Designs that have no instrument inside the specified orbit are chosen'},
        {value:'numOrbits',text:'Number of orbit used',input:'numOrbit',hints:'Designs that have the specified number of non-empty orbits are chosen'},
        {value:'numOfInstruments',text:'Number of instruments',input:'numOfInstruments',hints:'This highlights all the designs with the specified number of instruments. If you specify an orbit name, it will count all instruments in that orbit. If you can also specify an instrument name, and only those instruments will be counted across all orbits. If you leave both instruments and orbits blank, all instruments across all orbits will be counted.'},
    ],
    selectedFilter: 'not_selected',
    processFilterExpression(point, expression, logic) {
        let e, _e;

        e = expression;
        // Remove outer parenthesis
        e = removeOuterParentheses(e);
        _e = e;

        let first = true;
        let last = false;

        if (getNestedParenthesisDepth(e) === 0) {
            // Given expression does not have a nested structure
            if (e.indexOf('&&') === -1 && e.indexOf('||') === -1) {
                // There is no logical connective: Single filter expression
                return applyPresetFilter(e, point);
            }
        }
        else {
            // Removes the nested structure by replacing all the nested expressions using an arbitrary symbol 'X'
            _e = collapseParenIntoSymbol(e);
        }

        let filterResult = true;
        while (!last) {
            let e_temp, _e_temp;

            if (!first) {
                logic = _e.substring(0, 2);
                _e = _e.substring(2);
                e = e.substring(2);
            }

            let next; // The immediate next logical connective
            let and = _e.indexOf('&&');
            let or = _e.indexOf('||');
            if (and === -1 && or === -1) {
                next = '';
            }
            else if(and === -1) {
                next = '||';
            }
            else if(or === -1) {
                next = '&&';
            }
            else if(and < or) {
                next = '&&';
            }
            else {
                next = '||';
            }

            if (next !== '') {
                _e_temp = _e.split(next, 1)[0];
                e_temp = e.substring(0, _e_temp.length);

                _e = _e.substring(_e_temp.length);
                e = e.substring(_e_temp.length);
            }
            else {
                _e_temp = _e;
                e_temp = e;
                last = true;
            }

            let subFilter = this.processFilterExpression(point, e_temp, logic);
            if (first) {
                // The first filter in a series to be applied
                filterResult = subFilter;
                first = false;
            }
            else {
                if (logic === '||') {
                    filterResult = filterResult || subFilter;
                }
                else {
                    filterResult = filterResult && subFilter;
                }
            }
        }
        return filterResult;
    }
};

/*
    Compares the preset filter to a single architecture
    @param expression: A filter expression string

    @return: A boolean indicating whether the input architecture passes the filter
*/
function applyPresetFilter(inputExpression, data) {
    let expression = removeOuterParentheses(inputExpression);

    // Preset filter: {presetName[orbits;instruments;numbers]}
    expression = expression.substring(1, expression.length-1);

    let flip = false;
    if (expression.startsWith('~')) {
        flip = true;
        expression = expression.substring(1, expression.length);
    }

    let numOrbits = store.state.problem.extra.orbitNum;
    let numInstruments = store.state.problem.extra.instrumentNum;
    let type = expression.split('[')[0];
    let inputs = data.inputs;

    if (type === 'paretoFront') {
        if (data.paretoRanking || data.paretoRanking === 0) {
            let rank = +data.paretoRanking;
            let arg = +expression.substring(0, expression.length-1).split('[')[1];
            return rank <= arg;
        }
    }

    let condition = expression.substring(0, expression.length-1).split('[')[1];
    let condSplit = condition.split(';');
    let orbit, instr, numb;

    orbit = condSplit[0];
    instr = condSplit[1];
    numb = condSplit[2];

    let result;
    switch (type) {

    case 'inOrbit': {
        result = true;
        orbit = +orbit;
        let satIndex;
        if (instr.indexOf(',') === -1) {
            // One instrument
            instr = + instr;
            satIndex = inputs[instr];
            if(inputs[numInstruments + satIndex] != orbit){
                result = false;
            }
        }
        else {
            // Multiple instruments
            let instruments = instr.split(",");
            for(let j = 0; j < instruments.length; j++){
                let temp = +instruments[j];
                satIndex = inputs[temp];
                if(inputs[numInstruments + satIndex] != orbit){
                    result = false;
                    break;
                }
            }
        }
        break;
    }
    case 'notInOrbit': {
        result = true;
        orbit = +orbit;
        let satIndex;
        if (instr.indexOf(',') === -1) {
            // One instrument
            instr = + instr;
            satIndex = inputs[instr];
            if(inputs[numInstruments + satIndex] === orbit){
                result = false;
            }
        }
        else {
            // Multiple instruments
            let instruments = instr.split(",");
            for(let j = 0; j < instruments.length; j++){
                let temp = +instruments[j];
                satIndex = inputs[temp];
                if(inputs[numInstruments + satIndex] === orbit){
                    result = false;
                    break;
                }
            }
        }
        break;
    }
    case 'together': {
        result = true;
        let satIndex = null;
        let instruments = instr.split(',');
        for(let i = 0; i < instruments.length; i++){
            let temp = +instruments[i];
            if(satIndex === null){
                satIndex = inputs[temp];

            }else if(satIndex !== inputs[temp]){
                result = false;
                break;
            }
        }
        break;
    }
    case 'separate': {
        result = true;
        let instruments = instr.split(',');
        let satIndex = null;
        for(let i = 0; i < instruments.length; i++){
            let temp = +instruments[i];
            if(satIndex === null){
                satIndex = inputs[temp];

            }else if(satIndex === inputs[temp]){
                result = false;
                break;

            }
        }
        break;
    }
    case 'emptyOrbit': {
        result = true;
        orbit = +orbit;
        for(let i = 0; i < numInstruments; i++){
            if(inputs[i + numInstruments] === orbit){
                result = false;
                break;
            }
        }
        break;
    }
    case 'numOrbits': {
        let count = 0;
        result = false;
        numb = +numb;
        for(let i = 0; i < numInstruments; i++){
            if(inputs[numInstruments + i] != -1){
                count += 1;
            }
        }
        if(numb === count){
            result = true;
        }
        break;
    }
    case 'numOfInstruments': {
        let count = 0;
        result = false;
        numb = +numb;
        orbit = +orbit;
        let satIndex = null;

        // number of instruments in a specified orbit
        for (let i = 0; i < numInstruments; i++) {
            if(inputs[i + numInstruments] === orbit){
                satIndex = i;
            }
        }

        for(let i = 0; i < numInstruments; i++){
            if(inputs[i] === satIndex){
                count++;
            }
        }

        if(count === numb) {
            result = true;
        }
        break;
    }

    default:
        return false;
    }

    if (flip === true) {
        return !result;
    }
    else {
        return result;
    }
}
