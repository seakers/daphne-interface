<template>
    <div>
        Mastery
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "estimation-methods",
    components: {

    },
    data: function () {
        return {

        }
    },
    computed: {
        ...mapState({
            user_id: state => state.adaptiveTestingPages.user_id
        }),
    },
    methods: {

    },

    watch: {

    },
    async mounted(){

    }
}
</script>

<style scoped>

</style>