<template>
    <div class="column is-full-mobile" v-bind:class="sizeClass">
        <section class="panel func-panel" v-bind:class="funcClass">
            <p class="panel-heading">

                <!-- Normal panel-heading when the chosen functionality is NOT Teacher -->
                <template v-if="chosenFunctionality !== 'Teacher'">
                    <span>{{title}}</span>
                    <span style="float:right;">
                        <a href="#" class="reduce-panel" v-bind:class="{ 'has-text-grey': isMinSize }" v-on:click.prevent="reduce"><span class="icon"><span class="fas fa-window-minimize"></span></span></a>
                        <a href="#" class="grow-panel" v-bind:class="{ 'has-text-grey': isMaxSize }" v-on:click.prevent="grow"><span class="icon"><span class="fas fa-window-maximize"></span></span></a>
                        <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fas fa-times"></span></span></a>
                    </span>
                </template>

                <!-- Custom panel-heading when the chosen functionality is Teacher -->
                <template v-if="chosenFunctionality === 'Teacher'">
                    <div style="display: flex; flex-direction: row">
                        <span>{{title}}</span>
                        <div class="buttons has-addons" style="margin-bottom: 0px; padding-left: 8px;">
                            <button v-on:click="enableProactiveTeacher" v-bind:class="{ 'is-success': proactiveTeacher }" class="button is-small" style="margin-bottom: 0px;">On</button>
                            <button v-on:click="disableProactiveTeacher" v-bind:class="{ 'is-danger': reactiveTeacher }" class="button is-small" style="margin-bottom: 0px;">Off</button>
                        </div>
                        <span style="float:right; margin-left: auto;">
                            <a href="#" class="reduce-panel" v-bind:class="{ 'has-text-grey': isMinSize }" v-on:click.prevent="reduce"><span class="icon"><span class="fas fa-window-minimize"></span></span></a>
                            <a href="#" class="grow-panel" v-bind:class="{ 'has-text-grey': isMaxSize }" v-on:click.prevent="grow"><span class="icon"><span class="fas fa-window-maximize"></span></span></a>
                            <a href="#" class="close-panel" v-on:click.prevent="remove"><span class="icon"><span class="fas fa-times"></span></span></a>
                        </span>
                    </div>
                </template>


            </p>
            <component v-bind:is="chosenFunctionality" v-bind:name="name" v-bind:size="size"></component>
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
    import Teacher from './TeacherAgent';

    let sizeScale = [
        'half',
        'full'
    ];

    export default {
        name: 'functionality',
        props: ['name', 'component', 'title', 'funcClass', 'initialSize'],
        data () {
            return {
                size: this.initialSize,
                chosenFunctionality: this.component,

                proactiveTeacher: true, //--> This default value is true (the teacher agent is proactive by default)
                reactiveTeacher: false, //-->
            }
        },
        components: {
            Cheatsheet,
            DesignBuilder,
            DaphneAnswer,
            DataMining,
            EOSSFilter,
            FeatureApplication,
            Teacher,
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
            },


            //--> Is the teacher agent in proactive mode?
            enableProactiveTeacher(){
                if(this.reactiveTeacher === true) {
                    this.proactiveTeacher = true;
                    this.reactiveTeacher = false;
                    this.$store.dispatch('turnProactiveTeacherOn');
                }
            },
            disableProactiveTeacher(){
                if(this.proactiveTeacher === true) {
                    this.proactiveTeacher = false;
                    this.reactiveTeacher = true;
                    this.$store.dispatch('turnProactiveTeacherOff');
                }
            },

        }
    }
</script>

<style scoped>

</style>