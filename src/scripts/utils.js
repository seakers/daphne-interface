export const INITIALIZE_FEATURE_APPLICATION = "initialize_feature_application";

import * as _ from 'lodash-es';
import store from '../store';

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
