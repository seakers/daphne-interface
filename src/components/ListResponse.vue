<template>
    <div>
        <p v-html="getResponse['visual_answer'].begin"></p>
        <ul>
            <li v-for="element in getResponse['visual_answer'].list" v-html="element"></li>
        </ul>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'list-response',
        computed: {
            ...mapGetters([
                'getResponse'
            ])
        }
    }
</script>

<style scoped>

</style>