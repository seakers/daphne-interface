// Import templates
import feature_application from '../data/functionalities/feature_application.html';

export default class Daphne {
    constructor() {
        this.data = null; // Array containing the imported data

        // Instances of Classes
        this.featureApplication = null;

        // Available functionalities
        this.functionalities = new Map();
        this.functionalities.set("feature_application", { minSize: "one-third", maxRepeat: 1, instances: new Map() });
    }
}
