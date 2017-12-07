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
        this.cheatsheetManager = null;
        this.tutorial = null;
    
        // Available functionalities
        this.functionalities = new Map();
        this.functionalities.set("daphne_answer", { min_size: "one-third", max_repeat: 1, instances: new Map() });
        this.functionalities.set("design_inspector", { min_size: "two-thirds", max_repeat: 1, instances: new Map() });
        //this.functionalities.set("data_mining", { min_size: "one-third", max_repeat: 1, instances: new Map() });
        this.functionalities.set("cheatsheet", { min_size: "one-third", max_repeat: 1000, instances: new Map() });
        //this.functionalities.set("filter", { min_size: "one-third", max_repeat: 1, instances: new Map() }); 
        //this.functionalities.set("feature_application", { min_size: "one-third", max_repeat: 1, instances: new Map() }); 

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

        // Experiment
        this.duration = 60*3;//60*10; // 10 minutes
        this.stage = 0;
        this.experiment_data = null;

        PubSub.subscribe(DATA_PROCESSED, (msg, data) => {
            this.data = data;
        });

        PubSub.subscribe(ARCH_ADDED, (msg, new_arch) => {
            let already_there = false;
            this.data.forEach(d => {
                if (d.outputs[0] == new_arch.outputs[0] && d.outputs[1] == new_arch.outputs[1]) {
                    already_there = true;
                }
            });

            if (!already_there) {
                let proc_data = this.problem.preprocessing([new_arch]);
                this.data.push(proc_data[0]);
            }

            PubSub.publish(DATA_UPDATED, this.data);
        });
        
        PubSub.subscribe("start-tutorial", (msg, data) => {
            this.tutorial.run_tutorial();
        });

        // Voice recognition
        /*if (annyang) {
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
        }*/

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
        
        
        //this.websocket = new WebSocket("ws://127.0.0.1:8001/api/daphne"); // Localhost
        this.websocket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/api/daphne");
        
        this.websocket.onopen = function() {
            console.log('Web Socket Conenction Made');
        };

        this.websocket.onmessage = function (data) { 
            //ws.send(JSON.stringify(data));         
        }        
        

    }


    showText(text) {
        return "<div class=\"content\"><p>" + text + "</p></div>";
    }


    showList(list) {
        let ret = "<div class=\"content\"><p>" + list.begin + "</p>";
        ret += "<ul>";
        list.list.forEach(item => {
            ret += "<li>" + item + "</li>";
        });
        ret += "</ul></div>";
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
                // Put loader image
                $(".daphne_answer > div.panel-block").html("<img src=\"assets/img/loader.svg\" style=\"margin: auto;\" height=\"64\" width=\"64\">")
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

    stopTimer(){
        clearInterval(this.timeinterval);
    }

    getTimeRemaining() {
        let start_time;
        if (this.stage == 1) {
            start_time = this.experiment_data.start_date1;
        }
        else if (this.stage == 2) {
            start_time = this.experiment_data.start_date2;
        }
        let endtime = Date.parse(start_time) + 1000*this.duration;
        let t = endtime - Date.parse(new Date());
        let seconds = Math.floor( (t/1000) % 60 );
        let minutes = Math.floor( (t/1000/60) % 60 );
        return {
            'total': t,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    initializeClock() {
        let clock = document.getElementById('clockdiv');

        let minutesSpan = clock.querySelector('.minutes');
        let secondsSpan = clock.querySelector('.seconds');

        let that = this;

        function updateClock(){
            let t = that.getTimeRemaining();

            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                that.stopTimer();
                that.nextStage();
            }
        }

        updateClock(); // run function once at first to avoid delay
        this.timeinterval = setInterval(updateClock, 1000);
    }

    async setStageConditions() {
        // Set experimental setup
        let condition = "";
        if (this.stage == 1) {
            condition = this.experiment_data.stage1;
        }
        else if (this.stage == 2) {
            condition = this.experiment_data.stage2;
        }
        $(".cheatsheet .close-panel").trigger("click");
        if (condition == "without_ca") {
            $("#daphne_answer_menu").hide();
            this.cheatsheetManager.experiment_stage = true;
            $("#daphne_input_form").hide();
            $(".daphne_answer .close-panel").trigger("click");
        }
        else {
            $("#daphne_answer_menu").show();
            this.cheatsheetManager.experiment_stage = false;
            $("#daphne_input_form").show();
            await daphne.addNewFunctionality("daphne_answer");
            await daphne.addNewFunctionality("cheatsheet");
            await daphne.addNewFunctionality("cheatsheet");
            await daphne.addNewFunctionality("cheatsheet");
        }
        
        this.cheatsheetManager.updateOptions();

        // Make clock start ticking
        this.initializeClock();
    }

    async nextStage() {
        if (this.stage == 1) {
            // Call end stage and create window with button to start second stage
            try {
                let dataResponse = await fetch("/api/experiment/finish-stage1", {credentials: "same-origin"});

                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    // Start the experiment: run the timer and set the experimental conditions
                    // Set the stage
                    daphne.experiment_data = data;

                    $(".modal-content").html("<article class=\"message\"><div class=\"message-body\"><p>That's it for the first stage of the experiment! Click continue to start stage 2.</p>" + 
                        "<a class=\"button\" id=\"continue-experiment\">Continue</a></div></article>");
                    $("#continue-experiment").on("click", async e => {
                        this.stage = 2;
                        try {
                            let dataResponse = await fetch("/api/experiment/start-stage2", {credentials: "same-origin"});
                            if (dataResponse.ok) {
                                let data = await dataResponse.json();
                                $(".modal").removeClass("is-active");
                                daphne.experiment_data = data;
                                await daphne.import_new_data("daphne_experiment2.csv").then(() => {
                                    daphne.calculate_pareto_ranking();
                                });
                                daphne.setStageConditions();
                            }
                        }
                        catch(e) {
                            console.error("Networking error:", e);
                        }
                        
                    });
                    $(".modal").addClass("is-active");
                }
                else {
                    console.error("Error continuing the experiment.");
                }
            }
            catch(e) {
                console.error("Networking error:", e);
            }
        }
        else if (this.stage == 2) {
            // Show end message with link to survey and call finish experiment API
            try {
                let dataResponse = await fetch("/api/experiment/stop-experiment", {credentials: "same-origin"});

                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    daphne.experiment_data = null;
                }
                else {
                    console.error("Error finishing the experiment.");
                }
            }
            catch(e) {
                console.error("Networking error:", e);
            }
            $(".modal-content").html("<article class=\"message\"><div class=\"message-body\"><p>That's it for the experiment! Click Finish to go to the end survey.</p>" + 
                        "<a class=\"button\" href=\"https://cornell.qualtrics.com/jfe/form/SV_1Rmb4JZa4BEDX0h\">Finish</a></div></article>");
            $(".modal").addClass("is-active");
        }
    }
}

let daphne = new Daphne();

(async function () {

    // General Code
    daphne.problem = new EOSS(daphne);
    daphne.label = new EOSSLabel(daphne.problem);
    daphne.tradespacePlot = new TradespacePlot(daphne.problem.output_list);
    daphne.dataMining = new DataMining(daphne.tradespacePlot, daphne.label);
    daphne.filter = new EOSSFilter(daphne.problem,daphne.tradespacePlot, daphne.label);
    daphne.featureApplication = new FeatureApplication(daphne.label);
    daphne.cheatsheetManager = new CheatsheetManager();
    daphne.tutorial = new Tutorial();

    daphne.import_new_data("EOSS_data_recalculated.csv").then(() => {
        daphne.calculate_pareto_ranking();
    });

    let sortable_list = document.getElementById('functionalities_list');
    Sortable.create(sortable_list, {
        handle: '.panel-heading',
        animation: 150
    });

    await daphne.addNewFunctionality("design_inspector");
    await daphne.addNewFunctionality("daphne_answer");
    await daphne.addNewFunctionality("cheatsheet");
    //await daphne.addNewFunctionality("filter");
    //await daphne.addNewFunctionality("feature_application");
    //await daphne.addNewFunctionality("data_mining");

    // Check if experiment already running, update everything related to it if true
    try {
        let dataResponse = await fetch("/api/experiment/reload-experiment", {credentials: "same-origin"});

        if (dataResponse.ok) {
            let data = await dataResponse.json();
            if (!data.error || data.error != "Experiment not started!") {
                // Update stage (1 or 2, with/without Daphne CA) and clock of the experiment
                if ("start_date2" in data) {
                    daphne.stage = 2;
                }
                else {
                    daphne.stage = 1;
                }
                daphne.experiment_data = data;
                await daphne.setStageConditions();
            }
        }
        else {
            console.error("Error starting the experiment.");
        }
    }
    catch(e) {
        console.error("Networking error:", e);
    }

    daphne.tutorial.intro.oncomplete(async () => {
        try {
            let dataResponse = await fetch("/api/experiment/start-experiment", {credentials: "same-origin"});

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                // Start the experiment: run the timer and set the experimental conditions
                // Set the stage
                daphne.experiment_data = data;
                daphne.stage = 1;
                await daphne.import_new_data("daphne_experiment1.csv").then(() => {
                    daphne.calculate_pareto_ranking();
                });
                daphne.setStageConditions();
                console.log(data);
            }
            else {
                console.error("Error starting the experiment.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    });
    
    PubSub.publish("start-tutorial");
    
    // Experiment buttons
    $("#start-experiment").on("click", async e => {
        try {
            let dataResponse = await fetch("/api/experiment/start-experiment", {credentials: "same-origin"});

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                // Start the experiment: run the timer and set the experimental conditions
                // Set the stage
                daphne.experiment_data = data;
                daphne.stage = 1;
                await daphne.import_new_data("daphne_experiment1.csv").then(() => {
                    daphne.calculate_pareto_ranking();
                });
                daphne.setStageConditions();
                console.log(data);
            }
            else {
                console.error("Error starting the experiment.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    });
    $("#finish-experiment").on("click", async e => {
        try {
            let dataResponse = await fetch("/api/experiment/stop-experiment", {credentials: "same-origin"});

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                daphne.experiment_data = null;
                console.log(data);
            }
            else {
                console.error("Error finishing the experiment.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    });
} ());