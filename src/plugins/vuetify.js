import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import light from './themes/daphne_light'

Vue.use(Vuetify)



export default new Vuetify({
    theme: {
        dark: false,
        themes: {
            light
        },
    },
})
