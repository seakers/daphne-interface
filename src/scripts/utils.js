export const INITIALIZE_FEATURE_APPLICATION = "initialize_feature_application";

import * as _ from 'lodash-es';
import store from '../store';

export function calculateParetoRanking(data) {
    let n = data.length;
    let dominationCounter = _.fill(Array(data.length), 0);
    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            // Check each objective for dominance
            if (dominates(data[j].outputs, data[i].outputs, store.state.problem.outputObj)) {
                dominationCounter[i] += 1;
            }
            else {
                dominationCounter[j] += 1;
            }
        }
    }
    for (let i = 0; i < n; ++i) {
        data[i].paretoRanking = dominationCounter[i];
    }
}

function dominates(metrics1, metrics2, objective) {
    let atLeastAsGoodAs = true;
    let betterThanInOne = false;
    if (!objective) {
        objective = [];
        for (let i = 0; i < metrics1.length; i++) {
            objective.push(1);
        }
    }
    for (let i = 0; i < metrics1.length; i++) {
        let val1 = objective[i] * metrics1[i];
        let val2 = objective[i] * metrics2[i];

        if (val1 > val2) {
            // First better than Second
            betterThanInOne = true;
        }
        else if (val1 < val2) {
            // First is worse than Second
            atLeastAsGoodAs = false;
        }
    }
    return atLeastAsGoodAs && betterThanInOne; // First dominates Second
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
    while (cleanExpression[0] === '(' && cleanExpression[cleanExpression.length-1] === ')') {
        cleanExpression = cleanExpression.substring(1, cleanExpression.length-1);
        newOuterLevel++;
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
