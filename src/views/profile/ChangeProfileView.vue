<template>
  <v-container>
    <v-form
        class="row g-3 needs-validation"
        novalidate
        @submit.prevent="change">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.name" label="Name" ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.email" label="Email" ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.phone_number" label="Phone number" ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.confirmationCode" label="Confirmation code" ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn @click="change" color="green">Change</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { ref, inject } from 'vue'
import axios from 'axios';
const toast = inject('toast')

const router = useRouter()

const profile = ref({
  name: '',
  email: '',
  confirmationCode: '',
  phone_number: '',
})

const errors = ref(null)
let user = JSON.parse(localStorage.getItem('user'))

const change = async () => {
  try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Authentication token not found.');
        return;
      }
      console.log(profile)
      // Use vcard as a parameter to get the ID or any other necessary data
      const response = await axios.put(`/vcards/${user.username}`, {
        name: profile.value.name,
        email: profile.value.email,
        phone_number: profile.value.phone_number,
        confirmation_code: profile.value.confirmationCode,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Vcard Updated:', response.data);
      toast.success('Vcard Updated successfully!!!')

  } catch (error) {
    toast.error('Error updating Vcard.')
    console.error('Error updating Vcard:', error);
  }
};
</script>

<style lang="scss" scoped>
.breadCrumb{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  div{
    max-width: 250px;
  }
  button{
    max-width: 250px;
  }
}
</style>
