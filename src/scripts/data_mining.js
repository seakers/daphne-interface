class DataMining {
    constructor() {
        this.all_features = [];
        this.mined_features = [];
        this.added_features = [];
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
