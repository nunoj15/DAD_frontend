<template>
    <div>
  
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
          v-model="name"
        ></v-text-field>
  
        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
        ></v-text-field>
  
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          v-model="password"
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
          @click="register"
        >
          Register
        </v-btn>
  
        <v-card-text class="text-center">
          <router-link to="/login" class="text-green text-decoration-none">
            Already have an account? Log in <v-icon icon="mdi-chevron-right"></v-icon>
          </router-link>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        visible: false,
      };
    },
    methods: {
      async register() {
        // Reset previous error message
        this.error = null;
  
        // Client-side validation
        if (!this.name || !this.email || !this.password) {
          this.error = 'Please enter all required fields.';
          return;
        }
  
        try {
          const response = await axios.post('/api/register', {
            name: this.name,
            email: this.email,
            password: this.password,
          });
  
          // Assuming your Laravel backend returns a token on successful registration
          const token = response.data.access_token;
  
          // Log the token for now (you may want to store it securely)
          console.log('Registration successful! Token:', token);
  
          // Redirect or perform any additional actions after successful registration
        } catch (error) {
          // Handle registration error
          if (error.response) {
            // The request was made, but the server responded with a non-2xx status code
            this.error = error.response.data.message || 'Registration failed.';
          } else if (error.request) {
            // The request was made but no response was received
            this.error = 'No response from the server.';
          } else {
            // Something happened in setting up the request that triggered an Error
            this.error = 'An unexpected error occurred.';
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  