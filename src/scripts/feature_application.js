import * as utils from './utils';

export default class FeatureApplication {
    constructor() {
        this.draggingNode = null;
        this.selectedNode = null;
        this.dragStarted = false;
        this.contextMenu = null;

        PubSub.subscribe(utils.INITIALIZE_FEATURE_APPLICATION, (msg, data) => {
            this.clear_feature_application()
        });
    }

    dragStart(d){

        // Dragging disabled in the root node
        if(d==this.data){return;}
        if(d3.event.sourceEvent.which != 1){return;}

        this.dragStarted=true;

        d3.event.sourceEvent.stopPropagation();

        let id = d.id;
        this.draggingNode=d;

        // Remove the link to the parent node
        d3.selectAll('.link').filter(function(d){
            if(d.target.id == id){
                return true;
            }else{
                return false;
            }
        }).remove();

        d3.selectAll('.nodeRange').filter(function(d){
            if(d.type=='leaf'){
                return false;
            }else{
                return true;
            }
        }).style('opacity',0.2);

        d3.select(this)
                .select('.nodeRange')
                .style('opacity',0);

        d3.select(this).attr('pointer-events','none');

        if(d.type=="leaf"){
            return;
        }else{
            // Remove all descendant nodes and links
            this.remove_descendants(id);
        }
    }


    drag(d){

        if(this.dragStarted){
            var coord = d3.mouse($('#feature_application_panel > svg > g').get(0));

            d.x0 += coord[0];
            d.y0 += coord[1];

            var node = d3.select(this);
            node.attr("transform","translate("+ coord[0] + "," + coord[1] + ")");

            var target = {};
            target.x = coord[0];
            target.y = coord[1];
            this.updateTempConnector(target);
        }

    }

    dragEnd(d){

        if(this.dragStarted){

            d3.selectAll('.nodeRange')
                .style('opacity',0);

            d3.select(this).attr('pointer-events', '');

            d3.selectAll(".tempTreeLink").remove();


            if(this.selectedNode){

                // Remove the element from the parent, and insert it into the new elements children
                var index = this.draggingNode.parent.children.indexOf(this.draggingNode);
                if (index > -1) {
                    this.draggingNode.parent.children.splice(index, 1);
                }
                if (typeof this.selectedNode.children !== 'undefined') {
                    this.selectedNode.children.push(this.draggingNode);
                } else {
                    this.selectedNode.children = [];
                    this.selectedNode.children.push(this.draggingNode);
                }
            }else{
                //console.log('selectedNode undefined');
            }

            this.update();

            PubSub.publish(ADD_FEATURE, this.parse_tree(this.data));
            //this.update_feature_expression(this.parse_tree(this.data));
            //ifeed.data_mining.draw_venn_diagram();

            this.dragStarted= false;
            this.draggingNode=null;

        }
    }


    check_tree_structure(){

        if(self.root==null){
            return;
        }

        var delete_logic_node_without_children = function(node){

            if(!node){
                return;
            }else if(!node.children && node.type=='logic'){

                if(node.depth==0){ // The root node is a logical connective but has no children
                    self.root=null;
                    d3.selectAll('.node').remove();
                }else{
                    var index = node.parent.children.indexOf(node);
                    // Remove the current node
                    if (index > -1) {
                        node.parent.children.splice(index, 1);
                    }
                }
            }
        }

        var remove_redundant_logical_connectives = function(node){

            if(!node){
                return;

            }else if(node.type=="logic" && node.parent){

                if(node.name==node.parent.name){

                    var children = node.children;
                    var parent = node.parent;
                    var index = parent.children.indexOf(node);

                    node.parent.children.splice(index,1);

                    for(var i=0;i<children.length;i++){
                        parent.children.splice(index,0,children[i]);
                    }
                }
            }
        }

        var remove_redundant_features = function(node){

            if(!node){
                return;
            }else if(node.type=="logic" && node.children){

                var list_of_features = [];
                var indices_to_delete = [];
                var children = node.children;

                for(var i=0;i<children.length;i++){

                    if(children[i].type=="logic"){
                       continue;
                    }

                    var this_feature = children[i];

                    if(list_of_features.indexOf(this_feature.name)==-1){
                        list_of_features.push(this_feature.name);
                    }else{
                        indices_to_delete.push(i);
                    }
                }

                indices_to_delete.reverse();

                for(var j=0;j<indices_to_delete.length;j++){
                    node.children.splice(indices_to_delete[j],1);
                }

            }

        }

        that.visitNodes(self.root, delete_logic_node_without_children);
        that.visitNodes(self.root, remove_redundant_logical_connectives);
        that.visitNodes(self.root, remove_redundant_features);

    }

    get_node_ids(source,IDList){

        if(!source){
            return [];
        }

        var id = source.id;
        if(IDList.indexOf(id)==-1){
           IDList.push(id);
        }
        var children = source.children;
        if(children){
            for(var i=0;i<children.length;i++){
                self.get_node_ids(children[i],IDList);
            }
        }
        return IDList;
    }



    remove_descendants(nodeID){

        var childrenNodeID = [];

        d3.selectAll('.link').filter(function(d){
            if(d.source.id == nodeID){
                childrenNodeID.push(d.target.id);
                return true;
            }else{
                return false;
            }
        }).remove();

        if(childrenNodeID.length==0){
            return;
        }

        d3.selectAll('.node')[0].forEach(function(d){

            var id = d.__data__.id;

            if(childrenNodeID.indexOf(id)!=-1){
                d3.select(d).remove();
                self.remove_descendants(id);
            }
        });
    }

    parse_tree(root, placeholderNode){

        function deactivated(node){
            // Check if all of the children nodes have been deactivated. If so, then the current node is also deactivated
            if(node.deactivated){
                return true;

            }else{
                if(node.children){

                    var children = node.children;
                    var activated = false;
                    for(var i=0;i<children.length;i++){
                        if(!children[i].deactivated){
                            activated=true;
                        }
                    }
                    if(!activated){
                        node.deactivated=true;
                        return true;
                    }

                }

            }
            return false;
        }



        var expression = null;

        if(!root){
            // If the current node is null, return null
            expression = null;

        }else if(root.type=="leaf"){
            // If the current node is a leaf node

            if(deactivated(root)){
                expression="";

            }else{

                if(placeholderNode){
                    // If placeholder exists
                    if(placeholderNode==root.parent && root.parent.children.indexOf(root)==0){
                        // If the current node is the first child of the placeholderNode

                        if(root.parent.name=="AND"){
                            expression="{PLACEHOLDER}&&"+root.name;
                        }else{
                            expression="{PLACEHOLDER}||"+root.name;
                        }

                    }else if(placeholderNode==root){ // If the current node is the placeholderNode itself

                        if(root.parent.name=="AND"){
                            // When a leaf node is set as a placeholderNode, change the logical connective
                            expression="({PLACEHOLDER}||"+root.name + ")";
                        }else{
                            expression="({PLACEHOLDER}&&"+root.name + ")";
                        }

                    }else{
                        // If the current node has nothing to do with the placeholder
                        expression=root.name;
                    }
                }else{
                    // If there is no placeholder, simply return its name
                    expression=root.name;
                }
            }

        }else if(root.type=="logic" && (deactivated(root) || !root.children)){
            // Current node is a logic node but its children are either all emtpy or deactivated
            expression="";

        }else{
            // Current node is a logical node and is not deactivated
            expression = "";

            for(var i=0;i<root.children.length;i++){

                var child = root.children[i];
                var logic = null;

                if(root.name=="AND"){
                    logic="&&";
                }else{
                    logic="||";
                }

                var new_expression = this.parse_tree(child,placeholderNode);

                if(expression!="" && new_expression!=""){
                    expression = expression + logic;
                }
                expression = expression + new_expression;
            }

            if(expression!=""){
                expression = "(" + expression + ")";
            }
        }

        return expression;
    }

    updateTempConnector(target){

        var data = [];
        if (this.draggingNode !== null && this.selectedNode !== null) {
            data = [{
                source: {
                    x: this.selectedNode.y0,
                    y: this.selectedNode.x0
                },
                target: {
                    x: target.x,
                    y: target.y
                }
            }];
        }

        var link = d3.select('#feature_application_panel')
                        .select('svg')
                        .select('g')
                        .selectAll(".tempTreeLink").data(data);

        link.enter().append("path")
            .attr("class", "tempTreeLink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none')
            .style('fill','none')
            .style('stroke','red')
            .style('stroke-width','3px');

        link.attr("d", d3.svg.diagonal());
        link.exit().remove();
    }



// TODO: Implement feature expression display
//    self.update_feature_expression = function(expression){
//
//        var logic_color = "#FF9500";
//        var bracket_color = "#FF0000";
//
//        if(expression==null){
//
//            expression=="";
//
//        }else if(expression != ""){
//
//            expression = ifeed.label.pp_feature(expression);
//            expression = expression.replace(/{/g,'');
//            expression = expression.replace(/}/g,'');
//
//            expression = expression.replace(/\(/g,'<span style="color:'+bracket_color+';font-weight:bold;font-size:28px">(</span>');
//            expression = expression.replace(/\)/g,'<span style="color:'+bracket_color+';font-weight:bold;font-size:28px">)</span>');
//            expression = expression.replace(/&&/g,' <span style="color:'+logic_color+';">AND</span> ');
//            expression = expression.replace(/\|\|/g,' <span style="color:'+logic_color+';">OR</span> ');
//        }
//
//        d3.select('#feature_expression').html("<p>"+expression+"</p>");
//    }


    clear_feature_application(){

        this.data = null;
        this.update();

        //this.update_feature_expression(null);
        //PubSub.publish(ADD_FEATURE, null);
        //ifeed.data_mining.draw_venn_diagram();
    }
}
