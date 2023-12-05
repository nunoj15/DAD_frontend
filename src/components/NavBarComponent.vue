<template>
    <v-app-bar app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
  
      <v-toolbar-title>
        V-Cards
      </v-toolbar-title>
  
      <v-spacer></v-spacer>
  
      <v-row>
        <v-col>
          <v-btn icon @click="redirectToVCards" class="black-button" rounded="0" width="120">
            Ver Cartões
          </v-btn>
        </v-col>
  
        <v-col>
          <v-btn icon @click="logout" class="black-button" rounded="0" width="80">
            Logout
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
  </template>
  
<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import axios from 'axios';
import { ref } from 'vue';


const router = useRouter();
const userStore = useUserStore();
const drawer = ref(false);



const redirectToVCards = () => {
  // Add your logic here
  router.push('/vcards'); // Assuming you have a route for VCards
};

const logout = async () => {
    try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('Authentication token not found.');
            return;
        }

        await axios.post('/logout', null, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        // Clear user data
        userStore.clearUser();

        // Delete the token from local storage
        localStorage.removeItem('token');

        // Redirect to the login page
        router.push({ name: 'login' });
    } catch (error) {
        console.error('Logout failed', error);
    }
};
</script>
  
<style scoped>
.black-button {
  color: #fff; /* Set text color to white */
  background-color: #000; /* Set background color to black */
}</style>
  