//        A          B         C          D         E        F
// {"ACE_ORCA","ACE_POL","ACE_LID","CLAR_ERB","ACE_CPR","DESD_SAR",
// 
//       G        H           I            J         K              L
// "DESD_LID","GACM_VIS","GACM_SWIR","HYSP_TIR","POSTEPS_IRS","CNES_KaRIN"};
// 
//      1000                2000            3000        4000            5000
//{"LEO-600-polar-NA","SSO-600-SSO-AM","SSO-600-SSO-DD","SSO-800-SSO-DD","SSO-800-SSO-PM"};


class EOSSLabel extends Label {

    constructor(eoss) {
        super();
        this.disabled = false;
        
        this.orbit_relabeled = ["1000","2000","3000","4000","5000"];
        this.instrument_relabeled = ["A","B","C","D","E","F","G","H","I","J","K","L"];

        this.eoss = eoss;
    }


    /*
     * @param {int} index: Number indicating either an oribt or an instrument
     * @param {String} type: Type of the input name. Could be either "orbit" or "instrument"
     * @returns The actual name of an instrument or an orbit
     */
    index2ActualName(index, type) {
        if (type == "orbit") {
            return this.eoss.orbit_list[index];
        }
        else if (type == "instrument") {
            return this.eoss.instrument_list[index];
        }
        else {
            return "Naming Error";
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
            return "Naming Error";
        }
    }


    actualName2Index(name, type) {
        name = name.trim();
        if (name.indexOf(",") != -1) {
            let names = name.split(",");
            let newName = "";
            for (let i = 0; i < names.length; i++) {
                let comma = ",";
                if (i == 0){
                    comma = "";
                }
                if (type == "orbit"){
                    newName = newName + comma + eoss.orbit_list.indexOf(names[i]);
                }
                else if (type == "instrument") {
                    newName = newName + comma + eoss.instrument_list.indexOf(names[i]);
                }
                else {
                    newName = newName + comma + "Naming Error";
                }              
            }
            return newName;
        }
        else {
            if (type == "orbit") {
                return eoss.orbit_list.indexOf(name);
            }
            else if (type == "instrument") {
                return eoss.instrument_list.indexOf(name);
            }
            else {
                return "Naming Error";
            }        
        }
    }


    displayName2Index(input, type) {
        if (this.disabled) {
            return this.actualName2Index(input,type);
        }

        input = input.trim();
        let split = input.split(',');
        let output = '';
        for (let i = 0; i < split.length; i++) {
            let name = split[i];

            if (this.orbit_relabeled.indexOf(name) == -1 && this.instrument_relabeled.indexOf(name) == -1) {
                alert('Invalid input argument');
            }
            if (i > 0)
                output = output + ",";

            if (type == "orbit") {
                output = output + this.orbit_relabeled.indexOf(name);
            }
            else if (type == "instrument") {
                output = output + this.instrument_relabeled.indexOf(name);
            }
            else {
                return "Naming Error";
            }
        }
        return output;
    }


    actualName2DisplayName(name, type) {
        if (this.disabled) {
            return name;
        }
        name = name.trim();
        if (type == "orbit") {
            let nth = this.eoss.orbit_list.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.orbit_relabeled[nth]; 
        }
        else if (type == "instrument") {
            let nth = this.eoss.instrument_list.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.instrument_relabeld[nth];
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
            return this.eoss.orbit_list[nth];
        }
        else if (type=="instrument") {
            let nth = this.instrument_relabeled.indexOf(name);
            if (nth == -1) { // Couldn't find the name from the list
                return name;
            }
            return this.eoss.instrument_list[nth];
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
                feature_expression = savedString;
                output = output + '{' + this.pp_feature_single(feature_expression) + '}';
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
