<template>
    <div>
        <div class="chat-container" style="width: inherit">
            <section ref="chatArea" class="chat-area">
                <div v-for="piece in dialogueHistory" class="chat-message content" :class="{ 'chat-message-user': piece.writer === 'user', 'chat-message-daphne': piece.writer === 'daphne' }">
                    <component v-for="(response, index) in piece['visual_message']" v-bind:is="responseTypes[piece['visual_message_type'][index]]" :response="response" :key="index"></component>
                </div>
            </section>

            <QuestionBar class="sticky-textbox" style="position: relative"></QuestionBar>
        </div>
    </div>
</template>

<script>
    import QuestionBar from "./QuestionBar";
    import TextResponse from './TextResponse';
    import ListResponse from './ListResponse';
    import TimelineResponse from './TimelineResponse';
    import ActiveMessage from "./ActiveMessage";

    import PlotResponse from "./PlotResponse";
    import SensitivityPlot from "./SensitivityPlot";
    import DesignSpacePlot from "./DesignSpacePlot";
    import ObjectiveSpacePlot from "./ObjectiveSpacePlot";
    import FeaturePlot from "./FeaturePlot";
    import QuestionTemplate from "./QuestionTemplate";

    import {mapState} from "vuex";

    export default {
        name: "ChatWindow",
        components: {
            QuestionBar,
            TextResponse,
            ListResponse,
            TimelineResponse,
            ActiveMessage,

            PlotResponse,
            SensitivityPlot,
            DesignSpacePlot,
            ObjectiveSpacePlot,
            FeaturePlot,
            QuestionTemplate,
        },
        data() {
            return {
                responseTypes: {
                    text: 'TextResponse',
                    list: 'ListResponse',
                    timeline_plot: 'TimelineResponse',
                    active_message: 'ActiveMessage',

                    plotly_plot: 'PlotResponse',
                    sensitivity_plot: 'SensitivityPlot',
                    design_space_plot: 'DesignSpacePlot',
                    objective_space_plot: 'ObjectiveSpacePlot',
                    feature_plot: 'FeaturePlot',
                    question_template: 'QuestionTemplate',
                }
            }
        },
        computed: {
            ...mapState({
                dialogueHistory: state => state.daphne.dialogueHistory
            })
        },
        methods: {
        },
        watch: {
            addDialoguePiece: function(val, oldVal) {
                if (this.speakOut) {
                    if (val["writer"] === "daphne") {
                        responsiveVoice.speak(val['voice_answer']);
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../node_modules/bulma/sass/utilities/initial-variables";

    .chat-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .chat-area {
        width: 100%;
        padding: 1em;
        overflow: auto;
        flex-grow: 1;
    }
    .chat-message {
        width: 95%;
        border-radius: 10px;
        padding: .8em;
        margin-bottom: .8em;
    }
    .chat-message-daphne {
        background: $white-ter;
    }
    .chat-message-user {
        margin-left: 5%;
        color: $white;
        background: $cyan;
    }

    .sticky-textbox {
        padding: 1em;
        position: sticky;
        bottom: 0;
    }

</style>