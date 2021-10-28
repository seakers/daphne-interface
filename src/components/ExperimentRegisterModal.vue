<template>
    <div class="message-body">
        <p>Please enter your name to register for the experiment</p>

        <input v-model="experiment_user" placeholder="name...">
        <button class="button is-link" v-on:click.prevent="register">Begin</button>


    </div>
</template>

<script>
import { mapState } from 'vuex';
import {fetchPost} from "../scripts/fetch-helpers";
import {wsTools} from "../scripts/websocket-tools";

export default {
    name: 'experiment-register-modal',
    data() {
        return {
            experiment_user: '',
            experiment_password: '',
            experiment_email: '',
        }
    },
    computed: {
        ...mapState({
            isLoggedIn: state => state.auth.isLoggedIn,
            hasRegistrationError: state => state.auth.hasRegistrationError,
            registrationError: state => state.auth.registrationError
        })
    },
    methods: {
        async register() {
            if(this.experiment_user !== ''){

                // 1. Create experiment user information
                this.experiment_password = this.experiment_user
                this.experiment_email = this.experiment_user + '@gmail.com'
                let reqData = new FormData();
                reqData.append('username', this.experiment_user);
                reqData.append('email', this.experiment_email);
                reqData.append('password1', this.experiment_password);
                reqData.append('password2', this.experiment_password);

                // 2. Register experiment user
                let dataResponse = await fetchPost(API_URL + 'auth/register', reqData);

                // 3. If registered correctly
                if (dataResponse.ok) {
                    let data = await dataResponse.json();
                    if (data['status'] === 'registered') {

                        // 4. Log in experiment user
                        console.log('--> LOGGING IN');
                        await this.$store.dispatch('loginUser', {
                            username: this.experiment_user,
                            password: this.experiment_password
                        }).then(async () => { await wsTools.wsReconnect(); });

                        // 5. Start experiment tutorial
                        this.$store.dispatch('startExperiment').then(async () => {
                            this.$store.commit('setExperimentStage', 'tutorial');
                            this.$store.commit('setInExperiment', true);
                        });

                        // 6. Close register modal
                        this.$emit('close-modal');
                    }
                    else {
                        this.$store.commit('setRegistrationError', data);
                    }
                }
                else {
                    console.error('Error registering.');
                }
            }
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