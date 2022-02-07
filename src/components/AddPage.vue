<template>
    <v-app dark>


        <!-- LOGIN OVERLAY-->
        <v-overlay v-model="login_overlay" opacity="0.8" z-index="1000">
            <login-modal></login-modal>
        </v-overlay>


        <!-- NAVIGATION -->
        <v-navigation-drawer v-model="drawer" app color="primary lighten-1">

            <!-- MENU HEADER -->
            <v-list-item class="white--text">
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{ username }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text">
                        {{ email }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider class="primary darken-1"></v-divider>

            <!-- MENU ITEMS -->
            <v-list dense nav>

                <!-- PROBLEM LINKS -->
                <v-list-group :value="false">
                    <v-icon slot="prependIcon" color="white">mdi-pencil-ruler</v-icon>
                    <v-icon slot="appendIcon" color="white">mdi-chevron-down</v-icon>
                    <template v-slot:activator>
                        <v-list-item-title class="white--text">Problems</v-list-item-title>
                    </template>

                    <!-- ITEMS-->
                    <v-list-item v-for="item in problem_links" :key="item.name" :to="item.link" link active-class="bg-active">
                        <v-list-item-title v-text="item.name" class="white--text"></v-list-item-title>
<!--                        <v-list-item-icon>-->
<!--                            <v-icon v-text="item.icon" color="white"></v-icon>-->
<!--                        </v-list-item-icon>-->
                    </v-list-item>
                </v-list-group>

                <!-- FORMULATION LINKS -->
                <v-list-group :value="false">
                    <v-icon slot="prependIcon" color="white">mdi-graph</v-icon>
                    <v-icon slot="appendIcon" color="white">mdi-chevron-down</v-icon>
                    <template v-slot:activator>
                        <v-list-item-title class="white--text">Formulations</v-list-item-title>
                    </template>

                    <!-- ITEMS-->
                    <v-list-item v-for="item in formulation_links" :key="item.name" :to="item.link" link active-class="bg-active">
                        <v-list-item-title v-text="item.name" class="white--text"></v-list-item-title>
<!--                        <v-list-item-icon>-->
<!--                            <v-icon v-text="item.icon" color="white"></v-icon>-->
<!--                        </v-list-item-icon>-->
                    </v-list-item>
                </v-list-group>

            </v-list>

        </v-navigation-drawer>


        <!-- APP BAR -->
        <v-app-bar app class="primary white--text">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
            <v-toolbar-title>ADD Builder</v-toolbar-title>
        </v-app-bar>


        <!-- VUE ROUTER CONTENT -->
        <v-main class="secondary lighten-3">
            <router-view></router-view>
        </v-main>



    </v-app>
</template>



<script>
    import { mapState } from 'vuex';
    import Graph  from "./add/Graph";
    import LoginModal from "./add/LoginModal";


    export default {
        name: 'add-page',
        components: {
            Graph,
            LoginModal
        },
        data: function () {
            return {
                // --> Main Links <--
                main_links: [
                    { name: 'Mastery', icon: 'mdi-school', link: '/mastery'},
                ],

                // --> Problem Links <--
                problem_links: [
                    { name: 'Decadal Survey', icon: 'mdi-pencil-ruler', link: '/problem'},
                ],

                // --> Formulation Links <--
                formulation_links: [
                    { name: 'EOSS', icon: 'mdi-graph', link: '/formulation/EOSS'},
                ],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
            }),
            drawer: {
                get() {
                    return this.$store.state.user.drawer;
                },
                set(value) {
                    this.$store.commit('set_drawer_value', value);
                }
            },
            login_overlay: {
                get() {
                    return this.$store.state.user.login_overlay;
                },
                set(value) {
                    this.$store.commit('set_login_overlay', value);
                }
            }
        },
        methods: {

        },
        watch: {

        },
        apollo: {

        },
        beforeMount(){
            this.$store.commit('set_neo', this.$neo4j);
            this.$store.dispatch('connect_graph');
        },
        async mounted() {
            await this.$store.dispatch('initialize', this.$neo4j);
        },
    }
</script>

<style scoped>




</style>