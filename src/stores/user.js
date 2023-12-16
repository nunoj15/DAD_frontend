import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
export const useUserStore = defineStore('user', () => {
    const serverBaseUrl = inject('serverBaseUrl')
    const user = ref(null)

    const userStored = JSON.parse(localStorage.getItem('user'));

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
    async function changePassword(credentials) {
        try {
            let token = localStorage.getItem("token");

            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            if (axios && axios.defaults) {
                axios.defaults.headers.common.Authorization = 'Bearer ' + token;
            }

            if (userStored.id < 0) {
                throw new Error('Anonymous users cannot change the password!');
            }

            const response = await axios.patch(`users/${userStored.id}/password`, credentials);

            // Optionally, you can return the response data if needed
            return response.data;
        } catch (error) {
            // Handle errors or rethrow for the calling code to handle
            console.error('Change password failed:', error.message);
            throw error;
        }
    }



    return {user, loadUser, clearUser, login, logout, userStored , changePassword}
})