<template>
<div class="d-flex justify-center">
  <v-form
      class="row g-3 needs-validation"
      novalidate
      @submit.prevent="login">
    <v-card
      name="viewport"
      class="mx-auto pa-12 pb-8 justify-center"
      elevation="8"
      width="450"
      height="450"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="credentials.email"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

    
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        v-model="credentials.password"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
      </v-card>

      <v-btn
        block
        class="mb-8"
        color="green"
        size="large"
        variant="tonal"
        @click="login"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <router-link to="/register" class="text-green text-decoration-none">
        <a
          class="text-green text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </router-link>
      </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
import { ref, inject} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import axios from 'axios';
import { provide } from 'vue';
const toast = inject('toast')
import { useUserStore } from '../stores/user.js'
import io from 'socket.io-client';
provide('axios', axios);
const credentials = ref({
  email: '',
  password: ''
})
const userStore = useUserStore()
const emit = defineEmits(['login'])
const socket = inject("socket")
const login = async () => {
  try {
    const response = await axios.post('login', credentials.value);
    
    toast.success('User ' + credentials.value.email + ' has entered the application.');
    localStorage.setItem('token', response.data.access_token)
    
    if (axios && axios.defaults) {
      axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token;
      console.log("")
    }
    
    
    let email = credentials.value.email.toString()
    const newSocket = io('http://localhost:3000', { query: { socketId: email } });
    app.provide('socket', newSocket);
    socket.emit('WebClientConnectInit', {
      identifier: email,
    });
    emit('login');
    router.push('/');
  } catch (error) {
    console.log(error)
    if (axios && axios.defaults) {
      delete axios.defaults.headers.common.Authorization;
    }

    credentials.value.password = '';
    toast.error('User credentials are invalid!');
  }
};

</script>

<style scoped>
  
</style>

