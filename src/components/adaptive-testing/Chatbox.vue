<template>
    <v-container>

        <!-- HEADER-->
        <v-list-item class="white--text">
            <v-list-item-content>
                <v-list-item-title class="text-h6">
                    <span>Virtual Assistant</span>

                    <!--SETTINGS-->
                    <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn dark icon v-bind="attrs" v-on="on" style="float: right" height="24"
                                   :class="{ 'yellow--text': recommender_status }"
                            >
                                <v-icon>mdi-cog</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item-group v-model="settings" multiple active-class="">
                                <v-list-item>
                                    <template v-slot:default="{ active }">
                                        <v-list-item-action>
                                            <v-checkbox :input-value="active"></v-checkbox>
                                        </v-list-item-action>

                                        <v-list-item-content>
                                            <v-list-item-title>Recommender</v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
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
                                <div v-if="item.sender === 'Daphne'">{{ item.sender }}</div>
                                <v-btn icon right absolute x-small elevation="0" v-on:click="clear_message(item)">
                                    <v-icon color="analogous2">mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text style="padding-bottom: 10px;">
                                {{ item.text }}
                            </v-card-text>


                            <v-divider v-if="item.more_info !== null" style="margin-top: 0; margin-bottom: 0;"></v-divider>
                            <v-card-actions v-if="item.more_info !== null" style="padding-top: 8px; padding-left: 16px;">
                                <span class="text-subtitle-2">Recommended Material</span>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="item.show = !item.show">
                                    <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-actions>

                            <!--RECOMMENDATION-->
                            <v-expand-transition v-if="item.more_info !== null">
                                <div v-show="item.show">
                                    <v-divider style="margin: 0;"></v-divider>
                                    <v-card-text style="padding-top: 0; padding-left: 0; padding-right: 0;">


                                        <v-list dense>
                                            <v-list-group v-for="(module, idx) in JSON.parse(JSON.stringify(item.more_info))" :key="idx"
                                                :value="false"
                                            >
                                                <!--LEARNING MODULE-->
                                                <template v-slot:activator>
                                                    <v-list-item-content>
                                                        <v-list-item-title>
                                                            {{module.name}}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle>{{(module.confidence * 100).toFixed(1)}}%</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </template>

                                                <!--SLIDE-->
                                                <v-list-item v-for="(slide, idx_s) in module.slides.slice(0, 5)" :key="idx_s">


                                                    <v-container>
                                                        <v-row>
                                                            <v-col cols="10">
                                                                <v-list-item-title>
                                                                    Slide {{slide.id}}
                                                                    <v-progress-linear :value="slide.confidence * 100" rounded color="analogous2"></v-progress-linear>
                                                                </v-list-item-title>
                                                            </v-col>
                                                            <v-col cols="2">
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn icon small color="success" v-bind="attrs" v-on="on" @click="go_to_slide(module, slide)">
                                                                            <v-icon>mdi-arrow-right-bold</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>Go to slide</span>
                                                                </v-tooltip>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>

<!--                                                    <v-list-item-content>-->
<!--                                                        <v-list-item-title>-->

<!--                                                            Slide {{slide.id}}-->
<!--                                                            <v-progress-linear :value="slide.confidence * 100" rounded></v-progress-linear>-->


<!--                                                        </v-list-item-title>-->
<!--                                                    </v-list-item-content>-->
                                                </v-list-item>

                                            </v-list-group>



                                        </v-list>


                                    </v-card-text>
                                </div>
                            </v-expand-transition>


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
    import {MessageSubscription, InsertMessage, ClearMessage, SlidesQueryFast, UpdateSlideIdx} from "../../testing_store/queries";
    import {fetchPost} from "../../scripts/fetch-helpers";
    import * as _ from "lodash-es";

    export default {
        name: "chatbox",
        data: function () {
            return {
                messages_db: null,
                messages: [],
                user_message: '',

                settings: [0],
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.user.user_id,
                username: state => state.user.username,
                email: state => state.user.email,
                chatbox: state => state.user.chatbox,
            }),
            user_message_object() {
                return {
                    text: this.user_message,
                    sender: 'User'
                }
            },
            recommender_status() {
                return this.settings.includes(0);
            }
        },
        methods: {
            async go_to_slide(module, slide){
                console.log('--> GOING TO SLIDE:', module, slide);

                // --> 1. Create link to learning module
                let link = '/LearningModule/' + module.name + '/' + module.id;

                // --> 2. Route to learning module
                if (this.$route.path !== link) {
                    await this.$router.push(link);
                }

                // --> 3. Calculate which slide to go to and set
                let slide_idx = await this.get_slide_idx(module.id, slide.id);
                console.log('--> SLIDE IDX', slide_idx);

                let mutation = await this.$apollo.mutate({
                    mutation: UpdateSlideIdx,
                    variables: {
                        user_id: this.user_id,
                        module_id: module.id,
                        slide_idx: slide_idx
                    },
                    update: (cache, { data: { result } }) => {},
                });
                console.log(mutation);
            },
            async get_slide_idx(module_id, slide_num){
                let slide_query = await this.$apollo.query({
                    deep: true,
                    fetchPolicy: 'no-cache',
                    query: SlidesQueryFast,
                    variables: {
                        user_id: this.user_id,
                        module_id: module_id,
                    }
                });
                let query_slides = slide_query['data']['slides'];
                return query_slides[slide_num].idx;
            },
            get_message_style(type){
                if(type === 'User'){
                    return 'border-radius: 28px 28px 28px 4px; margin-right: 40px;'
                }
                return 'border-radius: 28px 28px 4px 28px; margin-left: 40px;'
            },
            async send_message(){
                console.log('--> SENDING MESSAGE');

                // --> 1. Add message to current messages string
                await this.insert_message(this.user_message_object.text, this.user_message_object.sender);
                let reqData1 = new FormData();
                let reqData2 = new FormData();
                reqData1.append('command', this.user_message_object.text);
                reqData2.append('command', this.user_message_object.text);

                // --> 2. Get recommended material response from Q&A System
                let more_info = null;
                if(this.recommender_status){
                    let dataResponse_lm = await fetchPost(API_URL + 'ca/dialogue/lmcommand',reqData1);
                    if (dataResponse_lm.ok) {
                        let data_lm = await dataResponse_lm.json();
                        // console.log('--> CONFIDENCE DATA',data_lm)
                        if(data_lm['response'] !== 'empty'){
                            more_info = data_lm['response'];
                        }
                    }
                }

                // --> 3. Get textual response from Q&A System

                let dataResponse_ca = await fetchPost(API_URL + 'eoss/dialogue/command', reqData2);
                if (dataResponse_ca.ok) {
                    let data_ca = await dataResponse_ca.json();
                    console.log('--> ANSWER DATA',data_ca)
                    let text = data_ca['response']['visual_message'][0];
                    if(typeof text !== 'undefined'){
                        await this.insert_message(text, 'Daphne', more_info);
                    }
                }
                else{
                    await this.insert_message('There was an error processing the command', 'Daphne', more_info);
                }

                // --> 4. Reset message field to empty
                this.user_message = '';
            },
            async insert_message(text, sender, more_info){
                let mutation = await this.$apollo.mutate({
                    mutation: InsertMessage,
                    variables: {
                        user_id: this.user_id,
                        text: text,
                        sender: sender,
                        more_info: more_info
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

                          // --> 1. Calculate number of new messages
                          if(this.chatbox === false){
                              let num_new = messages.length - this.messages.length;
                              this.$store.commit('add_new_messages', num_new);
                          }
                          else{
                              this.$store.commit('set_new_messages', 0);
                          }

                          // --> 2. Copy over messages
                          for(let x = 0; x < messages.length; x++){
                              messages[x].date = (new Date(Date.parse(messages[x].date))).toLocaleString();
                              if(messages[x].more_info !== null){
                                  messages[x].more_info = JSON.parse(messages[x].more_info)
                                  messages[x].show = false;
                              }
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