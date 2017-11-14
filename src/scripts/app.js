"use strict";

class Daphne {
    constructor() {
        this.data = null; // Array containing the imported data
    
        // Instances of Classes
        this.problem = null; // Problem-specific class
        this.label = null;
        this.tradespacePlot = null;
        this.filter = null;
        this.dataMining = null;
        this.featureApplication = null;
    
        // Available functionalities
        this.functionalities = new Map();
        this.functionalities.set("daphne_answer", { min_size: "one-third", max_repeat: 1, instances: new Map() });
        this.functionalities.set("design_inspector", { min_size: "one-third", max_repeat: 1, instances: new Map() });
        this.functionalities.set("data_mining", { min_size: "two-thirds", max_repeat: 1, instances: new Map() });
        this.functionalities.set("cheatsheet", { min_size: "one-third", max_repeat: 1000, instances: new Map() });

        this.responseOutput = {
            text: this.showText,
            list: this.showList
        };

        this.sizeScale = [
            "one-third",
            "two-thirds",
            "full"
        ];

        //Interaction states
        this.UI_states = {
            selection_changed: true
        };

        PubSub.subscribe(DATA_PROCESSED, (msg, data) => {
            this.data = data;
        });

        // Voice recognition
        if (annyang) {
            annyang.addCallback('result', phrases => {
                $("input[name=command]").val(phrases[0]);
                this.executeCommand(phrases[0]);
            });

            annyang.debug();

            // Tell KITT to use annyang
            SpeechKITT.annyang();

            // Define a stylesheet for KITT to use
            SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

            // Render KITT's interface
            SpeechKITT.vroom();

            SpeechKITT.startRecognition();
        }

        // Setup the Daphne command input
        $("#send_command").on("click", event => {
            this.executeCommand($("input[name=command]").val());
        });

        document.querySelector("input[name=command]").addEventListener("keyup", event => {
            if(event.key !== "Enter") return;
            document.querySelector("#send_command").click();
            event.preventDefault();
        });

        // Setup the functionalities menu
        this.functionalities.forEach((value, key) => {
            document.querySelector("#" + key + "_menu").addEventListener("click", event => {
                this.addNewFunctionality(key);
                event.preventDefault();
            });
        });
    }


    showText(text) {
        return "<p>" + text + "</p>";
    }


    showList(list) {
        let ret = "<ul>";
        list.forEach(item => {
            ret += "<li>" + item + "</li>";
        });
        ret += "</ul>";
        return ret;
    }


    async executeCommand(command) {
        if (command == "stop") {
            responsiveVoice.cancel();
        }
        else {
            try {
                let req_data = new FormData();
                req_data.append("command", command);
                let dataResponse = await fetch(
                    "/api/daphne/command",
                    {
                        method: "POST",
                        body: req_data,
                        credentials: "same-origin"
                    }
                );

                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    this.processResponse(data["response"]);
                }
                else {
                    console.error("Error processing the command.");
                }
            }
            catch(e) {
                console.error("Networking error:", e);
            }
        }
    }


    processResponse(response) {
        $(".daphne_answer > div.panel-block").html(this.responseOutput[response["visual_answer_type"]](response["visual_answer"]));
        responsiveVoice.speak(response["voice_answer"]);
    }


    get_data_ids(data) {
        if (!data) {
            data = this.data;
        }
        
        let ids = [];
        for(let i = 0; i < data.length; i++) {
            ids.push(data[i].id);
        }
        return ids;
    }
    

    /*
    Imports a new data from a file
    @param path: a string name for the file
    */
    async import_new_data(filename) {
        console.log('Importing data...');

        if (!filename) {
            filename = this.problem.result_filename; 
        }

        try {
            let req_data = new FormData();
            req_data.append("filename", filename);
            let dataResponse = await fetch(
                "/api/ifeed/import-data/",
                {
                    method: "POST",
                    body: req_data,
                    credentials: "same-origin"
                }
            );

            if (dataResponse.ok) {
                this.data = await dataResponse.json();

                if (this.problem.import_callback) {
                    await this.problem.import_callback(this.data);  
                }
                else {
                    console.log("Data preprocessing not defined.");
                }

                PubSub.publish(DATA_UPDATED, this.data);
            }
            else {
                console.error("Error accessing the data.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    }

    
    calculate_pareto_ranking(limit) {  
        let rank = 0;
        
        if (!limit) {
            limit = 15;
        }
        
        let archs = this.data;
        
        while (archs.length > 0) {
            let remaining = [];
            let n = archs.length;

            if (rank > limit) {
                break;
            }

            for (let i = 0; i < n; i++) {
                let non_dominated = true;
                let this_arch = archs[i];
                
                for (let j = 0; j < n; j++) {
                    if (i === j) {
                        continue;
                    }
                    else if (dominates(archs[j].outputs, this_arch.outputs, this.problem.output_obj)){
                        non_dominated = false;
                    }
                }

                if (non_dominated === true) {
                    archs[i].pareto_ranking = rank;
                }
                else {
                    remaining.push(archs[i]);
                }
            }

            rank++;
            archs = remaining;
        }
    }


    async addNewFunctionality(functionality) {
        function columnWrap(html, size) {
            return "<div class=\"column is-" + size + "-desktop is-full-mobile\">" + html + "</div>\n";
        }

        let funcInfo = this.functionalities.get(functionality);
        if (funcInfo.instances.size < funcInfo.max_repeat) {
            try {
                let dataResponse = await fetch("./assets/data/functionalities/" + functionality + ".html");

                if (dataResponse.ok) {
                    // Add the new functionality
                    let funcHtml = await dataResponse.text();
                    let funcId = functionality + funcInfo.instances.size;
                    let minSize = funcInfo.min_size;
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

(async function () {

    // General Code

    let daphne = new Daphne();

    daphne.problem = new EOSS(daphne);
    daphne.label = new EOSSLabel(daphne.problem);
    daphne.tradespacePlot = new TradespacePlot(daphne.problem.output_list);
    daphne.dataMining = new DataMining(daphne.tradespacePlot, daphne.label);

    daphne.import_new_data().then(() => {
        daphne.calculate_pareto_ranking();
    });

    let sortable_list = document.getElementById('functionalities_list');
    Sortable.create(sortable_list, {
        handle: '.panel-heading',
        animation: 150
    });

    await daphne.addNewFunctionality("design_inspector");
    await daphne.addNewFunctionality("data_mining");
    await daphne.addNewFunctionality("daphne_answer");
} ());