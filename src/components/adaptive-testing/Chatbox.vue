<template>
    <v-container>

        <!-- HEADER-->
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

        <!-- MESSAGES-->
        <v-container fluid style="padding-bottom: 75px;">
            <v-row dense>
                <v-slide-y-reverse-transition group>

                    <v-col v-for="(item, idx) in messages" :key="idx" cols="12" style="padding-top: 6px; padding-bottom: 6px;">
                        <v-card :style="get_message_style(item.sender)">
                            <v-card-title style="padding-top: 10px; padding-bottom: 4px;" class="text-subtitle-2">
                                <div v-if="item.sender === 'User'">{{username}}</div>
                                <div v-if="item.sender === 'Daphne'">{{ item.sender }} </div>
                                <v-btn icon right absolute x-small elevation="0" v-on:click="clear_message(item)">
                                    <v-icon color="analogous2">mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text style="padding-bottom: 10px;">
                                {{ item.text }}
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-slide-y-reverse-transition>
            </v-row>
        </v-container>


        <!-- FOOTER -->
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
                            @keydown.enter="send_message()"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>

    </v-container>
</template>

<script>




    import {mapState} from "vuex";
    import {MessageSubscription, InsertMessage, ClearMessage} from "../../testing_store/queries";

    export default {
        name: "chatbox",
        data: function () {
            return {
                messages_db: null,
                messages: [],
                user_message: '',
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
            }),
            user_message_object() {
                return {
                    text: this.user_message,
                    sender: 'User'
                }
            }
        },
        methods: {
            get_message_style(type){
                if(type === 'User'){
                    return 'border-radius: 28px 28px 28px 4px; margin-right: 40px;'
                }
                return 'border-radius: 28px 28px 4px 28px; margin-left: 40px;'
            },
            async send_message(){
                console.log('--> SENDING MESSAGE');

                // --> 1. Add message to current messages string
                // this.messages.push(this.user_message_object);
                await this.insert_message();



                // --> Reset message field to empty
                this.user_message = '';
            },
            async insert_message(){
                let mutation = await this.$apollo.mutate({
                    mutation: InsertMessage,
                    variables: {
                        user_id: this.user_id,
                        text: this.user_message_object.text,
                        sender: this.user_message_object.sender,
                    },
                    update: (cache, { data: { result } }) => {},
                });
            },
            async clear_message(msg){
                console.log('--> CLEARING MESSAGE:', msg);
                let mutation = await this.$apollo.mutate({
                    mutation: ClearMessage,
                    variables: {
                        message_id: msg.id
                    },
                    update: (cache, { data: { result } }) => {},
                });
            }
        },
        watch: {
            messages() {
                // --> Scroll to the bottom of the message window
                console.log('--> SCROLLING DOWN');
                // let cmessage = this.$el.querySelector('#cmessage')
            }
        },
        apollo: {
              $subscribe: {
                  messages_db: {
                      deep: true,
                      query: MessageSubscription,
                      variables() {
                          return {
                              user_id: this.user_id
                          }
                      },
                      skip() {
                          return (this.user_id === null);
                      },
                      result(result){
                          console.log('--> MESSAGE:', result);
                          let messages = result.data.messages_db;
                          for(let x = 0; x < messages.length; x++){
                              messages[x].date = (new Date(Date.parse(messages[x].date))).toLocaleString();
                          }
                          this.messages = messages;
                      }
                  }
              }
        },
        async mounted(){

        }
    }
</script>

<style scoped>

</style>