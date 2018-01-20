<template>
    <div class="column is-full-mobile" v-bind:class="sizeClass">
        <section class="panel func-panel cheatsheet">
            <p class="panel-heading">
                <span>{{name}}</span>
                <span style="float:right;">
                    <a href="#" class="reduce-panel has-text-grey"><span class="icon"><span class="fa fa-window-minimize"></span></span></a>
                    <a href="#" class="grow-panel"><span class="icon"><span class="fa fa-window-maximize"></span></span></a>
                    <a href="#" class="close-panel"><span class="icon"><span class="fa fa-times"></span></span></a>
                </span>
            </p>
            <component v-bind:is="chosenFunctionality"></component>
        </section>
    </div>
</template>

<script>
    import Cheatsheet from './Cheatsheet';

    export default {
        name: "functionality",
        props: ['name', 'initialSize'],
        data () {
            return {
                size: this.initialSize,
                chosenFunctionality: this.name
            }
        },
        components: {
            Cheatsheet
        },
        computed: {
            sizeClass: function () {
                return 'is-' + this.size + '-desktop';
            }
        }
    }
</script>

<style scoped>

</style>