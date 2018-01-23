<template>
    <div class="columns is-mobile is-multiline" id="functionalities_list">
        <functionality
            v-for="functionality in functionalities"
            v-bind:name="functionality.name"
            v-bind:title="functionality.title"
            v-bind:initial-size="functionality.initialSize"
            v-bind:key="functionality.id">
        </functionality>
    </div>
</template>

<script>
    import Functionality from './Functionality';
    import { mapState } from 'vuex';

    export default {
        components: {Functionality},
        name: 'functionality-list',
        data () {
            return {
            };
        },
        computed: {
            ...mapState({
                functionalities: state => state.functionalityList.functionalities
            })
        }
    }
</script>

<style scoped>

</style>