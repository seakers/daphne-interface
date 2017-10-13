class TradespacePlot {

    constructor(output_list) {
        this.translate = [0,0];
        this.scale = 1;
        this.xIndex = null;
        this.yIndex = null;
        
        this.main_plot_params = {
            "margin": {top: 20, right: 20, bottom: 30, left: 60},
            "width": 960,
            "height": 540,
        };
        
        this.color = {
            "default": "#6E6E6E",
            "selected": "#19BAD7",
            "highlighted": "#F86591",
            "overlap": "#A340F0",
            "mouseover": "#74FF6E"
        };

        this.output_list = output_list;

        this.initialize();

        PubSub.subscribe(DATA_UPDATED, (msg, data) => {
            this.update(data, 0, 1);
        });
    }


    reset_main_plot() {
        //Resets the main plot
        d3.select("#main_plot").selectAll("svg").remove();
    }


    initialize() {
        d3.select("#support_panel").select("#view1").select("g").remove();
        d3.select("#support_panel").select("#view1").append("g")
                .append("div")
                .style("width","900px")
                .style("margin","auto")
                .append("div")
                .style("width","100%")
                .style("font-size","21px")
                .text("If you hover the mouse over a design, relevant information will be displayed here.");
    }


    update(source, xIndex, yIndex) {
        /*
            Draws the scatter plot with architecture inputs
            @param source: a JSON object array containing the basic arch info
        */
        
        this.reset_main_plot();
        
        let margin = this.main_plot_params.margin;
        let width = this.main_plot_params.width - margin.right - margin.left;
        let height = this.main_plot_params.height - margin.top - margin.bottom;

        // setup x 
        let xValue = function (d) {
            return d.outputs[xIndex];
        }; // data -> value
        
        let xScale = d3.scaleLinear().range([0, width]); // value -> display

        // don't want dots overlapping axis, so add in buffer to data domain 
        let xBuffer = (d3.max(source, xValue) - d3.min(source, xValue)) * 0.05;
        xScale.domain([d3.min(source, xValue) - xBuffer, d3.max(source, xValue) + xBuffer]);
        
        let xMap = function (d) {
            return xScale(xValue(d));
        }; // data -> display
        let xAxis = d3.axisBottom(xScale);

        // setup y
        let yValue = function (d) {
            return d.outputs[yIndex];
        }; // data -> value
        let yScale = d3.scaleLinear().range([height, 0]); // value -> display

        let yBuffer = (d3.max(source, yValue) - d3.min(source, yValue)) * 0.05;
        yScale.domain([d3.min(source, yValue) - yBuffer, d3.max(source, yValue) + yBuffer]);

        let yMap = function (d) {
            return yScale(yValue(d));
        }; // data -> display
        let yAxis = d3.axisLeft(yScale);
                
        this.xScale = xScale;
        this.yScale = yScale;
        this.xMap = xMap;
        this.yMap = yMap;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        // Create svg
        let svg = d3.select("#main_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(
                d3.zoom()
                .scaleExtent([0.4, 25])
                .on("zoom", function (d) {
                    svg = d3.select("#main_plot")
                            .select("svg");

                    svg.select(".main_plot.x.axis").call(xAxis);
                    svg.select(".main_plot.y.axis").call(yAxis);

                    objects.select(".hAxisLine").attr("transform", "translate(0," + yScale(0) + ")");
                    objects.select(".vAxisLine").attr("transform", "translate(" + xScale(0) + ",0)");

                    svg.selectAll(".main_plot.dot")
                            .attr("transform", function (d) {
                                var xCoord = xMap(d);
                                var yCoord = yMap(d);
                                return "translate(" + xCoord + "," + yCoord + ")";
                            });

                    this.translate = d3.event.translate;
                    this.scale = d3.event.scale;
                })
            )
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let that = this;

        // x-axis
        svg.append("g")
            .attr("class", "main_plot x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(() => {
                that.output_list[xIndex];
            });

        // y-axis
        svg.append("g")
            .attr("class", "main_plot y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(() => {
                that.output_list[yIndex];
            });

        let objects = svg.append("svg")
            .attr("class", "main_plot objects")
            .attr("width", width)
            .attr("height", height);

        //Create main 0,0 axis lines:
        objects.append("svg:line")
            .attr("class", "main_plot axisLine hAxisLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + (yScale(0)) + ")");
        objects.append("svg:line")
            .attr("class", "main_plot axisLine vAxisLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height)
            .attr("transform", "translate(" + (xScale(0)) + ",0)");

        let dots = objects.selectAll(".main_plot.dot")
            .data(source)
            .enter().append("circle")
            .attr("class", "dot main_plot")
            .attr("r", 3.3)
            .attr("transform", function (d) {
                let xCoord = xMap(d);
                let yCoord = yMap(d);
                return "translate(" + xCoord + "," + yCoord + ")";
            })
            .style("fill", this.color.default);

        
        dots.on("mouseover", this.arch_mouseover);
        dots.on('mouseout', this.arch_mouseout);

        d3.select("#main_plot").on("click",this.unhighlight_support_panel);
        d3.select("#support_panel").on("click",this.highlight_support_panel);

        
//        // Set button click operations
        d3.select("#selection_options #cancel_selection").on("click",this.cancel_selection);
        d3.select('#interaction_modes').selectAll('.tooltip').select('div').on('click',this.toggle_selection_mode);
        d3.select("#num_of_archs").text(""+this.get_num_of_archs());
    }


    toggle_selection_mode(){
        
        var mode = ifeed.UI_states.selection_mode;
        
        if(mode=="zoom-pan"){
            mode = "drag-select";
            d3.select("#zoom-pan")[0][0].checked=true;
            d3.select("#drag-select")[0][0].checked=false;
            d3.select("#de-select")[0][0].checked=false;
        }else if(mode=="drag-select"){
            mode =  "de-select";
            d3.select("#zoom-pan")[0][0].checked=false;
            d3.select("#drag-select")[0][0].checked=true;
            d3.select("#de-select")[0][0].checked=false;            
        }else{
            mode = "zoom-pan";
            d3.select("#zoom-pan")[0][0].checked=false;
            d3.select("#drag-select")[0][0].checked=false;
            d3.select("#de-select")[0][0].checked=true;
        }
        
        ifeed.UI_states.selection_mode = mode;
        this.change_interaction_mode(mode);     
    }


    cancel_selection(option){

        /*
           Removes selections and/or highlights in the scatter plot
           @param option: option to remove all selections and highlights or remove only highlights
        */
        
        
        if(option==null){
            
            // Remove both highlights and selections
            d3.selectAll(".main_plot.dot")
                .classed('selected',false)
                .classed('highlighted',false)
                .style("fill",this.color.default);

            if(!ifeed.UI_states.selection_changed){
                ifeed.UI_states.selection_changed=true;
                ifeed.data_mining.initialize();
            }
            
        }else if(option=='remove_selection'){
            
            // Remove only selection only
            d3.selectAll('.main_plot.dot.selected')[0].forEach(function(d){
                var dot = d3.select(d);
                dot.classed('selected',false);
                if(dot.classed('highlighted')){
                    // selected and highlighted
                    dot.style("fill", this.color.highlighted);
                }else{
                    // selected
                    dot.style("fill",this.color.default);
                }
            });
            
            if(!ifeed.UI_states.selection_changed){
                ifeed.UI_states.selection_changed=true;
                ifeed.data_mining.initialize();
            }
            
        }else if(option=='remove_highlighted'){
            
            // Remove only highlights
            d3.selectAll('.main_plot.dot.highlighted')[0].forEach(function(d){
                
                var dot = d3.select(d);
                dot.classed('highlighted',false);
                
                if(dot.classed('selected')){
                    dot.style("fill", this.color.selected);
                }else{
                    dot.style("fill",this.color.default);
                }
            });
        }

        // Reset the number of selected archs displayed
        d3.select("#num_of_selected_archs").text(""+this.get_num_of_selected_archs());
    }
    
    
    
    
    
    
    change_interaction_mode(option){ // three options: zoom-pan, drag-select, de-select

        var margin=this.main_plot_params.margin;
        var width=this.main_plot_params.width;
        var height=this.main_plot_params.height;

        var xScale = this.xScale;
        var xMap = this.xMap;
        var xAxis = this.xAxis;
        var yScale = this.yScale;
        var yMap = this.yMap;
        var yAxis = this.yAxis;

        if(option=="zoom-pan"){ // Zoom

            translate_local = this.translate;
            scale_local = this.scale;

            var svg =  d3.select(".main_plot.figure")
                .select("svg")
                .on("mousedown",null)
                .on("mousemove",null)
                .on("mouseup",null);

            d3.select(".main_plot.figure")
                .select("svg")
                .call(
                    d3.behavior.zoom()
                            .x(xScale)
                            .y(yScale)
                            .scaleExtent([0.4, 25])
                            .on("zoom", function (d) {

                                var svg = d3.select(".main_plot.figure")
                                            .select("svg");

                                svg.select(".main_plot.x.axis").call(xAxis);
                                svg.select(".main_plot.y.axis").call(yAxis);

                                objects.select(".main_plot.hAxisLine").attr("transform", "translate(0," + yScale(0) + ")");
                                objects.select(".main_plot.vAxisLine").attr("transform", "translate(" + xScale(0) + ",0)");
                                //d3.event.translate[0]

                                svg.selectAll(".main_plot.dot")
                                        .attr("transform", function (d) {
                                            var xCoord = xMap(d);
                                            var yCoord = yMap(d);
                                            return "translate(" + xCoord + "," + yCoord + ")";
                                        });

//                                svg.selectAll("[class=paretoFrontier]")
//                                        .attr("transform", function (d) {
//                                             var x = ScatterPlot_translate[0]*d3.event.scale + d3.event.translate[0];
//                                             var y = ScatterPlot_translate[1]*d3.event.scale + d3.event.translate[1];
//                                             var s = d3.event.scale*ScatterPlot_scale;
//                                            return "translate(" + x +","+ y + ")scale(" + s + ")";
//                                        })
//                                         .attr("stroke-width",function(){
//                                             return 1.5/(d3.event.scale*ScatterPlot_scale_local);
//                                         });

                                this.translate[0] = d3.event.translate[0] + translate_local[0]*d3.event.scale;
                                this.translate[1] = d3.event.translate[1] + translate_local[1]*d3.event.scale;
                                this.scale = d3.event.scale*scale_local;

                            })       
                )  
        } else{

            var svg =  d3.select(".main_plot.figure")
                .select("svg")
                .call(d3.behavior.zoom().on("zoom",null));

            svg.on( "mousedown", function() {

                    var p = d3.mouse( this);
                    svg.append( "rect")
                            .attr({
                                rx      : 0,
                                ry      : 0,
                                class   : "main_plot selection",
                                x       : p[0],
                                y       : p[1],
                                width   : 0,
                                height  : 0,
                                x0      : p[0],
                                y0      : p[1]
                            })
                            .style("background-color", "#EEEEEE")
                            .style("opacity", 0.18);

                })
                .on( "mousemove", function() {

                    var s = svg.select("rect.main_plot.selection");
                    if( !s.empty()) {
                        var p = d3.mouse( this);

                        var b = {
                            x       : parseInt( s.attr("x"),10),
                            y       : parseInt( s.attr("y"), 10),
                            x0       : parseInt( s.attr("x0"),10),
                            y0       : parseInt( s.attr("y0"), 10),
                            width   : parseInt( s.attr("width"),10),
                            height  : parseInt( s.attr("height"), 10)
                        };
                        var move = {
                            x : p[0] - b.x0,
                            y : p[1] - b.y0
                        };

                        if (move.x < 0){
                            b.x = b.x0 + move.x;

                        } else{
                            b.x = b.x0;
                        }
                        if (move.y < 0){
                            b.y = b.y0 + move.y;
                        } else {
                            b.y = b.y0;
                        }
                        b.width = Math.abs(move.x);
                        b.height = Math.abs(move.y);

                        s.attr(b);

                        if(option=="drag-select"){ // Make selection

                            d3.selectAll(".dot.main_plot:not(.selected)")[0].forEach(function(d,i){
                                
                                var xVal = d.__data__.outputs[this.xIndex];
                                var yVal = d.__data__.outputs[this.yIndex];
                                var xCoord = xScale(xVal);
                                var yCoord = yScale(yVal);

                                if( 
                                    xCoord + margin.left>= b.x && xCoord + margin.left <= b.x+b.width && 
                                    yCoord + margin.top >= b.y && yCoord + margin.top  <= b.y+b.height
                                ) {
                                    // Select
                                    var dot = d3.select(d);
                                    dot.classed('selected',true);

                                    if(dot.classed('highlighted')){
                                        // highlighted and selected
                                        dot.style("fill", this.color.overlap);      
                                    }else{
                                        // selected but not highlighted
                                        dot.style("fill", this.color.selected);      
                                    }
                                    
                                    if(!ifeed.UI_states.selection_changed){
                                        ifeed.UI_states.selection_changed=true;
                                        ifeed.data_mining.initialize();
                                    }
                                }
                            });

                        }else{  // De-select
                            
                            d3.selectAll(".dot.main_plot.selected")[0].forEach(function(d,i){
                                
                                var xVal = d.__data__.outputs[this.xIndex];
                                var yVal = d.__data__.outputs[this.yIndex];
                                var xCoord = xScale(xVal);
                                var yCoord = yScale(yVal);

                                if( 
                                    xCoord + margin.left>= b.x && xCoord + margin.left <= b.x+b.width && 
                                    yCoord + margin.top >= b.y && yCoord + margin.top  <= b.y+b.height
                                ) {
                                    
                                    // Cancel selection
                                    var dot = d3.select(d);
                                    dot.classed('selected',false);

                                    if(dot.classed('highlighted')){
                                        // was selected and highlighted
                                        dot.style("fill", this.color.highlighted);      
                                    }else{
                                        // was not highlighted
                                        dot.style("fill", this.color.default);   
                                    }
                                    
                                    if(!ifeed.UI_states.selection_changed){
                                        ifeed.UI_states.selection_changed=true;
                                        ifeed.data_mining.initialize();
                                    }
                                    
                                }
                            });
                        }
                        
                        d3.select("#num_of_selected_archs").text(""+this.get_num_of_selected_archs());
                    }      
                })
                .on( "mouseup", function() {
                    //unhighlight_support_panel();
                    // remove selection frame
                    d3.select('.main_plot.figure').select('svg').selectAll( "rect.selection").remove();
                })
        }               
    }
    
    
    
    hide_selection(){
        
        var selected = d3.selectAll(".dot.main_plot.selected");

        selected.classed('hidden',true)
                .classed('selected',false)
                .classed('highlighted',false)
                .style('fill',this.color.default)
                .style("opacity", 0.085);

        d3.select("#num_of_selected_archs").text(""+this.get_num_of_selected_archs());
        d3.select("#num_of_archs").text(""+this.get_num_of_archs());
    }


    show_all_archs(){
        
        var hidden = d3.selectAll(".dot.main_plot.hidden");
        hidden.classed('hidden',false)
                .style("opacity",1);

        d3.select("#num_of_selected_archs").text(""+this.get_num_of_selected_archs());
        d3.select("#num_of_archs").text(""+this.get_num_of_archs());
    }


    get_num_of_archs(){
        /*
            Counts the number of all archs displayed
            @return: the number of dots
        */
        return d3.selectAll('.main_plot.dot:not(.hidden)')[0].length;
    }


    get_num_of_selected_archs(){
        /*
            Counts the number of selected archs
            @return: the number of dots selected
        */
        return d3.selectAll('.dot.selected.main_plot:not(.hidden)')[0].length; 
    }

    
    arch_mouseover(d) {

        var arch = d;
        
        // The support panel is active, disable hovering 
        if(ifeed.UI_states.support_panel_active){
            return;
        }

        // Change the color of the dot temporarily
        d3.select(this).style("fill",this.color.mouseover);

        // Remove the previous info
        d3.select("#support_panel").select("#view1").select("g").remove();
        
        var support_panel = d3.select("#support_panel").select("#view1")
                .append("g");

        // Display the current architecture info
        var arch_info_display = support_panel.append('div')
                .attr('id','arch_info_display')
                .style('width','90%')
                .style('float','left');

        
        for(var i=0;i<ifeed.metadata.output_num;i++){
            
            arch_info_display.append("p")
            
                            .text(function(d){
                
                                var out = ifeed.metadata.output_list[i] + ": ";
                                var val = arch.outputs[i];
                
                                if(typeof val == 'number'){
                                    if(val>100){ val = val.toFixed(2); }
                                    else{ val = val.toFixed(4); }
                                }
                
                                return out + val;
                            });
        }

        ifeed.problem.display_arch_info(arch);
        
        document.getElementById('tab1').click();
    }    
    
    
    
    arch_mouseout(d) {
        
        var dot = d3.select(this)
        if(dot.classed('selected') && dot.classed('highlighted')){
            dot.style('fill', this.color.overlap);
        }else if(dot.classed('selected')){
            dot.style('fill',this.color.selected);  
        }else if(dot.classed('highlighted')){
            dot.style('fill',this.color.highlighted);
        }else{
            dot.style("fill", this.color.default);
        }
    }
    
    
    highlight_support_panel(){

        d3.select(".main_plot.figure")
            .style("border-width","1px");
        d3.select("#support_panel")
            .style("border-width","3.3px");
        
        ifeed.UI_states.support_panel_active=true;
    }


    unhighlight_support_panel(){

        d3.select(".main_plot.figure")
                .style("border-width","3.3px");
        d3.select("#support_panel")
                .style("border-width","1px");
        
        ifeed.UI_states.support_panel_active=false;
    }
}
