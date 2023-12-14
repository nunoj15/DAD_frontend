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
   
      
    
    return {user, loadUser, clearUser }
})