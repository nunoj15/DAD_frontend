<template>
  <div class="table-container">
    <div class="filter-section">
      <div class="filter-div">
        <label for="filterPhoneNumber" class="form-label">Filter by Phone Number:</label>
        <input type="text" class="form-control filter-input" v-model="filterByPhoneNumber" id="filterPhoneNumber">
      </div>
      <div class="filter-div">
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
          <th v-if="canViewAdminData(user.id)">Blocked?</th>
          <th v-if="canViewAdminData(user.id)">Balance</th>
          <th v-if="canViewAdminData(user.id)">Max Debit</th>
          <th v-if="canViewAdminData(user.id)">MORE OPTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vcard in filteredVcards" :key="vcard.phone_number">
          <td>{{ vcard.phone_number }}</td>
          <td>{{ vcard.name }}</td>
          <td>{{ vcard.email }}</td>
          <td v-if="canViewAdminData(user.id)">{{ vcard.blocked ? 'Yes' : 'No' }}</td>
          <td v-if="canViewAdminData(user.id)">{{ vcard.balance }}</td>
          <td v-if="canViewAdminData(user.id)">
            <div class="admin-options">
              <input type="text" v-model="vcard.max_debit" style="max-width: 100px;" class="max-debit-input">
              <v-btn @click="saveClick(vcard)" class="save-btn" style="background-color: green;">Save</v-btn>
            </div>
          </td>
          <td v-if="canViewAdminData(user.id)" class="admin-options">
            <v-btn @click="blockClick(vcard)" class="block-btn" style="background-color: red;">{{ vcard.blocked ? 'Unblock'
              : 'Block' }}</v-btn>
            <v-btn @click="deleteClick(vcard)" class="delete-btn" style="background-color: gray;">Delete</v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useToast } from "vue-toastification"

const toast = useToast()
const currentPage = ref(1);
const vcards = ref([]);
let user = ref(null);
let newBlockedState;

const filterByPhoneNumber = ref('');
const filterByEmail = ref('');

const canViewAdminData = (userId) => {
  if (!userId) {
    return false;
  }
  return user.user_type == "A"
}

const filteredVcards = computed(() => {
  return vcards.value.filter((vcard) => {
    // Implement your custom filtering logic here based on filterByPhoneNumber and filterByEmail
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
    toast.error('Error fetching vcards', error);
  }
};

const saveClick = async (vcard) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('Authentication token not found.');
      return;
    }
    console.log(vcard.max_debit)
    // Use vcard as a parameter to get the ID or any other necessary data
    const response = await axios.put(`/vcards/${vcard.phone_number}`, {
      max_debit: vcard.max_debit,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log('Max Debit updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating Max Debit:', error);
  }
};

const blockClick = async (vcard) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.error('Authentication token not found.');
      return;
    }

    const newBlockedState = vcard.blocked == 1 ? 0 : 1; // Toggle the blocked state

    console.log(newBlockedState)

    const response = await axios.put(`/vcards/${vcard.phone_number}`, {
      blocked: newBlockedState,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log('Block/Unblock successful:', response.data);
  } catch (error) {
    console.error('Error Block/Unblock:', error);
  }
};

onMounted(() => {
  loadPage(currentPage.value);
});
user = JSON.parse(localStorage.getItem('user'));
</script>

<style>
.filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  /* Add padding for separation */
}

.filter-div {
  flex-grow: 1;
  margin: 0 10px;
  color: white;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: white;
  /* Set background to white */
  color: black;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: white;
  /* Set background to white */
}

.table th {
  background-color: #04AA6D;
  color: white;
}

.table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.filter-input,
.max-debit-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background-color: white;
}

.admin-options {
  display: flex;
  justify-content: space-between;
}
</style>

