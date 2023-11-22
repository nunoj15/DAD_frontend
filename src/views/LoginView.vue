<template>
<div class="d-flex justify-center">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
      visible: false
    };
  },
  methods: {
    async login() {
      // Reset previous error message
      this.error = null;

      // Client-side validation
      if (!this.email || !this.password) {
        this.error = 'Please enter both email and password.';
        return;
      }

      try {
        const response = await this.$axios.post('/login', {
          email: this.email,
          password: this.password,
        });

        const token = response.data.access_token;
        if (!token) {
          this.error = 'Invalid response from the server.';
          return;
        }

        // Log the token for now (you may want to store it securely)
        console.log('Login successful!');

        // Redirect or perform any additional actions after successful login
        toast.success('Login successful!');
      } catch (error) {
        // Handle login error
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          this.error = error.response.data.message || 'Login failed.';
          toast.error('Login failed.');
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
  
</style>

