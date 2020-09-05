'use strict';

import Vue from 'vue';
import Scheduler from './components/Scheduler';
import store from './scheduler_store';


// Styles
import './styles/details.scss';

let scheduler = new Vue({
    el: '#scheduler',
    store,
    render: h => h(Scheduler)
});
