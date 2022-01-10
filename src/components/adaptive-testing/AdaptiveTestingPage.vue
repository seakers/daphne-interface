<template>
    <div class="wrapper">
        hello
    </div>
</template>

<script>
    import { fetchGet, fetchPost} from '../../scripts/fetch-helpers';

    export default {
        name: "adaptive-testing-page",
        data: function () {
            return {

            }
        },
        computed: {

        },
        methods: {

        },
        components: {

        },
        watch: {

        },
        async mounted() {

            // --> 1. Get login status
            let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
            let auth_information = await dataResponse.json();

            // --> 2. If logged in, set user ID in store
            if(auth_information.is_logged_in){
                dataResponse         = await fetchPost(API_URL + 'auth/get-user-pk');
                let user_information = await dataResponse.json();
                this.$store.commit('set_user_id', user_information['user_id']);
            }

        },
    }
</script>

<style scoped>
.wrapper {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    min-height: 100vh;
    max-width: 100vw;
    padding: 10px;
    width: 100vw;
    height: 100vh;
}
</style>