<template>
    <div class="orbits-container">
        <div class="orbits-panel">
            


            <!-- ORBITS -->
            <select-global :query="orbit_rows" title="Orbits" table="Orbit"></select-global>

            <!-- EDITOR -->
            <orbit-editor></orbit-editor>

            <!-- ATTRIBUTES -->
            <!-- <select-attribute :query="orbit_attribute_rows" title="Attributes" table="Orbit_Attribute"></select-attribute> -->



        </div>
    </div>
</template>


<script>
    import { mapState, mapGetters } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    import { OrbitQuery, OrbitAttributeQuery, OrbitAttributeJoinQuery, ProblemQuery } from '../../scripts/apollo-queries';
    import TableView from './table/TableView';
    import SwitchButton from './SwitchButton';
    import * as _ from 'lodash-es';
    import Vue from 'vue';
    import gql from 'graphql-tag';
    import SelectGlobal from './global_view/SelectGlobal';
    import SelectAttribute from './global_view/SelectAttribute';
    import OrbitEditor from './global_view/OrbitEditor';

    export default {
        name: 'orbits',
        data: function () {
            return {
                Orbit: [],
                Orbit_Attribute: [],

                orbit_rows: [],
                orbit_attribute_rows: [],
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

        },
        components: {
            SelectGlobal,
            SelectAttribute,
            OrbitEditor
        },
        apollo: {
            Orbit: {
                query: OrbitQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
            Orbit_Attribute: {
                query: OrbitAttributeQuery,
                variables() {
                    return {
                        selected_group_id: this.selected_group_id,
                    }
                }
            },
        },
        async mounted() {
            this.$apollo.queries.Orbit.refresh();
        },
        watch: {
            Orbit() {
                for(let x=0;x<this.Orbit.length;x++){
                    let row = _.cloneDeep(this.Orbit[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
                    this.orbit_rows.push(row);
                }
            },
            Orbit_Attribute() {
                for(let x=0;x<this.Orbit_Attribute.length;x++){
                    let row = _.cloneDeep(this.Orbit_Attribute[x]);
                    row['selected'] = false;
                    row['hidden'] = false;
                    row['index'] = x;
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
    flex-direction: row;
    align-items: stretch;
    max-height: 90vh;
}

</style>