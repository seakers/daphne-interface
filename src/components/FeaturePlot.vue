<template>
    <div id="features-teacher-message">
        <div style="">
            <ul>
                <li>
                    Features common to a group of designs can explain the scores of those designs.
                    Try implementing this pareto front feature into some designs.
                </li>
            </ul>
        </div>
        <div @mouseover="mouseOverFeature" @mouseleave="mouseLeaveFeature">
            <feature-model v-bind:featureDetails="feature['expression']"></feature-model>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import FeatureModel from "./FeatureModel";
    import VuePlotly from '@statnett/vue-plotly'
    import { removeOuterParentheses, getNestedParenthesisDepth, collapseParenIntoSymbol } from '../scripts/utils';
    import * as d3 from 'd3';
    import smap from '../scripts/smap';
    export default {
        name: "FeaturePlot",

        components: {
            VuePlotly,
            "feature-model": FeatureModel,
        },

        data() {
            return {
                show_one: false,
                show_two: false,
                show_three: false,
                show_four: false,
                show_five: false,

                feature: {},
            }
        },

        computed: {
            ...mapGetters({
                teacher_feature: 'get_features',
            }),
        },

        methods: {
            mouseOverFeature() {
                this.$store.commit('setCurrentExpression', '');
                this.$store.commit('setCurrentExpression', this.feature['expression']);
            },
            mouseLeaveFeature(){
                this.$store.commit('setCurrentExpression', '');
            },

        },

        created() {
            this.feature = this.teacher_feature;
        },

        watch: {

        },
    }
</script>

<style scoped>

</style>