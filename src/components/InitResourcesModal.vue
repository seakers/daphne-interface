<template>
    <div class="message-body">



    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import {wsTools} from "../scripts/websocket-tools";
    import {fetchPost} from "../scripts/fetch-helpers";
    export default {
        name: "InitResourcesModal",
        data: function () {
            return {
                test: false,
            }
        },
        methods: {

        },
        async mounted() {
            // --> 1. Reconnect WebSocket
            await wsTools.wsReconnect();

            // --> 2. Send request to create services
            let reqData = new FormData();
            let dataResponse = await fetchPost(API_URL + 'auth/init-services', reqData);
            if (dataResponse.ok) {
                let data = await dataResponse.json();
                console.log('--> SERVICES INITIALIZED');
            }

        }
    }
</script>

<style scoped>

</style>