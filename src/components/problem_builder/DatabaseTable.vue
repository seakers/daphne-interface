<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.id">
                    <td>{{ row.name }}</td>
                    <td>{{ row.description }}</td>
                    <td>{{ row.weight }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    
    export default {
        name: 'database-table',
        props: {
            table_name: String,
            table_columns: String,
        },
        data: function () {
            return {
                headers: [],
                rows: [],
            }
        },
        computed: {
            ...mapState({
                groups: state => state.groups.groups,
                problems: state => state.groups.problems
            }),
        },
        methods: {
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
        },
        async mounted() {
            console.log(this.table_name);
            console.log(this.table_columns);
        },
        watch: {
        }
    }
</script>
