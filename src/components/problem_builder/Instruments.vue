<template>
    <div class="instruments-container">


        <instrument-library
                :instrument_rows="instrument_rows"
                v-on:instrument-selected="set_selected_instrument"
                v-on:display-attribute-library="display_attribute_library"
                v-on:refresh-instrument-query="refresh_instrument_query"
                v-if="!display_attribute_lib"
        >
        </instrument-library>

        <instrument-attribute-library
                :instrument_object="selected_instrument"
                :all_instrument_attributes="instrument_attribute_rows"
                v-on:display-instrument-library="display_instrument_library"
                v-on:refresh-attribute-query="refresh_attribute_query"
                v-if="display_attribute_lib"
        >
        </instrument-attribute-library>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import { InstrumentQuery, InstrumentAttributeQuery} from '../../scripts/instrument-queries';
    import * as _ from 'lodash-es';


    import InstrumentLibrary from './library/InstrumentLibrary';
    import InstrumentAttributeLibrary from './library/InstrumentAttributeLibrary';

    export default {
        name: 'instruments',
        data: function () {
            return {
                Instrument: [],
                Instrument_Attribute: [],

                instrument_rows: [],
                instrument_attribute_rows: [],

                selected_instrument: {},
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
        },
        methods: {
            set_selected_instrument(instrument_selection){
                console.log("---> ORBIT SELECT PARENT!!!!", instrument_selection);
                if(_.isEmpty(instrument_selection)){
                    this.has_selection = false;
                }
                else{
                    this.has_selection = true;
                }
                this.selected_instrument = instrument_selection;
            },
            display_attribute_library(){
                this.display_attribute_lib = true;
            },
            display_instrument_library(){
                this.display_attribute_lib = false;
            },

            refresh_instrument_query(){
                console.log("---> ORBIT REFETCH QUERIES");
                this.$apollo.queries.Instrument.refetch();
                this.$apollo.queries.Instrument_Attribute.refetch();
            },

            refresh_attribute_query(){
                console.log("---> ORBIT ATTRIBUTE REFETCH QUERIES");
                this.$apollo.queries.Instrument_Attribute.refetch();
                this.$apollo.queries.Instrument.refetch();
            }


        },
        components: {
            InstrumentLibrary,
            InstrumentAttributeLibrary
        },
        apollo: {
            Instrument: {
                query: InstrumentQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Instrument_Attribute: {
                query: InstrumentAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
        },
        async mounted() {
            this.$apollo.queries.Instrument.refetch();
            console.log("GROUP ID", this.selected_group_id);
        },
        watch: {
            Instrument() {
                this.instrument_rows = [];
                console.log("---> Instrument Query", this.Instrument);
                for(let x=0;x<this.Instrument.length;x++){
                    let row = _.cloneDeep(this.Instrument[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.instrument_rows.push(row);
                }
            },
            Instrument_Attribute() {
                this.instrument_attribute_rows = [];
                for(let x=0;x<this.Instrument_Attribute.length;x++){
                    let row = _.cloneDeep(this.Instrument_Attribute[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    row['has_accepted'] = (this.Instrument_Attribute[x].Join__Instrument_Attribute_Values.length > 0);
                    this.instrument_attribute_rows.push(row);
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

    .instruments-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: flex-start;
        height: 80vh;
        background-color: #fff;
        border-radius: 6px;
    }


    .instrument-library-title{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: bold;
    }

    .instrument-library-select{
        display: flex;
        max-height: 43vh;
        overflow-y: auto;
        margin-top: 3vh;
        margin-left: 2vw;
    }

    .instrument-edit-btns{
        display: flex;
        margin-left: 2vw;
        margin-top: 1vw;
    }

    .instrument-operations{
        display: flex;
        align-self: flex-end;
        align-items: flex-end;
        flex-grow: 1;
        margin-right: 2vw;
        margin-bottom: 3vw;
    }

    .instrument-library-item{
        padding: 0.3em 0.75em !important;
        cursor: pointer;
    }

    .instrument-selected{
        background-color: #606B7D;
        color: #fff;
    }


</style>