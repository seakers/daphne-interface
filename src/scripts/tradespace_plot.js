import * as utils from './utils';
import * as d3 from "d3";
let PubSub = require('pubsub-js');

export default class TradespacePlot {
    constructor(output_list) {
        PubSub.subscribe("update_target_selection", (msg) => {
            this.update_target_selection();
        });

        window.addEventListener("resize", () => {
            this.update(0, 1);
        });
    }

    /*
       Removes selections and/or highlights in the scatter plot
       @param option: option to remove all selections and highlights or remove only highlights
    */
    cancel_selection(option = "") {
        let selection_updated = false;
        if (option === "") {
            // Remove both highlights and selections
            this.data.forEach(point => {
                point.selected = false;
                point.highlighted = false;
                point.drawingColor = this.color.default;
            });
            this.num_selected_points = 0;

            selection_updated = true;
        }
        else if (option === "remove_selection") {
            // Remove only selection
            this.data.forEach(point => {
                point.selected = false;
                if (point.highlighted) {
                    // selected and highlighted
                    point.drawingColor = this.color.highlighted;
                }
                else {
                    // default
                    point.drawingColor = this.color.default;
                }
            });
            this.num_selected_points = 0;

            selection_updated = true;

        }
        else if (option === "remove_highlighted") {
            // Remove only highlights
            this.data.forEach(point => {
                point.highlighted = false;
                if (point.selected) {
                    // selected
                    point.drawingColor = this.color.selected;
                }
                else {
                    // default
                    point.drawingColor = this.color.default;
                }
            });
        }
        // Tell system selection has been updated
        if (selection_updated) {
            PubSub.publish(SELECTION_UPDATED);
            PubSub.publish("update_target_selection")
        }
        // Redraw the canvas
        this.drawPoints(this.context, false);
        // Reset the number of selected archs displayed
        d3.select("#num_selected_architectures").text(""+this.get_num_of_selected_archs());
    }


    toggle_selection_mode() {
        this.change_interaction_mode(document.querySelector("input[name=\"mouse-selection\"]:checked").value);
    }


    change_interaction_mode(option) { // three options: zoom-pan, drag-select, de-select
        let margin = this.main_plot_params.margin;
        let width  = this.main_plot_params.width;
        let height = this.main_plot_params.height;

        if (option === "zoom-pan") { // Zoom
            d3.select("#main_plot").select("svg")
                .on("mousedown.modes",null)
                .on("mousemove.modes",null)
                .on("mouseup.modes",null)
                .call(this.zoom);

            d3.select("#main_plot").selectAll("canvas")
                .on("mousedown.modes",null)
                .on("mousemove.modes",null)
                .on("mouseup.modes.modes",null)
                .call(this.zoom);
        }
        else {
            let svg = d3.select("#main_plot").select("svg")
                .on(".zoom", null);

            let canvases = d3.select("#main_plot").selectAll("canvas")
                .on(".zoom", null);

            let that = this;

            function select_mousedown() {
                let mouse_pos = d3.mouse(this);
                svg.append("rect")
                    .attrs(
                        {
                            rx     : 0,
                            ry     : 0,
                            class  : "selection",
                            x      : mouse_pos[0],
                            y      : mouse_pos[1],
                            width  : 0,
                            height : 0,
                            x0     : mouse_pos[0],
                            y0     : mouse_pos[1]
                        })
                    .style("background-color", "#EEEEEE")
                    .style("opacity", 0.18)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            function select_mousemove() {
                let selection = svg.select("rect.selection");
                if (!selection.empty()) {
                    let selection_updated = false;
                    let mouse_pos = d3.mouse(this);

                    let box = {
                        x      : parseInt(selection.attr("x"), 10),
                        y      : parseInt(selection.attr("y"), 10),
                        x0     : parseInt(selection.attr("x0"), 10),
                        y0     : parseInt(selection.attr("y0"), 10),
                        width  : parseInt(selection.attr("width"), 10),
                        height : parseInt(selection.attr("height"), 10)
                    };
                    let move = {
                        x : mouse_pos[0] - box.x0,
                        y : mouse_pos[1] - box.y0
                    };

                    if (move.x < 0) {
                        box.x = box.x0 + move.x;
                    }
                    else {
                        box.x = box.x0;
                    }
                    if (move.y < 0) {
                        box.y = box.y0 + move.y;
                    }
                    else {
                        box.y = box.y0;
                    }
                    box.width = Math.abs(move.x);
                    box.height = Math.abs(move.y);

                    selection.attrs(box);

                    if (option === "drag-select") { // Make selection
                        that.data.forEach(point => {
                            let tx = that.transform.applyX(that.xMap(point));
                            let ty = that.transform.applyY(that.yMap(point));

                            if( tx >= box.x && tx <= box.x + box.width &&
                                ty >= box.y && ty <= box.y + box.height)
                            {
                                if (!point.hidden && !point.selected) {
                                    // Select
                                    point.selected = true;
                                    that.num_selected_points += 1;

                                    if (point.highlighted) {
                                        // selected and highlighted
                                        point.drawingColor = that.color.overlap;
                                    }
                                    else {
                                        // default
                                        point.drawingColor = that.color.selected;
                                    }

                                    selection_updated = true;
                                }
                            }
                        });
                    }
                    else {  // De-select
                        that.data.forEach(point => {
                            let tx = that.transform.applyX(that.xMap(point));
                            let ty = that.transform.applyY(that.yMap(point));

                            if( tx >= box.x && tx <= box.x + box.width &&
                                ty >= box.y && ty <= box.y + box.height)
                            {
                                if (!point.hidden && point.selected) {
                                    point.selected = false;
                                    that.num_selected_points -= 1;

                                    if(point.highlighted){
                                        // selected and highlighted
                                        point.drawingColor = that.color.highlighted;
                                    }
                                    else {
                                        // default
                                        point.drawingColor = that.color.default;
                                    }

                                    selection_updated = true;
                                }
                            }
                        });
                    }
                    if (selection_updated) {
                        PubSub.publish(SELECTION_UPDATED);
                    }
                    d3.select("#num_selected_architectures").text(""+that.get_num_of_selected_archs());
                    that.drawPoints(that.context, false);
                }
            }

            function select_mouseup() {
                // remove selection frame
                svg.selectAll("rect.selection").remove();
                PubSub.publish("update_target_selection")
            }

            svg.on("mousedown.modes", select_mousedown)
                .on("mousemove.modes", select_mousemove)
                .on("mouseup.modes", select_mouseup);

            canvases.on("mousedown.modes", select_mousedown)
                .on("mousemove.modes", select_mousemove)
                .on("mouseup.modes", select_mouseup);
        }
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
