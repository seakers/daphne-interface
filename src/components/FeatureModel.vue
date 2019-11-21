<template>
    <div>
        <div style="font-size: 16px;">
            <template v-if="logic === null">
                <div style="text-align: left">
                    AND
                </div>
            </template>
            <template v-if="logic === 'AND'">
                <div style="text-align: left">
                    AND
                </div>
            </template>
            <template v-if="logic === 'OR'">
                <div style="text-align: left">
                    OR
                </div>
            </template>
        </div>

        <div style="text-align: left; line-height: 18px; letter-spacing: 0.4px;">
            <ol>
                <li v-for="phrase in phrases" v-html="phrase" style="padding-top: 3px;"></li>
            </ol>
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
        props: ['featureDetails'],
        components: {},
        data() {
            return {
                expression: '',
                logic: null,
                phrases: [],
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
        created() {
            this.expression = this.featureDetails;
            this.phrases = featureExpressionToSentence(this.expression);
            if(this.phrases.length > 1){
                this.logic = this.phrases.pop();
            }

            console.log("----- Feature Model -----");
            console.log(this.expression);
            console.log(this.phrases);
            console.log(this.logic);
        },

        mounted(){

        },

    }
</script>

<style scoped>

</style>