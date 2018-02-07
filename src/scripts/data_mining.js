class DataMining {
    constructor(tradespace_plot, label) {
        this.tradespace_plot = tradespace_plot;
        this.label = label;

        this.all_features = [];
        this.mined_features = [];
        this.added_features = [];

        this.current_feature = { id: null, name: null, expression: null, metrics: null, added: "0", x0: -1, y0: -1, x: -1, y: -1 };
        this.current_feature_blink_interval = null;
    }

    async draw_venn_diagram(){
        let venn_diagram_container = d3.select("#venn_diagram");

        if (venn_diagram_container.node() == null) {
            return;
        }

        venn_diagram_container.select("svg").remove();

        let svg = venn_diagram_container
            .append("svg")
            .style("width", "300px")
            .style("border-width", "3px")
            .style("height", "285px")
            .style("border-style", "solid")
            .style("border-color", "black")
            .style("border-radius", "40px")
            .style("margin-top", "10px")
            .style("margin-bottom", "10px");


        let total = this.tradespace_plot.get_num_of_archs();
        let intersection = this.tradespace_plot.get_num_of_intersected_archs();
        let selected = this.tradespace_plot.get_num_of_selected_archs();
        let highlighted = this.tradespace_plot.get_num_of_highlighted_archs();


        let left_margin = 50;
        let c1x = 110;
        // Selection has a fixed radius
        let r1 = 70;
        let S_size = selected;

        let supp, conf, conf2, lift, F_size;

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


        if (intersection == 0) {
            supp = 0;
            F_size = highlighted;
        }
        else if (highlighted == 0) {
            supp = 0;
            F_size = 0;
        }
        else {
            let p_snf = intersection/total;
            let p_s = selected/total;
            let p_f = highlighted/total;

            supp = p_snf;
            conf = supp / p_f;
            conf2 = supp / p_s;
            lift = p_snf/(p_f*p_s);

            F_size = supp * 1/conf * total;
            S_size = supp * 1/conf2 * total;


            // Feature
            let r2 = Math.sqrt(F_size/S_size)*r1;
            let a1 = Math.PI * Math.pow(r1,2);
            let a2 = Math.PI * Math.pow(r2,2);
            // Conf(F->S) * |F| = P(FnS)
            intersection = supp * total * a1 / S_size;

            let c2x;
            if (conf2 > 0.999) {
                c2x = c1x + r2 - r1;
            }
            else {
                let dist;
                try {
                    let req_data = new FormData();
                    req_data.append("a1", a1);
                    req_data.append("a2", a2);
                    req_data.append("intersection", intersection);
                    let data_response = await fetch(
                        "/api/ifeed/venn-diagram-distance/",
                        {
                            method: "POST",
                            body: req_data,
                            credentials: "same-origin"
                        }
                    );

                    if (data_response.ok) {
                        let dist = + await data_response.text();
                    }
                    else {
                        console.error("Error computing the distances.");
                    }
                }
                catch(e) {
                    console.error("Networking error:", e);
                }
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
            .text("Features:" + Math.round(F_size));
    }


    add_feature_to_plot(expression){

        function find_equivalent_feature(metrics,indices){

            for(var i=0;i<self.all_features.length;i++){
                var _metrics = self.all_features[i].metrics;
                var match = true;
                for(var j=0;j<indices.length;j++){
                    var index = indices[j];
                    if(roundNum(metrics[index])!=roundNum(_metrics[index])){
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
}
