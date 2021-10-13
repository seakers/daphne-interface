<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <td>Stakeholder</td>
                    <td>Weight</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(stakeholder, idx) in stakeholder_panels" :key="idx">
                    <td class="">{{stakeholder.name}} </td>
                    <td class=""><input v-model="stakeholder.weight"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {StakeholderQuery, StakeholderMutation} from "../../scripts/apollo-queries";

    export default {
        name: "edit-stakeholders",
        data() {
            return {
                stakeholder_panels: [],


                // --> QUERY OBJECTS
                Stakeholder_Needs_Panel: [],

                changes: false
            }
        },
        computed: {
            ...mapState({
                groupId: state => state.problem.groupId,
                problemId: state => state.problem.problemId,
                datasetId: state => state.problem.datasetId,
            }),
        },
        components: {
        },
        methods: {
            update_stakeholder_list(){
                let computed_list = [];
                for(let x=0;x<this.Stakeholder_Needs_Panel.length;x++){
                    let obj = {};
                    let stk = this.Stakeholder_Needs_Panel[x];
                    obj.name = stk.name;
                    obj.description = stk.description;
                    obj.weight = stk.weight;
                    obj.initial_weight = stk.weight;
                    obj.id = stk.id;
                    computed_list.push(obj);
                }
                this.stakeholder_panels = computed_list;
            },
            reload_module(){
                this.$apollo.queries.Stakeholder_Needs_Panel.refetch();
                this.update_stakeholder_list();
            },
            async update_stakeholder(stakeholder){
                console.log("--> UPDATING STAKEHOLDER ", stakeholder.name);
                let mutation_result = await this.$apollo.mutate({
                    mutation: StakeholderMutation,
                    variables: {
                        panel_id: stakeholder.id,
                        panel_weight: stakeholder.weight
                    },
                    update: (cache, { data: { result } }) => {console.log(result);},
                });
            },
            async commit_changes(){
                console.log("--> COMITTING STAKEHOLDER CHANGES");
                // 1. Ensure that weights sum to 1
                let sum = 0;
                for(let x=0;x<this.stakeholder_panels.length;x++){
                    let stakeholder = this.stakeholder_panels[x];
                    sum = sum + parseFloat(stakeholder.weight);
                    if(stakeholder.weight !== stakeholder.initial_weight){
                        await this.update_stakeholder(stakeholder);
                        this.changes = true;
                    }
                }
            },
        },
        watch: {
            Stakeholder_Needs_Panel(){
                  this.update_stakeholder_list();
            },
        },
        apollo: {
            Stakeholder_Needs_Panel: {
                query: StakeholderQuery,
                variables() {
                    return {
                        problem_id: this.problemId,
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>