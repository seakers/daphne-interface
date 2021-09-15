<template>
    <div>
        <div class="content">
            <h3>Details</h3>
            <p>Subobjective: {{ subobjectiveDetails["subobjective"] }} | Measurement: {{ subobjectiveDetails.measurement }}</p>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead>
                <tr>
                    <th v-for="attributeName in Object.keys(subobjectiveDetails.rows[0].attribute_values)">{{ attributeName }}</th>
                    <th>Score</th>
                    <th>Taken By</th>
                    <th>Justification</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="index in subobjectiveDetails.rows.length">
                    <td v-for="attrValue in subobjectiveDetails.rows[index-1].attribute_values">{{ attrValue }}</td>
                    <td>{{ subobjectiveDetails.rows[index-1].score }}</td>
                    <td>{{ subobjectiveDetails.rows[index-1].taken_by }}</td>
                    <td class="content justification-cell">
                        <ul>
                            <li v-for="justification in subobjectiveDetails.rows[index-1].justifications">{{ justification }}</li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'details-table',
        computed: {
            ...mapState({
                subobjectiveDetails: state => state.score.subobjectiveDetails
            }),
        },
    }
</script>

<style scoped>
    .table-wrapper {
        max-width: 100%;
        overflow-x: scroll;
    }
    .justification-cell {
        min-width: 500px;
    }
</style>