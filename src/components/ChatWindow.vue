<template>
    <div>
        <div class="chat-container">
            <section ref="chatArea" class="chat-area">
                <p v-for="message in messages" class="chat-message" :class="{ 'chat-message-user': message.author === 'you', 'chat-message-daphne': message.author !== 'you' }">
                    {{ message.body }}
                </p>
            </section>

            <QuestionBar class="sticky-textbox"></QuestionBar>
        </div>
    </div>
</template>

<script>
    import QuestionBar from "./QuestionBar";
    export default {
        name: "ChatWindow",
        components: {QuestionBar},
        data() {
            return {
                bobMessage: '',
                youMessage: '',
                messages: [
                    {
                        body: 'Welcome to the chat, I\'m Bob!',
                        author: 'bob'
                    },
                    {
                        body: 'Thank you Bob',
                        author: 'you'
                    },
                    {
                        body: 'You\'re most welcome',
                        author: 'bob'
                    }
                ]
            }
        },
        methods: {
            sendMessage(direction) {
                if (!this.youMessage && !this.bobMessage) {
                    return;
                }
                if (direction === 'out') {
                    this.messages.push({body: this.youMessage, author: 'you'});
                    this.youMessage = '';
                } else if (direction === 'in') {
                    this.messages.push({body: this.bobMessage, author: 'bob'});
                    this.bobMessage = '';
                } else {
                    alert('something went wrong');
                }
                Vue.nextTick(() => {
                    let messageDisplay = this.$refs.chatArea;
                    messageDisplay.scrollTop = messageDisplay.scrollHeight;
                })
            },
            clearAllMessages() {
                this.messages = [];
            }
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .chat-area {
        padding: 1em;
        overflow: auto;
        flex-grow: 1;
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
        position: sticky;
        bottom: 0;
    }

</style>