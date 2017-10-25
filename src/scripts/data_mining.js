class DataMining {
    constructor(tradespace_plot) {
        this.tradespace_plot = tradespace_plot;

        this.support_threshold = 0.002;
        this.confidence_threshold = 0.2;
        this.lift_threshold = 1;  
        
        this.all_features = [];
        this.mined_features = [];
        this.added_features = [];
        
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        this.width = 770 - 35 - this.margin.left - this.margin.right;
        this.height = 333 - this.margin.top - this.margin.bottom;
        
        this.df_i = 0;
        

        this.current_feature = { id: null, name: null, expression: null, metrics: null, added: "0", x0: -1, y0: -1, x: -1, y: -1 };
        this.current_feature_blink_interval = null;
        this.utopia_point = { id: null, name: "utopiaPoint", expression: null, metrics: null, x0: -1, y0: -1, x: -1, y: -1 };
        

        let coloursRainbow = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];
        let colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
        colourRangeRainbow.push(1);

        // Create color gradient
        this.colorScaleRainbow = d3.scaleLinear()
            .domain(colourRangeRainbow)
            .range(coloursRainbow)
            .interpolate(d3.interpolateHcl);

        // Needed to map the values of the dataset to the color scale
        this.colorInterpolateRainbow = d3.scaleLinear()
            .domain(d3.extent([]))
            .range([0,1]);
        

        this.xScale = null;
        this.yScale = null;
        this.xAxis = null;
        this.yAxis = null;

        PubSub.subscribe("data_mining_added", (msg) => {
            d3.selectAll("#run_data_mining").on("click", () => { this.run(); });
        });

        PubSub.subscribe(SELECTION_UPDATED, (msg) => {
            this.reset();
        });
        
    }


    reset() {
        d3.select("#data_mining > .panel-block").select("g").remove();
        
        let guideline = d3.select("#data_mining > .panel-block")
            .append("g");

        guideline.append("p")
            .text("To run data mining, select target solutions on the scatter plot. Then click the button below.");

        guideline.append("div")
            .classed("field", true)
            .append("div")
                .classed("control", true)
                .append("a")
                    .classed("button is-info", true)
                    .attr("id","run_data_mining")
                    .text("Run data mining");

        PubSub.publish("data_mining_added");
    }


    async run() {
        // Remove all highlights in the scatter plot (retain target solutions)
        this.tradespace_plot.cancel_selection("remove_highlighted");

        let selectedArchs = [];
        this.tradespace_plot.data.forEach(point => {
            if (!point.hidden && point.selected) {
                selectedArchs.push(point);
            }
        });
        let nonSelectedArchs = [];
        this.tradespace_plot.data.forEach(point => {
            if (!point.hidden && !point.selected) {
                nonSelectedArchs.push(point);
            }
        });

        let numOfSelectedArchs = selectedArchs.length;
        let numOfNonSelectedArchs = nonSelectedArchs.length;

        if (numOfSelectedArchs == 0) {
            alert("First select target solutions!");
        }
        else {        
            // Store the id's of all dots
            let selected = [];
            let non_selected = [];

            selectedArchs.forEach(arch => {
                selected.push(arch.id);
            });
            nonSelectedArchs.forEach(arch => {
                non_selected.push(arch.id);
            });

            this.mined_features = await this.get_driving_features(selected, non_selected, this.support_threshold,
                this.confidence_threshold, this.lift_threshold);

            this.all_features = this.mined_features;
            
            if (this.all_features.length === 0) {
                return;
            }
            
            this.display_features();
        }
    }


    async get_driving_features(selected, non_selected, support_threshold, confidence_threshold, lift_threshold) {
        let output;
        try {
            let req_data = new FormData();
            req_data.append("selected", JSON.stringify(selected));
            req_data.append("non_selected", JSON.stringify(non_selected));
            req_data.append("supp", support_threshold);
            req_data.append("conf", confidence_threshold);
            req_data.append("lift", lift_threshold);
            let data_response = await fetch(
                "/api/data-mining/get-driving-features/",
                {
                    method: "POST",
                    body: req_data,
                    credentials: "same-origin"
                }
            );

            if (data_response.ok) {
                let data = await data_response.json();
                if (data === "[]") {
                    alert("No driving feature mined. Please try modifying the selection. (Try selecting more designs)");
                }
                output = data;
            }
            else {
                console.error("Error obtaining the driving features.");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }

        return output;
    }


    display_features() {
        // Set variables
        this.df_i = 0;

        // Remove previous content
        d3.select("#data_mining > .panel-block").select("g").remove();

        let tab = d3.select("#data_mining > .panel-block")
            .append("g")
            .style("display", "flex")
            .style("justify-content", "space-between")
            .style("width", "100%");

        // Create plot div's
        tab.append("div")
            .attr("id", "feature_plot")
            .style("width", "50%")
            .style("height", "100%");

        // Create venn diagram div
        tab.append("div")
            .attr("id", "venn_diagram")
            .style("width", "50%")
            .append("p")
                .text("Total number of designs: " + this.tradespace_plot.get_num_of_archs());

        // Initialize location
        for(let i = 0; i < this.all_features.length; i++){
            this.all_features[i].x0 = -1;
            this.all_features[i].y0 = -1;
            this.all_features[i].id = this.df_i++;
        }

        this.update_feature_plot();
    }


    update_feature_plot(remove_last_feature = false) {
        function get_utopia_point() {
            // Utopia point
            return objects.filter(d => {
                if (d.name === "utopiaPoint") {
                   return true;
                }
                return false;
            });
        }


        function get_current_feature() {
            // The current feature
            return objects.filter(d => {
                if (d.added === "0") {
                   return true;
                }
                return false;
            });
        }

        // Set updated width
        this.width = document.getElementById("feature_plot").clientWidth - this.margin.left - this.margin.right;

        // Set variables
        let duration = 500;

        let supps = [];
        let lifts = [];
        let conf1s = [];
        let conf2s = [];

        let scores = [];   
        let maxScore = -1;

        
        for (let i = 0; i < this.all_features.length; i++) {
            supps.push(this.all_features[i].metrics[0]);
            lifts.push(this.all_features[i].metrics[1]);
            conf1s.push(this.all_features[i].metrics[2]);
            conf2s.push(this.all_features[i].metrics[3]);
            
            let score = 1 - Math.sqrt(Math.pow(1 - conf1s[i], 2) + Math.pow(1 - conf2s[i], 2));
            scores.push(score);

            if (score > maxScore) {
                maxScore = score;
            }
        }

        
        // Add utopia point to the list
        let max_conf1 = Math.max.apply(null, conf1s);
        let max_conf2 = Math.max.apply(null, conf2s);
        let max_conf = Math.max(max_conf1, max_conf2);

        // Add utopia point
        this.utopia_point.metrics = [Math.max.apply(null, lifts), Math.max.apply(null, supps), max_conf, max_conf];

        // Insert the utopia point to the list of features
        this.all_features.splice(0, 0, this.utopia_point);

        // Add score for the utopia point (0.2 more than the best score found so far)
        scores.splice(0, 0, Math.max.apply(null, scores) + 0.2); 

        
        // Set the axis to be Conf(F->S) and Conf(S->F)
        let x = 2;
        let y = 3;

        // setup x
        // data -> value
        let xValue = d => d.metrics[x];
        
        // value -> display
        let xScale = d3.scaleLinear().range([0, this.width]);

        // don't want dots overlapping axis, so add in buffer to data domain 
        let xBuffer = (d3.max(this.all_features, xValue) - d3.min(this.all_features, xValue)) * 0.05;
        xScale.domain([d3.min(this.all_features, xValue) - xBuffer, d3.max(this.all_features, xValue) + xBuffer]);
        
        // data -> display
        let xMap = d => xScale(xValue(d)); 
        let xAxis = d3.axisBottom(xScale);

        // setup y
        // data -> value
        let yValue = d => d.metrics[y];

        // value -> display
        let yScale = d3.scaleLinear().range([this.height, 0]);

        // don't want dots overlapping axis, so add in buffer to data domain
        let yBuffer = (d3.max(this.all_features, yValue) - d3.min(this.all_features, yValue)) * 0.05;
        yScale.domain([d3.min(this.all_features, yValue) - yBuffer, d3.max(this.all_features, yValue) + yBuffer]);

        // data -> display
        let yMap = d => yScale(yValue(d)); 
        let yAxis = d3.axisLeft(yScale);

        // Set the new locations of all the features
        for (let i = 0; i < this.all_features.length; i++) {
            this.all_features[i].x = xMap(this.all_features[i]);
            this.all_features[i].y = yMap(this.all_features[i]);
            if (!this.all_features[i].x0) {
                // If previous location has not been initialized, save the current location
                this.all_features[i].x0 = this.all_features[i].x;
                this.all_features[i].y0 = this.all_features[i].y;
            }
        }
        
        this.xScale = xScale;
        this.yScale = yScale;
        this.xAxis = xAxis;
        this.yAxis = yAxis;


        //Needed to map the values of the dataset to the color scale
        this.colorInterpolateRainbow = d3.scaleLinear()
            .domain(d3.extent(scores))
            .range([0,1]);

        // Set zoom
        let zoom = d3.zoom()
            .scaleExtent([0.2, 50])
            .on("zoom", d => {
                gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
                gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

                objects.attr("transform", d => {
                        let xCoord = d3.event.transform.applyX(xMap(d));
                        let yCoord = d3.event.transform.applyY(yMap(d));
                        return "translate(" + xCoord + "," + yCoord + ")";
                    });
            });

        // Reset plot
        d3.select("#feature_plot").select("svg").remove();

        let svg = d3.select("#feature_plot").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .call(zoom)
            .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // Clipping area
        let clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "feature_clip")
            .append("svg:rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        // Actual points and clipping
        let triangleplot = svg.append("g")
             .attr("id", "triangleplot")
             .attr("clip-path", "url(#feature_clip)");

        let objects = triangleplot.selectAll(".object")
            .data(this.all_features)
            .enter().append("path")
            .attr("class", "object")
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(120))
            .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")")
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Utopia point: modify the shape to a star
        get_utopia_point().attr("d", d3.symbol().type(d3.symbolStar).size(120));

        // Add interaction to the features on the plot
        objects.filter((d, i) => {
                if (d.name === "utopiaPoint") {
                    return false;
                }
                return true;
            })
            .on("mouseover", () => { this.feature_mouseover(); })
            .on("mouseout", () => { this.feature_mouseout(); })
            .on("click", () => { this.feature_click(); });


        //Transition the colors to a rainbow
        objects.style("fill", (d, i) => this.colorScaleRainbow(this.colorInterpolateRainbow(scores[i])));

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
            .text("Confidence(F->S)");

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
            .text("Confidence(S->F)");

        // The current feature: modify the shape to a cross
        let _current_feature = get_current_feature().attr('d',d3.symbol().type(d3.symbolCross).size(120));

        _current_feature.shown = true;

        function blink() {
            if (_current_feature.shown) {
                _current_feature.style("opacity", 0);
                _current_feature.shown = false;
            }
            else {
                _current_feature.style("opacity", 1);
                _current_feature.shown = true;
            }
        }

        if (this.current_feature_blink_interval != null) {
            clearInterval(this.current_feature_blink_interval);
            
            objects.filter(d => {
                if (d.added === "1") {
                   return true;
                }
                return false;
            }).style("opacity", 1);
        }
        this.current_feature_blink_interval = setInterval(blink, 350);

        // Remove the utopia point
        this.all_features.splice(0, 1);

        if (remove_last_feature) {
            // Remove the last feature, as it had been added temporarily to display the cursor
            this.all_features.pop();
            this.added_features.pop();
        }

        // The current feature
        _current_feature.style("fill", "black");

        // Animate creation of graph
        objects.transition()
            .duration(duration)
            .attr("transform", d => {
                return "translate(" + d.x + "," + d.y + ")";
            }); 
    }


    feature_mouseover(d) {
        var id= d.id; 
        var expression = d.expression;
        var metrics = d.metrics;
        var conf = d.metrics[2];
        var conf2 = d.metrics[3];

        // Set variables
        var margin = self.margin;
        var width = self.width;
        var height = self.height;

        var mouseLoc_x = d3.mouse(d3.select(".objects.feature_plot")[0][0])[0];
        var mouseLoc_y = d3.mouse(d3.select(".objects.feature_plot")[0][0])[1];

        var tooltip_location = {x:0,y:0};
        var tooltip_width = 360;
        var tooltip_height = 200;

        var h_threshold = (width + margin.left + margin.right)*0.5;
        var v_threshold = (height + margin.top + margin.bottom)*0.55;


        if(mouseLoc_x >= h_threshold){
            tooltip_location.x = -10 - tooltip_width;
        } else{
            tooltip_location.x = 10;
        }
        if(mouseLoc_y < v_threshold){
            tooltip_location.y = 10;
        } else{
            tooltip_location.y = -10 -tooltip_height;
        }

        var svg = d3.select(".objects.feature_plot");
        var tooltip = svg.append("g")
                        .attr("id","tooltip_g");

        tooltip.append("rect")
                    .attr("id","tooltip_rect")
                    .attr("transform", function(){
                        var x = mouseLoc_x + tooltip_location.x;
                        var y = mouseLoc_y + tooltip_location.y;
                        return "translate(" + x + "," + y + ")";
                     })
                    .attr("width",tooltip_width)
                    .attr("height",tooltip_height)
                    .style("fill","#4B4B4B")
                    .style("opacity", 0.92);    

        var fo = tooltip
                        .append("foreignObject")
                        .attr('id','tooltip_foreignObject')
                        .attr("x",function(){
                            return mouseLoc_x + tooltip_location.x;
                        })
                        .attr("y",function(){
                           return mouseLoc_y + tooltip_location.y; 
                        })
                        .attr({
                            'width':tooltip_width,
                            'height':tooltip_height  
                        })
                        .data([{id:id, expression:expression, metrics:metrics}]) 
                        .html(function(d){
                            var output= "" + ifeed.label.pp_feature(d.expression) + "<br><br> lift: " + round_num(d.metrics[1]) + 
                            "<br> Support: " + round_num(d.metrics[0]) + 
                            "<br> Confidence(F->S): " + round_num(d.metrics[2]) + 
                            "<br> Confidence(S->F): " + round_num(d.metrics[3]) +"";
                            return output;
                        }).style("padding","8px")
                        .style('color','#F7FF55')
                        .style('word-wrap','break-word');   


        // Update the placeholder with the driving feature and stash the expression    
        ifeed.feature_application.update_feature_application('temp',expression);
        ifeed.filter.apply_filter_expression(ifeed.feature_application.parse_tree(ifeed.feature_application.root));
        self.draw_venn_diagram(); 
    }


    feature_click(d){
        // Replaces the current feature expression with the stashed expression
        ifeed.feature_application.update_feature_application('update');
    }


    feature_mouseout(d){
        var id = d.id;

        // Remove the tooltip
        d3.selectAll("#tooltip_g").remove();

        // Remove all the features created temporarily

        // Bring back the previously stored feature expression
        ifeed.feature_application.update_feature_application('restore');
        ifeed.filter.apply_filter_expression(ifeed.feature_application.parse_tree(ifeed.feature_application.root));
        self.draw_venn_diagram();       

    }


    add_feature_to_plot(expression){

        function find_equivalent_feature(metrics,indices){

            for(var i=0;i<self.all_features.length;i++){
                var _metrics = self.all_features[i].metrics;
                var match = true;
                for(var j=0;j<indices.length;j++){
                    var index = indices[j];
                    if(round_num(metrics[index])!=round_num(_metrics[index])){
                        match=false;
                    }
                }
                if(match){
                    return self.all_features[i];
                }
            }
            return null;
        }
        
        
        ifeed.filter.apply_filter_expression(expression);
        

        if(!expression || expression==""){

            // Assign new indices for the added features
            for(var i=0;i<self.added_features.length;i++){
                self.all_features[self.all_features.length-self.added_features.length+i].added = ""+self.added_features.length-i + 1;
            }        
            
            self.update_feature_plot([self.current_feature],false);

        }else{        

            // Compute the metrics of a feature
            var total = ifeed.main_plot.get_num_of_archs();
            var intersection = d3.selectAll('.dot.main_plot.selected.highlighted')[0].length;
            var selected = d3.selectAll('.dot.main_plot.selected')[0].length;
            var highlighted = d3.selectAll('.dot.main_plot.highlighted')[0].length;

            var p_snf = intersection/total;
            var p_s = selected/total;
            var p_f = highlighted/total;

            var supp = p_snf;
            var conf = supp / p_f;
            var conf2 = supp / p_s;
            var lift = p_snf/(p_f*p_s); 
            var metrics = [supp, lift, conf, conf2];

            // Stash the previous location
            var x=self.current_feature.x;
            var y=self.current_feature.y;

            // Define new feature
            self.current_feature = {id:df_i++,name:expression,expression:expression,metrics:metrics,added:"0",x0:x,x:x,y0:y,y:y};

            // Check if there exists a feature whose metrics match with the current feature's metrics
            var matched = find_equivalent_feature(metrics,[2,3]);       

            // Add new feature to the list of added features
            self.added_features.push(self.current_feature);
            self.all_features.push(self.current_feature);  

            // Stash the previous locations of all features
            for(var i=0;i<self.all_features.length;i++){
                self.all_features[i].x0 = self.all_features[i].x;
                self.all_features[i].y0 = self.all_features[i].y;
            }

            // Assign new indices for the added features
            for(var i=0;i<self.added_features.length;i++){
                self.all_features[self.all_features.length-self.added_features.length+i].added = ""+self.added_features.length-1-i;
            }

            document.getElementById('tab3').click();
            
            ifeed.main_plot.highlight_support_panel();

            // Display the driving features with newly added feature
            if(matched){ 
                self.update_feature_plot([self.current_feature],true);
            }else{
                self.update_feature_plot([self.current_feature],false);
            }

        }
    }
    
    
    
    
    
    draw_venn_diagram(){

        var venn_diagram_container = d3.select('.feature_plot .venn_diagram').select('div');
        
        if(venn_diagram_container[0][0]==null) return;

        venn_diagram_container.select("svg").remove();
        
        var svg = venn_diagram_container
                                    .append("svg")
                                    .style('width','320px')  			
                                    .style('border-width','3px')
                                    .style('height','305px')
                                    .style('border-style','solid')
                                    .style('border-color','black')
                                    .style('border-radius','40px')
                                    .style('margin-top','10px')
                                    .style('margin-bottom','10px'); 

        
        var total = ifeed.main_plot.get_num_of_archs();
        var intersection = d3.selectAll('.dot.main_plot.selected.highlighted:not(.hidden)')[0].length;
        var selected = d3.selectAll('.dot.main_plot.selected:not(.hidden)')[0].length;
        var highlighted = d3.selectAll('.dot.main_plot.highlighted:not(.hidden)')[0].length;

        
        var left_margin = 50;
        var c1x = 110;
        // Selection has a fixed radius
        var r1 = 70;
        var S_size = selected;

        svg.append("circle")
            .attr("id","venn_diag_c1")
            .attr("cx", c1x)
            .attr("cy", 180-30)
            .attr("r", r1)
            .style("fill", "steelblue")
            .style("fill-opacity", ".5");

        svg.append("text")
            .attr("id","venn_diag_c1_text")
            .attr("x",c1x-90)
            .attr("y",180+r1+50-30)
            .attr("font-family","sans-serif")
            .attr("font-size","18px")
            .attr("fill","steelblue")
            .text("Selected:" + S_size );

        var supp, conf, conf2, lift;

        if(intersection==0){
            var supp = 0;
            var F_size = highlighted;
        }else if(highlighted==0){
            var supp = 0;
            var F_size = 0;
        }else{

            var p_snf = intersection/total;
            var p_s = selected/total;
            var p_f = highlighted/total;

            supp = p_snf;
            conf = supp / p_f;
            conf2 = supp / p_s;
            lift = p_snf/(p_f*p_s); 

            var F_size = supp * 1/conf * total;
            var S_size = supp * 1/conf2 * total;


            // Feature 
            var	r2 = Math.sqrt(F_size/S_size)*r1;
            var a1 = Math.PI * Math.pow(r1,2);
            var a2 = Math.PI * Math.pow(r2,2);
            // Conf(F->S) * |F| = P(FnS)
            var intersection = supp * ifeed.main_plot.get_num_of_archs() * a1 / S_size;

            var c2x;
            if (conf2 > 0.999){
                c2x = c1x + r2 - r1;
            }else{
                var dist;
                $.ajax({
                    url: "/api/ifeed/venn-diagram-distance/",
                    type: "POST",
                    data: {a1: a1,
                           a2: a2,
                           intersection: intersection},
                    async: false,
                    success: function (data, textStatus, jqXHR)
                    {
                        dist = + data;
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {alert("error");}
                });
                c2x = c1x + dist;
            }

            svg.append("circle")
                .attr("id","venn_diag_c2")
                .attr("cx", c2x)
                .attr("cy", 180-30)
                .attr("r", r2)
                .style("fill", "brown")
                .style("fill-opacity", ".5");

        }


        svg.append("text")
            .attr("id","venn_diag_int_text")
            .attr("x",left_margin-10)
            .attr("y",70-30)
            .attr("font-family","sans-serif")
            .attr("font-size","18px")
            .attr("fill","black")
            .text("Intersection: " + Math.round(supp * total));


        svg.append("text")
            .attr("id","venn_diag_c2_text")
            .attr("x",c1x+60)
            .attr("y",180+r1+50-30)
            .attr("font-family","sans-serif")
            .attr("font-size","18px")
            .attr("fill","brown")
            .text("Features:" + Math.round(F_size) );
    }
    
}
