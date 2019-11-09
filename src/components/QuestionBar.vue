<template>
    <div class="field has-addons is-fullwidth">
        <div class="control is-expanded">
            <input class="input" type="text" name="command" placeholder="Ask a question / Give a command / Speak it out!" v-model="command" v-on:keyup.enter="sendCommand">
        </div>
        <div class="control">
            <a class="button is-info" v-on:click.prevent="switchVoice">
                <span class="icon is-small">
                    <i class="fas" v-bind:class="[ speakOut ? 'fa-volume-up' : 'fa-volume-off' ]"></i>
                </span>
            </a>
        </div>
        <div class="control">
            <a class="button is-info" id="clear_history" v-on:click.prevent="clearHistory">Clear</a>
        </div>
        <div class="control">
            <a class="button is-info" id="send_command" v-on:click.prevent="sendCommand">Send</a>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    let responsiveVoice = window.responsiveVoice;

    export default {
        name: 'question-bar',
        data() {
            return {
                speakOut: false
            }
        },
        computed: {
            ...mapGetters([
                'getResponse'
            ]),
            command: {
                get() {
                    return this.$store.state.daphne.command;
                },
                set(newCommand) {
                    this.$store.commit('setCommand', newCommand);
                }
            }
        },
        methods: {
            clearHistory(event) {
                this.$store.dispatch('clearHistory');
            },
            sendCommand(event) {
                if (this.command === 'stop') {
                    responsiveVoice.cancel();
                }
                else {
                    this.$store.dispatch('executeCommand');
                }
            },
            switchVoice(event) {
                console.log(this.speakOut);
                this.speakOut = !this.speakOut;
            }
        },
    }
</script>

<style scoped>

</style>