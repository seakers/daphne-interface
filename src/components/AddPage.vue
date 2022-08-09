<template>
    <div class="wrapper">
        <div class="columns" style="max-width: 100vw;">

            <!-- MENU -->
            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile" style="margin-right: 0px !important;">
                <div class="aside-container">
                    <add-menu></add-menu>
                </div>
            </aside>


            <div class="column is-10 editor-background hero" v-bind:class="[ light_theme ? 'editor-background-light' : 'editor-background-dark' ]" style="justify-content: center;">



                <!-- PAGES -->
                <template v-if="page_selected === 'groups'">
                    <groups></groups>
                </template>

                <template v-if="page_selected === 'problems'">
                    <problems></problems>
                </template>

                <template v-if="page_selected === 'graph'">
                    <graph></graph>
                </template>

<!--                <template v-if="page_selected === 'orbits'">-->
<!--                    <orbits attribute_header="Orbit Attribute Library"-->
<!--                            dashboard_name="Orbit Dashboard"-->
<!--                    ></orbits>-->
<!--                </template>-->

<!--                <template v-if="page_selected === 'launch vehicles'">-->
<!--                    <launch-vehicles></launch-vehicles>-->
<!--                </template>-->

<!--                <template v-if="page_selected === 'measurements'">-->
<!--                    <measurements></measurements>-->
<!--                </template>-->

<!--                <template v-if="problems__selected_id !== null">-->
<!--                    <template v-if="page_selected === 'stakeholders'">-->
<!--                        <stakeholders></stakeholders>-->
<!--                    </template>-->

<!--                    <template v-if="page_selected === 'requirements'">-->
<!--                        <requirements></requirements>-->
<!--                    </template>-->

<!--                    <template v-if="page_selected === 'mission analysis'">-->
<!--                        <mission-analysis></mission-analysis>-->
<!--                    </template>-->

<!--                    <template v-if="page_selected === 'attributes'">-->
<!--                        <attributes></attributes>-->
<!--                    </template>-->
<!--                </template>-->




            </div>
        </div>
    </div>
</template>



<script>
import { mapState, mapGetters } from 'vuex';
import { fetchGet, fetchPost} from '../scripts/fetch-helpers';

import AddMenu from './add/AddMenu';
import Graph  from "./add/Graph";

import Groups  from "./problem_builder/Groups";
import Problems  from "./problem_builder/Problems";
import addPages from "../add_store/modules/add-pages";





export default {
    name: 'add-page',
    data: function () {
        return {
        }
    },
    computed: {
        ...mapState({
            page_selected: state => state.vassarPages.page_selected,
            light_theme: state => state.vassarPages.light_theme,

        }),
        ...mapGetters({
            // problems__selected_id: 'problems__problem_selection',
        }),
    },
    methods: {
        // async hide_notification() {
        //     this.$store.commit('set_hide_message');
        // },



    },
    components: {
        // ScoreTree, CostColumn, DetailsTable
        AddMenu,
        Groups,
        Problems,
        Graph
    },
    async mounted() {

        // Set user id
        await this.$store.dispatch('get_user_id');
        await this.$store.dispatch('query_groups');
    },
    watch: {
    },
    apollo: {
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



<style lang="scss">
.aside-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.editor-background {
    display: flex;
}
.editor-background-dark {
    background-color: #28313e;
    -webkit-box-shadow: inset 0px 0px 3px #14191f;
    -moz-box-shadow: inset 0px 0px 3px #14191f;
    box-shadow: inset 0px 0px 14px #14191f;

    transition: background-color ease-out, box-shadow ease-out;
    -webkit-transition: background-color 700ms linear, box-shadow 700ms linear;
    -ms-transition: background-color 700ms linear, box-shadow 700ms linear;
    transition: background-color 700ms linear, box-shadow 700ms linear;
}
.editor-background-light {
    background-color: #f2f2f2;

    transition: background-color ease-out, box-shadow ease-out;
    -webkit-transition: background-color 700ms linear, box-shadow 700ms linear;
    -ms-transition: background-color 700ms linear, box-shadow 700ms linear;
    transition: background-color 700ms linear, box-shadow 700ms linear;
}



// Transitions






















</style>