<template>
    <div>
        <div class="chat-container">
            <section ref="chatArea" class="chat-area">
                <div v-for="(piece, p_index) in dialogueHistory" class="chat-message content" :class="{ 'chat-message-user': piece.writer === 'user', 'chat-message-daphne': piece.writer === 'daphne' }" :key="p_index">
                    <component v-for="(response, index) in piece['visual_message']" v-bind:is="responseTypes[piece['visual_message_type'][index]]" :response="response" :key="index"></component>
                    <p style="padding-left: 0.5em; padding-top: 0.5em;" v-if="piece.writer === 'daphne'"><a v-on:click="setPieceFeedback(p_index, 'positive')"><span class="fas fa-thumbs-up"  style="font-size: 1.25em;"></span></a>
                    <a v-on:click="setPieceFeedback(p_index, 'negative')"><span class="fas fa-thumbs-down" style="position:relative; top: 0.3em; font-size: 1.25em;"></span></a></p>
                </div>
                <img src="assets/img/loader.svg" style="display: block; margin: auto;" height="64" width="64" v-if="isLoading" alt="Loading spinner">
            </section>

            <QuestionBar class="sticky-textbox"></QuestionBar>
        </div>
    </div>
</template>

<script>
    import * as _ from 'lodash-es';
    import QuestionBar from "./QuestionBar";
    import TextResponse from './TextResponse';
    import ListResponse from './ListResponse';
    import MultiListResponse from './MultiListResponse';
    import TimelineResponse from './TimelineResponse';
    import ActiveMessage from "./ActiveMessage";
    import {mapState} from "vuex";

    let loaderImage = require('../images/loader.svg');

    export default {
        name: "ChatWindow",
        components: {
            QuestionBar,
            TextResponse,
            ListResponse,
            MultiListResponse,
            TimelineResponse,
            ActiveMessage
        },
        data() {
            return {
                responseTypes: {
                    text: 'TextResponse',
                    list: 'ListResponse',
                    multilist: 'MultiListResponse',
                    timeline_plot: 'TimelineResponse',
                    active_message: 'ActiveMessage'
                }
            }
        },
        computed: {
            ...mapState({
                dialogueHistory: state => state.daphne.dialogueHistory,
                isLoading: state => state.daphne.isLoading,
            })
        },
        methods: {
            scrollToBottom: function() {
                console.log("Scrolling to bottom");
                let container = this.$el.querySelector(".chat-area");
                container.scrollTop = container.scrollHeight;
            },
            setPieceFeedback: function(pIndex, feedbackType) {
                this.$store.commit("setPieceFeedback", {"pIndex": pIndex, "feedbackType": feedbackType});
                this.$toast("Your feedback has been registered.");
            }
        },
        watch: {
            dialogueHistory: function(val, oldVal) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                if (this.speakOut) {
                    if (val["writer"] === "daphne") {
                        responsiveVoice.speak(val['voice_answer']);
                    }
                }
            },
            isLoading: function(val, oldVal) {
                if (val === true) {
                    _.delay(() => { this.scrollToBottom(); }, 500);
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .chat-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
        width: inherit;
    }

    .chat-area {
        width: 100%;
        padding: 1em;
        overflow: auto;
        flex-grow: 1;
        scroll-behavior: smooth;
    }
    .chat-message {
        width: 95%;
        border-radius: 10px;
        padding: .8em;
        margin-bottom: .8em;
    }
    .chat-message-daphne {
        background: $white-ter;
    }
    .chat-message-user {
        margin-left: 5%;
        color: $white;
        background: $cyan;
    }

    .sticky-textbox {
        padding: 1em;
        bottom: 0;
    }

</style>