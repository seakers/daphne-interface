<template>
    <div class="problems-container">


        <div class="problems-panel">
            <div class="groups-title">
                Problems
            </div>

            <div class="groups-table-container">
                <table class="table is-hoverable is-fullwidth is-striped" style="table-background-color: black;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Problem</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="problem in group_problems" :key="problem.id">
                            <td style="vertical-align: middle;">{{ problem.id }}</td>
                            <td style="vertical-align: middle;">{{ problem.name }}</td>
                            <td style="text-align: right;"><a class="button is-link is-small" v-on:click="set_problem(problem.name, problem.id)">select</a></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input class="input" type="text" placeholder="Problem Name"></td>
                            <td style="text-align: right;"><a class="button is-primary" v-on:click="new_problem()">New Problem</a></td>
                        </tr>
                    </tbody>
                </table> 
            </div>
        </div>


    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import DatabaseTable from './DatabaseTable';
    
    export default {
        name: 'problems',
        data: function () {
            return {
            }
        },
        computed: {
            ...mapState({
                username: state => state.groups.username,
                problems: state => state.groups.problems,
                group_id: state => state.groups.group_id,
            }),
            group_problems() {
                return this.problems[this.group_id];
            }
        },
        methods: {
            async set_problem(name, id) {
                console.log(id);
                this.$store.commit('set_problem', name, id);
            },

            async new_problem() {
                console.log("new problem");
                // this.$store.commit('new_problem', name, id);
            }
        },
        components: {
            DatabaseTable
        },
        async mounted() {

        },
        watch: {
        }
    }
</script>




<style lang="scss">
.problems-container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-direction: column !important;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}

.problems-panel{
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 14px 4px #14191f !important;
    align-self: center;
}


.problems-table-container{
    padding: 0em .8em .8em .8em;
    background-color: #354052;
}




</style>