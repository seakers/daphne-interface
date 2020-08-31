<template>
    <div class="attribute-rule-container">

        <div class="rule-left-info">
            <div class="rule-left-info-item"><b>Rule Type:</b> {{ rule.type }}</div>
            <div class="rule-left-info-item"><b>Subobjective:</b> {{ rule.subobj.name }} | weight: {{ rule.subobj.weight }}</div>
<!--            <div class="rule-left-info-item"><b>Subobjective Weight:</b> {{ rule.subobj.weight }}</div>-->
            <div class="rule-left-info-item"><b>Measurement:</b> {{ rule.meas.name }}</div>
            <div class="rule-left-info-item"><b>Measurement Attribute:</b> {{ rule.meas_attr.name }}</div>
        </div>

        <div class="rule-right-info">
            <div class="tabs">
                <ul>
                    <li :class="{ 'is-active': selected_tab === 'thresholds'}" v-on:click="show_thresholds"><a>Thresholds</a></li>
                    <li :class="{ 'is-active': selected_tab === 'scores'}" v-on:click="show_scores"><a>Scores</a></li>
                    <li :class="{ 'is-active': selected_tab === 'justification'}" v-on:click="show_justification"><a>Justification</a></li>
                </ul>
            </div>

            <div class="rule-right-info-data">
                <template v-if="selected_tab === 'thresholds'">
                    {{ rule.thresholds }}
                </template>
                <template v-if="selected_tab === 'scores'">
                    {{ rule.scores }}
                </template>
                <template v-if="selected_tab === 'justification'">
                    {{ rule.justification }}
                </template>
            </div>

            <div class="rule-right-info-btn">
                <button class="button is-info rule-btn" v-on:click="edit_rule()">
                    Clone
                </button>
                <button class="button is-warning rule-btn" v-on:click="edit_rule()">
                    Edit
                </button>
                <button class="button is-danger rule-btn" v-on:click="edit_rule()">
                    Remove
                </button>
            </div>
        </div>


    </div>
</template>

<script>


    export default {
        name: "attribute-rule",
        props: {
            rule: Object,
        },
        data: function () {
            return {
                selected_tab: 'thresholds',
            }
        },
        computed: {
            rule_thresholds() {

            },
            rule_scores() {

            },
        },
        methods: {
            show_thresholds(){
                this.selected_tab = 'thresholds';
            },
            show_scores(){
                this.selected_tab = 'scores';
            },
            show_justification(){
                this.selected_tab = 'justification';
            },
            edit_rule(){

            },
        },


    }
</script>


<style lang="scss">


.rule-btn{
    align-self: flex-end;
    margin-left: 5px;
}

.rule-right-info-btn{
    display: flex;
    flex-direction: row;
    align-self: flex-end;
    flex-grow: 1;
}


.rule-right-info-data{
    display: flex;
    flex-direction: row;
    padding-left: 1vw;
}


.rule-left-info-item{
    flex-grow: 1;
    padding-left: 5px;
}

.rule-left-info{
    display: flex;
    flex-direction: column;
    width: 50%;
}

.rule-right-info{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}


.attribute-rule-container{
    display: flex;
    flex-direction: row;
    height: 150px;
    background-color: #f4efef;
    border-bottom-color: #fff;
    border-bottom-width: 5px;
    border-bottom-style: solid;
}


.rule-type{
    display: flex;
    height: 100%;
    padding-right: 10px;
    align-items: center;
    padding-left: 10px;
}

.rule-meas{
    display: flex;
    height: 100%;
    padding-right: 10px;
    align-items: center;
    padding-left: 10px;
}




</style>