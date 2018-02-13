<template>
    <div class="panel-block functionality">
        <div id="feature_expression_panel" class="container is-fluid">
            <div class="buttons has-addons is-centered">
                <a id="conjunctive_local_search" class="button">Improve Specificity</a>
                <a id="disjunctive_local_search" class="button">Improve Coverage</a>
                <a id="clear_all_features" class="button">Clear</a>
            </div>
        </div>
        <div id="feature_application_panel" class="container is-fluid"></div>
    </div>
</template>

<script>
    function visit_nodes(source, func, reverse) {
        let re;
        if(typeof func !== 'undefined'){
            re = func(source);
            // If func is a function that returns something, stop traversing tree and return. Otherwise, apply func and keep traversing the tree
            if(re) return re;
        }
        if(reverse){
            if(source.parent){
                re = this.visit_nodes(source.parent,func,true);
                if(re) return re;
            }
        }else{
            if(source){
                if(source.children){
                    for(let i=0;i<source.children.length;i++){
                        re = this.visit_nodes(source.children[i],func);
                        if(re) return re;
                    }
                }
            }
        }
        return null;
    }
    
    function update_feature_application(option, expression) {

        function get_node_to_add_features(d){
            // Find the node to which to add new features
            if (d.add) {
                return d;
            }
            else {
                return null;
            }
        }

        let direct_update = false;

        if (option === 'direct-update') { // Make the direct update to the feature application status
            option = 'temp';
            direct_update = true;
        }

        let that = this;

        if (option === 'temp') {
            // Mouseover on the feature plot

            let parentNode = null;

            if (this.data) {
                // There already exists a tree: Find the node to add new features and append children temporarily
                parentNode = this.visit_nodes(this.data, get_node_to_add_features);

                if (parentNode) {
                    // parentNode exists

                    // Stash the currently existing node ID's
                    this.stashed_node_ids = this.get_node_ids(this.data, []);

                    // Construct a subtree and append it as a child to the parent node
                    let subtree = this.construct_tree(expression, parentNode.depth+1);

                    if (!direct_update) {
                        this.visit_nodes(subtree, function(d) {
                            d.temp=true;
                            d.id = that.i++;
                        });
                    }

                    // Add to the parent node
                    parentNode.children.push(subtree);

                    this.update();
                }
                else {
                    // No parentNode

                    // Stash the current root
                    this.stashed_root = this.construct_tree(this.parse_tree(this.data));

                    // Re-draw the whole tree
                    this.draw_feature_application_tree(expression);
                }
            }
            else {
                // There is no tree. Build a new one
                this.stashed_node_ids = [];
                this.stashed_root = {};
                this.draw_feature_application_tree(expression);
            }

            if (direct_update) { // Make a direct update to the feature application status; not temporary
                // Remove the stashed information
                this.stashed_node_ids = null;
                this.stashed_root = null;
            }
        }
        else if (option === 'restore') {
            // Restore the stashed tree

            if (this.stashed_root != null && this.stashed_node_ids != null) {

                if (jQuery.isEmptyObject(this.stashed_root) && this.stashed_node_ids.length === 0) {
                    // There was no tree before
                    this.data = null;
                }
            }
            else if (this.stashed_root != null) {
                // The whole tree is stashed
                this.data = this.stashed_root;
            }
            else if (this.stashed_node_ids != null) {
                // Tree has been modified by the temporary update
                // Visit each node, and if node.indexOf(id)==-1, remove the index
                let parentNode = null;
                indices = [];

                this.visit_nodes(this.data, function(d) {
                    if (this.stashed_node_ids.indexOf(d.id) === -1) {
                        parentNode = d.parent;
                        let index = d.parent.children.indexOf(d);
                        indices.push(index);
                    }
                });

                indices.reverse();
                for (let i = 0; i < indices.length; i++) {
                    parentNode.children.splice(indices[i], 1);
                }
            }
            else {
                // Both are null: No stashed information
                // Do nothing
            }

            if (this.data) {
                this.visit_nodes(this.data, function(d) {
                    d.temp = false;
                });
            }

            this.update();

            this.stashed_root = null;
            this.stashed_node_ids = null;
        }
        else if (option === 'update') {
            this.stashed_node_ids = null;
            this.stashed_root = null;
            this.visit_nodes(this.data, function(d) {
                d.temp = false;
            });
        }
    }
    
    export default {
        name: 'feature-application'
    }
</script>

<style scoped>

</style>