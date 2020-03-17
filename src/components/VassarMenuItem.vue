<template>
    <a href="#" class="item" v-bind:class="{ active: isActive }" v-on:click.prevent="addVassarFunctionality"><span class="icon"><span class="fas" v-bind:class="icon"></span></span><span class="name">{{ text }}</span></a>
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
            addVassarFunctionality() {
                this.$store.commit('addVassarFunctionality', { functionality: this.name, funcData: null });
            }
        }
    }
</script>

<style scoped>

</style>