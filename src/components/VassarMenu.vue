<template>
    <div class="main">
        <div class="main-elements">
            <h1 class="title is-size-4">Problem Builder</h1>

            <div class="group-selector"  v-bind:class="{ 'group-selector-selected': group_label.label_selected === true }" v-on:click="get_group_page()">
                <p class="menu-label vassar-label" style="margin-bottom: 5px;">Group</p>
                <p class="menu-label vassar-sublabel">{{ group }}</p>
            </div>

            <div class="group-selector" style="margin-top: .8em;"  v-bind:class="{ 'group-selector-selected': problem_label.label_selected === true }" v-on:click="get_problem_page()">
                <p class="menu-label vassar-label" style="margin-bottom: 5px;">Problem</p>
                <p class="menu-label vassar-sublabel">{{ problem }}</p>
            </div>


            <div class="editor-title">
                <p class="menu-label vassar-label">Editor</p>
            </div>

            <div class="editor-menu">
                <p class="menu-label editor-label" v-for="service in editor_pages" :key="service.title" v-on:click="get_service_page(service.id)" v-bind:class="{ 'editor-label-selected': service.selected === true }">{{ service.title }}</p>
            </div>


        </div>
    </div>
</template>





<script>
    import { mapState, mapGetters } from 'vuex';
    import MainMenuItem from './MainMenuItem';
    import * as _ from 'lodash-es';

    export default {
        name: 'vassar-menu',
        data: function () {
            return {
                editor_pages: [
                    { title: 'stakeholders', id: 'stakeholders', selected: false },
                    { title: 'instruments', id: 'instruments', selected: false },
                    { title: 'requirements', id: 'requirements', selected: false },
                    { title: 'mission analysis', id: 'mission analysis', selected: false },
                    { title: 'attributes', id: 'attributes', selected: false },
                ],
            }
        },
        computed: {
                ...mapState({
                        page_selected: state => state.vassarPages.page_selected,
                        group: state => state.groups.selected_group_name,
                        // problem: state => state.problems.selected_problem_name,
                }),
                ...mapGetters({
                        problem: 'problems__get_selected_problem_name',
                }),
                group_label() {
                        let g_label = { 
                                label_selected: false, 
                                id: 'group', 
                                memberships: ['seakers', 'jpl', 'goddard']
                        }
                        if(this.page_selected === 'groups'){
                                g_label.label_selected = true;
                        }
                        return g_label;
                },
                problem_label() {
                        let p_label = { 
                                label_selected: false, 
                                id: 'problem', 
                                memberships: ['SMAP', 'Climate Centric', 'Landsat']
                        }
                        if(this.page_selected === 'problems'){
                                p_label.label_selected = true;
                        }
                        return p_label;
                }
        },
        methods: {
                get_group_page(){
                        this.problem_label.label_selected = false;
                        // Unhighlight editors
                        if (this.editor_pages.find(service => service.selected === true) !== undefined){
                                this.editor_pages.find(service => service.selected === true).selected = false;
                        } 
                        // Highlight group
                        this.group_label.label_selected = true;
                        this.$store.commit('set_page_selected', 'groups');
                },
                get_problem_page(){
                        // Unhighlight group
                        this.group_label.label_selected = false;
                        // Unhighlight editors
                        if (this.editor_pages.find(service => service.selected === true) !== undefined){
                                this.editor_pages.find(service => service.selected === true).selected = false;
                        } 

                        this.problem_label.label_selected = true;
                        this.$store.commit('set_page_selected', 'problems');
                },
                get_service_page(id){
                        console.log(id);
                        // Unhighlight problems and groups
                        this.problem_label.label_selected = false;
                        this.group_label.label_selected = false;
                        // Unhighlight any editor labels
                        if (this.editor_pages.find(service => service.selected === true) !== undefined){
                                this.editor_pages.find(service => service.selected === true).selected = false; 
                        }
                        // Highlight the selected label
                        this.editor_pages.find(service => service.id === id).selected = true;
                        this.$store.commit('set_page_selected', id);
                }


        },


        async mounted() {

        },


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
        word-wrap: break-word;
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
        cursor: pointer;
        transition: .15s linear all;
}
.group-selector:hover {
        padding: 0.5em 0.75em;
        border-radius: 2px;
        background-color: #28313e !important;
        transition: .2s linear all;
        -webkit-box-shadow: inset 0px 0px 3px #14191f;
        -moz-box-shadow: inset 0px 0px 3px #14191f;
        box-shadow: inset 0px 0px 3px #14191f;
}

.group-selector-selected {
        background-color: #28313e !important;
        padding: 0.5em .75em;
        border-radius: 2px;
        transition: .08s linear all;
        -webkit-box-shadow: inset 0px 0px 14px #14191f !important;
        -moz-box-shadow: inset 0px 0px 14px #14191f !important;
        box-shadow: inset 0px 0px 14px #14191f !important;
}



.editor-title{
        margin-top: 1.3em;
        margin-bottom: 0.3em;
        color: whitesmoke;
        font-size: 1.2em;
        font-weight: bold;
}
.editor-menu{
        padding: 0.5em 0em 0.5em 0.5em;
        border-radius: 2px;
        border-style: solid;
        border-width: 0px 0px 0px 1px;
}

.editor-label{
        color: whitesmoke !important;
        font-size: .9em !important;
        padding: 0.5em .75em;
        cursor: pointer;
        transition: .1s linear all;
}

.editor-label:hover {
        padding: 0.5em .75em;
        border-radius: 2px;
        background-color: #28313e !important;
        transition: .15s linear all;
}

.editor-label-selected {
        background-color: #28313e !important;
        padding: 0.5em .75em;
        border-radius: 2px;
}



</style>