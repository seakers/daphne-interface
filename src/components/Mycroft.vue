<template>
    <div class="panel-block functionality">
        <!--Mycorft disconnected-->
        <template v-if="mycroft_connection === false">
            <div>
                Use the four digit token below to connect to mycroft
                <div style="font-weight: 700; padding-top: 10px; text-align: center; letter-spacing: 0.8px">
                    {{ access_token }}
                </div>

                <template v-if="access_token === 'receiving...'">
                    <progress class="progress is-small is-primary" max="100">15%</progress>
                </template>
            </div>
        </template>




        <!--Mycroft connected-->
        <template v-if="mycroft_connection === true">

        </template>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import * as _ from 'lodash-es';

    export default {
        name: "Mycroft",

        computed: {
            ...mapState({
                mycroft_connection: state => state.mycroft.mycroft_connection,
                access_token: state => state.mycroft.access_token,
            }),

        },

        methods: {

        },


        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Check if a mycroft device is already connected on mount
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        mounted() {
            this.$store.dispatch('check_mycroft_connection');
        },


    }
</script>

<style scoped>

</style>