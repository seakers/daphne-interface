<template>
    <p>{{ getResponse['visual_answer'] }}</p>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'text-response',
        computed: {
            ...mapGetters([
                'getResponse'
            ])
        }
    }
</script>

<style scoped>

</style>