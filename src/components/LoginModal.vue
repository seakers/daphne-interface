<template>
    <div class="message-body">
        <p>Hello! I see you are not logged in. To be able to use features such as saving and loading custom datasets, you need to be registered as a user and logged in. If you are already registered, please introduce you username and password below.</p>
        <form id="login-form">
            <p v-if="hasLoginError">{{ loginError }}</p>
            <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left">
                    <input class="input" type="text" placeholder="Your username" name="username">
                    <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
                </div>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left">
                    <input class="input" type="password" placeholder="Password" name="password">
                    <span class="icon is-small is-left"><i class="fas fa-key"></i></span>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="login">Submit</button>
                </div>
            </div>
        </form>
        <p>If you do not have a username, you can either register by clicking <a v-on:click.prevent="openRegisterForm">here</a> or <a v-on:click.prevent="$emit('close-modal')">continue as a guest</a>.</p>
        <p>In case you have forgotten your password, click <a v-on:click.prevent="openResetPasswordForm">here</a> to recover it.</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'login-modal',
        computed: {
            ...mapState({
                isLoggedIn: state => state.auth.isLoggedIn,
                hasLoginError: state => state.auth.hasLoginError,
                loginError: state => state.auth.loginError
            })
        },
        methods: {
            login() {
                let formData = new FormData(document.getElementById('login-form'));

                this.$store.dispatch('loginUser', {
                    username: formData.get("username"),
                    password: formData.get("password")
                }).then(async () => {
                    // Start the Websocket
                    await wsTools.wsRefresh();
                });
            },
            openRegisterForm() {
                this.$store.commit('activateModal', 'RegisterModal');
            },
            openResetPasswordForm() {
                this.$store.commit('activateModal', 'ResetPasswordModal');
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