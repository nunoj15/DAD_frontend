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
        <v-text-field v-model="profile.oldPassword" label="Old Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field v-model="profile.newPassword" label="New Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field v-model="profile.newPasswordConfirmation" label="Confirm the Password" ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn @click="saveProfile" color="green">Salvar</v-btn>
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
        newPasswordConfirmation:''
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
    saveProfile() {
      console.log('Perfil salvo:', this.profile);
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
