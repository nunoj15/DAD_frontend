<template>
    <div class="d-flex justify-center">
      <v-form class="row g-3 needs-validation" novalidate @submit.prevent="login">
        <v-card name="viewport" class="mx-auto pa-12 pb-8 justify-center" elevation="8" width="450" height="450"
          rounded="lg">
          <div class="text-subtitle-1 text-medium-emphasis">Account</div>
  
          <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
            variant="outlined" v-model="credentials.email"></v-text-field>
  
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password
          </div>
  
          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
            variant="outlined" v-model="credentials.password" @click:append-inner="visible = !visible"></v-text-field>
  
          <v-card class="mb-12" color="surface-variant" variant="tonal">
          </v-card>
  
          <v-btn block class="mb-8" color="green" size="large" variant="tonal" @click="login">
            Log In
          </v-btn>
  
          <v-card-text class="text-center">
            <router-link to="/register">
              <v-btn color="green">Sign up now</v-btn>
            </router-link>
          </v-card-text>
        </v-card>
      </v-form>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, onMounted, provide, inject } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const toast = inject('toast');
  const socket = inject("socket")
  const visible = ref(false);
  
  provide('axios', axios);
  
  const credentials = ref({
    email: '',
    password: ''
  });
  
  const emit = defineEmits(['login']);
  
  const login = async () => {
    try {
      const response = await axios.post('/login', credentials.value);

      toast.success('User ' + credentials.value.email + ' has entered the application.');
      localStorage.setItem('token', response.data.access_token);

      if (axios && axios.defaults) {
        axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.access_token;
      }

      const user  = await axios.get('/users/me')
      console.log(user)
      localStorage.setItem('user', JSON.stringify(user?.data?.usuario))

      let email = credentials.value.email.toString()
      socket.emit('WebClientConnectInit', {
        identifier: email,
        sockeId: localStorage.getItem('socketId')
      });

      socket.on('ReceveidConnectInit', (data) => {
      console.log('Mensagem recebida do servidor:', data);
        localStorage.setItem('socketId', data)
      });
  
      emit('login');
      router.push('/');
      location.reload();
    } catch (error) {
      if (axios && axios.defaults) {
        delete axios.defaults.headers.common.Authorization;
      }
  
      credentials.value.password = '';
      toast.error('User credentials are invalid!');
    }
  };
  
  onMounted(() => {
  });
  
  </script>
  
  <style scoped>
  </style>
  