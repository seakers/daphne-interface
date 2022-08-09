<template>
    <div class="main">
        <div class="main-elements">
            <h1 class="title is-size-4">Problem Builder</h1>


            <!-- THEME -->
            <button class="button is-small theme-button" v-bind:class="[ light_theme ? 'theme-button-light' : 'theme-button-dark' ]" v-on:click="change_theme()">
                <i class="fas fa-moon"></i>
            </button>


            <!-- GLOBAL MENU ITEMS -->
            <div v-for="(menu_item_obj, key, index) in global_menu_items" :key="index" style="padding: 0.25em 0em;">
                <div class="group-selector"  v-bind:class="{ 'group-selector-selected': menu_item_obj.selected === true }" v-on:click="select_page(menu_item_obj)">
                    <p class="menu-label vassar-label" style="margin-bottom: 5px;">{{ menu_item_obj.label }}</p>
                    <p class="menu-label vassar-sublabel">{{ menu_item_obj.sublabel }}</p>
                </div>
            </div>



            <!-- LIBRARY MENU ITEMS -->
            <div class="editor-title">
                <div v-if="groups_table.selected_id === null" class="unselected-problem-label">
                    <i class="fas fa-caret-right" style="height: min-content; padding-right: 18px;"></i>
                    <p class="">No group selected</p>
                </div>

                <div v-if="groups_table.selected_id !== null" class="selected-problem-label" v-on:click="toggle_library()">
                    <i v-if="library_expanded === true" class="fas fa-caret-down" style="height: min-content; padding-right: 13px;"></i>
                    <i v-if="library_expanded !== true" class="fas fa-caret-right" style="height: min-content; padding-right: 18px;"></i>
                    <p class="" >Libraries</p>
                </div>
            </div>

            <div v-if="groups_table.selected_id !== null && library_expanded === true" class="editor-menu">
                <div v-for="(menu_item_obj, key, index) in library_menu_items" :key="index">
                    <p class="menu-label editor-label" v-bind:class="{ 'editor-label-selected': menu_item_obj.selected === true }" v-on:click="select_page(menu_item_obj)">{{ menu_item_obj.label }}</p>
                </div>
            </div>



            <!-- PROBLEM EDITOR -->
            <div class="editor-title">
                <div v-if="problems_table.selected_name === null" class="unselected-problem-label">
                    <i class="fas fa-caret-right" style="height: min-content; padding-right: 18px;"></i>
                    <p class="">No problem selected</p>
                </div>

                <div v-if="problems_table.selected_name !== null" class="selected-problem-label" v-on:click="toggle_editor()">
                    <i v-if="editor_expanded === true" class="fas fa-caret-down" style="height: min-content; padding-right: 13px;"></i>
                    <i v-if="editor_expanded !== true" class="fas fa-caret-right" style="height: min-content; padding-right: 18px;"></i>
                    <p class="">{{ problems_table.selected_name }}</p>
                </div>
            </div>

            <div v-if="problems_table.selected_name !== null && editor_expanded === true" class="editor-menu">
                <div v-for="(menu_item_obj, key, index) in problem_menu_items" :key="index">
                    <p class="menu-label editor-label" v-bind:class="{ 'editor-label-selected': menu_item_obj.selected === true }" v-on:click="select_page(menu_item_obj)">{{ menu_item_obj.label }}</p>
                </div>
            </div>
            <!-- PROBLEM EDITOR -->

            


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
                global_menu_items: {
                    group:       { selected: true, label: 'groups', sublabel: ''},
                    problem:     { selected: false, label: 'problems', sublabel: '' }
                },
                library_menu_items: {
                    instruments:          { selected: false, label: 'instruments', sublabel: '' },
                    measurements:         { selected: false, label: 'measurements', sublabel: '' },
                    orbits:               { selected: false, label: 'orbits', sublabel: '' },
                    launch_vehicles:      { selected: false, label: 'launch vehicles', sublabel: '' },
                },
                problem_menu_items: {
                    stakeholders: { selected: false, label: 'stakeholders' },
                    requirements: { selected: false, label: 'requirements' },
                    // mission:      { selected: false, label: 'mission' },
                },
            
                editor_expanded: true,
                library_expanded: true,
            }
        },
        computed: {
                ...mapState({
                        page_selected: state => state.vassarPages.page_selected,
                        light_theme: state => state.vassarPages.light_theme,
                }),
                ...mapGetters({
                        problem: 'problems__get_selected_problem_name',
                        groups_table: 'groups__group_table',
                        problems_table: 'problems__problem_table',
                        selected_problem_name: 'problems__problem_selection_name',

                        selected_group_id: 'groups__group_selection',
                        selected_group_name: 'groups__group_selection_name',
                }),
        },
        methods: {
                unselect_all(){
                    let global_keys = Object.keys(this.global_menu_items);
                    for(let x=0;x<global_keys.length;x++){
                        this.global_menu_items[global_keys[x]].selected = false;
                    }
                    let problem_keys = Object.keys(this.problem_menu_items);
                    for(let x=0;x<problem_keys.length;x++){
                        this.problem_menu_items[problem_keys[x]].selected = false;
                    }
                    let library_keys = Object.keys(this.library_menu_items);
                    for(let x=0;x<library_keys.length;x++){
                        this.library_menu_items[library_keys[x]].selected = false;
                    }
                },
                select_page(menu_item_obj) {
                    this.unselect_all();
                    menu_item_obj.selected = true;
                    this.$store.commit('set_page_selected', menu_item_obj.label);
                },
                change_theme(){
                    this.$store.commit('set_theme');
                },
                toggle_editor(){
                    this.editor_expanded = !this.editor_expanded;
                },
                toggle_library(){
                    this.library_expanded = !this.library_expanded;
                }
        },
        watch: {
                selected_group_name: function(val, oldVal) {
                    this.global_menu_items.group.sublabel = this.selected_group_name;
                },
                selected_problem_name: function(val, oldVal) {
                    this.global_menu_items.problem.sublabel = this.selected_problem_name;
                },
        },


        async mounted() {

        },


    }
</script>




<style lang="scss">





.theme-button{
    background-color: #28313e;
    margin-bottom: 10px;
}

.theme-button:hover{
    background-color: #28313e !important;
    transition: .2s linear all;
    -webkit-box-shadow: inset 0px 0px 3px #14191f;
    -moz-box-shadow: inset 0px 0px 3px #14191f;
    box-shadow: inset 0px 0px 3px #14191f;
}

button:focus {outline:0;}

.theme-button-light{
    background-color: #354052 !important;
    border: none !important;
    color: whitesmoke !important;
    font-size: .9em !important;
    font-weight: 400;
    line-height: 1.5 !important;
    letter-spacing: .1em;
    
}

.theme-button-dark{
    background-color: #354052 !important;
    border: none !important;
    color: whitesmoke !important;
    font-size: .9em !important;
    font-weight: 400;
    line-height: 1.5 !important;
    letter-spacing: .1em;
    box-shadow: inset 0px 0px 14px #14191f !important;
    
}





// TODO

.unselected-problem-label{
    color: #7a7a7a;
    font-size: 1em;
    letter-spacing: 0.1em;
    display: flex;
    flex-direction: row;
    align-items: center;

}

.selected-problem-label{
    color: whitesmoke;
    font-size: 1em;
    letter-spacing: 0.1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;


}










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