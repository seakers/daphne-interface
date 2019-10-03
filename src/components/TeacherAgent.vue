<template>
    <div style="display: flex; flex-direction: column; flex-grow: 1; overflow: auto;">
        <div class="panel-block">


            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Subject</label>
                </div>
                <div class="field-body">
                    <div class="field is-narrow">
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select>
                                    <option>Design Space</option>
                                    <option>Objective Space</option>
                                    <option>Features</option>
                                    <option>Sensitivities</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <div class="panel-block functionality">
            <div class="columns is-gapless">
                <div class="column is-three-fifth">
                    Questions
                </div>
                <div class="column is-two-fifth">
                    Information?
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import * as _ from 'lodash-es';



    export default {
        name: "teacher-agent"
    }
</script>










<style scoped>

</style>