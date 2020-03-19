<template>
    <div class="main">
        <div class="main-elements">
            <h1 class="title is-size-4">Problem Builder</h1>

            <div class="group-selector">
                <p class="menu-label vassar-label" style="margin-bottom: 5px;">Group</p>
                <p class="menu-label vassar-sublabel">Seakers</p>
            </div>

            <div class="group-selector" style="margin-top: .8em;">
                <p class="menu-label vassar-label" style="margin-bottom: 5px;">Problem</p>
                <p class="menu-label vassar-sublabel">SMAP</p>
            </div>


            <div class="editor-title">
                <p class="menu-label vassar-label">Editor</p>
            </div>
            <div class="editor-menu">
                <p class="menu-label editor-label">Stakeholders</p>
                <p class="menu-label editor-label">Instruments</p>
                <p class="menu-label editor-label">Requirement Rules</p>
                <p class="menu-label editor-label">Mission Analysis</p>
                <p class="menu-label editor-label">Attributes</p>
            </div>


        </div>
    </div>
</template>





<script>
    import { mapState } from 'vuex';
    import MainMenuItem from './MainMenuItem';
    import * as _ from 'lodash-es';

    export default {
        name: 'vassar-menu',
        computed: {},
        methods: {},
    }
</script>






<style lang="scss">
p.vassar-label {
        color: whitesmoke;
        font-size: 1em;
}

p.vassar-sublabel {
        // color: whitesmoke;
        font-size: .8em;
        padding-left: 15px;
        margin-top: 0px !important;
}

a.vassar-link {
        color: whitesmoke !important;
        font-size: 0.9em;
}

a.vassar-link:hover {
        color: whitesmoke !important;
        background-color: #28313e !important;
        font-size: 0.9em;
}

.group-selector {
        padding: 0.5em 0.75em;
        border-radius: 2px;
}
.group-selector:hover {
        padding: 0.5em 0.75em;
        border-radius: 2px;
        background-color: #28313e !important;
}


.editor-title{
        margin-top: 1.3em;
        margin-bottom: 0.3em;
        color: whitesmoke;
        font-size: 1.2em;
        font-weight: bold;
}
.editor-menu{
        padding: 0.5em 0em;
        border-radius: 2px;

}

.editor-label{
        color: whitesmoke !important;
        font-size: .9em !important;
        padding: 0.5em .75em;
}

.editor-label:hover {
        padding: 0.5em .75em;
        border-radius: 2px;
        background-color: #28313e !important;
}



</style>