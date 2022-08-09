<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-attribute-title">New Orbit Attribute</div>

                <div class="modal-attribute-body">
                    Name
                    <input v-model="attribute_name" placeholder="attribute name...">
                </div>

                <div class="modal-attribute-body">
                    Slot Type
                    <select v-model="slot_type">
                        <option v-for="option in slot_options" v-bind:value="option" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>

                <div class="modal-attribute-body">
                    Type
                    <select v-model="type">
                        <option v-for="option in type_options" v-bind:value="option" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>

                <div class="modal-attribute-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="create_attribute()" :disabled="attribute_name === ''">
                        Create
                    </button>
                </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close"  v-on:click.prevent="$emit('close-modal')"></button>
    </div>
</template>

<script>
    import { InsertOrbitAttribute } from '../../../../../scripts/orbit-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'orbit-attribute',
        props: ['isActive'],
        data() {
            return {
                attribute_name: '',

                slot_type: '',
                slot_options: ['slot', 'multislot'],

                type: '',
                type_options: ['NL', 'OL', 'FR']

                // name, slot_type, type

                // INSERT: group_id, name, slot_type, type
            }
        },
        components: {
        },
        computed: {
            ...mapGetters({
                selected_group_id: 'get_group_id',
            }),
        },
        methods: {
            onCloseModal() {
                this.$emit('close-modal');
            },
            async create_attribute(){
                console.log("---> CREATING ITEM");

                // ADD ATTRIBUTE FUNCTIONALITY HERE
                let new_orb_attribute = await this.$apollo.mutate({
                    mutation: InsertOrbitAttribute,

                    variables: {
                        group_id: this.selected_group_id,
                        name: this.attribute_name,
                        slot_type: this.slot_type,
                        type: this.type
                    },

                    update: (cache, { data: { delete_orbit_attr } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(delete_orbit_attr);
                    },
                });

                console.log("---> NEW ORBIT ATTRIBUTE", new_orb_attribute);

                this.$emit('close-modal');
            },
        }
    }
</script>

<style lang="scss">

.modal-attribute-title{
    display: flex;
    padding: 5px 15px;
    font-size: 1.2em;
    font-weight: bold;
}

.modal-attribute-body{
    display: flex;
    padding: 5px 15px;
}

.modal-attribute-actions{
    display: flex;
    padding: 5px 10px;
}

</style>