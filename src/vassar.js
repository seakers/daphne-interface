'use strict';

import Vue from 'vue';
import VassarPage from './components/VassarPage';
import store from './vassar_store';

// Styles
import './styles/app.scss';
import 'shepherd.js/dist/css/shepherd.css';

let vassar = new Vue({
    el: '#vassar',
    store,
    render: h => h(VassarPage)
});
