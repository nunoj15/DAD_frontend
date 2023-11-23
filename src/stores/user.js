import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
export const useUserStore = defineStore('user', () => {
    const axios = inject('axios')
    const serverBaseUrl = inject('serverBaseUrl')
    const user = ref(null)

    async function loadUser () {
        try {
            const response = await axios.get('users/me')
            user.value = response.data.data
        } catch (error) {
            clearUser()
            throw error
        }
    }
    function clearUser () {
        user.value = null
    }
    async function login(credentials) {
        try {
            const response = await axios.post('login', credentials.value);
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token;
            await loadUser()
            return true
        } catch (error) {
            clearUser()
            return false
        }
    };
    async function logout(){
        try {
            await axios.post('logout')
            clearUser()
            return true
        }catch (error) {
            return false
        }
    }
    return {user, loadUser, clearUser, login, logout }
})