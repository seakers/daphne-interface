<template>
    <div class="panel-block functionality">
        <template v-if="features.length !== 0">
            <div id="feature-plot"></div>
        </template>
        <template v-else>
            <p>To run data mining, select target solutions on the scatter plot. Then click the button below.</p>
            <div class="field">
                <div class="control">
                    <a class="button is-info" id="run_data_mining" v-on:click="run">
                        Run data mining
                    </a>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    function display_features() {
        // Set variables
        this.df_i = 0;

        // Initialize location
        for(let i = 0; i < this.all_features.length; i++){
            this.all_features[i].x0 = -1;
            this.all_features[i].y0 = -1;
            this.all_features[i].id = this.df_i++;
        }

        this.update_feature_plot();
    }

    export default {
        name: 'data-mining',
        data() {
            return {

            }
        },
        computed: {
            ...mapGetters({
                plotData: 'getPlotData',
                selectedArchs: 'getSelectedArchs',
                features: 'getFeatures'
            }),
            numSelectedPoints() {
                return this.selectedArchs.filter(point => point).length;
            }
        },
        methods: {
            run() {
                // Remove all highlights in the scatter plot (retain target solutions)
                this.$store.commit('clearHighlightedArchs');

                if (this.numSelectedPoints === 0) {
                    alert('First select target solutions!');
                }
                else {
                    this.$store.dispatch('getDrivingFeatures');
                    this.display_features();
                }
            }
        },
        watch: {
            selectedArchs: function(val, oldVal) {
                this.$store.commit('setFeatures', []);
            }
        }
    }
</script>

<style scoped>
    #feature-plot {
        width: 100%;
        height: 100%;
    }
</style>