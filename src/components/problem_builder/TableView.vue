<template>
    <div class="table-view-container">


        <div class="table-view-title">{{ table_name }}</div>





        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th v-for="header in table_headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in table_rows" :key="row.id">
                        <td v-for="entry in row" :key="entry" class="table-cell-text">{{ entry }}</td>
                        <td class="text-cell-button" v-if="selectable"><a class="button is-link is-small" v-on:click="select_row(row)">select</a></td>
                        <td class="text-cell-button" v-if="editable_row"><a class="button is-warning is-small" v-on:click="edit_row(row)">edit</a></td>
                    </tr>

                    <tr v-if="insertable_row">
                        <td></td>
                        <td><input class="input" type="text" placeholder="Problem Name"></td>
                        <td class="text-cell-button"><a class="button is-primary" v-on:click="new_problem()">New Problem</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        


    </div>
</template>


<script>
    import { mapState } from 'vuex';
    import {fetchGet, fetchPost} from '../../scripts/fetch-helpers';
    
    export default {
        name: 'table-view',
        props: {
            table_name: String,   // 'Groups'
            table_headers: Array, // ['ID', 'Group']
            row_keys: Array,      // ['id', 'name']
            row_objects: Array,   // [ {'id': '1', 'name': 'seakers'}, {'id': '2', 'name': 'jpl'} ]
            selectable: Boolean,
            editable_row: Boolean,
            insertable_row: Boolean

        },
        data: function () {
            return {
                headers: [],
                rows: [],
            }
        },
        computed: {
            ...mapState({
                groups: state => state.groups.groups,
                problems: state => state.groups.problems
            }),
            table_rows() {
                let num_rows = this.row_objects.length;
                let num_keys = this.row_keys.length;
                let rows = [];
                for(let x=0;x<num_rows;x++){
                    let row_obj = this.row_objects[x];
                    let row = [];
                    for(let y=0;y<num_keys;y++){
                        let key = this.row_keys[y];
                        row.push(row_obj[key]);
                    }
                    rows.push(row);
                }
                return rows;
            }
        },
        methods: {
            select_row(row){
                console.log(row);
                if(this.table_name === 'Groups'){
                    this.$store.commit('set_group_id', row[0]);
                    this.$store.commit('set_group_name', row[1]);
                }
                if(this.table_name === 'Problems'){
                    this.$store.commit('set_problem_id', row[0]);
                    this.$store.commit('set_problem_name', row[1]);
                }
            },
            edit_row(){
                
            }
        },
        components: {
            // ScoreTree, CostColumn, DetailsTable
        },
        async mounted() {
            console.log(this.table_name);
            console.log(this.table_headers);
        },
        watch: {
        }
    }
</script>



<style lang="scss">
.table-view-container{
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 14px 4px #14191f !important;
    align-self: center;
    background-color: #354052;
}


.table-view-title{
    align-self: center;
    padding: .8em 0em;
    width: 100%;
    text-align: center;
    color: whitesmoke;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}


.table-container{
    padding: 0em .8em .8em .8em;
}


.table-cell-text{
    vertical-align: middle;
}

.table-cell-button{
    text-align: right;
}

</style>