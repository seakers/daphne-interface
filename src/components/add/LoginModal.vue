<template>
    <v-container>

<!--    ALERTS-->
        <v-snackbar v-model="error_noti" timeout="5000" color="error" elevation="24">
            Invalid credentials
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="error_noti = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>


        <!--LOGIN CARD-->
        <v-card
            width="450"
            color="primary lighten-1"
            loader-height="6"
            :loading="login_loading"
        >
            <v-card-title>Login</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="username" label="Username" clearable outlined :rules="field_rules"></v-text-field>
                    <v-text-field v-model="password" label="Password" clearable outlined :rules="field_rules"></v-text-field>
                    <v-btn color="success" :disabled="valid_input" v-on:click="login()">submit</v-btn>
                </v-form>
            </v-card-text>
        </v-card>


    </v-container>
</template>

<script>
    import {fetchPost} from "../../scripts/fetch-helpers";

    export default {
        name: "login-modal",
        data: function () {
            return {
                username: '',
                password: '',
                field_rules: [v => (v && v.length > 0) || 'field must not be empty'],
                login_loading: false,

                error_noti: false
            }
        },
        computed: {
            valid_input(){
                return this.username === '' || this.password === '';
            }
        },
        methods: {
            async login(){
                this.login_loading = 'success';
                this.error_noti = false;
                console.log('--> LOGGING IN');


                // --> 1. Send login request
                let reqData = new FormData();
                reqData.append("username", this.username);
                reqData.append("password", this.password);
                let dataResponse = await fetchPost(API_URL + 'auth/login', reqData);

                // --> 2. Handle response
                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    if (data['status'] === 'logged_in') {
                        await this.$store.commit('set_user_id', data['pk']);
                        await this.$store.commit('set_user_username', data['username']);
                        await this.$store.commit('set_user_email', data['email']);
                        await this.$store.commit('set_login_overlay', false);
                        await this.$store.dispatch('connect', this.$neo4j);
                    }
                    else {
                        this.error_noti = true;
                    }
                }
                else {
                    console.error('Error logging in.');
                }
                this.login_loading = false;
            }
        },
        watch: {

        },
        async mounted(){
            console.log('--> MOUNTING LOGIN MODAL')
        }
    }
</script>

<style scoped>

</style>