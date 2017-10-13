"use strict";

const DATA_UPDATED = "data_updated";
const DATA_PROCESSED = "data_processed";

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
