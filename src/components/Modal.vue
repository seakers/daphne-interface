<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content">
            <article class="message">
                <component v-bind:is="modalContent" v-on:close-modal="onCloseModal"></component>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="guestLogin"></button>
    </div>
</template>

<script>
    import Stage1Modal from './Stage1Modal';
    import Stage2Modal from './Stage2Modal';
    import LoginModal from './LoginModal';
    import RegisterModal from './RegisterModal';
    import SaveDatasetModal from './SaveDatasetModal';
    import ResetPasswordModal from './ResetPasswordModal';
    import {fetchPost} from "../scripts/fetch-helpers";

    export default {
        name: 'modal',
        props: ['modalContent', 'isActive'],
        data() {
            return {
            }
        },
        components: {
            Stage1Modal,
            Stage2Modal,
            LoginModal,
            RegisterModal,
            SaveDatasetModal,
            ResetPasswordModal
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },
            guestLogin() {
                fetchPost(API_URL + 'auth/confirm-guest', new FormData());
                this.$emit('close-modal');
            },
        }
    }
</script>

<style scoped>

</style>