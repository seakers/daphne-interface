$(document).foundation();

$(document).ready(function() {

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

        $("input[name=command]").val(question);

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

});