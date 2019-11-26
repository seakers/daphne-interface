<template>
    <div v-bind:class="{'clickable': is_clickable}" style="padding: 5px; margin: 5px; border: 2px solid grey; border-radius: 4px;">
        <div style="font-size: 16px;">
            <template v-if="logic === null">
                <div style="text-align: left">
                    Logic: AND
                </div>
            </template>
            <template v-if="logic === 'AND'">
                <div style="text-align: left">
                    Logic: AND
                </div>
            </template>
            <template v-if="logic === 'OR'">
                <div style="text-align: left">
                    Logic: OR
                </div>
            </template>
        </div>

        <div style="text-align: left; line-height: 18px; letter-spacing: 0.4px;">
            <ul>
                <li v-for="phrase in phrases" v-html="phrase" style="padding-top: 3px;"></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { featureExpressionToSentence } from '../scripts/utils';
    import * as d3 from 'd3';
    import smap from '../scripts/smap';
    export default {
        name: "FeatureModel",
        props: ['featureDetails', 'isClickable'],
        components: {},
        data() {
            return {
                expression: '',
                logic: null,
                phrases: [],
                show_shadow: false,
                is_clickable: false,
            }
        },
        computed: {
            ...mapGetters({
                orbit_list: 'get_orbit_list',
                instrument_list: 'get_instrument_list',
            }),
        },
        methods: {

        },

        watch: {
            featureDetails() {
                this.expression = this.featureDetails;
                //this.expression = "";

                this.is_clickable = this.isClickable;
                this.phrases = featureExpressionToSentence(this.expression);
                if(this.phrases.length > 1){this.logic = this.phrases.pop();}
            }
        },

        created() {
            this.expression = this.featureDetails;
            //this.expression = "({notInOrbit[0;0,1,4;]}&&{inOrbit[3;0;]}&&{notInOrbit[1;0,1,4;]})";

            this.is_clickable = this.isClickable;
            this.phrases = featureExpressionToSentence(this.expression);
            if(this.phrases.length > 1){this.logic = this.phrases.pop();}
        },

        mounted(){

        },

    }
</script>

<style scoped>
    .clickable{
        cursor: pointer;
    }

</style>