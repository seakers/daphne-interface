<template>
    <div class="main">
        <h1 class="title is-size-4">Daphne</h1>
        <main-menu-item
                v-for="(functionality, index) in availableFunctionalities"
                v-bind:name="functionality.name"
                v-bind:text="functionality.title"
                v-bind:icon="functionality.icon"
                v-bind:key="index">
        </main-menu-item>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MainMenuItem from './MainMenuItem';

    export default {
        name: 'main-menu',
        computed: {
            ...mapState({
                availableFunctionalities: state => state.functionalityList.availableFunctionalities
            })
        },
        methods: {
        },
        components: { MainMenuItem }
    }
</script>

<style scoped>

</style>