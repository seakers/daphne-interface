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
        this.avaliableFunctionalities = new Map();
        this.avaliableFunctionalities.set("daphne_answer", { min_size: "one-third" });
        this.avaliableFunctionalities.set("design_inspector", { min_size: "one-third" });
        this.avaliableFunctionalities.set("data_mining", { min_size: "two-thirds" });

        this.responseOutput = {
            text: this.showText,
            list: this.showList
        };

        this.sizeScale = [
            "one-third",
            "two-thirds",
            "full"
        ];

        this.insertedFunctionalities = new Map();

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
        this.avaliableFunctionalities.forEach((value, key) => {
            document.querySelector("#" + key + "_menu").addEventListener("click", event => {
                this.add_new_functionality(key);
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
        try {
            let req_data = new FormData();
            req_data.append("command", command);
            let data_response = await fetch(
                "/api/daphne/command",
                {
                    method: "POST",
                    body: req_data,
                    credentials: "same-origin"
                }
            );

            if (data_response.ok) {
                let data = await data_response.json();
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


    processResponse(response) {
        // TODO: This can be more complex, but for now just paste text into text area
        $("#daphne_answer > div.panel-block").html(this.responseOutput[response["visual_answer_type"]](response["visual_answer"]));
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
            let data_response = await fetch(
                "/api/ifeed/import-data/",
                {
                    method: "POST",
                    body: req_data,
                    credentials: "same-origin"
                }
            );

            if (data_response.ok) {
                this.data = await data_response.json();

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


    async add_new_functionality(functionality) {
        function column_wrap(html, size) {
            return "<div class=\"column is-" + size + "-desktop is-full-mobile\">" + html + "</div>\n";
        }

        if (!this.insertedFunctionalities.has(functionality)) {
            try {
                let data_response = await fetch("./assets/data/functionalities/" + functionality + ".html");

                if (data_response.ok) {
                    // Add the new functionality
                    let func_html = await data_response.text();
                    let func_id = "#" + functionality;
                    let min_size = this.avaliableFunctionalities.get(functionality).min_size;
                    $("#functionalities_list").append(column_wrap(func_html, min_size));
                    $(func_id + "_menu").addClass("active");

                    // Add all the interactions for the functionality
                    // Remove
                    $(func_id + " .close-panel").on("click", event => {
                        this.insertedFunctionalities.delete(functionality);
                        $(func_id).parent().remove();
                        $(func_id + "_menu").removeClass("active");
                        PubSub.publish(functionality + "_removed");
                        event.preventDefault();
                    });

                    // Reduce
                    $(func_id + " .reduce-panel").on("click", event => {
                        if (!$(func_id).parent().hasClass("is-" + min_size + "-desktop")) {
                            // Make column smaller
                            let func_info = this.insertedFunctionalities.get(functionality);
                            let func_size = "is-" + func_info.size + "-desktop";
                            let smaller_size_info = this.sizeScale[this.sizeScale.indexOf(func_info.size)-1];
                            let smaller_size = "is-" + smaller_size_info + "-desktop";
                            $(func_id).parent().removeClass(func_size);
                            $(func_id).parent().addClass(smaller_size);
                            this.insertedFunctionalities.set(functionality, {size: smaller_size_info});

                            // Change icon to grey if needed and ensure maximize is changed back to normal
                            if (smaller_size_info === min_size) {
                                $(func_id + " .reduce-panel").addClass("has-text-grey");
                            }
                            $(func_id + " .grow-panel").removeClass("has-text-grey");
                        }
                        event.preventDefault();
                    });

                    // Grow
                    $(func_id + " .grow-panel").on("click", event => {
                        let scalesLength = this.sizeScale.length;
                        if (!$(func_id).parent().hasClass("is-" + this.sizeScale[scalesLength-1] + "-desktop")) {
                            // Make column bigger
                            let func_info = this.insertedFunctionalities.get(functionality);
                            let func_size = "is-" + func_info.size + "-desktop";
                            let bigger_size_info = this.sizeScale[this.sizeScale.indexOf(func_info.size)+1];
                            let bigger_size = "is-" + bigger_size_info + "-desktop";
                            $(func_id).parent().removeClass(func_size);
                            $(func_id).parent().addClass(bigger_size);
                            this.insertedFunctionalities.set(functionality, {size: bigger_size_info});

                            // Change icon to grey if needed and ensure minimze is changed back to normal
                            if (bigger_size_info === this.sizeScale[scalesLength-1]) {
                                $(func_id + " .grow-panel").addClass("has-text-grey");
                            }
                            $(func_id + " .reduce-panel").removeClass("has-text-grey");
                        }
                        event.preventDefault();
                    });

                    // Consider it added
                    PubSub.publish(functionality + "_added");
                    this.insertedFunctionalities.set(functionality, {size: this.avaliableFunctionalities.get(functionality).min_size});
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

    await daphne.add_new_functionality("design_inspector");
    await daphne.add_new_functionality("data_mining");
    await daphne.add_new_functionality("daphne_answer");
} ());