<template>
    <div class="orbits-library-panel">
            
        <!-- HEADER -->
        <div class="orbit-library-title">
            <p>Orbit Attribute Library</p>
        </div>

        <div class="orbit-library-orbit">
            <p>{{ orbit_object.name }}</p>
        </div>

        <!-- BODY -->
        <div class="orbit-library-body">

            <!-- LOCAL ATTRIBUTES -->
            <div class="orbit-local-attributes">
                <div v-for="(row, index_row) in local_attribute_rows" :key="index_row">
                    <div class="single-local-attribute" v-bind:class="{ 'orbit-selected': row.selected }" v-on:click="select_local_attribute(index_row)">
                        <div>{{ row.name }}</div>

                        <div>{{ row.value }}</div>
                        <!-- <div v-if="row.has_accepted">
                            <select v-model="row.value">
                                <option v-for="option in row.accepted_values" v-bind:value="option.Accepted_Value.value" :key="option.Accepted_Value.value">
                                    {{ option.Accepted_Value.value }}
                                </option>
                            </select>
                        </div>
                        <div v-if="!row.has_accepted"><input v-model="row.value" placeholder="value..."></div> -->
                    </div>
                </div>
            </div>

            <!-- ADD / REMOVE ATTRIBUTES -->
            <div class="orbit-attribute-operations">
                <button class="button" v-on:click="add_attribute()" style="margin: 3px;" :disabled="!global_attribute_selected">
                    <span class="icon">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
                </button>
                <button class="button" v-on:click="remove_attribute()" style="margin: 3px;" :disabled="!local_attribute_selected">
                    <span class="icon">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    </span>
                </button>
            </div>

            <!-- GLOBAL ATTRIBUTES -->
            <div class="orbit-global-attributes">
                <div v-for="(row, index_row) in global_attribute_rows" :key="index_row">
                    <div class="single-local-attribute" v-bind:class="{ 'orbit-selected': row.selected }" v-on:click="select_global_attribute(index_row)">
                        <div>{{ row.name }}</div>
                        <div>{{ row.slot_type }}</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- EDIT ATTRIBUTE -->
        <div class="orbit-edit-btns">
            <button class="button is-warning" v-on:click="set_attribute_value()" :disabled="!local_attribute_selected">
                Edit Attribute
            </button>
        </div>

        <!-- ORBIT OPERATIONS -->
        <div class="orbit-operations">
            <button class="button is-info" style="margin: 5px;" v-on:click="display_orbit_library()">
                Return to Orbit Library
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_orbit_attribute()">
                Delete Attribute
            </button>
            <button class="button is-primary" style="margin: 5px;" v-on:click="new_orbit_attribute()">
                New Attribute
            </button>
        </div>



        <!-- AND NEW ORBIT ATTRIBUTE -->
        <set-orbit-attribute
                :isActive="add_attribute_modal"
                :update="false"
                :local_attribute="global_attribute_selected_obj"
                :orbit_id="this.orbit_object.id"
                v-on:close-modal="close_add_attribute_modal()"
        ></set-orbit-attribute>

        <!-- UPDATE ORBIT ATTRIBUTE VALUE -->
        <set-orbit-attribute
                :isActive="set_attribute_modal"
                :update="true"
                :local_attribute="local_attribute_selected_obj"
                v-on:close-modal="close_set_attribute_modal()"
        ></set-orbit-attribute>

        <orbit-attribute
                :isActive="new_attribute_modal"
                v-on:close-modal="close_new_attribute_modal()"
        ></orbit-attribute>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import { OrbitSpecificAttributeQuery, DeleteLocalOrbitAttribute, DeleteGlobalOrbitAttribute } from '../../../scripts/orbit-queries';

    // COMPONENTS
    import OrbitAttribute from './modals/orbit/OrbitAttribute';
    import SetOrbitAttribute from './modals/orbit/SetOrbitAttribute';

    export default {

        name: 'orbit-attribute-library',
        data: function () {
            return {
                orbit_id: false,
                orbit_name: '',

                // MODALS
                new_attribute_modal: false,
                set_attribute_modal: false,
                add_attribute_modal: false,

                Join__Orbit_Attribute: [],
                Orbit: [],
                local_attribute_rows: [],
                global_attribute_rows: [],

                local_attribute_selected: false,
                local_attribute_selected_obj: false,

                global_attribute_selected: false,
                global_attribute_selected_obj: false,

                

            }
        },
        props: ['orbit_object', 'all_orbit_attributes'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            // ---> ADD ATTRIBUTE
            add_attribute(){
                console.log("---> ADDING ATTRIBUTE");
                this.add_attribute_modal = true;
            },
            close_add_attribute_modal(){
                this.add_attribute_modal = false;
                this.$apollo.queries.Orbit.refetch();
            },


            // ---> NEW ATTRIBUTE
            new_orbit_attribute(){
                this.new_attribute_modal = true;
            },
            close_new_attribute_modal(){
                this.new_attribute_modal = false;
                this.$emit("refresh-attribute-query");
                this.$apollo.queries.Orbit.refetch();
            },


            // ---> SET ATTRIBUTE VALUE
            set_attribute_value() {
                console.log("--> open set vlaue modal");
                this.set_attribute_modal = true;
            },
            close_set_attribute_modal(){
                this.set_attribute_modal = false;
                this.$apollo.queries.Orbit.refetch();
            },

            // ---> REMOVE ATTRIBUTE
            async remove_attribute(){
                console.log("---> REMOVING ATTRIBUTE", this.local_attribute_selected_obj);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteLocalOrbitAttribute,

                    variables: {
                        orbit_attribute_join_id: this.local_attribute_selected_obj.join_id,
                    },

                    update: (cache, { data: { delete_orbit_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit_attr);
                    },
                });
                console.log("---> ATTRIBUTE DEL OPS", del_orb_attribute);
                this.$apollo.queries.Orbit.refetch();
            },

            // --> DELETE ORBIT ATTRIBUTE
            async delete_orbit_attribute() {
                console.log("---> DELETING ORBIT ATTRIBUTE", this.global_attribute_selected_obj);

                let del_global_attribute = await this.$apollo.mutate({
                    mutation: DeleteGlobalOrbitAttribute,

                    variables: {
                        orbit_attribute_id: this.global_attribute_selected_obj.id,
                    },

                    update: (cache, { data: { delete_orbit_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit_attr);
                    },
                });
                console.log("---> DELETING GLOBAL ATTRIBUTE", del_global_attribute);
                this.$emit("refresh-attribute-query");
            },


            // LOCAL ATTRIBUTES
            select_local_attribute(index){
                let toggle = this.local_attribute_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT LOCAL");
                    this.unselect_local_attributes();
                    this.local_attribute_selected = false;
                    this.local_attribute_selected_obj = false;
                }
                else{  // SELECT
                    console.log("SELECT LOCAL");
                    this.unselect_local_attributes();
                    Vue.set(this.local_attribute_rows[index], 'selected', true);
                    this.local_attribute_selected = true;
                    this.local_attribute_selected_obj = this.local_attribute_rows[index];
                }

            },

            unselect_local_attributes(){
                console.log("---> LOCAL ATTRIBUTES UNSELECTED");
                for(let x=0;x<this.local_attribute_rows.length; x++){
                    Vue.set(this.local_attribute_rows[x], 'selected', false);
                }
            },


            // GLOBAL ATTRIBUTES
            select_global_attribute(index){
                let toggle = this.global_attribute_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT GLOBAL");
                    this.unselect_global_attributes();
                    this.global_attribute_selected = false;
                    this.global_attribute_selected_obj = false;
                }
                else{  // SELECT
                    console.log("SELECT GLOBAL", this.global_attribute_rows[index]);
                    this.unselect_global_attributes();
                    Vue.set(this.global_attribute_rows[index], 'selected', true);
                    this.global_attribute_selected = true;
                    this.global_attribute_selected_obj = this.global_attribute_rows[index];
                }

            },
            unselect_global_attributes(){
                console.log("---> GLOBAL ATTRIBUTES UNSELECTED");
                for(let x=0;x<this.global_attribute_rows.length; x++){
                    Vue.set(this.global_attribute_rows[x], 'selected', false);
                }
            },


            display_orbit_library() {
                this.$emit('display-orbit-library', {});
            }
        },
        components: {
            OrbitAttribute,
            SetOrbitAttribute,
        },
        apollo: {
            Orbit: {
                query: OrbitSpecificAttributeQuery,
                variables() {
                    return {
                        orbit_id: this.orbit_object.id,
                        problem_id: 3,
                    }
                }
            },
        },
        watch: {
            orbit_object() {
                this.orbit_id = this.orbit_object.id;
                this.orbit_name = this.orbit_object.name;
            },
            all_orbit_attributes(){
                console.log("---> GLOBAL ORBIT ATTRIBUTES", this.all_orbit_attributes);
                this.global_attribute_rows = [];
                for(let x=0;x<this.all_orbit_attributes.length;x++){
                    this.global_attribute_rows.push(_.cloneDeep(this.all_orbit_attributes[x]));
                }
            },
            Orbit(){
                this.local_attribute_rows = [];
                for(let x=0;x<this.Orbit[0].Join__Orbit_Attributes.length;x++){
                    let row = {};
                    
                    row.orbit_id = this.Orbit[0].id;
                    row.join_id = this.Orbit[0].Join__Orbit_Attributes[x].id;
                    row.id = this.Orbit[0].Join__Orbit_Attributes[x].Orbit_Attribute.id;
                    row.name = this.Orbit[0].Join__Orbit_Attributes[x].Orbit_Attribute.name;
                    row.type = this.Orbit[0].Join__Orbit_Attributes[x].Orbit_Attribute.type;
                    row.slot_type = this.Orbit[0].Join__Orbit_Attributes[x].Orbit_Attribute.slot_type;
                    
                    row.value = this.Orbit[0].Join__Orbit_Attributes[x].value;
                    
                    row.accepted_values = this.Orbit[0].Join__Orbit_Attributes[x].Orbit_Attribute.Join__Orbit_Attribute_Values;
                    if(row.accepted_values.length == 0){
                        row.has_accepted = false;
                    }
                    else {
                        row.has_accepted = true;
                    }
                    row.selected = false;
                    row.hidden = false;
                    this.local_attribute_rows.push(row);
                }
                console.log("---> LOCAL ORBIT ATTRIBUTES", this.local_attribute_rows);
            }
        },
        mounted() {
            this.global_attribute_rows = [];
            for(let x=0;x<this.all_orbit_attributes.length;x++){
                this.global_attribute_rows.push(_.cloneDeep(this.all_orbit_attributes[x]));
            }
        }
    }



</script>



<style lang="scss">

.orbits-library-panel{
    display: flex;
    flex-grow: 0.75;
    margin: 1em 3em;
    flex-direction: column;
    align-items: stretch;
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

.orbit-library-orbit{
    display: flex;
    padding-top: 3vw;
    padding-left: 2vw;
    letter-spacing: 0.1em;
    font-size: 1.2em;
    font-weight: bold;
}

.orbit-library-body{
    display: flex;
    max-height: 45vh;
    overflow-y: auto;
    margin-left: 2vw;
}






.single-global-attribute{
    display: flex;
    padding: 2px 10px;
    cursor: pointer;
}

.single-local-attribute{
    display: flex;
    padding: 2px 10px;
    cursor: pointer;
    justify-content: space-between;
}

.single-attribute-selected{
    background-color: #606B7D;
    color: #fff;
}




.orbit-local-attributes{
    display: flex;
    margin-top: 1vh;
    flex-grow: 1;
    background-color: #f4f4f4;
    border-radius: 5px;
    flex-direction: column;
    overflow-y: auto;
}

.orbit-attribute-operations{
    display: flex;
    align-self: stretch;
    align-items: center;
    margin-top: 1vh;
    width: 8vw;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}

.orbit-global-attributes{
    display: flex;
    margin-top: 1vh;
    flex-grow: 1;
    background-color: #f4f4f4;
    border-radius: 5px;
    margin-right: 2vw;
    flex-direction: column;
    overflow-y: auto;
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