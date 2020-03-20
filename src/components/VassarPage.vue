<template>
    <div class="wrapper">
        <div class="columns">
            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
                <div class="aside-container">
                    <vassar-menu></vassar-menu>
                </div>
            </aside>

            <div class="column is-10 hero">
                <stakeholders></stakeholders>
            </div>
        </div>

    </div>
</template>



<script>
    import { mapState } from 'vuex';
    import {fetchGet} from '../scripts/fetch-helpers';
    import VassarMenu from './VassarMenu';
    import Stakeholders from './Stakeholders';

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
                page_selected: state => state.vassarPages.page_selected,

            }),
        },
        methods: {
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
            VassarMenu,
            Stakeholders
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



<style lang="scss">
.aside-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>