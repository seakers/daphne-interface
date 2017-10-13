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
    
    
        //Interaction states
        this.UI_states = {
            "support_panel_active":false,
            "selection_changed":true
        };

        PubSub.subscribe(DATA_PROCESSED, (msg, data) => {
            this.data = data;
        });
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
                '/api/ifeed/import-data/',
                {
                    method: 'POST',
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
                // TODO: this.main_plot.update(ifeed.data,0,1);
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
}

(function () {

    // General Code
    let daphne = new Daphne();

    daphne.problem = new EOSS();
    daphne.label = new EOSSLabel(daphne.problem);
    daphne.tradespace_plot = new TradespacePlot(daphne.problem.output_list);

    daphne.import_new_data().then(() => {
        daphne.calculate_pareto_ranking();
    });
    

    // Historian Code
    var currentMode = 0;

    var modeCodes = [
        'No active mode',
        'History mode',
        'iFEED mode',
        'VR mode',
        'Evaluate mode',
        'Criticize mode'
    ];

    function executeCommand(command) {
        var formData = {
            'command': command
        };

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/api/daphne/command', // the url where we want to POST
            data: formData, // our data object
            dataType: 'json', // what type of data do we expect back from the server
            encode: true
        })
        // using the done promise callback
        .done(function(data) {
            // log data to the console so we can see
            console.log(data); 
            // here we will handle errors and validation messages
            processCommand(data['command'], data['command_type'], data['other_info'])
        });
    }

    function switchMode(new_mode) {
        currentMode = new_mode;
        $('h3#active-mode').html(modeCodes[currentMode]);
        // TODO: load the active mode commands and the cheatsheet cards with hints for commands like instrument names, mission names, measurements, ifeed things, vr things, etc.
        $('div#result-box').html('<p class="text-center">Mode changed!</p>')
        responsiveVoice.speak("Mode changed!");
    }

    function askHistoryQuestion(question) {
        formData = {
            'question': question
        }

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/api/histdb/question', // the url where we want to POST
            data: formData, // our data object
            dataType: 'json', // what type of data do we expect back from the server
            encode: true
        })
        // using the done promise callback
        .done(function(data) {
            // log data to the console so we can see
            console.log(data); 
            // here we will handle errors and validation messages
            $('div#result-box').html('<p class="text-center">' + data['answer'] + '</p>')
            responsiveVoice.speak(data['answer']);
        });
    }

    function processCommand(command, command_type, other_info) {
        var real_command_type = command_type
        if (command_type == -1) {
            real_command_type = currentMode
        }

        if (real_command_type == 0) {
            // Change mode
            switchMode(other_info);
        }
        else if (real_command_type == 1) {
            // Send command to history API
            askHistoryQuestion(command);
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

    $('form#daphne-form').submit(function(event) {
        executeCommand($('input[name=command]').val());

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

    if (annyang) {
        // // Let's define our first command. First the text we expect, and then the function it should call
        // var commands = {
        //     'hello': function() { alert('Hello world!'); }
        // };

        // // Add our commands to annyang
        // annyang.addCommands(commands);

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
} ());