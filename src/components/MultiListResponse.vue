<template>
    <div>
        <p v-html="response.begin"></p>
        <ul>
            <li v-for="element in response.list">
                <span v-html="element.text"></span>
                <ul>
                    <li v-for="subelement in element.subitems" v-html="subelement"></li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'multilist-response',
        props: ['response'],
    }
</script>

<style scoped>

</style>