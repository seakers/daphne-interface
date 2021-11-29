<template>
    <div class="wrapper">
        <div class="columns" style="max-width: 100vw;">

            <!-- MENU -->
            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile" style="margin-right: 0px !important;">
                <div class="aside-container">
                    <vassar-menu></vassar-menu>
                </div>
            </aside>


            <div class="column is-10 editor-background hero" v-bind:class="[ light_theme ? 'editor-background-light' : 'editor-background-dark' ]" style="justify-content: center;">

                <!-- NOTIFICATION -->
                <div v-if="message_display" class="notification is-primary" v-bind:class="[ success_message ? 'is-success' : 'is-warning' ]">
                    <button class="delete" v-on:click="hide_notification()"></button>
                    {{ message_content }}
                </div>


                <!-- PAGES -->
                <template v-if="page_selected === 'groups'">
                    <groups></groups>
                </template>

                <template v-if="page_selected === 'problems'">
                    <problems></problems>
                </template>

                <template v-if="page_selected === 'instruments'">
                    <instruments></instruments>
                </template>

                <template v-if="page_selected === 'orbits'">
                    <orbits attribute_header="Orbit Attribute Library"
                            dashboard_name="Orbit Dashboard"
                    ></orbits>
                </template>

                <template v-if="page_selected === 'launch vehicles'">
                    <launch-vehicles></launch-vehicles>
                </template>

                <template v-if="page_selected === 'measurements'">
                    <measurements></measurements>
                </template>

                <template v-if="problems__selected_id !== null">
                    <template v-if="page_selected === 'stakeholders'">
                        <stakeholders></stakeholders>
                    </template>

                    <template v-if="page_selected === 'requirements'">
                        <requirements></requirements>
                    </template>

                    <template v-if="page_selected === 'mission analysis'">
                        <mission-analysis></mission-analysis>
                    </template>
                    
                    <template v-if="page_selected === 'attributes'">
                        <attributes></attributes>
                    </template>
                </template>
                



            </div>
        </div>

    </div>
</template>



<script>
    import { mapState, mapGetters } from 'vuex';
    import { fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import VassarMenu from './VassarMenu';

    import { OrbitQuery, OrbitAttributeQuery, OrbitAttributeJoinQuery, ProblemQuery } from '../scripts/apollo-queries';

    import Groups from './problem_builder/Groups';
    import Problems from './problem_builder/Problems';
    import Stakeholders from './problem_builder/Stakeholders';

    import Requirements from './problem_builder/Requirements';
    import Instruments from './problem_builder/Instruments';
    import MissionAnalysis from './problem_builder/MissionAnalysis';
    import Attributes from './problem_builder/Attributes';
    import Orbits from './problem_builder/Orbits';
    import Measurements from './problem_builder/Measurements';
    import LaunchVehicles from './problem_builder/LaunchVehicles';


    export default {
        name: 'vassar-page',
        data: function () {
            return {
            }
        },
        computed: {
            ...mapState({
                page_selected: state => state.vassarPages.page_selected,
                light_theme: state => state.vassarPages.light_theme,
                message_display: state => state.vassarPages.message_display,
                message_content: state => state.vassarPages.message_content,
                success_message: state => state.vassarPages.success_message,
            }),
            ...mapGetters({
                problems__selected_id: 'problems__problem_selection',
            }),
        },
        methods: {
            async hide_notification() {
                this.$store.commit('set_hide_message');
            },
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
            VassarMenu,

            Groups,
            Problems,
            Stakeholders,
            Requirements,
            Instruments,
            MissionAnalysis,
            Attributes,
            Orbits,
            LaunchVehicles,
            Measurements,
        },
        async mounted() {

            // LOGIN STATUS
            let dataResponse     = await fetchGet(API_URL + 'auth/check-status');
            let auth_information = await dataResponse.json();

            // IF LOGGED IN
            if(auth_information.is_logged_in){

                // GET USER PK FROM: auth_user
                dataResponse         = await fetchPost(API_URL + 'auth/get-user-pk');
                let user_information = await dataResponse.json();

                // SET USER PK
                this.$store.commit('user__set_id', user_information['user_id']);

                // QUERY USER GROUPS
                await this.$store.dispatch('query_groups');
            }



        },
        watch: {
        },
        apollo: {
            Orbit: {
                query: OrbitQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                },
                skip() {
                    if(this.selected_group_id === null){
                        return true;
                    }
                    return false;
                },
            },
            Orbit_Attribute: {
                query: OrbitAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                },
                skip(){
                    if(this.selected_group_id === null){
                        return true;
                    }
                    return false
                },
            },
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