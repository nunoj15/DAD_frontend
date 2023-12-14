<template>
  <div class="mb-3 d-flex justify-content-between flex-wrap" style="color: white; padding-bottom: 10px;">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="filterPhoneNumber" class="form-label">Filter by Phone Number:</label>
      <input type="text" class="form-control filter-input" v-model="filterByPhoneNumber" id="filterPhoneNumber">
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="filterByEmail" class="form-label">Filter by Email:</label>
      <input type="text" class="form-control filter-input" v-model="filterByEmail" id="filterByEmail">
    </div>
  </div>

  <hr />

  <table class="table">
    <thead>
      <tr>
        <th>Phone Number</th>
        <th>Name</th>
        <th>Email</th>
        <th v-if="canViewAdminData(user.id)" class="align-middle">Blocked?</th>
        <th v-if="canViewAdminData(user.id)" class="align-middle">Balance</th>
        <th v-if="canViewAdminData(user.id)" class="align-middle">Max Debit</th>
        <th v-if="canViewAdminData(user.id)" class="align-middle">ADMIN OPTIONS</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vcard in filteredVcards" :key="vcard.id">
        <td>{{ vcard.phone_number }}</td>
        <td >{{ vcard.name }}</td>
        <td>{{ vcard.email }}</td>
        <td v-if="canViewAdminData(user.id)" class="align-middle">
          {{ vcard.blocked == 1 ? 'Yes' : 'No'}}
        </td>
        <td v-if="canViewAdminData(user.id)" class="align-middle">{{ vcard.balance }}</td>
        <td v-if="canViewAdminData(user.id)" class="align-middle">{{ vcard.max_debit }}</td>
        <td v-if="canViewAdminData(user.id)" class="align-middle" style="text-align: justify;">
          <v-btn style="background-color: red;">Block</v-btn>
          <v-btn style="background-color: gray;"><i class="bi bi-lock-fill"></i>Delete</v-btn>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user.js';

const currentPage = ref(1);
const vcards = ref([]);
let user = ref(null);

const filterByPhoneNumber = ref('');
const filterByEmail = ref('');

const canViewAdminData = (userId) => {
  if (!userId) {
    return false;
  }
  console.log(user.type)
  //return user.type == 'A'
  return true;
}

const filteredVcards = computed(() => {
  return vcards.value.filter((vcard) => {
    const phoneNumberMatch = vcard.phone_number.toLowerCase().includes(filterByPhoneNumber.value.toLowerCase());
    const emailMatch = vcard.email.toLowerCase().includes(filterByEmail.value.toLowerCase());

    return phoneNumberMatch && emailMatch;
  });
});

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

    vcards.value = response.data.data; // Extract the array part from the response

    currentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error fetching vcards', error);
  }
};

onMounted(() => {
  loadPage(currentPage.value);
});
user = JSON.parse(localStorage.getItem('user'));
</script>

<style>
.table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  color: black;
  margin-top: 10px;
  text-align: center;
  border-collapse: collapse;
}

.table td,
.table th {
  border: 1px solid #ddd;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  width:auto;
}

.table tr {
  background-color: #f2f2f2;
}

.table tr:hover {
  background-color: #ddd;
}

.table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
  text-align: center;
  width:auto;
}

.filter-input {
  border: 1px solid #ccc;
  width: 100%; /* Make the text boxes span the full width */
  background-color: white; /* Set the background color to white */
  color: black; /* Set the text color to black */
}

.button {
  width: 35px !important;
  height: 35px !important;
  font-size: 10px;
  border-radius: 10%;
}

</style>

