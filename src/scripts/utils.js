export const INITIALIZE_FEATURE_APPLICATION = "initialize_feature_application";

import * as _ from 'lodash-es';
import store from '../store';
import smap from './smap';
import {fetchGet, fetchPost} from "./fetch-helpers";




export async function getOrbitList(problemName) {
    try {
        let reqData = new FormData();
        reqData.append('problem_name', problemName);

        let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-orbit-list', reqData);
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

export async function getInstrumentList(problemName) {
    try {
        let reqData = new FormData();
        reqData.append('problem_name', problemName);

        let dataResponse = await fetchPost(API_URL + 'eoss/engineer/get-instrument-list', reqData);
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

export async function getDesignIndex(orbit, instrument, problemName){
    let orbits = store.state.teacherAgent.orbitList;
    let instruments = store.state.teacherAgent.instrumentList;
    if(orbits === []){orbits = await getOrbitList(problemName);}
    if(instruments === []){instruments = await getInstrumentList(problemName);}
    let prevOrb = orbits.indexOf(orbit) * orbits.length;
    let designIndex = prevOrb + instruments.indexOf(instrument);
    return designIndex;
}

export function calculateParetoRanking(data) {
    let n = data.length;
    let dominationCounter = _.fill(Array(data.length), 0);
    let objectiveMultiplier = _.clone(store.state.problem.outputObj);
    for (let i = 0; i < objectiveMultiplier.length; ++i) {
        objectiveMultiplier[i] = -objectiveMultiplier[i];
    }
    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            // Check each objective for dominance
            let dominance = dominates(data[i].outputs, data[j].outputs, objectiveMultiplier);
            if (dominance === -1) {
                dominationCounter[j] += 1;
            }
            else if (dominance === 1) {
                dominationCounter[i] += 1;
            }
        }
    }
    for (let i = 0; i < n; ++i) {
        data[i].paretoRanking = dominationCounter[i];
    }
}

function dominates(metrics1, metrics2, objective) {
    let nobj = metrics1.length;
    let dominate = _.fill(nobj, 0);

    if (!objective) {
        objective = [];
        for (let i = 0; i < nobj; i++) {
            objective.push(1);
        }
    }

    for (let i = 0; i < nobj; ++i) {
        let val1 = objective[i] * metrics1[i];
        let val2 = objective[i] * metrics2[i];

        if (val1 < val2) {
            dominate[i] = -1;
        }
        else if(val1 > val2) {
            dominate[i] = 1;
        }
    }

    if (!dominate.includes(-1) && dominate.includes(1)) {
        return 1;
    }
    else if (dominate.includes(-1) && !dominate.includes(1)) {
        return -1;
    }

    return 0;
}

export function roundNum(num, decimal) {
    if (decimal) {
        return num.toFixed(decimal);
    }
    else {
        return num.toFixed(3);
    }
}


/*
    Removes the outermost parentheses from the expression
*/
export function removeOuterParentheses(expression, outerLevel) {
    let cleanExpression = _.clone(expression);
    let newOuterLevel;
    if (outerLevel !== undefined) {
        newOuterLevel = outerLevel;
    }
    else {
        newOuterLevel = 0;
    }

    let hasOuter = cleanExpression[0] === '(';
    while (hasOuter) {
        let level = 1;
        for (let i = 1; i < cleanExpression.length - 1; ++i) {
            if (cleanExpression[i] === '(') {
                ++level;
            }
            else if (cleanExpression[i] === ')') {
                --level;
            }

            if (level === 0) {
                hasOuter = false;
            }
        }

        if (hasOuter) {
            cleanExpression = cleanExpression.substring(1, cleanExpression.length-1);
            hasOuter = cleanExpression[0] === '(';
            newOuterLevel++;
        }
    }

    if (outerLevel !== undefined) {
        return {
            expression: cleanExpression,
            level: newOuterLevel
        }
    }
    else {
        return cleanExpression;
    }
}

export function getNestedParenthesisDepth(expression) {
    let len = expression.length;
    let level = 0;
    let maxLevel = 0;
    for (let i = 0; i < len; i++) {
        if (expression[i] === '(') {
            level++;
            if (level > maxLevel) {
                maxLevel = level;
            }
        }
        else if (expression[i] === ')') {
            level--;
        }
    }
    return maxLevel;
}

export function collapseParenIntoSymbol(expression) {
    let len = expression.length;
    let modifiedExpression = '';
    let level = 0;
    for (let i = 0; i < len; i++) {

        if (expression[i] === '(') {
            level++;
        }
        else if (expression[i] === ')') {
            level--;
        }
        if (expression[i] === '(' && level === 1) {
            modifiedExpression += expression[i];
        }
        else if(level >= 1) {
            modifiedExpression += 'X';
        }
        else {
            modifiedExpression += expression[i];
        }
    }
    return modifiedExpression;
}

export function constructExpressionTree(expression, depth){
    let nextIndex = 0;
    // Initial checks
    if (depth == null) {
        depth = 0;
    }
    if (!expression) {
        return {};
    }

    let newDepth = depth;
    let newExpression = expression;
    let _newExpression = '';

    // Remove outer parenthesis
    let parenthesesRemoved = removeOuterParentheses(newExpression, newDepth);
    newExpression = parenthesesRemoved.expression;
    newDepth = +parenthesesRemoved.level;
    if (getNestedParenthesisDepth(newExpression) === 0) { // Given expression does not have a nested structure
        if (newExpression.indexOf('&&') === -1 && newExpression.indexOf('||') === -1) {
            // There is no logical connective: return single feature (leaf node)
            return {
                depth: newDepth,
                type: 'leaf',
                name: newExpression,
                children: null,
                id: nextIndex++
            };
        }
        else {
            // There are logical connectives
            _newExpression = newExpression;
        }
    }
    else {
        // Hide the nested structure by replacing whatever's inside parentheses with special characters (currently using X's).
        _newExpression = collapseParenIntoSymbol(newExpression);
    }

    let logic = '';
    let name = '';
    if (_newExpression.indexOf('&&') !== -1){
        logic = '&&';
        name = 'AND';
    }
    else {
        logic = '||';
        name = 'OR';
    }
    let thisNode = {
        depth: newDepth,
        type: 'logic',
        name: name,
        children: [],
        id: nextIndex++
    };
    let _childrenExpressions = _newExpression.split(logic);
    let childrenExpressions = newExpression;
    for(let i = 0; i < _childrenExpressions.length; i++){

        // Get the length of each outermost level feature expression from _childExpression
        let _childExpression = _childrenExpressions[i];
        if(childrenExpressions.startsWith('&&') || childrenExpressions.startsWith('||')){
            childrenExpressions = childrenExpressions.slice(2);
        }

        // Use the length obtained to slice the actual expression
        let childExpression = childrenExpressions.slice(0,_childExpression.length);

        // Update the rest of the feature expression to the next iteration
        childrenExpressions = childrenExpressions.slice(_childExpression.length);

        // Construct the tree for an individual outermost level feature
        let child = constructExpressionTree(childExpression, newDepth + 1);
        thisNode.children.push(child);
    }

    return thisNode;
}

export function expressionTreeDepthFinder(expressionTree, depth){ //--> Pass in 0 initially
    depth = depth + 1;
    let children = expressionTree['children'];
    if(children === null){
        return depth;
    }
    else{
        let max_depth = 0;
        let temp_depth = 0;
        for(let x = 0; x < children.length; x++){
            temp_depth = expressionTreeDepthFinder(children[x], depth);
            if(temp_depth > max_depth){
                max_depth = temp_depth;
            }
        }
        return max_depth;
    }
}

export function expressionTreeLeafType(leaf){
    let fullExpression = leaf['name'];
    let expression = fullExpression.substring(1, fullExpression.length-1);
    let endPosition = expression.indexOf('[');
    return expression.substring(0,endPosition);
}

export function expressionTreeLeafPhrase(leaf, type){
    if(type === "inOrbit"){return inOrbitPhrase(leaf);}
    else if(type === "notInOrbit"){return notInOrbitPhrase(leaf);}
    else if(type === "emptyOrbit"){return emptyOrbitPhrase(leaf);}
    else if(type === "present"){return presentPhrase(leaf);}
    else if(type === "absent"){return absentPhrase(leaf);}
    else if(type === "separate"){return separatePhrase(leaf);}
    else if(type === "together"){return togetherPhrase(leaf);}
    else if(type === "numOrbits"){return numOrbitsPhrase(leaf);}
    else {
        let phrase = type + ' expression type not recognized';
        return phrase;
    }
}

export function inOrbitPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let orbit_indicies = featureArg.split(';')[0].split(',');
    let orbit = smap.index2DisplayName(orbit_indicies[0], 'orbit');
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = orbit + ' contains ' + instrument_string;
    return phrase;
} //Done

export function notInOrbitPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let orbit_indicies = featureArg.split(';')[0].split(',');
    let orbit = smap.index2DisplayName(orbit_indicies[0], 'orbit');
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = orbit + ' does not contain ' + instrument_string;
    return phrase;
} //Done

export function emptyOrbitPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let orbits = featureArg.split(';')[0].split(',');
    let orbit = smap.index2DisplayName(orbits[0], 'orbit');
    let phrase = orbit + ' contains no instruments';
    return phrase;
} //Done

export function presentPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = 'Instruments: ' + instrument_string + ' are present';
    return phrase;
} // Done

export function absentPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = 'Instruments: ' + instrument_string + ' are not present';
    return phrase;
} // Done

export function separatePhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = 'No orbit contains all these instruments: ' + instrument_string;
    return phrase;
} // Done

export function togetherPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-1);
    let instrument_indicies = featureArg.split(';')[1].split(',');
    let instruments = [];
    let instrument_string = '';
    for(let x = 0; x < instrument_indicies.length; x++){
        let index = instrument_indicies[x];
        let inst = smap.index2DisplayName(index, 'instrument');
        instruments.push(inst);
        if(x === (instrument_indicies.length - 1)){
            instrument_string = instrument_string + '' + inst + '' + ' ';
        }
        else{
            instrument_string = instrument_string + '' + inst + '' + ' | ';
        }
    }
    let phrase = 'Assigned together to any orbit<br>' + instrument_string;
    return phrase;
} // Done

export function numOrbitsPhrase(leaf){
    let fullExpression = leaf['name'];
    let featureArg = fullExpression.split('[')[1];
    featureArg = featureArg.substring(0, featureArg.length-2);
    let num_orbits = featureArg.split(';')[2].split(',');
    let phrase = num_orbits + ' non-empty orbits';
    return phrase;
} // Done

// numInstruments

// numInstrumentsInOrbit

export function featureExpressionToSentence(expression){
    console.log(expression);
    let expressionTree = constructExpressionTree(expression);
    console.log(expressionTree);
    let treeDepth = expressionTreeDepthFinder(expressionTree, 0);
    console.log(treeDepth);

    if(treeDepth > 2){return -1;}
    else if(treeDepth === 2){
        let sentence = '';
        let phrase_list = [];
        let children = expressionTree['children'];
        let logic = expressionTree['name'];
        let phrase_object = {};
        for(let x = 0; x < children.length; x++){
            let child = children[x];
            let childType = expressionTreeLeafType(child);
            let phrase = expressionTreeLeafPhrase(child, childType);
            if(!(childType in phrase_object)){phrase_object[childType] = [];}
            phrase_object[childType].push(phrase);
        }
        let keys = Object.keys(phrase_object);
        for(let x = 0; x < keys.length; x++){
            let key = keys[x];
            let phrases = phrase_object[key];
            for(let y = 0; y < phrases.length; y++){
                let phrase = phrases[y];
                phrase_list.push(phrase);
                sentence = sentence + phrase + ' ';
                sentence = sentence + '' + logic + '' + ' '; //-------------------------------Add <br>
            }
        }
        phrase_list.push(logic);
        if(logic === 'AND'){sentence = sentence.substring(0,sentence.length-4);}
        else if(logic === 'OR'){sentence = sentence.substring(0,sentence.length-3);}
        return phrase_list
    }
    else{
        let childType = expressionTreeLeafType(expressionTree);
        let phrase = expressionTreeLeafPhrase(expressionTree, childType);
        return [phrase];
    }
}




























