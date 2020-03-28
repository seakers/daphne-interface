<template>
    <div class="columns">
        <div class="column is-4 hero">
            <table class="table">
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="column is-4 hero">
                <table-view table_name="Stakeholder_Needs_Objective"></table-view>
        </div>
        <div class="column is-4 hero">
                1
        </div>
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './TableView';
    
    export default {
        name: 'stakeholders',
        data: function () {
            return {
                tables: ['Stakeholder_Needs_Panel', 'Stakeholder_Needs_Objective', 'Stakeholder_Needs_Subobjective']
            }
        },
        computed: {
            ...mapState({
                 headers: state => state.stakeholders.headers,

            }),
        },
        methods: {
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
            TableView
        },
        async mounted() {
            // console.log("Mounting stakeholders page")
        },
        watch: {
        }
    }
</script>