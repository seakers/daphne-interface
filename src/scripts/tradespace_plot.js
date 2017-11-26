class TradespacePlot {

    constructor(output_list) {
        this.translate = [0,0];
        this.scale = 1;
        this.xIndex = null;
        this.yIndex = null;
        
        this.main_plot_params = {
            "margin": {top: 20, right: 20, bottom: 30, left: 60},
            "width": 960,
            "height": 450,
        };
        
        this.color = {
            "default": "rgba(110,110,110,255)",
            "selected": "rgba(25,186,215,255)",
            "highlighted": "rgba(248,101,145,255)",
            "overlap": "rgba(163,64,240,255)",
            "mouseover": "rgba(116,255,110,255)",
            "hidden": "rgba(110,110,110,22)"
        };

        this.output_list = output_list;

        this.data = null;
        this.num_total_points = 0;
        this.num_selected_points = 0;

        this.transform = d3.zoomIdentity;

        this.lastHoveredArch = null;

        PubSub.subscribe(DATA_UPDATED, (msg, data) => {
            this.data = data;
            this.data.forEach(point => {
                point.selected = false;
                point.highlighted = false;
                point.hidden = false;
                point.drawingColor = this.color.default;
                this.num_total_points += 1;
            });
            this.update(0, 1);
        });
        
        PubSub.subscribe("update_target_selection", (msg) => {
            this.update_target_selection();
        });     

        window.addEventListener("resize", () => {
            this.update(0, 1);
        });
    }


    reset_main_plot() {
        //Resets the main plot
        d3.select("#main_plot").select("svg").remove();
        d3.select("#main_plot").selectAll("canvas").remove();
    }


    /*
        Draws the scatter plot with architecture inputs
        @param source: a JSON object array containing the basic arch info
    */
    update(xIndex, yIndex) {
        this.reset_main_plot();

        // Update width
        this.main_plot_params.width = document.getElementById("main_plot_block").clientWidth - document.getElementById("selections_block").offsetWidth - 30;
        
        let margin = this.main_plot_params.margin;
        this.width = this.main_plot_params.width - margin.right - margin.left;
        this.height = this.main_plot_params.height - margin.top - margin.bottom;

        // setup x 
        let xValue = d => d.outputs[xIndex]; // data -> value
        
        let xScale = d3.scaleLinear().range([0, this.width]); // value -> display

        // don't want dots overlapping axis, so add in buffer to data domain 
        let xBuffer = (d3.max(this.data, xValue) - d3.min(this.data, xValue)) * 0.05;
        xScale.domain([d3.min(this.data, xValue) - xBuffer, d3.max(this.data, xValue) + xBuffer]);
        
        this.xMap = d => xScale(xValue(d)); // data -> display

        let xAxis = d3.axisBottom(xScale);

        // setup y
        let yValue = d => d.outputs[yIndex]; // data -> value

        let yScale = d3.scaleLinear().range([this.height, 0]); // value -> display

        let yBuffer = (d3.max(this.data, yValue) - d3.min(this.data, yValue)) * 0.05;
        yScale.domain([d3.min(this.data, yValue) - yBuffer, d3.max(this.data, yValue) + yBuffer]);

        this.yMap = d => yScale(yValue(d)); // data -> display

        let yAxis = d3.axisLeft(yScale);
                
        this.xScale = xScale;
        this.yScale = yScale;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        d3.select("#main_plot")
            .style("width", this.main_plot_params.width + "px")
            .style("height", this.main_plot_params.height + "px");

        this.zoom = d3.zoom()
            .scaleExtent([0.4, 25])
            .on("zoom", d => {
                this.transform = d3.event.transform;
                gX.call(xAxis.scale(this.transform.rescaleX(xScale)));
                gY.call(yAxis.scale(this.transform.rescaleY(yScale)));

                this.drawPoints(this.context, false);
            });

        let svg = d3.select("#main_plot")
            .append("svg")
            .style("position", "absolute")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .call(this.zoom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let canvas = d3.select("#main_plot")
            .append("canvas")
            .style("position", "absolute")
            .style("top", margin.top + "px")
            .style("left", margin.left + "px")
            .attr("width", this.width)
            .attr("height", this.height)
            .call(this.zoom);

        this.context = canvas.node().getContext("2d");

        let hiddenCanvas = d3.select('#main_plot')
            .append("canvas")
            .style("position", "absolute")
            .style("top", margin.top + "px")
            .style("left", margin.left + "px")
            .style("display", "none")
            .attr("width", this.width)
            .attr("height", this.height);

        this.hiddenContext = hiddenCanvas.node().getContext("2d");

        // x-axis
        let gX = svg.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0, " + this.height + ")")
            .call(xAxis);
            
        svg.append("text")
            .attr("transform", "translate(" + this.width + ", " + this.height + ")")
            .attr("class", "label")
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(this.output_list[xIndex]);

        // y-axis
        let gY = svg.append("g")
            .attr("class", "axis axis-y")
            .call(yAxis);
        
        svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.output_list[yIndex]);

        // Canvas related functions
        let that = this;
        // Function to create new colours for the picking.
        let nextCol = 1;
        function genColor(){ 
            let ret = [];
            if (nextCol < 16777215) {
                ret.push(nextCol & 0xff); // R 
                ret.push((nextCol & 0xff00) >> 8); // G 
                ret.push((nextCol & 0xff0000) >> 16); // B
                nextCol += 1;
            }
            let col = "rgb(" + ret.join(',') + ")";
            return col;
        }

        // Add one unique color to each point and save the backreference
        let colorMap = {};
        this.data.forEach(function(point) {
            point.interactColor = genColor();
            colorMap[point.interactColor] = point;
        });

        this.drawPoints(this.context, false);

        // Canvas interaction
        canvas.on("mousemove.inspection", function() { that.canvas_mousemove(colorMap); });
        
        // Set button click operations
        d3.select("button#cancel_selection").on("click", () => { that.cancel_selection(); });
        d3.select('#interaction_modes').selectAll("label").on("click", () => { that.toggle_selection_mode(); });
        d3.select("#num_architectures").text(""+this.get_num_of_archs());
        d3.select("#num_selected_architectures").text(""+this.get_num_of_selected_archs());
    }

    drawPoints(context, hidden) {
        context.clearRect(0, 0, this.width, this.height);
        context.save();
        
        this.data.forEach(point => {
            let tx = this.transform.applyX(this.xMap(point));
            let ty = this.transform.applyY(this.yMap(point));
            context.beginPath();
            context.fillStyle = hidden ? point.interactColor : point.drawingColor;
            context.arc(tx, ty, 3.3, 0, 2 * Math.PI);
            context.fill();
        });

        context.restore();
    }

    canvas_mousemove(colorMap) {
        // Draw the hidden canvas.
        this.drawPoints(this.hiddenContext, true);

        // Get mouse positions from the main canvas.
        let mouse_pos = d3.mouse(d3.select("#main_plot").select("canvas").node());
        let mouseX = mouse_pos[0]; 
        let mouseY = mouse_pos[1];

        // Pick the colour from the mouse position and max-pool it. 
        let color = this.hiddenContext.getImageData(mouseX-3, mouseY-3, 6, 6).data;
        let color_list = {};
        for (let i = 0; i < color.length; i += 4) {
            let color_rgb = "rgb(" + color[i] + "," + color[i+1] + "," + color[i+2] + ")";
            if (color_rgb in color_list) {
                color_list[color_rgb] += 1;
            }
            else {
                color_list[color_rgb] = 1;
            }
        }
        let maxcolor, maxcolor_num = 0;
        for (let key in color_list) {
            if (maxcolor_num < color_list[key]) {
                maxcolor_num = color_list[key];
                maxcolor = key;
            }
        }

        // Check if something changed
        let changesHappened = false;

        // Change color back to default if not selected anymore
        if (this.lastHoveredArch in colorMap && this.lastHoveredArch != maxcolor) {
            let oldPoint = colorMap[this.lastHoveredArch];
            if (oldPoint.selected && oldPoint.highlighted) {
                oldPoint.drawingColor = this.color.overlap;
            }
            else if (oldPoint.selected) {
                oldPoint.drawingColor = this.color.selected;
            }
            else if (oldPoint.highlighted) {
                oldPoint.drawingColor = this.color.highlighted;
            }
            else {
                oldPoint.drawingColor = this.color.default;
            }
        }

        // Get the data from our map!
        if (maxcolor in colorMap) {
            // Only update if there is a change in the selection
            if (this.lastHoveredArch != maxcolor) {
                let arch = colorMap[maxcolor];
                this.lastHoveredArch = maxcolor;
                changesHappened = true;
                
                // Change the color of the dot temporarily
                arch.drawingColor = this.color.mouseover;

                // Remove the previous info
                d3.select(".design_inspector > .panel-block").select("g").remove();
                
                let design_inspector = d3.select(".design_inspector > .panel-block").append("g");

                // Display the current architecture info
                let arch_info_display = design_inspector.append("div")
                    .attr("id", "arch_info_display");

                arch_info_display.append("p").text(d => "Design ID: D" + arch.id);

                for (let i = 0; i < this.output_list.length; i++) {
                    arch_info_display.append("p")
                        .text(d => {
                            let out = this.output_list[i] + ": ";
                            let val = arch.outputs[i];
                            if (typeof val == "number") {
                                if (val > 100) {
                                    val = val.toFixed(2);
                                }
                                else {
                                    val = val.toFixed(4);
                                }
                            }
                            return out + val;
                        });
                }

                PubSub.publish(ARCH_SELECTED, arch);
            }
        }
        else {
            // In case nothing is selected just revert everything back to normal
            this.lastHoveredArch = null;
            changesHappened = true;
        }

        // Only redraw if there have been changes
        if (changesHappened) {
            this.drawPoints(this.context, false);
        }
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
    
    
    hide_selection() {
        this.data.forEach(point => {
            if (point.selected) {
                point.hidden = true;
                point.selected = false;
                point.highlighted = false;
                point.drawingColor = this.color.hidden;
                this.num_selected_points -= 1;
                this.num_total_points -= 1;
            }
        });

        d3.select("#num_architectures").text(""+this.get_num_of_archs());
        d3.select("#num_selected_architectures").text(""+this.get_num_of_selected_archs());
    }


    show_all_archs() {
        this.data.forEach(point => {
            if (point.hidden) {
                point.hidden = false;
                point.drawingColor = this.color.default;
                this.num_total_points += 1;
            }
        });

        d3.select("#num_architectures").text(""+this.get_num_of_archs());
        d3.select("#num_selected_architectures").text(""+this.get_num_of_selected_archs());
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
        Counts the number of all archs displayed
        @return: the number of dots
    */
    get_num_of_archs() {
        return this.num_total_points;
    }


    /*
        Counts the number of selected archs
        @return: the number of dots selected
    */
    get_num_of_selected_archs() {
        return this.num_selected_points; 
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
