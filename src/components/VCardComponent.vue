<template>
    <div>
      <ul>
        <li v-for="vcard in vcards.data" :key="vcard.id">
          {{ vcard.name }} - {{ vcard.phone_number }}
        </li>
      </ul>
  
      <div>
        <button @click="loadPage(currentPage.value - 1)" :disabled="currentPage.value === 1">Previous</button>
        <span>Page {{ currentPage.value }} of {{ vcards.last_page }}</span>
        <button @click="loadPage(currentPage.value + 1)" :disabled="currentPage.value === vcards.last_page">Next</button>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const currentPage = ref(1);
const vcards = ref([]);

const loadPage = async (page) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('Authentication token not found.');
      return;
    }

    const response = await axios.get(`/vcards?page=${page}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    vcards.value = response.data;
    currentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error fetching vcards', error);
  }
};

onMounted(() => {
  loadPage(currentPage.value);
});
</script>
  