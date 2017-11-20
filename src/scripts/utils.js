"use strict";

const DATA_UPDATED = "data_updated";
const DATA_PROCESSED = "data_processed";
const ARCH_SELECTED = "arch_selected";
const SELECTION_UPDATED = "selection_updated";
const APPLY_FILTER = "apply_filter";

const INITIALIZE_FEATURE_APPLICATION = "initialize_feature_application";
const UPDATE_FEATURE_APPLICATION = "update_feature_application";

function dominates(metrics1, metrics2, objective) {
    
    let at_least_as_good_as = true;
    let better_than_in_one = false;
    
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
            better_than_in_one = true;
            
        }
        else if (val1 < val2) {
            // First is worse than Second
            at_least_as_good_as = false;
        }
    }
    
    
    if (at_least_as_good_as && better_than_in_one) {
        return true; // First dominates Second
    }
    else {
        return false;
    }
}

function round_num(num, decimal) {
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
function remove_outer_parentheses(expression, outer_level){
	
    var new_expression = expression;
    var out = {expression:new_expression,level:outer_level};
    
    
    if(expression===null){
       return '';
    }
	else if(expression[0]!="(" || expression[expression.length-1]!=")"){
		// Return if the expression does not start with "(" or ")".
	}else{
		var leng = expression.length;
		var level = 0;
		var paren_end = -1;
		for(var i=0;i<leng;i++){
			if(expression[i]==="("){
				level++;
			}
			else if(expression[i]===")"){
				level--;
				if(level==0){
					paren_end = i;
					break;
				}
			}
		}
		if(paren_end == leng-1){
            new_expression = expression.substring(1,leng-1);
            out = remove_outer_parentheses(new_expression, outer_level+1);
		}
	}
    
    if(typeof outer_level === "undefined" || outer_level === null){
        // If outer_level is undefined, return string expression
        return new_expression;
    }else{
        // If outer_level is given, return dict
        return out;
    }
}

function get_nested_parenthesis_depth(expression){
	var leng = expression.length;
	var level = 0;
	var maxLevel = 0;
	for(var i=0;i<leng;i++){
		if(expression[i]==="("){
			level++;
			if(level>maxLevel) maxLevel=level;
		}
		else if(expression[i]===")"){
			level--;
		}
	}
	return maxLevel;
}

function collapse_paren_into_symbol(expression){
	var leng = expression.length;
	var modified_expression = "";
	var level = 0;
	for(var i=0;i<leng;i++){

		if(expression[i]==="("){
			level++;
		}
		else if(expression[i]===")"){
			level--;
		}
		if(expression[i]==="(" && level==1){
			modified_expression=modified_expression + expression[i];
		}
		else if(level>=1){
			modified_expression=modified_expression + "X";
		}else{
			modified_expression=modified_expression + expression[i];
		}
	}
	return modified_expression;
}

