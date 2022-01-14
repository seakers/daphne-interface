<template>
    <v-app dark>



        <v-navigation-drawer v-model="drawer" app color="primary lighten-1">

<!--        MENU HEADER-->
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

<!--        MENU ITEMS-->
            <v-list dense nav>


<!--            MAIN ITEMS-->
                <v-list-item v-for="item in main_items" :key="item.title" :to="item.link" link active-class="bg-active">
                    <v-list-item-icon>
                        <v-icon color="white">{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content class="white--text">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>


<!--            LEARNING MODULE LIST-->
                <v-list-group :value="false">
                    <v-icon slot="prependIcon" color="white">mdi-book</v-icon>
                    <v-icon slot="appendIcon" color="white">mdi-chevron-down</v-icon>
                    <template v-slot:activator>
                        <v-list-item-title class="white--text">Learning Modules</v-list-item-title>
                    </template>

<!--                LEARNING MODULE ITEMS-->
                    <v-list-item v-for="item in learning_modules" :key="item.title" :to="item.link" link active-class="bg-active">

                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" class="white--text"></v-list-item-title>
                            <div v-if="item.progress === 0">
                                <v-progress-linear v-model="item.progress * 100" color="white" rounded style="margin-top: 2px"></v-progress-linear>
                            </div>
                            <div v-if="item.progress > 0 && item.progress < 1">
                                <v-progress-linear v-model="item.progress * 100" color="warning" rounded style="margin-top: 2px"></v-progress-linear>
                            </div>
                            <div v-if="item.progress === 1">
                                <v-progress-linear v-model="item.progress * 100" color="success" rounded style="margin-top: 2px"></v-progress-linear>
                            </div>
                        </v-list-item-content>



                        <v-list-item-icon>
                            <v-icon v-text="item.icon" color="white"></v-icon>
                        </v-list-item-icon>

                    </v-list-item>
                </v-list-group>



<!--            TESTING ITEM LIST-->
                <v-list-group :value="false">
                    <v-icon slot="prependIcon" color="white">mdi-lead-pencil</v-icon>
                    <v-icon slot="appendIcon" color="white">mdi-chevron-down</v-icon>
                    <template v-slot:activator>
                        <v-list-item-title class="white--text">Testing</v-list-item-title>
                    </template>

                    <!--                TESTING ITEMS-->
                    <v-list-item v-for="item in tests" :key="item.title" :to="item.link" link active-class="bg-active">
                        <v-list-item-title v-text="item.title" class="white--text"></v-list-item-title>

                        <v-list-item-icon>
                            <v-icon v-text="item.icon" color="white"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>










            </v-list>



        </v-navigation-drawer>


        <v-app-bar app class="primary white--text">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

            <v-toolbar-title>Daphne Academy</v-toolbar-title>
        </v-app-bar>


        <v-main class="secondary lighten-3">
                <router-view></router-view>
        </v-main>

    </v-app>
</template>

<script>
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import {mapState} from "vuex";

    export default {
        name: "adaptive-testing-page",
        components: {

        },
        data: function () {
            return {
                drawer: null,
                main_items: [
                    { title: 'Mastery', icon: 'mdi-school', link: '/mastery'},
                ],
                progress: 10,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.adaptiveTestingPages.user_id,
                username: state => state.adaptiveTestingPages.username,
                email: state => state.adaptiveTestingPages.email,
                learning_modules: state => state.adaptiveTestingPages.learning_modules,
                tests: state => state.adaptiveTestingPages.tests
            }),
        },
        methods: {

        },
        watch: {

        },
        async mounted() {

            // // --> 1. Get login status
            // let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
            // let auth_information = await dataResponse.json();
            //
            // // --> 2. If logged in, set user ID in store
            // if(auth_information.is_logged_in){
            //     dataResponse         = await fetchPost(API_URL + 'auth/get-user-pk');
            //     let user_information = await dataResponse.json();
            //     this.$store.commit('set_user_id', user_information['user_id']);
            // }

        },
    }
</script>

<style scoped>
.wrapper {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    min-height: 100vh;
    max-width: 100vw;
    padding: 10px;
    width: 100vw;
    height: 100vh;
}

.bg-active {
    background-color: #232C3A;
    color : white !important;
}


</style>