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
//axios.defaults.withCredentials = true;

const app = createApp(App)

const serverBaseUrl = 'http://localhost:8000'
app.provide('serverBaseUrl', serverBaseUrl)
// Default Axios configuration
axios.defaults.baseURL = serverBaseUrl + '/api'
axios.defaults.headers.common['Content-type'] = 'application/json'

app.use(Toaster, {
    // Global/Default options
    position: 'top',
    timeout: 3000,
    pauseOnHover: true
})
app.provide('toast', app.config.globalProperties.$toast)
app.use(createPinia())

app.use(router)

app.use(vuetify)  // Use o Vuetify no app

const userEmail = localStorage.getItem('user');
let socket = io("http://localhost:3000")
app.provide('socket', socket)

if(userEmail){
    socket.emit('WebClientConnectInit', {
        identifier: userEmail,
      });
}

app.mount('#app')
