import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
export const useUserStore = defineStore('user', () => {
    const serverBaseUrl = inject('serverBaseUrl')
    const user = ref(null)

    const userId = computed(() => user.value?.id ?? -1)

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
    async function logout() {
        try {
          const authToken = localStorage.getItem('token');
          if (!authToken) {
            console.error('Authentication token not found.');
            return false;
          }
      
          await axios.post('/logout', null, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
      
          clearUser();
      
          localStorage.removeItem('token');
      
          router.push({ name: 'login' });
      
          return true;
        } catch (error) {
          console.error('Logout failed', error);
          return false;
        }
      }
      
    
    return {user, loadUser, clearUser, login, logout }
})