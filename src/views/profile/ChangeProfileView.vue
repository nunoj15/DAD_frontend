<template>
  <v-container>
    <v-form>
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
          <v-text-field v-model="profile.name" label="Nome"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.email" label="E-mail"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-file-input
              :rules="rules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Pick a photo"
              prepend-icon="mdi-camera"
              label="Avatar"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.confirmationCode" label="Confirmation Code"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn @click="saveProfile" color="green">Salvar</v-btn>
        </v-col>
      </v-row>

    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        name: '',
        email: '',
        photo: '',
        confirmationCode: ''
      },
      breadCrumb: [
        {
          title: 'Account Details',
          disabled: false,
          href: 'profile',
        },
        {
          title: 'Change Password',
          disabled: false,
          href: 'changePassword',
        },
        {
          title: 'Change Profile Details',
          disabled: true,
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
