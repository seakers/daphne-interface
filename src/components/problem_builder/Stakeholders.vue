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
                <database-table table_name="Stakeholder_Needs_Objective"></database-table>
        </div>
        <div class="column is-4 hero">
                1
        </div>
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import DatabaseTable from './DatabaseTable';
    
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
            DatabaseTable
        },
        async mounted() {
            // console.log("Mounting stakeholders page")
        },
        watch: {
        }
    }
</script>