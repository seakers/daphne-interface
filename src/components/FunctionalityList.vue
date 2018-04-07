<template>
    <draggable id="functionalities-list" class="columns is-mobile is-multiline" v-bind:options="funcListOptions">
        <functionality
                v-for="functionality in functionalities"
                v-bind:name="functionality.name"
                v-bind:component="functionality.component"
                v-bind:title="functionality.title"
                v-bind:func-class="functionality.funcClass"
                v-bind:initial-size="functionality.initialSize"
                v-bind:key="functionality.id">
        </functionality>
    </draggable>
</template>

<script>
    import Functionality from './Functionality';
    import { mapState } from 'vuex';
    import draggable from 'vuedraggable';

    export default {
        components: {
            draggable,
            Functionality
        },
        name: 'functionality-list',
        data () {
            return {
                funcListOptions: {
                    group: {
                        name: 'functionality_list',
                        pull: false,
                        put: false
                    },
                    handle: '.panel-heading',
                    animation: 150
                }
            };
        },
        computed: {
            ...mapState({
                functionalities: state => state.functionalityList.functionalities
            })
        }
    }
</script>

<style scoped></style>