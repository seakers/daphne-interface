$(document).foundation();

$(document).ready(function() {

    var currentMode = 0;

    $('form#daphne-form').submit(function(event) {
        var formData = {
            'command': $('input[name=command]').val()
        };

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'api/daphne/command', // the url where we want to POST
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
       // stop the form from submitting the normal way and refreshing the page
       event.preventDefault();
    });

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
});