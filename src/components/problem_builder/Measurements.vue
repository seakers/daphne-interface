<template>
    <div class="measurements-container">


        <measurement-library
                :measurement_rows="measurement_rows"
                v-on:measurement-selected="set_selected_measurement"
                v-on:display-attribute-library="display_attribute_library"
                v-on:refresh-measurement-query="refresh_measurement_query"
                v-if="!display_attribute_lib"
        >
        </measurement-library>

        <measurement-attribute-library
                :measurement_object="selected_measurement"
                :all_measurement_attributes="measurement_attribute_rows"
                v-on:display-measurement-library="display_measurement_library"
                v-on:refresh-attribute-query="refresh_attribute_query"
                v-if="display_attribute_lib"
        >
        </measurement-attribute-library>


    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import { MeasurementQuery, MeasurementAttributeQuery} from '../../scripts/measurement-queries';
    import * as _ from 'lodash-es';


    import MeasurementLibrary from './library/MeasurementLibrary';
    import MeasurementAttributeLibrary from './library/MeasurementAttributeLibrary';

    export default {
        name: 'measurements',
        data: function () {
            return {
                Measurement: [],
                Measurement_Attribute: [],

                measurement_rows: [],
                measurement_attribute_rows: [],

                selected_measurement: {},
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
            set_selected_measurement(measurement_selection){
                console.log("---> ORBIT SELECT PARENT!!!!", measurement_selection);
                if(_.isEmpty(measurement_selection)){
                    this.has_selection = false;
                }
                else{
                    this.has_selection = true;
                }
                this.selected_measurement = measurement_selection;
            },
            display_attribute_library(){
                this.display_attribute_lib = true;
            },
            display_measurement_library(){
                this.display_attribute_lib = false;
            },

            refresh_measurement_query(){
                console.log("---> ORBIT REFETCH QUERIES");
                this.$apollo.queries.Measurement.refetch();
                this.$apollo.queries.Measurement_Attribute.refetch();
            },

            refresh_attribute_query(){
                console.log("---> ORBIT ATTRIBUTE REFETCH QUERIES");
                this.$apollo.queries.Measurement_Attribute.refetch();
                this.$apollo.queries.Measurement.refetch();
            }


        },
        components: {
            MeasurementLibrary,
            MeasurementAttributeLibrary
        },
        apollo: {
            Measurement: {
                query: MeasurementQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Measurement_Attribute: {
                query: MeasurementAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
        },
        async mounted() {
            this.$apollo.queries.Measurement.refetch();
        },
        watch: {
            Measurement() {
                this.measurement_rows = [];
                console.log("---> Measurement Query", this.Measurement);
                for(let x=0;x<this.Measurement.length;x++){
                    let row = _.cloneDeep(this.Measurement[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.measurement_rows.push(row);
                }
            },
            Measurement_Attribute() {
                this.measurement_attribute_rows = [];
                for(let x=0;x<this.Measurement_Attribute.length;x++){
                    let row = _.cloneDeep(this.Measurement_Attribute[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    row['has_accepted'] = (this.Measurement_Attribute[x].Join__Measurement_Attribute_Values.length > 0);
                    this.measurement_attribute_rows.push(row);
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

    .measurements-panel{
        display: flex;
        flex-grow: 0.75;
        margin: 1em 3em;
        flex-direction: column;
        align-items: flex-start;
        height: 80vh;
        background-color: #fff;
        border-radius: 6px;
    }


    .measurement-library-title{
        display: flex;
        padding-top: 3vw;
        padding-left: 2vw;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: bold;
    }

    .measurement-library-select{
        display: flex;
        max-height: 43vh;
        overflow-y: auto;
        margin-top: 3vh;
        margin-left: 2vw;
    }

    .measurement-edit-btns{
        display: flex;
        margin-left: 2vw;
        margin-top: 1vw;
    }

    .measurement-operations{
        display: flex;
        align-self: flex-end;
        align-items: flex-end;
        flex-grow: 1;
        margin-right: 2vw;
        margin-bottom: 3vw;
    }

    .measurement-library-item{
        padding: 0.3em 0.75em !important;
        cursor: pointer;
    }

    .measurement-selected{
        background-color: #606B7D;
        color: #fff;
    }


</style>