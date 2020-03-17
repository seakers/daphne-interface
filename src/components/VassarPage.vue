<template>
    <div class="wrapper">


    </div>
</template>



<script>
    import { mapState } from 'vuex';
    import {fetchGet} from '../scripts/fetch-helpers';

    // function getParameterByName(name, url) {
    //     if (!url) url = window.location.href;
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    export default {
        name: 'vassar-page',
        data: function () {
            return {
                // tutorial: {},
            }
        },
        computed: {
            ...mapState({
                // subobjectiveDetails: state => state.score.subobjectiveDetails

            }),
        },
        methods: {
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
        },
        mounted() {

        },
        watch: {
        }
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
