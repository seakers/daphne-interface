'use strict';

import Vue from 'vue';
import DetailsPanel from './components/DetailsPanel';
import store from './details_store';


// Styles
import './styles/details.scss';

let details = new Vue({
    el: '#details',
    store,
    render: h => h(DetailsPanel)
});
