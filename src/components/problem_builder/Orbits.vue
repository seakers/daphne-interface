<template>
    <div class="orbits-container">
            
        
        <orbit-library 
            :orbit_rows="orbit_rows" 
            v-on:orbit-selected="set_selected_orbit" 
            v-on:display-attribute-library="display_attribute_library" 
            v-on:refresh-orbit-query="refresh_orbit_query"
            v-if="!display_attribute_lib"
        >
        </orbit-library>

        <orbit-attribute-library 
            :orbit_object="selected_orbit" 
            :all_orbit_attributes="orbit_attribute_rows" 
            v-on:display-orbit-library="display_orbit_library"
            v-on:refresh-attribute-query="refresh_attribute_query"
            v-if="display_attribute_lib"
        >
        </orbit-attribute-library>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import { OrbitQuery, OrbitAttributeQuery} from '../../scripts/orbit-queries';
    import * as _ from 'lodash-es';


    import OrbitLibrary from './library/OrbitLibrary';
    import OrbitAttributeLibrary from './library/OrbitAttributeLibrary';

    export default {
        name: 'orbits',
        data: function () {
            return {
                Orbit: [],
                Orbit_Attribute: [],

                orbit_rows: [],
                orbit_attribute_rows: [],

                selected_orbit: {},
                has_selection: false,

                display_attribute_lib: false,
            }
        },
        computed: {
            ...mapState({
            }),
            ...mapGetters({
                selected_group_id: 'get_group_id',
            }),
            fixed_group_id() {
                if(this.selected_group_id === null){
                    return 1;
                }
                return this.selected_group_id;
            }
        },
        methods: {
            set_selected_orbit(orbit_selection){
                console.log("---> ORBIT SELECT PARENT!!!!", orbit_selection);
                if(_.isEmpty(orbit_selection)){
                    this.has_selection = false;
                }
                else{
                    this.has_selection = true;
                }
                this.selected_orbit = orbit_selection;
            },
            display_attribute_library(){
                this.display_attribute_lib = true;
            },
            display_orbit_library(){
                this.display_attribute_lib = false;
            },

            refresh_orbit_query(){
                console.log("---> ORBIT REFETCH QUERIES");
                this.$apollo.queries.Orbit.refetch();
                this.$apollo.queries.Orbit_Attribute.refetch();
            },

            refresh_attribute_query(){
                console.log("---> ORBIT ATTRIBUTE REFETCH QUERIES");
                this.$apollo.queries.Orbit_Attribute.refetch();
                this.$apollo.queries.Orbit.refetch();
            }


        },
        components: {
            OrbitLibrary,
            OrbitAttributeLibrary
        },
        apollo: {
            Orbit: {
                query: OrbitQuery,
                skip() {
                    if(this.selected_group_id === null){
                        return true;
                    }
                    return false;
                },
                variables() {
                    return {
                        selected_group_id: this.fixed_group_id,
                    }
                },
            },
            Orbit_Attribute: {
                query: OrbitAttributeQuery,
                skip() {
                    if(this.selected_group_id === null){
                        return true;
                    }
                    return false;
                },
                variables() {
                    return {
                        selected_group_id: this.fixed_group_id,
                    }
                }
            },
        },
        async mounted() {
            this.$apollo.queries.Orbit.refetch();
        },
        watch: {
            Orbit() {
                this.orbit_rows = [];
                console.log("---> Orbit Query", this.Orbit);
                for(let x=0;x<this.Orbit.length;x++){
                    let row = _.cloneDeep(this.Orbit[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.orbit_rows.push(row);
                }
            },
            Orbit_Attribute() {
                this.orbit_attribute_rows = [];
                for(let x=0;x<this.Orbit_Attribute.length;x++){
                    let row = _.cloneDeep(this.Orbit_Attribute[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    row['has_accepted'] = (this.Orbit_Attribute[x].Join__Orbit_Attribute_Values.length > 0);
                    this.orbit_attribute_rows.push(row);
                }
            }
        }
    }




    // SET_LANGUAGES (state, { languages }) {
    // const ids = languages.map(x => x.id)
    // for (let id in ids) {
    //   if (!state.languageIds.includes(ids[id])) {
    //     state.languageIds.push(ids[id])
    //   }
    // }
</script>



<style lang="scss">

.orbits-panel{
    display: flex;
    flex-grow: 0.75;
    margin: 1em 3em;
    flex-direction: column;
    align-items: flex-start;
    height: 80vh;
    background-color: #fff;
    border-radius: 6px;
}


.orbit-library-title{
    display: flex;
    padding-top: 3vw;
    padding-left: 2vw;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 1.4em;
    font-weight: bold;
}

.orbit-library-select{
    display: flex;
    max-height: 43vh;
    overflow-y: auto;
    margin-top: 3vh;
    margin-left: 2vw;
}

.orbit-edit-btns{
    display: flex;
    margin-left: 2vw;
    margin-top: 1vw;
}

.orbit-operations{
    display: flex;
    align-self: flex-end;
    align-items: flex-end;
    flex-grow: 1;
    margin-right: 2vw;
    margin-bottom: 3vw;
}

.orbit-library-item{
    padding: 0.3em 0.75em !important;
    cursor: pointer;
}

.orbit-selected{
    background-color: #606B7D;
    color: #fff;
}


</style>