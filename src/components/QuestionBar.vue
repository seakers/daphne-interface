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
            <a class="button is-info" id="send_command" v-on:click.prevent="sendCommand">Do it!</a>
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
        watch: {
            getResponse: function(val, oldVal) {
                if (this.speakOut) {
                    responsiveVoice.speak(this.getResponse['voice_answer']);
                }
            }
        }
    }
</script>

<style scoped>

</style>