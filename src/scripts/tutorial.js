class Tutorial {

    constructor() {        
        this.intro = introJs();
    }

    
    start_intro(objects, messages, classname, callback){
        
        if(messages.length==1){
            this.intro.setOption('showButtons',false).setOption('showBullets',false);
        }else{
            this.intro.setOption('showButtons',true).setOption('showBullets',true);
        }
        
        if(!classname){
            classname = 'introjs_tooltip';
        }
        
        var steps = [];
        var last_object = null;
        
        for(var i=0;i<messages.length;i++){

            if(!objects){
                steps.push({intro:messages[i]});
            }else{
                if(!objects[i]){
                    if(!last_object){
                        steps.push({intro:messages[i]});
                    }else{
                        steps.push({element:last_object,intro:messages[i]});
                    }
                }else{
                    last_object = objects[i];
                    steps.push({element:objects[i],intro:messages[i]});
                }
            }
        }
        
        console.log(steps);
        
        this.intro.setOption('showProgress', true).setOptions({steps:steps,tooltipClass:classname});
        
        if(callback){
            this.intro.onchange(callback); 
        }
        
        this.intro.start(); 
    }    
    
        
    run_tutorial(){

        let sequence = [];
        
        sequence.push({"highlight":null,
                            "text":"In this experiment, you will solve a system architecting problem with the help of a virtual assistant called Daphne."
                        });

        sequence.push({"highlight":null,
                            "text":"The task at hand deals with designing a constellation of satellites for Earth observation. This experiment does not require any background knowledge in this area."
                        });        
        
        sequence.push({"highlight":$('#arch_info_display_table')[0],
                            "text":"Each design is represented by a table as shown here. It shows which set of measurement instruments is assigned to fly in each orbit. Each row represents one spacecraft flying in a specified orbit. Orbits are defined by various parameters, such as altitude and inclination"
                        });       
        
        sequence.push({"highlight":$('#arch_info_display_table')[0],
                            "text":"Each column represents what measurement instruments (sensors) are onboard each of those spacecraft. The instruments include spectrometers, lidars, radars, imagers, etc."
                        });              
        
        sequence.push({"highlight":$('#arch_info_display_table')[0],
                            "text":"The real names of orbits and instruments were changed to numbers and alphabetical letters repectively to make the task simpler. There are total 5 candidate orbits, and 12 available measurement instruments."
                        });           // 6 instead of 12?
        
        
        sequence.push({"highlight": null, // Highlight the cheatsheet that shows orbit and instrument info
                            "text":"Detailed information on what these orbits and instruments are is given in the cheatsheet as shown. You don't have to pay attention to these information for now, but it may come in handy later in the design task."
                        });     
        
        sequence.push({"highlight":$('#main_plot_block')[0],
                            "text":"This is the plot that shows the main trade-off of the designs. Each dot here is a single design, and each design has associated science score (a measure of performance) and cost. The science score represents how much value each design brings to the climate monitoring community, and the cost is a measure of how much it is going to cost (in million dollars)."
                        });      
        
        sequence.push({"highlight":$('#main_plot_block')[0],
                            "text":"Your task in the experiment will be to find designs that maximize the science score while minimizing the cost."
                        });            
        
        sequence.push({"highlight":$('.columns > div > section')[0],
                            "text":"As you hover over each dot on the scatter plot, you can see the corresponding information being changed. If you click a dot, it is replaced by a cross. The cross means you have selected that design."
                        });                    
        
        sequence.push({"highlight":$('.panel.design_inspector')[0],
                            "text":"You can move the instruments from one orbit to another orbit, add new instrument, or remove it using drag-and-drop. After modifying the design, you can evaluate it using the \"Evaluate Architecture\" button on the top-right side. After the evaluation is finished, a cross will appear on the scatter plot with its location determined by the new science score and cost."
                        });   
        
        sequence.push({"highlight":$('.panel.design_inspector')[0],
                            "text":"In one of the tasks, you will be asked to try to find good designs (maximizing science and minimizing cost), just using this method."
                        });    
        
        sequence.push({"highlight":$('.navbar-menu')[0],
                            "text":"In anohter task, a virtual assistant called Daphne will help you find good designs. You can communicate with Daphne through this text input field. You can ask various questions here."
                        });           
        
        
        sequence.push({"highlight":$('.navbar-menu')[0],
                            "text":"For example, you can ask what Daphne thinks about a specific design. Then Daphne will give her thoughts on the design along with some hints on how you might want to improve it."
                        });                   
        
        
        
        let objects = [];
        let messages = [];
        let classname = "introjs_tooltip"
        let callback = null
        
        for(var i=0;i<sequence.length;i++){
            objects.push(sequence[i].highlight);
            messages.push(sequence[i].text);
        }        
    
        this.start_intro(objects,messages,classname,callback);
    }
    
}

