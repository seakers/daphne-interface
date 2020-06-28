<template>
    <div class="problems-container" v-bind:class="{ 'problems-container-light': light_theme}">

        <template v-if="groups__selected_id !== null">
            <table-view :table_object="problems_table" 
                        :foreign_key="groups__selected_id"
            >
            </table-view>
        </template>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import TableView from './table/TableView';
    
    export default {
        name: 'problems',
        data: function () {
            return {
                is_active: false
            }
        },
        computed: {
            ...mapState({
                light_theme : state => state.vassarPages.light_theme,
            }),
            ...mapGetters({
                problems_table: 'problems__problem_table',
                groups__selected_id: 'groups__group_selection',
            }),
        },
        methods: {
        },
        components: {
            TableView
        },
        async mounted() {
        },
        watch: {
        }
    }
</script>




<style lang="scss">








.problems-container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-direction: column !important;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
.problems-container-light {
    background-color: #f2f2f2;
}

.problems-panel{
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 14px 4px #14191f !important;
    align-self: center;
    background-color: #354052;
    transition: box-shadow .35s;
    // transition: background-color .35s;
    // transition: opacity .35s;
}
.pphidden{
    box-shadow: 0px 0px 0px 0px #14191f !important;
    // background-color: #28313e;
    // opacity: 0;
}




.problems-title {
    align-self: center;
    padding: .8em 0em;
    width: 100%;
    text-align: center;
    color: whitesmoke;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}


.problems-table-container{
    padding: 0em .8em .8em .8em;
}





</style>