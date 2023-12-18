<template>
  <v-container>
    <div class="breadCrumb">
      <v-breadcrumbs
          class=""
          :items="breadCrumb"
          divider="-"
      >

      </v-breadcrumbs>
    </div>
    <v-form
        class="row g-3 needs-validation"
        novalidate
        @submit.prevent="changePassword">
    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="passwords.current_password" label="Old Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="passwords.password" label="New Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="passwords.password_confirmation" label="Confirm the Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn @click="changePassword" color="green">Change</v-btn>
      </v-col>
    </v-row>
  </v-form>
  </v-container>
</template>

<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref } from 'vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const passwords = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const errors = ref(null)


const changePassword = async () => {
  try {
    await userStore.changePassword(passwords.value)
    toast.success('Password has been changed.')
    router.back()
  } catch (error) {
    if (error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('Password has not been changed due to validation errors!')
    } else {
      toast.error('Password has not been changed due to unknown server error!')
    }
  }
}
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
