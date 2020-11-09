<template>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 400px !important;">
            <article class="message">
                <div class="modal-clone-title">New Group: {{ new_name }}</div>

                <!-- GROUP NAME-->
                <div class="modal-clone-body">
                    Input a Group name
                </div>
                <div class="modal-clone-body">
                    <input v-model="new_name" placeholder="new group name...">
                </div>

                <!-- GROUP INVITATIONS-->
                <div class="modal-clone-body">
                    Select user email to invite to Group
                </div>
                <div class="modal-user-select">
                    <div class="modal-group-body">
                        <select v-model="selected_user_id">
                            <option v-for="(user, idx) in other_users" v-bind:value="user.id" :key="idx">
                                {{ user.email }}
                            </option>
                        </select>
                    </div>
                    <button class="button is-success" style="margin: 5px;" v-on:click="add_user">
                        Add
                    </button>
                </div>

                <!-- GROUP MEMBERS ADDED-->
                <div class="modal-clone-body">
                    Group Users
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in users_to_add" :key="idx">
                                <td>{{ row.email }}</td>
                                <td>
                                    <div style="padding: 5px;">
                                        <input type="checkbox" v-model="row.admin">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- BUTTONS-->
                <div class="modal-clone-actions">
                    <button class="button is-danger" style="margin: 5px;" v-on:click="$emit('close-modal')" :disabled="disable_cancel">
                        Cancel
                    </button>
                    <button class="button is-success" style="margin: 5px;" v-on:click="create_group()" :disabled="new_name === '' || disable_create == true">
                        Create
                    </button>
                </div>


            </article>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import {DaphneUsers} from "../../../scripts/apollo-queries";
    import {new_group} from "../../../scripts/clone-helpers";

    export default {
        name: "new-group",
        props: ['isActive'],
        data() {
            return {
                new_name: "",
                selected_user_id: null,
                users: [],
                other_users: [],
                users_to_add: [],

                disable_cancel: false,
                disable_create: false,
            }
        },
        computed: {
            ...mapState({
                user_id: state => state.table.user_id,
            }),
        },
        methods: {
            add_user() {
                for(let x=0;x<this.other_users.length;x++){
                    let user = this.other_users[x];
                    if(user.id === this.selected_user_id && this.users_to_add.filter(e => e.id === user.id).length === 0){
                        this.users_to_add.push(user);
                    }
                }
            },
            async create_group() {
                console.log("--> USERS TO ADD", this.users_to_add);

                await new_group(this.user_id, this.users_to_add, this.new_name);

                this.$emit('close-modal-refresh');
            }
        },
        apollo: {
            $subscribe: {
                users: {
                    query: DaphneUsers,
                    result (data) {
                        console.log(data);
                        let usrs = data.data.users;
                        this.other_users = [];
                        for(let x=0;x<usrs.length;x++){
                            let user = usrs[x];
                            user.admin = false;
                            if(user.id !== this.user_id){
                                this.other_users.push(user);
                            }
                        }
                    }
                }
            }
        },
        watch: {
            other_users() {
                if(this.other_users.length > 0){
                    this.selected_user_id = this.other_users[0].id;
                }
            }
        }
    }
</script>


<style lang="scss">


.modal-user-select{
    display: flex;
    flex-direction: row;
}

.modal-group-title{
    display: flex;
    padding: 5px 15px;
    font-size: 1.2em;
    font-weight: bold;
}

.modal-group-body{
    display: flex;
    padding: 5px 15px;
}

.modal-group-actions{
    display: flex;
    padding: 5px 10px;
}

</style>>