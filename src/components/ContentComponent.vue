<template>
    <div>
      <h2>Content Component</h2>
      <VCardComponent v-if="isAuthenticated" />
      <div v-else>
        <p>Please log in to view content.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import VCardComponent from './VCardComponent.vue';
  
  const isAuthenticated = ref(false);
  
  // Check if the user is authenticated
  const checkAuthentication = () => {
    const authToken = localStorage.getItem('token');
    isAuthenticated.value = !!authToken; 
  };
  
  checkAuthentication();
  </script>
  