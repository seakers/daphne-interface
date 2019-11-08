<template>
    <a href="#" class="item" v-bind:class="{ active: isActive }" v-on:click.prevent="addFunctionality"><span class="icon"><span class="fas" v-bind:class="icon"></span></span><span class="name">{{ text }}</span></a>
</template>

<script>
    export default {
        name: 'main-menu-item',
        props: ['name', 'text', 'icon'],
        computed: {
            isActive() {
                return this.$store.state.functionalityList.functionalityCount[this.name] > 0;
            }
        },
        methods: {
            addFunctionality() {
                this.$store.commit('addFunctionality', this.name);
            }
        }
    }
</script>

<style scoped>

</style>