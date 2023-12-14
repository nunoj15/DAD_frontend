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
    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="profile.oldPassword" label="Old Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="profile.newPassword" label="New Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field :type="visible ? 'text' : 'password'" v-model="profile.newPasswordConfirmation" label="Confirm the Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn @click="changePassword" color="green">Change</v-btn>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
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
        const response = await axios.patch(`users/1/password`, {
          old_password: this.oldPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword,
        });

        console.log(response.data.message);
      } catch (error) {
        console.error(error.response.data.message);
      }
    },
  },
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
