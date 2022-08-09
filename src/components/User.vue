<template>
    <div>
        <p v-if="isLoggedIn">Hi, {{ username }}. <a v-on:click.prevent="logout">Logout</a></p>
        <p v-else>Hello! <a v-on:click.prevent="openLoginModal">Login/Register</a></p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {wsTools} from "../scripts/websocket-tools";

    export default {
        name: 'User',
        computed: {
            ...mapState({
                isLoggedIn: state => state.auth.isLoggedIn,
                username: state => state.auth.username
            })
        },
        methods: {
            openLoginModal() {
                this.$store.commit('activateModal', 'LoginModal');
            },
            logout() {
                this.$store.dispatch('logoutUser').then(async () => {
                    // Start the Websocket
                    await wsTools.wsReconnect();
                });
            }
        }
    }
</script>

<style scoped>

</style>