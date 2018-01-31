import * as utils from './utils';
import * as d3 from "d3";
let PubSub = require('pubsub-js');

export default class TradespacePlot {
    constructor() {
        PubSub.subscribe("update_target_selection", (msg) => {
            this.update_target_selection();
        });
    }

    async update_target_selection() {

        let selectedArchs = [];
        this.data.forEach(point => {
            if (!point.hidden && point.selected) {
                selectedArchs.push(point);
            }
        });
        let nonSelectedArchs = [];
        this.data.forEach(point => {
            if (!point.hidden && !point.selected) {
                nonSelectedArchs.push(point);
            }
        });

        // Store the id's of all dots
        let selected = [];
        let non_selected = [];

        selectedArchs.forEach(arch => {
            selected.push(arch.id);
        });
        nonSelectedArchs.forEach(arch => {
            non_selected.push(arch.id);
        });

        try {
            let req_data = new FormData();
            req_data.append("selected", JSON.stringify(selected));
            req_data.append("non_selected", JSON.stringify(non_selected));
            let data_response = await fetch(
                "/api/ifeed/set-target/",
                {
                    method: "POST",
                    body: req_data,
                    credentials: "same-origin"
                }
            );

            if (data_response.ok) {
                console.log("Target selection updated")
            }
            else {
                console.error("Error obtaining the driving features.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    }

    /*
        Counts the number of both selected and highlighted archs
        @return: the number of dots selected
    */
    get_num_of_highlighted_archs() {
        let num = 0;
        this.data.forEach(point => {
            if (point.highlighted) {
                num++;
            }
        });
        return num;
    }


    /*
        Counts the number of both selected and highlighted archs
        @return: the number of dots selected
    */
    get_num_of_intersected_archs() {
        let num = 0;
        this.data.forEach(point => {
            if (point.selected && point.highlighted) {
                num++;
            }
        });
        return num;
    }
}
