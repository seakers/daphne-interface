<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">Clone: {{ selected_instrument.name }}</div>

                <div class="modal-clone-body">
                    Instruments differ across problems. Choose which problem the clone will apply to.
                </div>

                <div class="modal-clone-body">
                    <select v-model="problem_id">
                        <option v-for="option in problem_choices" v-bind:value="option.id" :key="option.id">
                            {{ option.name }}
                        </option>
                    </select>
                </div>

                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new instrument name...">
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
    import { CloneInstrument, InstrumentAssignation, GetInstrumentAttributes, CloneInstrumentAttributes, GetInstrumentCapabilities, CloneInstrumentCapabilities, CloneInstrumentMeasurements, GetInstrumentMeasurements } from '../../../../../scripts/instrument-queries';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'clone-instrument',
        props: ['isActive', 'selected_instrument'],
        data() {
            return {
                new_name: '',
                Instrument: [],

                clone_attributes: [],
                disable_cancel: false,
                disable_create: false,

                Problem: [],
                problem_choices: [],
                problem_id: parseInt(PROBLEM__ID),

                Join__Instrument_Characteristic: [],
                Join__Instrument_Capability: [],



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
            Problem: {
                query: InstrumentAssignation,
                variables() {
                    return {
                        instrument_id: this.selected_instrument.id,
                        group_id: this.selected_group_id,
                    }
                }
            },
            Join__Instrument_Characteristic: {
                query: GetInstrumentAttributes,
                variables() {
                    return {
                        instrument_id: this.selected_instrument.id,
                        problem_id: this.problem_id
                    }
                }
            },
            Join__Instrument_Capability: {
                query: GetInstrumentCapabilities,
                variables() {
                    return {
                        instrument_id: this.selected_instrument.id
                    }
                }
            },
            Join__Instrument_Measurement: {
                query: GetInstrumentMeasurements,
                variables() {
                    return {
                        instrument_id: this.selected_instrument.id,
                        problem_id: this.problem_id
                    }
                }
            },

        },
        watch: {
            Problem(){
                this.problem_choices = [];
                for(let x=0;x<this.Problem.length;x++){
                    let obj = {};
                    obj.id = this.Problem[x].id;
                    obj.name = this.Problem[x].name;
                    if(this.Problem[x].Join__Problem_Instruments_aggregate.aggregate.count > 0){
                        this.problem_choices.push(obj);
                    }
                }
            },
            Instrument() {
                this.clone_attributes = [];
                for(let x=0;x<this.Instrument[0].Join__Instrument_Attributes.length;x++){
                    let clone_atr = this.Instrument[0].Join__Instrument_Attributes[x];
                    let obj = {};
                    obj.attribute_id = clone_atr.instrument_attribute_id;
                    obj.instrument_id = clone_atr.instrument_id; // cloning everything except instrument_id
                    obj.group_id = clone_atr.group_id;
                    obj.value = clone_atr.value;
                    this.clone_attributes.push(obj);
                }
                console.log("---> CLONE ATTRIBUTES: ", this.clone_attributes);
            }
        },
        methods: {
            get_instrument_attribute_objects(inst_id) {
                let objects = [];
                for(let x=0;x<this.Join__Instrument_Characteristic.length;x++){
                    let attr_to_clone = this.Join__Instrument_Characteristic[x];
                    let attr = {};
                    attr.group_id = attr_to_clone.group_id;
                    attr.problem_id = attr_to_clone.problem_id;
                    attr.instrument_id = inst_id;
                    attr.instrument_attribute_id = attr_to_clone.instrument_attribute_id;
                    attr.value = attr_to_clone.value;
                    objects.push(attr);
                }
                return objects;
            },
            get_instrument_capability_objects(inst_id) {
                let objects = [];
                for(let x=0;x<this.Join__Instrument_Capability.length;x++){
                    let attr_to_clone = this.Join__Instrument_Capability[x];
                    let attr = {};
                    attr.group_id = attr_to_clone.group_id;
                    attr.instrument_id = inst_id;
                    attr.measurement_id = attr_to_clone.measurement_id;
                    attr.measurement_attribute_id = attr_to_clone.measurement_attribute_id;
                    attr.value = attr_to_clone.value;
                    objects.push(attr);
                }
                return objects;
            },
            get_instrument_measurement_objects(inst_id) {
                let objects = [];
                for(let x=0;x<this.Join__Instrument_Measurement.length;x++){
                    let attr_to_clone = this.Join__Instrument_Measurement[x];
                    let attr = {};
                    attr.instrument_id = inst_id;
                    attr.problem_id = attr_to_clone.problem_id;
                    attr.measurement_id = attr_to_clone.measurement_id;
                    objects.push(attr);
                }
                return objects;
            },


            onCloseModal() {
                this.$emit('close-modal');
            },

            async create_clone(){
                this.disable_cancel = true;
                this.disable_create = true;

                console.log("---> CLONING ITEM", this.selected_instrument);
                console.log("---> NAME", this.new_name);

                await this.cloneInstrument();

                this.disable_cancel = false;
                this.disable_create = false;
                this.$emit('close-modal');
            },

            async cloneInstrument() {
                // insert new todo into db

                const name = this.new_name;
                const selected_group_id = this.selected_group_id;

                const new_inst = await this.$apollo.mutate({
                    mutation: CloneInstrument,

                    variables: {
                        group_id: this.selected_group_id,
                        new_name: name
                    },

                    update: (cache, { data: { insert_instrument } }) => {
                        // Read the data from our cache for this query.
                        // eslint-disable-next-line
                        console.log(insert_instrument);
                    },
                });
                const new_instrument_id = new_inst.data.insert_Instrument_one.id;

                // this.selected_instrument.id : old it
                // new_instrument_id : new id
                // problem_id
                console.log("---- NEW INST ID", new_instrument_id);

                let attr_objs = this.get_instrument_attribute_objects(new_instrument_id);
                let capability_objs = this.get_instrument_capability_objects(new_instrument_id);
                let measurement_objs = this.get_instrument_measurement_objects(new_instrument_id);

                let attr_objs_new = await this.$apollo.mutate({
                    mutation: CloneInstrumentAttributes,
                    variables: {
                        objects: attr_objs,
                    },
                    update: (cache, { data: { insert_instrument } }) => {
                        console.log(insert_instrument);
                    },
                });

                let capability_objs_new = await this.$apollo.mutate({
                    mutation: CloneInstrumentCapabilities,
                    variables: {
                        objects: capability_objs,
                    },
                    update: (cache, { data: { insert_instrument } }) => {
                        console.log(insert_instrument);
                    },
                });

                let measurement_objs_new = await this.$apollo.mutate({
                    mutation: CloneInstrumentMeasurements,
                    variables: {
                        objects: measurement_objs,
                    },
                    update: (cache, { data: { insert_instrument } }) => {
                        console.log(insert_instrument);
                    },
                });

                console.log("---- NEW attr_objs ID", attr_objs);
                console.log("---- NEW capability_objs ID", capability_objs);
                console.log("---- NEW measurement_objs ID", measurement_objs);

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