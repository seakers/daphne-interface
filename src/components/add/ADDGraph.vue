<template>
    <v-container>





    </v-container>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "add-graph",
        components: {

        },
        data: function () {
            return {




            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
            }),

            // --> FORMULATION
            formulation_name(){
                let name = this.$route.params.name;
                return 'Decadal'
            },

            // --> NEO4J QUERIES
            root_query(){
                return `MATCH (n:${this.formulation_name}:Root) RETURN n.name, n.type, n.initial_params`;
            },
            problem_query(){
                return `MATCH (n:${this.formulation_name}) RETURN n.name, n.type`;
            },
            decision_query(){
                return `MATCH (n:${this.formulation_name}:Decision) RETURN n.name, n.type, n.decisions, n.dependencies`;
            },
            design_query(){
                return `MATCH (n:${this.formulation_name}:Design) RETURN n.name, n.type, n.designs`;
            },

            // --> NEO4J OBJECTS
            driver(){
                return this.$neo4j.getDriver();
            }
        },
        methods: {

        },
        apollo: {

        },
        async mounted(){
            await this.$store.dispatch('build_graph', this.$neo4j);
        }
    }
</script>

<style scoped>

</style>