<template>
    <v-container>
        <div class="breadCrumb">
            <v-breadcrumbs class="" :items="breadCrumb" divider="-">

            </v-breadcrumbs>
        </div>
        <v-form class="row g-3 needs-validation" novalidate @submit.prevent="create">
            <v-row>
                <v-col cols="12">
                    <v-text-field type="text" v-model="login_data.name" label="Name"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-text-field type="email" v-model="login_data.email" label="Email"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-text-field type="password" v-model="login_data.password" label="Password"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-text-field type="password" v-model="login_data.password_confirmation"
                        label="Confirm the Password"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-btn @click="create" color="green">Create</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { ref, inject } from 'vue'
import axios from 'axios';
const toast = inject('toast')

const router = useRouter()
const userStore = useUserStore()

const login_data = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const errors = ref(null)

const create = async () => {
    try {
        if (login_data.value.password == login_data.value.password_confirmation) {
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                console.error('Authentication token not found.');
                return;
            }
            console.log(login_data)
            // Use vcard as a parameter to get the ID or any other necessary data
            const response = await axios.post(`/users`, {
                name: login_data.value.name,
                email: login_data.value.email,
                password: login_data.value.password,
                user_type: 'A'
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            console.log('Admin Created:', response.data);
            toast.success('Admin created successfully!!!')
        } else {
            toast.error('Please insert equal passwords!!!')
        }
    } catch (error) {
        toast.error('Error creating Admin.')
        console.error('Error creating Admin:', error);
    }
};
</script>

<style lang="scss" scoped>
.breadCrumb {
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    div {
        max-width: 250px;
    }

    button {
        max-width: 250px;
    }
}
</style>
