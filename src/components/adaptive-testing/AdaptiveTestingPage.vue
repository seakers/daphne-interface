<template>
    <v-app>

        <v-app-bar app color="white" flat>
            <v-container class="py-0 fill-height">

                <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

                <v-btn v-for="link in links" :key="link" text>
                    {{ link }}
                </v-btn>

                <v-spacer></v-spacer>

                <v-responsive max-width="260">
                    <v-text-field
                        dense
                        flat
                        hide-details
                        rounded
                        solo-inverted
                    ></v-text-field>
                </v-responsive>

            </v-container>
        </v-app-bar>


        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="2">
                        <v-sheet rounded="lg">
                            <v-list color="transparent">
                                <v-list-item v-for="n in 5" :key="n" link>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            List Item {{ n }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-divider class="my-2"></v-divider>

                                <v-list-item link color="grey lighten-4">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Refresh
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                            </v-list>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet
                            min-height="70vh"
                            rounded="lg"
                        >
                            <!--  -->
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>



    </v-app>
</template>

<script>
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TestingMenu from './TestingMenu'
    import BulmaMenu from './BulmaMenu'

    export default {
        name: "adaptive-testing-page",
        components: {
            TestingMenu,
            BulmaMenu
        },
        data: function () {
            return {
                links: [
                    'Progress',
                    'Topics',
                ],
            }
        },
        computed: {

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
</style>