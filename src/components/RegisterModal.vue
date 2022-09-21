<template>
    <div class="message-body">

        <div v-if="is_initializing === false">
            <p>Please enter your username, email and password to register.</p>
            <form id="register-form">
                <p v-if="hasRegistrationError">{{ registrationError }}</p>
                <div class="field">
                    <label class="label">Username</label>
                    <div class="control has-icons-left">
                        <input class="input" type="text" placeholder="Your username" name="username">
                        <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left">
                        <input class="input" type="email" placeholder="Your email" name="email">
                        <span class="icon is-small is-left"><i class="fas fa-at"></i></span>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left">
                        <input class="input" type="password" placeholder="Password" name="password1">
                        <span class="icon is-small is-left"><i class="fas fa-key"></i></span>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Repeat password</label>
                    <div class="control has-icons-left">
                        <input class="input" type="password" placeholder="Repeat Password" name="password2">
                        <span class="icon is-small is-left"><i class="fas fa-key"></i></span>
                    </div>
                </div>

                <div class="field">
                    <div class="control">
                        <button class="button is-link" v-on:click.prevent="register">Register</button>
                        <button class="button is-link" v-on:click.prevent="openLoginForm">Back</button>
                    </div>
                </div>
            </form>
        </div>

        <div v-if="is_initializing === true">
            <div style="font-weight: bold; font-size: larger">
                Initializing Cloud Services
            </div>

            <div style="padding-top: 15px;">
                <div>Design Evaluator</div>
                <progress v-if="is_initializing === true" class="progress is-small is-warning" max="100">50%</progress>
                <progress v-if="is_initializing === false" class="progress is-small is-success" value="100" max="100"></progress>

                <div>Genetic Algorithm</div>
                <progress v-if="is_initializing === true" class="progress is-small is-warning" max="100">50%</progress>
                <progress v-if="is_initializing === false" class="progress is-small is-success" value="100" max="100"></progress>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {wsTools} from "../scripts/websocket-tools";

    export default {
        name: 'register-modal',
        computed: {
            ...mapState({
                isLoggedIn: state => state.auth.isLoggedIn,
                hasRegistrationError: state => state.auth.hasRegistrationError,
                registrationError: state => state.auth.registrationError,
                is_initializing: state => state.auth.is_initializing,
            })
        },
        methods: {
            register() {

                let form = document.getElementById('register-form');
                this.$store.dispatch('registerUser', form).then(async () => {
                    // Start the Websocket
                    await wsTools.wsReconnect();
                });

            },
            openLoginForm() {
                this.$store.commit('activateModal', 'LoginModal');
            }
        },
        watch: {
            isLoggedIn: function (val, oldVal) {
                if (this.isLoggedIn) {
                    this.$emit('close-modal');
                }
            }
        }
    }
</script>

<style scoped>

</style>