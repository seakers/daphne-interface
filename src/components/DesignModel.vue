<template>
    <div style="width: fit-content;">

        <div class="table-container">
            <div class="table is-striped">
                <thead style="font-size: smaller">
                    <tr>
                        <th v-for="col in design_table_columns">{{ col }}</th>
                    </tr>
                </thead>
                <tbody style="font-size: smaller">
                    <tr v-for="row in design_table_rows">
                        <th v-for="item in row">{{ item }}</th>
                    </tr>
                </tbody>


            </div>
        </div>

    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    export default {


        //--> Importable name of the component
        name: "DesignModel",

        //--> Dynamically passed variables to the component
        props: ['designDetails'],

        //--> Other Vue components it uses
        components: {},

        //--> Variables this vue object contains
        data() {
            return {

            }
        },

        //--> Variables similar to "data" variables where we can use logic to compute values
        computed: {
            ...mapGetters({
                orbit_list: 'get_orbit_list',
                instrument_list: 'get_instrument_list',
            }),

            design_table_rows: {
                get() {
                    //--> all orbits in this design
                    let keys = Object.keys(this.designDetails);
                    let all_rows = [];
                    let num_rows = keys.length;
                    for(let x = 0; x < num_rows; x++){
                        let row = [];
                        let orbit = keys[x];
                        let orbit_instruments = this.designDetails[orbit];
                        row.push(orbit);

                        let instrument_string = "";
                        let num_instruments = orbit_instruments.length;
                        for(let y = 0; y < num_instruments; y++){
                            if(y === 0){
                                instrument_string = orbit_instruments[y];
                            }
                            else{
                                instrument_string = instrument_string + " | " + orbit_instruments[y];
                            }
                        }
                        row.push(instrument_string);
                        all_rows.push(row);
                    }
                    return all_rows;
                },
            },

            design_table_columns: {
                get() {
                    let columns = [];
                    columns.push('Orbit');
                    columns.push('Instruments');
                    return columns;
                },
            },
        },

        //--> Functions that hang off of the vue object
        methods: {

        },

        //--> Observe properties and perform logic when these properties change
        watch: {

        },



    }
</script>

<style scoped>

</style>