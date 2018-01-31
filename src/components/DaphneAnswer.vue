<template>
    <div class="panel-block functionality">
        <p>The answers from Daphne will be displayed here.</p>
    </div>
</template>

<script>
    responseOutput = {
        text: this.showText,
        list: this.showList
    };

    function showText(text) {
        return "<div class=\"content\"><p>" + text + "</p></div>";
    }

    function showList(list) {
        let ret = "<div class=\"content\"><p>" + list.begin + "</p>";
        ret += "<ul>";
        list.list.forEach(item => {
            ret += "<li>" + item + "</li>";
        });
        ret += "</ul></div>";
        return ret;
    }

    processResponse(response) {
        $(".daphne_answer > div.panel-block").html(responseOutput[response["visual_answer_type"]](response["visual_answer"]));
    }

    export default {
        name: 'daphne-answer'
    }
</script>

<style scoped>

</style>