"use strict";

class CheatsheetManager {
    constructor() {
        // Set the listener for when a new cheatsheet is added
        PubSub.subscribe("cheatsheet_added", (topic, id) => {
            let that = this;
            $("#" + id + " select").change(async function() {
                let selectedInfo = $(this).val();
                try {
                    let req_data = new FormData();
                    req_data.append("command_list", selectedInfo);
                    let dataResponse = await fetch(
                        "/api/daphne/commands",
                        {
                            method: "POST",
                            body: req_data,
                            credentials: "same-origin"
                        }
                    );

                    if (dataResponse.ok) {
                        // Add the new functionality
                        let commandList = await dataResponse.json();
                        commandList = commandList.list;
                        that.showList(id, that.printList(commandList));
                    }
                    else {
                        console.error("Error downloading the template.");
                    }
                }
                catch(e) {
                    console.error("Networking error:", e);
                }
            });
        });
    }

    printList(list) {
        let ret = "<div class=\"content\"><ul>";
        list.forEach(item => {
            ret += "<li>" + item + "</li>";
        });
        ret += "</ul></div>";
        return ret;
    }

    showList(id, list) {
        $("#" + id + " .functionality").html(list);
    }
}