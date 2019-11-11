<template>
    <p class="has-text-white is-size-1">{{minutes}} : {{seconds}}</p>
</template>

<script>
    export default {
        name: 'timer',
        props: ['duration', 'startTime'],
        data() {
            return {
                now: 0,
                timeInterval: {}
            }
        },
        computed: {
            endTime() {
                return this.startTime + 1000*this.duration;
            },
            minutes() {
                let t = this.endTime - this.now;
                let minutes = Math.floor((t/1000/60) % 60);
                return ('0' + minutes).slice(-2);
            },
            seconds() {
                let t = this.endTime - this.now;
                let seconds = Math.floor((t/1000) % 60);
                return ('0' + seconds).slice(-2);
            }
        },
        methods: {
            createTimeInterval() {
                this.timeInterval = window.setInterval(() => {
                    this.now = Date.now();
                    if (this.endTime - this.now <= 0) {
                        window.clearInterval(this.timeInterval);
                        this.$emit('countdown-end');
                    }
                }, 1000);
            }
        },
        mounted() {
            this.createTimeInterval();
        },
        watch: {
            startTime: function (val, oldVal) {
                this.createTimeInterval();
            }
        }
    }
</script>

<style scoped>
    p {
        padding-left: 40px;
    }
</style>