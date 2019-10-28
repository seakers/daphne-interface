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
                            <label class="label">Analysis</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="sensitivityOrder">
                                            <option>First Order</option>
                                            <option>Second Order</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="sensitivityOrder === 'Second Order'">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Orbit</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="sensitivityOrbit" v-on:change="setSecondOrderSensitivities">
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
                                            <select v-model="sensitivityInstrument" v-on:change="setSecondOrderSensitivities">
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
                            <label class="label">Objective</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="sensitivitiesObjective">
                                            <option>Science</option><option>Cost</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Results</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="numSensitivitiesToShow">
                                            <option>5</option><option>7</option><option>10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
                <!-- Sensitivities -->




                <!-- Design Space -->
                <template v-if="selectedSubject === 'Design Space'">
                    <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                        <div class="field-label is-normal">
                            <label class="label">Analysis</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="designSpaceLevel">
                                            <option>Level One</option>
                                            <option>Level Two</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template v-if="designSpaceLevel === 'Level Two'">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Orbit</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="designSpaceOrbit" v-on:change="setSecondLevelDesignSpace">
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
                                            <select v-model="designSpaceInstrument" v-on:change="setSecondLevelDesignSpace">
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
                                        <select v-model="numDesignSpaceToShow">
                                            <option>5</option><option>7</option><option>10</option><option>15</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </template>
                <!-- Design Space -->


                <!-- Objective Space -->
                <template v-if="selectedSubject === 'Objective Space'">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">Objective</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="objectiveSpaceObjective">
                                            <option>Science</option>
                                            <option>Cost</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 8px;">
                        <div class="field-label is-normal">
                            <label class="label">ParetoRank</label>
                        </div>
                        <div class="field-body">
                            <div class="field is-narrow">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="objectiveSpaceParetoRanking">
                                            <option>0</option><option>3</option><option>5</option><option>10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
                <!-- Objective Space -->


            </div>
        </div>
        <!-- Left Column: Topic interface ----------------------------------------------------------------------------------------------------------------------------------------------->
        <!-- Left Column: Topic interface ----------------------------------------------------------------------------------------------------------------------------------------------->
        <!-- Left Column: Topic interface ----------------------------------------------------------------------------------------------------------------------------------------------->
        <!-- Left Column: Topic interface ----------------------------------------------------------------------------------------------------------------------------------------------->




        <!-- Right Column: This view will depend on the subject selected -->
        <div class="panel-block functionality" style="padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;">


            <!-- Features -->
            <template v-if="selectedSubject === 'Features'">
                Features
            </template>
            <!-- Features -->



            <!-- Sensitivities -->
            <template v-if="selectedSubject === 'Sensitivities'">

                <div style="padding: 5px; width: 100%; align-items: flex-start; overflow-y: auto;" ref="sensitivitiesChartArea">

                    <template v-if="sensitivityOrder === 'First Order'">
                        <template v-if="sensitivitiesObjective === 'Science'">

                            <vue-plotly :data="s1_science_plot" :layout="s1_science_plot_layout" :options="{displayModeBar: false}"/>

                        </template>
                        <template v-if="sensitivitiesObjective === 'Cost'">

                            <vue-plotly :data="s1_cost_plot" :layout="s1_cost_plot_layout" :options="{displayModeBar: false}"/>

                        </template>
                    </template>

                    <template v-if="sensitivityOrder === 'Second Order'">
                        <template v-if="sensitivitiesObjective === 'Science'">

                            <vue-plotly :data="s2_science_plot" :layout="s2_science_plot_layout" :options="{displayModeBar: false}"/>

                        </template>
                        <template v-if="sensitivitiesObjective === 'Cost'">

                            <vue-plotly :data="s2_cost_plot" :layout="s2_cost_plot_layout" :options="{displayModeBar: false}"/>

                        </template>
                    </template>

                </div>

            </template>
            <!-- Sensitivities -->



            <!-- Design Space -->
            <template v-if="selectedSubject === 'Design Space'">

                <!-- Historgam -->
                <div style="padding: 5px; width: 100%; align-items: flex-start; overflow-y: auto;" ref="designSpaceChartArea">
                    <template v-if="designSpaceLevel === 'Level One'">
                        <vue-plotly :data="level_one_design_space_plot" :layout="level_one_design_space_plot_layout" :options="{displayModeBar: false}"/>
                    </template>
                    <template v-if="designSpaceLevel === 'Level Two'">
                        <vue-plotly :data="level_two_design_space_plot" :layout="level_two_design_space_plot_layout" :options="{displayModeBar: false}"/>
                    </template>

                </div>

            </template>
            <!-- Design Space -->



            <!-- Objective Space -->
            <template v-if="selectedSubject === 'Objective Space'">

                <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 100%;">

                    <div style="display: flex; flex-direction: row; flex-grow: 1; overflow: auto; width: 70%;" ref="objectiveSpacePlotDiv">
                        <vue-plotly :data="objectiveSpacePlot" :layout="objectiveSpacePlotLayout" :options="{displayModeBar: false}" v-on:click="getObjectiveGroupInfo"/>
                    </div>


                    <div style="display: flex; flex-direction: column; flex-grow: 1; overflow: auto; width: 30%;">
                        <template v-if="objectiveGroupSelected === false">
                        </template>

                        <template v-else>
                            <div style="text-align: center;padding-top: 7px; padding-bottom: 8px; border-bottom: 1px solid #dbdbdb;"><b>{{ objectiveGroupName }}</b></div>
                            <div style="padding-top: 10px; padding-left: 5%;">Designs: {{ objectiveGroupNumDesigns }}</div>


                        </template>
                    </div>

                </div>

            </template>



        </div>


    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';
    import {fetchPost} from "../scripts/fetch-helpers";
    import VuePlotly from '@statnett/vue-plotly'

    export default {
        name: "teacher-agent",

        components: {
            VuePlotly
        },


        computed: {

            ...mapGetters({
                plotData: 'getPlotData',
                selectedArchs: 'getSelectedArchs',
                features: 'getFeatures',
                scores: 'getScores'
            }),


            //--> Other Getters
            selectedSubject: {
                get() {
                    return this.$store.state.teacherAgent.selectedSubject;
                },
                set(newSubject) {
                    this.$store.commit('setSubject', newSubject);
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





            // ---------------------------------------------------------
            // ---------------------------------------------------------
            // -------------------- OBJECTIVE SPACE --------------------
            // ---------------------------------------------------------
            // ---------------------------------------------------------
            objectiveSpaceObjective: {
                get() {
                    return this.$store.state.teacherAgent.objectiveSpaceObjective;
                },
                set(objectiveSpaceObjective) {
                    this.$store.commit('setObjectiveSpaceObjective', objectiveSpaceObjective);
                }
            },

            objectiveSpaceParetoRanking: {
                get() {
                    return this.$store.state.teacherAgent.objectiveSpaceParetoRanking;
                },
                set(objectiveSpaceParetoRanking) {
                    this.$store.commit('setObjectiveSpaceParetoRanking', objectiveSpaceParetoRanking);
                }
            },

            objectiveSpacePlot: {
                get() {
                    return this.$store.state.teacherAgent.objective_space_plot;
                },
            },

            objectiveSpacePlotLayout: {
                get() {
                    return this.$store.state.teacherAgent.objective_space_plot_layout;
                },
            },

            objectiveGroupSelected: {
                get() {
                    return this.$store.state.teacherAgent.objectiveGroupSelected;
                },
                set(objectiveGroupSelected) {
                    this.$store.commit('setObjectiveGroupSelected', objectiveGroupSelected);
                }
            },

            objectiveSpacePlotWidth: {
                get() {
                    return this.$store.state.teacherAgent.objectiveSpacePlotWidth;
                },
                set(objectiveSpacePlotWidth) {
                    this.$store.commit('setObjectiveSpacePlotWidth', objectiveSpacePlotWidth);
                }
            },

            objectiveSpacePlotHeight: {
                get() {
                    return this.$store.state.teacherAgent.objectiveSpacePlotHeight;
                },
                set(objectiveSpacePlotHeight) {
                    this.$store.commit('setObjectiveSpacePlotHeight', objectiveSpacePlotHeight);
                }
            },

            objectiveGroupData: {
                get() {
                    return this.$store.state.teacherAgent.objectiveGroupData;
                }
            },

            objectiveGroupName: {
                get() {
                    return this.$store.state.teacherAgent.objectiveGroupName;
                },
                set(objectiveGroupName) {
                    this.$store.commit('setObjectiveGroupName', objectiveGroupName);
                }
            },

            objectiveGroupNumDesigns: {
                get() {
                    return this.$store.state.teacherAgent.objectiveGroupNumDesigns;
                },
                set(objectiveGroupNumDesigns) {
                    this.$store.commit('setObjectiveGroupNumDesigns', objectiveGroupNumDesigns);
                }
            },









            // -------------------------------------------------------
            // -------------------------------------------------------
            // -------------------- SENSITIVITIES --------------------
            // -------------------------------------------------------
            // -------------------------------------------------------
            sensitivityOrder: {
                get() {
                    return this.$store.state.teacherAgent.sensitivityOrder;
                },
                set(sensitivityOrder) {
                    this.$store.commit('setSensitivityOrder', sensitivityOrder);
                }
            },
            sensitivityOrbit: {
                get() {
                    return this.$store.state.teacherAgent.secondOrderOrbit;
                },
                set(secondOrderOrbit) {
                    this.$store.commit('setSecondOrderOrbit', secondOrderOrbit);
                }
            },
            sensitivityInstrument: {
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

            s1_cost_plot: {
                get() {
                    return this.$store.state.teacherAgent.s1_cost_plot;
                },
            },
            s1_cost_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.s1_cost_plot_layout;
                },
            },
            s1_science_plot: {
                get() {
                    return this.$store.state.teacherAgent.s1_science_plot;
                },
            },
            s1_science_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.s1_science_plot_layout;
                },
            },
            s2_cost_plot: {
                get() {
                    return this.$store.state.teacherAgent.s2_cost_plot;
                },
            },
            s2_cost_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.s2_cost_plot_layout;
                },
            },
            s2_science_plot: {
                get() {
                    return this.$store.state.teacherAgent.s2_science_plot;
                },
            },
            s2_science_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.s2_science_plot_layout;
                },
            },

            sensitivitiesObjective: {
                get() {
                    return this.$store.state.teacherAgent.sensitivitiesObjective;
                },
                set(sensitivitiesObjective) {
                    this.$store.commit('setSensitivitiesObjective', sensitivitiesObjective);
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






            // ------------------------------------------------------
            // ------------------------------------------------------
            // -------------------- DESIGN SPACE --------------------
            // ------------------------------------------------------
            // ------------------------------------------------------
            designSpaceLevel: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceLevel;
                },
                set(designSpaceLevel) {
                    this.$store.commit('setDesignSpaceLevel', designSpaceLevel);
                }
            },
            designSpaceOrbit: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceOrbit;
                },
                set(designSpaceOrbit) {
                    this.$store.commit('setDesignSpaceOrbit', designSpaceOrbit);
                }
            },
            designSpaceInstrument: {
                get() {
                    return this.$store.state.teacherAgent.designSpaceInstrument;
                },
                set(designSpaceInstrument) {
                    this.$store.commit('setDesignSpaceInstrument', designSpaceInstrument);
                }
            },

            level_one_design_space_info: {
                get() {
                    return this.$store.state.teacherAgent.level_one_design_space_info;
                },
            },
            level_two_design_space_info: {
                get() {
                    return this.$store.state.teacherAgent.level_two_design_space_info;
                },
            },

            level_one_design_space_plot: {
                get() {
                    return this.$store.state.teacherAgent.level_one_design_space_plot;
                },
            },
            level_two_design_space_plot: {
                get() {
                    return this.$store.state.teacherAgent.level_two_design_space_plot;
                },
            },
            level_one_design_space_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.level_one_design_space_plot_layout;
                },
            },
            level_two_design_space_plot_layout: {
                get() {
                    return this.$store.state.teacherAgent.level_two_design_space_plot_layout;
                },
            },

            numDesignSpaceToShow: {
                get() {
                    return this.$store.state.teacherAgent.numDesignSpaceToShow;
                },
                set(numDesignSpaceToShow) {
                    this.$store.commit('setNumDesignSpaceToShow', numDesignSpaceToShow);
                }
            },





        },




        methods: {

            //--> This method will send the subject request over to daphne
            teachSubject(){

                console.log("In TeacherAgent.vue --> method: teachSubject");

                //--> Set all the plot data - this includes all the data for all the architectures
                this.$store.commit('setPlotData', this.plotData);

                //--> Get the appropriate information for each subject
                this.$store.dispatch('getSubjectInformation');


                if(this.$store.state.teacherAgent.selectedSubject === 'Objective Space'){
                    //console.log(this.$refs.objectiveSpacePlotDiv.clientHeight);
                }
            },
            setSecondOrderSensitivities(){
                console.log("In TeacherAgent.vue --> method: setSecondOrderSensitivities");
                this.$store.dispatch('actionComputeSecondOrderSensitivities');
            },
            setSecondLevelDesignSpace(){
                console.log("In TeacherAgent.vue --> method: setSecondLevelDesignSpace");
                this.$store.dispatch('actionComputeSecondLevelDesignSpace');
            },
            getObjectiveGroupInfo(data) {
                console.log("reached");
                console.log(this.objectiveGroupData);

                let groupSelected = data['points']['0']['data']['name'];

                if(data['points']['0']['data']['name'] === undefined) {
                    console.log('Reset');
                }

                //this.$store.commit('setObjectiveGroupName', groupSelected);
                this.$store.commit('setObjectiveGroupSelected', true);
                this.$store.dispatch('actionObjectiveGroupRequest', groupSelected);
            },



            stopProactiveTeacherOnReload() {
                this.$store.dispatch('turnProactiveTeacherOff');
            },

        },

        //--> Functions for the proactive teacher agent
        mounted() {
            //--> We turn off the proactive teacher when the page is closed
            //--> ISSUE --> If the page is RELOADED the teacher thread in daphne_brain will still be RUNNING
            window.addEventListener('unload', this.stopProactiveTeacherOnReload);

            console.log("Teacher Agent mounted, enabling proactive");
            this.$store.dispatch('turnProactiveTeacherOn');
        },
        destroyed() {
            console.log("Teacher Agent destroyed, disabling proactive");
            this.$store.dispatch('turnProactiveTeacherOff');
        },



        watch: {
            numDesignSpaceToShow() {
                this.$store.commit('setLevelOneDesignSpacePlot');
                this.$store.commit('setLevelTwoDesignSpacePlot');
            },


            objectiveSpaceParetoRanking() {
                this.$store.commit('setObjectiveSpacePlot');
            },
            objectiveSpaceObjective() {
                this.$store.commit('setObjectiveSpacePlot');
            }




        }






    }
</script>










<style scoped>

</style>