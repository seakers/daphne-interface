<template>

    <div>
        <vue-plotly :data="level_one_design_space_plot" :layout="level_one_design_space_plot_layout" :options="{displayModeBar: false}"/>
    </div>

</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import VuePlotly from '@statnett/vue-plotly'
    export default {
        name: "DesignSpacePlot",
        components: {
            VuePlotly
        },
        computed: {

            ...mapGetters({
                level_one_design_space_plot: 'get_level_one_design_space_plot',
                level_one_design_space_plot_layout: 'get_level_one_design_space_plot_layout',
            }),
        },
    }
</script>

<style scoped>

</style>