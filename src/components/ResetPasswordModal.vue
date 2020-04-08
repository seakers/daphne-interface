<template>
    <div class="message-body">
        <p>Please enter your email to receive a one-time link to reset your password.</p>
        <form id="reset-password-email-form">
            <p v-if="hasResetPasswordError">{{ resetPasswordError }}</p>

            <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                    <input class="input" type="email" placeholder="Your email" name="email">
                    <span class="icon is-small is-left"><i class="fas fa-at"></i></span>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link" v-on:click.prevent="sendEmail">Send Email</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'reset-password-modal',
        computed: {
            ...mapState({
                hasResetPasswordError: state => state.auth.hasResetPasswordError,
                resetPasswordError: state => state.auth.resetPasswordError
            })
        },
        methods: {
            sendEmail() {
                let form = document.getElementById('reset-password-email-form');
                this.$store.dispatch('resetPasswordEmail', form);
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>