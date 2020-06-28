class EOSSLabel {

    constructor(eoss) {
    }

    actualName2DisplayName(name, type) {
        if (this.disabled) {
            return name;
        }
        name = name.trim();
        if (type == "orbit") {
            let nth = this.eoss.orbitList.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.orbit_relabeled[nth];
        }
        else if (type == "instrument") {
            let nth = this.eoss.instrumentList.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.instrument_relabeled[nth];
        }
        else {
            return name;
        }
    }


    displayName2ActualName(name, type) {
        if (this.disabled) {
            return name;
        }
        name = name.trim();
        if (type == "orbit") {
            let nth = this.orbit_relabeled.indexOf(name);
            if (nth==-1) { // Couldn't find the name from the list
                return name;
            }
            return this.eoss.orbitList[nth];
        }
        else if (type=="instrument") {
            let nth = this.instrument_relabeled.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.eoss.instrumentList[nth];
        }
        else {
            return name;
        }
    }


    pp_feature_type(expression) {
        if (expression.indexOf('[') == -1) {
            return expression;
        }
        let type = '';
        let erase = false;
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] == '[') {
                erase = true;
            }
            else if (expression[i] == ']') {
                erase = false;
            }
            else if (!erase) {
                type = type + expression[i];
            }
        }
        return type;
    }

    pp_feature(expression) {
        let output = '';
        let save = false;
        let savedString = '';

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] == '{') {
                save = true;
                savedString = '{';
            }
            else if (expression[i] == '}') {
                save = false;
                savedString = savedString + '}';
                output = output + '{' + this.pp_feature_single(savedString) + '}';
            }
            else {
                if (save) {
                    savedString = savedString + expression[i];
                }
                else {
                    output = output + expression[i];
                }
            }
        }
        return output;
    }
}
