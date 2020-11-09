<template>
    <div class="rules-panel">

        <!-- HEADER -->
        <div class="rule-page-title">
            <p>{{ problem_name }} Rules</p>
        </div>

        <!-- FILTER-->
        <div class="rule-filter-container">
            <div style="padding: 5px;">
                <input type="checkbox" id="checkbox6" v-model="query_filter">
                <label for="checkbox6">Apply Filters</label>
            </div>
            <div class="rule-filters">
                <input v-model="inst_filter_input" placeholder="instrument..." class="filter-input">
                <input v-model="meas_filter_input" placeholder="measurement..." class="filter-input">
                <input v-model="meas_attr_filter_input" placeholder="measurement attribute..." class="filter-input">
                <input v-model="panel_filter_input" placeholder="panel..." class="filter-input">
                <input v-model="obj_filter_input" placeholder="objective..." class="filter-input">
                <input v-model="subobj_filter_input" placeholder="subobjective..." class="filter-input">
            </div>
            <div class="rule-count">Results: {{ rule_rows.length }}</div>
        </div>

        <!-- TABS -->
        <div class="tabs rule-tabs">
            <ul>
                <li :class="{ 'is-active': selected_tab === 'attribute'}" v-on:click="show_attribute"><a>By Attribute</a></li>
                <li :class="{ 'is-active': selected_tab === 'case'}" v-on:click="show_case"><a>By Case</a></li>
            </ul>
        </div>

        <!-- RULE CONTENT-->
        <div class="rule-content">

            <!-- RULES-->
            <div class="rule-listings">
                <template v-if="selected_tab === 'attribute'">
                    <attribute-rule v-for="(rule, idx) in rule_rows" :key="idx" :rule="rule"></attribute-rule>
                </template>
                <template v-if="selected_tab === 'case'">

                </template>
            </div>

        </div>


    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import { RequirementRuleAttribute } from "../../../scripts/requirement-rule-queries";
    // import { RequirementRuleAttributeInstrument } from "../../../scripts/requirement-rule-queries";
    import { RequirementRuleAttributeFilters } from "../../../scripts/requirement-rule-queries";

    import AttributeRule from "./AttributeRule";
    import CaseRule from "./CaseRule";

    export default {
        name: "requirement-ruls",
        data: function () {
            return {
                attr_rules: [],
                attr_rules_filter: [],

                inst_filter_input: "",
                meas_filter_input: "",
                meas_attr_filter_input: "",
                subobj_filter_input: "",
                obj_filter_input: "",
                panel_filter_input: "",



                query_filter: false,

                selected_tab: "attribute",
            }
        },
        computed: {
            ...mapGetters({
                problem_id: 'problems__problem_selection',
                problem_name: 'problems__problem_selection_name',
            }),
            inst_filter_input_regex(){
                return "%" + this.inst_filter_input + "%";
            },
            meas_filter_input_regex() {
                return "%" + this.meas_filter_input + "%";
            },
            meas_attr_filter_input_regex() {
                return "%" + this.meas_attr_filter_input + "%";
            },
            subobj_filter_input_regex() {
                return "%" + this.subobj_filter_input + "%";
            },
            obj_filter_input_regex() {
                return "%" + this.obj_filter_input + "%";
            },
            panel_filter_input_regex() {
                return "%" + this.panel_filter_input + "%";
            },
            rule_rows(){
                if(this.query_filter){
                    return this.attr_rules_filter;
                }
                else{
                    return this.attr_rules;
                }
            }
        },
        methods: {
            show_attribute(){
                this.selected_tab = "attribute";
            },
            show_case(){
                this.selected_tab = "case";
            }
        },
        apollo: {
            attr_rules: {
                query: RequirementRuleAttribute,
                variables() {
                    return {
                        problem_id: this.problem_id,
                    }
                }
            },
            attr_rules_filter: {
                query: RequirementRuleAttributeFilters,
                variables() {
                    return {
                        problem_id: this.problem_id,
                        instrument: this.inst_filter_input_regex,
                        measurement: this.meas_filter_input_regex,
                        measurement_attr: this.meas_attr_filter_input_regex,
                        subobjective: this.subobj_filter_input_regex,
                        objective: this.obj_filter_input_regex,
                        panel: this.panel_filter_input_regex,
                    }
                }
            },
        },
        watch: {
            rule_rows(){
                console.log("RULE ROWS", this.rule_rows);
            }
        },
        components: {
            AttributeRule,
            CaseRule
        }


    }
</script>

<style lang="scss">

.rule-count{
    padding-left: 2px;
    padding-top: 10px;
}


.rule-content{
    display: flex;
    flex-direction: column;
    padding-left: 2vw;
    padding-right: 2vw;
    padding-top: 1vh;
    margin-bottom: 1vh;
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
}

.rule-tabs{
    display: flex;
    min-height: 41px;
    padding-left: 2vw;
    padding-right: 2vw;
    margin-top: 1vh;
    width: 100%;
}

.rule-listings{
    display: flex;
    flex-direction: column;
}

.rule-filters{
    display: flex;
    flex-direction: row;
}

.filter-input{
    margin: 2px;
}


.rules-panel{
    display: flex;
    flex-grow: 0.75;
    margin: 1em 3em;
    flex-direction: column;
    align-items: flex-start;
    height: 80vh;
    background-color: #fff;
    border-radius: 6px;
}


.rule-page-title{
    display: flex;
    padding-top: 3vh;
    padding-left: 2vw;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 1.4em;
    font-weight: bold;
}

.rule-filter-container{
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    padding-left: 2vw;
    padding-top: 1vh;
}


</style>