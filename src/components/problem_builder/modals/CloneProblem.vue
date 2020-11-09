<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">Clone: {{ problem_name }}</div>

                <!-- PROBLEM NAME-->
                <div class="modal-clone-body">
                    Create a new name for the problem
                </div>
                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new problem name...">
                </div>

                <!-- CLONE DESIGNS-->
                <div class="modal-assign-body" style="margin-top: 5px;">
                    <div style="padding: 5px;">
                        <input type="checkbox" id="checkbox5" v-model="clone_designs">
                        <label for="checkbox5">Clone designs</label>
                    </div>
                </div>

                <!-- BUTTONS-->
                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="create_clone()" :disabled="new_name === '' || disable_clone == true">
                        Clone
                    </button>
                </div>



            </article>
        </div>
    </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import {UserGroups} from "../../../scripts/apollo-queries";
import {clone_problem} from "../../../scripts/clone-helpers";



    export default {
        name: "clone-problem",
        props: ['isActive', 'selected_problem'],
        data() {
            return {
                problem_id: null,
                problem_name: "",
                new_name: "",

                auth_user: [],
                clone_designs: true,

                disable_cancel: false,
                disable_clone: false,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.table.user_id,
            }),
            ...mapGetters({
                group_id: 'groups__group_selection'
            }),
        },
        methods: {
            async create_clone() {
                this.disable_cancel = true;
                this.disable_clone  = true;

                await clone_problem(this.problem_id, this.group_id, this.new_name, this.clone_designs);

                this.disable_cancel = false;
                this.disable_clone  = false;
                this.$emit('close-modal-refresh');
            },
        },
        apollo: {
            auth_user: {
                query: UserGroups,
                variables() {
                    return {
                        user_id: this.user_id,
                    }
                }
            },
        },
        watch: {
            auth_user(){
                console.log("--> Group query", this.auth_user);
                // Initialize the var holding the group to assign the cloned problem to
                // this.group_id = this.auth_user.join[0].Group.id;
            },
        },
        mounted() {
            console.log("--> CLONING PROBLEM", this.selected_problem.objects, this.user_id);
            this.problem_id = this.selected_problem.objects.id;
            this.problem_name = this.selected_problem.objects.name;
        },


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