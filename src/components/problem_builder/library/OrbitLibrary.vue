<template>
    <div class="orbits-panel">
            
        <!-- HEADER -->
        <div class="orbit-library-title">
            <p>Orbit Library</p>
        </div>

        <!-- ORBITS -->
        <div class="orbit-library-select">
            <table class="table" style="width: 43vw; background-color: #f6f6f9;">

                <tbody>
                    <tr v-for="(row, index_row) in orbit_rows" :key="index_row" v-on:click="select_orbit(index_row)">
                        <td class="orbit-library-item" v-bind:class="{ 'orbit-selected': row.selected }">{{row.name}} </td>
                    </tr>
                </tbody>
                
            </table>
        </div>

        <!-- EDIT ORBIT -->
        <div class="orbit-edit-btns">
            <button class="button is-warning" v-on:click="edit_attributes()" :disabled="!orbit_selected">
                Edit Attributes
            </button>
        </div>

        <!-- ORBIT OPERATIONS -->
        <div class="orbit-operations">
            <button class="button is-primary" style="margin: 5px;" v-on:click="assign_problem()" :disabled="!orbit_selected">
                Assign Orbit
            </button>
            <button class="button is-info" style="margin: 5px;" v-on:click="clone_orbit()" :disabled="!orbit_selected">
                Clone Orbit
            </button>
            <button class="button is-danger" style="margin: 5px;" v-on:click="delete_orbit()" :disabled="!orbit_selected">
                Delete Orbit
            </button>
            <button class="button is-success" style="margin: 5px;" v-on:click="new_orbit()">
                New Orbit
            </button>
        </div>

        <!-- MODALS -->
        <add-orbit :isActive="add_modal" v-on:close-modal="close_add_modal()"></add-orbit>
        <div v-if="orbit_selected">
            <clone-orbit :isActive="clone_modal" :selected_orbit="selection" v-on:close-modal="close_clone_modal()"></clone-orbit>
            <assign-orbit :isActive="assign_modal" :selected_orbit="selection" v-on:close-modal="close_assign_modal()"></assign-orbit>
        </div>

    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import Vue from 'vue';

    import CloneOrbit from './modals/orbit/CloneOrbit';
    import AssignOrbit from './modals/orbit/AssignOrbit';
    import AddOrbit from './modals/orbit/AddOrbit';

    import { DeleteOrbit, DeleteOrbitAttribute, DeleteOrbitAssignation } from '../../../scripts/orbit-queries';

    export default {

        name: 'orbit-library',
        data: function () {
            return {
                orbit_selected: false,
                selection: false,

                // MODALS
                clone_modal: false,
                assign_modal: false,
                add_modal: false,

            }
        },
        props: ['orbit_rows'],
        computed: {
            ...mapState({
            }),
            ...mapGetters({
            }),
        },
        methods: {

            select_orbit(index){
                console.log("---> ORBIT SELECTED", index);
                let toggle = this.orbit_rows[index].selected;

                // DESELECT
                if(toggle){
                    console.log("DESELECT");
                    this.$emit('orbit-selected', {});
                    this.unselect_orbits();
                    this.orbit_selected = false;
                    this.selection = false;
                }
                else{  // SELECT
                    console.log("SELECT");
                    this.$emit('orbit-selected', this.orbit_rows[index]);
                    this.unselect_orbits();
                    Vue.set(this.orbit_rows[index], 'selected', true);
                    this.orbit_selected = true;
                    this.selection = this.orbit_rows[index];
                }
            },

            unselect_orbits(){
                console.log("---> ORBITS UNSELECTED");
                for(let x=0;x<this.orbit_rows.length; x++){
                    Vue.set(this.orbit_rows[x], 'selected', false);
                }
            },

            refresh_buttons(){
                for(let x=0;x<this.orbit_rows.length; x++){
                    if(this.orbit_rows[x].selected){
                        this.orbit_selected = true;
                        return;
                    }
                }
                this.orbit_selected = false;
            },

            refresh_component(){
                for(let x=0;x<this.orbit_rows.length; x++){
                    if(this.orbit_rows[x].selected){
                        this.selection = this.orbit_rows[x];
                        this.orbit_selected = true;
                        return;
                    }
                }
                this.orbit_selected = false;
            },

            assign_problem(){
                this.assign_modal = true;
            },
            

            clone_orbit(){
                this.clone_modal = true;
            },
            new_orbit(){
                this.add_modal = true;
            },


            close_assign_modal(){
                this.assign_modal = false;
            },
            close_clone_modal(){
                this.clone_modal = false;
                this.$emit('refresh-orbit-query');
            },

            close_add_modal(){
                this.add_modal = false;
                this.$emit('refresh-orbit-query');
            },

            

            async delete_orbit(){
                console.log("---> Deleting orbit", this.selection);

                let del_orb_attribute = await this.$apollo.mutate({
                    mutation: DeleteOrbitAttribute,

                    variables: {
                        orbit_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_orbit_att } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit_att);
                    },
                });
                console.log("---> DEL ATTR", del_orb_attribute);

                let del_orb_asg = await this.$apollo.mutate({
                    mutation: DeleteOrbitAssignation,

                    variables: {
                        orbit_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_orbit_asg } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit_asg);
                    },
                });
                console.log("---> DEL ASG", del_orb_asg);



                let del_orb = await this.$apollo.mutate({
                    mutation: DeleteOrbit,

                    variables: {
                        orbit_id: this.selection.id,
                    },

                    update: (cache, { data: { delete_orbit } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit);
                    },
                });
                console.log("---> DEL ORB", del_orb);
                
                this.$emit('refresh-orbit-query');
                this.selection = false;
                this.orbit_selected = false;
            },

            // OPENS ORBIT ATTRIBUTE LIBRARY
            edit_attributes(){
                this.$emit('display-attribute-library', {});
            }
        },
        components: {
            CloneOrbit,
            AssignOrbit,
            AddOrbit,
        },
        mounted() {
            console.log("---> Mounting OrbitLibrary");
            this.refresh_component();
        }

    }



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