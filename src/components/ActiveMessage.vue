<template>
    <article class="message is-info">
        <div class="message-header">
            <p>Info</p>
            <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
           {{ message }}
        </div>
    </article>
</template>

<script>
    export default {
        name: "ActiveMessage",
        data() {
            return {
                'message': "Hi!"
            }
        }
    }
</script>

<style scoped>

</style>