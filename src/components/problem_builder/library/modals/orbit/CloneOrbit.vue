<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">Clone: {{ selected_orbit.name }}</div>

                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new orbit name...">
                </div>

                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel"> 
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="create_clone()" :disabled="new_name === '' || disable_create == true">
                        Create
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { CloneOrbit, CloneOrbitAttribute, OrbitSpecificAttributeQuery } from '../../../../../scripts/orbit-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'clone-orbit',
        props: ['isActive', 'selected_orbit'],
        data() {
            return {
                new_name: '',
                Orbit: [],
                clone_attributes: [],
                disable_cancel: false,
                disable_create: false,

            }
        },
        computed: {
            ...mapGetters({
                selected_group_id: 'get_group_id',
            }),
        },
        components: {
        },
        apollo: {
            Orbit: {
                query: OrbitSpecificAttributeQuery,
                variables() {
                    return {
                        orbit_id: this.selected_orbit.id
                    }
                }
            },
        },
        watch: {
            Orbit() {
                this.clone_attributes = [];
                for(let x=0;x<this.Orbit[0].Join__Orbit_Attributes.length;x++){
                    let clone_atr = this.Orbit[0].Join__Orbit_Attributes[x];
                    let obj = {};
                    obj.attribute_id = clone_atr.orbit_attribute_id;
                    obj.orbit_id = clone_atr.orbit_id; // cloning everything except orbit_id
                    obj.group_id = clone_atr.group_id;
                    obj.value = clone_atr.value;
                    this.clone_attributes.push(obj);
                }
                console.log("---> CLONE ATTRIBUTES: ", this.clone_attributes);
            }
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },
            async create_clone(){
                this.disable_cancel = true;
                this.disable_create = true;


                console.log("---> CLONING ITEM", this.selected_orbit);
                console.log("---> NAME", this.new_name);
                let to_copy_id = this.selected_orbit.id;
                
                await this.cloneOrbit();


                this.disable_cancel = false;
                this.disable_create = false;
                this.$emit('close-modal');
            },


            // MUTATION
            async cloneOrbit() {
                // insert new todo into db

                const name = this.new_name
                const selected_orbit_id = this.selected_orbit.id
                const selected_group_id = this.selected_group_id

                const new_orb = await this.$apollo.mutate({
                    mutation: CloneOrbit,

                    variables: {
                        group_id: selected_group_id,
                        new_name: name
                    },

                    update: (cache, { data: { insert_orbit } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(insert_orbit);
                    },
                });

                const new_orbit_id = new_orb.data.insert_Orbit_one.id;

                console.log("---- CLONING ORBIT", new_orb);
                console.log("---- NEW ORBIT ID", new_orbit_id);

                for (let x=0;x<this.clone_attributes.length;x++){
                    let clone_atr = this.clone_attributes[x];
                    let new_orb_attribute = await this.$apollo.mutate({
                        mutation: CloneOrbitAttribute,
                        variables: {
                            group_id: clone_atr.group_id,
                            orbit_attribute_id: clone_atr.attribute_id,
                            orbit_id: new_orbit_id,
                            value: clone_atr.value
                        },
                        update: (cache, { data: { insert_orbit_attribute } }) => {
                            // Read the data from our cache for this query.
                            // eslint-disable-next-line
                            console.log(insert_orbit_attribute);
                        },
                    });
                    console.log("---> CLONED ATTRIBUTE", new_orb_attribute);
                }

            },


        }
    }
</script>

<style lang="scss">

.modal-clone-title{
    display: flex;
    padding: 5px 15px;
    font-size: 1.2em;
    font-weight: bold;
}

.modal-clone-body{
    display: flex;
    padding: 5px 15px;
}

.modal-clone-actions{
    display: flex;
    padding: 5px 10px;
}

</style>