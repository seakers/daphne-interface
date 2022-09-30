<template>
    <div class="message-body">

        <div class="tabs" style="min-height: 41px;">
            <ul>
                <li :class="{ 'is-active': selected_tab === 'vassar'}" v-on:click="show_vassar_page"><a style="text-decoration: none; font-weight: bold;">Evaluators</a></li>
                <li :class="{ 'is-active': selected_tab === 'ga'}" v-on:click="show_ga_page"><a style="text-decoration: none; font-weight: bold;">GAs</a></li>
            </ul>
        </div>

        <div class="evaluator-body" v-show="selected_tab === 'vassar'">

<!--            <div class="box" style="font-weight: bold">-->
<!--                Desired Count-->
<!--                <select v-model="req_eval_containers">-->
<!--                    <option v-for="num in allowable_vassar_containers" :value="num" :key="num">{{ num }}</option>-->
<!--                </select>-->
<!--                <button class="button is-link is-small" style="float: right;" v-on:click="commit_requests">request</button>-->
<!--            </div>-->

            <div class="box">

                <nav class="level">
                    <span style="font-size: large; font-weight: bold; color: black">Design Evaluator Instances ({{currentStatus['vassar_containers'].length}})</span>
                    <div class="dropdown level-right is-right" v-bind:class="{ 'is-active': isDropdownActive }">
                        <div class="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="isDropdownActive=!isDropdownActive" :disabled="actionCount !== 0">
                                <span v-if="actionCount === 0">Actions</span>
                                <span v-if="actionCount !== 0">{{actionCount}}</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_stop_instances" v-on:click="stop_instance()">Stop Instance</button>
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_start_instances" v-on:click="start_instance()">Start Instance</button>
                                <hr class="dropdown-divider">
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_start_container" v-on:click="pull_container()">Pull Container</button>
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_start_container" v-on:click="start_container()">Start Container</button>
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_stop_container" v-on:click="stop_container()">Stop Container</button>
                                <button class="button dropdown-item" style="border: none;" :disabled="cant_stop_container" v-on:click="build_container()">Build Container</button>
                            </div>
                        </div>
                    </div>

                </nav>


                <table class='table is-fullwidth'>
                    <thead>

                    <tr>
                        <th colspan="5" scope="colgroup" style="text-align: center; border-right-width: 2px;">EC2 Instance</th>
                        <th colspan="3" scope="colgroup" style="text-align: center; border-left-width: 2px;">Docker Container</th>
                    </tr>

                    <tr>
                        <th></th>
                        <th style="text-align: center;">Identifier</th>
                        <th style="text-align: center;">State</th>
                        <th style="text-align: center;">Status</th>
                        <th style="text-align: center; border-right-width: 2px;">SSM Status</th>

                        <th style="text-align: center; border-left-width: 2px;">Status</th>
                        <th style="text-align: center;">Problem</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(container, idx) in currentStatus['vassar_containers']">
                        <td><input type="checkbox" v-model="container['selected']"></td>
                        <td>{{ container['instance']['IDENTIFIER'] }}</td>
                        <td>{{ container['instance']['State'] }}</td>
                        <td>{{ container['instance']['Status'] }}</td>
                        <td style="border-right-width: 2px;">{{ container['instance']['SSMStatus'] }}</td>

                        <td style="border-left-width: 2px;">{{get_container_status(container['container'])}}</td>
                        <td>{{get_container_problem(container['container'])}}</td>
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
            <button class="button is-link" v-on:click="send_ping" :disabled="timerCount !== 0">
                <div v-if="timerCount !== 0">{{timerCount}}</div>
                <div v-if="timerCount === 0">Refresh</div>
            </button>
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
                allowable_vassar_containers: [0, 1, 2, 3],
                allowable_ga_containers: [0, 1, 2, 3],
                req_eval_containers: 0,
                req_ga_containers: 0,
                timerCount: 5,
                actionCount: 0,
                Problem: [],
                isDropdownActive: false,
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
            cant_start_container(){
                // --- Rules
                // 1. A selection must be made
                // 2. SSM Status must be 'Online' for each selection
                // 3. Container ping obj must be empty
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let ssm_status = resource['instance']['SSMStatus'];
                    if(ssm_status !== 'Online'){
                        return true;
                    }
                    if(resource['container'] !== 'empty'){
                        return true;
                    }
                }
                return false;
            },
            cant_stop_container(){
                // --- Rules
                // 1. A selection must be made
                // 2. SSM Status must be 'Online' for each selection
                // 3. Container ping obj must not be empty
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let ssm_status = resource['instance']['SSMStatus'];
                    if(ssm_status !== 'Online'){
                        return true;
                    }
                    if(resource['container'] === 'empty'){
                        return true;
                    }
                }
                return false;
            },
            cant_stop_instances(){
                // --- Rules
                // 1. A selection must be made
                // 2. Every selection must be in the 'running' state
                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let state = resource['instance']['State'];
                    if(state !== 'running'){
                        return true;
                    }
                }
                return false
            },
            cant_start_instances(){
                // --- Rules
                // 1. A selection must be made
                // 2. Every selection must be in the 'stopped' state

                if(this.selected_instances.length === 0){
                    return true;
                }
                for(let x = 0; x < this.selected_instances.length; x++) {
                    let resource = this.selected_instances[x];
                    let state = resource['instance']['State'];
                    if(state !== 'stopped'){
                        return true;
                    }
                }
                return false
            },
            selected_instances(){
                let instances = [];
                for(let x = 0; x < this.currentStatus['vassar_containers'].length; x++){
                    let resource = this.currentStatus['vassar_containers'][x];
                    resource['type'] = 'vassar';
                    if(resource['selected'] === true){
                        instances.push(resource)
                    }
                }
                for(let x = 0; x < this.currentStatus['ga_containers'].length; x++){
                    let resource = this.currentStatus['ga_containers'][x];
                    resource['type'] = 'ga';
                    if(resource['selected'] === true){
                        instances.push(resource)
                    }
                }
                return instances;
            },
            selected_instance_ids(){
                let selections = {
                    'vassar': [],
                    'ga': []
                };
                for(let x = 0; x < this.selected_instances.length; x++){
                    let resource = this.selected_instances[x];
                    if(resource['type'] === 'vassar'){
                        selections['vassar'].push(resource['instance']['IDENTIFIER']);
                    }
                    else{
                        selections['ga'].push(resource['instance']['IDENTIFIER']);
                    }
                }
                return selections;
            }
        },
        methods: {
            get_container_status(container){
                if(container === 'empty'){
                    return 'Stopped';
                }
                else{
                    return container['status']['StringValue'];
                }
            },
            get_container_problem(container){
                if(container === 'empty'){
                    return 'None';
                }
                else{
                    return this.get_problem_name(container['PROBLEM_ID']['StringValue']);
                }
            },
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
                    if ( a['instance']['IDENTIFIER'] < b['instance']['IDENTIFIER'] ){
                        return -1;
                    }
                    if ( a['instance']['IDENTIFIER'] > b['instance']['IDENTIFIER'] ){
                        return 1;
                    }
                    return 0;
                }
                vassar_containers.sort(compare);
                ga_containers.sort(compare);
                for(let x = 0; x < vassar_containers.length; x++){
                    vassar_containers[x]['selected'] = false;
                }
                for(let x = 0; x < ga_containers.length; x++){
                    ga_containers[x]['selected'] = false;
                }


                this.currentStatus = {
                    'vassar_containers': vassar_containers,
                    'ga_containers': ga_containers
                };
                this.req_eval_containers = vassar_containers.length;
                this.req_ga_containers = ga_containers.length;
            },
            show_vassar_page(){
                this.selected_tab = 'vassar';
            },
            show_ga_page(){
                this.selected_tab = 'ga';
            },
            send_ping(){
                wsTools.websocket.send(JSON.stringify({msg_type: "ping_services"}));
                this.timerCount = 5;
            },
            commit_requests(){
                // --> Send regulation message
                wsTools.websocket.send(JSON.stringify({
                    msg_type: "connect_services",
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
            },
            
            // --> AWS Methods
            start_instance(){
                
            },
            stop_instance(){
                this.timeout_action(15);
                console.log('--> STOPPING INSTANCES', this.selected_instance_ids);
                wsTools.websocket.send(JSON.stringify({msg_type: "resource_msg", command: "stop_instance", instance_ids: this.selected_instance_ids}));
            },
            start_container(){

            },
            stop_container(){

            },
            pull_container(){

            },
            build_container(){

            },


            timeout_action(time) {
                this.actionCount = time;
                this.isDropdownActive = false;
            }
        },
        watch: {
            serviceStatus() {
                this.reload_module()
            },
            timerCount: {
                handler(value) {
                    if (value > 0) {
                        setTimeout(() => {
                            this.timerCount--;
                        }, 1000);
                    }
                },
                immediate: true // This ensures the watcher is triggered upon creation
            },
            actionCount: {
                handler(value) {
                    if (value > 0) {
                        setTimeout(() => {
                            this.actionCount--;
                        }, 1000);
                    }
                },
                immediate: true
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