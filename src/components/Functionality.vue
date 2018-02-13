<template>
    <div class="column is-full-mobile" v-bind:class="sizeClass">
        <section class="panel func-panel cheatsheet">
            <p class="panel-heading">
                <span>{{title}}</span>
                <span style="float:right;">
                    <a href="#" class="reduce-panel" v-bind:class="{ 'has-text-grey': isMinSize }" v-on:click.prevent="reduce"><span class="icon"><span class="fa fa-window-minimize"></span></span></a>
                    <a href="#" class="grow-panel" v-bind:class="{ 'has-text-grey': isMaxSize }" v-on:click.prevent="grow"><span class="icon"><span class="fa fa-window-maximize"></span></span></a>
                    <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fa fa-times"></span></span></a>
                </span>
            </p>
            <component v-bind:is="chosenFunctionality"></component>
        </section>
    </div>
</template>

<script>
    import Cheatsheet from './Cheatsheet';
    import DesignBuilder from './DesignBuilder';
    import DaphneAnswer from './DaphneAnswer';
    import DataMining from './DataMining';
    import EOSSFilter from './EOSSFilter';
    import FeatureApplication from './FeatureApplication';

    let sizeScale = [
        'one-third',
        'two-thirds',
        'full'
    ];

    export default {
        name: 'functionality',
        props: ['name', 'title', 'initialSize'],
        data () {
            return {
                size: this.initialSize,
                chosenFunctionality: this.name
            }
        },
        components: {
            Cheatsheet,
            DesignBuilder,
            DaphneAnswer,
            DataMining,
            EOSSFilter,
            FeatureApplication
        },
        computed: {
            sizeClass: function () {
                return 'is-' + this.size + '-desktop';
            },
            isMinSize: function () {
                return this.size === this.initialSize;
            },
            isMaxSize: function () {
                return this.size === sizeScale[sizeScale.length - 1];
            }
        },
        methods: {
            remove: function() {
                this.$store.commit('closeFunctionality', this.$vnode.key);
                // PubSub.publish(functionality + '_removed', funcId);
            },
            reduce: function() {
                if (!this.isMinSize) {
                    // Make column smaller
                    this.size = sizeScale[sizeScale.indexOf(this.size) - 1];
                }
            },
            grow: function() {
                if (!this.isMaxSize) {
                    // Make column bigger
                    this.size = sizeScale[sizeScale.indexOf(this.size) + 1];
                }
            }
        }
    }
</script>

<style scoped>

</style>