import './assets/main.css'
import Toaster from "@meforma/vue-toaster"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vuetify } from './vuetify' 
import 'vuetify/dist/vuetify.min.css'
import 'tailwindcss/tailwind.css'
import axios from 'axios'
import { createPinia } from 'pinia'
import store from './socketClient';
import io from 'socket.io-client';
import paymentGatewayStore from './stores/paymentGateway';
//axios.defaults.withCredentials = true;
const apiDomain = import.meta.env.VITE_API_DOMAIN
const wsConnection = import.meta.env.VITE_WS_CONNECTION
const serverBaseUrl = 'http://localhost:8000'

const app = createApp(App)

app.provide('serverBaseUrl',`${apiDomain}/api`)

app.provide('serverBaseUrl', serverBaseUrl)
// Default Axios configuration
axios.defaults.baseURL = apiDomain + '/api'
//axios.defaults.headers.common['Content-type'] = 'application/json'

app.use(Toaster, {
    // Global/Default options
    position: 'top',
    timeout: 3000,
    pauseOnHover: true
})
app.use(paymentGatewayStore);
app.provide('toast', app.config.globalProperties.$toast)
app.use(createPinia())


app.use(router)

app.use(vuetify)  // Use o Vuetify no app

const userEmail = JSON.parse(localStorage.getItem('user'));

let socket = io(wsConnection)
app.provide('socket', socket)

if(userEmail){
    socket.emit('WebClientConnectInit', {
        identifier: userEmail.username,
      });
}

app.mount('#app')
