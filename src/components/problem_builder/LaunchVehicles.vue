<template>
    <div class="launch_vehicles-container">
        <div class="button" v-on:click="print_launch_vehicles()"></div>



    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import { LaunchVehicleQuery } from '../../scripts/apollo-queries';
    import TableView from './table/TableView';
    export default {
        name: 'launch_vehicles',
        data: function () {
            return {
                Launch_Vehicle: []
            }
        },
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {
            print_launch_vehicles(){
                console.log(this.Launch_Vehicle);
            }
        },
        components: {
            TableView
        },
        apollo: {
            Launch_Vehicle: {
                query: LaunchVehicleQuery,
            },
        },
        async mounted() {

        },
        watch: {

        },
    }
</script>



<style lang="scss">
.launch_vehicles-container{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: row;
}

.launch_vehicles-details{
    display: flex;
}
</style>