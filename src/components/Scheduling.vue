<template>
    <div class="panel-block functionality">
        <div id="scheduling">
            <div class="field">
                <label for="archs">Enter architectures for scheduling evaluation, separated by commas:</label>
                <input type="text" id="archs" value="e.g. 123, 456, 123" v-on:change.prevent="archIDs">
            </div>
            <div class="field">
                <a class="button" target="_blank" :href="'scheduler.html?archIDs=' + archList + '&problem=' + problemName">
                    Schedule me up boiiiiiii
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'scheduling',
        data() {
            return {
                archList: ""
            }
        },
        computed: {
            ...mapState({
                problemName: state => state.problem.problemName
            })
        },
        components: {
        },
        methods: {
            archIDs () {
                var inputTextValue;
                var elem = document.getElementById('archs');
                if(typeof elem !== null && elem !== 'undefined') {
                    let archs = document.getElementById("archs").value;
                    inputTextValue = archs;
                } else {
                    inputTextValue = "xd";
                }
                console.log(inputTextValue);
                this.archList = inputTextValue;
            }
        }
    }
</script>

<style scoped>
</style>