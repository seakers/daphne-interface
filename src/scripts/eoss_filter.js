class EOSSFilter extends Filter {
    
    constructor(eoss, tradespace_plot, label) {
        
        super();
        
        this.eoss = eoss;
        this.tradespace_plot = tradespace_plot;
        this.label = label;
        
        this.preset_options = [{value:"not_selected",text:"Preset Filters"},
                               {value:"paretoFront",text:"Pareto front"},
                               {value:"present",text:"Present",input:"singleInst",hints:"Designs that have the specified instrument are selected"},
                               {value:"absent",text:"Absent",input:"singleInst",hints:"Designs that do not have the specified instrument are selected"},
                               {value:"inOrbit",text:"In orbit",input:"orbitAndMultipleInstInput",hints:"Designs that have the specified instruments inside the chosen orbit are selected"},
                               {value:"notInOrbit",text:"Not in orbit",input:"orbitAndMultipleInstInput",hints:"Designs that do not have the specified instruments inside the chosen orbit are selected",},
                               {value:"together",text:"Together",input:"multipleInstInput",hints:"Designs that have the specified instruments in any one orbit are chose"},
                               {value:"separate",text:"Separate",input:"multipleInstInput",hints:"Designs that do not have the specified instruments in the same orbit are chosen"},
                               {value:"emptyOrbit",text:"Empty orbit",input:"orbitInput",hints:"Designs that have no instrument inside the specified orbit are chosen"},
                               {value:"numOrbits",text:"Number of orbit used",input:"numOrbit",hints:"Designs that have the specified number of non-empty orbits are chosen"},
                               {value:"numOfInstruments",text:"Number of instruments",input:"numOfInstruments",hints:"This highlights all the designs with the specified number of instruments. If you specify an orbit name, it will count all instruments in that orbit. If you can also specify an instrument name, and only those instruments will be counted across all orbits. If you leave both instruments and orbits blank, all instruments across all orbits will be counted."},
                               {value:"subsetOfInstruments",text:"Num of instruments in a subset",input:"subsetOfInstruments",hints:"The specified orbit should contain at least m number and at maximum M number of instruments from the specified instrument set. m is the first entry and M is the second entry in the second field"},
                            ];  
        
        PubSub.subscribe(DATA_UPDATED, (msg, data) => {
            this.reset();
        });
        
        PubSub.subscribe(APPLY_FILTER, (msg, data) => {
            this.apply_filter_expression(data);
        });             
        
    }
    
        
    reset(){
                
        d3.select(".filter > .panel-block").select('#filter_select_menu').selectAll('option').remove();
        let filter_setting = d3.select('.filter > .panel-block')
            .append('g');    
        
        d3.select('#filter_select_menu')
                .selectAll('option')
                .data(this.preset_options)
                .enter()
                .append("option")
                .attr("value",function(d){
                    return d.value;
                })
                .text(function(d){
                    return d.text;
                });   

        let that = this;
        
        d3.select("#filter_select_menu").on("change",function(d){
            var option = d3.select('#filter_select_menu')._groups[0][0].value; 
            that.initialize_preset_filter_input(option); 
        });    
        
        d3.select('#apply_filter_button').on('click',function(d){
            that.applyFilter();
        });
            
    }
    
    

    get_preset_option(option) {
        for(var i=0;i<this.preset_options.length;i++){
            if(this.preset_options[i].value==option){
                return this.preset_options[i];
            }
        }
        return null;
    }
    
    
    initialize_preset_filter_input(option) {
                
        var filter_message_input = d3.select('#filter_message_input');
        var filter_message_hint = d3.select('#filter_message_hint');
        
        filter_message_input.selectAll('div').remove();
        filter_message_hint.selectAll('div').remove();
        
        if (option==="not_selected"){
            return;
        }        
        
        
        filter_message_input.append('div')
            .attr('class','message-body')
            .append("div")
            .attr('id','filter_inputs');
        
        
        filter_message_hint.append('div')
            .attr('class','message-header')
            .append('p')
            .text('Valid Inputs');
        
        filter_message_hint.select('.message-header')
            .append('button')
            .attr('class','delete')
            .attr('aria-label','delete');
                
        filter_message_hint.append('div')
                .attr('class','message-body')
                .append('div')
                .attr('id','filter_hints');

        
        
        if(option=="paretoFront"){
            d3.select('#filter_inputs')
                .append("div")
                .attr("id","filter_input_1")
                .text("Input Pareto Ranking (Integer number between 0-15): ")
                .append("input")
                .attr("type","text");
            
        }else{
            
            var inputType = this.get_preset_option(option).input;
            
            var filter_inputs = d3.select('#filter_inputs');
            
            var filter_input_1 = filter_inputs.append('div')
                                                .attr('id','filter_input_1');
            
            var filter_input_2 = filter_inputs.append('div')
                                                .attr('id','filter_input_2');
            
            var filter_input_3 = filter_inputs.append('div')
                                                .attr('id','filter_input_3');
            
            switch(inputType) {
                    
                case "singleInst":
                    filter_input_1.text("Input single instrument name: ");
                    filter_input_1.append("input")
                                .attr("type","text");
                    break;
                    
                case "orbitAndMultipleInstInput":
                    filter_input_1.text("Input orbit name: ");
                    filter_input_1.append("input")
                                .attr("type","text");
                    
                    filter_input_2.text("Input instrument names (minimum 1, and maximum 3) separated by comma: ");
                    filter_input_2.append("input")
                                .attr("type","text");
                    break;
                    
                case "orbitInput":
                    filter_input_1.text("Input orbit name: ");
                    filter_input_1.append("input")
                                .attr("type","text");
                    break;
                    
                case "numOrbit":
                    filter_input_1.text("Input number of orbits");
                    filter_input_1.append("input")
                                .attr("type","text");
                    break;
                
                case "numOfInstruments":
                    filter_input_1.text("Input an orbit name (Could be N/A): ");
                    filter_input_1.append("input")
                                .attr("type","text")
                                .attr("value","N/A");    
                    filter_input_2.text("Input instrument name (Could be N/A): ");
                    filter_input_2.append("input")
                                .attr("type","text")
                                .attr("value","N/A");
                    filter_input_3.text("Input a number of instrument used (should be greater than or equal to 0): ");
                    filter_input_3.append("input")
                                .attr("type","text")
                                .attr("value","N/A");
                    break;
                
                case "subsetOfInstruments":
                    filter_input_1.text("Input orbit name: ");
                    filter_input_1.append("input")
                                .attr("type","text");    
                    filter_input_2.text("Input the min and the max (optional) number of instruments in the subset, separated by comma: ");
                    filter_input_2.append("input")
                                .attr("type","text");
                    filter_input_3.text("Input a set of instrument names, separated by comma: ");
                    filter_input_3.append("input")
                                .attr("type","text");
                    break;
                    
                    
                case "multipleInstInput":
                    filter_input_1.text("Input instrument names (2 or 3) separated by comma:");
                    filter_input_1.append("input")
                        .attr("type","text");
                    break;
                    
                default:
                    break;
            }
        }

        d3.select("#filter_hints")
            .append("div")
            .html('<p>Valid orbit names: LEO-600-polar-NA, SSO-600-SSO-AM, SSO-600-SSO-DD, SSO-800-SSO-DD, SSO-800-SSO-PM</p>'
                    +'Valid instrument names: ACE_ORCA, ACE_POL, ACE_LID, CLAR_ERB, ACE_CPR, DESD_SAR, DESD_LID, GACM_VIS, GACM_SWIR, HYSP_TIR, POSTEPS_IRS, CNES_KaRIN');      
    }
    
    

    
    get_number_of_inputs() {
        return d3.select('#filter_inputs').selectAll('div').selectAll('input').length;
    }

    
    applyFilter() {

        var invalid_input = false;
                
        var option = d3.select('#filter_select_menu')._groups[0][0].value; 
        
        var filter_expression;
        
        var matchedArchIDs = [];
        
        var inputText = [];
        var inputDiv =  d3.select('#filter_inputs').selectAll('div').select('input')._groups[0];

        inputDiv.forEach(function(d,i){

            if(d.value!=null || d.value !=""){
                // Remove all white spaces
                var input = d.value.replace(/\s+/g, "");
                inputText.push(input);
            }else{
                // If textbox is empty, push null
                inputText.push(null);
            }
        });


        // Example of an filter expression: {presetName[orbits;instruments;numbers]} 
        
        if(option=="present" || option=="absent" || option=="together" || option=="separate"){
                        
            var instrument = inputText[0];
            var inst_relabel = this.label.displayName2Index(instrument.toUpperCase(),"instrument");
            if(inst_relabel==null){
                invalid_input=true;
            }
            filter_expression = option + "[;" + inst_relabel + ";]";
            
        }else if(option == "inOrbit" || option == "notInOrbit"){
            
            var orbit = inputText[0].trim();
            var instrument = inputText[1];
            
            var orb_relabel = this.label.displayName2Index(orbit,"orbit");
            var inst_relabel = this.label.displayName2Index(instrument.toUpperCase(),"instrument");
            if(inst_relabel==null || orb_relabel==null){
                invalid_input=true;
            }            
            
            filter_expression = option + "["+ orb_relabel + ";" + inst_relabel + ";]";
            
        }else if(option =="emptyOrbit"){
            
            var orbit = inputText[0].trim();
            
            var orb_relabel = this.label.displayName2Index(orbit,"orbit");
            if(orb_relabel==null){
                invalid_input=true;
            }         
            
            filter_expression = option + "[" + orb_relabel + ";;]";
            
        }else if(option=="numOrbits"){
            
            var number = inputText[0].trim();
            filter_expression = option + "[;;" + number + "]";
            
        }else if(option=="subsetOfInstruments"){
            
            var orbit = inputText[0].trim();
            var instrument = inputText[2];
            
            var orb_relabel = this.label.displayName2Index(orbit,"orbit");
            var inst_relabel = this.label.displayName2Index(instrument.toUpperCase(),"instrument");
            if(inst_relabel==null || orb_relabel==null){
                invalid_input=true;
            }                    
            
            var numbers = inputText[1].trim().replace(/\s+/g, "");
            filter_expression = option + "["+ orb_relabel + ";" + inst_relabel + ";"+ numbers+"]";
            
        }else if(option=="numOfInstruments"){
            
            var orbit = inputText[0];
            var instrument = inputText[1];
            var number = inputText[2];
            // There are 3 possibilities

            var orbitEmpty = false; 
            var instrumentEmpty = false;

            if(orbit=="N/A" || orbit.length==0){
                orbitEmpty=true;
            }
            if(instrument=="N/A" || instrument.length==0){
                instrumentEmpty = true;
            }
            if(orbitEmpty && instrumentEmpty){
                // Count all instruments across all orbits
                filter_expression=option + "[;;" + number + "]";
            }else if(orbitEmpty){
                // Count the number of specified instrument
                
                var inst_relabel = this.label.displayName2Index(instrument.toUpperCase(),"instrument");
                if(inst_relabel==null){
                    invalid_input=true;
                }                
                filter_expression=option + "[;" + inst_relabel + ";" + number + "]";
                
            }else if(instrumentEmpty){
                // Count the number of instruments in an orbit
                orbit = orbit.trim();
                
                var orb_relabel = this.label.displayName2Index(orbit,"orbit");
                if(orb_relabel==null){
                    invalid_input=true;
                }                   
                filter_expression=option + "[" + orb_relabel + ";;" + number + "]";
            }
            
        } else if(option==="paretoFront"){

            // To be implemented    
            filter_expression = "paretoFront["+inputText[0]+"]";

        }else{// not selected
            return;
        }
        
        filter_expression = "{" + filter_expression + "}";
        
        if(invalid_input){
            alert("Invalid input argument");
            return false;
        }        
        
        if(filter_expression.indexOf('paretoFront')!=-1){
            this.apply_filter_expression(filter_expression);

        }else{
            //PubSub.publish(UPDATE_FEATURE_APPLICATION, {"option":"direct-update","expression":filter_expression});
            //ifeed.feature_application.update_feature_application('direct-update',filter_expression);
            this.apply_filter_expression(filter_expression);
        }

        return true;
    }
    

    
    
    
    apply_filter_expression(input_expression) {
        
        var feature_expression = input_expression;

        // Cancel all previous selections
        this.tradespace_plot.cancel_selection('remove_highlighted');

        // If filter expression is empty, return
        if(feature_expression==="" || !feature_expression){
            return;
            
        }else{
                                    
            var filtered_data = this.process_filter_expression(feature_expression, this.tradespace_plot.data, "&&");
                        
            filtered_data.forEach(point => {                
                point.highlighted = true;
                if (point.selected) {
                    point.drawingColor = this.tradespace_plot.color.overlap;
                }else{
                    point.drawingColor = this.tradespace_plot.color.highlighted;
                }
            });
            this.tradespace_plot.update(0, 1);
        }

        d3.select("#num_of_selected_archs").text(""+this.tradespace_plot.get_num_of_selected_archs());
    }
    
    
    
    
    process_filter_expression(expression, data, logic) {
        
        var e,_e;

        e=expression;
        // Remove outer parenthesis
        e = remove_outer_parentheses(e);
        _e = e;

        var filtered = [];
        var first = true;
        var last = false;

        if(get_nested_parenthesis_depth(e)==0){

            // Given expression does not have a nested structure
            if(e.indexOf("&&") == -1 && e.indexOf("||") == -1){

                // There is no logical connective: Single filter expression
                for(var i=0;i<data.length;i++){
                    if(this.apply_preset_filter(e,data[i])){
                        filtered.push(data[i]);
                    }
                }
                return filtered;

            }
            else{
                // Do nothing
            }

        }else{
            // Removes the nested structure by replacing all the nested expressions using an arbitrary symbol "X"
            _e = collapse_paren_into_symbol(e);
        }


        while(!last){
            var e_temp, _e_temp;

            if(first){
                // The first filter in a series to be applied
                filtered = data;
                first = false;
            }else{
                logic = _e.substring(0,2);
                _e = _e.substring(2);
                e = e.substring(2);
            }


            var next; // The imediate next logical connective
            var and = _e.indexOf("&&");
            var or = _e.indexOf("||");
            if(and==-1 && or==-1){
                next = "";
            } else if(and==-1){ 
                next = "||";
            } else if(or==-1){
                next = "&&";
            } else if(and < or){
                next = "&&";
            } else{
                next = "||";
            }

            if(next){
                _e_temp = _e.split(next,1)[0];
                e_temp = e.substring(0,_e_temp.length);

                _e = _e.substring(_e_temp.length);
                e = e.substring(_e_temp.length);
            }else{
                _e_temp = _e;
                e_temp = e;
                last=true;
            }


            if(logic=='||'){
                var filtered_temp = this.process_filter_expression(e_temp,data,logic);
                for(var j=0;j<filtered_temp.length;j++){
                    if(filtered.indexOf(filtered_temp[j])==-1){
                        filtered.push(filtered_temp[j]);
                    }
                }

            }else{
                filtered = this.process_filter_expression(e_temp,filtered,logic); 
            }

        }
        return filtered;
    }
    


    /*
        Compares the preset filter to a single architecture
        @param expression: A filter expression string

        @return: A boolean indicating whether the input architecture passes the filter
    */
    apply_preset_filter(input_expression,data) {

        var expression = remove_outer_parentheses(input_expression);
        
        // Preset filter: {presetName[orbits;instruments;numbers]}   
        expression = expression.substring(1,expression.length-1);

        var flip=false;
        if(expression.startsWith("~")){
            flip=true;
            expression = expression.substring(1,expression.length);
        }
        
        var norb = this.eoss.orbit_num;
        var ninstr = this.eoss.instrument_num;
        var type = expression.split("[")[0];
        var bitString = data.inputs;

        if(type==="paretoFront"){
            
            if(data.pareto_ranking || data.pareto_ranking==0){
                var rank = +data.pareto_ranking;
                var arg = +expression.substring(0,expression.length-1).split("[")[1];
                if(rank <= arg){
                    return true;
                }else{
                    return false;
                }
            }
        }

        var condition = expression.substring(0,expression.length-1).split("[")[1];
        var condSplit = condition.split(";");
        var orbit, instr, numb;

        orbit = condSplit[0];
        instr = condSplit[1];
        numb = condSplit[2];

        var resu;
        switch(type) {
        case "present":
            if(instr=='-1') return false;
            resu=false;
            instr = +instr;
            for(var i=0;i<norb;i++){
                if(bitString[ninstr*i+instr]){
                    resu=true;break;
                }
            }
            break;
        case "absent":
            if(instr==-1) return false;
                
            resu=true;
            instr = + instr;
            for(var i=0;i<norb;i++){
                if(bitString[ninstr*i+instr]){
                    resu=false;break;
                }
            }
            break;
                
        case "inOrbit":
            orbit = + orbit;
            if(instr.indexOf(',')==-1){
                // One instrument
                resu=false;
                instr = + instr;
                if(bitString[orbit*ninstr + instr]){
                    resu=true;
                }
                break;    		
            }else{
                // Multiple instruments
                resu=true;
                var instruments = instr.split(",");
                for(var j=0;j<instruments.length;j++){
                    var temp = +instruments[j];
                    if(!bitString[orbit*ninstr + temp]){
                        resu= false;break;
                    }
                }    		
            }
            break;
        case "notInOrbit":
            orbit = + orbit;
            if(instr.indexOf(',')==-1){
                // One instrument
                instr = + instr;
                resu=true;
                if(bitString[orbit*ninstr + instr]){
                    resu=false;
                }
                break;    		
            }else{
                // Multiple instruments
                resu=true;
                var instruments = instr.split(",");
                for(var j=0;j<instruments.length;j++){
                    var temp = +instruments[j];
                    if(bitString[orbit*ninstr + temp]){
                        resu= false;break;
                    }
                }    		
            }
            break; 
        case "together":
            resu=false;
            var instruments = instr.split(",");
            for(var i=0;i<norb;i++){
                var found = true;
                for(var j=0;j<instruments.length;j++){
                    var temp = +instruments[j];
                    if(!bitString[i*ninstr+temp]){
                        found=false;
                    }
                }
                if(found===true){
                    resu=true;break;
                }
            }
            break;

        case "separate":
            resu=true;
            var instruments = instr.split(",");
            
            for(var i=0;i<norb;i++){
                
                var found = false;
                
                for(var j=0;j<instruments.length;j++){
                    var temp = +instruments[j];
                    if(bitString[i*ninstr+temp]){
                        if(found){
                            resu=false;
                            break;
                        }else{
                            found=true;
                        }
                    }
                }
                if(resu===false) break;
            }
            break;

        case "emptyOrbit":
            resu=true;
            orbit = +orbit;
            for(var i=0;i<ninstr;i++){
                if(bitString[orbit*ninstr+i]){
                    resu= false;break;
                }
            }
            break;

        case "numOrbits":
            var count=0;
            resu=false;
            numb = + numb;
            for(var i=0;i<norb;i++){
                for(var j=0;j<ninstr;j++){
                    if(bitString[i*ninstr+j]){
                        count++;
                        break;
                    }
                }
            }
            if(numb===count){
                resu= true;
            }
            break;

        case "subsetOfInstruments":
            var count = 0;    	
            var instruments = instr.split(",");
            var numbers = numb.split(",");
            orbit = +orbit;
            resu=false;

            for(var j=0;j<instruments.length;j++){
                var temp = +instruments[j];
                if(bitString[orbit*ninstr + temp]){
                    count++;
                }
            }
            if(numbers.length==1){
                if(count >= +numbers[0]){
                    resu= true;
                }
            }else{
                if(count >= +numbers[0] && count <= +numbers[1]){
                    resu= true;
                }
            }
            break;

        case "numOfInstruments":
            var count=0;
            resu=false;
            numb = +numb;

            if(orbit===""){
                // num of instruments across all orbits
                if(instr===""){
                    // num of specified instrument
                    for(var i=0;i<norb;i++){
                        for(var j=0;j<ninstr;j++){
                            if(bitString[i*ninstr+j]) count++;
                        }
                    }
                }else{
                    instr = +instr;
                    // num of all instruments
                    for(var i=0;i<norb;i++){
                        if(bitString[i*ninstr+instr]){
                            count++;
                        }
                    }
                }
            }else{
                orbit = +orbit;
                // number of instruments in a specified orbit
                for(var i=0;i<ninstr;i++){
                    if(bitString[orbit*ninstr+i]){
                        count++;
                    }
                }
            }
            if(count===numb) resu= true;
            break;

        default:
            return false;
        }

        if(flip==true){
            return !resu;
        }else{
            return resu;
        }
    }

}
        