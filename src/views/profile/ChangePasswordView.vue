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

<script>
import axios from 'axios';
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref, defineEmits } from 'vue'
export default {
  data() {
    return {
      profile: {
        oldPassword:'',
        newPassword:'',
        confirmPassword:''
      },
      breadCrumb: [
        {
          title: 'Account Details',
          disabled: false,
          href: 'profile',
        },
        {
          title: 'Change Password',
          disabled: true,
          href: 'changePassword',
        },
        {
          title: 'Change Profile Details',
          disabled: false,
          href: 'changeDetails',
        },
      ],
    };
  },
  methods: {
    async changePassword() {
      try {
        let token = localStorage.getItem('token')

        const response = await axios.patch(`users/1/password`, {
          old_password: this.oldPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword,
        },{   
         headers: {
        Authorization: `Bearer ${token}`,
    },});
  }catch(error){

  }
},
}
}

const toast = useToast()
const router = useRouter()

const passwords = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const errors = ref(null)

const emit = defineEmits(['changedPassword'])

const changePassword = async () => {
  try {
    await userStore.changePassword(passwords.value)
    toast.success('Password has been changed.')
    emit('changedPassword')
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
