class EOSSLabel {

    constructor(eoss) {
    }


    /*
     * @param {int} index: Number indicating either an oribt or an instrument
     * @param {String} type: Type of the input name. Could be either "orbit" or "instrument"
     * @returns The actual name of an instrument or an orbit
     */
    index2ActualName(index, type) {
        if (type == "orbit") {
            return this.eoss.orbitList[index];
        }
        else if (type == "instrument") {
            return this.eoss.instrumentList[index];
        }
        else {
            return "NamingError";
        }
    }


    /*
     * @param {int} index: Number indicating either an orbit or an instrument
     * @param {String} type: Type of the variable. Could be either "orbit" or "instrument"
     */
    index2DisplayName(index, type) {
        if (this.disabled) {
            return this.index2ActualName(index,type);
        }

        if (type == "orbit") {
            return this.orbit_relabeled[index];
        }
        else if (type == "instrument") {
            return this.instrument_relabeled[index];
        }
        else {
            return "NamingError";
        }
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


    pp_feature_single(expression) {
        let exp = expression;
        if (exp[0] === "{"){
            exp = exp.substring(1, exp.length-1);
        }
        let featureName = exp.split("[")[0];

        if (featureName === "paretoFront" || featureName === 'FeatureToBeAdded' ||
        featureName === 'AND' || featureName === 'OR') {
            return exp;
        }

        if (featureName[0] == '~') {
            featureName = 'NOT '+ featureName.substring(1);
        }

        let featureArg = exp.split("[")[1];
        featureArg = featureArg.substring(0, featureArg.length-1);

        let orbits = featureArg.split(";")[0].split(",");
        let instruments = featureArg.split(";")[1].split(",");
        let numbers = featureArg.split(";")[2];

        let pporbits="";
        let ppinstruments="";
        for (let i = 0; i < orbits.length; i++) {
            if (orbits[i].length === 0) {
                continue;
            }
            if (i > 0) {
                pporbits = pporbits + ",";
            }
            pporbits = pporbits + this.index2DisplayName(orbits[i], "orbit");
        }
        for (let i = 0; i < instruments.length; i++) {
            if (instruments[i].length === 0) {
                continue;
            }
            if (i > 0) {
                ppinstruments = ppinstruments + ",";
            }
            ppinstruments = ppinstruments + this.index2DisplayName(instruments[i], "instrument");
        }
        let ppexpression = featureName + "[" + pporbits + ";" + ppinstruments + ";" + numbers + "]";

        return ppexpression;
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
