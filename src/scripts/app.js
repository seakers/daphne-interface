"use strict";

class Daphne {
    constructor() {
        this.data = null; // Array containing the imported data
    
        // Instances of Classes
        this.problem = null; // Problem-specific class
        this.label = null;
        this.tradespace_plot = null;
        this.filter = null;
        
        this.data_mining = null;
        this.feature_application = null;

        this.currentMode = 0;
    
        // Available functionalities
        this.avaliable_functionalities = [
            "design_inspector",
            "daphne_answer"
        ];

        this.modeCodes = [
            'No active mode',
            'History mode',
            'iFEED mode',
            'VR mode',
            'Evaluate mode',
            'Criticize mode'
        ];

        this.inserted_functionalities = new Set();

        //Interaction states
        this.UI_states = {
            "selection_changed":true
        };

        PubSub.subscribe(DATA_PROCESSED, (msg, data) => {
            this.data = data;
        });

        // Voice recognition
        if (annyang) {
            annyang.addCallback('result', function(phrases) {
                executeCommand(phrases[0]);
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

        $("#send_command").on("click", event => {
            this.executeCommand($("input[name=command]").val());
        });

    }

    async executeCommand(command) {
        try {
            let req_data = new FormData();
            req_data.append("command", command);
            let data_response = await fetch(
                "/api/daphne/command",
                {
                    method: "POST",
                    body: req_data
                }
            );

            if (data_response.ok) {
                let data = await data_response.json();
                this.processCommand(data["command"], data["command_type"], data["other_info"]);
            }
            else {
                console.error("Error processing the command.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    }

    processCommand(command, command_type, other_info) {
        let real_command_type = command_type;
        if (command_type == -1) {
            real_command_type = this.currentMode;
        }

        if (real_command_type == 0) {
            // Change mode
            this.switchMode(other_info);
        }
        else if (real_command_type == 1) {
            // Send command to history API
            this.askHistoryQuestion(command);
        }
        else if (real_command_type == 2) {
            // Send command to iFEED API
        }
        else if (real_command_type == 3) {
            // Send command to VR API
        }
        else if (real_command_type == 4) {
            // Send command to evaluate API
        }
        else if (real_command_type == 5) {
            // Send command to criticize API
        }
    }

    switchMode(new_mode) {
        this.currentMode = new_mode;
        $("h3#active-mode").html(this.modeCodes[this.currentMode]);
        // TODO: load the active mode commands and the cheatsheet cards with hints for commands like instrument names, mission names, measurements, ifeed things, vr things, etc.
        $("#daphne_answer > div.panel-block").html("<p>Mode changed!</p>");
        responsiveVoice.speak("Mode changed!");
    }

    async askHistoryQuestion(question) {
        try {
            let req_data = new FormData();
            req_data.append("question", question);
            let data_response = await fetch(
                "/api/histdb/question",
                {
                    method: "POST",
                    body: req_data
                }
            );

            if (data_response.ok) {
                this.data = await data_response.json();
                $("#daphne_answer > div.panel-block").html("<p>" + data['answer'] + "</p>");
                responsiveVoice.speak(data["answer"]);
            }
            else {
                console.error("Error answering the question.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
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
                    body: req_data
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
        function column_wrap(html) {
            return "<div class=\"column is-one-third-desktop is-full-mobile\">" + html + "</div>\n";
        }

        if (!this.inserted_functionalities.has(functionality)) {
            try {
                let data_response = await fetch("./assets/data/functionalities/" + functionality + ".html");

                if (data_response.ok) {
                    let func_html = await data_response.text();
                    $("#functionalities_list").append(column_wrap(func_html));
                    $("#" + functionality + "_menu").addClass("active");
                    this.inserted_functionalities.add(functionality);
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

(function () {

    // General Code
    let daphne = new Daphne();

    daphne.problem = new EOSS(daphne);
    daphne.label = new EOSSLabel(daphne.problem);
    daphne.tradespace_plot = new TradespacePlot(daphne.problem.output_list);

    daphne.import_new_data().then(() => {
        daphne.calculate_pareto_ranking();
    });

    daphne.add_new_functionality("daphne_answer");
    daphne.add_new_functionality("design_inspector");
    
} ());