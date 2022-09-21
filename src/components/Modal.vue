<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>

        <div v-if="modalContent === 'ControlPanelModal'">
            <div class="modal-content" style="width: 100%;">
                <article class="message">
                    <component v-bind:is="modalContent" v-on:close-modal="onCloseModal"></component>
                </article>
            </div>
        </div>
        <div v-if="modalContent !== 'ControlPanelModal'">
            <div class="modal-content">
                <article class="message">
                    <component v-bind:is="modalContent" v-on:close-modal="onCloseModal"></component>
                </article>
            </div>
        </div>

        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="guestLogin"></button>
    </div>
</template>

<script>
    import Stage0Modal from './Stage0Modal';
    import Stage1Modal from './Stage1Modal';
    import Stage2Modal from './Stage2Modal';
    import LoginModal from './LoginModal';
    import RegisterModal from './RegisterModal';
    import SaveDatasetModal from './SaveDatasetModal';
    import ResetPasswordModal from './ResetPasswordModal';
    import ReloadModal from './ReloadModal';
    import CopyDatasetModal from './CopyDatasetModal';
    import ControlPanelModal from "./ControlPanelModal";


    import {fetchPost} from "../scripts/fetch-helpers";


    export default {
        name: 'modal',
        props: ['modalContent', 'isActive'],
        data() {
            return {
            }
        },
        components: {
            Stage0Modal,
            Stage1Modal,
            Stage2Modal,
            LoginModal,
            RegisterModal,
            SaveDatasetModal,
            ResetPasswordModal,
            ReloadModal,
            CopyDatasetModal,
            ControlPanelModal
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