<template>
    <div>
        <div class="content">
            <h3>Details</h3>
            <p>Parameter: {{ subobjectiveDetails.param }}</p>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead>
                <tr>
                    <th v-for="attrName in subobjectiveDetails.attr_names">{{ attrName }}</th>
                    <th>Score</th>
                    <th>Taken By</th>
                    <th>Justification</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="index in subobjectiveDetails.attr_values.length">
                    <td v-for="attrValue in subobjectiveDetails.attr_values[index-1]">{{ attrValue }}</td>
                    <td>{{ subobjectiveDetails.scores[index-1] }}</td>
                    <td>{{ subobjectiveDetails.taken_by[index-1] }}</td>
                    <td class="content justification-cell">
                        <ul>
                            <li v-for="justification in subobjectiveDetails.justifications[index-1]">{{ justification }}</li>
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