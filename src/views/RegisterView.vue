<template>
    <div>
      <v-form class="row g-3 needs-validation" novalidate @submit.prevent="create">
        <v-card
          name="viewport"
          class="mx-auto pa-12 pb-8 justify-center"
          elevation="8"
          width="400"
          height="550"
          rounded="lg"
        >
        <h3 class="text-title-1 text-medium-emphasis">Register</h3> 
        <v-text-field
          density="compact"
          placeholder="Name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          v-model="new_credentials.name"
        ></v-text-field>
  
        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="new_credentials.email"
        ></v-text-field>

        <v-text-field
            density="compact"
            placeholder="Phone number"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            v-model="new_credentials.phone_number"
        ></v-text-field>
  
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          v-model="new_credentials.password"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Confirm your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            v-model="new_credentials.password_confirmation"
            @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Create your confirmation code"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            v-model="new_credentials.confirmation_code"
            @click:append-inner="visible = !visible"
        ></v-text-field>


  
        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <!-- Additional registration fields can be added here -->
        </v-card>
  
        <v-btn
          block
          class="mb-8"
          color="green"
          size="large"
          variant="tonal"
          @click="create"
        >
          Register
        </v-btn>
  
        <v-card-text class="text-center">
          <router-link to="/login" class="text-green text-decoration-none">
            Already have an account? Log in <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-card>
      </v-form>
    </div>
  </template>

<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { ref, inject } from 'vue'
import axios from 'axios';
const toast = inject('toast')

const router = useRouter()

const new_credentials = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone_number: '',
  confirmation_code: ''
})

const errors = ref(null)

const create = async () => {
  try {
    if (new_credentials.value.password == new_credentials.value.password_confirmation) {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Authentication token not found.');
        return;
      }
      console.log(new_credentials)
      // Use vcard as a parameter to get the ID or any other necessary data
      const response = await axios.post(`/users`, {
        name: new_credentials.value.name,
        email: new_credentials.value.email,
        password: new_credentials.value.password,
        phone_number: new_credentials.value.phone_number,
        confirmation_code: new_credentials.value.confirmation_code,
        user_type: 'V'
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Vcard Created:', response.data);
      toast.success('Vcard created successfully!!!')
    } else {
      toast.error('Please insert equal passwords!!!')
    }
  } catch (error) {
    toast.error('Error creating Vcard.')
    console.error('Error creating Vcard:', error);
  }
};
</script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  