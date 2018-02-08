// Import templates
import feature_application from '../data/functionalities/feature_application.html';

export default class Daphne {
    constructor() {
        this.data = null; // Array containing the imported data

        // Instances of Classes
        this.label = null;
        this.filter = null;
        this.featureApplication = null;

        // Available functionalities
        this.functionalities = new Map();
        this.functionalities.set("feature_application", { minSize: "one-third", maxRepeat: 1, instances: new Map() });

        this.websocket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/api/daphne");

        this.websocket.onopen = function() {
            console.log('Web Socket Conenction Made');
        };

        this.websocket.onmessage = function (data) {
            //ws.send(JSON.stringify(data));
        }
    }
}
