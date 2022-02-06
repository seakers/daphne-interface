<template>
    <v-app dark>

<!--    LOGIN OVERLAY-->
        <v-overlay v-model="login_overlay" opacity="0.8" z-index="1000">
            <login-modal></login-modal>
        </v-overlay>




<!--    MAIN DRAWER-->
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

<!--            MASTERY-->
                <v-list-item v-for="item in main_links" :key="item.name" :to="item.link" link active-class="bg-active">
                    <v-list-item-icon>
                        <v-icon color="white">{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content class="white--text">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
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
                    <v-list-item v-for="item in module_links" :key="item.name" :to="item.link" link active-class="bg-active">

                        <v-list-item-content>
                            <v-list-item-title v-text="item.name" class="white--text"></v-list-item-title>
                            <v-progress-linear :value="item.progress * 100" :color="get_progress_color(item.progress)" rounded style="margin-top: 2px"></v-progress-linear>
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
                    <v-list-item v-for="item in test_links" :key="item.name" :to="item.link" link active-class="bg-active">
                        <v-list-item-title v-text="item.name" class="white--text"></v-list-item-title>

                        <v-list-item-icon>
                            <v-icon v-text="item.icon" color="white"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>



<!--    CHAT-BOX DRAWER-->
        <v-navigation-drawer v-model="chatbox"
                             app
                             absolute
                             right
                             color="analogous2"
                             width="400"
        >
            <chatbox></chatbox>
        </v-navigation-drawer>








        <v-app-bar app class="primary white--text">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
            <v-toolbar-title>Daphne Academy</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn @click="chatbox = !chatbox" icon style="margin-right: 10px;">
                <v-badge
                    :content="new_messages"
                    :value="new_messages"
                    color="green"
                    overlap
                >
                    <v-icon color="white" v-if="chatbox === false">mdi-chevron-left</v-icon>
                    <v-icon color="white" v-if="chatbox === true">mdi-chevron-right</v-icon>
                    <v-icon color="white">mdi-message</v-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>


        <v-main class="secondary lighten-3">
                <router-view></router-view>
        </v-main>


    </v-app>
</template>

<script>
    import {mapState} from "vuex";
    import {ModuleLinkSubscription} from "../../testing_store/queries";
    import LoginModal from "./LoginModal";
    import Chatbox from "./Chatbox";

    export default {
        name: "adaptive-testing-page",
        components: {
            Chatbox,
            LoginModal
        },
        data: function () {
            return {
                modules_db: null,

                // --> Main links <--
                main_links: [
                    { name: 'Mastery', icon: 'mdi-school', link: '/mastery'},
                ],

                // --> Test links <--
                test_links: [
                    { name: 'Adaptive Test', icon: 'mdi-brain', link: '/adaptive-test'},
                    { name: 'Targeted Test', icon: 'mdi-bullseye-arrow', link: '/targeted-test'},
                ],

                // --> Module links <--
                module_links: [],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
                new_messages: state => state.user.new_messages,
            }),
            drawer: {
                get() {
                    return this.$store.state.user.drawer;
                },
                set(value) {
                    this.$store.commit('set_drawer_value', value);
                }
            },
            chatbox: {
                get() {
                    return this.$store.state.user.chatbox;
                },
                set(value) {
                    this.$store.commit('set_chatbox_value', value);
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
            get_progress_color(progress){
                if(progress === 1){
                    return "success";
                }
                return "white";
            },
        },
        watch: {

        },
        apollo: {
            $subscribe: {
                modules_db: {
                    deep: true,
                    query: ModuleLinkSubscription,
                    variables() {
                        return {
                            user_id: this.user_id
                        }
                    },
                    skip() {
                        return (this.user_id === null);
                    },
                    result(result) {
                        console.log(result);
                        let modules = result.data.modules_db;
                        let module_links = [];
                        for(let x = 0; x < modules.length; x++){
                            let module = modules[x];

                            // --> Find module progress
                            let progress = 0;
                            let slide_questions = 0;
                            let slide_questions_completed = 0;
                            for(let y = 0; y < module.slides.length; y++){
                                let slide = module.slides[y];
                                if(slide.type === 'question'){
                                    slide_questions++;
                                    if(slide.answered === true){
                                        slide_questions_completed++;
                                    }
                                }
                            }
                            if(slide_questions !== 0){
                                progress = (slide_questions_completed / slide_questions);
                            }

                            module_links.push({
                                name: module.name,
                                icon: module.icon,
                                link: ('/LearningModule/' + module.name + '/' + module.id),
                                progress: progress
                            });
                        }
                        this.module_links = module_links;
                    },
                },
            },
        },
        async mounted() {
            await this.$store.dispatch('initialize');
        }
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