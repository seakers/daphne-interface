'use strict';

import Vue from 'vue';
import Details from './components/Details';
import store from './store';


// Styles
import './styles/details.scss';

let details = new Vue({
    el: '#details',
    store,
    render: h => h(Details)
});
