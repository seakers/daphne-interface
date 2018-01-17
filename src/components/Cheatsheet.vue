<template>
    <div class="panel-block">
        <div class="select is-fullwidth">
            <select>
                <option value="" selected></option>
                <option value="general">General</option>
                <option value="ifeed">iFEED</option>
                <option value="vassar">VASSAR</option>
                <option value="critic">Critic</option>
                <option value="historian">Historian</option>
                <option value="measurements">Measurements</option>
                <option value="missions">Missions</option>
                <option value="technologies">Technologies</option>
                <option value="objectives">Objectives</option>
            </select>
        </div>
    </div>
    <div class="panel-block functionality">
        <p>Choose one of the different cheatsheets available for Daphne</p>
    </div>
</template>

<script>
    export default {
        name: "cheatsheet"
    }
</script>

<style scoped>

</style>