let PubSub = require('pubsub-js');
let $ = require('jquery');

// Import templates
import daphne_answer from '../data/functionalities/daphne_answer.html';
import data_mining from '../data/functionalities/data_mining.html';
import design_inspector from '../data/functionalities/design_inspector.html';
import feature_application from '../data/functionalities/feature_application.html';
import filter from '../data/functionalities/filter.html';

export default class Daphne {
    constructor() {
        this.data = null; // Array containing the imported data

        // Instances of Classes
        this.label = null;
        this.filter = null;
        this.dataMining = null;
        this.featureApplication = null;

        // Available functionalities
        this.functionalities = new Map();
        this.functionalities.set("daphne_answer", { minSize: "one-third", maxRepeat: 1, instances: new Map() });
        this.functionalities.set("data_mining", { minSize: "one-third", maxRepeat: 1, instances: new Map() });
        this.functionalities.set("filter", { minSize: "one-third", maxRepeat: 1, instances: new Map() });
        this.functionalities.set("feature_application", { minSize: "one-third", maxRepeat: 1, instances: new Map() });

        this.websocket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/api/daphne");

        this.websocket.onopen = function() {
            console.log('Web Socket Conenction Made');
        };

        this.websocket.onmessage = function (data) {
            //ws.send(JSON.stringify(data));
        }
    }

    async addNewFunctionality(functionality) {
        function columnWrap(html, size) {
            return "<div class=\"column is-" + size + "-desktop is-full-mobile\">" + html + "</div>\n";
        }

        let funcInfo = this.functionalities.get(functionality);
        if (funcInfo.instances.size < funcInfo.maxRepeat) {
            try {
                let dataResponse = await fetch("./assets/data/functionalities/" + functionality + ".html");

                if (dataResponse.ok) {
                    // Add the new functionality
                    let funcHtml = await dataResponse.text();
                    let funcId = functionality + funcInfo.instances.size;
                    let minSize = funcInfo.minSize;
                    let newFunc = $(columnWrap(funcHtml, minSize));

                    // Write the correct values and add interactions
                    newFunc.find("." + functionality).first().attr("id", funcId);
                    $("#" + functionality + "_menu").addClass("active");

                    // Add all the interactions for the functionality
                    // Remove
                    newFunc.find("." + functionality + " .close-panel").on("click", event => {
                        funcInfo.instances.delete(funcId);
                        $("#" + funcId).parent().remove();
                        if (funcInfo.instances.size == 0) {
                            $("#" + functionality + "_menu").removeClass("active");
                        }
                        PubSub.publish(functionality + "_removed", funcId);
                        event.preventDefault();
                    });

                    // Reduce
                    newFunc.find("." + functionality + " .reduce-panel").on("click", event => {
                        if (!$("#" + funcId).parent().hasClass("is-" + minSize + "-desktop")) {
                            // Make column smaller
                            let storedSize = funcInfo.instances.get(funcId);
                            let funcSize = "is-" + storedSize + "-desktop";
                            let smallerSizeInfo = this.sizeScale[this.sizeScale.indexOf(storedSize)-1];
                            let smallerSize = "is-" + smallerSizeInfo + "-desktop";
                            $("#" + funcId).parent().removeClass(funcSize);
                            $("#" + funcId).parent().addClass(smallerSize);
                            funcInfo.instances.set(funcId, smallerSizeInfo);

                            // Change icon to grey if needed and ensure maximize is changed back to normal
                            if (smallerSizeInfo === minSize) {
                                $("#" + funcId + " .reduce-panel").addClass("has-text-grey");
                            }
                            $("#" + funcId + " .grow-panel").removeClass("has-text-grey");
                        }
                        event.preventDefault();
                    });

                    // Grow
                    newFunc.find("." + functionality + " .grow-panel").on("click", event => {
                        let scalesLength = this.sizeScale.length;
                        if (!$("#" + funcId).parent().hasClass("is-" + this.sizeScale[scalesLength-1] + "-desktop")) {
                            // Make column bigger
                            let storedSize = funcInfo.instances.get(funcId);
                            let funcSize = "is-" + storedSize + "-desktop";
                            let biggerSizeInfo = this.sizeScale[this.sizeScale.indexOf(storedSize)+1];
                            let biggerSize = "is-" + biggerSizeInfo + "-desktop";
                            $("#" + funcId).parent().removeClass(funcSize);
                            $("#" + funcId).parent().addClass(biggerSize);
                            funcInfo.instances.set(funcId, biggerSizeInfo);

                            // Change icon to grey if needed and ensure minimze is changed back to normal
                            if (biggerSizeInfo === this.sizeScale[scalesLength-1]) {
                                $("#" + funcId + " .grow-panel").addClass("has-text-grey");
                            }
                            $("#" + funcId + " .reduce-panel").removeClass("has-text-grey");
                        }
                        event.preventDefault();
                    });

                    // Add to columns and to the array
                    $("#functionalities_list").append(newFunc);
                    funcInfo.instances.set(funcId, minSize);

                    // Consider it added
                    PubSub.publish(functionality + "_added", funcId);
                }
                else {
                    console.error("Error downloading the template.");
                }
            }
            catch(e) {
                console.error("Networking error:", e);
            }
        }
    }
}
