<template>
    <div class="message-body">



        <div class="tabs" style="min-height: 41px;">
            <ul>
                <li :class="{ 'is-active': selected_tab === 'vassar'}" v-on:click="show_vassar_page"><a style="text-decoration: none; font-weight: bold;">Evaluators</a></li>
                <li :class="{ 'is-active': selected_tab === 'ga'}" v-on:click="show_ga_page"><a style="text-decoration: none; font-weight: bold;">GAs</a></li>
            </ul>
        </div>

        <div class="evaluator-body" v-show="selected_tab === 'vassar'">

            <div class="box" style="font-weight: bold">
                Desired Count
                <select v-model="req_eval_containers">
                    <option v-for="num in allowable_vassar_containers" :value="num" :key="num">{{ num }}</option>
                </select>
                <button class="button is-link is-small" style="float: right;" v-on:click="commit_requests">request</button>
            </div>

            <div class="box">
                <table class='table'>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Identifier</th>
                        <th>Status</th>
                        <th>Problem</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(container, idx) in currentStatus['vassar_containers']">
                        <td>{{ idx }}</td>
                        <td>{{ container['labels']['IDENTIFIER'] }}</td>
                        <td>{{ container['status']['StringValue'] }}</td>
                        <td>{{ get_problem_name(container['PROBLEM_ID']['StringValue']) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div class="ga-body"  v-show="selected_tab === 'ga'">

            <div class="box" style="font-weight: bold">
                Desired Count
                <select v-model="req_ga_containers">
                    <option v-for="num in allowable_ga_containers" :value="num" :key="num">{{ num }}</option>
                </select>
                <button class="button is-link is-small" style="float: right;" v-on:click="commit_requests">request</button>
            </div>

            <div class="box">
                <table class='table'>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Identifier</th>
                        <th>Status</th>
                        <th>Problem</th>
                        <th>Control</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(container, idx) in currentStatus['ga_containers']">
                        <td>{{ idx }}</td>
                        <td>{{ container['labels']['IDENTIFIER'] }}</td>
                        <td>{{ container['status']['StringValue'] }}</td>
                        <td>{{ get_problem_name(container['PROBLEM_ID']['StringValue']) }}</td>
                        <td v-if="container['status']['StringValue'] === 'READY'"><button class="button is-success is-small" v-on:click="start_ga(container['labels']['IDENTIFIER'])">start</button></td>
                        <td v-if="container['status']['StringValue'] === 'RUNNING'"><button class="button is-danger is-small" v-on:click="stop_ga(container['labels']['IDENTIFIER'])">stop</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div style="padding-top: 20px;">
            <button class="button is-link" v-on:click="close_modal">Close</button>
            <button class="button is-success" v-on:click="send_ping">Refresh</button>
        </div>


    </div>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import {AllProblemsQuery} from "../scripts/apollo-queries";
    import {wsTools} from "../scripts/websocket-tools";
    import * as _ from "lodash-es";
    export default {
        name: "control-panel-modal",
        data: function () {
            return {
                test: false,
                currentStatus: {
                    'vassar_containers': [],
                    'ga_containers': []
                },
                selected_tab: 'vassar',
                allowable_vassar_containers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                allowable_ga_containers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                req_eval_containers: 0,
                req_ga_containers: 0,
                Problem: [],
            }
        },
        computed: {
            ...mapState({
                userPk: state => state.auth.user_pk,
                objective_objs: state => state.problem.objective_objs,
            }),
            ...mapGetters({
                serviceStatus: 'getServiceStatus',
            }),
        },
        methods: {
            get_problem_name(problem_id){
                if(problem_id !== ""){
                    for(let x = 0; x < this.Problem.length; x++){
                        if(this.Problem[x].id === parseInt(problem_id)){
                            return this.Problem[x].name;
                        }
                    }
                }
                return "-----";
            },
            reload_module(){
                console.log("--> RELOAD", this.serviceStatus);
                this.$apollo.queries.Problem.refetch();
                let vassar_containers = _.cloneDeep(this.serviceStatus['vassar_containers']);
                let ga_containers = _.cloneDeep(this.serviceStatus['ga_containers']);
                // --> Compare function
                function compare(a, b) {
                    if ( a['labels']['IDENTIFIER'] < b['labels']['IDENTIFIER'] ){
                        return -1;
                    }
                    if ( a['labels']['IDENTIFIER'] > b['labels']['IDENTIFIER'] ){
                        return 1;
                    }
                    return 0;
                }
                vassar_containers.sort(compare);
                ga_containers.sort(compare);
                this.currentStatus = {
                    'vassar_containers': vassar_containers,
                    'ga_containers': ga_containers
                };
            },
            show_vassar_page(){
                this.selected_tab = 'vassar';
            },
            show_ga_page(){
                this.selected_tab = 'ga';
            },
            send_ping(){
                wsTools.websocket.send(JSON.stringify({msg_type: "ping"}));
            },
            commit_requests(){
                // --> Send regulation message
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "regulate_services",
                    num_eval: this.req_eval_containers,
                    num_ga: this.req_ga_containers
                }));
            },
            start_ga(identifier){
                let objective_str = "";
                for(let x = 0; x < this.objective_objs.length; x++){
                    if(this.objective_objs[x].active === true){
                        objective_str = objective_str + this.objective_objs[x].key + ",";
                    }
                }
                let trimmed_obj_string = objective_str.slice(0, -1);
                console.log("--> SENDING START GA MESSAGE");
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "start_ga",
                    objectives: trimmed_obj_string,
                    identifier: identifier,
                }));
            },
            stop_ga(identifier){
                console.log("--> SENDING STOP GA MESSAGE");
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "stop_ga",
                    identifier: identifier,
                }));
            },
            close_modal(){
                this.$emit('close-modal');
            }
        },
        watch: {
            serviceStatus() {
                this.reload_module()
            }
        },
        apollo: {
            Problem: {
                query: AllProblemsQuery,
            },
        },
        mounted() {
            this.send_ping();
            this.reload_module();
            this.req_eval_containers = this.currentStatus['vassar_containers'].length;
            this.req_ga_containers = this.currentStatus['ga_containers'].length;
        }
    }
</script>

<style scoped>
.evaluator-body{
}
.ga-body{
}
</style>