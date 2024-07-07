import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.min.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        iconfont: 'mdi',
    },
})

const app = createApp(App)

app.use(vuetify)
app.use(store)

app.mount('#app')
