<template>
    <div class="table-container">
        <div class="filter-section">
            <div class="filter-div" style="display: flex;">
                <input type="text" class="form-control filter-input" placeholder="Filter by Email" v-model="filterByEmail"
                    id="filterByEmail">
            </div>
            <router-link to="/createadmin">
                <v-btn style="background-color: rgb(32, 179, 166);">Add Admin</v-btn>
            </router-link>
        </div>

        <hr />

        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin?</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ isAdmin(user) == "True" ? "Yes" : "No" }}</td>
                    <td style="max-width: 100px;">
                        <v-btn v-if="isAdmin(user) == 0" style="background-color: green;">Make Admin</v-btn>
                        <v-btn v-if="isAdmin(user) == 1" @click="deleteClick(user)"
                            style="background-color: rgb(204, 81, 81); color: white;">Remove
                            Admin</v-btn>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, inject } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useToast } from "vue-toastification"
const serverBaseUrl = inject("serverBaseUrl");

const toast = useToast()
const currentPage = ref(1);
const users = ref([]);

const filterByEmail = ref('');

const filteredUsers = computed(() => {
    console.log(users);
    return users.value.filter((user) => {
        const emailMatch = user.email.toLowerCase().includes(filterByEmail.value.toLowerCase());

        return emailMatch;
    });
});

const isAdmin = (user) => {
    if (!user) {
        return false;
    }
    return user.user_type == "A"
}

const deleteClick = async (user) => {
    try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('Authentication token not found.');
            return;
        }

        const response = await axios.delete(`/users/${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        console.log(response.data);
        loadPage(currentPage.value);
    } catch (error) {
        console.error('Error Delete:', error);
    }
}

const loadPage = async (page) => {
    try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('Authentication token not found.');
            return;
        }

        const response = await axios.get(`/users?page=${page}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        users.value = response.data; // Extract the array part from the response

        currentPage.value = response.data.current_page;
    } catch (error) {
        toast.error('Error fetching vcards', error);
    }
};

onMounted(() => {
    loadPage(currentPage.value);
});

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

.img_photo {
    width: 3.2rem;
    height: 3.2rem;
}
</style>

