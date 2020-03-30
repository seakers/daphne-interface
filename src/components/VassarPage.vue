<template>
    <div class="wrapper">
        <div class="columns">

            <aside class="column is-2 aside hero is-fullheight is-hidden-mobile">
                <div class="aside-container">
                    <vassar-menu></vassar-menu>
                </div>
            </aside>


            <div class="column is-10 editor-background hero">


                <template v-if="page_selected === 'groups'">
                    <groups></groups>
                </template>


                <template v-if="page_selected === 'problems'">
                    <problems></problems>
                </template>

                <template v-if="page_selected === 'stakeholders'">
                    <stakeholders></stakeholders>
                </template>
                



            </div>
        </div>

    </div>
</template>



<script>
    import { mapState } from 'vuex';
    import { fetchGet, fetchPost} from '../scripts/fetch-helpers';
    import VassarMenu from './VassarMenu';

    import Groups from './problem_builder/Groups';
    import Problems from './problem_builder/Problems';
    import Stakeholders from './problem_builder/Stakeholders';

    export default {
        name: 'vassar-page',
        data: function () {
            return {
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

            Groups,
            Problems,
            Stakeholders
        },
        async mounted() {
            // Check if the user is logged in
            let dataResponse = await fetchGet(API_URL + 'auth/check-status');
            let auth_information = await dataResponse.json();
            console.log("Login Status:", auth_information.is_logged_in);
            
            // Get the user's private key
            if(auth_information.is_logged_in){
                dataResponse = await fetchPost(API_URL + 'auth/get-user-pk');
                let user_information = await dataResponse.json();

                // Set user id
                this.$store.commit('set_user_id', user_information['user_id']);
                console.log("USER ID", user_information['user_id']);
                await this.$store.dispatch('groups__query');
                await this.$store.dispatch('problems__query');
            }



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

.editor-background {
    display: flex;
    background-color: #28313e;
    -webkit-box-shadow: inset 0px 0px 3px #14191f;
    -moz-box-shadow: inset 0px 0px 3px #14191f;
    box-shadow: inset 0px 0px 14px #14191f;
}



// Transitions






















</style>