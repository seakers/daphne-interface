import Vue from 'vue';
import ProblemFormulation from './components/ProblemFormulation.vue';

// Get problem parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const problem = urlParams.get('problem') || '';

new Vue({
    el: '#problem',
    render: h => h(ProblemFormulation, {
        props: {
            problemName: problem
        }
    })
});

