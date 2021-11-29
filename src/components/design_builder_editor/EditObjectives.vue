<template>
    <div>

        <table class="table">
            <thead>
                <tr>
                    <td>Active</td>
                    <td>Objective</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(objective, idx) in objective_objs" :key="idx">
                    <td><input type="checkbox" v-model="objective.active"></td>
                    <td>{{objective.name}}</td>
                </tr>
            </tbody>
        </table>


    </div>
</template>

<script>

    import {mapState} from "vuex";

    export default {
        name: "edit-stakeholders",
        data() {
            return {
                objective_objs: [
                    {key: 'cost', name: 'Cost', active: true, initial:true, obj_id: 0},
                    {key: 'programmatic_risk', name: 'Programmatic Risk', active: true, initial:true, obj_id: 1},
                    {key: 'Atmosphere', name: 'Atmospheric Panel Satisfaction', active: true, initial:true, obj_id: 2},
                    {key: 'Oceanic', name: 'Oceanic Panel Satisfaction', active: true, initial:true, obj_id: 3},
                    {key: 'Terrestrial', name: 'Terrestrial Panel Satisfaction', active: true, initial:true, obj_id: 4}
                ],

                changes: false,
            }
        },
        computed: {
            ...mapState({
                objective_objs_store: state => state.problem.objective_objs,
            }),
        },
        methods: {
            update_objective_values(){
                for(let x=0;x<this.objective_objs.length;x++){
                    let obj = this.objective_objs[x];
                    obj.active = obj.initial;
                }
            },
            reload_module(){
                this.update_objective_values();
            },
            commit_changes(){
                for(let x=0;x<this.objective_objs.length;x++){
                    let obj = this.objective_objs[x];
                    if(obj.active !== obj.initial){
                        this.$store.commit('setObjectiveOption', obj);
                        obj.initial = obj.active;
                        this.changes = true;
                    }
                    else{
                        this.$store.commit('setObjectiveOption', obj);
                    }
                }
            },
        },
        watch: {

        },
        apollo: {

        },
    }
</script>

<style scoped>

</style>