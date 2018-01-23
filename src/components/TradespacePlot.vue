<template>
    <div class="column">
        <section class="panel">
            <p class="panel-heading">
                Tradespace exploration |
                Number of designs:
                <span id="num_architectures"></span> |
                Number of targeted designs:
                <span id="num_selected_architectures"></span>
            </p>
            <div class="panel-block" id="main_plot_block">
                <div id="main_plot"></div>
                <div id="selections_block">
                    <div class="card" id="interaction_modes">
                        <header class="card-header">
                            <p class="card-header-title">
                                Mouse Selection
                            </p>
                        </header>
                        <div class="card-content control is-small">
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Zoom/Pan: This option allows zooming/panning on the scatter plot</span>-->
                                <label class="radio">
                                    Zoom/Pan:
                                    <input type="radio" name="mouse-selection" value="zoom-pan" checked />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Drag-select: This option allows selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Drag-select:
                                    <input type="radio" name="mouse-selection" value="drag-select" />
                                </label>
                            </div>
                            <div class="tooltip">
                                <!--<span class="tooltiptext">Deselect: This option allows de-selecting designs by dragging over points</span>-->
                                <label class="radio">
                                    Deselect:
                                    <input type="radio" name="mouse-selection" value="de-select" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content is-small">
                            <div class="field">
                                <p class="control">
                                    <button class="button" id="cancel_selection">Cancel all selections</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'tradespace-plot',
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>