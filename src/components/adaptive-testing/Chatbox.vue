<template>
    <v-container>

        <!--        HEADER-->
        <v-list-item class="white--text">
            <v-list-item-content>
                <v-list-item-title class="text-h6">
                    Virtual Assistant
                </v-list-item-title>
                <v-list-item-subtitle class="white--text">
                    Dialogue History
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider class="white" style="margin-top: 5px;"></v-divider>

        <!--        MESSAGES-->
        <v-container fluid style="padding-bottom: 75px;">
            <v-row dense>
                <v-col v-for="(item, idx) in dialogue" :key="idx" cols="12">
                    <v-card :style="get_message_style(item.from)">
                        <v-card-title style="padding-top: 10px; padding-bottom: 4px;" class="text-subtitle-2">
                            <div v-if="item.from === 'User'">{{username}}</div>
                            <div v-if="item.from === 'Daphne'">{{ item.from }}</div>
                        </v-card-title>
                        <v-card-text style="padding-bottom: 10px;">
                            {{ item.message }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-footer fixed color="analogous2" height="90">
            <v-container>
                <v-row no-gutters>
                    <v-col class="text-center white--text" cols="12">
                        <v-text-field
                            v-model="user_message"
                            outlined
                            clearable
                            append-icon="mdi-send"
                            background-color="white"
                            v-on:click:append="send_message()"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>



    </v-container>
</template>

<script>




    import {mapState} from "vuex";

    export default {
        name: "chatbox",
        data: function () {
            return {

            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
                dialogue: state => state.user.dialogue,
            }),
            user_message: {
                get() {
                    return this.$store.state.user.user_message;
                },
                set(value) {
                    this.$store.commit('set_user_message_value', value);
                }
            }
        },
        methods: {
            get_message_style(type){
                if(type === 'User'){
                    return 'border-radius: 20px 20px 20px 4px; margin-right: 40px;'
                }
                return 'border-radius: 20px 20px 4px 20px; margin-left: 40px;'
            },
        },
        watch: {

        },
        async mounted(){

        }
    }
</script>

<style scoped>

</style>