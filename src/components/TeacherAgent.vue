<template>
    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto;">

        <!-- Left Column: Topic interface -->
        <div class="panel-block" style="align-items: flex-start; flex-direction: column;">

            <!-- Topic Picker -->
            <div class="field is-horizontal" style="padding-bottom: 8px; border-bottom: 1px solid #dbdbdb;">
                <div class="field-label is-normal">
                    <label class="label">Topic</label>
                </div>
                <div class="field-body">
                    <div class="field is-narrow">
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-on:change="teachSubject" v-model="selectedSubject">
                                    <option>Features</option>
                                    <option>Sensitivities</option>
                                    <option>Design Space</option>
                                    <option>Objective Space</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Topic Interface -->
            <div style="padding-top: 8px; flex-direction: column;">


                <template v-if="selectedSubject === 'Features'">
                    Features
                </template>



                <!-- Sensitivities -->
                <template v-if="selectedSubject === 'Sensitivities'">
                    <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                        <div class="field-label is-normal">
                            <label class="label">Order</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="sensitivityOrder">
                                            <option>First</option>
                                            <option>Second</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="sensitivityOrder === 'Second'">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Orbit</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="secondOrderOrbit" v-on:change="setSecondOrderSensitivities">
                                                <option v-for="orbit in orbitList" v-html="orbit"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                            <div class="field-label is-normal">
                                <label class="label">Instrument</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="secondOrderInstrument" v-on:change="setSecondOrderSensitivities">
                                                <option v-for="instrument in instrumentList" v-html="instrument"></option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Results</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="numSensitivitiesToShow">
                                            <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                                            <option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
                <!-- Sensitivities -->



                <template v-if="selectedSubject === 'Design Space'">
                    Design Space
                </template>
                <template v-if="selectedSubject === 'Objective Space'">
                    Objective Space
                </template>
            </div>
        </div>





        <!-- Right Column: This view will depend on the subject selected -->
        <div class="panel-block functionality" style="padding-top: 0px; padding-bottom: 0px;">
            <!-- Features -->
            <template v-if="selectedSubject === 'Features'">
                Features
            </template>


            <!-- Sensitivities -->
            <template v-if="selectedSubject === 'Sensitivities'">
                <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 100%;">
                    <!-- Science -->
                    <div style="padding: 5px; width: 50%; align-items: flex-start;">
                        <div style="text-align: center; font-weight: 500; font-size: medium;">Science (x-axis)</div>
                        <hr style="margin-top: 10px; margin-bottom: 10px;">



                        <template v-if="sensitivityOrder === 'First'">
                            <div v-for="science_min in s1_science_mins">
                                <div><b>Orbit:</b> {{ science_min[0] }}</div>
                                <div><b>Instrument:</b> {{ science_min[1] }}</div>
                                <div><b>Value:</b> {{ science_min[2] }}</div>
                                <hr style="margin-top: 10px; margin-bottom: 10px;">
                            </div>
                        </template>

                        <template v-if="sensitivityOrder === 'Second'">
                            <div v-for="science_min in s2_science_mins">
                                <div><b>Orbit:</b> {{ science_min[0] }}</div>
                                <div><b>Instrument:</b> {{ science_min[1] }}</div>
                                <div><b>Value:</b> {{ science_min[2] }}</div>
                                <hr style="margin-top: 10px; margin-bottom: 10px;">
                            </div>
                        </template>




                    </div>
                    <!-- Cost -->
                    <div style="padding: 5px; width: 50%; align-items: flex-start;">
                        <div style="text-align: center; font-weight: 500; font-size: medium;">
                            Cost (y-axis)
                        </div>
                        <hr style="margin-top: 10px; margin-bottom: 10px;">



                        <template v-if="sensitivityOrder === 'First'">
                            <div v-for="cost_min in s1_cost_mins">
                                <div><b>Orbit:</b> {{ cost_min[0] }}</div>
                                <div><b>Instrument:</b> {{ cost_min[1] }}</div>
                                <div><b>Value:</b> {{ cost_min[2] }}</div>
                                <hr style="margin-top: 10px; margin-bottom: 10px;">
                            </div>
                        </template>

                        <template v-if="sensitivityOrder === 'Second'">
                            <div v-for="cost_min in s2_cost_mins">
                                <div><b>Orbit:</b> {{ cost_min[0] }}</div>
                                <div><b>Instrument:</b> {{ cost_min[1] }}</div>
                                <div><b>Value:</b> {{ cost_min[2] }}</div>
                                <hr style="margin-top: 10px; margin-bottom: 10px;">
                            </div>
                        </template>





                    </div>
                </div>
            </template>


            <!-- Design Space -->
            <template v-if="selectedSubject === 'Design Space'">
                Design Space
            </template>
            <!-- Objective Space -->
            <template v-if="selectedSubject === 'Objective Space'">
                Objective Space
            </template>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';
    import {fetchPost} from "../scripts/fetch-helpers";

    export default {
        name: "teacher-agent",

        data() {
            return {
                orbSenstivityHTML: 'Orbit: ',
                instSensitivityHTML: 'Instrument: ',
                sensitivityValueHTML: 'Value: ',

            }
        },


        computed: {
            selectedSubject: {
                get() {
                    return this.$store.state.teacherAgent.selectedSubject;
                },
                set(newSubject) {
                    this.$store.commit('setSubject', newSubject);
                }
            },
            sensitivityOrder: {
                get() {
                    return this.$store.state.teacherAgent.sensitivityOrder;
                },
                set(sensitivityOrder) {
                    this.$store.commit('setSensitivityOrder', sensitivityOrder);
                }
            },
            numSensitivitiesToShow: {
                get() {
                    return this.$store.state.teacherAgent.numSensitivitiesToShow;
                },
                set(numSensitivitiesToShow) {
                    this.$store.commit('setNumSensitivitiesToShow', numSensitivitiesToShow);
                }
            },
            orbitList: {
                get() {
                    return this.$store.state.teacherAgent.orbitList;
                }
            },
            instrumentList: {
                get() {
                    return this.$store.state.teacherAgent.instrumentList;
                }
            },
            secondOrderOrbit: {
                get() {
                    return this.$store.state.teacherAgent.secondOrderOrbit;
                },
                set(secondOrderOrbit) {
                    this.$store.commit('setSecondOrderOrbit', secondOrderOrbit);
                }
            },
            secondOrderInstrument: {
                get() {
                    return this.$store.state.teacherAgent.secondOrderInstrument;
                },
                set(secondOrderInstrument) {
                    this.$store.commit('setSecondOrderInstrument', secondOrderInstrument);
                }
            },






            s1_science_mins: {
                get() {
                    return this.$store.state.teacherAgent.s1_science_mins;
                },
            },
            s1_cost_mins: {
                get() {
                    return this.$store.state.teacherAgent.s1_cost_mins;
                },
            },
            s2_science_mins: {
                get() {
                    return this.$store.state.teacherAgent.s2_science_mins;
                },
            },
            s2_cost_mins: {
                get() {
                    return this.$store.state.teacherAgent.s2_cost_mins;
                },
            },

        },


        methods: {

            //--> This method will send the subject request over to daphne
            teachSubject(){
                console.log("In TeacherAgent.vue --> method: teachSubject");
                this.$store.dispatch('getSubjectInformation');
            },
            setSecondOrderSensitivities(){
                console.log("In TeacherAgent.vue --> method: setSecondOrderSensitivities");
                this.$store.dispatch('actionComputeSecondOrderSensitivities');
            }




        }






    }
</script>










<style scoped>

</style>